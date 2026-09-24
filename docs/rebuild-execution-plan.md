# “日落的足迹”全栈重建实施步骤与执行状态

> 本文档既是实施顺序，也是验收记录。`[x]` 表示已经实现并有代码或执行证据，`[ ]` 表示仍需执行或需要部署方提供信息。2026-09-21 已重新启用并完成旧 MySQL 文章迁移；媒体对象迁移与最终切流仍单独执行。

当前结论：目标宿主机 MySQL 已创建 `sunset_blog`，11 篇有效旧文章已完成幂等迁移；MinIO 使用宿主机 `localhost:9000` 并由站点同源代理。最新宿主机 MySQL/MinIO Compose 改动按用户要求未运行构建或通用测试，实际生产上线仍等待第 5.3 节的域名、Secret、Bucket 凭据与服务器操作。

## 0. 当前范围与产品决策

- [x] 前端采用 Next.js 16 App Router、React 19、TypeScript、Tailwind CSS v4 和 shadcn/ui。
- [x] 后端采用 NestJS 11、Fastify、Prisma 6；目标宿主机数据库为 MySQL 5.7.42，`ngram` 插件已确认启用。
- [x] 内容采用 GFM Markdown；后台提供富文本、源码和差异三种编辑模式。
- [x] 文章公开阅读；账号功能要求登录；管理后台要求管理员角色。
- [x] 用户支持邮箱注册与验证、资料、公开主页、评论和私有收藏。
- [x] 每位用户首条评论待审核，通过后后续评论可直接发布。
- [x] 视觉方向为“暮光观测日志”，首页时间线和文章阅读进度共享“日落轨迹”语言。
- [x] MinIO 使用外部既有服务；Compose 不创建 MinIO 实例或数据卷。
- [x] MinIO 最终拓扑确定：宿主机 `localhost:9000`，容器使用 `host.docker.internal:9000`，浏览器通过站点 `/media/` 同源代理访问。
- [x] MinIO 内部链路允许 HTTP；浏览器始终通过站点同源 `/media/` 访问。站点当前可显式使用临时 HTTP，后续由宿主机 Nginx 终止 TLS。
- [x] 本地开发明确不使用 Docker：前端 `pnpm dev`，后端 `pnpm start:dev`，直接连接本机 MySQL 和 MinIO；开发邮件链接输出到后端终端。
- [x] Docker Compose 只用于服务器拉取部署、预检、备份和恢复；服务器不执行镜像构建。
- [x] 服务器 MySQL 与 MinIO 均复用宿主机现有服务，Compose 不创建数据库、对象存储或对应数据卷。
- [x] 真实旧数据库文章迁移已执行；媒体对象迁移和最终切流保留为后续独立步骤。

## 1. 执行前保护与仓库边界

- [x] 确认 `website`、`website-server` 为两个独立 Git 仓库。
- [x] 两个仓库均创建 `codex/full-stack-blog-rebuild` 分支。
- [x] 保留原实现于 Git 历史，不对用户已有改动执行 reset、checkout 或历史重写。
- [x] 删除工作区中的旧证书和明文配置，所有数据库、JWT、SMTP、MinIO、TLS 值改由环境变量注入。
- [x] 两端均提供 `.env.example`；Compose 提供 `.env.compose.example`；真实 `.env*`、证书、备份均被忽略。
- [x] 明确记录：旧秘密仍可能存在于 Git 历史，上线前必须轮换，当前任务未声称清理历史。
- [x] 原前端基线不作为重建门禁；可通过旧提交复现，当前分支以新的功能与质量门禁验收。

## 2. 前端 React/Next.js 重建

### 2.1 工程基础

- [x] 移除 Vue、Vuex、Vue Router、Element Plus、Vite 和旧 wangEditor Vue 运行代码与依赖。
- [x] 建立 Next.js App Router、React 19、TypeScript strict、ESLint、Prettier 和 `@/*` 别名。
- [x] 使用 pnpm 8 锁文件，Node.js 22 作为 CI 与容器运行时。
- [x] 使用 Tailwind CSS v4、语义 CSS 变量和项目内 shadcn/ui 源码组件。
- [x] 安装项目级 shadcn skills，保留 `components.json`、`skills-lock.json` 与 `.agents/skills`。
- [x] shadcn 组件使用按包引入的 Radix primitives 与 Lucide 图标，不依赖聚合 `radix-ui` 包。
- [x] `next.config.ts` 启用 standalone、typed routes、安全响应头并关闭 `x-powered-by`。
- [x] 浏览器请求使用同源 `/api/v1`；服务端只读取 `API_INTERNAL_URL`，不向浏览器泄露内部地址。
- [x] 站点地址使用纯服务端 `SITE_URL`，standalone 镜像可在启动时注入域名；robots、sitemap、RSS 和首页元数据不会固化构建机的 localhost。
- [x] 未配置 API 时才允许演示数据；配置 API 后的错误不会静默回退。

