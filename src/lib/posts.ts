import data from "@/data/posts.json";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  topic: string;
  readingMinutes: number;
  image: string;
  html: string;
};

const posts = (data as Post[]).toSorted((a, b) => b.date.localeCompare(a.date));

export function getPosts() {
  return posts;
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: Post, count = 3) {
  const sameTopic = posts.filter((p) => p.slug !== post.slug && p.topic === post.topic);
  const others = posts.filter((p) => p.slug !== post.slug && p.topic !== post.topic);
  return [...sameTopic, ...others].slice(0, count);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
