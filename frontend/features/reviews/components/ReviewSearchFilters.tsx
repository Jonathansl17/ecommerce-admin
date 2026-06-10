'use client';

import { useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import type { ReviewSearchFiltersProps } from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';

const strings = REVIEWS_STRINGS;

const inputClass =
  'h-9 w-60 rounded-md border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary';

// Product/person search. Submits on Enter or the "Buscar" button; "Limpiar"
// resets both fields and clears the applied filters.
export function ReviewSearchFilters({ onSearch, onClear }: ReviewSearchFiltersProps) {
  const [product, setProduct] = useState('');
  const [client, setClient] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(product, client);
  };

  const handleClear = () => {
    setProduct('');
    setClient('');
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label={strings.a11y.searchForm}
      className="flex flex-wrap items-center gap-2"
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={strings.filters.productPlaceholder}
          aria-label={strings.a11y.productSearch}
          className={inputClass}
        />
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder={strings.filters.personPlaceholder}
          aria-label={strings.a11y.personSearch}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        {strings.filters.search}
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
        {strings.filters.clear}
      </button>
    </form>
  );
}
