import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { demoPosts } from "../demo-data";
import { ArticleCard } from "./article-card";

describe("ArticleCard", () => {
  it("links the title to the canonical article route", () => {
    render(
      <MemoryRouter>
        <ArticleCard post={demoPosts[0]} />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: demoPosts[0].title })).toHaveAttribute(
      "href",
      `/articles/${demoPosts[0].slug}`
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleCard post={demoPosts[0]} featured />
      </MemoryRouter>
    );
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } }
    });
    expect(results.violations).toEqual([]);
  });
});
