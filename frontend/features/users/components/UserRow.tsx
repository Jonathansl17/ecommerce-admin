import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { STATUS_LABELS } from '@/features/users/constants/users.constants';
import type { UserRowProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.table;

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'danger'> = {
  active: 'success',
  inactive: 'neutral',
  deleted: 'danger',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function UserRow({ user, onChangeStatus }: UserRowProps) {
  return (
    <tr className="hover:bg-foreground/5 transition-colors">
      <td className="px-4 py-3 font-medium text-foreground">{user.fullName}</td>
      <td className="px-4 py-3 text-foreground/70">{user.email}</td>
      <td className="px-4 py-3">
        <Badge variant={STATUS_VARIANTS[user.accountStatus] ?? 'neutral'}>
          {STATUS_LABELS[user.accountStatus] ?? user.accountStatus}
        </Badge>
      </td>
      <td className="px-4 py-3 text-foreground/60">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3">
        {user.accountStatus !== 'deleted' && (
          <Button
            variant={user.accountStatus === 'active' ? 'destructive' : 'success'}
            size="sm"
            onClick={() =>
              onChangeStatus(user.id, user.accountStatus === 'active' ? 'inactive' : 'active')
            }
          >
            {user.accountStatus === 'active' ? strings.deactivateButton : strings.activateButton}
          </Button>
        )}
      </td>
    </tr>
  );
}
