'use client';

import { useEffect, useMemo, useState } from 'react';

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 20;

export function usePagination<T>(items: T[], initialPageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    page: currentPage,
    setPage,
    totalPages,
    pageItems,
    total,
    pageSize,
    setPageSize: changePageSize,
  };
}
