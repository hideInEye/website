import { defineConfig, devices } from "@playwright/test";

const browserChannel = process.env.CI ? {} : { channel: "chrome" as const };

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  projects: [
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], browserName: "chromium", ...browserChannel }
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], browserName: "chromium", ...browserChannel }
    }
  ],
  webServer: [
    {
      command: "pnpm test:api-fixture",
      url: "http://127.0.0.1:4010/health",
      reuseExistingServer: false,
      timeout: 30_000
    },
    {
      command: "API_PROXY_TARGET=http://127.0.0.1:4010 pnpm dev",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: false,
      timeout: 120_000
    }
  ]
});