### 2.2 目录与渲染边界

- [x] `src/app` 只承担路由、布局、Metadata、Route Handlers、loading/error/not-found 和权限入口。
- [x] 业务按 `articles`、`auth`、`comments`、`media`、`users`、`admin` 模块组织；分类、标签和收藏归入其主要消费模块。
- [x] 服务端与浏览器 API Client 集中管理 URL、Cookie 转发、错误格式和响应契约。
- [x] 公开读取默认由 Server Components 完成；表单、主题、收藏、评论、抽屉和编辑器才使用 Client Components。
- [x] 搜索、分类、标签和分页状态存入 URL，不复制到全局 UI Store。
- [x] 跨模块通过公开入口导入；shadcn 原子组件按文件路径导入，避免大 barrel 扩大客户端包。
- [x] 后台布局和账号页强制动态渲染，构建阶段不会尝试访问尚未启动的 API。

### 2.3 设计系统与字体

- [x] 建立明暗主题语义 Token：背景、正文、卡片、强调、边框、输入、危险状态和焦点环。
- [x] 使用雾天白、夜航墨、地平线珊瑚、余晖金、远山蓝和暮色紫品牌色。
- [x] 自托管 Noto Sans SC、JetBrains Mono 和霞鹜文楷，不依赖运行时第三方字体请求。
- [x] 构建前扫描源码文案生成霞鹜文楷 WOFF2 子集，并复制 OFL 许可；字体由约 7062 KiB 降至约 160 KiB。
- [x] 实现 Header、移动端导航、Footer、主题切换和搜索入口。
- [x] 实现首页“日落轨迹”、文章阅读进度和 `prefers-reduced-motion` 降级。
- [x] 退役粒子背景、旧登录风景图与通用教学插画。
- [x] 修正 Toast 与徽标对比度，axe 严重/致命级问题为 0。

### 2.4 公开站点

- [x] `/`：品牌主张、最新文章时间线、分类/标签入口和 URL 分页。
- [x] `/articles/[slug]`：封面、元数据、Markdown、稳定标题锚点、目录、阅读进度、收藏、评论和相关文章。
- [x] `/categories/[slug]`、`/tags/[slug]`：真实标题、结果计数和文章列表。
- [x] `/search`：搜索词与页码保存在 URL，服务端渲染结果与空状态。
- [x] `/about`：站点说明、内容范围与备案占位配置。
- [x] `/u/[username]`：公开资料和已审核评论；收藏不公开。
- [x] 提供 canonical、Open Graph、JSON-LD、robots、动态 sitemap 和 RSS。
- [x] `/article/detail?id=<record_id>` 查询旧记录并执行永久重定向。
- [x] API 已配置时，文章不存在返回 404；后端故障进入错误边界。

### 2.5 账号与管理后台

- [x] 登录、注册、邮箱验证、忘记密码和重置密码表单全部连接真实 API。
- [x] 账号页支持资料、头像、本人评论、收藏列表和退出登录。
- [x] 管理概览、文章列表、新建/编辑/预览、分类、标签、评论审核和用户管理全部连接真实 API。
- [x] MDXEditor 仅在客户端动态加载，支持富文本、源码、差异、GFM、表格、图片和代码块。
- [x] 禁用 JSX、可执行 MDX 与原始 HTML；预览和公开页共享 Markdown 解析规则。
- [x] 封面、SEO 标题与 SEO 描述允许显式清空，前后端用 `null` 表达清除。
- [x] 页面边界和每个后端写接口都重新校验登录/角色，不只依赖菜单隐藏。

## 3. 后端 NestJS 重写

### 3.1 基础能力

