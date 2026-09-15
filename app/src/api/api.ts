import type { Fine, FoodDuty, Player } from "../types";

export type AppData = {
  players: Player[];
  fines: Fine[];
  foodDuties: FoodDuty[];
};

const DATA_URL = import.meta.env.VITE_DATA_URL || `${import.meta.env.BASE_URL}data.json`;
const API_URL = import.meta.env.VITE_API_URL || "";

export async function loginAdmin(password: string): Promise<string> {
  if (!API_URL) {
    throw new Error("URL del Worker non configurato");
  }

  const response = await fetch(`${API_URL}api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error(response.status === 401 ? "Password amministratore non valida" : "Impossibile effettuare il login");
  }

  const result = (await response.json()) as { token?: string };

  if (!result.token) {
    throw new Error("Risposta di login non valida");
  }

  return result.token;
}

export async function fetchData(): Promise<AppData> {
  const separator = DATA_URL.includes("?") ? "&" : "?";
  const response = await fetch(`${DATA_URL}${separator}v=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossibile caricare i dati");
  }

  const data = (await response.json()) as Partial<AppData>;

  return {
    players: data.players ?? [],
    fines: data.fines ?? [],
    foodDuties: data.foodDuties ?? [],
  };
}

export async function uploadData(
  data: AppData,
  adminToken = "",
): Promise<void> {
  if (!API_URL) {
    throw new Error("URL del Worker non configurato");
  }

  const response = await fetch(`${API_URL}api/data`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ ...data, foodDutiesChanged: true }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Password amministratore non valida");
    }

    throw new Error("Impossibile salvare i dati");
  }
}