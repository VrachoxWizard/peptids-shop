import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AdminCreateBatchInput,
  type AdminCreateProductInput,
  type AdminDashboardStats,
  type AdminInquiry,
  type AdminOrderDetail,
  type AdminOrderSummary,
  type AdminProduct,
  createAdminBatch,
  createAdminProduct,
  fetchAdminInquiries,
  fetchAdminOrderDetails,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminStats,
  updateAdminInquiryStatus,
  updateAdminOrderStatus,
  updateAdminProduct,
} from "../services/adminApi";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AdminLoginForm from "../components/admin/AdminLoginForm";
import AdminHeader, { type AdminTab } from "../components/admin/AdminHeader";
import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminOrdersFilterBar from "../components/admin/AdminOrdersFilterBar";
import AdminOrdersTable from "../components/admin/AdminOrdersTable";
import AdminOrderDetailModal from "../components/admin/AdminOrderDetailModal";
import AdminProductsManager from "../components/admin/AdminProductsManager";
import AdminProductFormModal from "../components/admin/AdminProductFormModal";
import AdminNewBatchModal from "../components/admin/AdminNewBatchModal";
import AdminInquiriesTable from "../components/admin/AdminInquiriesTable";

const ADMIN_STORAGE_KEY = "peptidelab_admin_key";

