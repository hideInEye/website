import { createBrowserRouter } from "react-router-dom";
import { articlePages, articleLoaders } from "@/features/articles";
import { adminPages, adminLoaders } from "@/features/admin";
import { authPages } from "@/features/auth";
import { userPages, userLoaders } from "@/features/users";
import RootLayout from "./layouts/root-layout";
import SiteLayout from "./layouts/site-layout";
import AuthLayout from "./layouts/auth-layout";
import AdminLayout from "./layouts/admin-layout";
import Loading from "./loading";
import NotFound from "./not-found";
import RouteError from "./route-error";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: Loading,
    children: [
      {
        Component: SiteLayout,
        children: [
          { index: true, loader: articleLoaders.homeLoader, lazy: articlePages.home },
          {
            path: "articles/:slug",
            loader: articleLoaders.articleLoader,
            lazy: articlePages.article
          },
          {
            path: "categories",
            loader: articleLoaders.categoriesLoader,
            lazy: articlePages.categories,
            handle: { title: "文章分类", description: "按主题浏览日落的足迹中的文章。" }
          },
          {
            path: "categories/:slug",
            loader: articleLoaders.categoryLoader,
            lazy: articlePages.category
          },
          {
            path: "tags",
            loader: articleLoaders.tagsLoader,
            lazy: articlePages.tags,
            handle: { title: "文章标签", description: "按标签浏览日落的足迹中的文章。" }
          },
          { path: "tags/:slug", loader: articleLoaders.tagLoader, lazy: articlePages.tag },
          {
            path: "search",
            loader: articleLoaders.searchLoader,
            lazy: articlePages.search,
            handle: { title: "搜索", description: "搜索日落的足迹中的文章。" }
          },
          {
            path: "about",
            lazy: articlePages.about,
            handle: { title: "关于", description: "关于日落的足迹，以及这里记录什么。" }
          },
          { path: "u/:username", loader: userLoaders.profileLoader, lazy: userPages.profile },
          {
            path: "account",
            loader: userLoaders.accountLoader,
            lazy: userPages.account,
            handle: { title: "我的账号", private: true }
          }
        ]
      },
      {
        Component: AuthLayout,
        children: [
          { path: "login", lazy: authPages.login, handle: { title: "登录", private: true } },
          { path: "register", lazy: authPages.register, handle: { title: "注册", private: true } },
          {
            path: "forgot-password",
            lazy: authPages.forgotPassword,
            handle: { title: "找回密码", private: true }
          },
          {
            path: "reset-password",
            lazy: authPages.resetPassword,
            handle: { title: "重置密码", private: true }
          },
          {
            path: "verify-email",
            lazy: authPages.verifyEmail,
            handle: { title: "验证邮箱", private: true }
          }
        ]
      },
      {
        path: "admin",
        loader: adminLoaders.adminLoader,
        Component: AdminLayout,
        handle: { private: true },
        children: [
          {
            index: true,
            loader: adminLoaders.dashboardLoader,
            lazy: adminPages.dashboard,
            handle: { title: "站点概览" }
          },
          {
            path: "posts",
            loader: adminLoaders.postsLoader,
            lazy: adminPages.posts,
            handle: { title: "文章管理" }
          },
          {
            path: "posts/new",
            loader: adminLoaders.editorLoader,
            lazy: adminPages.newPost,
            handle: { title: "新建文章" }
          },
          {
            path: "posts/:id/edit",
            loader: adminLoaders.editPostLoader,
            lazy: adminPages.editPost,
            handle: { title: "编辑文章" }
          },
          {
            path: "posts/:id/preview",
            loader: adminLoaders.previewPostLoader,
            lazy: adminPages.previewPost,
            handle: { title: "文章预览" }
          },
          {
            path: "categories",
            loader: adminLoaders.editorLoader,
            lazy: adminPages.categories,
            handle: { title: "分类管理" }
          },
          {
            path: "tags",
            loader: adminLoaders.editorLoader,
            lazy: adminPages.tags,
            handle: { title: "标签管理" }
          },
          {
            path: "comments",
            loader: adminLoaders.commentsLoader,
            lazy: adminPages.comments,
            handle: { title: "评论审核" }
          },
          {
            path: "users",
            loader: adminLoaders.usersLoader,
            lazy: adminPages.users,
            handle: { title: "用户管理" }
          }
        ]
      },
      { path: "*", Component: NotFound, handle: { title: "页面未找到", private: true } }
    ]
  }
]);
