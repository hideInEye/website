import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

import { rehypeStableHeadingIds } from "../markdown";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeStableHeadingIds, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
