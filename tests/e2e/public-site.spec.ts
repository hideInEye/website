import { expect, test } from "@playwright/test";

test("home page exposes the reading path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("留在日落之后");
  await expect(page.getByRole("heading", { name: "最近的观测" })).toBeVisible();
  const firstArticle = page.getByRole("article").first();
  await expect(firstArticle.getByRole("link")).toBeVisible();
});

test("taxonomy navigation uses the live category and tag directories", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "主导航" });
  const categoriesLink = navigation.getByRole("link", { name: "分类" });
  const tagsLink = navigation.getByRole("link", { name: "标签" });

  await expect(categoriesLink).toHaveAttribute("href", "/categories");
  await expect(tagsLink).toHaveAttribute("href", "/tags");

  await categoriesLink.click();
  await expect(page).toHaveURL(/\/categories$/);
  await expect(page.getByRole("heading", { level: 1, name: "文章分类" })).toBeVisible();
  const liveCategory = page.getByRole("link", { name: "工作方法" });
  await expect(liveCategory).toHaveAttribute("href", "/categories/craft");
  await liveCategory.click();
  await expect(page).toHaveURL(/\/categories\/craft$/);
  await expect(page.getByRole("heading", { level: 1, name: "工作方法" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "标签" })
    .click();
  await expect(page).toHaveURL(/\/tags$/);
  await expect(page.getByRole("heading", { level: 1, name: "文章标签" })).toBeVisible();
  const liveTag = page.getByRole("link", { name: "# 写作" });
  await expect(liveTag).toHaveAttribute("href", "/tags/writing");
  await liveTag.click();
  await expect(page).toHaveURL(/\/tags\/writing$/);
  await expect(page.getByRole("heading", { level: 1, name: "# 写作" })).toBeVisible();
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
