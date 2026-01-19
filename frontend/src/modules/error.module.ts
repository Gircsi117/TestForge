import type { MyAxiosError } from "./axios.module";

export class AuthError extends Error {
  constructor(message?: string) {
    super(message || "Authentication Error");
    this.name = "AuthError";
  }
}

export function getErrorMessage(error: Error | MyAxiosError): string {
  const axiosError = error as MyAxiosError;

  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Nem várt esemény történt!"
  );
}
