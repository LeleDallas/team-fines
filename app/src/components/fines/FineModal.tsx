import { useState } from "react";
import type { Fine, Player } from "../../types";
import { Modal } from "../ui/Modal";

type Props = {
  players: Player[];
  fine: Fine | null;
  onClose: () => void;
  onSave: (fine: Fine) => void;
};

export function FineModal({ players, fine, onClose, onSave }: Props) {
  const [playerName, setPlayerName] = useState(fine?.playerName ?? players[0]?.name ?? "");

  const [reason, setReason] = useState(fine?.reason ?? "");

  const [amount, setAmount] = useState(String(fine?.amount ?? 10));

  const [date, setDate] = useState(fine?.date ?? new Date().toISOString().slice(0, 10));

  const [status, setStatus] = useState<Fine["status"]>(fine?.status ?? "pending");

  const [notes, setNotes] = useState(fine?.notes ?? "");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const numeric = Number(amount.replace(",", "."));

    if (!playerName || !reason.trim() || !numeric || numeric <= 0) {
      return;
    }

    onSave({
      playerName,
      reason: reason.trim(),
      amount: numeric,
      date,
      status,
      notes,
    });
  };

  return (
    <Modal title={fine ? "Modifica multa" : "Nuova multa"} onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Giocatore/Allenatore
          <select value={playerName} onChange={(event) => setPlayerName(event.target.value)}>
            {players.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name} · {player.role}
              </option>
            ))}
          </select>
        </label>

        <div className="form-row">
          <label>
            Motivo
            <input
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Es. Ritardo allenamento"
            />
          </label>

          <label>
            Importo (€)
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Data
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <label>
            Stato
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Fine["status"])}
            >
              <option value="pending">Da saldare</option>

              <option value="paid">Saldata</option>
            </select>
          </label>
        </div>

        <label>
          Note
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Note opzionali..."
            rows={3}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annulla
          </button>

          <button className="primary-btn" type="submit">
            {fine ? "Salva modifiche" : "Aggiungi multa"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
