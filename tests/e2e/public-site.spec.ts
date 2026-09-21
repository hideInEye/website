import { expect, test } from "@playwright/test";

test("home page exposes the reading path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("留在日落之后");
  await expect(page.getByRole("heading", { name: "最近的观测" })).toBeVisible();
  const firstArticle = page.getByRole("article").first();
  await expect(firstArticle.getByRole("link")).toBeVisible();
});

test("search state stays in the URL", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("searchbox").fill("React");
  await page.getByRole("button", { name: "搜索" }).click();
  await expect(page).toHaveURL(/q=React/);
  await expect(page.getByText(/找到 \d+ 条记录/)).toBeVisible();
});

test("article exposes metadata and comments", async ({ page }) => {
  await page.goto("/articles/rebuild-a-blog-as-a-twilight-log");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("暮光观测日志");
  await expect(page.getByRole("heading", { name: /讨论/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /18/ })).toBeVisible();
});
