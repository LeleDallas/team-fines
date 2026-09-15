import { ChevronRight } from "lucide-react";

import type { Player } from "../../types";
import { daysUntil } from "../../utils/dates";
import { initials } from "../../utils/formatting";

type Birthday = {
  player: Player;
  date: Date;
};

type Props = {
  birthdays: Birthday[];
  onPlayers: () => void;
};

export function BirthdayList({ birthdays, onPlayers }: Props) {
  return (
    <section className="panel birthdays-panel">
      <div className="panel-head">
        <div>
          <h2>Compleanni 🎂</h2>
          <p>I prossimi della squadra</p>
        </div>

        <button className="link-btn" onClick={onPlayers}>
          Rosa
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="birthday-list">
        {birthdays.length === 0 ? (
          <div className="empty">Nessun compleanno disponibile.</div>
        ) : (
          birthdays.map(({ player, date }) => (
            <div className="birthday-row" key={player.name}>
              <div className="avatar">{initials(player.name)}</div>

              <div className="person">
                <strong>{player.name}</strong>
                <span>{player.role}</span>
              </div>

              <div className="birthday-date">
                <strong>
                  {date.toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                  })}
                </strong>

                <span>{daysUntil(date)} giorni</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
