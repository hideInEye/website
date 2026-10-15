import { Link } from "react-router-dom";

import { SunsetMark } from "@/components/sunset-mark";
import { SITE_CONFIG } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-foreground">
            <SunsetMark className="size-6" />
            <span className="font-literary font-semibold">{SITE_CONFIG.name}</span>
          </div>
          <p>{SITE_CONFIG.description}</p>
        </div>
        <div className="flex flex-wrap items-start gap-x-5 gap-y-2 md:justify-end">
          <Link to="/about" className="hover:text-foreground">
            关于
          </Link>
          <Link to="/rss.xml" className="hover:text-foreground">
            RSS
          </Link>
          <Link to="/admin" className="hover:text-foreground">
            管理
          </Link>
          <a
            href="https://beian.miit.gov.cn"
            rel="noreferrer"
            target="_blank"
            className="hover:text-foreground"
          >
            {SITE_CONFIG.filingNumber}
          </a>
        </div>
      </div>
    </footer>
  );
}
