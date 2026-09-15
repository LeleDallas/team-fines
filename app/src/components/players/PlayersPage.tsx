import { Plus } from "lucide-react";

import type { Fine, Player } from "../../types";

import { PlayerCard } from "./PlayerCard";

type Props = {
  players: Player[];
  fines: Fine[];
  onAdd: () => void;
};

export function PlayersPage({ players, fines, onAdd }: Props) {
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">GESTIONE SQUADRA</div>

          <h1>Rosa</h1>

          <p>Gestisci i componenti della squadra e le loro date di compleanno.</p>
        </div>

        <button className="primary-btn" onClick={onAdd}>
          <Plus size={18} />
          Aggiungi giocatore
        </button>
      </section>

      <section className="players-grid">
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} fines={fines} />
        ))}
      </section>
    </>
  );
}
