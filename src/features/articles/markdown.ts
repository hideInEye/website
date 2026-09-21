export interface IArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface IHastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: IHastNode[];
}

class HeadingSlugger {
  private readonly occurrences = new Map<string, number>();

  slug(value: string): string {
    const base =
      value
        .trim()
        .toLocaleLowerCase("zh-CN")
        .normalize("NFKC")
        .replace(/[\p{P}\p{S}]+/gu, "")
        .replace(/\s+/g, "-") || "section";
    const occurrence = this.occurrences.get(base) ?? 0;
    this.occurrences.set(base, occurrence + 1);
    return occurrence === 0 ? base : `${base}-${occurrence}`;
  }
}

function markdownLabel(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

function nodeText(node: IHastNode): string {
  if (node.type === "text") return node.value ?? "";
  return node.children?.map(nodeText).join("") ?? "";
}

export function extractArticleHeadings(markdown: string): IArticleHeading[] {
  const slugger = new HeadingSlugger();
  const headings: IArticleHeading[] = [];
  let fence: string | undefined;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      fence = fence ? undefined : fenceMatch[1][0];
      continue;
    }
    if (fence) continue;
    const match = line.match(/^\s{0,3}(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;
    const text = markdownLabel(match[2]);
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level: match[1].length as 2 | 3 });
  }
  return headings;
}

export function rehypeStableHeadingIds() {
  return (tree: IHastNode) => {
    const slugger = new HeadingSlugger();
    const visit = (node: IHastNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        node.properties = { ...node.properties, id: slugger.slug(nodeText(node)) };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
