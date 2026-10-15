export { AdminNav } from "./components/admin-nav";
export { MarkdownEditor } from "./components/markdown-editor";
export { PostEditorForm } from "./components/post-editor-form";
export { TaxonomyManager } from "./components/taxonomy-manager";
export { CommentModerationList } from "./components/comment-moderation-list";
export { UserStatusTable } from "./components/user-status-table";
export * as adminLoaders from "./loaders";
export const adminPages = {
  dashboard: () =>
    import("./pages/dashboard/page").then((module) => ({ Component: module.default })),
  posts: () => import("./pages/posts/page").then((module) => ({ Component: module.default })),
  newPost: () => import("./pages/new-post/page").then((module) => ({ Component: module.default })),
  editPost: () =>
    import("./pages/edit-post/page").then((module) => ({ Component: module.default })),
  previewPost: () =>
    import("./pages/preview-post/page").then((module) => ({ Component: module.default })),
  categories: () =>
    import("./pages/categories/page").then((module) => ({ Component: module.default })),
  tags: () => import("./pages/tags/page").then((module) => ({ Component: module.default })),
  comments: () => import("./pages/comments/page").then((module) => ({ Component: module.default })),
  users: () => import("./pages/users/page").then((module) => ({ Component: module.default }))
};
export type {
  IAdminComment,
  IAdminDashboard,
  IAdminPost,
  IAdminPostList,
  IAdminTaxonomy,
  IAdminUser,
  ICurrentUser,
  IPostMutation,
  PostStatus
} from "./types";
