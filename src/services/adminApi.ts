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

async function adminFetch<T>(
  endpoint: string,
  adminKey: string,
  options: RequestInit = {},
  fallbackError = "Došlo je do greške na poslužitelju.",
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "x-admin-key": adminKey,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const msg =
      errorJson?.error?.message ||
      (res.status === 401 || res.status === 403
        ? "Neispravan administratorski ključ."
        : fallbackError);
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export async function fetchAdminStats(adminKey: string): Promise<AdminDashboardStats> {
  const json = await adminFetch<{ data: AdminDashboardStats }>(
    "/admin/stats",
    adminKey,
    {},
    "Greška pri dohvaćanju statistike.",
  );
  return json.data;
}

export async function fetchAdminOrders(
  adminKey: string,
  params: { status?: string; search?: string } = {},
): Promise<{ orders: AdminOrderSummary[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }

  const query = searchParams.toString();
  const endpoint = `/admin/orders${query ? `?${query}` : ""}`;
  const json = await adminFetch<{ data: AdminOrderSummary[]; pagination: { total: number } }>(
    endpoint,
    adminKey,
    {},
    "Neuspjelo dohvaćanje narudžbi.",
  );
  return {
    orders: json.data,
    total: json.pagination.total,
  };
}

export async function fetchAdminOrderDetails(
  adminKey: string,
  orderId: string,
): Promise<AdminOrderDetail> {
  const json = await adminFetch<{ data: AdminOrderDetail }>(
    `/admin/orders/${orderId}`,
    adminKey,
    {},
    "Neuspjelo učitavanje detalja narudžbe.",
  );
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
  const json = await adminFetch<{ data: unknown }>(
    `/admin/orders/${orderId}/status`,
    adminKey,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    "Greška pri ažuriranju statusa narudžbe.",
  );
  return json.data;
}

export async function fetchAdminProducts(adminKey: string): Promise<AdminProduct[]> {
  const json = await adminFetch<{ data: AdminProduct[] }>(
    "/admin/products",
    adminKey,
    {},
    "Neuspjelo dohvaćanje kataloga artikala.",
  );
  return json.data;
}

export async function createAdminProduct(
  adminKey: string,
  data: AdminCreateProductInput,
): Promise<AdminProduct> {
  const json = await adminFetch<{ data: AdminProduct }>(
    "/admin/products",
    adminKey,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    "Neuspjelo dodavanje artikla.",
  );
  return json.data;
}

export async function updateAdminProduct(
  adminKey: string,
  id: number,
  data: Partial<AdminCreateProductInput>,
): Promise<AdminProduct> {
  const json = await adminFetch<{ data: AdminProduct }>(
    `/admin/products/${id}`,
    adminKey,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    "Neuspjelo ažuriranje artikla.",
  );
  return json.data;
}

export async function deleteAdminProduct(
  adminKey: string,
  id: number,
): Promise<{ id: number; slug: string; isActive: boolean }> {
  const json = await adminFetch<{ data: { id: number; slug: string; isActive: boolean } }>(
    `/admin/products/${id}`,
    adminKey,
    {
      method: "DELETE",
    },
    "Neuspjela deaktivacija artikla.",
  );
  return json.data;
}

export async function createAdminBatch(
  adminKey: string,
  data: AdminCreateBatchInput,
) {
  const json = await adminFetch<{ data: unknown }>(
    "/admin/batches",
    adminKey,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    "Neuspjelo dodavanje serije.",
  );
  return json.data;
}

export async function updateAdminBatchStock(
  adminKey: string,
  batchId: number,
  data: { stockQuantity: number; isReleased?: boolean },
) {
  const json = await adminFetch<{ data: unknown }>(
    `/admin/batches/${batchId}/stock`,
    adminKey,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    "Neuspjelo ažuriranje zaliha serije.",
  );
  return json.data;
}

export async function fetchAdminInquiries(adminKey: string): Promise<AdminInquiry[]> {
  const json = await adminFetch<{ data: AdminInquiry[] }>(
    "/admin/inquiries",
    adminKey,
    {},
    "Neuspjelo dohvaćanje kontakt upita.",
  );
  return json.data;
}

export async function updateAdminInquiryStatus(
  adminKey: string,
  id: number,
  status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED",
): Promise<AdminInquiry> {
  const json = await adminFetch<{ data: AdminInquiry }>(
    `/admin/inquiries/${id}/status`,
    adminKey,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    "Neuspjelo ažuriranje statusa upita.",
  );
  return json.data;
}
