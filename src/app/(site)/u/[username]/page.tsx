import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/page-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { getPublicProfile } from "@/features/users/server";
import { formatDate } from "@/lib/format";
import { ApiClientError } from "@/shared/api-client/response";

interface Props {
  params: Promise<{ username: string }>;
}

async function findProfile(username: string) {
  if (!/^[a-zA-Z0-9_-]{2,32}$/.test(username)) notFound();
  try {
    return await getPublicProfile(username);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await findProfile(username);
  return {
    title: profile.displayName,
    description: profile.bio ?? `@${profile.username} 的公开主页`
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await findProfile(username);

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-24 border-4 border-background shadow-lg">
          <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="bg-gradient-to-br from-afterglow/45 to-twilight/30 font-literary text-2xl">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <PageHeading
          eyebrow={`@${profile.username}`}
          title={profile.displayName}
          description={profile.bio || "这位旅人还没有写下自我介绍。"}
        />
      </div>
      <section className="mt-14 border-t pt-8" aria-labelledby="public-comments">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircleIcon className="size-5 text-primary" />
          <h2 id="public-comments" className="font-literary text-2xl font-semibold">
            公开评论
          </h2>
          <Badge variant="secondary">{profile.comments.length}</Badge>
        </div>
        {profile.comments.length ? (
          <div className="grid gap-3">
            {profile.comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border bg-card/55 p-5">
                <p className="leading-7">{comment.content}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  评论于
                  <Link href={`/articles/${comment.post.slug}`} className="mx-1 hover:underline">
                    《{comment.post.title}》
                  </Link>
                  · {formatDate(comment.createdAt)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <Empty className="min-h-52">
            <EmptyHeader>
              <EmptyMedia>
                <MessageCircleIcon />
              </EmptyMedia>
              <EmptyTitle>还没有公开评论</EmptyTitle>
              <EmptyDescription>这里会展示这位用户通过审核的讨论。</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </main>
  );
}
