"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Check, Play } from "lucide-react";
import { Counter, Reveal, ease } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink, CallButton } from "@/components/ui/button";

const values = ["Professional", "Respectful", "Innovative", "Transforming the way we care"];

/** "A Happy Client Story" video alongside the About Us introduction. */
export function AboutIntro({ cta = "#contact" }: { cta?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play());
  }

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div aria-hidden className="absolute top-20 -left-40 size-[480px] rounded-full bg-brand-100/60 blur-[100px]" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal y={50} className="relative">
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 -z-10 rotate-[-4deg] rounded-[2.75rem] bg-linear-to-br from-brand-500 via-iris to-navy-500 opacity-90" />
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2.5rem] bg-navy-950 shadow-2xl">
              {playing ? (
                <video
                  ref={videoRef}
                  src="/videos/client-story.mp4"
                  controls
                  playsInline
                  controlsList="nodownload"
                  className="size-full object-cover"
                  aria-label="A happy client story"
                />
              ) : (
                <button type="button" onClick={play} className="group absolute inset-0 size-full" aria-label="Play: A Happy Client Story">
                  <Image
                    src="/images/gallery/gallery30.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
                  <span className="absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/30 [animation-delay:1.2s]" />
                    <span className="relative grid size-20 place-items-center rounded-full bg-white text-brand-600 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                      <Play className="ml-1 size-8 fill-current" />
                    </span>
                  </span>
                  <span className="absolute bottom-6 left-6 text-left text-white">
                    <span className="block font-display text-xs tracking-[0.25em] text-white/70 uppercase">Watch</span>
                    <span className="block font-display text-2xl font-semibold">A Happy Client Story</span>
                  </span>
                </button>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.4 }}
            className="absolute -right-3 -bottom-10 rounded-3xl bg-white p-5 shadow-[0_30px_60px_-20px_rgb(27_20_53/0.35)] ring-1 ring-brand-100 sm:-right-8"
          >
            <p className="font-display text-4xl font-semibold text-gradient">
              <Counter value={15} suffix="+" />
            </p>
            <p className="mt-1 max-w-[9rem] text-sm leading-snug text-muted">Years of compassionate care experience</p>
          </motion.div>
        </Reveal>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="See & Experience A New Perspective of Life"
            highlight={["Perspective", "Life"]}
            description="Charismatic Care offers a new perspective on life for those who need help to live independently in their home. We provide compassionate care and support that empower you and your loved ones to live with dignity and independence."
          />
          <Reveal delay={0.2} y={20}>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Quality care delivered by our compassionate carers will help you or your loved ones enjoy your lives. Get in touch to see how our
              tailored care makes you and your loved ones&apos; lives better.
            </p>
          </Reveal>
          <Reveal delay={0.3} y={20}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3 font-display text-[0.95rem] font-medium text-ink">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-navy-500 text-white">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.4} y={20} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href={cta} arrow>
              Get In Touch
            </ButtonLink>
            <CallButton />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
