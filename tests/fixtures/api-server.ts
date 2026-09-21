import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

const port = Number(process.env.E2E_API_PORT ?? 4010);
const now = "2026-09-21T08:00:00.000Z";
const category = {
  id: "cat-craft",
  name: "工作方法",
  slug: "craft",
  description: "让创作和协作更从容的方法。",
  postCount: 2
};
const tag = { id: "tag-writing", name: "写作", slug: "writing", postCount: 2 };
const author = {
  username: "juvenile",
  displayName: "Juvenile",
  bio: "写代码，也记录光线穿过生活的时刻。",
  avatarUrl: null
};
const posts = [
  {
    id: "post-twilight-log",
    slug: "rebuild-a-blog-as-a-twilight-log",
    title: "把博客重新做成一本暮光观测日志",
    excerpt: "一次从内容结构、阅读节奏到日落轨迹的完整重构。",
    content:
      "## 为什么重新开始\n\n新的 React 设计从内容出发。\n\n## 内容先于组件\n\nMarkdown 是正文的唯一真相。",
    status: "PUBLISHED",
    publishedAt: now,
    updatedAt: now,
    readingMinutes: 4,
    category,
    tags: [tag],
    author,
    coverUrl: null,
    seoTitle: null,
    seoDescription: null,
    bookmarkCount: 18,
    commentCount: 1
  },
  {
    id: "post-boundaries",
    slug: "server-components-with-clear-boundaries",
    title: "Server Components 的边界，比数量更重要",
    excerpt: "让读取留在服务端，让交互停在叶子节点。",
    content: "## 从边界开始\n\n清晰的数据边界比组件数量更重要。",
    status: "DRAFT",
    publishedAt: now,
    updatedAt: now,
    readingMinutes: 3,
    category,
    tags: [tag],
    author,
    coverUrl: null,
    seoTitle: null,
    seoDescription: null,
    bookmarkCount: 4,
    commentCount: 0
  }
];
const profile = {
  id: "user-admin",
  email: "owner@example.com",
  username: "juvenile",
  displayName: "Juvenile",
  avatarUrl: null,
  bio: "写代码，也记录光线穿过生活的时刻。",
  role: "ADMIN",
  status: "ACTIVE",
  emailVerifiedAt: now,
  createdAt: now
};
const publicComment = {
  id: "comment-1",
  content: "日落轨迹这个想法很贴合阅读节奏。",
  createdAt: now,
  user: author,
  replies: []
};

function send(
  response: ServerResponse,
  status: number,
  data: unknown,
  headers?: Record<string, string | string[]>
) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  response.end(JSON.stringify(status >= 400 ? data : { data }));
}

function error(response: ServerResponse, status: number, message: string) {
  send(response, status, { statusCode: status, code: `HTTP_${status}`, message });
}

