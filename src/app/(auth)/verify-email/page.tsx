import type { Metadata } from "next";

import { EmailVerification } from "@/features/auth";

export const metadata: Metadata = { title: "验证邮箱" };

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <EmailVerification token={token} />;
}
