export class AuthError extends Error {
  constructor(message?: string) {
    super(message || "Authentication Error");
    this.name = "AuthError";
  }
}
