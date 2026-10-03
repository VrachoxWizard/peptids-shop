import { ApiError, getApiBaseUrl } from "./apiClient";

export interface CreateInquiryPayload {
  name: string;
  email: string;
  message: string;
}

export interface InquiryResponse {
  id: number;
  status: string;
  createdAt: string;
}

export async function submitInquiry(payload: CreateInquiryPayload): Promise<InquiryResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new ApiError(
      errorJson?.error?.message || "Neuspjelo slanje upita.",
      res.status,
      errorJson?.error?.code,
    );
  }

  const json = await res.json();
  return json.data;
}
