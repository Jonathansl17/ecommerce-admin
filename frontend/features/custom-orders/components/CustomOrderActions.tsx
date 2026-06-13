import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CUSTOM_ORDER_CARD_STRINGS as strings } from '../constants/customOrders.constants';
import type { CustomOrderActionsProps } from '../types/customOrders.types';

export function CustomOrderActions({
  notificationId,
  orderId,
  isPending,
  isAccepted,
  clientEmail,
  onStatusUpdate,
}: CustomOrderActionsProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await onStatusUpdate(notificationId, 'accepted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onStatusUpdate(notificationId, 'rejected', rejectionReason.trim() || undefined);
      setIsRejecting(false);
      setRejectionReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setIsRejecting(false);
    setRejectionReason('');
  };

  if (isAccepted && clientEmail) {
    return (
      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <a
          href={`mailto:${clientEmail}?subject=${strings.contactSubject(orderId)}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {strings.contactLabel}
        </a>
      </div>
    );
  }

  if (!isPending) return null;

  if (isRejecting) {
    return (
      <div className="mt-3 space-y-2 border-t border-border pt-3">
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder={strings.rejectionPlaceholder}
          rows={2}
          disabled={isSubmitting}
          aria-label={strings.rejectionReasonLabel}
          className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRejectConfirm}
            disabled={isSubmitting}
            aria-label={strings.ariaConfirmReject}
          >
            {isSubmitting ? strings.loadingLabel : strings.actionConfirmReject}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectCancel}
            disabled={isSubmitting}
            aria-label={strings.ariaCancelReject}
          >
            {strings.actionCancelReject}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
      <Button
        variant="success"
        size="sm"
        onClick={handleAccept}
        disabled={isSubmitting}
        aria-label={strings.ariaAccept(orderId)}
      >
        {strings.actionAccept}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRejecting(true)}
        disabled={isSubmitting}
        aria-label={strings.ariaReject(orderId)}
      >
        {strings.actionReject}
      </Button>
    </div>
  );
}
