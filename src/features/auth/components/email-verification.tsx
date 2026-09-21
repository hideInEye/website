"use client";

import Link from "next/link";
import { CircleCheckIcon, MailCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ApiClientError } from "@/shared/api-client/response";
import { verifyEmail } from "../api";

type VerificationState = "idle" | "submitting" | "success" | "error";

export function EmailVerification({ token }: { token?: string }) {
  const [state, setState] = useState<VerificationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function confirm() {
    if (!token) return;
    setState("submitting");
    try {
      await verifyEmail(token);
      setState("success");
    } catch (error) {
      setErrorMessage(error instanceof ApiClientError ? error.message : "验证请求失败，请稍后重试");
      setState("error");
    }
  }

  const success = state === "success";

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-card/80 p-8 text-center shadow-xl">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {success ? <CircleCheckIcon className="size-7" /> : <MailCheckIcon className="size-7" />}
      </div>
      <h1 className="font-literary text-3xl font-semibold">
        {success ? "邮箱验证完成" : token ? "确认你的邮箱" : "去邮箱完成确认"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {success
          ? "账号已启用，现在可以登录并参与讨论。"
          : token
            ? "为避免邮件安全扫描器误触，点击下方按钮后才会启用账号。"
            : "验证链接将在一段时间后失效。如果没有看到邮件，请检查垃圾邮件目录。"}
      </p>

      {state === "error" ? (
        <Alert variant="destructive" className="mt-6 text-left">
          <TriangleAlertIcon />
          <AlertTitle>验证没有完成</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-7 flex flex-col gap-3">
        {token && !success ? (
          <Button type="button" onClick={confirm} disabled={state === "submitting"}>
            {state === "submitting" ? <Spinner data-icon="inline-start" /> : null}
            {state === "submitting" ? "验证中" : "确认并启用账号"}
          </Button>
        ) : null}
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: success ? "default" : "outline" }))}
        >
          {success ? "前往登录" : "返回登录"}
        </Link>
      </div>
    </div>
  );
}
