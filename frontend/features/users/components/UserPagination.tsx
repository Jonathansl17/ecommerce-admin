import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserPaginationProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.pagination;

export function UserPagination({ offset, total, pageSize, onPrev, onNext }: UserPaginationProps) {
  if (total === 0) return null;

  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = offset + 1;
  const showingTo = Math.min(offset + pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-foreground/60">
        {strings.showing} {showingFrom}–{showingTo} {strings.of} {total} {strings.results}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={offset === 0}
          className="rounded-md border border-foreground/20 px-3 py-1 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {strings.prev}
        </button>
        <span className="text-sm text-foreground/60">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={offset + pageSize >= total}
          className="rounded-md border border-foreground/20 px-3 py-1 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {strings.next}
        </button>
      </div>
    </div>
  );
}
