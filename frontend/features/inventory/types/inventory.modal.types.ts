import type {
  Supply,
  CreateSupplyForm,
  UpdateSupplyForm,
  CreateSupplyEntriesForm,
  CreateConsumptionForm,
} from '@/lib/types/inventory.types';

export interface SupplyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSupplyForm) => Promise<void>;
  serverError?: string | null;
}

export interface EditSupplyModalProps {
  supply: Supply | null;
  onClose: () => void;
  onSave: (id: string, data: UpdateSupplyForm) => Promise<void>;
  serverError?: string | null;
}

export interface SupplyEntryModalProps {
  supplies: Supply[];
  onClose: () => void;
  onSubmit: (data: CreateSupplyEntriesForm) => Promise<void>;
  serverError?: string | null;
  defaultSupplyId?: string;
}

export interface ConsumptionModalProps {
  isOpen: boolean;
  supplies: Supply[];
  onClose: () => void;
  onSubmit: (data: CreateConsumptionForm) => Promise<void>;
  serverError?: string | null;
}
