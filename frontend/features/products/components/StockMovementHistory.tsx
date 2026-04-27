'use client';

import { useEffect, useRef } from 'react';
import { useStockMovements } from '../hooks/useStockMovements';
import { StockMovementFilters } from './StockMovementFilters';
import { StockMovementRow } from './StockMovementRow';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_MOVEMENT_PAGINATION } from '../constants/stock-movement';
import type { StockMovementFilters as FilterType } from '../types/stock-movement';
import type { ProductVariant } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementHistoryProps {
  variant: ProductVariant;
  refreshKey: number;
}

export function StockMovementHistory({ variant, refreshKey }: StockMovementHistoryProps) {
  const { movements, isLoading, error, pagination, refetch } = useStockMovements(variant.id);
  const currentFiltersRef = useRef<FilterType>({
    page: 1,
    limit: STOCK_MOVEMENT_PAGINATION.DEFAULT_LIMIT,
  });

  useEffect(() => {
    if (refreshKey > 0) refetch(currentFiltersRef.current);
  }, [refreshKey]);

  const handleFilterChange = (filters: FilterType) => {
    const newFilters = { ...filters, page: 1, limit: STOCK_MOVEMENT_PAGINATION.DEFAULT_LIMIT };
    currentFiltersRef.current = newFilters;
    refetch(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...currentFiltersRef.current, page };
    currentFiltersRef.current = newFilters;
    refetch(newFilters);
  };

  if (isLoading) {
    return <p className="text-sm text-foreground/60">{strings.loadingHistory}</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <StockMovementFilters onFilterChange={handleFilterChange} />

      {movements.length === 0 ? (
        <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-foreground/5 text-left text-foreground/70">
                <tr>
                  <th className="px-4 py-3 font-medium">{strings.colDate}</th>
                  <th className="px-4 py-3 font-medium">{strings.colPrevious}</th>
                  <th className="px-4 py-3 font-medium">{strings.colNew}</th>
                  <th className="px-4 py-3 font-medium">{strings.colChange}</th>
                  <th className="px-4 py-3 font-medium">{strings.colReason}</th>
                  <th className="px-4 py-3 font-medium">{strings.colAdmin}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {movements.map((movement) => (
                  <StockMovementRow key={movement.id} movement={movement} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-foreground/60">
              {strings.paginationShowing} {movements.length} {strings.paginationOf}{' '}
              {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border border-foreground/20 text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {strings.paginationPrev}
              </button>
              <span className="px-3 py-1 text-foreground">{pagination.page}</span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 rounded border border-foreground/20 text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {strings.paginationNext}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
