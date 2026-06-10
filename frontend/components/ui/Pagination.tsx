'use client';

import { PAGE_SIZE_OPTIONS } from '@/lib/hooks/usePagination';

const PAGINATION_LABELS = {
  prev: 'Anterior',
  next: 'Siguiente',
  showing: 'Mostrando',
  of: 'de',
  results: 'resultados',
  perPage: '/ pág.',
  resultsPerPage: 'Resultados por página',
};

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (total === 0) return null;

  const showingFrom = (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {PAGINATION_LABELS.showing} {showingFrom}–{showingTo} {PAGINATION_LABELS.of} {total}{' '}
        {PAGINATION_LABELS.results}
      </p>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={PAGINATION_LABELS.resultsPerPage}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} {PAGINATION_LABELS.perPage}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {PAGINATION_LABELS.prev}
        </button>
        <span className="text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {PAGINATION_LABELS.next}
        </button>
      </div>
    </div>
  );
}