export default function AdminPage() {
  useDocumentTitle("Upravljačka ploča | PeptideLab");

  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  // Orders & Dashboard state
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem(ADMIN_STORAGE_KEY));
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  const [editingStatus, setEditingStatus] = useState<string>("");
  const [editingTracking, setEditingTracking] = useState<string>("");
  const [editingCarrier, setEditingCarrier] = useState<string>("GLS");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Catalog & Batches state
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

  // Inquiries state
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState<boolean>(false);

  const loadProducts = useCallback(async (key: string) => {
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
  }, []);

  const loadInquiries = useCallback(async (key: string) => {
    setIsLoadingInquiries(true);
    try {
      const data = await fetchAdminInquiries(key);
      setInquiries(data);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Neuspjelo dohvaćanje upita",
      );
    } finally {
      setIsLoadingInquiries(false);
    }
  }, []);

  const loadDashboard = useCallback(
    async (key: string) => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const [statsData, ordersData] = await Promise.all([
          fetchAdminStats(key),
          fetchAdminOrders(key, {
            status: "ALL",
            search: "",
          }),
        ]);
        setStats(statsData);
        setOrders(ordersData.orders);
        setTotalOrdersCount(ordersData.total);
        setIsAuthenticated(true);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, key);

        // Također tiho učitaj artikle i upite za brzi tab switch
        void loadProducts(key);
        void loadInquiries(key);
      } catch (err: unknown) {
        setIsAuthenticated(false);
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setAuthError(
          err instanceof Error
            ? err.message
            : "Neispravan administratorski pristupni ključ.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [loadProducts, loadInquiries],
  );

  useEffect(() => {
    if (!adminKey) {
      return;
    }
    let isCancelled = false;

    const initDashboard = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          fetchAdminStats(adminKey),
          fetchAdminOrders(adminKey, {
            status: "ALL",
            search: "",
          }),
        ]);
        if (!isCancelled) {
          setStats(statsData);
          setOrders(ordersData.orders);
          setTotalOrdersCount(ordersData.total);
          setIsAuthenticated(true);

          void loadProducts(adminKey);
          void loadInquiries(adminKey);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setIsAuthenticated(false);
          sessionStorage.removeItem(ADMIN_STORAGE_KEY);
          setAuthError(
            err instanceof Error
              ? err.message
              : "Neispravan administratorski pristupni ključ.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initDashboard();

    return () => {
      isCancelled = true;
    };
  }, [adminKey, loadProducts, loadInquiries]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    const trimmedKey = keyInput.trim();
    setAdminKey(trimmedKey);
    await loadDashboard(trimmedKey);
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminKey("");
    setIsAuthenticated(false);
    setOrders([]);
    setStats(null);
    setProducts([]);
    setInquiries([]);
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }

  // --- Orders Handlers ---
  async function handleFilterChange(status: string) {
    setActiveStatusFilter(status);
    if (!adminKey) return;
    setIsLoading(true);
    try {
      const ordersData = await fetchAdminOrders(adminKey, {
        status,
        search: searchQuery,
      });
      setOrders(ordersData.orders);
      setTotalOrdersCount(ordersData.total);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Greška pri filtriranju narudžbi",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey) return;
    setIsLoading(true);
    try {
      const ordersData = await fetchAdminOrders(adminKey, {
        status: activeStatusFilter,
        search: searchQuery,
      });
      setOrders(ordersData.orders);
      setTotalOrdersCount(ordersData.total);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Greška pri pretraživanju",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function openOrderDetail(id: string) {
    setSelectedOrderId(id);
    setIsLoadingDetail(true);
    try {
      const detail = await fetchAdminOrderDetails(adminKey, id);
      setSelectedOrder(detail);
      setEditingStatus(detail.order.status);
      setEditingTracking(detail.order.trackingNumber || "");
      setEditingCarrier(detail.order.shippingCarrier || "GLS");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Neuspjelo otvaranje narudžbe",
      );
      setSelectedOrderId(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleSaveStatus() {
    if (!selectedOrderId || !adminKey) return;
    setIsUpdating(true);
    try {
      await updateAdminOrderStatus(adminKey, selectedOrderId, {
        status: editingStatus,
        trackingNumber: editingTracking.trim() || undefined,
        shippingCarrier: editingCarrier,
      });
      toast.success("Status narudžbe uspješno ažuriran!");
      const [updatedDetail, ordersData, statsData] = await Promise.all([
        fetchAdminOrderDetails(adminKey, selectedOrderId),
        fetchAdminOrders(adminKey, {
          status: activeStatusFilter,
          search: searchQuery,
        }),
        fetchAdminStats(adminKey),
      ]);
      setSelectedOrder(updatedDetail);
      setOrders(ordersData.orders);
      setStats(statsData);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Greška pri ažuriranju statusa",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function copyGlsLabelText() {
    if (!selectedOrder?.shippingAddress) return;
    const addr = selectedOrder.shippingAddress;
    const label = `${addr.recipientName}\n${addr.streetAddress}\n${addr.postalCode} ${addr.city}\n${addr.country}\nTel: ${addr.phoneNumber}\nRef: ${selectedOrder.order.orderNumber}`;
    navigator.clipboard.writeText(label);
    toast.success("GLS podaci za naljepnicu kopirani u međuspremnik.");
  }

  // --- Products & Batches Handlers ---
  async function handleSaveProduct(
    data: AdminCreateProductInput,
    id?: number,
  ) {
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
  }

  async function handleToggleProductActive(product: AdminProduct) {
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
  }

  async function handleSaveBatch(data: AdminCreateBatchInput) {
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
  }

  // --- Inquiries Handlers ---
  async function handleInquiryStatusChange(
    id: number,
    status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED",
  ) {
    if (!adminKey) return;
    try {
      await updateAdminInquiryStatus(adminKey, id, status);
      toast.success("Status upita ažuriran.");
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Greška pri ažuriranju upita",
      );
    }
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        keyInput={keyInput}
        onKeyChange={setKeyInput}
        onLogin={handleLogin}
        isLoading={isLoading}
        authError={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoading={isLoading || isLoadingProducts || isLoadingInquiries}
        onRefresh={() => {
          if (activeTab === "orders") void loadDashboard(adminKey);
          if (activeTab === "catalog") void loadProducts(adminKey);
          if (activeTab === "inquiries") void loadInquiries(adminKey);
        }}
        onLogout={handleLogout}
        inquiriesCount={newInquiriesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "orders" && (
          <>
            <AdminStatsGrid stats={stats} />

            <AdminOrdersFilterBar
              activeStatusFilter={activeStatusFilter}
              onFilterChange={(status) => void handleFilterChange(status)}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={(e) => void handleSearch(e)}
            />

            <AdminOrdersTable
              orders={orders}
              totalOrdersCount={totalOrdersCount}
              onSelectOrder={(id) => void openOrderDetail(id)}
            />
          </>
        )}

        {activeTab === "catalog" && (
          <AdminProductsManager
            products={products}
            isLoading={isLoadingProducts}
            onAddProduct={() => {
              setSelectedProductForEdit(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              setSelectedProductForEdit(p);
              setIsProductModalOpen(true);
            }}
            onAddBatch={(p) => {
              setSelectedProductForBatch(p);
              setIsBatchModalOpen(true);
            }}
            onToggleActive={(p) => void handleToggleProductActive(p)}
          />
        )}

        {activeTab === "inquiries" && (
          <AdminInquiriesTable
            inquiries={inquiries}
            isLoading={isLoadingInquiries}
            onStatusChange={handleInquiryStatusChange}
          />
        )}
      </main>

      {/* Modal za detalje narudžbe */}
      <AdminOrderDetailModal
        isOpen={Boolean(selectedOrderId)}
        selectedOrder={selectedOrder}
        isLoadingDetail={isLoadingDetail}
        onClose={() => {
          setSelectedOrderId(null);
          setSelectedOrder(null);
        }}
        editingStatus={editingStatus}
        onStatusChange={setEditingStatus}
        editingCarrier={editingCarrier}
        onCarrierChange={setEditingCarrier}
        editingTracking={editingTracking}
        onTrackingChange={setEditingTracking}
        onSaveStatus={() => void handleSaveStatus()}
        isUpdating={isUpdating}
        onCopyGlsLabel={copyGlsLabelText}
      />

      {/* Modal za dodavanje/uređivanje artikla */}
      <AdminProductFormModal
        isOpen={isProductModalOpen}
        product={selectedProductForEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProductForEdit(null);
        }}
        onSave={handleSaveProduct}
        isSaving={isSavingProduct}
      />

      {/* Modal za unos nove serije i zalihe artikla */}
      <AdminNewBatchModal
        isOpen={isBatchModalOpen}
        product={selectedProductForBatch}
        onClose={() => {
          setIsBatchModalOpen(false);
          setSelectedProductForBatch(null);
        }}
        onSave={handleSaveBatch}
        isSaving={isSavingBatch}
      />
    </div>
  );
}
