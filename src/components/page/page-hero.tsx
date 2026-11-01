"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { AnimatedHeading, ease } from "@/components/ui/motion";
import { Eyebrow } from "@/components/ui/section-heading";
import { ButtonLink, CallButton } from "@/components/ui/button";

export type Crumb = { label: string; href?: string };

/** Dark, animated banner used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  highlight = [],
  description,
  image,
  imageAlt = "",
  crumbs = [],
  actions = true,
  overlap = false,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  description?: string;
  image?: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  actions?: boolean;
  /** Extra bottom space for content (e.g. a cover image) that overlaps the hero. */
  overlap?: boolean;
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  return (
    <section className={`grain relative isolate overflow-hidden bg-hero pt-36 text-white lg:pt-44 ${overlap ? "pb-40 lg:pb-48" : "pb-28 lg:pb-36"}`}>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-40 -left-20 size-[520px] animate-aurora rounded-full bg-brand-500/35 blur-[120px]" />
        <div className="absolute -right-20 -bottom-40 size-[520px] animate-aurora rounded-full bg-iris/30 blur-[120px] [animation-delay:-7s]" />
      </div>

      <div className={`container-x grid items-center gap-14 ${image ? "lg:grid-cols-[1.15fr_0.85fr]" : ""}`}>
        <div className={image ? "" : "mx-auto max-w-4xl text-center"}>
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <ol className={`flex flex-wrap items-center gap-1.5 text-sm text-white/60 ${image ? "" : "justify-center"}`}>
              {trail.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 text-white/35" />}
                  {c.href && i < trail.length - 1 ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={i === trail.length - 1 ? "page" : undefined} className="text-white/90">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

          {eyebrow && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.2 }} className="mt-7">
              <Eyebrow dark>{eyebrow}</Eyebrow>
            </motion.div>
          )}

          <AnimatedHeading
            as="h1"
            onMount
            delay={0.25}
            text={title}
            highlight={highlight}
            highlightClassName="text-gradient-light"
            className="mt-6 text-4xl leading-[1.06] font-semibold sm:text-5xl lg:text-[4rem]"
          />

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
              className={`mt-6 text-lg leading-relaxed text-white/75 sm:text-xl ${image ? "max-w-xl" : "mx-auto max-w-2xl"}`}
            >
              {description}
            </motion.p>
          )}

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.8 }}
              className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 ${image ? "" : "justify-center"}`}
            >
              <ButtonLink href="#contact" arrow>
                Get In Touch
              </ButtonLink>
              <CallButton dark />
            </motion.div>
          )}
        </div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.35 }}
            className="relative mx-auto w-full max-w-[460px]"
          >
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-brand-500/40 blur-[70px]" />
            <div className="relative aspect-[592/557] animate-float-slow">
              <Image src={image} alt={imageAlt} fill preload sizes="(min-width: 1024px) 460px, 90vw" className="object-contain" />
            </div>
          </motion.div>
        )}
      </div>

      <div aria-hidden className="absolute inset-x-0 -bottom-px h-10 rounded-t-[2.5rem] bg-white" />
    </section>
  );
}
