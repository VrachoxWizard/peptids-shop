import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  type AdminCreateBatchInput,
  type AdminCreateProductInput,
  type AdminProduct,
  createAdminBatch,
  createAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from "../../services/adminApi";

export function useAdminCatalog(adminKey: string) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<AdminProduct | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [selectedProductForBatch, setSelectedProductForBatch] =
    useState<AdminProduct | null>(null);
  const [isSavingBatch, setIsSavingBatch] = useState<boolean>(false);

  const loadProducts = useCallback(
    async (key = adminKey) => {
      if (!key) return;
      setIsLoadingProducts(true);
      try {
        const data = await fetchAdminProducts(key);
        setProducts(data);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Neuspjelo dohvaćanje artikala",
        );
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [adminKey],
  );

  const handleSaveProduct = useCallback(
    async (data: AdminCreateProductInput, id?: number) => {
      if (!adminKey) return;
      setIsSavingProduct(true);
      try {
        if (id) {
          await updateAdminProduct(adminKey, id, data);
          toast.success("Artikl uspješno ažuriran!");
        } else {
          await createAdminProduct(adminKey, data);
          toast.success("Novi artikl uspješno dodan u katalog!");
        }
        setIsProductModalOpen(false);
        setSelectedProductForEdit(null);
        await loadProducts(adminKey);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Greška pri spremanju artikla",
        );
      } finally {
        setIsSavingProduct(false);
      }
    },
    [adminKey, loadProducts],
  );

  const handleToggleProductActive = useCallback(
    async (product: AdminProduct) => {
      if (!adminKey) return;
      try {
        await updateAdminProduct(adminKey, product.id, {
          isActive: !product.isActive,
        });
        toast.success(
          product.isActive
            ? `Artikl ${product.nameHr} je deaktiviran.`
            : `Artikl ${product.nameHr} je aktiviran za prodaju.`,
        );
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isActive: !product.isActive } : p,
          ),
        );
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Greška pri promjeni statusa artikla",
        );
      }
    },
    [adminKey],
  );

  const handleSaveBatch = useCallback(
    async (data: AdminCreateBatchInput) => {
      if (!adminKey) return;
      setIsSavingBatch(true);
      try {
        await createAdminBatch(adminKey, data);
        toast.success(
          `Nova serija ${data.batchNumber} uspješno unesena sa zalihom od ${data.stockQuantity} kom!`,
        );
        setIsBatchModalOpen(false);
        setSelectedProductForBatch(null);
        await loadProducts(adminKey);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Greška pri unosu serije",
        );
      } finally {
        setIsSavingBatch(false);
      }
    },
    [adminKey, loadProducts],
  );

  const resetCatalogState = useCallback(() => {
    setProducts([]);
    setSelectedProductForEdit(null);
    setIsProductModalOpen(false);
    setSelectedProductForBatch(null);
    setIsBatchModalOpen(false);
  }, []);

  return {
    products,
    isLoadingProducts,
    isProductModalOpen,
    setIsProductModalOpen,
    selectedProductForEdit,
    setSelectedProductForEdit,
    isSavingProduct,
    isBatchModalOpen,
    setIsBatchModalOpen,
    selectedProductForBatch,
    setSelectedProductForBatch,
    isSavingBatch,
    loadProducts,
    handleSaveProduct,
    handleToggleProductActive,
    handleSaveBatch,
    resetCatalogState,
  };
}
