import Link from 'next/link';
import { Tag, User, MessageSquare } from 'lucide-react';
import type { ReviewNotificationContentProps } from '../types/notifications.types';
import { NOTIFICATION_REVIEW_STRINGS as strings, ROUTES } from '../constants/notifications.constants';

function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} de 5 estrellas`} className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          // Both filled and empty stars use the same '★' character.
          // The visual distinction is handled entirely by CSS color class,
          // not by using a different character (e.g. '☆').
          className={i < rating ? 'text-amber-400' : 'text-muted-foreground/40'}
        >
          {'★'}
        </span>
      ))}
    </span>
  );
}

export function ReviewNotificationContent({ content }: ReviewNotificationContentProps) {
  const { productName, clientName, rating, reviewText } = content;

  return (
    <div className="mt-2 space-y-2 text-sm">
      {/* Metadata row: product · client · rating in one compact line */}
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            <p className="truncate font-medium text-foreground">{productName}</p>
          </div>
          <div className="flex items-center gap-1.5 pl-4">
            <User className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            <p className="truncate text-xs text-muted-foreground">{clientName}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <StarRating rating={rating} />
          <p className="text-xs text-muted-foreground">{rating}/5</p>
        </div>
      </div>

      {/* Review text: visually distinct section */}
      {reviewText && (
        <p
          className="border-l-2 border-border pl-2.5 text-muted-foreground"
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

      {/* Action: grouped with its content, not orphaned at card bottom */}
      <div className="pt-1">
        <Link
          href={ROUTES.REVIEWS}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {strings.moderateAction}
        </Link>
      </div>
    </div>
  );
}
