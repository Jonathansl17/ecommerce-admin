'use client';

import { Eye, EyeOff } from 'lucide-react';
import type { PasswordVisibilityToggleProps } from '@/features/auth/types/auth.types';

export function PasswordVisibilityToggle({
  isVisible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground/60 transition-colors hover:text-foreground"
      aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      aria-pressed={isVisible}
    >
      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
