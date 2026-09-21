import axeCore from "axe-core";
import { expect, test, type Page } from "@playwright/test";

import { signIn } from "./helpers";

type AxeViolation = {
  id: string;
  impact: string | null;
  help: string;
  nodes: Array<{ target: string[]; failureSummary?: string }>;
};

async function expectNoSeriousAxeViolations(page: Page, context: string) {
  await page.addScriptTag({ content: axeCore.source });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as typeof window & {
        axe: {
          run: (
            root: Document,
            options: { resultTypes: string[] }
          ) => Promise<{ violations: AxeViolation[] }>;
        };
      }
    ).axe;
    const result = await axe.run(document, { resultTypes: ["violations"] });
    return result.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical"
    );
  });

  expect(
    violations,
    `${context} 存在严重可访问性问题：\n${violations
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(" ")} — ${node.failureSummary ?? ""}`)
            .join("\n")}`
      )
      .join("\n")}`
  ).toEqual([]);
}

test("public reading surfaces have no serious axe violations", async ({ page }) => {
  const routes = [
    ["首页", "/"],
    ["文章页", "/articles/rebuild-a-blog-as-a-twilight-log"],
    ["搜索空状态", `/search?q=${encodeURIComponent("不存在的观测")}`],
    ["登录页", "/login"]
  ] as const;

  for (const [name, route] of routes) {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    await expectNoSeriousAxeViolations(page, name);
  }
});

test("authenticated account and admin surfaces have no serious axe violations", async ({
  page
}) => {
  await signIn(page);
  await expectNoSeriousAxeViolations(page, "账号页");

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "站点概览" })).toBeVisible();
  await expectNoSeriousAxeViolations(page, "管理概览");
});
