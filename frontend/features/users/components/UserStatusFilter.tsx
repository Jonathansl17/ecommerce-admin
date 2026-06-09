import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserStatusFilterProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.filter;

export function UserStatusFilter({ status, statusOptions, onStatusChange }: UserStatusFilterProps) {
  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as UserStatusFilterProps['status'])}
      className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={strings.label}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
