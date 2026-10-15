import { useCallback, useMemo, useState } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin
} from "@mdxeditor/editor";
import { toast } from "sonner";
import "@mdxeditor/editor/style.css";

export function MarkdownEditorInner({
  markdown,
  onChange,
  onImageUpload
}: {
  markdown: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}) {
  const [initialMarkdown] = useState(markdown);
  const uploadImage = useCallback(
    async (file: File) => {
      try {
        const url = await onImageUpload(file);
        toast.success("图片已上传并插入正文");
        return url;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "图片上传失败");
        throw error;
      }
    },
    [onImageUpload]
  );
  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      tablePlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin({ imageUploadHandler: uploadImage }),
      markdownShortcutPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          ts: "TypeScript",
          tsx: "TSX",
          js: "JavaScript",
          css: "CSS",
          json: "JSON",
          bash: "Bash",
          "": "Plain text"
        }
      }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: initialMarkdown }),
      toolbarPlugin({
        toolbarContents: () => (
          <DiffSourceToggleWrapper options={["rich-text", "source", "diff"]}>
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />
                },
                {
                  fallback: () => (
                    <>
                      <BlockTypeSelect />
                      <BoldItalicUnderlineToggles />
                      <ListsToggle />
                      <CreateLink />
                      <InsertTable />
                      <InsertCodeBlock />
                      <InsertImage />
                      <InsertThematicBreak />
                    </>
                  )
                }
              ]}
            />
          </DiffSourceToggleWrapper>
        )
      })
    ],
    [initialMarkdown, uploadImage]
  );

  return (
    <div className="overflow-hidden rounded-lg border bg-background text-foreground [&_.mdxeditor]:min-h-[34rem] [&_.mdxeditor-toolbar]:border-b [&_.mdxeditor-toolbar]:bg-muted/50 [&_.mdxeditor-root-contenteditable]:font-sans">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="article-prose min-h-[30rem] px-6 py-5"
        plugins={plugins}
      />
    </div>
  );
}
