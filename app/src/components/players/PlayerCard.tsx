import { Cake, WalletCards } from "lucide-react";

import type { Fine, Player } from "../../types";

import { currency, initials } from "../../utils/formatting";

type Props = {
  player: Player;
  fines: Fine[];
};

export function PlayerCard({ player, fines }: Props) {
  const owed = fines
    .filter((fine) => fine.playerName === player.name && fine.status === "pending")
    .reduce((total, fine) => total + fine.amount, 0);

  const hasPendingFines = owed > 0;

  return (
    <article className={`player-card${hasPendingFines ? " player-card--pending" : ""}`}>
      <div className="player-card-top">
        <div className="big-avatar">{initials(player.name)}</div>
      </div>

      <h3>{player.name}</h3>

      <p>{player.role}</p>

      <div className="player-meta">
        <span className="player-meta-item">
          <Cake size={14} />

          {new Date(`${player.birthday}T12:00:00`).toLocaleDateString("it-IT")}
        </span>

        <span className={`player-meta-item${hasPendingFines ? " player-meta-item--amount" : ""}`}>
          <WalletCards size={14} />
          {currency.format(owed)} da saldare
        </span>
      </div>
    </article>
  );
}
