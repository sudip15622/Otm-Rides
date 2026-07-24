// lib/api/errors.ts
import axios from "axios";

export function getApiError(error: unknown): {
  status: number | undefined;
  message: string;
} {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message ?? error.message,
    };
  }
  return { status: undefined, message: "An unexpected error occurred" };
}
