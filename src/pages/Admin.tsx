import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AdminDashboardStats,
  type AdminOrderDetail,
  type AdminOrderSummary,
  fetchAdminOrderDetails,
  fetchAdminOrders,
  fetchAdminStats,
  updateAdminOrderStatus,
} from "../services/adminApi";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AdminLoginForm from "../components/admin/AdminLoginForm";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminOrdersFilterBar from "../components/admin/AdminOrdersFilterBar";
import AdminOrdersTable from "../components/admin/AdminOrdersTable";
import AdminOrderDetailModal from "../components/admin/AdminOrderDetailModal";

const ADMIN_STORAGE_KEY = "peptidelab_admin_key";

export default function AdminPage() {
  useDocumentTitle("Upravljačka ploča | PeptideLab");

  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

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
  }, [adminKey]);

  const loadDashboard = useCallback(async (key: string) => {
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
  }, []);

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
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }

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
        isLoading={isLoading}
        onRefresh={() => void loadDashboard(adminKey)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
      </main>

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
    </div>
  );
}
