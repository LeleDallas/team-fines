import type { Fine, Player } from "../types";

export type AppData = {
  players: Player[];
  fines: Fine[];
};

const API_URL = "https://NAME.workers.dev";

export async function fetchData(): Promise<AppData> {
  const response = await fetch(`${API_URL}/api/data`);

  if (!response.ok) {
    throw new Error("Impossibile caricare i dati");
  }

  return response.json();
}

export async function uploadData(
  data: AppData,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/data`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Impossibile salvare i dati");
  }
}