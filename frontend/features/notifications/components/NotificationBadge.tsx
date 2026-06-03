import type { BadgeCountProps } from '../types/notifications.types';
import { MAX_BADGE_COUNT } from '../constants/notifications.constants';

export function NotificationBadge({ count }: BadgeCountProps) {
  if (count <= 0) return null;
  const label = count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);
  return (
    <span
      className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white"
      aria-label={`${count} notificaciones sin leer`}
    >
      {label}
    </span>
  );
}
