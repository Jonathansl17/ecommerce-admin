export type ToastVariant = 'success' | 'error';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}