- [x] 移除 Egg、Sequelize 和旧 CommonJS 入口，建立 NestJS + Fastify 工程。
- [x] 使用 Prisma Client/Migrate；API 前缀固定为 `/api/v1`。
- [x] 启用 DTO 白名单验证、OpenAPI、Helmet、Cookie、压缩、限流、CORS 和全局错误过滤器。
- [x] 成功响应统一为 `{ data, meta? }`，错误响应统一包含 `statusCode`、`code`、`message`、可选字段错误和 `traceId`。
- [x] 提供结构化日志、请求 ID、`/health/live` 与 `/health/ready`。

### 3.2 数据模型与搜索

- [x] `User` 包含邮箱、用户名、昵称、头像、简介、Argon2id 密码、角色和状态。
- [x] Session、邮箱验证令牌和密码重置令牌只保存哈希，支持过期、刷新轮换和撤销。
- [x] `Post` 包含稳定 slug、摘要、Markdown、封面、状态、SEO、作者、分类与 `legacyRecordId`。
- [x] 建立 Category、Tag、PostTag、PostSlugHistory、Comment、Bookmark 和 Media 模型及约束。
- [x] 评论支持一级回复、审核状态与软删除；收藏使用用户/文章组合唯一约束。
- [x] Media 保存对象键、MIME、大小、尺寸、替代文本与上传者。
- [x] MySQL 迁移创建 ngram 全文索引，用于中文标题、摘要和正文搜索。

### 3.3 业务与安全

- [x] Auth：注册、验证、登录、刷新轮换、退出、忘记/重置密码和当前用户。
- [x] Users：本人资料/头像、公开主页、管理员暂停/恢复；暂停后现有 token 立即失效。
- [x] Posts：公开查询、草稿、详情、预览、发布、归档、软删除和 slug 历史。
- [x] Taxonomy：分类和标签 CRUD、唯一 slug。
- [x] Comments：首条待审、后续直发、一级回复、本人删除、本人列表和管理员审核。
- [x] Bookmarks：状态查询、幂等收藏/取消和私有列表；不会返回未发布文章。
- [x] Media：鉴权预签名上传、完成确认、对象元数据 MIME/大小复核和 URL 生成。
- [x] Mail：`MAIL_MODE=log` 不连接 SMTP并把验证/重置链接输出到 API 日志；后续可切换为 `smtp`，邮箱统一规范化。
- [x] 密码使用 Argon2id；旧弱密码不迁移。
- [x] 短期访问令牌与 30 天刷新令牌；刷新令牌旋转且数据库只保存哈希。
- [x] Cookie 使用 `HttpOnly`、生产 `Secure`、`SameSite=Lax`；写请求验证 Origin。
- [x] 管理、媒体和其他写操作在服务层执行认证与授权。
- [x] 登录、注册、验证邮件、评论和密码流程分别限流。
- [x] 媒体读取和预签名上传统一映射到站点 `/media/`，Nginx 保持签名 Host 后转发宿主机 MinIO。

## 4. 真实旧数据迁移

### 4.1 已准备并用合成数据验证的工具

- [x] `migrate:legacy` 默认 dry-run，只有 `--apply` 才写新库。
- [x] 使用 Turndown + GFM 将 HTML 转 Markdown，并统计移除节点、图片和链接。
- [x] `intro` 转摘要，保留发布时间和 `record_id`，标题生成拼音 slug并处理冲突。
- [x] `legacyRecordId` 保证文章幂等；合成数据连续执行两次未产生重复记录。
- [x] 旧用户只统计不导入；有效管理员凭据缺失时使用随机密码、暂停状态的迁移账号，不迁移旧弱密码或创建占位管理员。
- [x] `migrate:media` 支持复制旧对象、重写内部媒体 URL并保留外部图片。
- [x] 合成演练完成后已删除临时数据库、用户、对象与报告。

### 4.2 真实数据库执行记录

