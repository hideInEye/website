"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  ExternalLinkIcon,
  FolderTreeIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  TagsIcon,
  Trash2Icon,
  XIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError } from "@/shared/api-client/response";
import { createTaxonomy, deleteTaxonomy, updateTaxonomy } from "../api-browser";
import type { IAdminTaxonomy } from "../types";
import { taxonomyManagerStyles as styles } from "./taxonomy-manager.styles";

interface ITaxonomyDraft {
  name: string;
  slug: string;
  description: string;
}

type TaxonomyErrors = Partial<Record<keyof ITaxonomyDraft, string>>;

const EMPTY_DRAFT: ITaxonomyDraft = { name: "", slug: "", description: "" };
const SLUG_PATTERN = /^[a-z0-9\u4e00-\u9fff]+(?:-[a-z0-9\u4e00-\u9fff]+)*$/i;

function slugify(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("zh-CN")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function validateDraft(draft: ITaxonomyDraft, hasDescription: boolean): TaxonomyErrors {
  const errors: TaxonomyErrors = {};
  const name = draft.name.trim();
  const slug = draft.slug.trim();
  if (!name) errors.name = "请输入名称";
  else if (name.length > 80) errors.name = "名称不能超过 80 个字符";
  if (!slug) errors.slug = "请输入固定链接";
  else if (slug.length > 120) errors.slug = "固定链接不能超过 120 个字符";
  else if (!SLUG_PATTERN.test(slug))
    errors.slug = "只能使用文字、数字和连字符，且不能连续使用连字符";
  if (hasDescription && draft.description.length > 500)
    errors.description = "描述不能超过 500 个字符";
  return errors;
}

function payload(draft: ITaxonomyDraft, hasDescription: boolean) {
  return {
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    ...(hasDescription ? { description: draft.description.trim() } : {})
  };
}

function sorted(items: IAdminTaxonomy[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name, "zh-CN"));
}

