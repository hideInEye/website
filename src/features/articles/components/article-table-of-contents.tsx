import { ListTreeIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { IArticleHeading } from "../markdown";

export function ArticleTableOfContents({
  headings,
  className
}: {
  headings: IArticleHeading[];
  className?: string;
}) {
  if (!headings.length) return null;
  return (
    <nav aria-label="文章目录" className={cn("rounded-xl border bg-card/45 p-4", className)}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <ListTreeIcon className="size-4 text-primary" />
        本页观测
      </p>
      <ol className="flex flex-col gap-2 border-l pl-3 text-sm text-muted-foreground">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3" : undefined}>
            <a href={`#${heading.id}`} className="transition-colors hover:text-foreground">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
