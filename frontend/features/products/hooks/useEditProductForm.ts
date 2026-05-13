'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProductSchema } from '../shared/validators';
import type { EditProductFormData, Product } from '../types/products.types';

export function useEditProductForm(
  product: Product,
  onSave: (data: EditProductFormData) => Promise<void>
) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      status: product.status,
      minThreshold: product.minThreshold ?? null,
    },
  });

  const onFormSubmit = async (data: EditProductFormData) => {
    await onSave(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
  };
}
