import type { PostDetail, Taxonomy } from "./types";

export const categories: Taxonomy[] = [
  {
    id: "cat-code",
    name: "代码手记",
    slug: "code-notes",
    description: "关于工程、工具和长期维护。",
    postCount: 3
  },
  {
    id: "cat-life",
    name: "沿途观察",
    slug: "field-notes",
    description: "城市、天气与日常留下的微光。",
    postCount: 2
  },
  {
    id: "cat-method",
    name: "工作方法",
    slug: "craft",
    description: "让创作和协作更从容的方法。",
    postCount: 1
  }
];

export const tags: Taxonomy[] = [
  { id: "tag-react", name: "React", slug: "react", postCount: 2 },
  { id: "tag-architecture", name: "架构", slug: "architecture", postCount: 2 },
  { id: "tag-writing", name: "写作", slug: "writing", postCount: 2 },
  { id: "tag-travel", name: "旅行", slug: "travel", postCount: 1 },
  { id: "tag-docker", name: "Docker", slug: "docker", postCount: 1 }
];

const author = {
  username: "juvenile",
  displayName: "Juvenile",
  bio: "写代码，也记录光线穿过生活的时刻。"
};

export const demoPosts: PostDetail[] = [
  {
    id: "post-twilight-log",
    slug: "rebuild-a-blog-as-a-twilight-log",
    title: "把博客重新做成一本暮光观测日志",
    excerpt: "一次不追逐模板感的重构：从内容结构、阅读节奏到那条贯穿全站的日落轨迹。",
    publishedAt: "2026-09-18T10:30:00.000Z",
    updatedAt: "2026-09-19T08:00:00.000Z",
    readingMinutes: 8,
    category: categories[2],
    tags: [tags[1], tags[2]],
    author,
    bookmarkCount: 18,
    commentCount: 6,
    content: `## 为什么重新开始

旧博客保存了很多真实片段，但阅读体验逐渐被框架的默认选择淹没。新的设计从一个问题出发：**如果每篇文章都是一次观测，它应该留下怎样的坐标？**

我们把首页组织成按时间展开的日志，把发布日期变成轨迹上的刻度。珊瑚色不是装饰色，而是太阳接近地平线时最后一段清晰的光。

## 内容先于组件

重建没有从按钮和卡片开始，而是先整理读者会经历的路径：发现文章、进入阅读、沿目录跳转、留下评论，再回到下一篇。组件只在这条路径需要它时出现。

> 好的界面不是把所有能力摆在眼前，而是在正确的时刻给出下一步。

## 技术选择

- React Server Components 负责公开内容读取；
- URL 保存搜索、筛选和分页状态；
- Markdown 是唯一正文源，编辑预览与公开渲染共享规则；
- shadcn/ui 提供可访问的交互骨架，品牌语言由 Token 决定。

## 留一点空白

这里不会恢复旧站的粒子背景。动效被收敛成阅读进度和轨迹刻度，且会尊重 reduced-motion。页面安静下来以后，文字才重新成为主角。`
  },
  {
    id: "post-rsc",
    slug: "server-components-with-clear-boundaries",
    title: "Server Components 的边界，比数量更重要",
    excerpt: "如何让数据读取留在服务端，把交互限制在叶子节点，并避免序列化边界悄悄膨胀。",
    publishedAt: "2026-09-11T09:10:00.000Z",
    updatedAt: "2026-09-11T09:10:00.000Z",
    readingMinutes: 11,
    category: categories[0],
    tags: [tags[0], tags[1]],
    author,
    bookmarkCount: 31,
    commentCount: 4,
    content: `## 从边界开始

Server Component 并不是越多越好。真正有价值的是把数据库、鉴权和缓存留在服务端，同时让交互组件只接收最小、可序列化的数据。

## 并行读取

当页面需要文章、分类和标签时，应先启动互不依赖的请求，再统一等待。这样能避免无意中的请求瀑布。

\`\`\`ts
const postsPromise = getPosts();
const taxonomyPromise = getTaxonomy();
const [posts, taxonomy] = await Promise.all([postsPromise, taxonomyPromise]);
\`\`\`

## 客户端岛屿

主题切换、收藏按钮和评论表单需要浏览器状态；文章标题、正文和目录则不需要。边界画得越靠近交互叶子，发送到浏览器的 JavaScript 就越少。`
  },
  {
    id: "post-qingdao",
    slug: "qingdao-after-rain",
    title: "雨后的青岛，海像一块慢慢冷却的玻璃",
    excerpt: "从信号山走到海边，在傍晚六点二十七分遇见一段蓝紫色的安静。",
    publishedAt: "2026-08-27T12:27:00.000Z",
    updatedAt: "2026-08-27T12:27:00.000Z",
    readingMinutes: 5,
    category: categories[1],
    tags: [tags[3], tags[2]],
    author,
    bookmarkCount: 12,
    commentCount: 3,
    content: `## 下过雨的坡路

石阶还亮着，屋檐把水滴得很慢。城市的声音被潮湿的空气压低，只有远处轮胎经过积水时短暂地抬高一次。

## 六点二十七分

海面没有金色。云层把日落过滤成蓝紫，栈桥和人群成了同一种深色剪影。那一刻很适合不拍照，只记住时间。

## 回程

旅行并不总要带回结论。有时只需要确认：世界在你没有注视的时候，也一直拥有具体的光线。`
  },
  {
    id: "post-markdown",
    slug: "markdown-as-the-source-of-truth",
    title: "让 Markdown 成为内容的唯一真相",
    excerpt: "富文本编辑并不意味着放弃可迁移的文本源；关键是让编辑、预览与发布遵循同一套规则。",
    publishedAt: "2026-08-03T05:40:00.000Z",
    updatedAt: "2026-08-06T03:20:00.000Z",
    readingMinutes: 7,
    category: categories[0],
    tags: [tags[2], tags[1]],
    author,
    bookmarkCount: 23,
    commentCount: 1,
    content: `## 可迁移比所见即所得更长久

编辑器可以很丰富，但数据库里应该保存普通、透明、可导出的文本。GFM 足以覆盖表格、任务列表、代码块和链接等博客常用结构。

## 同构规则

后台预览与公开页面必须共用解析插件，否则作者看到的内容与读者看到的内容会产生差异。原始 HTML 和可执行 MDX 默认关闭，安全边界也因此更简单。`
  },
  {
    id: "post-docker",
    slug: "small-self-hosted-stack",
    title: "一套小而完整的自托管博客栈",
    excerpt: "Nginx、Next.js、NestJS、MySQL 与 MinIO 如何分工，以及健康检查为何不是部署后的补丁。",
    publishedAt: "2026-07-16T14:00:00.000Z",
    updatedAt: "2026-07-16T14:00:00.000Z",
    readingMinutes: 9,
    category: categories[0],
    tags: [tags[4], tags[1]],
    author,
    bookmarkCount: 27,
    commentCount: 5,
    content: `## 每个容器只做一件事

Nginx 终止 TLS 并转发流量，Next.js 负责页面，NestJS 提供 API，MySQL 保存结构化数据，MinIO 保存媒体对象。

## 健康检查是依赖图

容器启动并不代表服务可用。API 的 ready 检查需要确认数据库连接，Web 的检查则需要确认它已经能响应请求。Compose 根据这些信号决定启动顺序。`
  }
];
