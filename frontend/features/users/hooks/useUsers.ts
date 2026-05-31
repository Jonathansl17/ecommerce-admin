'use client';

import { useUsersList } from './useUsersList';
import { useUserStatus } from './useUserStatus';
import type { UseUsersParams } from '@/features/users/types/users.types';

export function useUsers(params: UseUsersParams) {
  const { users, total, loading, error, replaceUser } = useUsersList(params);
  const { statusError, updateStatus } = useUserStatus(replaceUser);

  return { users, total, loading, error, statusError, updateStatus };
}
