import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ApiClientError } from "@/shared/api-client";
import { getAccountOverview, getPublicProfile } from "./queries";

export async function accountLoader() {
  try { return await getAccountOverview(); }
  catch (error) {
    if (error instanceof ApiClientError && error.status === 401) throw redirect("/login?next=/account");
    throw error;
  }
}

export async function profileLoader({ params }: LoaderFunctionArgs) {
  const username = params.username!;
  if (!/^[a-zA-Z0-9_-]{2,32}$/.test(username)) throw new Response("用户不存在", { status: 404 });
  const profile = await getPublicProfile(username);
  return { ...profile, meta: { title: profile.displayName, description: profile.bio ?? `@${profile.username} 的公开主页` } };
}
