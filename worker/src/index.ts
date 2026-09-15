type Env = {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_FILE: string;
  GITHUB_BOT_NAME: string;
  GITHUB_BOT_EMAIL: string;
  ALLOWED_ORIGIN: string;
  ADMIN_PASSWORD: string;
};

const SESSION_TTL_SECONDS = 8 * 60 * 60;

type GitHubContent = {
  sha: string;
  content?: string;
};

type AppData = {
  players: unknown[];
  fines: unknown[];
  foodDuties: unknown[];
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true }, 200, env);
    }

    if (request.method === "POST" && url.pathname === "/api/auth") {
      return login(request, env);
    }

    if (request.method !== "PUT" || url.pathname !== "/api/data") {
      return json({ error: "Not found" }, 404, env);
    }

    try {
      await verifySession(request, env);

      const current = await getCurrentFile(env);
      const data = await readData(request, current);
      const content = encodeBase64(JSON.stringify(data, null, 2) + "\n");
      const githubResponse = await fetch(
        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.GITHUB_FILE}`,
        {
          method: "PUT",
          headers: githubHeaders(env),
          body: JSON.stringify({
            message: "Update team data",
            content,
            sha: current.sha,
            branch: env.GITHUB_BRANCH,
            committer: {
              name: env.GITHUB_BOT_NAME,
              email: env.GITHUB_BOT_EMAIL,
            },
            author: {
              name: env.GITHUB_BOT_NAME,
              email: env.GITHUB_BOT_EMAIL,
            },
          }),
        },
      );

      if (!githubResponse.ok) {
        const details = await githubResponse.text();
        console.error("GitHub update failed", githubResponse.status, details);
        return json(
          { error: "GitHub ha rifiutato il salvataggio: verifica il token GITHUB_TOKEN" },
          502,
          env,
        );
      }

      return json({ ok: true }, 200, env);
    } catch (error) {
      if (error instanceof AuthError) {
        return json({ error: error.message }, 401, env);
      }

      console.error(error);
      return json({ error: "Invalid request" }, 400, env);
    }
  },
};

async function login(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as { password?: unknown };

    if (typeof body.password !== "string" || body.password !== env.ADMIN_PASSWORD) {
      throw new AuthError("Password amministratore non valida");
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const token = `${expiresAt}.${await sign(String(expiresAt), env.ADMIN_PASSWORD)}`;

    return json({ token, expiresAt }, 200, env);
  } catch (error) {
    if (error instanceof AuthError) {
      return json({ error: error.message }, 401, env);
    }

    return json({ error: "Invalid request" }, 400, env);
  }
}

async function verifySession(request: Request, env: Env) {
  const authorization = request.headers.get("Authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) {
    throw new AuthError("Sessione amministratore scaduta");
  }

  const expected = await sign(expiresAt, env.ADMIN_PASSWORD);

  if (signature !== expected) {
    throw new AuthError("Password amministratore non valida");
  }
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return toBase64Url(new Uint8Array(signature));
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function readData(request: Request, current: GitHubContent): Promise<AppData> {
  const data = (await request.json()) as Partial<AppData>;

  if (!Array.isArray(data.players) || !Array.isArray(data.fines)) {
    throw new Error("Invalid data shape");
  }

  const currentData = decodeCurrentData(current.content);

  return {
    players: data.players,
    fines: data.fines,
    foodDuties: Array.isArray(data.foodDuties) ? data.foodDuties : currentData.foodDuties,
  };
}

function decodeCurrentData(content?: string): AppData {
  if (!content) {
    return { players: [], fines: [], foodDuties: [] };
  }

  try {
    const decoded = JSON.parse(atob(content.replaceAll("\n", ""))) as Partial<AppData>;

    return {
      players: Array.isArray(decoded.players) ? decoded.players : [],
      fines: Array.isArray(decoded.fines) ? decoded.fines : [],
      foodDuties: Array.isArray(decoded.foodDuties) ? decoded.foodDuties : [],
    };
  } catch {
    throw new Error("Unable to parse current GitHub file");
  }
}

async function getCurrentFile(env: Env): Promise<GitHubContent> {
  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.GITHUB_FILE}?ref=${env.GITHUB_BRANCH}`,
    {
      headers: githubHeaders(env),
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to read GitHub file: ${response.status}`);
  }

  return response.json<GitHubContent>();
}

function githubHeaders(env: Env): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "team-fines-worker",
    "Content-Type": "application/json",
  };
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function corsHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Content-Type": "application/json",
  };
}

function json(value: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: corsHeaders(env),
  });
}

class AuthError extends Error {}
