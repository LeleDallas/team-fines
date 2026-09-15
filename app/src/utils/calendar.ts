import type { Player } from "../types";

export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  birthdays: Player[];
  foodDuty: Player[];
};

export function getTuesdayFoodDuty<T extends { name: string }>(players: T[], date: Date): T[] {
  if (players.length === 0 || date.getDay() !== 2) {
    return [];
  }

  const count = Math.floor((date.getDate() - 1) / 7) % 2 === 0 ? 2 : 1;
  const startIndex = (date.getFullYear() * 12 + date.getMonth() + Math.floor((date.getDate() - 1) / 7)) % players.length;

  return Array.from({ length: count }, (_, index) => players[(startIndex + index) % players.length]);
}

export function getCalendarMonthDays(players: Player[], month: Date): CalendarDay[] {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - firstWeekday);

  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    const birthdays = players.filter((player) => isBirthdayOnDate(player, date));
    const foodDuty = getTuesdayFoodDuty(players, date);

    days.push({
      date,
      inMonth: date.getMonth() === monthStart.getMonth(),
      birthdays,
      foodDuty,
    });
  }

  return days;
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
