import type { Fine, Player } from "../types";

export function exportFinesCsv(fines: Fine[]) {
  const rows = [
    ["Giocatore", "Motivo", "Importo", "Data", "Stato"],
    ...fines.map((fine) => [
      fine.playerName ?? "—",
      fine.reason,
      fine.amount.toFixed(2).replace(".", ","),
      fine.date,
      fine.status === "paid" ? "Saldata" : "Da saldare",
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "multe-squadra.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export function importFinesCsv(file: File, players: Player[]): Promise<Fine[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? "").replace(/^\uFEFF/, "");
      const lines = text.split(/\r?\n/).filter(Boolean);

      if (lines.length < 2) {
        resolve([]);
        return;
      }

      const imported: Fine[] = [];

      for (const line of lines.slice(1)) {
        const cells = line.split(";").map((value) => value.replace(/^"|"$/g, "").trim());

        const [playerName, reason, amountRaw, date, statusRaw] = cells;

        const player = players.find((p) => p.name.toLowerCase() === playerName?.toLowerCase());

        const amount = Number(amountRaw?.replace(",", "."));

        if (!player || !reason || !amount || !date) {
          continue;
        }

        imported.push({
          playerName: player.name,
          reason,
          amount,
          date,
          status: statusRaw?.toLowerCase().includes("saldata") ? "paid" : "pending",
        });
      }

      resolve(imported);
    };

    reader.readAsText(file);
  });
}
