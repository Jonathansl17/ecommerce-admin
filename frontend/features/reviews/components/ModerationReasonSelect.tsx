'use client';

import { Select } from '@/components/ui/Select';
import type { ModerationReason, ModerationReasonSelectProps } from '../types/reviews.types';
import {
  MODERATION_REASON_LABELS,
  MODERATION_REASON_OPTIONS,
} from '../constants/reviews.constants';

// Dropdown of predefined moderation reasons, shared by the reject and delete
// modals. Pass `placeholder` to force an explicit choice (empty initial value).
export function ModerationReasonSelect({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: ModerationReasonSelectProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as ModerationReason)}
        required
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {MODERATION_REASON_OPTIONS.map((r) => (
          <option key={r} value={r}>
            {MODERATION_REASON_LABELS[r]}
          </option>
        ))}
      </Select>
    </div>
  );
}
