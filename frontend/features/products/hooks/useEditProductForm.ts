'use client';

import { useForm, type Resolver } from 'react-hook-form';
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema) as Resolver<EditProductFormData>,
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      status: product.status,
      minThreshold: product.minThreshold ?? null,
      imageUrl: product.imageUrl ?? '',
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
    setValue,
    watch,
  };
}
