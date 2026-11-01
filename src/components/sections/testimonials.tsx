"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/data/site";
import { Reveal, ease } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

const DURATION = 8000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[index];

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), DURATION);
    return () => clearTimeout(id);
  }, [index, paused]);

  const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <div aria-hidden className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-200 to-transparent" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Testimonials"
            title="Our Client's Feedback"
            highlight={["Feedback"]}
            description="See how Charismatic Care delivered comfort, trust, and exceptional support every day."
          />
          <Reveal delay={0.25} y={20} className="mt-9 flex items-center gap-5">
            <div className="rounded-2xl bg-white p-2 shadow-card">
              <Image src="/images/badges/rating.jpg" alt="Rated 8.0 on carehome.co.uk" width={209} height={62} className="h-12 w-auto" />
            </div>
            <p className="text-sm leading-snug text-muted">
              <span className="block font-display text-base font-semibold text-ink">Rated 8.0 / 10</span>
              on carehome.co.uk
            </p>
          </Reveal>
          <Reveal delay={0.35} y={20} className="mt-10 flex items-center gap-3">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir)}
                aria-label={dir < 0 ? "Previous testimonial" : "Next testimonial"}
                className="grid size-14 place-items-center rounded-full bg-white text-ink shadow-card ring-1 ring-brand-100 transition-all duration-300 hover:bg-brand-500 hover:text-white"
              >
                {dir < 0 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
              </button>
            ))}
            <div className="ml-3 flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className="relative h-1.5 w-10 overflow-hidden rounded-full bg-brand-100"
                >
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-linear-to-r from-brand-500 to-navy-500"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 bg-brand-300" />}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal y={50}>
          <div
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            className="grain relative min-h-[420px] overflow-hidden rounded-[2.5rem] bg-hero p-10 text-white shadow-[0_50px_100px_-40px_rgb(27_20_53/0.6)] sm:p-14"
          >
            <div aria-hidden className="absolute -top-20 -right-20 size-72 rounded-full bg-brand-500/40 blur-[90px]" />
            <Quote aria-hidden className="absolute top-10 right-10 size-28 text-white/[0.06]" strokeWidth={1} />
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease }}
                className="relative flex h-full flex-col"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-brand-400 to-iris shadow-glow">
                  <Quote className="size-6 fill-current" />
                </span>
                <blockquote className="mt-8 font-display text-xl leading-relaxed font-light text-white/90 sm:text-2xl">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full bg-white font-display text-lg font-semibold text-brand-600">
                    {t.name
                      .split(/\s|&/)
                      .filter(Boolean)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold">{t.name}</span>
                    <span className="text-sm text-white/60">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
      <p className={cn("sr-only")} aria-live="polite">
        Testimonial {index + 1} of {testimonials.length}
      </p>
    </section>
  );
}
