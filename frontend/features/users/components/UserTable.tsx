import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { UserRow } from '@/features/users/components/UserRow';
import type { UserTableProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.table;

export function UserTable({ users = [], onChangeStatus }: UserTableProps) {
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
            <UserRow key={user.id} user={user} onChangeStatus={onChangeStatus} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
