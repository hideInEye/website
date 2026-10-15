import { useLoaderData } from "react-router-dom";
import { homeLoader } from "../../loaders";
import { ArrowRightIcon, CompassIcon, SparklesIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Pagination, SunsetTimeline } from "@/features/articles";

export default function HomePage() {
  const { posts, categories, tags } = useLoaderData<typeof homeLoader>();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "日落的足迹",
    description: "把代码、生活和途中看到的光，留在这里。",
    inLanguage: "zh-CN"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="relative overflow-hidden border-b">
        <div className="sunset-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 top-14 size-80 rounded-full bg-horizon/12 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-18 pt-18 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1fr_17rem] lg:px-8">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-horizon/25 bg-background/55 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <SparklesIcon className="size-3.5" />
              暮光观测日志 · 记录于东八区
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="font-literary text-balance text-5xl font-semibold leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
                把走过的路，
                <br />
                <span className="bg-gradient-to-r from-horizon via-primary to-twilight bg-clip-text text-transparent">
                  留在日落之后。
                </span>
              </h1>
              <p className="max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
                写代码，也写城市、旅途和具体的生活。每篇文章都是一次观测，日期是它留在地平线上的刻度。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="#latest" className={buttonVariants({ size: "lg" })}>
                开始阅读
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <Link to="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
                这是什么地方
              </Link>
            </div>
          </div>
          <aside
            className="hidden self-end rounded-2xl border bg-card/55 p-5 backdrop-blur lg:block"
            aria-label="今日观测"
          >
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <CompassIcon className="size-4 text-primary" />
              今日观测
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">日志</dt>
                <dd className="mt-1 font-literary text-2xl font-semibold">{posts.total}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">主题</dt>
                <dd className="mt-1 font-literary text-2xl font-semibold">{categories.length}</dd>
              </div>
              <div className="col-span-2 border-t pt-4">
                <dt className="text-muted-foreground">最近更新</dt>
                <dd className="mt-1 font-medium">暮光之后，仍有余温</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section
        id="latest"
        className="mx-auto grid max-w-6xl gap-14 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8"
      >
        <div>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Observation log
              </p>
              <h2 className="font-literary text-3xl font-semibold">最近的观测</h2>
            </div>
            <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground">
              浏览全部
            </Link>
          </div>
          <SunsetTimeline posts={posts.items} />
          <Pagination
            currentPage={posts.page}
            totalPages={posts.totalPages}
            buildHref={(nextPage) => (nextPage === 1 ? "/" : `/?page=${nextPage}`)}
          />
        </div>

        <aside className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              观测区域
            </h2>
            <div className="flex flex-col gap-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.postCount}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              常用坐标
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}`}
                  className="rounded-full border bg-card/55 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-horizon/40 hover:text-foreground"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
