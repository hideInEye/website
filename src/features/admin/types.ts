export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IAdminTaxonomy {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  postCount?: number;
}

export interface IAdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  updatedAt: string;
  category: IAdminTaxonomy;
  tags: IAdminTaxonomy[];
}

export interface IPostMutation {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: PostStatus;
  categoryId: string;
  tagIds: string[];
}

export interface IAdminPostList {
  items: IAdminPost[];
  total: number;
}

export interface ICurrentUser {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
}

export interface IAdminComment {
  id: string;
  content: string;
  status: "PENDING";
  createdAt: string;
  user: { username: string; displayName: string };
  post: { title: string; slug: string };
}

export interface IAdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: "USER" | "ADMIN";
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface IAdminDashboard {
  posts: { total: number; published: number; drafts: number };
  pendingComments: number;
  users: number;
  bookmarks: number;
}