- [x] 只读盘点 `web_site_server.posts`：共 22 条，其中有效 11 条、软删除 11 条；`record_id` 无空值或重复。
- [x] 在任何写入前完成旧库全量压缩备份：`backups/legacy-web_site_server-20260921-075326.sql.gz`，文件权限 `600`。
- [x] 确认目标 MySQL 5.7.42 的 `ngram` 为 `ACTIVE`，创建独立 `sunset_blog`（`utf8mb4_unicode_ci`）并应用 Prisma 初始迁移。
- [x] 真实 dry-run 识别 11 篇文章、2 个旧用户、15 个图片引用和 23 个链接引用；1 条空标题及无可见正文记录已显式修复并写入报告。
- [x] 收紧媒体 URL 规则后重新迁移：14 个 Cloudinary 外链原样保留，1 个旧站静态图片地址原样保留待媒体阶段处理；不再依据宽泛路径或本地 `MEDIA_PUBLIC_URL` 自动改写。
- [x] 正式导入 11 篇已发布文章；源/目标按 `record_id` 一一匹配，无缺失、无额外记录，旧用户未导入。
- [x] 修正后连续执行两次 `--apply`，文章数均为 11 且完整数据指纹一致，幂等性通过。
- [ ] 如需接管剩余 1 个旧站静态图片，提供其源对象/只读凭据后执行媒体 dry-run、复制、对象哈希核验，并用显式源/目标 URL 前缀重跑文章迁移。
- [ ] 最终切流前冻结旧后台写入，复核增量、抽查正文与页面，再让旧库保持只读直至观察期结束。

## 5. Docker、宿主机 MinIO 与部署

### 5.1 容器和网络

- [x] 前端和后端均使用 Node.js 22 多阶段 Dockerfile；Next.js 运行 standalone 产物。
- [x] Compose 只管理服务器部署所需的 Web、API 和一次性 migrate；MySQL、MinIO、Nginx、本地 Mailpit 均不进入 Compose 生命周期。
- [x] `mysql-client` 与 `minio-client` 只在 `ops` profile 中用于初始化、预检、备份和恢复。
- [x] API 和 migrate 通过 `host.docker.internal` 连接宿主机 MySQL；Web/API 分别只绑定 `127.0.0.1:18080` 和 `127.0.0.1:18081`。
- [x] 宿主机 Nginx 将页面转发到 Next.js、`/api` 转发到 NestJS，并将 `/media/` 同源转发到宿主机 MinIO。
- [x] 宿主机 Nginx 关闭页面流式缓冲，并设置上传大小和安全响应头。
- [x] TLS 统一由宿主机 Nginx 管理，不再维护 Compose Nginx 或 TLS overlay。
- [x] Web/API 镜像由 GitHub Actions 发布到 GHCR；服务器只拉取镜像，API 与 migrate 共用同一镜像。
- [x] MySQL 与 MinIO 数据都由宿主机服务负责持久化、访问控制和异机备份，Compose 不持有数据卷。

### 5.2 运维脚本和演练证据

- [x] `backup.sh` 在停止写入口后创建 MySQL gzip 与外部 Bucket tar.gz，使用临时文件保证产物原子发布。
- [x] `restore.sh` 先校验归档并要求输入 `RESTORE`，随后重建数据库并用 `mc mirror --remove` 恢复专用 Bucket。
- [x] 新增 `init-host-mysql.sh`，幂等创建目标库、专用非 root 应用账号并验证字符集；API 不接收 root 凭据。
- [x] `preflight.sh` 自动拒绝占位 Secret、不安全文件权限、MinIO 管理员密钥和无效站点来源，并检查宿主机 MySQL 应用连接、字符集、`ngram` 及宿主机 Bucket 的写/读/删与匿名读取；失败路径也会清理探针。
- [x] 提供 `deploy/minio-policy.json`，只授予默认 Bucket 的定位/列举与对象读写删除权限。
- [x] `smoke-deployment.sh` 自动验证首页、关于页、live/ready、robots、sitemap、RSS、数据库状态和安全头，可选检查文章、媒体及旧链接。
- [x] 部署手册覆盖首次部署、宿主机 MinIO/最小权限、备份、恢复、升级、回滚和凭据轮换。
- [x] 改为宿主机 MySQL 之前的 Compose 基础配置与 TLS overlay 曾通过 `docker compose config --quiet`；当前低内存拉取部署拓扑按用户要求不运行测试或构建。
- [x] 用户最终指定使用宿主机 `localhost:9000`，远程 `47.94.129.177:9000` 不再作为应用配置。
- [x] 此前的容器数据库基线中，两个镜像在独立 Compose 项目构建成功，空库迁移、API/Web 健康及 Nginx 首页/ready 均已验证；该结果不冒充最新宿主机 MySQL 拓扑的验证。
- [x] 独立恢复演练：备份后新增数据库记录、覆盖原对象并新增对象；恢复后记录归零、原对象内容复原、新对象删除。
- [x] 部署预检隔离演练：私有 Bucket 按预期在公开读取处失败且无残留对象；开启匿名只读后，完整预检通过。
- [x] MinIO 权限隔离演练：root 凭据按预期在任何探针写入前被拒绝；套用 `deploy/minio-policy.json` 的专用账号通过对象读写、元数据与匿名读取检查，结束后无探针残留。
- [x] 演练临时容器、网络、卷、环境文件和合成备份已删除；原 `sunset-footprints` 环境保持健康且 ready 为 200。
- [x] 两个仓库新增独立镜像发布工作流，生成稳定 `deploy` 标签和可回滚的 `sha-<commit>` 标签。
- [ ] 最新的宿主机 MySQL、`host.docker.internal` 和 `/media/` 同源代理改动按用户要求不运行构建或通用测试；由部署方使用 `docs/host-minio-commands.md` 在服务器验收。

