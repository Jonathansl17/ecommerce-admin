import { useState } from 'react';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { UserRow } from '@/features/users/components/UserRow';
import { ConfirmDeactivateUserModal } from '@/features/users/components/ConfirmDeactivateUserModal';
import type { AdminUser, UserTableProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.table;

export function UserTable({ users = [], onChangeStatus }: UserTableProps) {
  const [pendingDeactivation, setPendingDeactivation] = useState<AdminUser | null>(null);

  if (users.length === 0) {
    return <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>;
  }

  const handleChangeStatus = (id: string, status: 'active' | 'inactive') => {
    if (status === 'inactive') {
      const user = users.find((u) => u.id === id);
      if (user) {
        setPendingDeactivation(user);
        return;
      }
    }
    onChangeStatus(id, status);
  };

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
            <UserRow key={user.id} user={user} onChangeStatus={handleChangeStatus} />
          ))}
        </tbody>
      </table>

      {pendingDeactivation && (
        <ConfirmDeactivateUserModal
          userName={pendingDeactivation.fullName}
          onClose={() => setPendingDeactivation(null)}
          onConfirm={() => onChangeStatus(pendingDeactivation.id, 'inactive')}
        />
      )}
    </div>
  );
}
