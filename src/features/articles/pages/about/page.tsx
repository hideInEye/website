import { ArrowRightIcon, Code2Icon, MapIcon, NotebookPenIcon } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="About this place"
        title="这里不是答案仓库，是一册持续更新的观测日志。"
        description="“日落的足迹”开始于对技术的记录，后来也装下了城市、旅途、书和普通日子里的光。"
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Code2Icon,
            title: "代码手记",
            text: "工程实践、踩坑记录，以及值得长期维护的选择。"
          },
          {
            icon: MapIcon,
            title: "沿途观察",
            text: "城市与旅行，不做攻略，只保存真实的感受和时间。"
          },
          {
            icon: NotebookPenIcon,
            title: "工作方法",
            text: "关于写作、协作、学习和如何把事情做得更从容。"
          }
        ].map(({ icon: Icon, title, text }) => (
          <section key={title} className="rounded-xl border bg-card/60 p-5">
            <Icon className="mb-5 size-5 text-primary" />
            <h2 className="font-literary text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </section>
        ))}
      </div>
      <div className="article-prose mt-14">
        <h2>为什么是日落</h2>
        <p>
          日落不意味着一天被清空。它更像一条可见的边界：让人知道时间经过了，也让那些发生过的事获得轮廓。这里的每篇文章都保留发布日期，首页那条轨迹就是这个比喻的延伸。
        </p>
        <h2>关于内容与引用</h2>
        <p>
          本站原创内容默认保留作者署名。引用时请附上文章标题与链接；代码片段若有单独许可证，以仓库中的说明为准。
        </p>
      </div>
      <Link to="/" className={buttonVariants({ variant: "outline" })}>
        回到最新日志
        <ArrowRightIcon data-icon="inline-end" />
      </Link>
    </main>
  );
}
