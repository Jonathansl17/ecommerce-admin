'use client';

import { UNIT_OF_MEASURE_OPTIONS, INVENTORY_STRINGS } from './inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.edit;

interface EditSupplyModalProps {
  supply: Supply | null;
  onClose: () => void;
}

export function EditSupplyModal({ supply, onClose }: EditSupplyModalProps) {
  if (!supply) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <h2 id="edit-modal-title" className="mb-4 text-base font-semibold text-foreground">
          {strings.title}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-1">
              {strings.nameLabel}
            </label>
            <input
              id="edit-name"
              type="text"
              defaultValue={supply.name}
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>

          <div>
            <label htmlFor="edit-unit" className="block text-sm font-medium text-foreground mb-1">
              {strings.unitLabel}
            </label>
            <select
              id="edit-unit"
              defaultValue={supply.unitOfMeasure}
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            >
              {UNIT_OF_MEASURE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-stock" className="block text-sm font-medium text-foreground mb-1">
              {strings.stockLabel}
            </label>
            <input
              id="edit-stock"
              type="number"
              value={Number(supply.currentStock)}
              readOnly
              className="w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-foreground/60 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              {strings.cancelButton}
            </button>
            <button
              type="button"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              {strings.saveButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
