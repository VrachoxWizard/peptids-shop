import React, { useEffect, useState } from "react";
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

import { useAdminAuth } from "../hooks/admin/useAdminAuth";
import { useAdminOrders } from "../hooks/admin/useAdminOrders";
import { useAdminCatalog } from "../hooks/admin/useAdminCatalog";
import { useAdminInquiries } from "../hooks/admin/useAdminInquiries";

export default function AdminPage() {
  useDocumentTitle("Upravljačka ploča | PeptideLab");

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  const {
    adminKey,
    isAuthenticated,
    setIsAuthenticated,
    keyInput,
    setKeyInput,
    authError,
    setAuthError,
    isLoadingAuth,
    setIsLoadingAuth,
    handleLogin: authLogin,
    handleLogout: authLogout,
  } = useAdminAuth();

  const ordersDomain = useAdminOrders(adminKey);
  const catalogDomain = useAdminCatalog(adminKey);
  const inquiriesDomain = useAdminInquiries(adminKey);

  // Initial dashboard authentication and bootstrap on mount
  useEffect(() => {
    if (!adminKey) return;
    let isCancelled = false;

    const initDashboard = async () => {
      try {
        await ordersDomain.loadOrdersAndStats(adminKey, "ALL", "");
        if (!isCancelled) {
          setIsAuthenticated(true);
          void catalogDomain.loadProducts(adminKey);
          void inquiriesDomain.loadInquiries(adminKey);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          authLogout();
          setAuthError(
            err instanceof Error
              ? err.message
              : "Neispravan administratorski pristupni ključ.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingAuth(false);
        }
      }
    };

    void initDashboard();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const handleLogin = async (e: React.FormEvent) => {
    await authLogin(e, async (trimmedKey) => {
      await ordersDomain.loadOrdersAndStats(trimmedKey, "ALL", "");
      void catalogDomain.loadProducts(trimmedKey);
      void inquiriesDomain.loadInquiries(trimmedKey);
    });
  };

  const handleLogout = () => {
    authLogout(() => {
      ordersDomain.resetOrdersState();
      catalogDomain.resetCatalogState();
      inquiriesDomain.resetInquiriesState();
    });
  };

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        keyInput={keyInput}
        onKeyChange={setKeyInput}
        onLogin={handleLogin}
        isLoading={isLoadingAuth}
        authError={authError}
      />
    );
  }

  const isGlobalLoading =
    ordersDomain.isLoadingOrders ||
    catalogDomain.isLoadingProducts ||
    inquiriesDomain.isLoadingInquiries;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoading={isGlobalLoading}
        onRefresh={() => {
          if (activeTab === "orders") void ordersDomain.loadOrdersAndStats();
          if (activeTab === "catalog") void catalogDomain.loadProducts();
          if (activeTab === "inquiries") void inquiriesDomain.loadInquiries();
        }}
        onLogout={handleLogout}
        inquiriesCount={inquiriesDomain.newInquiriesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "orders" && (
          <>
            <AdminStatsGrid stats={ordersDomain.stats} />

            <AdminOrdersFilterBar
              activeStatusFilter={ordersDomain.activeStatusFilter}
              onFilterChange={(status) => void ordersDomain.handleFilterChange(status)}
              searchQuery={ordersDomain.searchQuery}
              onSearchQueryChange={ordersDomain.setSearchQuery}
              onSearch={(e) => void ordersDomain.handleSearch(e)}
            />

            <AdminOrdersTable
              orders={ordersDomain.orders}
              totalOrdersCount={ordersDomain.totalOrdersCount}
              onSelectOrder={(id) => void ordersDomain.openOrderDetail(id)}
            />
          </>
        )}

        {activeTab === "catalog" && (
          <AdminProductsManager
            products={catalogDomain.products}
            isLoading={catalogDomain.isLoadingProducts}
            onAddProduct={() => {
              catalogDomain.setSelectedProductForEdit(null);
              catalogDomain.setIsProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              catalogDomain.setSelectedProductForEdit(p);
              catalogDomain.setIsProductModalOpen(true);
            }}
            onAddBatch={(p) => {
              catalogDomain.setSelectedProductForBatch(p);
              catalogDomain.setIsBatchModalOpen(true);
            }}
            onToggleActive={(p) => void catalogDomain.handleToggleProductActive(p)}
          />
        )}

        {activeTab === "inquiries" && (
          <AdminInquiriesTable
            inquiries={inquiriesDomain.inquiries}
            isLoading={inquiriesDomain.isLoadingInquiries}
            onStatusChange={inquiriesDomain.handleInquiryStatusChange}
          />
        )}
      </main>

      {/* Modal za detalje narudžbe */}
      <AdminOrderDetailModal
        isOpen={Boolean(ordersDomain.selectedOrderId)}
        selectedOrder={ordersDomain.selectedOrder}
        isLoadingDetail={ordersDomain.isLoadingDetail}
        onClose={ordersDomain.closeOrderDetail}
        editingStatus={ordersDomain.editingStatus}
        onStatusChange={ordersDomain.setEditingStatus}
        editingCarrier={ordersDomain.editingCarrier}
        onCarrierChange={ordersDomain.setEditingCarrier}
        editingTracking={ordersDomain.editingTracking}
        onTrackingChange={ordersDomain.setEditingTracking}
        onSaveStatus={() => void ordersDomain.handleSaveStatus()}
        isUpdating={ordersDomain.isUpdating}
        onCopyGlsLabel={ordersDomain.copyGlsLabelText}
      />

      {/* Modal za dodavanje/uređivanje artikla */}
      <AdminProductFormModal
        isOpen={catalogDomain.isProductModalOpen}
        product={catalogDomain.selectedProductForEdit}
        onClose={() => {
          catalogDomain.setIsProductModalOpen(false);
          catalogDomain.setSelectedProductForEdit(null);
        }}
        onSave={catalogDomain.handleSaveProduct}
        isSaving={catalogDomain.isSavingProduct}
      />

      {/* Modal za unos nove serije i zalihe artikla */}
      <AdminNewBatchModal
        isOpen={catalogDomain.isBatchModalOpen}
        product={catalogDomain.selectedProductForBatch}
        onClose={() => {
          catalogDomain.setIsBatchModalOpen(false);
          catalogDomain.setSelectedProductForBatch(null);
        }}
        onSave={catalogDomain.handleSaveBatch}
        isSaving={catalogDomain.isSavingBatch}
      />
    </div>
  );
}
