export const todayIso = () => new Date().toISOString().slice(0, 10);

export const getMonday = (date = new Date()) => {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayOffset = (copy.getUTCDay() + 6) % 7;
  copy.setUTCDate(copy.getUTCDate() - dayOffset);
  return copy;
};

export const getSunday = (date = new Date()) => {
  const monday = getMonday(date);
  monday.setUTCDate(monday.getUTCDate() + 6);
  return monday;
};

export const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export const currentWeekRange = () => ({
  weekStart: toIsoDate(getMonday()),
  weekEnd: toIsoDate(getSunday())
});

export const formatDate = (isoDate: string | null | undefined) => {
  if (!isoDate) return 'Not set';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${isoDate.slice(0, 10)}T00:00:00`));
};

export const formatWeekRange = (weekStart: string, weekEnd?: string) => {
  if (!weekEnd) return formatDate(weekStart);
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};
