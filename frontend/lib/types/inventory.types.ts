export type UnitOfMeasure = 'grams' | 'kilograms' | 'milliliters' | 'liters' | 'units';

export interface ApiErrorBody {
  error?: string;
}

export type ItemStatus = 'active' | 'inactive';

export interface Supply {
  id: string;
  name: string;
  status: ItemStatus;
  unitOfMeasure: UnitOfMeasure;
  currentStock: number;
  minThreshold: number;
  avgDailySales?: number | null;
  daysRemaining?: number | null;
}

export interface CreateSupplyForm {
  name: string;
  unitOfMeasure: UnitOfMeasure;
  initialStock: number;
}

export interface UpdateSupplyForm {
  name: string;
  unitOfMeasure: UnitOfMeasure;
  minThreshold: number;
}

export interface CreateSupplyEntryForm {
  supplyId: string;
  quantity: number;
  date: string; // YYYY-MM-DD
}

export interface EntryItem {
  supplyId: string;
  quantity: number;
}

export interface CreateSupplyEntriesForm {
  items: EntryItem[];
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

export interface InventoryMovement {
  id: string;
  type: 'entry' | 'consumption';
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string | null;
  createdAt: string; // ISO 8601
  adminName: string;
}

export interface SupplyHistory {
  supply: Supply;
  movements: InventoryMovement[];
}

export interface SupplyReportRow {
  id: string;
  name: string;
  unitOfMeasure: UnitOfMeasure;
  stockInicial: number;
  entradas: number;
  consumo: number;
  stockFinal: number;
}

export interface RendimientoItem {
  supplyName: string;
  unitOfMeasure: UnitOfMeasure;
  quantity: number;
}

export interface RendimientoGroup {
  reference: string;
  items: RendimientoItem[];
}

export interface InventoryReport {
  period: { from: string; to: string };
  supplies: SupplyReportRow[];
  rendimiento: RendimientoGroup[];
}

