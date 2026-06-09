'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUsers } from '@/features/users/shared/users.api';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { USERS_PAGE_SIZE } from '@/features/users/constants/api';
import type { AdminUser, UseUsersParams } from '@/features/users/types/users.types';

const errorMsg = USERS_MESSAGES.errors.fetchError;

export function useUsersList({ search, field, offset, sortBy, sortOrder }: UseUsersParams) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchUsers({
      search: search || undefined,
      field: search ? field : undefined,
      limit: USERS_PAGE_SIZE,
      offset,
      sortBy,
      sortOrder,
    })
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : (data.users ?? []));
        setTotal(Array.isArray(data) ? data.length : (data.total ?? 0));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(errorMsg);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, field, offset, sortBy, sortOrder]);

  const replaceUser = useCallback((updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }, []);

  return { users, total, loading, error, replaceUser };
}
