'use client';

import { useState } from 'react';
import { deleteSupply } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

export function useDeleteSupply(onDeleted: (id: string) => void) {
  const [deletingSupply, setDeletingSupply] = useState<Supply | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDelete = (supply: Supply) => { setDeleteError(null); setDeletingSupply(supply); };
  const closeDelete = () => { setDeletingSupply(null); setDeleteError(null); };

  const handleDelete = async () => {
    if (!deletingSupply) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteSupply(deletingSupply.id);
      onDeleted(deletingSupply.id);
      setDeletingSupply(null);
    } catch {
      setDeleteError(INVENTORY_STRINGS.delete.deleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletingSupply, isDeleting, deleteError, openDelete, closeDelete, handleDelete };
}
