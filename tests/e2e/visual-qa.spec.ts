import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";

async function expectViewportFit(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
}

async function capture(page: Page, path: string) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
  });
  const projectName = test.info().project.name;
  const outputPath =
    projectName === "desktop" ? path : path.replace(/\.png$/, `-${projectName}.png`);
  await page.screenshot({ animations: "disabled", caret: "initial", path: outputPath });
}

test.describe.configure({ mode: "serial" });

test("captures the public visual system at three breakpoints", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expectViewportFit(page);
  await expect(page.getByText("暮光观测日志 · 记录于东八区")).toBeVisible();
  await capture(page, "test-results/visual/home-1440-light.png");

  await page.setViewportSize({ width: 768, height: 900 });
  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expectViewportFit(page);
  await capture(page, "test-results/visual/home-768-dark.png");

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true
  );
  await capture(page, "test-results/visual/home-768-dark-reduced-motion.png");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.setViewportSize({ width: 375, height: 812 });
  await expectViewportFit(page);
  await page.getByRole("button", { name: "打开菜单" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await capture(page, "test-results/visual/mobile-menu-375-dark.png");
});

test("captures article reading and post-interaction feedback", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/articles/rebuild-a-blog-as-a-twilight-log");
  await expect(page.getByRole("heading", { name: "把博客重新做成一本暮光观测日志" })).toBeVisible();
  await expect(page.getByRole("link", { name: "日落的足迹首页" })).toBeVisible();
  await expectViewportFit(page);
  await capture(page, "test-results/visual/article-1440-light.png");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await expect(page.locator(".fixed.inset-x-0.top-0 > div")).not.toHaveCSS("width", "0px");
  await page.getByRole("button", { name: "18" }).click();
  await expect(page.getByText("登录后即可收藏文章")).toBeVisible();
  await capture(page, "test-results/visual/article-bookmark-toast-1440.png");
});

test("captures empty, validation, account and admin states", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(
    `/search?q=${encodeURIComponent("一个绝对不存在的超长搜索词用于检查布局稳定性")}`
  );
  await expect(page.getByText("没有找到相符的轨迹")).toBeVisible();
  await expectViewportFit(page);
  await capture(page, "test-results/visual/search-empty-768.png");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/login");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page.getByText("请输入有效邮箱")).toBeVisible();
  await capture(page, "test-results/visual/login-errors-375.png");

  await page.setViewportSize({ width: 1440, height: 900 });
  await signIn(page);
  await page.getByRole("tab", { name: /收藏/ }).click();
  await expect(page.getByText("Server Components 的边界，比数量更重要")).toBeVisible();
  await capture(page, "test-results/visual/account-bookmarks-1440.png");

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "站点概览" })).toBeVisible();
  await expectViewportFit(page);
  await capture(page, "test-results/visual/admin-dashboard-1440.png");
});

test("captures the three-mode Markdown editor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await signIn(page);
  await page.goto("/admin/posts/new");
  await expect(page.getByRole("radio", { name: "Rich text" })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("radio", { name: "Source mode" }).click();
  await expect(page.locator("textarea").last()).toBeVisible();
  await capture(page, "test-results/visual/admin-editor-source-1440.png");
  await page.getByRole("radio", { name: "Diff mode" }).click();
  await expect(page.getByRole("radio", { name: "Diff mode" })).toBeChecked();
});
