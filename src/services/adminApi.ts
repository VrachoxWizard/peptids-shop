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

export interface AdminProduct {
  id: number;
  slug: string;
  nameHr: string;
  nameEn?: string | null;
  category: string;
  categoryEn?: string | null;
  descriptionHr: string;
  descriptionEn?: string | null;
  amount: string;
  price: number;
  imageUrl?: string | null;
  featured: boolean;
  purity?: string | null;
  casNumber?: string | null;
  molecularWeight?: string | null;
  isActive: boolean;
  stockQuantity: number;
  currentBatch?: {
    id: number;
    batchNumber: string;
    purityPercentage?: string | number | null;
    stockQuantity: number;
    expiryDate?: string | null;
    isReleased: boolean;
  } | null;
}

export interface AdminCreateProductInput {
  slug: string;
  nameHr: string;
  nameEn?: string;
  category: string;
  categoryEn?: string;
  descriptionHr: string;
  descriptionEn?: string;
  amount: string;
  price: number;
  imageUrl?: string;
  featured?: boolean;
  purity?: string;
  casNumber?: string;
  molecularWeight?: string;
  isActive?: boolean;
}

export interface AdminCreateBatchInput {
  productId: number;
  batchNumber: string;
  purityPercentage?: number;
  synthesisDate?: string;
  expiryDate?: string;
  coaPdfUrl?: string;
  stockQuantity: number;
  isReleased?: boolean;
}

export interface AdminInquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  ipAddress?: string | null;
  status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED";
  createdAt: string;
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

export async function fetchAdminProducts(adminKey: string): Promise<AdminProduct[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/products`, {
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    throw new Error("Neuspjelo dohvaćanje kataloga artikala.");
  }

  const json = await res.json();
  return json.data;
}

export async function createAdminProduct(
  adminKey: string,
  data: AdminCreateProductInput,
): Promise<AdminProduct> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjelo dodavanje artikla.");
  }

  const json = await res.json();
  return json.data;
}

export async function updateAdminProduct(
  adminKey: string,
  id: number,
  data: Partial<AdminCreateProductInput>,
): Promise<AdminProduct> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjelo ažuriranje artikla.");
  }

  const json = await res.json();
  return json.data;
}

export async function deleteAdminProduct(
  adminKey: string,
  id: number,
): Promise<{ id: number; slug: string; isActive: boolean }> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjela deaktivacija artikla.");
  }

  const json = await res.json();
  return json.data;
}

export async function createAdminBatch(
  adminKey: string,
  data: AdminCreateBatchInput,
) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/batches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjelo dodavanje serije.");
  }

  const json = await res.json();
  return json.data;
}

export async function updateAdminBatchStock(
  adminKey: string,
  batchId: number,
  data: { stockQuantity: number; isReleased?: boolean },
) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/batches/${batchId}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjelo ažuriranje zaliha serije.");
  }

  const json = await res.json();
  return json.data;
}

export async function fetchAdminInquiries(adminKey: string): Promise<AdminInquiry[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/inquiries`, {
    headers: {
      "x-admin-key": adminKey,
    },
  });

  if (!res.ok) {
    throw new Error("Neuspjelo dohvaćanje kontakt upita.");
  }

  const json = await res.json();
  return json.data;
}

export async function updateAdminInquiryStatus(
  adminKey: string,
  id: number,
  status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED",
): Promise<AdminInquiry> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/admin/inquiries/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Neuspjelo ažuriranje statusa upita.");
  }

  const json = await res.json();
  return json.data;
}
