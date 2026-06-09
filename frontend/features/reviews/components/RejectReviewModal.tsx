'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { ModerationReason, RejectReviewModalProps } from '../types/reviews.types';
import { REVIEW_FORM_LIMITS, REVIEWS_STRINGS } from '../constants/reviews.constants';
import { ModerationReasonSelect } from './ModerationReasonSelect';

const strings = REVIEWS_STRINGS.modals;
const MAX_NOTES_LENGTH = REVIEW_FORM_LIMITS.notesMax;

export function RejectReviewModal({
  reviewId: _reviewId,
  onConfirm,
  onClose,
  isLoading,
}: RejectReviewModalProps) {
  const [reason, setReason] = useState<ModerationReason>('other');
  const [notes, setNotes] = useState('');

  const notesRemaining = REVIEW_TEXT_MAX_LENGTH - notes.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(reason, notes.trim() || undefined);
  };

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
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? strings.submitting : strings.confirmReject}
          </button>
        </>
      }
    >
      <form id="reject-review-form" onSubmit={handleSubmit} className="space-y-4">
        <ModerationReasonSelect
          id="reject-reason"
          label={strings.rejectReasonLabel}
          value={reason}
          onChange={setReason}
          disabled={isLoading}
        />

        <div className="space-y-1.5">
          <label htmlFor="reject-notes" className="block text-sm font-medium text-foreground">
            {strings.rejectNotesLabel}
          </label>
          <textarea
            id="reject-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, REVIEW_TEXT_MAX_LENGTH))}
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
