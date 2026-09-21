import { cn } from "@/lib/utils";

export function PageHeading({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("flex max-w-3xl flex-col gap-4", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="font-literary text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="text-balance text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
