import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";
export const metadata: Metadata = { title: "注册" };
export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <AuthForm mode="register" />
    </div>
  );
}
