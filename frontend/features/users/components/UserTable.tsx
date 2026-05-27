import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { AdminUser } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.table;

interface UserTableProps {
  users: AdminUser[];
  onChangeStatus: (id: string, status: 'active' | 'inactive') => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: strings.statusActive,
  inactive: strings.statusInactive,
  deleted: strings.statusDeleted,
};

const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  deleted: 'bg-red-100 text-red-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function UserTable({ users, onChangeStatus }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left text-foreground/70">
          <tr>
            <th className="px-4 py-3 font-medium">{strings.colName}</th>
            <th className="px-4 py-3 font-medium">{strings.colEmail}</th>
            <th className="px-4 py-3 font-medium">{strings.colStatus}</th>
            <th className="px-4 py-3 font-medium">{strings.colCreated}</th>
            <th className="px-4 py-3 font-medium">{strings.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
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
                      onChangeStatus(
                        user.id,
                        user.accountStatus === 'active' ? 'inactive' : 'active',
                      )
                    }
                    className={`text-sm font-medium transition-colors ${
                      user.accountStatus === 'active'
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {user.accountStatus === 'active'
                      ? strings.deactivateButton
                      : strings.activateButton}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
