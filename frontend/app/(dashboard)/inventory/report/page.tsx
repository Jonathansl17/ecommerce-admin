'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { getInventoryReport } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '@/features/inventory/constants/inventory.constants';
import type { InventoryReport } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.report;

export default function InventoryReportPage() {
  const { token } = useAuth();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!token || !dateFrom || !dateTo) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getInventoryReport(dateFrom, dateTo, token);
      setReport(data);
    } catch {
      setError(INVENTORY_STRINGS.errors.reportError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/inventory"
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            {strings.backButton}
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{strings.title}</h1>
        </div>
      </div>

      {/* Date range selector */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-foreground/10 bg-background p-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-foreground/60">{strings.dateFromLabel}</label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-foreground/60">{strings.dateToLabel}</label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!dateFrom || !dateTo || loading}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? strings.generating : strings.generateButton}
        </button>
      </div>

      {!dateFrom || !dateTo ? (
        <p className="text-sm text-foreground/50">{strings.dateRequired}</p>
      ) : null}

      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

      {/* Report results */}
      {report && (
        <div className="space-y-8">
          {/* Main table */}
          {report.supplies.length === 0 ? (
            <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-foreground/10">
              <table className="w-full text-sm">
                <thead className="bg-foreground/5 text-left text-foreground/70">
                  <tr>
                    <th className="px-4 py-3 font-medium">{strings.colSupply}</th>
                    <th className="px-4 py-3 font-medium">{strings.colUnit}</th>
                    <th className="px-4 py-3 font-medium text-right">{strings.colStockInicial}</th>
                    <th className="px-4 py-3 font-medium text-right">{strings.colEntradas}</th>
                    <th className="px-4 py-3 font-medium text-right">{strings.colConsumo}</th>
                    <th className="px-4 py-3 font-medium text-right">{strings.colStockFinal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {report.supplies.map((row) => (
                    <tr key={row.id} className="hover:bg-foreground/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-foreground/60">
                        {UNIT_OF_MEASURE_LABELS[row.unitOfMeasure]}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground/70">{row.stockInicial}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-700">
                        +{row.entradas}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-orange-700">
                        -{row.consumo}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {row.stockFinal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Rendimiento section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">{strings.rendimientoTitle}</h2>

            {/* Disclaimer */}
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm text-blue-700">{strings.rendimientoDisclaimer}</p>
            </div>

            {report.rendimiento.length === 0 ? (
              <p className="text-sm text-foreground/60">{strings.noRendimiento}</p>
            ) : (
              <div className="space-y-4">
                {report.rendimiento.map((group) => (
                  <div key={group.reference} className="rounded-lg border border-foreground/10">
                    <div className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2">
                      <p className="text-sm font-semibold text-foreground">{group.reference}</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="text-left text-foreground/60">
                        <tr>
                          <th className="px-4 py-2 font-medium">{strings.colIngredient}</th>
                          <th className="px-4 py-2 font-medium text-right">{strings.colQty}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {group.items.map((item) => (
                          <tr key={item.supplyName} className="hover:bg-foreground/5">
                            <td className="px-4 py-2 text-foreground">{item.supplyName}</td>
                            <td className="px-4 py-2 text-right text-foreground/70">
                              {item.quantity} {UNIT_OF_MEASURE_LABELS[item.unitOfMeasure]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
