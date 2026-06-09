'use client';

import { useState } from 'react';
import { getInventoryReport } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { InventoryReport } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.report;

export function useInventoryReport() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!dateFrom || !dateTo) return;
    if (dateFrom > dateTo) {
      setError(strings.dateRangeInvalid);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getInventoryReport(dateFrom, dateTo);
      setReport(data);
    } catch {
      setError(INVENTORY_STRINGS.errors.reportError);
    } finally {
      setLoading(false);
    }
  };

  return {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    report,
    loading,
    error,
    handleGenerate,
  };
}
