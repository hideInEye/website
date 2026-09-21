"use client";

import Link from "next/link";
import { MenuIcon, SearchIcon, UserRoundIcon } from "lucide-react";

import { SunsetMark } from "@/components/sunset-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "日志" },
  { href: "/categories/code-notes", label: "分类" },
  { href: "/tags/writing", label: "标签" },
  { href: "/about", label: "关于" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/82 backdrop-blur-xl supports-[backdrop-filter]:bg-background/68">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-8 flex items-center gap-2.5"
          aria-label={`${SITE_CONFIG.name}首页`}
        >
          <SunsetMark />
          <span className="font-literary text-base font-semibold tracking-wide sm:text-lg">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/search" aria-label="搜索文章">
              <SearchIcon />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
            <Link href="/account" aria-label="进入我的账号">
              <UserRoundIcon />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="打开菜单">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <SunsetMark />
                  {SITE_CONFIG.name}
                </SheetTitle>
                <SheetDescription>{SITE_CONFIG.description}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-3" aria-label="移动端导航">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  className="mt-3 rounded-lg border px-3 py-3 text-base font-medium"
                >
                  我的账号
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
