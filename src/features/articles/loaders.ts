import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { getPostComments } from "@/features/comments";
import { getBookmarkState, getCategories, getPostBySlug, getPosts, getTags } from "./api";

const pageNumber = (request: Request) =>
  Math.max(1, Math.floor(Number(new URL(request.url).searchParams.get("page")) || 1));

export async function homeLoader({ request }: LoaderFunctionArgs) {
  const [posts, categories, tags] = await Promise.all([
    getPosts({ page: pageNumber(request), pageSize: 5 }),
    getCategories(),
    getTags()
  ]);
  return { posts, categories, tags };
}

export async function articleLoader({ params }: LoaderFunctionArgs) {
  const slug = params.slug!;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPosts({ pageSize: 4 })]);
  if (!post) throw new Response("文章不存在", { status: 404 });
  if (post.canonicalSlug && post.canonicalSlug !== slug)
    throw redirect(`/articles/${encodeURIComponent(post.canonicalSlug)}`);
  const [comments, bookmarked] = await Promise.all([
    getPostComments(post.id),
    getBookmarkState(post.id)
  ]);
  return {
    post,
    posts,
    comments,
    bookmarked,
    meta: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      image: post.coverUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags.map((tag) => tag.name)
    }
  };
}

export const categoriesLoader = () => getCategories();
export const tagsLoader = () => getTags();

export async function categoryLoader({ request, params }: LoaderFunctionArgs) {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts({ category: params.slug, page: pageNumber(request), pageSize: 8 })
  ]);
  const taxonomy = categories.find((item) => item.slug === params.slug);
  if (!taxonomy) throw new Response("分类不存在", { status: 404 });
  return { taxonomy, posts, meta: { title: taxonomy.name, description: taxonomy.description } };
}

export async function tagLoader({ request, params }: LoaderFunctionArgs) {
  const [tags, posts] = await Promise.all([
    getTags(),
    getPosts({ tag: params.slug, page: pageNumber(request), pageSize: 8 })
  ]);
  const taxonomy = tags.find((item) => item.slug === params.slug);
  if (!taxonomy) throw new Response("标签不存在", { status: 404 });
  return { taxonomy, posts, meta: { title: `#${taxonomy.name}` } };
}

export async function searchLoader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  return {
    query,
    posts: query ? await getPosts({ query, page: pageNumber(request), pageSize: 8 }) : null
  };
}
