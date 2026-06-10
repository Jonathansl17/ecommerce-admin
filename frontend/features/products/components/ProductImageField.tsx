'use client';

import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useUploadProductImage } from '../hooks/useUploadProductImage';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { PRODUCT_IMAGE_VALIDATION } from '../constants/validation';

const strings = PRODUCTS_MESSAGES.image;

interface ProductImageFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function ProductImageField({ value, onChange }: ProductImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error } = useUploadProductImage();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={PRODUCT_IMAGE_VALIDATION.ACCEPT}
        onChange={handleFile}
        className="hidden"
      />
      {value ? (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-md border border-foreground/20 object-cover"
          />
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="rounded-md border border-foreground/20 px-3 py-1 text-sm text-foreground/70 hover:bg-foreground/5 disabled:opacity-50"
            >
              {isUploading ? strings.uploadingButton : strings.changeButton}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={isUploading}
              className="rounded-md border border-red-500/40 px-3 py-1 text-sm text-red-500 hover:bg-red-500/5 disabled:opacity-50"
            >
              {strings.removeButton}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 disabled:opacity-50"
        >
          {isUploading ? strings.uploadingButton : strings.uploadButton}
        </button>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
