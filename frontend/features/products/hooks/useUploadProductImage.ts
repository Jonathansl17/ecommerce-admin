'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';

interface UploadImageResponse {
  id: string;
  url: string;
}

export function useUploadProductImage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiFetch<UploadImageResponse>(PRODUCTS_API.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      return res.url;
    } catch {
      setError(PRODUCTS_MESSAGES.image.uploadError);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, error };
}
