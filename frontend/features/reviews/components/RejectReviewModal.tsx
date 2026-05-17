'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { ModerationReason } from '../types/reviews.types';
import {
  MODERATION_REASON_LABELS,
  REVIEWS_STRINGS,
} from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS.modals;
const MODERATION_REASONS = Object.keys(MODERATION_REASON_LABELS) as ModerationReason[];
const MAX_NOTES_LENGTH = 500;

interface RejectReviewModalProps {
  reviewId: string;
  onConfirm: (reason: ModerationReason, notes?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function RejectReviewModal({
  reviewId: _reviewId,
  onConfirm,
  onClose,
  isLoading,
}: RejectReviewModalProps) {
  const [reason, setReason] = useState<ModerationReason>('other');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(reason, notes.trim() || undefined);
  };

  const notesRemaining = MAX_NOTES_LENGTH - notes.length;

  return (
    <Modal
      titleId="reject-review-modal-title"
      title={strings.rejectTitle}
      description={strings.rejectDescription}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {strings.cancel}
          </button>
          <button
            type="submit"
            form="reject-review-form"
            disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: isLoading ? '#f87171' : '#ef4444' }}
          >
            {isLoading ? strings.submitting : strings.confirmReject}
          </button>
        </>
      }
    >
      <form id="reject-review-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="reject-reason"
            className="block text-sm font-medium text-foreground"
          >
            {strings.rejectReasonLabel}
          </label>
          <select
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as ModerationReason)}
            required
            disabled={isLoading}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {MODERATION_REASONS.map((r) => (
              <option key={r} value={r}>
                {MODERATION_REASON_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="reject-notes"
            className="block text-sm font-medium text-foreground"
          >
            {strings.rejectNotesLabel}
          </label>
          <textarea
            id="reject-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES_LENGTH))}
            placeholder={strings.rejectNotesPlaceholder}
            rows={3}
            disabled={isLoading}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <p className="text-right text-xs text-muted-foreground">
            {strings.charsRemaining(notesRemaining)}
          </p>
        </div>
      </form>
    </Modal>
  );
}
