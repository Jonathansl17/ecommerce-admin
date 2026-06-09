'use client';

import { ThumbsUp, XCircle, MessageSquare } from 'lucide-react';
import type { ReviewModerationActionsProps } from '../types/reviews.types';
import { REVIEW_STATUS, REVIEWS_STRINGS } from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS.card;
const a11y = REVIEWS_STRINGS.a11y;

export function ReviewModerationActions({
  review,
  isLoading,
  onApprove,
  onOpenReject,
  onOpenRespond,
  onOpenDelete,
}: ReviewModerationActionsProps) {
  const isPending = review.status === REVIEW_STATUS.pending;
  const canRespond = review.status === REVIEW_STATUS.approved;
  const clientName = review.clientUser?.fullName ?? '';

  return (
    <div className="mt-4 space-y-3">
      {(isPending || canRespond) && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={a11y.actionsGroup}>
          {isPending && (
            <>
              <button
                type="button"
                onClick={() => onApprove(review.id)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#22c55e] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#16a34a] disabled:opacity-50"
                aria-label={a11y.actionLabel(strings.approve, clientName)}
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                {strings.approve}
              </button>

              <button
                type="button"
                onClick={onOpenReject}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#ef4444] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#dc2626] disabled:opacity-50"
                aria-label={a11y.actionLabel(strings.reject, clientName)}
              >
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {strings.reject}
              </button>
            </>
          )}

          {canRespond && (
            <button
              type="button"
              onClick={onOpenRespond}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              aria-label={a11y.actionLabel(strings.respond, clientName)}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {review.adminResponse ? strings.editResponse : strings.respond}
            </button>
          )}
        </div>
      )}

      {/* Botón "Eliminar reseña": mismo estilo que el cliente (enlace de texto)
          y alineado abajo a la derecha. */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onOpenDelete}
          disabled={isLoading}
          className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
          aria-label={a11y.actionLabel(strings.delete, clientName)}
        >
          {strings.delete}
        </button>
      </div>
    </div>
  );
}
