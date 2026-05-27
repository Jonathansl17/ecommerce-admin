'use client';

import { useState, useRef } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { UserTable } from '@/features/users/components/UserTable';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { AccountStatus } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES;

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { users, loading, error, statusError, updateStatus } = useUsers(debouncedSearch);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const handleChangeStatus = (id: string, accountStatus: AccountStatus) => {
    updateStatus(id, accountStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        <p className="mt-1 text-sm text-foreground/60">{strings.page.subtitle}</p>
      </div>

      <div className="max-w-sm">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder={strings.search.placeholder}
          className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {statusError && (
        <p role="alert" className="text-sm text-red-500">
          {statusError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-foreground/60">Cargando usuarios...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : (
        <UserTable users={users} onChangeStatus={handleChangeStatus} />
      )}
    </div>
  );
}
