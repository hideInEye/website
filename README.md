# 日落的足迹 Web

博客前端，使用 Next.js 16、React 19、TypeScript、Tailwind CSS v4 和 shadcn/ui。它负责公开阅读、分类与标签、用户交互和管理界面；业务数据、认证和媒体上传由 `website-server` 提供。

## 两个仓库如何运行

| 环境 | Web | API | MySQL / MinIO / Nginx |
| --- | --- | --- | --- |
| 本地开发 | 在本仓库执行 `pnpm dev` | 在 `website-server` 执行 `pnpm start:dev` | 使用本机服务，不使用 Docker |
| 服务器 | 运行 GHCR 预构建镜像 | 运行 GHCR 预构建镜像 | 使用宿主机现有服务 |

本地开发时，两个项目分别启动，放在相邻目录只是方便，不是运行要求。服务器部署时只需保留 `website-server` 仓库：其中的 Compose 文件会同时拉取 Web 和 API 镜像，因此不需要在服务器克隆本仓库、安装 Node.js 或构建前端。

## 本地开发

### 1. 启动后端

先按 `website-server/README.md` 准备本机 MySQL、MinIO 和后端环境变量，然后在后端仓库启动 API：

```bash
cd /Users/juvenile/Documents/private/website-server
pnpm start:dev
```

后端默认地址为 `http://localhost:4000`。

### 2. 启动前端

本项目要求 Node.js 22 和 pnpm 8.15.9。首次启动：

```bash
cd /Users/juvenile/Documents/private/website
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

`.env.local` 保持为：

```dotenv
SITE_URL=http://localhost:3000
API_INTERNAL_URL=http://localhost:4000
```

浏览器访问 `http://localhost:3000`。前端的同源 `/api` 路由会把请求转发到 `API_INTERNAL_URL`，浏览器不需要直接访问 4000 端口。

后续日常开发只需两个终端：

```bash
# 终端 1：后端
cd /Users/juvenile/Documents/private/website-server && pnpm start:dev

# 终端 2：前端
cd /Users/juvenile/Documents/private/website && pnpm dev
```

`SITE_URL` 和 `API_INTERNAL_URL` 都只在服务端读取。未设置 `API_INTERNAL_URL` 时，公开页会使用演示数据；配置后若 API 不可用，页面会显示错误边界，不会用演示数据掩盖故障。

## 服务器部署

生产镜像由 GitHub Actions 构建。推送到工作流配置的部署分支后，等待 `Publish Web image` 成功，工作流会发布：

```text
ghcr.io/hideineye/sunset-footprints-web:deploy
ghcr.io/hideineye/sunset-footprints-web:sha-<完整提交SHA>
```

服务器不要执行 `pnpm build` 或 `docker build`。在服务器进入 `website-server` 仓库，按该仓库 README 的完整步骤配置 `.env`、宿主机 MySQL、MinIO 和 Nginx，然后执行：

```bash
COMPOSE_ENV_FILE=.env ./scripts/preflight.sh
COMPOSE_ENV_FILE=.env ./scripts/deploy.sh
```

`deploy` 标签用于跟随最新部署版本；需要锁定或回滚时，把后端 `.env` 中的 `WEB_IMAGE` 改为对应的 `sha-<完整提交SHA>`，再执行同一个部署脚本。

## 环境变量说明

- `SITE_URL`：站点公开地址，用于 canonical、Open Graph、robots、sitemap 和 RSS。必须包含 `http://` 或 `https://`。
- `API_INTERNAL_URL`：Next.js 服务端访问 NestJS 的地址。本地为 `http://localhost:4000`，Compose 内固定为 `http://api:4000`。
- 媒体公开地址由后端返回。前端不保存 MinIO 凭据，也不应出现 `host.docker.internal` 或服务器的 `localhost:9000`。

## 质量检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm format:check
```

`pnpm build` 会先重新生成霞鹜文楷 WOFF2 字体子集。不要直接调用 `next build`，否则新增汉字可能不会进入字体文件。

## 目录说明

- `src/app`：路由、布局、Metadata、Route Handlers 与错误边界。
- `src/features`：文章、认证、评论、媒体、用户和后台业务模块。
- `src/components/ui`：项目级 shadcn/ui 组件。
- `src/components`：跨业务的站点布局与品牌组件。
- `src/config`：浏览器端与服务端环境配置。
- `src/shared`：共享 API 契约和基础能力。
- `tests/e2e`：浏览器功能、视觉和无障碍验收。
- `docs/rebuild-execution-plan.md`：全栈重建执行状态与验收清单。
- `docs/requirements-rebaseline.md`：需求复核基线。
- `docs/remaining-work-plan.md`：分类、标签、媒体上传和服务器验收步骤。
