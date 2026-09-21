import type { Metadata } from "next";
import { AuthForm } from "@/features/auth";
export const metadata: Metadata = { title: "重置密码" };
export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="flex justify-center">
      <AuthForm mode="reset" token={token} />
    </div>
  );
}
