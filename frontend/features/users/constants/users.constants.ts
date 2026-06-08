import { USERS_MESSAGES } from './messages';
import type { SearchField, SortOption, UsersQuery } from '@/features/users/types/users.types';

export const SORT_OPTIONS: SortOption[] = [
  { label: USERS_MESSAGES.sort.options.createdAtDesc, sortBy: 'createdAt', sortOrder: 'DESC' },
  { label: USERS_MESSAGES.sort.options.createdAtAsc, sortBy: 'createdAt', sortOrder: 'ASC' },
  { label: USERS_MESSAGES.sort.options.fullNameAsc, sortBy: 'fullName', sortOrder: 'ASC' },
  { label: USERS_MESSAGES.sort.options.fullNameDesc, sortBy: 'fullName', sortOrder: 'DESC' },
];

export const DEFAULT_SEARCH_FIELD: SearchField = 'name';

export const INITIAL_USERS_QUERY: UsersQuery = {
  search: '',
  field: DEFAULT_SEARCH_FIELD,
  sortIndex: 0,
  offset: 0,
};

const tableStrings = USERS_MESSAGES.table;

export const STATUS_LABELS: Record<string, string> = {
  active: tableStrings.statusActive,
  inactive: tableStrings.statusInactive,
  deleted: tableStrings.statusDeleted,
};

export const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  deleted: 'bg-red-100 text-red-600',
};
