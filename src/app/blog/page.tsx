import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { BlogExplorer } from "@/components/sections/blog-explorer";
import { ContactSection } from "@/components/sections/contact-section";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Expert Advice for Better Care Decisions",
  description:
    "Guides and advice on respite care, supported living, live-in care, autism, learning disabilities and choosing the right home care provider.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Blog" }]}
        eyebrow="Our Blog"
        title="Expert Advice for Better Care Decisions"
        highlight={["Better", "Care", "Decisions"]}
        description="Practical guides for families on respite, supported living, autism, learning disabilities and choosing the right care."
        actions={false}
      />
      <section className="py-20 lg:py-24">
        <div className="container-x">
          <BlogExplorer posts={getPosts()} />
        </div>
      </section>
      <ContactSection />
    </>
  );
}
