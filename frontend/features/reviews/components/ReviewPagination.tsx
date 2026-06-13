'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReviewPaginationProps } from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS;

export function ReviewPagination({ page, pageSize, total, onPageChange }: ReviewPaginationProps) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
      aria-label={strings.a11y.pagination}
    >
      <p className="text-xs text-muted-foreground">{strings.pagination.totalItems(total)}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={strings.pagination.previous}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {strings.pagination.previous}
        </button>

        <span className="text-xs font-medium text-muted-foreground" aria-current="page">
          {strings.pagination.pageInfo(page, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={strings.pagination.next}
        >
          {strings.pagination.next}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