export function TaxonomyManager({
  kind,
  type,
  initialItems
}: {
  kind: "分类" | "标签";
  type: "categories" | "tags";
  initialItems: IAdminTaxonomy[];
}) {
  const hasDescription = type === "categories";
  const Icon = hasDescription ? FolderTreeIcon : TagsIcon;
  const [items, setItems] = useState(() => sorted(initialItems));
  const [draft, setDraft] = useState<ITaxonomyDraft>(EMPTY_DRAFT);
  const [draftErrors, setDraftErrors] = useState<TaxonomyErrors>({});
  const [slugEdited, setSlugEdited] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [editDraft, setEditDraft] = useState<ITaxonomyDraft>(EMPTY_DRAFT);
  const [editErrors, setEditErrors] = useState<TaxonomyErrors>({});
  const [savingId, setSavingId] = useState<string>();
  const [pendingDeleteId, setPendingDeleteId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();

  function changeCreateName(name: string) {
    setDraft((current) => ({ ...current, name, slug: slugEdited ? current.slug : slugify(name) }));
    setDraftErrors((current) => ({ ...current, name: undefined, slug: undefined }));
  }

  async function addItem() {
    const errors = validateDraft(draft, hasDescription);
    setDraftErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsCreating(true);
    try {
      const item = await createTaxonomy(type, payload(draft, hasDescription));
      setItems((value) => sorted([...value, { ...item, postCount: 0 }]));
      setDraft(EMPTY_DRAFT);
      setSlugEdited(false);
      toast.success(`${kind}已创建`);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : `${kind}创建失败`);
    } finally {
      setIsCreating(false);
    }
  }

  function beginEdit(item: IAdminTaxonomy) {
    setEditingId(item.id);
    setEditDraft({ name: item.name, slug: item.slug, description: item.description ?? "" });
    setEditErrors({});
    setPendingDeleteId(undefined);
  }

  async function saveEdit(item: IAdminTaxonomy) {
    const errors = validateDraft(editDraft, hasDescription);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSavingId(item.id);
    try {
      const updated = await updateTaxonomy(type, item.id, payload(editDraft, hasDescription));
      setItems((value) =>
        sorted(
          value.map((entry) =>
            entry.id === item.id ? { ...entry, ...updated, postCount: entry.postCount } : entry
          )
        )
      );
      setEditingId(undefined);
      toast.success(`${kind}已更新`);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : `${kind}更新失败`);
    } finally {
      setSavingId(undefined);
    }
  }

  async function removeItem(id: string) {
    setDeletingId(id);
    try {
      await deleteTaxonomy(type, id);
      setItems((value) => value.filter((entry) => entry.id !== id));
      setPendingDeleteId(undefined);
      toast.success(`${kind}已删除`);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : `${kind}删除失败`);
    } finally {
      setDeletingId(undefined);
    }
  }

  return (
    <div className={styles.layout}>
      <Card className={styles.createCard}>
        <CardHeader>
          <CardTitle>创建{kind}</CardTitle>
          <CardDescription>
            {hasDescription ? "定义名称、公开链接和内容范围。" : "定义名称和稳定的公开链接。"}
          </CardDescription>
        </CardHeader>
        <form
          className={styles.cardForm}
          onSubmit={(event) => {
            event.preventDefault();
            void addItem();
          }}
        >
          <CardContent>
            <FieldGroup>
              <Field data-invalid={Boolean(draftErrors.name) || undefined}>
                <FieldLabel htmlFor="taxonomy-create-name">名称</FieldLabel>
                <Input
                  id="taxonomy-create-name"
                  value={draft.name}
                  maxLength={80}
                  aria-invalid={Boolean(draftErrors.name) || undefined}
                  placeholder={hasDescription ? "例如：代码手记" : "例如：React"}
                  onChange={(event) => changeCreateName(event.target.value)}
                />
                <FieldDescription>显示在文章和公开归档页面中。</FieldDescription>
                <FieldError>{draftErrors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(draftErrors.slug) || undefined}>
                <FieldLabel htmlFor="taxonomy-create-slug">Slug</FieldLabel>
                <Input
                  id="taxonomy-create-slug"
                  value={draft.slug}
                  maxLength={120}
                  aria-invalid={Boolean(draftErrors.slug) || undefined}
                  placeholder={hasDescription ? "code-notes" : "react"}
                  onChange={(event) => {
                    setSlugEdited(true);
                    setDraft((current) => ({ ...current, slug: event.target.value }));
                    setDraftErrors((current) => ({ ...current, slug: undefined }));
                  }}
                />
                <FieldDescription>
                  公开路径：/{type}/{draft.slug || "your-slug"}
                </FieldDescription>
                <FieldError>{draftErrors.slug}</FieldError>
              </Field>
              {hasDescription ? (
                <Field data-invalid={Boolean(draftErrors.description) || undefined}>
                  <FieldLabel htmlFor="taxonomy-create-description">描述</FieldLabel>
                  <Textarea
                    id="taxonomy-create-description"
                    value={draft.description}
                    maxLength={500}
                    aria-invalid={Boolean(draftErrors.description) || undefined}
                    placeholder="说明这个分类收录什么内容。"
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, description: event.target.value }));
                      setDraftErrors((current) => ({ ...current, description: undefined }));
                    }}
                  />
                  <FieldDescription className={styles.descriptionCount}>
                    {draft.description.length} / 500
                  </FieldDescription>
                  <FieldError>{draftErrors.description}</FieldError>
                </Field>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button type="submit" className={styles.fullButton} disabled={isCreating}>
              {isCreating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <PlusIcon data-icon="inline-start" />
              )}
              {isCreating ? "创建中…" : `创建${kind}`}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <section className={styles.collection} aria-labelledby="taxonomy-list-title">
        <div className={styles.collectionHeader}>
          <div>
            <h2 id="taxonomy-list-title" className={styles.collectionTitle}>
              已有{kind}
            </h2>
            <p className={styles.collectionDescription}>
              可修改名称与公开链接；文章数量来自已发布内容。
            </p>
          </div>
          <Badge variant="secondary">共 {items.length} 个</Badge>
        </div>

        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <Icon className={styles.emptyIcon} />
              </EmptyMedia>
              <EmptyTitle>还没有{kind}</EmptyTitle>
              <EmptyDescription>使用左侧表单创建第一个{kind}。</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          items.map((item) => {
            const isEditing = editingId === item.id;
            const hasPosts = (item.postCount ?? 0) > 0;
            return (
              <Card key={item.id}>
                {isEditing ? (
                  <form
                    className={styles.cardForm}
                    onSubmit={(event) => {
                      event.preventDefault();
                      void saveEdit(item);
                    }}
                  >
                    <CardHeader className={styles.itemHeader}>
                      <div className={styles.itemIdentity}>
                        <CardTitle>编辑{kind}</CardTitle>
                        <CardDescription>更新后公开页面会使用新的 Slug。</CardDescription>
                      </div>
                      <Badge variant={hasPosts ? "secondary" : "outline"}>
                        {item.postCount ?? 0} 篇
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <FieldGroup>
                        <Field data-invalid={Boolean(editErrors.name) || undefined}>
                          <FieldLabel htmlFor={`taxonomy-edit-name-${item.id}`}>名称</FieldLabel>
                          <Input
                            id={`taxonomy-edit-name-${item.id}`}
                            value={editDraft.name}
                            maxLength={80}
                            aria-invalid={Boolean(editErrors.name) || undefined}
                            onChange={(event) => {
                              setEditDraft((current) => ({ ...current, name: event.target.value }));
                              setEditErrors((current) => ({ ...current, name: undefined }));
                            }}
                          />
                          <FieldError>{editErrors.name}</FieldError>
                        </Field>
                        <Field data-invalid={Boolean(editErrors.slug) || undefined}>
                          <FieldLabel htmlFor={`taxonomy-edit-slug-${item.id}`}>Slug</FieldLabel>
                          <Input
                            id={`taxonomy-edit-slug-${item.id}`}
                            value={editDraft.slug}
                            maxLength={120}
                            aria-invalid={Boolean(editErrors.slug) || undefined}
                            onChange={(event) => {
                              setEditDraft((current) => ({ ...current, slug: event.target.value }));
                              setEditErrors((current) => ({ ...current, slug: undefined }));
                            }}
                          />
                          <FieldDescription>修改后原地址不会自动跳转。</FieldDescription>
                          <FieldError>{editErrors.slug}</FieldError>
                        </Field>
                        {hasDescription ? (
                          <Field data-invalid={Boolean(editErrors.description) || undefined}>
                            <FieldLabel htmlFor={`taxonomy-edit-description-${item.id}`}>
                              描述
                            </FieldLabel>
                            <Textarea
                              id={`taxonomy-edit-description-${item.id}`}
                              value={editDraft.description}
                              maxLength={500}
                              aria-invalid={Boolean(editErrors.description) || undefined}
                              onChange={(event) => {
                                setEditDraft((current) => ({
                                  ...current,
                                  description: event.target.value
                                }));
                                setEditErrors((current) => ({
                                  ...current,
                                  description: undefined
                                }));
                              }}
                            />
                            <FieldDescription className={styles.descriptionCount}>
                              {editDraft.description.length} / 500
                            </FieldDescription>
                            <FieldError>{editErrors.description}</FieldError>
                          </Field>
                        ) : null}
                      </FieldGroup>
                    </CardContent>
                    <CardFooter className={styles.editFooter}>
                      <Button type="button" variant="ghost" onClick={() => setEditingId(undefined)}>
                        <XIcon data-icon="inline-start" />
                        取消
                      </Button>
                      <Button type="submit" disabled={savingId === item.id}>
                        {savingId === item.id ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <SaveIcon data-icon="inline-start" />
                        )}
                        {savingId === item.id ? "保存中…" : "保存修改"}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <>
                    <CardHeader className={styles.itemHeader}>
                      <div className={styles.itemIdentity}>
                        <CardTitle className={styles.itemTitle}>{item.name}</CardTitle>
                        <CardDescription className={styles.itemPath}>
                          /{type}/{item.slug}
                        </CardDescription>
                      </div>
                      <Badge variant={hasPosts ? "secondary" : "outline"}>
                        {item.postCount ?? 0} 篇
                      </Badge>
                    </CardHeader>
                    {hasDescription && item.description ? (
                      <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    ) : null}
                    <CardFooter className={styles.itemActions}>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/${type}/${item.slug}` as Route}>
                          <ExternalLinkIcon data-icon="inline-start" />
                          查看页面
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => beginEdit(item)}>
                        <PencilIcon data-icon="inline-start" />
                        编辑
                      </Button>
                      {pendingDeleteId === item.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === item.id}
                            onClick={() => void removeItem(item.id)}
                          >
                            {deletingId === item.id ? <Spinner data-icon="inline-start" /> : null}
                            确认删除
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDeleteId(undefined)}
                          >
                            取消
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={hasDescription && hasPosts}
                          title={
                            hasDescription && hasPosts ? "仍有文章使用此分类，不能删除" : undefined
                          }
                          onClick={() => setPendingDeleteId(item.id)}
                        >
                          <Trash2Icon data-icon="inline-start" />
                          删除
                        </Button>
                      )}
                    </CardFooter>
                  </>
                )}
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
