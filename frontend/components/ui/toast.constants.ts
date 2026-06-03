import type { ToastVariant } from './toast.types';

export const DISMISS_DURATION_MS = 350;

export const VARIANT_CLASSES: Record<ToastVariant, { bar: string; iconBg: string; iconColor: string }> = {
  success: { bar: 'bg-green-500', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  error: { bar: 'bg-red-500', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
};
