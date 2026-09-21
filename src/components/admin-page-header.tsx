import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
  className
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b bg-background/65 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8",
        className
      )}
    >
      <div>
        <h1 className="font-literary text-2xl font-semibold">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
