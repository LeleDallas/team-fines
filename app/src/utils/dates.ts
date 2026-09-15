export function getUpcomingBirthdays<T extends { birthday: string }>(players: T[]) {
  return [...players]
    .map((player) => {
      const today = new Date();

      const birthday = new Date(`${today.getFullYear()}-${player.birthday.slice(5)}T12:00:00`);

      if (birthday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        birthday.setFullYear(today.getFullYear() + 1);
      }

      return {
        player,
        date: birthday,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);
}

export function daysUntil(date: Date) {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.max(0, Math.ceil((date.getTime() - today.getTime()) / 86400000));
}
