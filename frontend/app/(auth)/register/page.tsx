'use client';

import { useRegisterForm } from './useRegisterForm';
import { RegisterSuccess } from './RegisterSuccess';
import { RegisterForm } from './RegisterForm';

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
