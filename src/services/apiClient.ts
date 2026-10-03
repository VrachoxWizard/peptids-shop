export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`;
  }
  return import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
}

export async function parseApiError(res: Response, fallbackMessage: string): Promise<ApiError> {
  try {
    const errorJson = await res.json();
    const errorObj = errorJson?.error;
    return new ApiError(
      errorObj?.message || fallbackMessage,
      res.status,
      errorObj?.code,
      errorObj?.details,
    );
  } catch {
    return new ApiError(fallbackMessage, res.status);
  }
}
