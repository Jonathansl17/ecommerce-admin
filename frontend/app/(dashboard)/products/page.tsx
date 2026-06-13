'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '@/features/products/constants/api';
import { PRODUCTS_MESSAGES } from '@/features/products/constants/messages';
import { useAdjustSupplyStock } from '@/features/products/hooks/useAdjustSupplyStock';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';
import { useEditProduct } from '@/features/products/hooks/useEditProduct';
import { useDeleteProduct } from '@/features/products/hooks/useDeleteProduct';
import { productsReducer, initialProductsState } from '@/features/products/reducers/productsReducer';
import { ProductList } from '@/features/products/components/ProductList';
import { StockAdjustmentModal } from '@/features/products/components/StockAdjustmentModal';
import { StockMovementHistoryModal } from '@/features/products/components/StockMovementHistoryModal';
import { BulkStockAdjustmentTable } from '@/features/products/components/BulkStockAdjustmentTable';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';
import { EditProductModal } from '@/features/products/components/EditProductModal';
import { DeleteProductModal } from '@/features/products/components/DeleteProductModal';
import { ProductAlerts } from '@/features/stock-alerts/components/ProductAlerts';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';
import type {
  Product,
  AdjustStockForm,
  CreateProductFormData,
  EditProductFormData,
} from '@/features/products/types/products.types';

const strings = PRODUCTS_MESSAGES;

export default function ProductsPage() {
  const [state, dispatch] = useReducer(productsReducer, initialProductsState);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { adjustStock, error: adjustError } = useAdjustSupplyStock((updated) => {
    dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
    setAdjustingProduct(null);
    setHistoryRefreshKey((k) => k + 1);
  });

  const { create } = useCreateProduct(dispatch);
  const { edit } = useEditProduct(dispatch);
  const { remove } = useDeleteProduct(dispatch);

  const { page, setPage, totalPages, pageItems, total, pageSize, setPageSize } = usePagination(state.products);

  const loadProducts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await apiFetch<Product[]>(PRODUCTS_API.GET_ALL, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: strings.errors.fetchError });
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSave = async (id: string, data: AdjustStockForm) => {
    await adjustStock(id, data);
  };

  const handleBulkDone = () => {
    setIsBulkMode(false);
    loadProducts();
  };

  const handleCreate = async (data: CreateProductFormData) => {
    const dto = {
      name: data.name,
      price: data.price,
      status: data.status,
      ...(data.description ? { description: data.description } : {}),
      ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    };
    const product = await create(dto);
    if (product) {
      setIsCreateOpen(false);
    }
  };

  const handleEdit = async (data: EditProductFormData) => {
    if (!editingProduct) return;
    const dto = {
      name: data.name,
      price: data.price,
      status: data.status,
      description: data.description || null,
      minThreshold: data.minThreshold ?? null,
      imageUrl: data.imageUrl || null,
    };
    const product = await edit(editingProduct.id, dto);
    if (product) {
      setEditingProduct(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    const success = await remove(deletingProduct.id);
    if (success) {
      setDeletingProduct(null);
    }
  };

  const handleOpenCreate = () => {
    dispatch({ type: 'CREATE_CLEAR_ERROR' });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    dispatch({ type: 'CREATE_CLEAR_ERROR' });
    setIsCreateOpen(false);
  };

  const handleOpenEdit = (product: Product) => {
    dispatch({ type: 'UPDATE_CLEAR_ERROR' });
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    dispatch({ type: 'UPDATE_CLEAR_ERROR' });
    setEditingProduct(null);
  };

  const handleOpenDelete = (product: Product) => {
    dispatch({ type: 'DELETE_CLEAR_ERROR' });
    setDeletingProduct(product);
  };

  const handleCloseDelete = () => {
    dispatch({ type: 'DELETE_CLEAR_ERROR' });
    setDeletingProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isBulkMode ? strings.bulk.title : strings.page.title}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {isBulkMode ? strings.bulk.subtitle : strings.page.subtitle}
            </p>
          </div>

          {isBulkMode ? (
            <button
              onClick={() => setIsBulkMode(false)}
              className="shrink-0 rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              {strings.bulk.backToList}
            </button>
          ) : (
            <Link
              href="/products/report"
              className="shrink-0 rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              {strings.report.button}
            </Link>
          )}
        </div>

        {state.error ? (
          <p role="alert" className="text-sm text-red-500">
            {state.error}
          </p>
        ) : isBulkMode ? (
          <BulkStockAdjustmentTable products={state.products} onDone={handleBulkDone} />
        ) : (
          <>
            <ProductAlerts
              products={state.products}
              onAdjust={(product) => {
                setModalKey((k) => k + 1);
                setAdjustingProduct(product);
              }}
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenCreate}
                className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
              >
                {strings.create.addButton}
              </button>
              <button
                onClick={() => setIsBulkMode(true)}
                className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
              >
                {strings.bulk.title}
              </button>
            </div>
            <ProductList
            products={pageItems}
            onAdjust={(product) => {
              setModalKey((k) => k + 1);
              setAdjustingProduct(product);
            }}
            onHistory={(product) => setHistoryProduct(product)}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
          </>
        )}
      </div>

      {isCreateOpen && (
        <CreateProductModal
          onClose={handleCloseCreate}
          onSave={handleCreate}
          serverError={state.createError}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={handleCloseEdit}
          onSave={handleEdit}
          serverError={state.updateError}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          isDeleting={state.isDeleting}
          onClose={handleCloseDelete}
          onConfirm={handleDelete}
          serverError={state.deleteError}
        />
      )}

      <StockAdjustmentModal
        key={modalKey}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSave={handleSave}
        serverError={adjustError}
      />

      <StockMovementHistoryModal
        product={historyProduct}
        refreshKey={historyRefreshKey}
        onClose={() => setHistoryProduct(null)}
      />
    </>
  );
}
