import { expect, test } from "@playwright/test";

import { signIn } from "./helpers";

test("registers, verifies email and resets a password", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("用户名").fill("reader");
  await page.getByLabel("邮箱").fill("reader@example.com");
  await page.getByLabel("密码").fill("Password123!");
  await page.getByRole("button", { name: "创建账号" }).click();
  await expect(page).toHaveURL(/\/verify-email$/);
  await expect(page.getByRole("heading", { name: "去邮箱完成确认" })).toBeVisible();

  await page.goto("/verify-email?token=e2e-verification");
  await page.getByRole("button", { name: "确认并启用账号" }).click();
  await expect(page.getByRole("heading", { name: "邮箱验证完成" })).toBeVisible();

  await page.goto("/forgot-password");
  await page.getByLabel("邮箱").fill("reader@example.com");
  await page.getByRole("button", { name: "发送重置邮件" }).click();
  await expect(page).toHaveURL(/\/verify-email$/);

  await page.goto("/reset-password?token=e2e-reset");
  await page.getByLabel("密码").fill("UpdatedPassword123!");
  await page.getByRole("button", { name: "更新密码" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("uses private account, bookmark and comment flows after login", async ({ page }) => {
  await signIn(page);
  await page.getByRole("tab", { name: /收藏/ }).click();
  await expect(page.getByText("Server Components 的边界，比数量更重要")).toBeVisible();
  await page.getByRole("tab", { name: /评论/ }).click();
  await expect(page.getByText("日落轨迹这个想法很贴合阅读节奏。")).toBeVisible();

  await page.goto("/articles/rebuild-a-blog-as-a-twilight-log");
  await page.getByRole("button", { name: "18" }).click();
  await expect(page.getByText("已收藏这篇文章")).toBeVisible();
  await page.getByLabel("留下你的观察").fill("来自 Playwright 的观察。");
  await page.getByRole("button", { name: "提交" }).click();
  await expect(page.getByText("评论已发布")).toBeVisible();
});

test("guards admin pages and supports moderation and draft preview", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=(?:\/|%2F)admin/);

  await signIn(page);
  await page.goto("/admin/comments");
  await page.getByRole("button", { name: "通过" }).click();
  await expect(page.getByText("审核队列已清空")).toBeVisible();

  await page.goto("/admin/posts/post-boundaries/preview");
  await expect(
    page.getByRole("heading", { name: "Server Components 的边界，比数量更重要" })
  ).toBeVisible();
  await expect(page.getByText("草稿", { exact: true })).toBeVisible();
});

test("permanently redirects the legacy article URL", async ({ page }) => {
  await page.goto("/article/detail?id=legacy-record");
  await expect(page).toHaveURL(/\/articles\/rebuild-a-blog-as-a-twilight-log$/);
});
