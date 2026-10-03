import { getApiBaseUrl } from "./apiClient";

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  currency: string;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "cod" | "keks" | "transfer";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
  createdAt: string;
}

export interface AdminOrderDetail {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    currency: string;
    status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    paymentMethod: "cod" | "keks" | "transfer";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
    trackingNumber?: string | null;
    shippingCarrier?: string | null;
    ruoAccepted: boolean;
    ruoAcceptedAt: string;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  shippingAddress: {
    recipientName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    companyName?: string | null;
    companyOib?: string | null;
    deliveryInstructions?: string | null;
  } | null;
  items: Array<{
    id: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    batchNumber?: string | null;
    purityPercentage?: number | null;
    expiryDate?: string | null;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: string;
  }>;
}

export interface AdminDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingFulfillment: number;
  currency: string;
}

export async function fetchAdminStats(adminKey: string): Promise<AdminDashboardStats> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/stats`, {
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    throw new Error(res.status === 401 || res.status === 403 ? "Neispravan administratorski ključ." : "Greška pri dohvaćanju statistike.");
  }

  const json = await res.json();
  return json.data;
}

export async function fetchAdminOrders(
  adminKey: string,
  params: { status?: string; search?: string } = {},
): Promise<{ orders: AdminOrderSummary[]; total: number }> {
  const baseUrl = getApiBaseUrl();
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }

  const url = `${baseUrl}/admin/orders${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const res = await fetch(url, {
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    throw new Error("Neuspjelo dohvaćanje narudžbi.");
  }

  const json = await res.json();
  return {
    orders: json.data,
    total: json.pagination.total,
  };
}

export async function fetchAdminOrderDetails(
  adminKey: string,
  orderId: string,
): Promise<AdminOrderDetail> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/orders/${orderId}`, {
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    throw new Error("Neuspjelo učitavanje detalja narudžbe.");
  }

  const json = await res.json();
  return json.data;
}

export async function updateAdminOrderStatus(
  adminKey: string,
  orderId: string,
  payload: {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    shippingCarrier?: string;
    note?: string;
  },
) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || "Greška pri ažuriranju statusa narudžbe.");
  }

  const json = await res.json();
  return json.data;
}
