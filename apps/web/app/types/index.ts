export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  tags: Tag[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPosts {
  posts: Post[];
  meta: PaginationMeta;
}
