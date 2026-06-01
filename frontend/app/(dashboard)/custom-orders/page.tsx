import { KanbanBoard } from '@/features/custom-orders/components/KanbanBoard';
import { ProductAreaTabNav } from '@/features/custom-orders/components/ProductAreaTabNav';
import { CUSTOM_ORDERS_MESSAGES } from '@/features/custom-orders/constants/messages';

const strings = CUSTOM_ORDERS_MESSAGES.page;

export default function CustomOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{strings.title}</h1>
        <p className="text-sm text-foreground/50">{strings.subtitle}</p>
      </div>

      <ProductAreaTabNav />

      <KanbanBoard />
    </div>
  );
}
