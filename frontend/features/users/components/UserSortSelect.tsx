import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserSortSelectProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.sort;

export function UserSortSelect({ sortIndex, sortOptions, onSortChange }: UserSortSelectProps) {
  return (
    <select
      value={sortIndex}
      onChange={(e) => onSortChange(Number(e.target.value))}
      className="ml-auto rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={strings.label}
    >
      {sortOptions.map((opt, i) => (
        <option key={i} value={i}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
