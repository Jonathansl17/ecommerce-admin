'use client';

import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { RegisterSuccess } from '@/features/auth/components/RegisterSuccess';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  const { formData, loading, success, handleChange, handleSubmit, fieldError } =
    useRegisterForm();

  return success ? (
    <RegisterSuccess />
  ) : (
    <RegisterForm
      formData={formData}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldError={fieldError}
    />
  );
}
