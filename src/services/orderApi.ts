export interface CreateOrderPayload {
  items: Array<{ productId: number; quantity: number }>;
  customerEmail: string;
  shippingAddress: {
    recipientName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    companyName?: string;
    companyOib?: string;
    deliveryInstructions?: string;
  };
  paymentMethod: "cod" | "keks" | "transfer";
  ruoDeclarationAccepted: true;
  notes?: string;
}

export interface Hub3PaymentSlip {
  formattedBarcodePayload: string;
  receiverName: string;
  receiverIban: string;
  model: string;
  referenceNumber: string;
  purposeCode: string;
  description: string;
  amountFormatted: string;
}

export interface OrderResponse {
  orderNumber: string;
  status: string;
  paymentMethod: "cod" | "keks" | "transfer";
  total: number;
  currency: string;
  createdAt: string;
  paymentDetails?: Hub3PaymentSlip | null;
}

import { ApiError, getApiBaseUrl } from "./apiClient";

export const DEV_FALLBACK_ITEM_UNIT_PRICE_EUR = 49.9;

export async function submitOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      const message =
        errorJson?.error?.message || "Greška pri kreiranju narudžbe na poslužitelju.";
      throw new ApiError(
        message,
        res.status,
        errorJson?.error?.code,
        errorJson?.error?.details,
      );
    }

    const json = await res.json();
    return json.data;
  } catch (error: unknown) {
    // Ako je greška s poslužitelja (HTTP 4xx / 5xx), uvijek je propagiramo korisniku
    if (error instanceof ApiError) {
      throw error;
    }

    // Samo u slučaju čistog mrežnog prekida (fetch failure) u dev načinu rada koristimo fallback
    const isNetworkError =
      error instanceof TypeError &&
      (error.message.includes("fetch") || error.message.includes("Network"));

    if (isNetworkError && import.meta.env.DEV) {
      const errMessage = error instanceof Error ? error.message : "Mrežna greška";
      console.warn("Backend API nije dostupan, generiram lokalni potvrdni odgovor:", errMessage);

      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const mockOrderNumber = `ORD-${year}-${randomSuffix}`;
      const totalAmount = payload.items.reduce(
        (sum, item) => sum + item.quantity * DEV_FALLBACK_ITEM_UNIT_PRICE_EUR,
        0,
      );

      let paymentDetails: Hub3PaymentSlip | null = null;
      if (payload.paymentMethod === "transfer") {
        paymentDetails = {
          formattedBarcodePayload: "HRVHUB30\nEUR...",
          receiverName: "PeptideLab d.o.o.",
          receiverIban: "HR1234567890123456789",
          model: "HR00",
          referenceNumber: mockOrderNumber,
          purposeCode: "GDSV",
          description: `Narudžba ${mockOrderNumber} PeptideLab`,
          amountFormatted: `${totalAmount.toFixed(2)} EUR`,
        };
      }

      return {
        orderNumber: mockOrderNumber,
        status: "CONFIRMED",
        paymentMethod: payload.paymentMethod,
        total: totalAmount,
        currency: "EUR",
        createdAt: new Date().toISOString(),
        paymentDetails,
      };
    }

    const errMessage =
      error instanceof Error ? error.message : "Neuspjelo povezivanje s poslužiteljem.";
    throw new Error(errMessage, { cause: error });
  }
}

export interface TrackedOrder {
  orderNumber: string;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "cod" | "keks" | "transfer";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  trackingNumber: string | null;
  shippingCarrier: string | null;
  shipping: {
    recipientName: string | null;
    city: string;
    country: string;
  } | null;
  paymentDetails?: Hub3PaymentSlip | null;
}

export async function trackOrder(orderNumber: string): Promise<TrackedOrder> {
  const baseUrl = getApiBaseUrl();
  const cleanNumber = orderNumber.trim();

  const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(cleanNumber)}`);

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const message =
      errorJson?.error?.message ||
      (res.status === 404
        ? "Narudžba s navedenim brojem nije pronađena."
        : "Greška pri dohvatu statusa narudžbe.");
    throw new ApiError(message, res.status, errorJson?.error?.code);
  }

  const json = await res.json();
  return json.data;
}

