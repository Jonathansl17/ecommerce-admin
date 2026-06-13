'use client';

import { useState, useCallback } from 'react';
import { Select } from '@/components/ui/Select';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { OrderFiltersBar } from '@/features/orders/components/OrderFiltersBar';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import {
  ORDERS_STRINGS,
  DEFAULT_LIMIT,
  PAGE_LIMIT_OPTIONS,
} from '@/features/orders/constants/orders.constants';
import type { OrderFilters } from '@/features/orders/types/orders.types';

const { page: pageStrings, pagination: paginationStrings } = ORDERS_STRINGS;

export default function SalesPage() {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const { pedidos, total, cargando, error, setFilters } = useOrders({ limit, offset });

  const handleFiltersChange = useCallback(
    (newFilters: Omit<OrderFilters, 'limit' | 'offset'>) => {
      setOffset(0);
      setFilters({ ...newFilters, limit, offset: 0 });
    },
    [limit, setFilters],
  );

  const handlePrev = () => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
    setFilters({ limit, offset: newOffset });
  };

  const handleNext = () => {
    const newOffset = offset + limit;
    if (newOffset < total) {
      setOffset(newOffset);
      setFilters({ limit, offset: newOffset });
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
    setFilters({ limit: newLimit, offset: 0 });
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + limit, total);

  return (
    <main className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{pageStrings.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{pageStrings.subtitle}</p>
      </div>

      {/* Filters */}
      <OrderFiltersBar onChange={handleFiltersChange} />

      {/* Error */}
      {error && (
        <div
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Table */}
      {cargando ? (
        <div className="flex items-center justify-center py-12" aria-live="polite" aria-busy>
          <span className="text-sm text-muted-foreground">Cargando pedidos...</span>
        </div>
      ) : (
        <OrdersTable pedidos={pedidos} />
      )}

      {/* Pagination */}
      {!cargando && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {paginationStrings.showing} {showingFrom}–{showingTo} {paginationStrings.of} {total}{' '}
            {paginationStrings.results}
          </p>

          <div className="flex items-center gap-2">
            {/* Limit selector */}
            <Select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              aria-label="Resultados por página"
            >
              {PAGE_LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / pág.
                </option>
              ))}
            </Select>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={offset === 0}
              className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paginationStrings.prev}
            </button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={offset + limit >= total}
              className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paginationStrings.next}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
