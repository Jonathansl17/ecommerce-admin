import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
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
  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        hasError={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete={autoComplete}
      />
    </FormField>
  );
}
