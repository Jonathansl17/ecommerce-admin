'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/features/password-recovery/components/ResetPasswordForm';
import { useResetPasswordForm } from '@/features/password-recovery/hooks/useResetPasswordForm';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const {
    formData,
    loading,
    validatingToken,
    isTokenValid,
    successMessage,
    generalMessage,
    handleChange,
    handleSubmit,
    fieldError,
  } = useResetPasswordForm(token);

  return (
    <ResetPasswordForm
      formData={formData}
      loading={loading}
      validatingToken={validatingToken}
      isTokenValid={isTokenValid}
      successMessage={successMessage}
      generalMessage={generalMessage}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldError={fieldError}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
