export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface Author {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
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
  coverUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
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
