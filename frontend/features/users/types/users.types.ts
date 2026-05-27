export type AccountStatus = 'active' | 'inactive' | 'deleted';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  statusError: string | null;
}
