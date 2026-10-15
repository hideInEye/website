# Vite + React / Go 模板重构执行记录

## 范围与约束

- 前端在 `codex/vite-react-go-rebuild` 上改为 Vite + React + React Router，保留原页面、shadcn 组件、字体、配色与交互。
- 后端直接基于 `hideInEye/go-admin-template` 的 Git 历史修改模板，目标仓库是 `hideInEye/website-go`，分支 `codex/blog-api`。模板远程仅用于读取，禁止推送。
- 原 `website-server` 只作接口及数据库契约参考，不修改。
- 本地分别启动前后端，不使用 Docker 开发。GitHub 构建镜像，服务器只拉镜像。
- 继续使用宿主机 MySQL 和 MinIO，不创建额外数据库服务或对象存储服务，不重新迁移既有博客数据。
- 不增设管理员账号或额外业务需求。不执行服务器部署或真实数据库迁移；已完成的代码检查与编译范围见第 6 步。

## 步骤

### 1. 分支与模板基线

- 已创建前端新分支并保存 WIP 检查点 `b9b78f9`。
- 新后端从模板提交 `e846b45` 克隆，保留来源说明；WIP 检查点为 `69f85ec`。
- 新后端 origin 为 `git@github.com:hideInEye/website-go.git`；template 的 push URL 已禁用。

### 2. 前端运行时替换

- 将 Next 路由页面移入原有 features 模块，由单一 React Router 路由表挂载。
- 将服务端数据读取替换为同源 API 客户端与路由 loader；表单保持本地状态。
- 保留分类/标签目录及详情、文章、搜索、账户、认证和全部管理页；处理真实 API 的失败与空结果。
- 替换 Next Link、导航、主题、动态编辑器加载和 metadata；不保留 Next 运行时兼容层。
- RSS、sitemap、robots、旧文章链接跳转由 Go 服务提供。

### 3. 模板后端业务替换

- 保留模板既有 `services/main.go → app.Init → BuildContainer / InitStore → web.RegisterRouter` 启动和路由注册链，不新增 `blog` 聚合包或平行业务框架。
- 业务按模板 `routers/web/ctl → bll → model` 分层，DTO 留在 `schema`，Gorm 实体和实现留在模板对应目录；复用模板依赖注入、事务、日志和插件机制。
- 后端配置只保留模板的 `config/config.toml`，直接在该文件填写各环境需要的参数。使用 `go run services/main.go migrate -c config/config.toml` 初始化、`go run services/main.go -c config/config.toml` 启动；JWT 沿用模板 HS512 算法和 7200 秒有效期，具体字段以 Go 后端 README 为准。
- 只替换模板示例业务；模型字段与现有 MySQL camelCase 列保持一致。
- 迁移文章 CRUD、分页/搜索、slug 历史、分类标签、评论审核、收藏、个人资料、管理员管理和媒体上传。
- 保持 `/api/v1`、响应包装、状态码、Cookie、角色校验与已有密码哈希兼容。
- 已获确认迁移原邮箱注册、验证和密码重置流程；邮件默认使用 TOML 中的日志模式配置，本次不实际发邮件。

### 4. 数据库与媒体

- 初始化命令用于空库建表或核对已有表；不清空、不导入旧数据、不替换现有管理员。
- 使用原 Prisma 初始 SQL 作为表结构依据，不运行模板示例表的自动迁移。
- MinIO 签名使用内部地址；浏览器经同源 `/media` 上传，代理恢复签名 Host。
- 保留上传大小/类型校验、待确认状态及上传完成接口。

### 5. 部署

- Web 镜像仅运行 Nginx；API 镜像仅运行 Go 二进制。服务器无需安装 Node.js / Go。
- 新镜像使用 `sunset-footprints-web:vite` 和 `sunset-footprints-api-go:deploy`，另附提交 SHA 标签，不覆盖旧 Next / Nest 镜像。
- Compose 使用宿主机服务；Web/API 默认绑定宿主机 `127.0.0.1:18080/18081`，宿主机 Nginx 保持 80 端口。
- 服务器直接编辑 `config/config.toml`，填写 MySQL、MinIO、JWT、站点和邮件等业务配置，并执行 `chmod 600 config/config.toml`。部署脚本自动从配置文件所有者推导容器 UID/GID、准备 `data/`，不额外创建配置文件。
- 执行 `sh scripts/deploy.sh` 完成镜像部署，使用 `docker compose ps`、`docker compose logs --tail=100 api web` 查看状态和日志。需要覆盖镜像时，使用 `WEB_IMAGE=... API_IMAGE=... sh scripts/deploy.sh` 或直接修改 Compose。前端自身的 `.env.local` 继续只配置 Vite 本地代理。
- 补齐单一 TOML 配置、Compose 默认值、GitHub Actions、部署脚本、数据库初始化与 README。

### 6. 核对与交付

- 静态对照全部原路由、DTO、权限、响应结构和页面 JSX/CSS。
- Go 后端已通过 `go test ./...`、macOS 入口构建和 Linux/amd64 的 `nomsgpack` 构建；这些检查不等同于数据库、MinIO、邮件或部署联调。
- 功能、视觉与容器运行验证未完成前，不声明重构已验收或可上线。

## 当前状态

前端路由和容器配置已补齐；Go 各业务模块、模板启动链、初始化命令与部署文件已接入，后端测试及上述两种目标构建已通过。尚未执行真实数据库迁移、外部服务联调或服务器部署，不能据此声明上线验收完成；已推送的 WIP 检查点不是完成版本。
