'use client';

import { use } from 'react';
import Link from 'next/link';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '@/features/inventory/constants/inventory.constants';
import { useSupplyHistory } from '@/features/inventory/hooks/useSupplyHistory';
import type { MovementTypeFilter } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.history;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SupplyHistoryPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  const { supplyId } = use(params);

  const {
    history,
    fetchError,
    isLoading,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  } = useSupplyHistory(supplyId);

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
          <h1 className="text-2xl font-bold text-foreground">
            {strings.title}
            {history && (
              <span className="font-normal text-foreground/60"> — {history.supply.name}</span>
            )}
          </h1>
        </div>
      </div>

      {/* Stock actual */}
      {history && (
        <div className="inline-flex items-center gap-3 rounded-lg border border-foreground/10 bg-background px-5 py-3">
          <span className="text-sm text-foreground/60">{strings.stockLabel}:</span>
          <span className="text-xl font-bold text-foreground">
            {Number(history.supply.currentStock)}
          </span>
          <span className="text-sm text-foreground/60">
            {UNIT_OF_MEASURE_LABELS[history.supply.unitOfMeasure]}
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-foreground/10 bg-background p-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-foreground/60">
            {strings.filterTypeLabel}
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MovementTypeFilter)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            <option value="">{strings.filterTypeAll}</option>
            <option value="entry">{strings.filterTypeEntry}</option>
            <option value="consumption">{strings.filterTypeConsumption}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-foreground/60">
            {strings.filterDateFrom}
          </label>
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-foreground/60">
            {strings.filterDateTo}
          </label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        {(typeFilter || dateFrom || dateTo) && (
          <button
            onClick={() => { setTypeFilter(''); setDateFrom(''); setDateTo(''); }}
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors pb-2"
          >
            {strings.clearFilters}
          </button>
        )}
      </div>

      {/* Error */}
      {fetchError && (
        <p role="alert" className="text-sm text-red-500">{fetchError}</p>
      )}

      {/* Cargando */}
      {isLoading && !history && (
        <p className="text-sm text-foreground/50">Cargando...</p>
      )}

      {/* Tabla de movimientos */}
      {history && (
        history.movements.length === 0 ? (
          <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-foreground/5 text-left text-foreground/70">
                <tr>
                  <th className="px-4 py-3 font-medium">{strings.colDate}</th>
                  <th className="px-4 py-3 font-medium">{strings.colType}</th>
                  <th className="px-4 py-3 font-medium">{strings.colQuantity}</th>
                  <th className="px-4 py-3 font-medium">{strings.colPreviousStock}</th>
                  <th className="px-4 py-3 font-medium">{strings.colNewStock}</th>
                  <th className="px-4 py-3 font-medium">{strings.colReference}</th>
                  <th className="px-4 py-3 font-medium">{strings.colAdmin}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {history.movements.map((m) => (
                  <tr key={m.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-4 py-3 text-foreground/70 whitespace-nowrap">
                      {formatDateTime(m.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.type === 'entry'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {m.type === 'entry' ? strings.typeEntry : strings.typeConsumption}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{m.quantity}</td>
                    <td className="px-4 py-3 text-foreground/70">{m.previousStock}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{m.newStock}</td>
                    <td className="px-4 py-3 text-foreground/60">
                      {m.reference ?? <span className="text-foreground/30">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{m.adminName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
