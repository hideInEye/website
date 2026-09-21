import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeading } from "@/components/page-heading";
import { AccountDashboard } from "@/features/users";
import { getAccountOverview } from "@/features/users/server";
import { ApiClientError } from "@/shared/api-client/response";

export const metadata: Metadata = { title: "我的账号" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  let overview;
  try {
    overview = await getAccountOverview();
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) redirect("/login?next=/account");
    throw error;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="My observatory"
        title="我的观测站"
        description="资料仅在你保存后公开；收藏列表始终只对自己可见。"
      />
      <AccountDashboard overview={overview} />
    </main>
  );
}
