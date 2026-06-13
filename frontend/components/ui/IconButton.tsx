import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type IconButtonVariant = 'default' | 'primary' | 'danger';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — also used as tooltip (required for icon-only buttons). */
  label: string;
  variant?: IconButtonVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  default: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  primary: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  danger: 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
};

export function IconButton({
  label,
  variant = 'default',
  className = '',
  children,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
