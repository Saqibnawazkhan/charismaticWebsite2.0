import Image from "next/image";
import type { ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink, CallButton } from "@/components/ui/button";

type Tone = "white" | "mist";
const toneClass: Record<Tone, string> = { white: "bg-white", mist: "bg-mist" };

/** Paragraphs rendered with the site's body style. */
export function Prose({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={cn("space-y-5 text-lg leading-relaxed text-muted", className)}>
      {paragraphs.map((p, i) => (
        <Reveal key={i} delay={0.1 + i * 0.06} y={18}>
          <p>{p}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Two-column section: framed illustration on one side, copy on the other. */
export function SplitSection({
  eyebrow,
  title,
  highlight,
  paragraphs = [],
  image,
  imageAlt = "",
  reverse = false,
  tone = "white",
  children,
  aspect = "aspect-[592/557]",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  paragraphs?: string[];
  image: string;
  imageAlt?: string;
  reverse?: boolean;
  tone?: Tone;
  children?: ReactNode;
  /** Tailwind aspect-ratio class matching the image's shape. */
  aspect?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden py-20 lg:py-28", toneClass[tone])}>
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal y={50} scale={0.95} className={cn("relative mx-auto w-full max-w-[540px]", reverse && "lg:order-2")}>
          <div aria-hidden className="absolute inset-[15%] rounded-full bg-brand-300/40 blur-[80px]" />
          <div className={cn("relative animate-float-slow", aspect)}>
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 540px, 90vw" className="object-contain" />
          </div>
        </Reveal>
        <div>
          <SectionHeading align="left" eyebrow={eyebrow} title={title} highlight={highlight} />
          {paragraphs.length > 0 && <Prose paragraphs={paragraphs} className="mt-6" />}
          {children}
        </div>
      </div>
    </section>
  );
}

export type Feature = { title: string; text: string; icon: LucideIcon };

/** Grid of icon cards. */
export function FeatureGrid({
  eyebrow,
  title,
  highlight,
  description,
  items,
  tone = "mist",
  columns = 3,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  description?: ReactNode;
  items: Feature[];
  tone?: Tone;
  columns?: 2 | 3;
}) {
  return (
    <section className={cn("relative overflow-hidden py-20 lg:py-28", toneClass[tone])}>
      <div aria-hidden className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={eyebrow} title={title} highlight={highlight} description={description} />
        <Stagger className={cn("mt-14 grid gap-6 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")} stagger={0.08}>
          {items.map(({ title: t, text, icon: Icon }, i) => (
            <StaggerItem key={t}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-brand-100/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgb(153_0_204/0.4)]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-linear-to-r from-brand-500 to-navy-500 transition-transform duration-700 group-hover:scale-x-100"
                />
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-all duration-500 group-hover:-rotate-6 group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-display text-4xl font-semibold text-brand-100">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-ink">{t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Tick list, optionally in two columns. */
export function CheckList({ items, columns = 1, className }: { items: string[]; columns?: 1 | 2; className?: string }) {
  return (
    <Stagger as="ul" className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2", className)} stagger={0.05}>
      {items.map((item) => (
        <StaggerItem as="li" key={item}>
          <span className="flex h-full items-start gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-card ring-1 ring-brand-100/60 transition-colors duration-300 hover:ring-brand-300">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-navy-500 text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="font-display text-[0.97rem] leading-snug font-medium text-ink">{item}</span>
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Numbered steps joined by an animated line. */
export function ProcessSteps({
  eyebrow,
  title,
  highlight,
  steps,
  tone = "white",
  children,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  steps: { title: string; text?: string }[];
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden py-20 lg:py-28", toneClass[tone])}>
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={title} highlight={highlight} />
        <Stagger className={cn("relative mt-16 grid gap-8 md:grid-cols-2", steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")} stagger={0.12}>
          <div aria-hidden className="absolute top-8 right-[10%] left-[10%] hidden h-px bg-linear-to-r from-brand-200 via-brand-400 to-navy-300 lg:block" />
          {steps.map((s, i) => (
            <StaggerItem key={s.title} className="group relative text-center">
              <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-white font-display text-xl font-semibold text-brand-600 shadow-card ring-4 ring-brand-50 transition-all duration-500 group-hover:scale-110 group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
                {i + 1}
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-ink">{s.title}</h3>
              {s.text && <p className="mx-auto mt-2 max-w-[16rem] leading-relaxed text-muted">{s.text}</p>}
            </StaggerItem>
          ))}
        </Stagger>
        {children}
      </div>
    </section>
  );
}

/** Gradient call-to-action banner. */
export function CtaBanner({
  title = "Ready to talk about care for you or a loved one?",
  text = "Our friendly team is here to help, 24 hours a day, 7 days a week.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-x">
        <Reveal y={40}>
          <div className="grain relative overflow-hidden rounded-[2.75rem] bg-hero px-8 py-14 text-white sm:px-14 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-16">
            <div aria-hidden className="absolute inset-0 bg-grid" />
            <div aria-hidden className="absolute -top-20 -right-10 size-80 animate-aurora rounded-full bg-brand-500/50 blur-[100px]" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{title}</h2>
              <p className="mt-4 text-lg text-white/70">{text}</p>
            </div>
            <div className="relative mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-0 lg:shrink-0">
              <ButtonLink href="#contact" variant="white" arrow>
                Get In Touch
              </ButtonLink>
              <CallButton dark />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
