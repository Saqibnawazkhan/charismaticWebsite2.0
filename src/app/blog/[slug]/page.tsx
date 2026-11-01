import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Phone } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { PostCard } from "@/components/sections/post-card";
import { ContactSection } from "@/components/sections/contact-section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { formatDate, getPost, getPosts, getRelatedPosts } from "@/lib/posts";
import { company, services } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date, images: [{ url: post.image }] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    image: `${company.url}${post.image}`,
    author: { "@type": "Organization", name: company.legalName },
    publisher: { "@type": "Organization", name: company.legalName },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero crumbs={[{ label: "Blog", href: "/blog/" }, { label: post.topic }]} eyebrow={post.topic} title={post.title} actions={false} overlap />

      <div className="container-x relative z-10 -mt-24 lg:-mt-28">
        <Reveal y={60}>
          <div className="relative mx-auto aspect-[16/8] max-w-5xl overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_-40px_rgb(27_20_53/0.5)] ring-8 ring-white">
            <Image src={post.image} alt="" fill preload sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>

      <section className="py-16 lg:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_300px] lg:gap-16 xl:mx-auto xl:max-w-6xl">
          <article>
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-brand-100 pb-6 text-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-brand-500" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-brand-500" /> {post.readingMinutes} min read
              </span>
              <span className="inline-flex items-center gap-2">By {company.name}</span>
            </div>
            <div className="prose-cc" dangerouslySetInnerHTML={{ __html: post.html }} />
            <div className="mt-14">
              <Link href="/blog/" className="group inline-flex items-center gap-2 font-display font-semibold text-brand-600">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Back to all articles
              </Link>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="grain relative overflow-hidden rounded-[2rem] bg-hero p-7 text-white">
              <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-brand-500/50 blur-3xl" />
              <p className="relative font-display text-xl font-semibold">Need support for a loved one?</p>
              <p className="relative mt-2 text-sm text-white/70">Our friendly team can talk you through the options.</p>
              <a href={company.phone.href} className="relative mt-6 flex items-center gap-3 font-display font-semibold">
                <span className="grid size-10 place-items-center rounded-full bg-white text-brand-600">
                  <Phone className="size-4" />
                </span>
                {company.phone.display}
              </a>
              <ButtonLink href="#contact" variant="white" className="relative mt-5 w-full">
                Send a message
              </ButtonLink>
            </div>
            <div className="rounded-[2rem] bg-mist p-7 ring-1 ring-brand-100">
              <p className="font-display text-lg font-semibold text-ink">Our services</p>
              <ul className="mt-4 space-y-1">
                {services.map((s) => (
                  <li key={s.key}>
                    <Link href={s.href} className="flex items-center justify-between rounded-xl px-3 py-2 text-ink/80 transition-colors hover:bg-white hover:text-brand-600">
                      {s.title}
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Keep reading" title="Related articles" highlight={["articles"]} />
          <Stagger className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {related.map((p) => (
              <StaggerItem key={p.slug}>
                <PostCard post={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
