'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { Review, ModerationReason } from '../types/reviews.types';
import {
  MODERATION_REASON_LABELS,
  REVIEWS_STRINGS,
} from '../constants/reviews.constants';
import { StarRating } from './StarRating';

const strings = REVIEWS_STRINGS.modals;
const MODERATION_REASONS = Object.keys(MODERATION_REASON_LABELS) as ModerationReason[];
const MAX_DETAIL_LENGTH = 500;

interface DeleteReviewModalProps {
  review: Review;
  onConfirm: (reason: ModerationReason, detail?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

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
  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

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
        {/* Review summary */}
        <div className="space-y-1.5 rounded-md border border-border bg-muted/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {strings.deleteSummaryLabel}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{productName}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{clientName}</span>
          </div>
          <p className="line-clamp-2 text-sm text-foreground/80">{review.comment}</p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="delete-reason"
            className="block text-sm font-medium text-foreground"
          >
            {strings.deleteReasonLabel}
          </label>
          <select
            id="delete-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as ModerationReason)}
            required
            disabled={isLoading}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="" disabled>
              {strings.deleteReasonPlaceholder}
            </option>
            {MODERATION_REASONS.map((r) => (
              <option key={r} value={r}>
                {MODERATION_REASON_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

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
