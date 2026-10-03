import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Lock,
  LogOut,
  Mail,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  const [editingStatus, setEditingStatus] = useState<string>("");
  const [editingTracking, setEditingTracking] = useState<string>("");
  const [editingCarrier, setEditingCarrier] = useState<string>("GLS");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Provjeri ključ pri učitavanju ako postoji u sessionStorage
  useEffect(() => {
    if (adminKey) {
      loadDashboard(adminKey);
    }
  }, []);

  async function loadDashboard(key: string) {
    setIsLoading(true);
    setAuthError(null);
    try {
      const [statsData, ordersData] = await Promise.all([
        fetchAdminStats(key),
        fetchAdminOrders(key, {
          status: activeStatusFilter,
          search: searchQuery,
        }),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
      setTotalOrdersCount(ordersData.total);
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, key);
    } catch (err: any) {
      setIsAuthenticated(false);
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      setAuthError(err.message || "Neispravan administratorski pristupni ključ.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    await loadDashboard(keyInput.trim());
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
    } catch (err: any) {
      toast.error(err.message || "Greška pri filtriranju narudžbi");
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
    } catch (err: any) {
      toast.error(err.message || "Greška pri pretraživanju");
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
    } catch (err: any) {
      toast.error(err.message || "Neuspjelo otvaranje narudžbe");
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
      // Osvježi detalje i listu
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
    } catch (err: any) {
      toast.error(err.message || "Greška pri ažuriranju statusa");
    } finally {
      setIsUpdating(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopirano u međuspremnik.`);
  }

  function copyGlsLabelText() {
    if (!selectedOrder?.shippingAddress) return;
    const addr = selectedOrder.shippingAddress;
    const label = `${addr.recipientName}\n${addr.streetAddress}\n${addr.postalCode} ${addr.city}\n${addr.country}\nTel: ${addr.phoneNumber}\nRef: ${selectedOrder.order.orderNumber}`;
    copyToClipboard(label, "GLS podaci za naljepnicu");
  }

  // 1. Ekran za unos administratorskog ključa (PIN / Secret)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-4 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              PeptideLab Kontrolni Panel
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Autentifikacija za upravljanje narudžbama i serijama istraživačkih spojeva.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-key-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
              >
                Administratorski tajni ključ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-key-input"
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Unesite ADMIN_API_KEY..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 font-mono text-sm"
                  autoFocus
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-cyan-950 hover:bg-cyan-900 text-white font-medium rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Provjera vjerodajnica...</span>
                </>
              ) : (
                <span>Prijavi se u sustav</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-mono">
              Sigurnosni protokol: Timing-Safe SHA & Rate Limit Guard
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Glavna administratorska radna površina
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Gornja kontrolna traka */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  PeptideLab Sustav za Narudžbe
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full">
                  Aktivan
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pregled pošiljki, dodijeljenih serija i HUB3 virmana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadDashboard(adminKey)}
              disabled={isLoading}
              title="Osvježi podatke"
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Odjava</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Metrike poslovanja */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Čeka isporuku
                </span>
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {stats.pendingFulfillment}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Narudžbe sa statusom Potvrđeno
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ukupno narudžbi
                </span>
                <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {stats.totalOrders}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Evidentirano u bazi podataka
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ukupna bruto vrijednost
                </span>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">
                {stats.totalRevenue.toFixed(2)} {stats.currency}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Promet kroz webshop
              </p>
            </div>
          </div>
        )}

        {/* Filteri i tražilica */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter tabovi */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: "Sve", value: "ALL" },
                { label: "Potvrđeno", value: "CONFIRMED" },
                { label: "U obradi", value: "PROCESSING" },
                { label: "Poslano", value: "SHIPPED" },
                { label: "Isporučeno", value: "DELIVERED" },
                { label: "Otkazano", value: "CANCELLED" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeStatusFilter === tab.value
                      ? "bg-cyan-950 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tražilica */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Traži broj, ime, tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-800"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
              >
                Traži
              </button>
            </form>
          </div>
        </div>

        {/* Tablica narudžbi */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Broj narudžbe</th>
                  <th className="py-3 px-4">Datum</th>
                  <th className="py-3 px-4">Kupac & Kontakt</th>
                  <th className="py-3 px-4">Način plaćanja</th>
                  <th className="py-3 px-4">Iznos</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Praćenje (GLS)</th>
                  <th className="py-3 px-4 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Nema narudžbi koje odgovaraju odabranim kriterijima.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusColors: Record<string, string> = {
                      CONFIRMED: "bg-amber-50 text-amber-700 border-amber-200",
                      PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
                      SHIPPED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      DELIVERED: "bg-slate-100 text-slate-600 border-slate-200",
                      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
                    };

                    const paymentLabels: Record<string, string> = {
                      cod: "Pouzeće",
                      keks: "Keks Pay",
                      transfer: "Virman / HUB3",
                    };

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/80 transition cursor-pointer"
                        onClick={() => openOrderDetail(order.id)}
                      >
                        <td className="py-3.5 px-4 font-mono font-semibold text-cyan-950">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString("hr-HR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">
                            {order.customerName}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            {order.customerPhone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          {paymentLabels[order.paymentMethod] || order.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {order.total.toFixed(2)} {order.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                              statusColors[order.status] || "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {order.trackingNumber ? (
                            <span className="text-cyan-800 font-medium">
                              {order.shippingCarrier || "GLS"}: {order.trackingNumber}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderDetail(order.id);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-medium transition shadow-2xs"
                          >
                            Pregled
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Prikazano: {orders.length} narudžbi</span>
            <span>Ukupno u sustavu: {totalOrdersCount}</span>
          </div>
        </div>
      </main>

      {/* Modal / Ladica s detaljima narudžbe */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl">
            {isLoadingDetail || !selectedOrder ? (
              <div className="p-12 text-center text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-800" />
                <span>Učitavanje detalja narudžbe...</span>
              </div>
            ) : (
              <div>
                {/* Header modala */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50 rounded-t-2xl">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold font-mono text-slate-900">
                        {selectedOrder.order.orderNumber}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        RUO Izjava Verificirana
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Zaprimljeno:{" "}
                      {new Date(selectedOrder.order.createdAt).toLocaleString("hr-HR")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrderId(null);
                      setSelectedOrder(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status & Fulfillment upravljač */}
                  <div className="p-4 bg-cyan-50/60 border border-cyan-100 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-950 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-cyan-700" />
                      Status Isporuke i Praćenje Pošiljke
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Status narudžbe
                        </label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-cyan-800"
                        >
                          <option value="CONFIRMED">Potvrđeno (CONFIRMED)</option>
                          <option value="PROCESSING">U pripremi (PROCESSING)</option>
                          <option value="SHIPPED">Poslano (SHIPPED)</option>
                          <option value="DELIVERED">Isporučeno (DELIVERED)</option>
                          <option value="CANCELLED">Otkazano (CANCELLED)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Kurirska služba
                        </label>
                        <select
                          value={editingCarrier}
                          onChange={(e) => setEditingCarrier(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-cyan-800"
                        >
                          <option value="GLS">GLS Croatia</option>
                          <option value="DPD">DPD Croatia</option>
                          <option value="HP Paket24">Hrvatska Pošta (Paket24)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Kod za praćenje (Tracking)
                        </label>
                        <input
                          type="text"
                          value={editingTracking}
                          onChange={(e) => setEditingTracking(e.target.value)}
                          placeholder="npr. 123456789"
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-cyan-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveStatus}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                      >
                        {isUpdating ? "Spremanje..." : "Ažuriraj status i praćenje"}
                      </button>
                    </div>
                  </div>

                  {/* Kupac i Podaci za dostavu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Podaci za dostavu
                        </span>
                        <button
                          onClick={copyGlsLabelText}
                          className="flex items-center gap-1 text-[11px] text-cyan-800 hover:text-cyan-950 font-medium"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopiraj za GLS</span>
                        </button>
                      </div>

                      {selectedOrder.shippingAddress && (
                        <div className="text-xs space-y-1 text-slate-800 font-sans">
                          <p className="font-semibold text-sm">
                            {selectedOrder.shippingAddress.recipientName}
                          </p>
                          <p>{selectedOrder.shippingAddress.streetAddress}</p>
                          <p>
                            {selectedOrder.shippingAddress.postalCode}{" "}
                            {selectedOrder.shippingAddress.city},{" "}
                            {selectedOrder.shippingAddress.country}
                          </p>
                          <div className="pt-2 flex items-center gap-1.5 text-slate-600 font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedOrder.shippingAddress.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedOrder.order.customerEmail}</span>
                          </div>

                          {selectedOrder.shippingAddress.companyName && (
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-700">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                R1: {selectedOrder.shippingAddress.companyName} (OIB:{" "}
                                {selectedOrder.shippingAddress.companyOib})
                              </span>
                            </div>
                          )}

                          {selectedOrder.shippingAddress.deliveryInstructions && (
                            <p className="mt-2 text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                              Napomena dostavljaču: "
                              {selectedOrder.shippingAddress.deliveryInstructions}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Plaćanje & Sukladnost
                      </span>
                      <div className="text-xs space-y-2 text-slate-700">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Način plaćanja:</span>
                          <span className="font-semibold uppercase text-slate-900">
                            {selectedOrder.order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Status uplate:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedOrder.order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Iznos stavki:</span>
                          <span className="font-mono">
                            {selectedOrder.order.subtotal.toFixed(2)} EUR
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Dostava:</span>
                          <span className="font-mono">
                            {selectedOrder.order.shippingFee.toFixed(2)} EUR
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-sm font-bold text-slate-900">
                          <span>Ukupno:</span>
                          <span className="font-mono">
                            {selectedOrder.order.total.toFixed(2)} EUR
                          </span>
                        </div>
                        <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                          Prihvaćen RUO uvjet:{" "}
                          {new Date(
                            selectedOrder.order.ruoAcceptedAt,
                          ).toLocaleString("hr-HR")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Naručeni peptidi i dodijeljene serije */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                      <span>Naručeni Istraživački Peptidi & Serije</span>
                      <span className="text-[11px] font-mono lowercase">
                        {selectedOrder.items.length} stavka/i
                      </span>
                    </div>
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-4">Proizvod</th>
                          <th className="py-2 px-4">Dodijeljena Serija (LOT)</th>
                          <th className="py-2 px-4 text-center">Čistoća</th>
                          <th className="py-2 px-4 text-center">Količina</th>
                          <th className="py-2 px-4 text-right">Ukupno</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-medium text-slate-900">
                              {item.productName}
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-cyan-800">
                              {item.batchNumber ? (
                                <span className="bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                  {item.batchNumber}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Nije dodijeljeno</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center font-mono">
                              {item.purityPercentage ? (
                                <span className="text-emerald-700 font-bold">
                                  {item.purityPercentage.toFixed(1)}%
                                </span>
                              ) : (
                                "≥98.0%"
                              )}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold">
                              {item.quantity} kom
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              {item.totalPrice.toFixed(2)} EUR
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Audit Trail zapis */}
                  <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Dnevnik Revizije (Audit Log)
                    </span>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-600 max-h-36 overflow-y-auto">
                      {selectedOrder.auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 bg-white border border-slate-200 rounded flex justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-slate-800 mr-2">
                              {log.action}
                            </span>
                            <span className="text-slate-500">{log.details}</span>
                          </div>
                          <span className="text-slate-400 shrink-0">
                            {new Date(log.createdAt).toLocaleTimeString("hr-HR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
