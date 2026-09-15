import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

import type { Fine, Player } from "../../types";
import { currency, formatDate, initials } from "../../utils/formatting";

type Props = {
  fines: Fine[];
  playerMap: Map<string, Player>;
  onToggle: (fine: Fine) => void;
  onEdit: (fine: Fine) => void;
  onDelete: (fine: Fine) => void;
  compact?: boolean;
};

export function FineTable({
  fines,
  playerMap,
  onToggle,
  onEdit,
  onDelete,
  compact = false,
}: Props) {
  if (fines.length === 0) {
    return (
      <div className={`fine-table-wrap ${compact ? "compact" : ""}`}>
        <div className="empty">Nessuna multa trovata.</div>
      </div>
    );
  }

  return (
    <div className={`fine-table-wrap ${compact ? "compact" : ""}`}>
      <table className="fine-table">
        <thead>
          <tr>
            <th>Giocatore/Allenatore</th>
            <th>Motivo</th>
            <th>Data</th>
            <th>Importo</th>
            <th>Stato</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {fines.map((fine) => {
            const player = playerMap.get(fine.playerName);

            return (
              <tr key={`${fine.playerName}-${fine.reason}-${fine.date}`}>
                <td>
                  <div className="player-cell">
                    <div className="avatar avatar-xs">{initials(player?.name ?? "?")}</div>

                    <strong>{player?.name ?? "Giocatore rimosso"}</strong>
                  </div>
                </td>

                <td>{fine.reason}</td>

                <td>{formatDate(fine.date)}</td>

                <td>
                  <strong>{currency.format(fine.amount)}</strong>
                </td>

                <td>
                  <button className={`status ${fine.status}`} onClick={() => onToggle(fine)}>
                    {fine.status === "paid" ? (
                      <>
                        <CheckCircle2 size={14} />
                        Saldata
                      </>
                    ) : (
                      "Da saldare"
                    )}
                  </button>
                </td>

                <td>
                  <div className="row-actions">
                    <button title="Modifica" onClick={() => onEdit(fine)}>
                      <Pencil size={15} />
                    </button>

                    <button title="Elimina" onClick={() => onDelete(fine)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
