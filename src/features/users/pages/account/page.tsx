import { useLoaderData } from "react-router-dom";
import { accountLoader } from "../../loaders";
import { PageHeading } from "@/components/page-heading";
import { AccountDashboard } from "@/features/users";

export default function AccountPage() {
  const overview = useLoaderData<typeof accountLoader>();
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
