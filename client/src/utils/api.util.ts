
import type { ApiError } from "../types/api.types";

const API_URL = import.meta.env["VITE_API_URL"];

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data as ApiError | null;

    throw new Error(
      error?.message ?? `Request failed with status ${response.status}`,
    );
  }

  if (data === null) {
    throw new Error("Invalid API response");
  }

  return data as T;
}
