import { useState } from "react";
import type { Fine, Player } from "../../types";
import { Modal } from "../ui/Modal";

const regulationOptions = [
  { id: "divisa-gare", label: "Divisa non rispettata (gare ufficiali)", reason: "Divisa non rispettata", amount: 10 },
  { id: "divisa-allenamenti", label: "Divisa non rispettata (allenamenti)", reason: "Divisa non rispettata", amount: 5 },
  { id: "ritardo-partite", label: "Ritardo partite", reason: "Ritardo partite", amount: 25 },
  { id: "ritardo-allenamenti", label: "Ritardo allenamenti", reason: "Ritardo allenamenti", amount: 15 },
  { id: "assenza-allenamenti", label: "Assenza Martedì", reason: "Assenza Martedì", amount: 5 },
  { id: "ammonizione", label: "Ammonizione", reason: "Ammonizione", amount: 25 },
  { id: "espulsione", label: "Espulsione", reason: "Espulsione", amount: 50 },
  { id: "fumare-area-tecnica", label: "Fumo in area tecnica", reason: "Fumo in area tecnica", amount: 5 },
  { id: "telefono-spogliatoio", label: "Uso del cellulare in spogliatoio", reason: "Uso del cellulare in spogliatoio", amount: 15 },
] as const;

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

  const [presetId, setPresetId] = useState(() => {
    if (!fine) {
      return "";
    }

    const match = regulationOptions.find(
      (option) => option.reason === fine.reason || option.label === fine.reason,
    );

    return match?.id ?? "";
  });

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setPresetId(selectedId);

    if (!selectedId) {
      return;
    }

    const selectedOption = regulationOptions.find((option) => option.id === selectedId);

    if (!selectedOption) {
      return;
    }

    setReason(selectedOption.reason);
    setAmount(String(selectedOption.amount));
  };

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
            Causa del regolamento
            <select value={presetId} onChange={handlePresetChange}>
              <option value=""> Nessuna causa predefinita </option>

              {regulationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} · € {option.amount.toFixed(2).replace(".", ",")}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Motivo
            <input
              required
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setPresetId("");
              }}
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
              onChange={(event) => {
                setAmount(event.target.value);
                setPresetId("");
              }}
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
