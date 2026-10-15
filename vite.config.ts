import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const api = env.API_PROXY_TARGET || "http://127.0.0.1:4000";
  const proxy: Record<string, ProxyOptions> = {
    "/api": { target: api, changeOrigin: false },
    "/media": {
      target: env.MEDIA_PROXY_TARGET || "http://127.0.0.1:9000",
      changeOrigin: true,
      rewrite: (pathname) => pathname.replace(/^\/media/, ""),
      ...(env.MEDIA_PROXY_HOST ? { headers: { Host: env.MEDIA_PROXY_HOST } } : {})
    }
  };
  for (const route of ["/rss.xml", "/sitemap.xml", "/robots.txt", "/article/detail"]) {
    proxy[route] = { target: api, changeOrigin: false };
  }
  return {
    plugins: [react()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    server: { port: 3000, strictPort: true, proxy },
    preview: { port: 3000, strictPort: true, proxy },
    build: { target: "es2022" }
  };
});
