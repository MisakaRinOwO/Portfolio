const utcDateFormatters = {
  short: new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }),
  long: new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }),
};

export function formatShortDate(date: Date) {
  return utcDateFormatters.short.format(date).toUpperCase();
}

export function formatLongDate(date: Date) {
  return utcDateFormatters.long.format(date);
}

export function formatLaunchTime(time: string) {
  return `${time} UTC`;
}

export function formatReadingTime(minutes: number) {
  return `${Math.max(1, minutes)} min read`;
}

export function toUtcDateInput(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
