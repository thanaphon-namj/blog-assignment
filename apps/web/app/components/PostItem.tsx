"use client";

import Link from "next/link";
import { formatDate } from "../utils";
import type { Post } from "../types";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: Readonly<PostItemProps>) {
  return (
    <Link href={`/posts/${post.id}`}>
      <article className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 hover:border-blue-400 cursor-pointer">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400">
            {formatDate(post.postedAt)}
          </span>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-slate-500">
            By <strong className="text-slate-700">{post.postedBy}</strong>
          </p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-blue-100/50 px-2.5 py-0.5 text-xs font-bold text-slate-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
