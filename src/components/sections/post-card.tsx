import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatDate, type Post } from "@/lib/posts";
import { cn } from "@/lib/cn";

export function PostCard({ post, featured = false, className }: { post: Post; featured?: boolean; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-brand-100/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgb(153_0_204/0.4)]",
        featured && "lg:flex-row",
        className,
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden", featured && "lg:aspect-auto lg:w-[55%]")}>
        <Image
          src={post.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 font-display text-xs font-medium text-brand-600 backdrop-blur">
          {post.topic}
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col p-7", featured && "lg:justify-center lg:p-12")}>
        <div className="flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="size-1 rounded-full bg-brand-300" />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {post.readingMinutes} min read
          </span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display font-semibold text-ink transition-colors group-hover:text-brand-600",
            featured ? "text-2xl lg:text-4xl" : "line-clamp-2 text-xl",
          )}
        >
          {post.title}
        </h3>
        <p className={cn("mt-3 leading-relaxed text-muted", featured ? "line-clamp-4" : "line-clamp-3")}>{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-semibold text-brand-600">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
