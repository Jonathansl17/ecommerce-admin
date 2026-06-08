'use client';

import { useState } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { DEFAULT_SEARCH_FIELD, INITIAL_USERS_QUERY, SORT_OPTIONS } from '@/features/users/constants/users.constants';
import { USERS_PAGE_SIZE } from '@/features/users/constants/api';

export function useUsersPage() {
  const [inputValue, setInputValue] = useState('');
  const [field, setField] = useState(DEFAULT_SEARCH_FIELD);
  const [query, setQuery] = useState(INITIAL_USERS_QUERY);

  const { sortBy, sortOrder } = SORT_OPTIONS[query.sortIndex];

  const { users, total, loading, error, statusError, updateStatus } = useUsers({
    search: query.search,
    field: query.field,
    offset: query.offset,
    sortBy,
    sortOrder,
  });

  const handleSearch = () => {
    setQuery((q) => ({ ...q, search: inputValue, field, offset: 0 }));
  };

  const handleSortChange = (index: number) => {
    setQuery((q) => ({ ...q, sortIndex: index, offset: 0 }));
  };

  const handlePrevPage = () => {
    setQuery((q) => ({ ...q, offset: Math.max(0, q.offset - USERS_PAGE_SIZE) }));
  };

  const handleNextPage = () => {
    setQuery((q) => ({ ...q, offset: q.offset + USERS_PAGE_SIZE }));
  };

  return {
    inputValue,
    setInputValue,
    field,
    setField,
    sortIndex: query.sortIndex,
    offset: query.offset,
    users,
    total,
    loading,
    error,
    statusError,
    updateStatus,
    handleSearch,
    handleSortChange,
    handlePrevPage,
    handleNextPage,
  };
}