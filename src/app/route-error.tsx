import { useEffect } from "react";
import { isRouteErrorResponse, Navigate, useLocation, useRouteError } from "react-router-dom";
import { ApiClientError } from "@/shared/api-client";
import ErrorPage from "./error";
import NotFound from "./not-found";

export default function RouteError() {
  const error = useRouteError();
  const location = useLocation();
  const status =
    error instanceof ApiClientError || isRouteErrorResponse(error) ? error.status : 500;
  useEffect(() => {
    document.title = `${status === 404 ? "页面未找到" : "观测暂时中断"} · 日落的足迹`;
  }, [status]);
  if (status === 401)
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  if (status === 403) return <Navigate to="/" replace />;
  if (status === 404) return <NotFound />;
  return (
    <ErrorPage
      error={error instanceof Error ? error : new Error("页面加载失败")}
      reset={() => window.location.reload()}
    />
  );
}
