import { useEffect } from "react";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigation
} from "react-router-dom";
import { SITE_CONFIG } from "@/config/site";

interface IPageMeta {
  title?: string;
  description?: string | null;
  image?: string | null;
  type?: string;
  private?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

function setMeta(key: string, value: string, property = false) {
  const attribute = property ? "property" : "name";
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export default function RootLayout() {
  const matches = useMatches();
  const location = useLocation();
  const navigation = useNavigation();
  useEffect(() => {
    const meta = matches.reduce<IPageMeta>((result, match) => {
      const data = match.data as { meta?: IPageMeta } | undefined;
      return { ...result, ...(match.handle as IPageMeta | undefined), ...data?.meta };
    }, {});
    const title = meta.title ? `${meta.title} · ${SITE_CONFIG.name}` : SITE_CONFIG.name;
    const description = meta.description || SITE_CONFIG.description;
    const canonical = new URL(location.pathname, window.location.origin).href;
    document.title = title;
    setMeta("description", description);
    setMeta("robots", meta.private ? "noindex,nofollow" : "index,follow");
    for (const [key, value] of Object.entries({
      title,
      description,
      url: canonical,
      type: meta.type || "website",
      site_name: SITE_CONFIG.name,
      locale: "zh_CN",
      image: meta.image ? new URL(meta.image, window.location.origin).href : ""
    }))
      setMeta(`og:${key}`, value, true);
    setMeta("twitter:card", meta.image ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", meta.image ? new URL(meta.image, window.location.origin).href : "");
    setMeta("article:published_time", meta.publishedTime ?? "", true);
    setMeta("article:modified_time", meta.modifiedTime ?? "", true);
    document.head
      .querySelectorAll('meta[property="article:tag"]')
      .forEach((element) => element.remove());
    for (const tag of meta.tags ?? []) {
      const element = document.createElement("meta");
      element.setAttribute("property", "article:tag");
      element.content = tag;
      document.head.appendChild(element);
    }
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [matches, location.pathname]);

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {navigation.state === "loading" ? "正在加载页面" : ""}
      </div>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
