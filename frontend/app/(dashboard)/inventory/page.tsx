'use client';

import Link from 'next/link';
import { SupplyList } from '@/features/inventory/components/SupplyList';
import { EditSupplyModal } from '@/features/inventory/components/EditSupplyModal';
import { SupplyFormModal } from '@/features/inventory/components/SupplyFormModal';
import { SupplyEntryModal } from '@/features/inventory/components/SupplyEntryModal';
import { ConsumptionModal } from '@/features/inventory/components/ConsumptionModal';
import { InventoryAlerts } from '@/features/inventory/components/InventoryAlerts';
import { CreationHintBanner } from '@/features/inventory/components/CreationHintBanner';
import { DeleteSupplyModal } from '@/features/inventory/components/DeleteSupplyModal';
import { useInventoryPage } from '@/features/inventory/hooks/useInventoryPage';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';

const strings = INVENTORY_STRINGS;

export default function InventoryPage() {
  const {
    supplies, fetchError,
    supplyFormOpen, entryOpen, consumptionOpen, editingSupply, deletingSupply, quickEntrySupplyId,
    supplyFormError, entryError, consumptionError, editError, deleteError, isDeleting,
    showCreationHint,
    openSupplyForm, openEntry, openEdit, openDelete, openConsumption,
    closeSupplyForm, closeEntry, closeConsumption, closeEdit, closeDelete,
    editFromHint, dismissCreationHint,
    handleCreate, handleCreateEntry, handleConsumption, handleUpdate, handleDelete, handleQuickEntry,
  } = useInventoryPage();

  return (
    <>
      <div className="space-y-6">
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

        {showCreationHint && (
          <CreationHintBanner onEditNow={editFromHint} onDismiss={dismissCreationHint} />
        )}

        <InventoryAlerts supplies={supplies} onQuickEntry={handleQuickEntry} />

        <div className="flex flex-wrap gap-3">
          {[
            { label: strings.form.openButton, onClick: openSupplyForm },
            { label: strings.entry.openButton, onClick: () => openEntry() },
            { label: strings.consumption.openButton, onClick: openConsumption },
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

        {fetchError ? (
          <p role="alert" className="text-sm text-red-500">{fetchError}</p>
        ) : (
          <SupplyList supplies={supplies} onEdit={openEdit} onDelete={openDelete} />
        )}
      </div>

      {supplyFormOpen && (
        <SupplyFormModal
          onClose={closeSupplyForm}
          onSubmit={handleCreate}
          serverError={supplyFormError}
        />
      )}

      {entryOpen && (
        <SupplyEntryModal
          supplies={supplies}
          onClose={closeEntry}
          onSubmit={handleCreateEntry}
          serverError={entryError}
          defaultSupplyId={quickEntrySupplyId}
        />
      )}

      {consumptionOpen && (
        <ConsumptionModal
          supplies={supplies}
          onClose={closeConsumption}
          onSubmit={handleConsumption}
          serverError={consumptionError}
        />
      )}

      <EditSupplyModal
        supply={editingSupply}
        onClose={closeEdit}
        onSave={handleUpdate}
        serverError={editError}
      />

      <DeleteSupplyModal
        supply={deletingSupply}
        isDeleting={isDeleting}
        onClose={closeDelete}
        onConfirm={handleDelete}
        serverError={deleteError}
      />
    </>
  );
}
