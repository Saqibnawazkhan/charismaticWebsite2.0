"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/cn";
import { ease } from "@/components/ui/motion";
import { PostCard } from "./post-card";

/** Featured article plus a topic-filterable grid of every post. */
export function BlogExplorer({ posts }: { posts: Post[] }) {
  const topics = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.topic)))], [posts]);
  const [topic, setTopic] = useState("All");
  const [featured, ...rest] = posts;
  const list = topic === "All" ? rest : posts.filter((p) => p.topic === topic);

  return (
    <>
      {topic === "All" && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
          <PostCard post={featured} featured />
        </motion.div>
      )}

      <div className="mt-14 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter articles by topic">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={topic === t}
            onClick={() => setTopic(t)}
            className={cn(
              "relative rounded-full px-5 py-2.5 font-display text-sm font-medium transition-colors",
              topic === t ? "text-white" : "bg-mist text-ink/75 ring-1 ring-brand-100 hover:text-brand-600",
            )}
          >
            {topic === t && (
              <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-full bg-linear-to-r from-brand-500 to-navy-500" transition={{ duration: 0.5, ease }} />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease, delay: Math.min(i, 6) * 0.04 }}
            >
              <PostCard post={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
