import type { ReviewNotificationContent as ReviewContent } from '../types/notifications.types';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.review;

interface ReviewNotificationContentProps {
  content: ReviewContent;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} de 5 estrellas`} className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ color: i < rating ? '#f59e0b' : undefined }}
          className={i < rating ? undefined : 'text-muted-foreground'}
        >
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

export function ReviewNotificationContent({ content }: ReviewNotificationContentProps) {
  const { productName, clientName, rating, reviewText, isPriority } = content;

  return (
    <div className="mt-2 space-y-3 text-sm">
      {isPriority && (
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          role="alert"
        >
          <span aria-hidden="true">&#9888;</span>
          <span className="font-medium">{strings.priorityBanner}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
              {strings.productLabel}
            </p>
            <p className="font-medium text-foreground">{productName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
              {strings.ratingLabel}
            </p>
            <StarRating rating={rating} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
            {strings.clientLabel}
          </p>
          <p className="text-muted-foreground">{clientName}</p>
        </div>

        {reviewText && (
          <p
            className="text-foreground"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {reviewText}
          </p>
        )}
      </div>
    </div>
  );
}
