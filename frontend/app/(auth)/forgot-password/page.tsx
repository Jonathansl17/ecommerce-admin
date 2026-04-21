'use client';

import { ForgotPasswordForm } from '@/features/password-recovery/components/ForgotPasswordForm';
import { useForgotPasswordForm } from '@/features/password-recovery/hooks/useForgotPasswordForm';

export default function ForgotPasswordPage() {
  const {
    formData,
    loading,
    successMessage,
    handleChange,
    handleSubmit,
    fieldError,
  } = useForgotPasswordForm();

  return (
    <ForgotPasswordForm
      formData={formData}
      loading={loading}
      successMessage={successMessage}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldError={fieldError}
    />
  );
}
