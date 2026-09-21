import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";

import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const baseUrl = process.env.LIGHTHOUSE_URL ?? "http://127.0.0.1:3000";
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? "0.9");
const routes = [
  { name: "home", path: "/" },
  { name: "article", path: "/articles/rebuild-a-blog-as-a-twilight-log" }
];
const categories = ["performance", "accessibility", "seo"];
const outputDirectory = "test-results/lighthouse";

if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 1) {
  throw new Error("LIGHTHOUSE_MIN_SCORE 必须是 0 到 1 之间的数字");
}

await mkdir(outputDirectory, { recursive: true });
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"]
});

const failures = [];
const summary = {};

try {
  for (const route of routes) {
    const result = await lighthouse(
      new URL(route.path, baseUrl).toString(),
      {
        port: chrome.port,
        logLevel: "error",
        output: "json",
        onlyCategories: categories
      },
      desktopConfig
    );

    if (!result) throw new Error(`${route.name} 未生成 Lighthouse 结果`);
    await writeFile(
      `${outputDirectory}/${route.name}.json`,
      `${JSON.stringify(result.lhr, null, 2)}\n`,
      "utf8"
    );

    summary[route.name] = Object.fromEntries(
      categories.map((category) => {
        const score = result.lhr.categories[category]?.score;
        if (score === null || score === undefined || score < minimumScore) {
          failures.push(
            `${route.name}/${category}: ${score === null || score === undefined ? "无分数" : Math.round(score * 100)}`
          );
        }
        return [category, score === null || score === undefined ? null : Math.round(score * 100)];
      })
    );
  }
} finally {
  await chrome.kill();
}

await writeFile(
  `${outputDirectory}/summary.json`,
  `${JSON.stringify({ minimumScore: minimumScore * 100, routes: summary }, null, 2)}\n`,
  "utf8"
);

console.table(summary);
if (failures.length) {
  throw new Error(`Lighthouse 未达到 ${minimumScore * 100} 分：${failures.join("；")}`);
}
