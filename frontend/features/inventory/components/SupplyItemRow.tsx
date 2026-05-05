'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '../constants/inventory.constants';
import type { Supply, CreateSupplyEntriesForm, CreateConsumptionForm } from '@/lib/types/inventory.types';

type ItemForm = CreateSupplyEntriesForm | CreateConsumptionForm;

interface SupplyItemRowProps {
  index: number;
  availableSupplies: Supply[];
  showRemove: boolean;
  onRemove: () => void;
  removeLabel: string;
  supplyLabel: string;
  supplyPlaceholder: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  register: UseFormRegister<ItemForm>;
  errors: FieldErrors<ItemForm>;
}

export function SupplyItemRow({
  index,
  availableSupplies,
  showRemove,
  onRemove,
  removeLabel,
  supplyLabel,
  supplyPlaceholder,
  quantityLabel,
  quantityPlaceholder,
  register,
  errors,
}: SupplyItemRowProps) {
  const supplyError = errors.items?.[index]?.supplyId?.message;
  const quantityError = errors.items?.[index]?.quantity?.message;

  return (
    <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground/60">
          {INVENTORY_STRINGS.shared.itemLabel} {index + 1}
        </span>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            {removeLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-3">
        <FormField id={`item-supply-${index}`} label={supplyLabel} error={supplyError}>
          <select
            id={`item-supply-${index}`}
            {...register(`items.${index}.supplyId` as Parameters<typeof register>[0])}
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
              supplyError ? 'border-red-500' : 'border-foreground/20'
            }`}
          >
            <option value="">{supplyPlaceholder}</option>
            {availableSupplies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({UNIT_OF_MEASURE_LABELS[s.unitOfMeasure]})
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id={`item-quantity-${index}`}
          label={quantityLabel}
          labelClassName="text-xs"
          error={quantityError}
        >
          <Input
            id={`item-quantity-${index}`}
            type="number"
            min={0.01}
            step="any"
            placeholder={quantityPlaceholder}
            hasError={!!quantityError}
            {...register(`items.${index}.quantity` as Parameters<typeof register>[0], {
              valueAsNumber: true,
            })}
          />
        </FormField>
      </div>
    </div>
  );
}
