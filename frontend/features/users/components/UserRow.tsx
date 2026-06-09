import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { STATUS_CLASSES, STATUS_LABELS } from '@/features/users/constants/users.constants';
import type { UserRowProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.table;

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
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[user.accountStatus] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {STATUS_LABELS[user.accountStatus] ?? user.accountStatus}
        </span>
      </td>
      <td className="px-4 py-3 text-foreground/60">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3">
        {user.accountStatus !== 'deleted' && (
          <button
            onClick={() =>
              onChangeStatus(user.id, user.accountStatus === 'active' ? 'inactive' : 'active')
            }
            className={`text-sm font-medium transition-colors ${
              user.accountStatus === 'active'
                ? 'text-red-600 hover:text-red-700'
                : 'text-green-600 hover:text-green-700'
            }`}
          >
            {user.accountStatus === 'active' ? strings.deactivateButton : strings.activateButton}
          </button>
        )}
      </td>
    </tr>
  );
}
