import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  buildHref
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-between border-t pt-6" aria-label="分页">
      {currentPage > 1 ? (
        <Link to={buildHref(currentPage - 1)} className={buttonVariants({ variant: "outline" })}>
          <ChevronLeftIcon data-icon="inline-start" />
          上一页
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          to={buildHref(currentPage + 1)}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          下一页
          <ChevronRightIcon data-icon="inline-end" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
