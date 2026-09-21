import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";
export const metadata: Metadata = { title: "找回密码" };
export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center">
      <AuthForm mode="forgot" />
    </div>
  );
}
