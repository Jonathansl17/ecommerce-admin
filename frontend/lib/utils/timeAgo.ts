const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

export interface TimeAgoStrings {
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
}

export function timeAgo(isoString: string, strings: TimeAgoStrings): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMinutes < 1) return strings.justNow;
  if (diffHours < 1) return strings.minutesAgo(diffMinutes);
  if (diffDays < 1) return strings.hoursAgo(diffHours);
  return strings.daysAgo(diffDays);
}
