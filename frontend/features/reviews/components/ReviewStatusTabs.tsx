'use client';

import type { ReviewStatusTabsProps } from '../types/reviews.types';
import {
  REVIEW_STATUS_FILTER_ALL,
  REVIEW_TAB_KEYS,
  REVIEWS_STRINGS,
} from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS;

export function ReviewStatusTabs({
  statusFilter,
  counts,
  onFilterChange,
}: ReviewStatusTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
      role="tablist"
      aria-label={strings.a11y.filterTabs}
    >
      {REVIEW_TAB_KEYS.map((key) => {
        const count = key === REVIEW_STATUS_FILTER_ALL ? counts.total : counts[key];
        const isActive = statusFilter === key;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(key)}
            className={[
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {strings.tabs[key]}
            <span
              className={[
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted-foreground/20 text-muted-foreground',
              ].join(' ')}
              aria-label={strings.a11y.countLabel(count)}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
