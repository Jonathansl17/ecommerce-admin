import { Select } from '@/components/ui/Select';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserStatusFilterProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.filter;

export function UserStatusFilter({ status, statusOptions, onStatusChange }: UserStatusFilterProps) {
  return (
    <Select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as UserStatusFilterProps['status'])}
      aria-label={strings.label}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
