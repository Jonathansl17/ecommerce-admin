'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SupplyList } from '@/features/inventory/components/SupplyList';
import { EditSupplyModal } from '@/features/inventory/components/EditSupplyModal';
import { SupplyFormModal } from '@/features/inventory/components/SupplyFormModal';
import { SupplyEntryModal } from '@/features/inventory/components/SupplyEntryModal';
import { ConsumptionModal } from '@/features/inventory/components/ConsumptionModal';
import { InventoryAlerts } from '@/features/inventory/components/InventoryAlerts';
import { getSupplies, createSupply, updateSupply, registerEntries, registerConsumption } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { Supply, CreateSupplyForm, UpdateSupplyForm, CreateSupplyEntriesForm, CreateConsumptionForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS;

export default function InventoryPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal open states
  const [supplyFormOpen, setSupplyFormOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);

  // Server errors per modal
  const [supplyFormError, setSupplyFormError] = useState<string | null>(null);
  const [showCreationHint, setShowCreationHint] = useState(false);
  const [createdSupply, setCreatedSupply] = useState<Supply | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [consumptionError, setConsumptionError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Pre-selected supply for quick entry from alerts
  const [quickEntrySupplyId, setQuickEntrySupplyId] = useState<string | undefined>(undefined);

  const loadSupplies = useCallback(async () => {
    try {
      const data = await getSupplies();
      setSupplies(data);
      setFetchError(null);
    } catch {
      setFetchError(strings.errors.fetchError);
    }
  }, []);

  useEffect(() => {
    loadSupplies();
  }, [loadSupplies]);

  const handleCreate = async (data: CreateSupplyForm) => {
    try {
      setSupplyFormError(null);
      const newSupply = await createSupply(data);
      setSupplies((prev) => [...prev, newSupply]);
      setSupplyFormOpen(false);
      setCreatedSupply(newSupply);
      setShowCreationHint(true);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setSupplyFormError(
        error?.error === strings.errors.duplicateName
          ? strings.errors.duplicateName
          : strings.errors.createError
      );
    }
  };

  const handleCreateEntry = async (data: CreateSupplyEntriesForm) => {
    try {
      setEntryError(null);
      const updatedSupplies = await registerEntries(data);
      setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
      setEntryOpen(false);
      setQuickEntrySupplyId(undefined);
    } catch {
      setEntryError(strings.errors.entryError);
    }
  };

  const handleConsumption = async (data: CreateConsumptionForm) => {
    try {
      setConsumptionError(null);
      const updatedSupplies = await registerConsumption(data);
      setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
      setConsumptionOpen(false);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setConsumptionError(
        error?.error === strings.errors.stockInsufficient
          ? strings.errors.stockInsufficient
          : strings.errors.consumptionError
      );
    }
  };

  const handleUpdate = async (id: string, data: UpdateSupplyForm) => {
    try {
      setEditError(null);
      const updated = await updateSupply(id, data);
      setSupplies((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditingSupply(null);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setEditError(
        error?.error === strings.errors.duplicateName
          ? strings.errors.duplicateName
          : strings.errors.updateError
      );
    }
  };

  const handleQuickEntry = (supplyId: string) => {
    setQuickEntrySupplyId(supplyId);
    setEntryError(null);
    setEntryOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
            <p className="mt-1 text-sm text-foreground/60">{strings.page.subtitle}</p>
          </div>
          <Link
            href="/inventory/report"
            className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
          >
            {strings.report.reportButton}
          </Link>
        </div>

        {/* Hint post-creación */}
        {showCreationHint && (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800">{strings.creationHint.title}</p>
              <p className="text-sm text-blue-700">{strings.creationHint.body}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSupply(createdSupply);
                  setShowCreationHint(false);
                  setCreatedSupply(null);
                }}
                className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                {strings.creationHint.editNow}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreationHint(false); setCreatedSupply(null); }}
                className="rounded-md border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {strings.creationHint.dismiss}
              </button>
            </div>
          </div>
        )}

        {/* Alertas */}
        <InventoryAlerts supplies={supplies} onQuickEntry={handleQuickEntry} />

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: strings.form.openButton, onClick: () => { setSupplyFormError(null); setSupplyFormOpen(true); } },
            { label: strings.entry.openButton, onClick: () => { setEntryError(null); setQuickEntrySupplyId(undefined); setEntryOpen(true); } },
            { label: strings.consumption.openButton, onClick: () => { setConsumptionError(null); setConsumptionOpen(true); } },
          ].map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {fetchError ? (
          <p role="alert" className="text-sm text-red-500">{fetchError}</p>
        ) : (
          <SupplyList supplies={supplies} onEdit={setEditingSupply} />
        )}
      </div>

      {/* Modales */}
      {supplyFormOpen && (
        <SupplyFormModal
          onClose={() => { setSupplyFormOpen(false); setSupplyFormError(null); }}
          onSubmit={handleCreate}
          serverError={supplyFormError}
        />
      )}

      {entryOpen && (
        <SupplyEntryModal
          supplies={supplies}
          onClose={() => { setEntryOpen(false); setEntryError(null); setQuickEntrySupplyId(undefined); }}
          onSubmit={handleCreateEntry}
          serverError={entryError}
          defaultSupplyId={quickEntrySupplyId}
        />
      )}

      <ConsumptionModal
        isOpen={consumptionOpen}
        supplies={supplies}
        onClose={() => { setConsumptionOpen(false); setConsumptionError(null); }}
        onSubmit={handleConsumption}
        serverError={consumptionError}
      />

      <EditSupplyModal
        supply={editingSupply}
        onClose={() => { setEditingSupply(null); setEditError(null); }}
        onSave={handleUpdate}
        serverError={editError}
      />
    </>
  );
}
