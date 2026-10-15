# 日落的足迹 Web

博客前端使用 Vite、React 19、React Router、TypeScript、Tailwind CSS v4 和现有 shadcn/ui 组件。保留日落配色、霞鹜文楷标题、时间线、深浅主题、移动端布局和原有公开页、账户页及管理界面。

这是 `codex/vite-react-go-rebuild` 分支。前端不再运行 Next.js；生产容器仅运行 Nginx，Node.js 只用于本地开发和 GitHub 镜像构建。配套 Go 后端是 [website-go](https://github.com/hideInEye/website-go)，本地目录约定为 `../website-go-server`；原 `website-server` 保留不动。

## 本地开发

前后端分别启动，不使用 Docker。两个仓库可以放在不同目录。

本地安装 Node.js 22 和 pnpm 8.15.9，按 Go 后端 README 配置并启动 MySQL、MinIO 和 4000 端口 API，再启动前端：

```bash
# 终端 1：在新 Go 后端目录
cd website-go-server
# 先编辑 config/config.toml，填写本地业务配置
go run services/main.go migrate -c config/config.toml
go run services/main.go -c config/config.toml
```

Go 后端只使用模板的 `config/config.toml`，数据库、MinIO、JWT、站点地址与邮件参数都写在其中；JWT 沿用模板的 HS512 算法和 7200 秒有效期，具体字段以 Go 后端 README 为准。迁移命令只校验、补齐原 Prisma 数据表，不导入旧数据或新增管理员。另开终端启动前端：

```bash
cd website
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

访问 `http://localhost:3000`。`.env.local` 只配置本地代理：

```dotenv
API_PROXY_TARGET=http://127.0.0.1:4000
MEDIA_PROXY_TARGET=http://127.0.0.1:9000
MEDIA_PROXY_HOST=localhost:9000
```

`MEDIA_PROXY_HOST` 必须与后端签名时使用的 MinIO 主机名和端口一致。如果后端使用 `127.0.0.1:9000`，这里也改为 `127.0.0.1:9000`。

浏览器始终请求同源 `/api/v1` 和 `/media/`。Vite 负责转发，无需跨域直连 API 或 MinIO。前端不需要数据库、JWT、邮件或 MinIO 密钥，也不使用旧的 `SITE_URL` / `API_INTERNAL_URL`；站点公开地址配置在 Go 后端中。不要将密钥放入任何 `VITE_*` 变量。

所有页面读取真实 API。后端不可用时显示错误页；演示文章仅用于测试，不会替代生产数据。

## GitHub 构建镜像

推送 `codex/vite-react-go-rebuild` 分支会触发 `Publish Vite Web image`，或在 GitHub Actions 中手动运行该工作流。发布的镜像为：

```text
ghcr.io/hideineye/sunset-footprints-web:vite
ghcr.io/hideineye/sunset-footprints-web:sha-<完整提交SHA>
```

新的 `vite` 标签不会覆盖原 Next.js 的 `deploy` 标签。配套后端镜像为：

```text
ghcr.io/hideineye/sunset-footprints-api-go:deploy
```

Docker 多阶段构建在 GitHub 上完成依赖安装、字体子集生成、类型检查和 Vite 打包，最终镜像仅包含 Nginx 与静态资源。服务器无需安装 Node.js，也无需执行 `pnpm build` 或 `docker build`。

CI 工作流另行执行类型、lint、单元、浏览器检查；本地是否运行这些检查按当前开发任务的要求决定。

## 服务器部署

服务器只需拉取新 Go 后端仓库。该仓库中的 Compose 和脚本会同时拉取前后端镜像，完整首次部署、MySQL、MinIO、宿主机 Nginx、更新和回滚步骤以它的 README 为准。

```bash
git clone --branch codex/blog-api git@github.com:hideInEye/website-go.git website-go-server
cd website-go-server
# 先编辑 config/config.toml，填写服务器业务配置
chmod 600 config/config.toml
```

编辑 `config/config.toml`，填写宿主机 MySQL、MinIO、JWT、站点地址和邮件等业务配置，不另建后端配置文件。Compose 已设置上述前后端默认镜像与端口。部署脚本自动从该配置文件的所有者推导容器 UID/GID，并准备 `data/` 目录。

配置完成且两边 GitHub 镜像发布成功后：

```bash
sh scripts/deploy.sh
docker compose ps
docker compose logs --tail=100 api web
```

前端容器监听 `3000`，宿主机绑定 `127.0.0.1:18080`；API 绑定 `127.0.0.1:18081`。宿主机 Nginx 继续监听 `80`，转发到这些端口，不与容器抢占端口。HTTP、邮件暂用日志模式、现有管理员账户等配置都由后端管理。

前端 Nginx 的运行时环境变量：

| 变量               | 默认值                             | 用途                     |
| ------------------ | ---------------------------------- | ------------------------ |
| `API_UPSTREAM`     | `http://api:4000`                  | Compose 中 Go API 服务   |
| `MEDIA_UPSTREAM`   | `http://host.docker.internal:9000` | 宿主机 MinIO             |
| `MEDIA_PROXY_HOST` | `host.docker.internal:9000`        | 必须匹配 MinIO 签名 Host |

Web 容器需配置 `extra_hosts: ["host.docker.internal:host-gateway"]`。宿主机 Nginx 将整个站点转发到 18080，Web 容器负责 `/media/` 的签名 Host，无需在宿主机重复配置媒体代理；浏览器不能直接访问容器内部主机名。

Nginx 对前端页面使用 SPA 回退，所以刷新 `/categories/某个slug`、`/admin/posts/某个id/edit` 等深层路径仍可打开。`/api/`、`/media/` 不会回退成 HTML；`/rss.xml`、`/sitemap.xml`、`/robots.txt`、`/article/detail?id=...` 交由 Go 服务处理。容器健康检查地址是 `/healthz`。

每次更新只需等 GitHub 构建完成后，在 Go 后端仓库重新运行部署脚本。需要锁定或回滚版本时，可直接修改 Compose 中的镜像，或在本次命令中覆盖镜像，不需要额外环境文件。先将下面的提交 SHA 占位符替换为目标版本：

```bash
WEB_IMAGE='ghcr.io/hideineye/sunset-footprints-web:sha-<前端完整提交SHA>' \
API_IMAGE='ghcr.io/hideineye/sunset-footprints-api-go:sha-<后端完整提交SHA>' \
sh scripts/deploy.sh
```

## 页面与数据边界

- 公开页：`/`、`/articles/:slug`、`/categories`、`/categories/:slug`、`/tags`、`/tags/:slug`、`/search`、`/about`、`/u/:username`。
- 账户与认证：`/account`、`/login`、`/register`、`/forgot-password`、`/reset-password`、`/verify-email`。
- 后台：`/admin`、文章列表/新建/编辑/预览、分类、标签、评论审核、用户管理。
- React Router loader 负责读取与重新加载数据；页面只消费 loader 数据，表单保持本地 UI 状态。登录状态使用后端 HttpOnly Cookie，管理员权限由 API 校验。
- 页面标题、描述、canonical、Open Graph 和结构化数据在浏览器加载后更新。RSS、sitemap 与旧链接的 HTTP 跳转由 Go 后端直接提供；本分支不包含服务端 HTML 渲染。

## 常用命令

```bash
pnpm dev           # 本地开发
pnpm typecheck     # TypeScript 静态检查
pnpm lint          # ESLint
pnpm build         # 字体子集 + 类型检查 + Vite 生产打包
pnpm start         # 仅本地预览 dist，不用于生产部署
pnpm test
pnpm test:e2e
```

不要跳过字体子集步骤直接发布 `vite build` 产物，否则新增汉字可能未进入标题字体文件。

## 目录

```text
src/app/             路由表、布局、错误与加载页、全局样式
src/features/        文章、账户、认证、评论、媒体、管理模块
  <feature>/pages/   按页面目录组织的原界面
  <feature>/loaders.ts   页面数据读取
src/shared/api-client/  同源浏览器 API 客户端与错误契约
src/components/      站点通用组件与 shadcn/ui
deploy/              静态容器 Nginx 配置
tests/               API fixture 与浏览器验收
```

`docs/` 中原 Next.js 重建资料保留为历史记录；本分支当前运行方式以本 README 和 `docs/refactor-vite-go-plan.md` 为准。
