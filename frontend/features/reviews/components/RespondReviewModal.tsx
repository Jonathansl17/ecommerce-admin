'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS.modals;
const MAX_TEXT_LENGTH = 500;

interface RespondReviewModalProps {
  reviewId: string;
  onConfirm: (text: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function RespondReviewModal({
  reviewId: _reviewId,
  onConfirm,
  onClose,
  isLoading,
}: RespondReviewModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    onConfirm(trimmed);
  };

  const textRemaining = MAX_TEXT_LENGTH - text.length;
  const isSubmittable = text.trim().length > 0;

  return (
    <Modal
      titleId="respond-review-modal-title"
      title={strings.respondTitle}
      description={strings.respondDescription}
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
            form="respond-review-form"
            disabled={isLoading || !isSubmittable}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? strings.submitting : strings.confirmRespond}
          </button>
        </>
      }
    >
      <form id="respond-review-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="respond-text"
            className="block text-sm font-medium text-foreground"
          >
            {strings.respondTextLabel}
          </label>
          <textarea
            id="respond-text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            placeholder={strings.respondTextPlaceholder}
            rows={4}
            required
            disabled={isLoading}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <p className="text-right text-xs text-muted-foreground">
            {strings.charsRemaining(textRemaining)}
          </p>
        </div>
      </form>
    </Modal>
  );
}
