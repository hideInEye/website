import { ArticleCard } from "./article-card";
import type { PostSummary } from "@/features/articles";

export function SunsetTimeline({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="relative">
      <div
        className="absolute bottom-10 left-[7px] top-8 w-px bg-gradient-to-b from-horizon via-afterglow/55 to-transparent sm:left-[11px]"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative grid grid-cols-[16px_1fr] gap-5 sm:grid-cols-[24px_1fr] sm:gap-7"
          >
            <span
              className={
                index === 0
                  ? "mt-9 size-4 rounded-full border-4 border-background bg-horizon shadow-[0_0_0_1px_var(--horizon),0_0_18px_color-mix(in_oklab,var(--horizon)_55%,transparent)] sm:mt-9 sm:size-6 sm:border-[7px]"
                  : "mt-9 ml-1 size-2 rounded-full bg-afterglow ring-4 ring-background sm:ml-2 sm:size-2.5"
              }
              aria-hidden="true"
            />
            <ArticleCard post={post} featured={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
