import { USERS_MESSAGES } from './messages';
import type { SortOption } from '@/features/users/types/users.types';

export const SORT_OPTIONS: SortOption[] = [
  { label: USERS_MESSAGES.sort.options.createdAtDesc, sortBy: 'createdAt', sortOrder: 'DESC' },
  { label: USERS_MESSAGES.sort.options.createdAtAsc, sortBy: 'createdAt', sortOrder: 'ASC' },
  { label: USERS_MESSAGES.sort.options.fullNameAsc, sortBy: 'fullName', sortOrder: 'ASC' },
  { label: USERS_MESSAGES.sort.options.fullNameDesc, sortBy: 'fullName', sortOrder: 'DESC' },
];
