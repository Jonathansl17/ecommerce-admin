type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface StatusDotProps {
  tone?: StatusTone;
  className?: string;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-muted-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
};

export function StatusDot({ tone = 'neutral', className = '' }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${TONE_CLASSES[tone]} ${className}`}
    />
  );
}
