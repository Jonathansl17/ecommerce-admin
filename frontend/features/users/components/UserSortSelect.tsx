import { Select } from '@/components/ui/Select';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserSortSelectProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.sort;

export function UserSortSelect({ sortIndex, sortOptions, onSortChange }: UserSortSelectProps) {
  return (
    <Select
      value={sortIndex}
      onChange={(e) => onSortChange(Number(e.target.value))}
      className="ml-auto"
      aria-label={strings.label}
    >
      {sortOptions.map((opt, i) => (
        <option key={i} value={i}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
