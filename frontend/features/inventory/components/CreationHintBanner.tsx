'use client';

import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';

const { creationHint } = INVENTORY_STRINGS;

interface CreationHintBannerProps {
  onEditNow: () => void;
  onDismiss: () => void;
}

export function CreationHintBanner({ onEditNow, onDismiss }: CreationHintBannerProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-blue-800">{creationHint.title}</p>
        <p className="text-sm text-blue-700">{creationHint.body}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onEditNow}
          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {creationHint.editNow}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
        >
          {creationHint.dismiss}
        </button>
      </div>
    </div>
  );
}
