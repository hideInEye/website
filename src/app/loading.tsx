import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-20 sm:px-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-14 w-4/5" />
      <Skeleton className="h-6 w-2/3" />
      <div className="flex flex-col gap-3 pt-10">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    </main>
  );
}
