'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { ModerationReason, DeleteReviewModalProps } from '../types/reviews.types';
import { REVIEW_FORM_LIMITS, REVIEWS_STRINGS } from '../constants/reviews.constants';
import { ReviewSummary } from './ReviewSummary';
import { ModerationReasonSelect } from './ModerationReasonSelect';

const strings = REVIEWS_STRINGS.modals;
const MAX_DETAIL_LENGTH = REVIEW_FORM_LIMITS.deleteDetailMax;

export function DeleteReviewModal({
  review,
  onConfirm,
  onClose,
  isLoading,
}: DeleteReviewModalProps) {
  const [reason, setReason] = useState<ModerationReason | ''>('');
  const [detail, setDetail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (reason === '') return;
    onConfirm(reason, detail.trim() || undefined);
  };

  const detailRemaining = MAX_DETAIL_LENGTH - detail.length;

  return (
    <Modal
      titleId="delete-review-modal-title"
      title={strings.deleteTitle}
      description={strings.deleteDescription}
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
            form="delete-review-form"
            disabled={isLoading || reason === ''}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: isLoading ? '#f87171' : '#ef4444' }}
          >
            {isLoading ? strings.deleting : strings.confirmDelete}
          </button>
        </>
      }
    >
      <form id="delete-review-form" onSubmit={handleSubmit} className="space-y-4">
        <ReviewSummary review={review} label={strings.deleteSummaryLabel} />

        <ModerationReasonSelect
          id="delete-reason"
          label={strings.deleteReasonLabel}
          value={reason}
          onChange={setReason}
          disabled={isLoading}
          placeholder={strings.deleteReasonPlaceholder}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="delete-detail"
            className="block text-sm font-medium text-foreground"
          >
            {strings.deleteDetailLabel}
          </label>
          <textarea
            id="delete-detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value.slice(0, MAX_DETAIL_LENGTH))}
            placeholder={strings.deleteDetailPlaceholder}
            rows={3}
            disabled={isLoading}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <p className="text-right text-xs text-muted-foreground">
            {strings.charsRemaining(detailRemaining)}
          </p>
        </div>
      </form>
    </Modal>
  );
}
