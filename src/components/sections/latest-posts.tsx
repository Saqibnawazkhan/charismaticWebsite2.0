import { getPosts } from "@/lib/posts";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { PostCard } from "./post-card";

export function LatestPosts() {
  const posts = getPosts().slice(0, 3);
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading align="left" eyebrow="Our Blog" title="Expert Advice for Better Care Decisions" highlight={["Better", "Care", "Decisions"]} />
          <ButtonLink href="/blog/" variant="outline" arrow className="shrink-0">
            Discover More Blogs
          </ButtonLink>
        </div>
        <Stagger className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
          {posts.map((p) => (
            <StaggerItem key={p.slug}>
              <PostCard post={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
