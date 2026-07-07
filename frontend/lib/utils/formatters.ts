export const truncate = (value: string | null | undefined, length = 120) => {
  if (!value) return 'No details provided';
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
};

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const formatHours = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '0h';
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })}h`;
};

export const timeAgo = (isoDate: string | null | undefined) => {
  if (!isoDate) return 'not submitted';
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffSeconds = Math.max(1, Math.floor((now - then) / 1000));

  if (diffSeconds < 60) return 'just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};
