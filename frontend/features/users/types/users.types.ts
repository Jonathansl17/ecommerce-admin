export type AccountStatus = 'active' | 'inactive' | 'deleted';
export type AccountStatusFilter = 'all' | 'active' | 'inactive';
export type SearchField = 'name' | 'email';
export type SortField = 'fullName' | 'createdAt' | 'accountStatus' | 'email';
export type SortOrder = 'ASC' | 'DESC';

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
  total: number;
  loading: boolean;
  error: string | null;
  statusError: string | null;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
}

export interface SortOption {
  label: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UsersQuery {
  search: string;
  field: SearchField;
  status: AccountStatusFilter;
  sortIndex: number;
  offset: number;
}

export interface UseUsersParams {
  search: string;
  field: SearchField;
  status: AccountStatusFilter;
  offset: number;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UserRowProps {
  user: AdminUser;
  onChangeStatus: (id: string, status: 'active' | 'inactive') => void;
}

export interface UserTableProps {
  users: AdminUser[];
  onChangeStatus: (id: string, status: 'active' | 'inactive') => void;
}

export interface UserSearchBarProps {
  field: SearchField;
  inputValue: string;
  onFieldChange: (field: SearchField) => void;
  onInputChange: (value: string) => void;
  onSearch: () => void;
}

export interface UserSortSelectProps {
  sortIndex: number;
  sortOptions: SortOption[];
  onSortChange: (index: number) => void;
}

export interface StatusFilterOption {
  label: string;
  value: AccountStatusFilter;
}

export interface UserStatusFilterProps {
  status: AccountStatusFilter;
  statusOptions: StatusFilterOption[];
  onStatusChange: (status: AccountStatusFilter) => void;
}

export interface UserPaginationProps {
  offset: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}

export interface ConfirmDeactivateUserModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}
