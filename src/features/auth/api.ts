import { browserApiRequest } from "@/shared/api-client/browser";

export type AuthMode = "login" | "register" | "forgot" | "reset";

export interface IAuthSubmission {
  username?: string;
  email?: string;
  password?: string;
  token?: string;
}

const ENDPOINTS: Record<AuthMode, string> = {
  login: "/auth/login",
  register: "/auth/register",
  forgot: "/auth/forgot-password",
  reset: "/auth/reset-password"
};

export function submitAuth(mode: AuthMode, submission: IAuthSubmission): Promise<unknown> {
  return browserApiRequest(ENDPOINTS[mode], { method: "POST", body: submission });
}

export function verifyEmail(token: string): Promise<{ verified: true }> {
  return browserApiRequest("/auth/verify-email", { method: "POST", body: { token } });
}

export function logout(): Promise<{ loggedOut: true }> {
  return browserApiRequest("/auth/logout", { method: "POST" });
}
