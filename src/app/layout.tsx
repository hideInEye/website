import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/jetbrains-mono";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { serverEnv } from "@/config/env.server";
import { SITE_CONFIG } from "@/config/site";

import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.SITE_URL),
  title: { default: SITE_CONFIG.name, template: `%s · ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: "Juvenile" }],
  creator: "Juvenile",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description
  },
  alternates: { types: { "application/rss+xml": "/rss.xml" } }
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4eb" },
    { media: "(prefers-color-scheme: dark)", color: "#151923" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        style={
          {
            "--font-noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
            "--font-literary": "'LXGW WenKai', 'STKaiti', serif",
            "--font-jetbrains-mono": "'JetBrains Mono Variable', monospace"
          } as React.CSSProperties
        }
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
