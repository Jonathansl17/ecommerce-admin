import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { USERS_API } from '@/features/users/constants/api';
import type { AdminUser, AccountStatus } from '@/features/users/types/users.types';

export async function fetchUsers(search?: string): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>(USERS_API.GET_ALL(search), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function changeUserStatus(id: string, accountStatus: AccountStatus): Promise<AdminUser> {
  return apiFetch<AdminUser>(USERS_API.CHANGE_STATUS(id), {
    method: 'PATCH',
    body: { accountStatus },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}
