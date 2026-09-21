import Link from "next/link";

import { SunsetMark } from "@/components/sunset-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <div className="sunset-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[28rem] -translate-x-1/2 rounded-full bg-horizon/12 blur-3xl"
        aria-hidden="true"
      />
      <div className="absolute left-4 top-4 sm:left-7 sm:top-6">
        <Link href="/" className="flex items-center gap-2 font-literary font-semibold">
          <SunsetMark />
          日落的足迹
        </Link>
      </div>
      <div className="absolute right-4 top-4 sm:right-7 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
