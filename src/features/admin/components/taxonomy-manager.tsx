"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/shared/api-client/response";
import { createTaxonomy, deleteTaxonomy } from "../api-browser";
import type { IAdminTaxonomy } from "../types";

export function TaxonomyManager({
  kind,
  type,
  initialItems
}: {
  kind: "分类" | "标签";
  type: "categories" | "tags";
  initialItems: IAdminTaxonomy[];
}) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();

  async function addItem() {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    setIsCreating(true);
    try {
      const item = await createTaxonomy(type, {
        name: normalizedName,
        slug: normalizedName.toLocaleLowerCase().replace(/\s+/g, "-")
      });
      setItems((value) => [...value, { ...item, postCount: 0 }]);
      setName("");
      toast.success(`${kind}已添加`);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : `${kind}添加失败`);
    } finally {
      setIsCreating(false);
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
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">新增{kind}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void addItem();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="taxonomy-name">名称</FieldLabel>
                <Input
                  id="taxonomy-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Button type="submit" disabled={isCreating || !name.trim()}>
                {isCreating ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <PlusIcon data-icon="inline-start" />
                )}
                {isCreating ? "添加中…" : "添加"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border bg-card/70 px-4 py-3"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                /{item.slug} · {item.postCount ?? 0} 篇文章
              </p>
            </div>
            {pendingDeleteId === item.id ? (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === item.id}
                  onClick={() => void removeItem(item.id)}
                >
                  {deletingId === item.id ? <Spinner data-icon="inline-start" /> : null}
                  确认删除
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPendingDeleteId(undefined)}>
                  取消
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`删除${item.name}`}
                onClick={() => setPendingDeleteId(item.id)}
              >
                <Trash2Icon />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
