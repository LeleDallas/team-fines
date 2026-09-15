export type Player = {
  name: string;
  birthday: string;
  role: string;
};

export type Fine = {
  playerName: string;
  reason: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
  notes?: string;
};

export type Page = "dashboard" | "fines" | "players" | "calendar" | "regolamento";
export type FineFilter = "all" | "pending" | "paid";
