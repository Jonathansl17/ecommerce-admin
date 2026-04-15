export type UnitOfMeasure = 'grams' | 'kilograms' | 'milliliters' | 'liters' | 'units';

export type ItemStatus = 'active' | 'inactive';

export interface Supply {
  id: string;
  name: string;
  status: ItemStatus;
  unitOfMeasure: UnitOfMeasure;
  currentStock: number;
  minThreshold: number;
}

export interface CreateSupplyForm {
  name: string;
  unitOfMeasure: UnitOfMeasure;
  initialStock: number;
}

export interface UpdateSupplyForm {
  name: string;
  unitOfMeasure: UnitOfMeasure;
}

export interface CreateSupplyEntryForm {
  supplyId: string;
  quantity: number;
  date: string; // YYYY-MM-DD
}

export interface ConsumptionItem {
  supplyId: string;
  quantity: number;
}

export interface CreateConsumptionForm {
  items: ConsumptionItem[];
  reference: string;
  date: string; // YYYY-MM-DD
}
