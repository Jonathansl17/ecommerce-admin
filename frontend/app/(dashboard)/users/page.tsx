'use client';

import { useUsersPage } from '@/features/users/hooks/useUsersPage';
import { UserTable } from '@/features/users/components/UserTable';
import { UserSearchBar } from '@/features/users/components/UserSearchBar';
import { UserSortSelect } from '@/features/users/components/UserSortSelect';
import { UserStatusFilter } from '@/features/users/components/UserStatusFilter';
import { UserPagination } from '@/features/users/components/UserPagination';
import { USERS_PAGE_SIZE } from '@/features/users/constants/api';
import { SORT_OPTIONS, STATUS_FILTER_OPTIONS } from '@/features/users/constants/users.constants';
import { USERS_MESSAGES } from '@/features/users/constants/messages';

const strings = USERS_MESSAGES;

export default function UsersPage() {
  const {
    inputValue,
    setInputValue,
    field,
    setField,
    status,
    sortIndex,
    offset,
    users,
    total,
    loading,
    error,
    statusError,
    updateStatus,
    handleSearch,
    handleStatusChange,
    handleSortChange,
    handlePrevPage,
    handleNextPage,
  } = useUsersPage();

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
        <UserStatusFilter
          status={status}
          statusOptions={STATUS_FILTER_OPTIONS}
          onStatusChange={handleStatusChange}
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
        <p className="text-sm text-foreground/60">{strings.page.loading}</p>
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
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );


  
}