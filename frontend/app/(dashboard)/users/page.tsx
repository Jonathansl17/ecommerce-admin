'use client';

import { useState } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { UserTable } from '@/features/users/components/UserTable';
import { UserSearchBar } from '@/features/users/components/UserSearchBar';
import { UserSortSelect } from '@/features/users/components/UserSortSelect';
import { UserPagination } from '@/features/users/components/UserPagination';
import { USERS_PAGE_SIZE } from '@/features/users/constants/api';
import { DEFAULT_SEARCH_FIELD, INITIAL_USERS_QUERY, SORT_OPTIONS } from '@/features/users/constants/users.constants';
import { USERS_MESSAGES } from '@/features/users/constants/messages';

const strings = USERS_MESSAGES;

export default function UsersPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        <p className="mt-1 text-sm text-foreground/60">{strings.page.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <UserSearchBar
          field={field}
          inputValue={inputValue}
          onFieldChange={setField}
          onInputChange={setInputValue}
          onSearch={handleSearch}
        />
        <UserSortSelect
          sortIndex={query.sortIndex}
          sortOptions={SORT_OPTIONS}
          onSortChange={handleSortChange}
        />
      </div>

      {statusError && (
        <p role="alert" className="text-sm text-red-500">{statusError}</p>
      )}

      {loading ? (
        <p className="text-sm text-foreground/60">Cargando usuarios...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-500">{error}</p>
      ) : (
        <UserTable users={users} onChangeStatus={updateStatus} />
      )}

      {!loading && (
        <UserPagination
          offset={query.offset}
          total={total}
          pageSize={USERS_PAGE_SIZE}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
}
