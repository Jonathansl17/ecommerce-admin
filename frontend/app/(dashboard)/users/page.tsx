'use client';

import { useState } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { UserTable } from '@/features/users/components/UserTable';
import { UserSearchBar } from '@/features/users/components/UserSearchBar';
import { UserSortSelect } from '@/features/users/components/UserSortSelect';
import { UserPagination } from '@/features/users/components/UserPagination';
import { USERS_PAGE_SIZE } from '@/features/users/constants/api';
import { SORT_OPTIONS } from '@/features/users/constants/users.constants';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { SearchField } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES;

export default function UsersPage() {
  const [inputValue, setInputValue] = useState('');
  const [field, setField] = useState<SearchField>('name');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [submittedField, setSubmittedField] = useState<SearchField>('name');
  const [offset, setOffset] = useState(0);
  const [sortIndex, setSortIndex] = useState(0);

  const { sortBy, sortOrder } = SORT_OPTIONS[sortIndex];

  const { users, total, loading, error, statusError, updateStatus } = useUsers({
    search: submittedSearch,
    field: submittedField,
    offset,
    sortBy,
    sortOrder,
  });

  const handleSearch = () => {
    setOffset(0);
    setSubmittedSearch(inputValue);
    setSubmittedField(field);
  };

  const handleSortChange = (index: number) => {
    setSortIndex(index);
    setOffset(0);
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
          sortIndex={sortIndex}
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
          offset={offset}
          total={total}
          pageSize={USERS_PAGE_SIZE}
          onPrev={() => setOffset((o) => Math.max(0, o - USERS_PAGE_SIZE))}
          onNext={() => setOffset((o) => o + USERS_PAGE_SIZE)}
        />
      )}
    </div>
  );
}
