'use client';

import { Button } from '@/components/ui/Button';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';

const { creationHint } = INVENTORY_STRINGS;

interface CreationHintBannerProps {
  onEditNow: () => void;
  onDismiss: () => void;
}

export function CreationHintBanner({ onEditNow, onDismiss }: CreationHintBannerProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-info/30 bg-info/10 px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-info">{creationHint.title}</p>
        <p className="text-sm text-info/90">{creationHint.body}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" onClick={onEditNow}>
          {creationHint.editNow}
        </Button>
        <Button variant="outline" size="sm" onClick={onDismiss}>
          {creationHint.dismiss}
        </Button>
      </div>
    </div>
  );
}
