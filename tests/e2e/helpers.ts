import { expect, type Page } from "@playwright/test";

export async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("邮箱").fill("owner@example.com");
  await page.getByLabel("密码").fill("Password123!");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByText("owner@example.com")).toBeVisible();
}
