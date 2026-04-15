import { type ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  labelClassName?: string;
}

export function FormField({ id, label, error, children, labelClassName }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-medium text-foreground mb-1 ${labelClassName ?? 'text-sm'}`}
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
