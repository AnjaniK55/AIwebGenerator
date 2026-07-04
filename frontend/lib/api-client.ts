import { API_BASE_URL } from "@/constants";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers || {}),
  });

  const config: RequestInit = {
    credentials: "include",
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Attempt to parse JSON response. Some responses might be empty (e.g. 204 No Content)
    const data = response.status !== 204 ? await response.json().catch(() => null) : null;

    if (!response.ok) {
      throw new ApiError(
        data?.message || "An error occurred while making the request.",
        response.status,
        data
      );
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "Network error occurred";
    throw new ApiError(errorMessage, 500);
  }
}
