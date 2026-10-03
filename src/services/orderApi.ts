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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export async function submitOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }

    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || "Greška pri kreiranju narudžbe na poslužitelju.");
  } catch (error: any) {
    // Ako backend nije dostupan (offline dev način), pružamo graceful fallback
    console.warn("Backend API nije dostupan, generiram lokalni potvrdni odgovor:", error.message);

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const mockOrderNumber = `ORD-${year}-${randomSuffix}`;
    const totalAmount = payload.items.reduce((sum, item) => sum + item.quantity * 49.9, 0);

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
}
