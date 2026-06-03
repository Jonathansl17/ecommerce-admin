'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import type { ToastProps } from './toast.types';
import { DISMISS_DURATION_MS, VARIANT_CLASSES } from './toast.constants';

export type { ToastVariant, ToastItem } from './toast.types';

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

function ToastIcon({ variant, iconBg, iconColor }: { variant: 'success' | 'error'; iconBg: string; iconColor: string }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
      {variant === 'success' ? (
        <Check className={`h-3.5 w-3.5 ${iconColor}`} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <AlertCircle className={`h-3.5 w-3.5 ${iconColor}`} aria-hidden="true" />
      )}
    </span>
  );
}

export function Toast({ message, variant = 'success', duration = 2800, onDismiss }: ToastProps) {
  const visible = useToastDismiss(duration, onDismiss);
  const { bar, iconBg, iconColor } = VARIANT_CLASSES[variant];

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
      <span className={`h-full w-1 self-stretch shrink-0 ${bar}`} aria-hidden="true" />
      <ToastIcon variant={variant} iconBg={iconBg} iconColor={iconColor} />
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