### 5.3 实际生产部署前仍需提供

- [ ] 站点域名、服务器部署目录和有效 TLS 证书。
- [ ] 宿主机 MinIO 专用 Bucket 名和最小权限 access/secret key，并确认容器可经 `host.docker.internal:9000` 连接。
- [ ] 为宿主机 MySQL 生成专用应用账号密码并注入 JWT；SMTP 暂用 `MAIL_MODE=log`，后续启用真实邮件时再配置并轮换相关 Secret。
- [ ] 在目标服务器执行 Compose 启动和注册、邮件、登录、发布、上传、读取冒烟。

## 6. 测试与验收

- [x] 前端具备 Vitest、React Testing Library、Playwright、axe 和 Lighthouse 门禁。
- [x] E2E 覆盖公开阅读、搜索、注册验证、登录、重置密码、首条评论审核、收藏、账号与管理发布流程。
- [x] 浏览器项目覆盖桌面和 375px 移动设备；视觉用例覆盖明暗主题、768/1440 和 reduced-motion。
- [x] Lighthouse 已实测：首页与文章页的性能、可访问性、SEO 均为 100，门槛为 90。
- [x] axe 定向回归覆盖公开页、账号页和后台，严重/致命问题为 0。
- [x] 前端最终全量通过：typecheck、lint、format、6 条单元测试、生产构建和 26/26 Playwright；视觉修复后另有 8/8 定向回归。
- [x] 调整宿主机媒体代理前的后端基线通过：typecheck、lint、format、15 条单元测试、生产构建，以及 Node 22/Linux 中 3/3 条真实 MySQL/MinIO/Mailpit E2E。
- [ ] 最新宿主机 MinIO 同源代理由用户按要求自行测试，尚不把旧基线结果表述为该改动的验证证据。
- [x] `website` 运行依赖中已无 Vue、Vuex、Element Plus 或 wangEditor Vue。
- [x] `website-server` 运行依赖中已无 Egg/Sequelize，工作区无硬编码生产凭据。
- [x] 真实旧数据库文章数量、唯一映射、非空正文、图片/链接引用统计和重复执行幂等性已按第 4.2 节核验。
- [ ] 真实媒体对象及最终页面人工抽查仍按第 4.2 节执行。

## 7. 当前阶段完成定义

只有同时满足以下条件，才将“功能与部署能力”阶段标记为完成：

1. 前后端 lint、类型检查、单元测试和生产构建全部通过。
2. 前端全量浏览器回归、axe 和 Lighthouse 达到门槛。
3. 后端使用真实 MySQL、临时 MinIO 和 Mailpit 的集成测试通过。
4. 独立 Compose 能连接宿主机 MySQL/MinIO，从空目标库执行迁移并通过健康检查。
5. 公开阅读、账号、评论、收藏、管理发布与媒体上传具备端到端实现。
6. 数据库和宿主机 Bucket 的备份/恢复流程在隔离环境实际演练成功。
7. 未获得生产 Secret、域名或目标服务器执行结果时，不伪造“已上线”结论，而是列为部署输入项。

旧数据库文章迁移已完成；媒体对象迁移与最终生产切流另按第 4.2 节和第 5.3 节执行。
