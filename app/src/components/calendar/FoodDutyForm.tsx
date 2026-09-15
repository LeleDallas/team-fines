import { useState } from "react";
import type { FoodDuty, Player } from "../../types";

type Props = {
  players: Player[];
  foodDuties: FoodDuty[];
  onAdd: (duty: FoodDuty) => void;
  onRemove: (date: string) => void;
};

export function FoodDutyForm({ players, foodDuties, onAdd, onRemove }: Props) {
  const [date, setDate] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  const addDuty = (event: React.FormEvent) => {
    event.preventDefault();

    if (!date || selectedPlayers.length === 0) {
      setFormError("Scegli un martedì e almeno una persona.");
      return;
    }

    const weekday = new Date(`${date}T12:00:00`).getDay();

    if (weekday !== 2) {
      setFormError("La data deve essere un martedì.");
      return;
    }

    onAdd({ date, playerNames: selectedPlayers });
    setDate("");
    setSelectedPlayers([]);
    setFormError("");
  };

  const togglePlayer = (name: string) => {
    setSelectedPlayers((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  return (
    <div className="food-duty-manager">
      <div>
        <strong>Gestisci il cibo del martedì</strong>
        <span>Aggiungi le persone che devono portare da mangiare e salva le modifiche.</span>
      </div>

      <form className="food-duty-form" onSubmit={addDuty}>
        <label>
          Martedì
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </label>

        <div className="food-duty-players">
          {players.map((player) => (
            <label key={player.name} className="food-duty-player">
              <input
                type="checkbox"
                checked={selectedPlayers.includes(player.name)}
                onChange={() => togglePlayer(player.name)}
              />
              {player.name}
            </label>
          ))}
        </div>

        <button className="primary-btn" type="submit">
          Aggiungi turno
        </button>
      </form>

      {formError && <p className="form-error">{formError}</p>}

      {foodDuties.length > 0 && (
        <div className="food-duty-list">
          {foodDuties
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((duty) => (
              <div className="food-duty-row" key={duty.date}>
                <span>
                  <strong>{new Date(`${duty.date}T12:00:00`).toLocaleDateString("it-IT")}</strong>
                  {duty.playerNames.join(", ")}
                </span>
                <button className="link-btn" type="button" onClick={() => onRemove(duty.date)}>
                  Rimuovi
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}