'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS.modals;
const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

interface RespondReviewModalProps {
  onConfirm: (responseText: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function RespondReviewModal({ onConfirm, onClose, isLoading }: RespondReviewModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < MIN_LENGTH) return;
    onConfirm(trimmed);
  };

  const remaining = MAX_LENGTH - text.length;
  const tooShort = text.trim().length > 0 && text.trim().length < MIN_LENGTH;

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
            disabled={isLoading || text.trim().length < MIN_LENGTH}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? strings.submitting : strings.confirmRespond}
          </button>
        </>
      }
    >
      <form id="respond-review-form" onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="respond-text" className="block text-sm font-medium text-foreground">
            {strings.respondTextLabel}
          </label>
          <textarea
            id="respond-text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder={strings.respondTextPlaceholder}
            rows={4}
            required
            disabled={isLoading}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <div className="flex items-center justify-between">
            {tooShort && (
              <p className="text-xs text-destructive">Mínimo {MIN_LENGTH} caracteres</p>
            )}
            <p className="ml-auto text-right text-xs text-muted-foreground">
              {strings.charsRemaining(remaining)}
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
