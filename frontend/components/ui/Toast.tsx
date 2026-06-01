'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error';

/** Duration of the exit animation in ms. Must match the Tailwind duration class below. */
const DISMISS_DURATION_MS = 350;

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
}

const VARIANT_CONFIG = {
  success: {
    bar: 'bg-green-500',
    iconBg: 'bg-green-50',
    icon: <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={2.5} aria-hidden="true" />,
  },
  error: {
    bar: 'bg-red-500',
    iconBg: 'bg-red-50',
    icon: <AlertCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />,
  },
};

/**
 * Manages the visible state for a toast: entrance via rAF, auto-dismiss after
 * `duration` ms, then exit animation of `DISMISS_DURATION_MS` before `onDismiss` fires.
 */
function useToastDismiss(duration: number, onDismiss: () => void) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, DISMISS_DURATION_MS);
    }, duration);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
    };
  }, [duration, onDismiss]);

  return visible;
}

export function Toast({ message, variant = 'success', duration = 2800, onDismiss }: ToastProps) {
  const visible = useToastDismiss(duration, onDismiss);

  const { bar, iconBg, icon } = VARIANT_CONFIG[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={[
        'flex items-center gap-3 overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-border',
        `w-72 transition-all duration-[${DISMISS_DURATION_MS}ms] ease-out`,
        visible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-4 opacity-0 scale-95',
      ].join(' ')}
    >
      {/* Accent bar */}
      <span className={`h-full w-1 self-stretch shrink-0 ${bar}`} aria-hidden="true" />

      {/* Icon */}
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </span>

      {/* Message */}
      <p className="flex-1 py-3 pr-4 text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {children}
    </div>
  );
}
