import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ApiClientError } from "@/shared/api-client";
import {
  getAdminComments,
  getAdminDashboard,
  getAdminPost,
  getAdminPosts,
  getAdminUsers,
  getCurrentUser,
  getEditorTaxonomy
} from "./queries";

export async function adminLoader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getCurrentUser();
    if (user.role !== "ADMIN") throw redirect("/");
    return user;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      const url = new URL(request.url);
      throw redirect(`/login?next=${encodeURIComponent(url.pathname + url.search)}`);
    }
    throw error;
  }
}

export async function dashboardLoader() {
  const [dashboard, posts] = await Promise.all([getAdminDashboard(), getAdminPosts(1, 5)]);
  return { dashboard, posts };
}
export const postsLoader = () => getAdminPosts(1, 20);
export const editorLoader = () => getEditorTaxonomy();
export const commentsLoader = () => getAdminComments();
export const usersLoader = () => getAdminUsers();
export const previewPostLoader = ({ params }: LoaderFunctionArgs) => getAdminPost(params.id!);
export async function editPostLoader({ params }: LoaderFunctionArgs) {
  const [post, taxonomy] = await Promise.all([getAdminPost(params.id!), getEditorTaxonomy()]);
  return { post, ...taxonomy };
}
