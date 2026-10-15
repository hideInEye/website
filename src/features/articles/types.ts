export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  postCount?: number;
}

export interface Author {
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  category: Taxonomy;
  tags: Taxonomy[];
  author: Author;
  coverUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface PostDetail extends PostSummary {
  content: string;
  updatedAt: string;
  bookmarkCount: number;
  commentCount: number;
  canonicalSlug?: string;
}

export interface PaginatedPosts {
  items: PostSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
