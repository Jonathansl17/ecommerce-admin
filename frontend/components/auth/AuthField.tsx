'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { PasswordVisibilityToggle } from '@/components/auth/PasswordVisibilityToggle';
import type { AuthFieldProps } from '@/features/auth/types/auth.types';

export function AuthField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: AuthFieldProps) {
  const isPasswordField = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

  return (
    <FormField id={id} label={label} error={error}>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          hasError={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={autoComplete}
          className={isPasswordField ? 'pr-11' : ''}
        />

        {isPasswordField ? (
          <PasswordVisibilityToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((prev) => !prev)}
          />
        ) : null}
      </div>
    </FormField>
  );
}
