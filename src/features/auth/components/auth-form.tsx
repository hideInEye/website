import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/shared/api-client/response";
import { submitAuth, type AuthMode } from "../api";

const schemas = {
  login: z.object({
    email: z.email("请输入有效邮箱"),
    password: z.string().min(8, "密码至少 8 位")
  }),
  register: z.object({
    username: z
      .string()
      .min(2, "用户名至少 2 位")
      .max(32)
      .regex(/^[a-zA-Z0-9_-]+$/, "只能使用字母、数字、横线与下划线"),
    email: z.email("请输入有效邮箱"),
    password: z.string().min(10, "密码至少 10 位")
  }),
  forgot: z.object({ email: z.email("请输入有效邮箱") }),
  reset: z.object({ password: z.string().min(10, "密码至少 10 位") })
};

type FormValues = { username?: string; email?: string; password?: string };

const copy: Record<AuthMode, { title: string; description: string; submit: string }> = {
  login: {
    title: "欢迎回来",
    description: "登录后可以收藏文章、发表评论和管理个人资料。",
    submit: "登录"
  },
  register: {
    title: "加入这段旅程",
    description: "注册后我们会发送一封验证邮件，确认后即可参与讨论。",
    submit: "创建账号"
  },
  forgot: {
    title: "找回密码",
    description: "输入注册邮箱，我们会发送一条限时重置链接。",
    submit: "发送重置邮件"
  },
  reset: {
    title: "设置新密码",
    description: "使用至少 10 位、且不在其他网站复用的新密码。",
    submit: "更新密码"
  }
};

export function AuthForm({
  mode,
  token,
  nextPath = "/account"
}: {
  mode: AuthMode;
  token?: string;
  nextPath?: string;
}) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const config = copy[mode];
  const form = useForm<FormValues>({
    resolver: zodResolver(schemas[mode]) as Resolver<FormValues>,
    defaultValues: { username: "", email: "", password: "" }
  });

  async function onSubmit(values: FormValues) {
    try {
      await submitAuth(mode, { ...values, token });
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "请求没有完成，请稍后再试");
      return;
    }
    if (mode === "login") {
      toast.success("登录成功");
      void navigate(nextPath);
      void revalidator.revalidate();
      return;
    }
    toast.success(
      mode === "register" ? "验证邮件已发送" : mode === "forgot" ? "重置邮件已发送" : "密码已更新"
    );
    void navigate(mode === "register" || mode === "forgot" ? "/verify-email" : "/login");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-xl shadow-foreground/5 backdrop-blur sm:p-8">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="font-literary text-3xl font-semibold">{config.title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{config.description}</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {mode === "register" ? (
            <Field>
              <FieldLabel htmlFor="username">用户名</FieldLabel>
              <Input id="username" autoComplete="username" {...form.register("username")} />
              <FieldError>{form.formState.errors.username?.message}</FieldError>
            </Field>
          ) : null}
          {mode !== "reset" ? (
            <Field>
              <FieldLabel htmlFor="email">邮箱</FieldLabel>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
          ) : null}
          {mode === "login" || mode === "register" || mode === "reset" ? (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">密码</FieldLabel>
                {mode === "login" ? (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    忘记密码？
                  </Link>
                ) : null}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                {...form.register("password")}
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
              {mode !== "login" ? (
                <FieldDescription>至少 10 位，建议使用密码管理器生成。</FieldDescription>
              ) : null}
            </Field>
          ) : null}
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <ArrowRightIcon data-icon="inline-start" />
            )}
            {form.formState.isSubmitting ? "处理中" : config.submit}
          </Button>
        </FieldGroup>
      </form>
      <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            还没有账号？{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              立即注册
            </Link>
          </>
        ) : mode === "register" ? (
          <>
            已有账号？{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              返回登录
            </Link>
          </>
        ) : (
          <Link to="/login" className="font-medium text-primary hover:underline">
            返回登录
          </Link>
        )}
      </div>
    </div>
  );
}
