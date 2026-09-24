# 日落的足迹 Web

使用 Next.js 16、React 19、TypeScript、Tailwind CSS v4 和 shadcn/ui 重建的博客前端。视觉方向为“暮光观测日志”：公开阅读以 Server Components 为主，主题、收藏、评论、表单和编辑器等交互下沉到客户端叶子组件。

## 环境要求

- Node.js 22
- pnpm 8.15.9
- 可选：相邻目录中的 `website-server` API

## 本地开发（不使用 Docker）

```bash
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

先在相邻的 `website-server` 仓库执行 `pnpm start:dev`，确保 API 位于 `http://localhost:4000`。前端开发地址为 `http://localhost:3000`，同源 `/api` Route Handler 会代理到该 API。

环境变量：

- `SITE_URL`：仅服务端读取的站点公开地址，用于 canonical、Open Graph、robots、sitemap 和 RSS，可在 standalone 容器启动时注入。
- `API_INTERNAL_URL`：仅服务端使用的 NestJS 地址；Compose 中为 `http://api:4000`。

媒体公开地址由后端 API 返回，前端不保存 MinIO 凭据或内部地址。

只有在未设置 `API_INTERNAL_URL` 时，公开页才使用 `src/features/articles/demo-data.ts` 的演示内容。配置 API 后，请求错误会直接进入页面错误边界，不会用演示数据掩盖后端故障。

## 质量检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm format:check
```

`pnpm build` 会先扫描界面文案并重新生成霞鹜文楷 WOFF2 子集。不要直接调用 `next build`，否则新增汉字可能未进入字体文件。

Playwright 会自动启动合成 API 和 Next.js 开发服务，覆盖桌面端、移动端、认证旅程、管理功能、截图与 axe 严重问题检查。Lighthouse 需要先在 `http://127.0.0.1:3000` 启动带合成 API 的站点，再执行：

```bash
pnpm audit:lighthouse
```

首页和文章页的性能、可访问性、SEO 任一分数低于 90 时命令失败；报告写入已忽略的 `test-results/lighthouse/`。

## 目录边界

- `src/app`：路由、布局、Metadata、Route Handlers 与错误边界。
- `src/features`：文章、认证、评论、媒体、用户和后台业务模块。
- `src/components/ui`：项目级 shadcn/ui 源码组件。
- `src/components`：跨业务的站点布局与品牌组件。
- `src/config`：浏览器端与服务端环境配置。
- `src/shared`：共享 API 契约和基础能力。
- `tests/e2e`：浏览器功能、视觉和无障碍验收。
- `docs/rebuild-execution-plan.md`：本次全栈重建的执行状态与验收清单。

Docker Compose 只用于服务器部署；宿主机 MySQL/MinIO、Nginx、备份、恢复和回滚运行手册位于相邻的 `website-server` 仓库。本地开发不启动 Compose。

提交到部署分支后，`Publish Web image` 工作流会在 GitHub Actions 中构建并发布 `ghcr.io/hideineye/sunset-footprints-web:deploy`。低内存服务器只需拉取该镜像，不需要安装 Node.js、构建前端或保留本仓库；服务器部署命令统一由 `website-server/scripts/deploy.sh` 提供。

旧数据库中的 11 篇有效文章已迁入 `sunset_blog`；媒体对象迁移与最终切流仍按运行手册单独执行。
