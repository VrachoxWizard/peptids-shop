import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  type AdminDashboardStats,
  type AdminOrderDetail,
  type AdminOrderSummary,
  fetchAdminOrderDetails,
  fetchAdminOrders,
  fetchAdminStats,
  updateAdminOrderStatus,
} from "../../services/adminApi";

export function useAdminOrders(adminKey: string) {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  const [editingStatus, setEditingStatus] = useState<string>("");
  const [editingTracking, setEditingTracking] = useState<string>("");
  const [editingCarrier, setEditingCarrier] = useState<string>("GLS");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const loadOrdersAndStats = useCallback(
    async (key = adminKey, filter = activeStatusFilter, search = searchQuery) => {
      if (!key) return;
      setIsLoadingOrders(true);
      try {
        const [statsData, ordersData] = await Promise.all([
          fetchAdminStats(key),
          fetchAdminOrders(key, {
            status: filter,
            search,
          }),
        ]);
        setStats(statsData);
        setOrders(ordersData.orders);
        setTotalOrdersCount(ordersData.total);
      } finally {
        setIsLoadingOrders(false);
      }
    },
    [adminKey, activeStatusFilter, searchQuery],
  );

  const handleFilterChange = useCallback(
    async (status: string) => {
      setActiveStatusFilter(status);
      if (!adminKey) return;
      setIsLoadingOrders(true);
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
        setIsLoadingOrders(false);
      }
    },
    [adminKey, searchQuery],
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!adminKey) return;
      setIsLoadingOrders(true);
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
        setIsLoadingOrders(false);
      }
    },
    [adminKey, activeStatusFilter, searchQuery],
  );

  const openOrderDetail = useCallback(
    async (id: string) => {
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
    },
    [adminKey],
  );

  const closeOrderDetail = useCallback(() => {
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }, []);

  const handleSaveStatus = useCallback(async () => {
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
  }, [
    adminKey,
    selectedOrderId,
    editingStatus,
    editingTracking,
    editingCarrier,
    activeStatusFilter,
    searchQuery,
  ]);

  const copyGlsLabelText = useCallback(() => {
    if (!selectedOrder?.shippingAddress) return;
    const addr = selectedOrder.shippingAddress;
    const label = `${addr.recipientName}\n${addr.streetAddress}\n${addr.postalCode} ${addr.city}\n${addr.country}\nTel: ${addr.phoneNumber}\nRef: ${selectedOrder.order.orderNumber}`;
    navigator.clipboard.writeText(label);
    toast.success("GLS podaci za naljepnicu kopirani u međuspremnik.");
  }, [selectedOrder]);

  const resetOrdersState = useCallback(() => {
    setOrders([]);
    setStats(null);
    setTotalOrdersCount(0);
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }, []);

  return {
    stats,
    orders,
    totalOrdersCount,
    activeStatusFilter,
    searchQuery,
    setSearchQuery,
    isLoadingOrders,
    selectedOrderId,
    selectedOrder,
    isLoadingDetail,
    editingStatus,
    setEditingStatus,
    editingTracking,
    setEditingTracking,
    editingCarrier,
    setEditingCarrier,
    isUpdating,
    loadOrdersAndStats,
    handleFilterChange,
    handleSearch,
    openOrderDetail,
    closeOrderDetail,
    handleSaveStatus,
    copyGlsLabelText,
    resetOrdersState,
  };
}
