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
