import { useMemo, useState } from "react";

import type { Player } from "../../types";
import type { FoodDuty } from "../../types";
import { getCalendarMonthDays } from "../../utils/calendar";
import { FoodDutyForm } from "./FoodDutyForm";

type Props = {
  players: Player[];
  foodDuties: FoodDuty[];
  isAdmin: boolean;
  onAddFoodDuty: (duty: FoodDuty) => void;
  onRemoveFoodDuty: (date: string) => void;
};

export function CalendarPage({ players, foodDuties, isAdmin, onAddFoodDuty, onRemoveFoodDuty }: Props) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const days = useMemo(() => getCalendarMonthDays(players, foodDuties, month), [players, foodDuties, month]);

  const monthLabel = month.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();

  const compactNames = (names: string[]) => {
    if (names.length <= 2) {
      return names.join(", ");
    }

    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  };

  return (
    <section className="calendar-page panel">
      <div className="panel-head">
        <div>
          <h2>Calendario</h2>
          <p>Compleanni e portata del cibo del martedì</p>
        </div>

        <div className="calendar-nav">
          <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            ‹
          </button>
          <strong>{monthLabel}</strong>
          <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            ›
          </button>
        </div>
      </div>

      {isAdmin && (
        <FoodDutyForm
          players={players}
          foodDuties={foodDuties}
          onAdd={onAddFoodDuty}
          onRemove={onRemoveFoodDuty}
        />
      )}

      <div className="calendar-legend">
        <span>
          <i className="legend-dot birthday-dot" />
          Compleanno
        </span>
        <span>
          <i className="legend-dot duty-dot" />
          Da mangiare
        </span>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const isToday =
            day.date.getDate() === today.getDate() &&
            day.date.getMonth() === today.getMonth() &&
            day.date.getFullYear() === today.getFullYear();

          return (
            <div
              key={`${day.date.toISOString()}-${index}`}
              className={`calendar-day ${day.inMonth ? "" : "muted"} ${isToday ? "today" : ""}`}
            >
              <div className="calendar-day-header">
                <span>{day.date.getDate()}</span>
                {day.foodDuty.length > 0 && <span className="food-pill">{day.foodDuty.length}</span>}
              </div>

              {day.foodDuty.length > 0 && (
                <div className="calendar-event duty-event">
                  <strong>Da mangiare</strong>
                  <span>{compactNames(day.foodDuty.map((person) => person.name))}</span>
                </div>
              )}

              {day.birthdays.length > 0 && (
                <div className="calendar-event birthday-event">
                  <strong>Compleanno</strong>
                  <span>{compactNames(day.birthdays.map((person) => person.name))}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const weekdays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
