'use client';

import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const { formData, loading, handleChange, handleSubmit, fieldError } =
    useLoginForm();

  return (
    <LoginForm
      formData={formData}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldError={fieldError}
    />
  );
}
