import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { demoPosts } from "../demo-data";
import { ArticleCard } from "./article-card";

describe("ArticleCard", () => {
  it("links the title to the canonical article route", () => {
    render(<ArticleCard post={demoPosts[0]} />);
    expect(screen.getByRole("link", { name: demoPosts[0].title })).toHaveAttribute(
      "href",
      `/articles/${demoPosts[0].slug}`
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<ArticleCard post={demoPosts[0]} featured />);
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } }
    });
    expect(results.violations).toEqual([]);
  });
});
