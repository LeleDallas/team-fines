import { useState } from "react";
import type { Player } from "../../types";
import { Modal } from "../ui/Modal";

type Props = {
  onClose: () => void;
  onSave: (player: Player) => void;
};

export function PlayerModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [role, setRole] = useState("Giocatore");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !birthday) {
      return;
    }

    onSave({
      name: name.trim(),
      birthday,
      role,
    });
  };

  return (
    <Modal title="Aggiungi giocatore" onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Nome e cognome
          <input
            autoFocus
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Es. Giovanni Verdi"
          />
        </label>

        <label>
          Ruolo
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Allenatore</option>
            <option>Portiere</option>
            <option>Difensore</option>
            <option>Centrocampista</option>
            <option>Attaccante</option>
            <option>Giocatore</option>
          </select>
        </label>

        <label>
          Data di nascita
          <input
            required
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annulla
          </button>

          <button className="primary-btn">Aggiungi giocatore</button>
        </div>
      </form>
    </Modal>
  );
}
