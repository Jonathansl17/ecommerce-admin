import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError = false, className = '', ...props }: InputProps) {
  const baseClasses =
    'w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/30';
  const errorClasses = hasError
    ? 'border-red-500'
    : 'border-foreground/20';

  return (
    <input
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
}
