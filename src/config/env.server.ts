import "server-only";

import { z } from "zod";

const bareOrigin = z
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === "" &&
      url.username === "" &&
      url.password === ""
    );
  }, "必须是主机地址，不要包含路径、查询参数、片段或凭据")
  .transform((value) => value.replace(/\/$/, ""));

const optionalOrigin = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  bareOrigin.optional()
);

const environmentSchema = z.object({
  SITE_URL: bareOrigin.default("http://localhost:3000"),
  API_INTERNAL_URL: optionalOrigin
});

const parsed = environmentSchema.safeParse({
  SITE_URL: process.env.SITE_URL,
  API_INTERNAL_URL: process.env.API_INTERNAL_URL
});

if (!parsed.success) {
  throw new Error(`前端环境变量校验失败：${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;
