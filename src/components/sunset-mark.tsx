import { cn } from "@/lib/utils";

export function SunsetMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-flex size-8 items-center justify-center", className)}
      aria-hidden="true"
    >
      <span className="absolute size-4 rounded-full bg-gradient-to-br from-afterglow to-horizon shadow-[0_0_18px_color-mix(in_oklab,var(--horizon)_42%,transparent)]" />
      <span className="absolute inset-x-0 top-[62%] h-px bg-foreground/35" />
      <span className="absolute bottom-[24%] h-px w-5 bg-foreground/20" />
    </span>
  );
}
