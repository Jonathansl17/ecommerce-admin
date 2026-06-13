import { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError = false, className = '', children, ...props }: SelectProps) {
  const borderClass = hasError ? 'border-destructive' : 'border-input';

  return (
    <select
      className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
