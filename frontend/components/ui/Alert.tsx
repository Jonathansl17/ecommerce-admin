import { type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<AlertVariant, { wrap: string; icon: typeof Info }> = {
  success: { wrap: 'border-success/30 bg-success/10 text-success', icon: CheckCircle2 },
  warning: { wrap: 'border-warning/40 bg-warning/15 text-warning-foreground', icon: AlertTriangle },
  danger: { wrap: 'border-destructive/30 bg-destructive/10 text-destructive', icon: AlertCircle },
  info: { wrap: 'border-info/30 bg-info/10 text-info', icon: Info },
};

export function Alert({ variant = 'info', title, children, className = '' }: AlertProps) {
  const { wrap, icon: Icon } = VARIANT_CONFIG[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${wrap} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
      </div>
    </div>
  );
}
