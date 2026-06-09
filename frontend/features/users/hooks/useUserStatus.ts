'use client';

import { useState, useCallback } from 'react';
import { changeUserStatus } from '@/features/users/shared/users.api';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { AdminUser, AccountStatus } from '@/features/users/types/users.types';

const errorMsg = USERS_MESSAGES.errors.statusError;

export function useUserStatus(onSuccess: (updated: AdminUser) => void) {
  const [statusError, setStatusError] = useState<string | null>(null);

  const updateStatus = useCallback(async (id: string, accountStatus: AccountStatus) => {
    setStatusError(null);
    try {
      const updated = await changeUserStatus(id, accountStatus);
      onSuccess(updated);
    } catch {
      setStatusError(errorMsg);
    }
  }, [onSuccess]);

  return { statusError, updateStatus };
}
