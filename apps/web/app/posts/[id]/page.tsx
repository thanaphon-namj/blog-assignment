"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { apiFetch } from "../../lib/api";
import { formatDate } from "../../utils";
import type { Post } from "../../types";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({
  params,
}: Readonly<PostDetailPageProps>) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchPostDetail() {
      setLoading(true);

      try {
        const response = await apiFetch<Post>(`/posts/${id}`);
        setPost(response);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load article details.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void fetchPostDetail();
  }, [id]);

  useEffect(() => {
    if (post?.content && globalThis.window) {
      void Promise.resolve().then(() =>
        setContent(DOMPurify.sanitize(post.content)),
      );
    }
  }, [post]);

  const render = () => {
    if (loading) {
      return (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm font-semibold text-slate-450">
            Loading article...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      );
    }

    if (!post) {
      return null;
    }

    return (
      <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-10 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400">
            {formatDate(post.postedAt)}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-500">
            Written by{" "}
            <strong className="text-slate-700">{post.postedBy}</strong>
          </p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-blue-100/50 px-3 py-1 text-xs font-bold text-slate-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <hr className="border-t border-slate-100" />

        <div
          className="prose prose-slate max-w-none text-slate-750 text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    );
  };

  return (
    <main className="w-full max-w-7xl mx-auto flex flex-col flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/posts">
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer">
          <svg
            className="h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to articles</span>
        </button>
      </Link>

      {render()}
    </main>
  );
}
