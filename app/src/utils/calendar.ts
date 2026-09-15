import type { FoodDuty, Player } from "../types";

export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  birthdays: Player[];
  foodDuty: Player[];
};

export function getTuesdayFoodDuty<T extends { name: string }>(
  players: T[],
  foodDuties: FoodDuty[],
  date: Date,
): T[] {
  if (date.getDay() !== 2) {
    return [];
  }

  const dateKey = formatDateKey(date);
  const duty = foodDuties.find((item) => item.date === dateKey);

  if (!duty) {
    return [];
  }

  return duty.playerNames
    .map((name) => players.find((player) => player.name === name))
    .filter((player): player is T => Boolean(player));
}

export function getCalendarMonthDays(players: Player[], foodDuties: FoodDuty[], month: Date): CalendarDay[] {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - firstWeekday);

  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    const birthdays = players.filter((player) => isBirthdayOnDate(player, date));
    const foodDuty = getTuesdayFoodDuty(players, foodDuties, date);

    days.push({
      date,
      inMonth: date.getMonth() === monthStart.getMonth(),
      birthdays,
      foodDuty,
    });
  }

  return days;
}

export function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isBirthdayOnDate(player: Player, date: Date) {
  if (!player.birthday || player.birthday.startsWith("0001-")) {
    return false;
  }

  const birthday = new Date(`${player.birthday}T12:00:00`);

  if (Number.isNaN(birthday.getTime())) {
    return false;
  }

  return birthday.getMonth() === date.getMonth() && birthday.getDate() === date.getDate();
}
