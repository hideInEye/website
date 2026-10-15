import { Link } from "react-router-dom";
import { ArrowUpRightIcon, FolderTreeIcon, TagsIcon } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { taxonomyDirectoryStyles as styles } from "./taxonomy-directory.styles";
import type { Taxonomy } from "../types";

export function TaxonomyDirectory({
  type,
  items
}: {
  type: "category" | "tag";
  items: Taxonomy[];
}) {
  const isCategory = type === "category";
  const basePath = isCategory ? "categories" : "tags";
  const Icon = isCategory ? FolderTreeIcon : TagsIcon;
  const label = isCategory ? "分类" : "标签";

  return (
    <main className={styles.page}>
      <PageHeading
        eyebrow={isCategory ? "Observation areas" : "Coordinates"}
        title={isCategory ? "文章分类" : "文章标签"}
        description={
          isCategory
            ? "按主题浏览每一片观测区域，找到同一路径上的文章。"
            : "沿着文章留下的坐标，发现彼此关联的记录。"
        }
      />

      {items.length > 0 ? (
        <section className={styles.grid} aria-label={label + "列表"}>
          {items.map((item) => {
            const href = "/" + basePath + "/" + item.slug;

            return (
              <Card key={item.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <CardTitle>
                    <Link to={href} className={styles.titleLink}>
                      {isCategory ? item.name : "# " + item.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className={styles.description}>
                    {isCategory
                      ? item.description || "收录在同一主题下的观测与记录。"
                      : "查看所有带有这个标签的已发布文章。"}
                  </CardDescription>
                </CardHeader>
                <CardContent className={styles.cardContent}>
                  <Badge variant="sunset">{item.postCount ?? 0} 篇文章</Badge>
                </CardContent>
                <CardFooter className={styles.cardFooter}>
                  <Button asChild variant="ghost" size="sm" className={styles.cardAction}>
                    <Link to={href}>
                      浏览{label}
                      <ArrowUpRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      ) : (
        <Empty className={styles.empty}>
          <EmptyHeader>
            <EmptyMedia>
              <Icon className={styles.emptyIcon} />
            </EmptyMedia>
            <EmptyTitle>暂时还没有{label}</EmptyTitle>
            <EmptyDescription>
              {isCategory
                ? "管理员创建分类后，它们会显示在这里。"
                : "管理员创建标签后，它们会显示在这里。"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  );
}
