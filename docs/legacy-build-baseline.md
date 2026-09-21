# 旧前端生产构建基线

记录日期：2026-09-21（Asia/Shanghai）

## 基线来源

- 仓库：`website`
- 只读导出提交：`6eafe3f8429612f5ab4d72c9f30cf98e0b2f3a24`
- 提交时间：2025-02-12T17:26:43+08:00
- 提交说明：`新增完成跳转首页`
- 运行环境：Node.js 20.19.5、pnpm 8.15.9
- 隔离目录：由 `git archive HEAD` 导出到系统临时目录；未改动当前 React 工作树。

## 构建命令

```bash
pnpm install --no-frozen-lockfile --ignore-scripts
pnpm build
```

## 结果

旧 Vue/Vite 工程未能生成生产包。Vite 2.9.18 在转换 145 个模块后终止，原因是
`src/until/modes.ts` 引用了未在 `package.json` 声明的 `@vueuse/core`：

```text
[vite]: Rollup failed to resolve import "@vueuse/core" from "src/until/modes.ts".
```

同时记录到一个非阻断警告：旧防抖函数在 ESM 顶层使用 `this`，构建器会将其替换为
`undefined`。因此迁移前可复现的基线是“依赖声明不完整、生产构建失败”，不存在可用于体积比较的
可信 `dist` 产物。新工程的验收基线改为以全绿生产构建、Docker 镜像及 Lighthouse 报告为准。
