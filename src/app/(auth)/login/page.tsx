import type { Metadata } from "next";

import { AuthForm } from "@/features/auth";

export const metadata: Metadata = { title: "登录" };

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
  return (
    <div className="flex justify-center">
      <AuthForm mode="login" nextPath={nextPath} />
    </div>
  );
}
