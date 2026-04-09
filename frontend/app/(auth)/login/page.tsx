'use client';

import { useLoginForm } from './useLoginForm';
import { LoginForm } from './LoginForm';

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
