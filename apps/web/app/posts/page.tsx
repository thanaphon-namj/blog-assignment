"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "../lib/api";
import type { Post, PaginationMeta, PaginatedPosts, Tag } from "../types";

import PostItem from "../components/PostItem";
import TagFilter from "../components/TagFilter";
import Pagination from "../components/Pagination";

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <p className="text-sm font-semibold text-slate-400">
            Loading articles...
          </p>
        </div>
      }
    >
      <PostsContent />
    </Suspense>
  );
}

function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const selectedTag = searchParams.get("tag");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/posts?page=${page}&limit=${meta.limit}`;
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }

      const response = await apiFetch<PaginatedPosts>(url);
      setPosts(response.posts || []);
      setMeta(
        response.meta || {
          page,
          limit: 20,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load posts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [meta.limit, page, selectedTag]);

  useEffect(() => {
    let fetching = true;

    void Promise.resolve().then(() => {
      if (fetching) {
        void fetchPosts();
      }
    });

    return () => {
      fetching = false;
    };
  }, [fetchPosts]);

  useEffect(() => {
    let fetching = true;

    const fetchTags = async () => {
      try {
        const response = await apiFetch<Tag[]>("/posts/tags");
        if (fetching) {
          setAvailableTags(response.map((t) => t.name));
        }
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };

    void fetchTags();

    return () => {
      fetching = false;
    };
  }, []);

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) {
      router.push("/posts");
    } else {
      router.push(`/posts?tag=${encodeURIComponent(tag)}`);
    }

    setPage(1);
  };

  const render = () => {
    if (loading) {
      return (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-sm font-semibold text-slate-400">
            Loading posts...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-20 text-center">
          <p className="text-sm text-slate-500">No posts found.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <main className="w-full max-w-7xl mx-auto flex flex-col flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Articles</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[70%] flex flex-col gap-6">{render()}</div>

        <TagFilter
          tags={availableTags}
          selected={selectedTag}
          onSelect={handleTagSelect}
        />
      </div>

      {!loading && !error && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onChange={setPage}
        />
      )}
    </main>
  );
}
