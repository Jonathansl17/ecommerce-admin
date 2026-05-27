'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, changeUserStatus } from '@/features/users/shared/users.api';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { AdminUser, AccountStatus, UsersState } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.errors;

export function useUsers(search: string) {
  const [state, setState] = useState<UsersState>({
    users: [],
    loading: true,
    error: null,
    statusError: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const users = await fetchUsers(search || undefined);
      setState((s) => ({ ...s, users, loading: false }));
    } catch {
      setState((s) => ({ ...s, loading: false, error: strings.fetchError }));
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id: string, accountStatus: AccountStatus) => {
    setState((s) => ({ ...s, statusError: null }));
    try {
      const updated = await changeUserStatus(id, accountStatus);
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === updated.id ? updated : u)),
      }));
    } catch {
      setState((s) => ({ ...s, statusError: strings.statusError }));
    }
  }, []);

  return { ...state, updateStatus, reload: load };
}