function isAuthenticated(request: IncomingMessage) {
  return request.headers.cookie?.includes("sf_access=e2e-access") ?? false;
}

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function requireAuthentication(request: IncomingMessage, response: ServerResponse) {
  if (isAuthenticated(request)) return true;
  error(response, 401, "请先登录");
  return false;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
  const path = url.pathname;

  if (path === "/health") return send(response, 200, { ready: true });
  if (!path.startsWith("/api/v1/")) return error(response, 404, "接口不存在");

  if (request.method === "GET" && path === "/api/v1/categories") {
    return send(response, 200, [category]);
  }
  if (request.method === "GET" && path === "/api/v1/tags") return send(response, 200, [tag]);
  if (request.method === "GET" && path === "/api/v1/posts") {
    const query = url.searchParams.get("q")?.toLocaleLowerCase("zh-CN");
    const categorySlug = url.searchParams.get("category");
    const tagSlug = url.searchParams.get("tag");
    const publicPosts = posts.filter((post) => post.status === "PUBLISHED");
    const items = publicPosts.filter((post) => {
      if (categorySlug && post.category.slug !== categorySlug) return false;
      if (tagSlug && !post.tags.some((item) => item.slug === tagSlug)) return false;
      return (
        !query ||
        `${post.title} ${post.excerpt} ${post.content}`.toLocaleLowerCase("zh-CN").includes(query)
      );
    });
    return send(response, 200, {
      items,
      page: 1,
      pageSize: Number(url.searchParams.get("pageSize") ?? 6),
      total: items.length,
      totalPages: 1
    });
  }
  if (request.method === "GET" && path.endsWith("/comments") && path.startsWith("/api/v1/posts/")) {
    return send(response, 200, [publicComment]);
  }
  if (request.method === "GET" && path.startsWith("/api/v1/posts/legacy/")) {
    return send(response, 200, { slug: posts[0].slug });
  }
  if (request.method === "GET" && path.startsWith("/api/v1/posts/")) {
    const slug = decodeURIComponent(path.slice("/api/v1/posts/".length));
    const post = posts.find((item) => item.slug === slug && item.status === "PUBLISHED");
    return post ? send(response, 200, post) : error(response, 404, "文章不存在");
  }
  if (request.method === "GET" && path === "/api/v1/users/juvenile") {
    return send(response, 200, {
      ...author,
      createdAt: now,
      comments: [
        {
          id: publicComment.id,
          content: publicComment.content,
          createdAt: now,
          post: { title: posts[0].title, slug: posts[0].slug }
        }
      ]
    });
  }

  if (request.method === "POST" && path === "/api/v1/auth/login") {
    const submission = await body(request);
    if (submission.email !== "owner@example.com" || submission.password !== "Password123!") {
      return error(response, 401, "邮箱或密码不正确");
    }
    return send(
      response,
      201,
      { user: profile },
      {
        "Set-Cookie": [
          "sf_access=e2e-access; HttpOnly; Path=/; SameSite=Lax",
          "sf_refresh=e2e-refresh; HttpOnly; Path=/api/v1/auth; SameSite=Lax"
        ]
      }
    );
  }
  if (request.method === "POST" && path === "/api/v1/auth/logout") {
    return send(
      response,
      201,
      { loggedOut: true },
      {
        "Set-Cookie": [
          "sf_access=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
          "sf_refresh=; HttpOnly; Path=/api/v1/auth; Max-Age=0; SameSite=Lax"
        ]
      }
    );
  }
  if (request.method === "POST" && path === "/api/v1/auth/register") {
    return send(response, 201, { id: "new-user", email: "reader@example.com", username: "reader" });
  }
  if (request.method === "POST" && path === "/api/v1/auth/verify-email") {
    const submission = await body(request);
    return submission.token === "e2e-verification"
      ? send(response, 201, { verified: true })
      : error(response, 401, "验证链接无效或已经过期");
  }
  if (request.method === "POST" && path === "/api/v1/auth/forgot-password") {
    return send(response, 201, { accepted: true });
  }
  if (request.method === "POST" && path === "/api/v1/auth/reset-password") {
    return send(response, 201, { reset: true });
  }

  if (path === "/api/v1/auth/me") {
    return requireAuthentication(request, response) ? send(response, 200, profile) : undefined;
  }
  if (!requireAuthentication(request, response)) return;

  if (request.method === "GET" && path === "/api/v1/users/me/profile") {
    return send(response, 200, profile);
  }
  if (request.method === "PATCH" && path === "/api/v1/users/me/profile") {
    return send(response, 200, { ...profile, ...(await body(request)) });
  }
  if (request.method === "GET" && path === "/api/v1/bookmarks") {
    return send(response, 200, [posts[1]]);
  }
  if (request.method === "GET" && path.startsWith("/api/v1/bookmarks/")) {
    return send(response, 200, { bookmarked: false });
  }
  if (["PUT", "DELETE"].includes(request.method ?? "") && path.startsWith("/api/v1/bookmarks/")) {
    return send(response, 200, { bookmarked: request.method === "PUT" });
  }
  if (request.method === "GET" && path === "/api/v1/comments/mine") {
    return send(response, 200, [
      {
        id: publicComment.id,
        content: publicComment.content,
        status: "APPROVED",
        createdAt: now,
        post: { title: posts[0].title, slug: posts[0].slug }
      }
    ]);
  }
  if (request.method === "POST" && path === "/api/v1/comments") {
    return send(response, 201, { id: "new-comment", moderationRequired: false });
  }
  if (request.method === "DELETE" && path.startsWith("/api/v1/comments/")) {
    return send(response, 200, { deleted: true });
  }

  if (request.method === "GET" && path === "/api/v1/admin/dashboard") {
    return send(response, 200, {
      posts: { total: 2, published: 1, drafts: 1 },
      pendingComments: 1,
      users: 3,
      bookmarks: 22
    });
  }
  if (request.method === "GET" && path === "/api/v1/admin/posts") {
    return send(response, 200, { items: posts, total: posts.length });
  }
  if (request.method === "GET" && path.startsWith("/api/v1/admin/posts/")) {
    const id = decodeURIComponent(path.slice("/api/v1/admin/posts/".length));
    const post = posts.find((item) => item.id === id);
    return post ? send(response, 200, post) : error(response, 404, "文章不存在");
  }
  if (["POST", "PATCH"].includes(request.method ?? "") && path.startsWith("/api/v1/admin/posts")) {
    return send(response, request.method === "POST" ? 201 : 200, {
      ...posts[1],
      ...(await body(request))
    });
  }
  if (request.method === "GET" && path === "/api/v1/admin/comments") {
    return send(response, 200, [
      {
        ...publicComment,
        status: "PENDING",
        user: author,
        post: { title: posts[0].title, slug: posts[0].slug }
      }
    ]);
  }
  if (request.method === "PATCH" && path.startsWith("/api/v1/admin/comments/")) {
    return send(response, 200, { id: publicComment.id, status: "APPROVED" });
  }
  if (request.method === "GET" && path === "/api/v1/admin/users") {
    return send(response, 200, [
      profile,
      { ...profile, id: "user-reader", role: "USER", username: "reader" }
    ]);
  }
  if (request.method === "PATCH" && path.includes("/api/v1/admin/users/")) {
    return send(response, 200, { id: "user-reader", username: "reader", status: "SUSPENDED" });
  }

  return error(response, 404, "接口不存在");
});

server.listen(port, "127.0.0.1", () => {
  console.info(`Playwright API fixture listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
