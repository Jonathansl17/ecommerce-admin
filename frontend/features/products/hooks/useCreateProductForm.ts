'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../shared/validators';
import type { CreateProductFormData } from '../types/products.types';

export function useCreateProductForm(onSave: (data: CreateProductFormData) => Promise<void>) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      status: 'active',
      imageUrl: '',
    },
  });

  const onFormSubmit = async (data: CreateProductFormData) => {
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
