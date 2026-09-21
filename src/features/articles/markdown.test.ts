import { describe, expect, it } from "vitest";

import { extractArticleHeadings } from "./markdown";

describe("extractArticleHeadings", () => {
  it("extracts stable Chinese heading ids and de-duplicates them", () => {
    expect(extractArticleHeadings("## 内容先于组件\n### 边界\n## 内容先于组件")).toEqual([
      { id: "内容先于组件", text: "内容先于组件", level: 2 },
      { id: "边界", text: "边界", level: 3 },
      { id: "内容先于组件-1", text: "内容先于组件", level: 2 }
    ]);
  });

  it("ignores headings inside fenced code blocks", () => {
    expect(extractArticleHeadings("```md\n## not-a-heading\n```\n## Real heading")).toEqual([
      { id: "real-heading", text: "Real heading", level: 2 }
    ]);
  });
});
