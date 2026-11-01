"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Clock3, HeartHandshake, MapPin, Plane, ShieldCheck } from "lucide-react";
import { company } from "@/data/site";
import { AnimatedHeading, ease } from "@/components/ui/motion";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";

// Background photo, rendered as a brand-coloured duotone behind the hero.
const HERO_PHOTO = { src: "/images/gallery/gallery-2-scaled.webp", position: "object-[center_62%]" };

function useLayer(mv: MotionValue<number>, depth: number) {
  return useTransform(mv, (v) => v * depth);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  // Scroll parallax only on wide screens — on phones the text and collage are stacked and would collide.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const parallax = wide && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, parallax ? 140 : 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, parallax ? 0 : 1]);
  const collageY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -80 : 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, parallax ? 160 : 0]);

  const l1x = useLayer(sx, 28), l1y = useLayer(sy, 22);
  const l2x = useLayer(sx, -36), l2y = useLayer(sy, -26);
  const l3x = useLayer(sx, 50), l3y = useLayer(sy, 40);

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  }

  const revealCard = (delay: number) => ({
    initial: { clipPath: "inset(100% 0% 0% 0% round 2.25rem)", scale: 1.15 },
    animate: { clipPath: "inset(0% 0% 0% 0% round 2.25rem)", scale: 1 },
    transition: { duration: 1.3, ease, delay },
  });

  return (
    <section ref={ref} onPointerMove={onMove} className="grain relative isolate overflow-hidden bg-hero text-white">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Photo: blended in luminosity mode so it takes on the purple/navy gradient beneath, with a slow Ken Burns drift */}
        <motion.div style={{ y: photoY }} className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.2, ease }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_PHOTO.src}
              alt=""
              fill
              preload
              quality={85}
              sizes="100vw"
              className={`animate-kenburns object-cover opacity-60 mix-blend-luminosity ${HERO_PHOTO.position}`}
            />
          </motion.div>
        </motion.div>
        {/* Keep the headline readable and fade the photo into the page edges */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0d33]/95 via-[#140a3f]/70 to-[#1b0a4a]/10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#1b0a4a] via-transparent to-[#0a0d33]/70" />
        <div className="absolute inset-0 bg-brand-600/20 mix-blend-color" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 -left-24 size-[520px] animate-aurora rounded-full bg-brand-500/40 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 size-[560px] animate-aurora rounded-full bg-iris/35 blur-[120px] [animation-delay:-6s]" />
        <div className="absolute -bottom-40 left-1/3 size-[480px] animate-aurora rounded-full bg-navy-500/50 blur-[110px] [animation-delay:-12s]" />
        <svg className="absolute top-1/2 left-[62%] size-[900px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-30" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="92" stroke="url(#ring)" strokeWidth="0.4" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="74" stroke="url(#ring)" strokeWidth="0.3" />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f48fd8" />
              <stop offset="1" stopColor="#7468f2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-14 pt-32 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-28">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }}>
            <Eyebrow dark>Taking pride in our clients</Eyebrow>
          </motion.div>

          <AnimatedHeading
            as="h1"
            onMount
            delay={0.3}
            text="Transforming The Way We Care"
            highlight={["Care"]}
            highlightClassName="text-gradient-light"
            className="mt-7 text-[2.9rem] leading-[1.02] font-semibold sm:text-6xl xl:text-[5.1rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl"
          >
            We provide professional, affordable, reliable, 24/7 supported care services for people with Learning Disabilities, Autism, Down
            Syndrome, and Behavioural needs across London, Lincolnshire, and Essex.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <ButtonLink href="#contact" arrow className="px-8! py-4!">
              Get In Touch
            </ButtonLink>
            <CallButton dark />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.25 }}
            className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8"
          >
            <div className="rounded-2xl bg-white p-1.5 shadow-soft">
              <Image src="/images/badges/cqc-good.jpg" alt="CQC rated Good" width={83} height={62} className="h-11 w-auto" />
            </div>
            <div className="text-sm leading-snug text-white/70">
              <p className="font-display font-semibold text-white">Regulated by the Care Quality Commission</p>
              <p className="mt-0.5 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-brand-300" />
                {company.regions.join(" · ")}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Photo collage */}
        <motion.div style={{ y: collageY }} className="relative mx-auto aspect-[5/6] w-full max-w-[540px] lg:mr-0">
          <motion.div style={{ x: l1x, y: l1y }} className="absolute top-0 right-0 h-[74%] w-[66%]">
            <motion.div {...revealCard(0.45)} className="relative size-full overflow-hidden rounded-[2.25rem] shadow-2xl ring-1 ring-white/20">
              <Image
                src="/images/gallery/gallery29.webp"
                alt="Charismatic Care clients and support workers on a day trip"
                fill
                preload
                sizes="(min-width: 1024px) 360px, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/50 via-transparent to-transparent" />
            </motion.div>
          </motion.div>

          <motion.div style={{ x: l2x, y: l2y }} className="absolute bottom-[4%] left-0 h-[46%] w-[54%]">
            <motion.div {...revealCard(0.7)} className="relative size-full overflow-hidden rounded-[2.25rem] shadow-2xl ring-4 ring-white/10">
              <Image src="/images/gallery/gallery23.webp" alt="A smiling client enjoying the seaside" fill sizes="(min-width: 1024px) 300px, 54vw" className="object-cover object-top" />
            </motion.div>
          </motion.div>

          {/* Floating info chips */}
          <motion.div style={{ x: l3x, y: l3y }} className="absolute top-[8%] left-[-2%] sm:left-[-6%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.2 }}
              >
            <div className="glass flex animate-float items-center gap-3 rounded-2xl px-4 py-3 shadow-xl">
              <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-iris">
                <Clock3 className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold">24/7</span>
                <span className="text-xs text-white/70">Supported care</span>
              </span>
            </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ x: l1x, y: l3y }} className="absolute right-[-2%] bottom-[30%] sm:right-[-8%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.4 }}
              >
            <div className="glass flex animate-float-slow items-center gap-3 rounded-2xl px-4 py-3 shadow-xl [animation-delay:-3s]">
              <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-navy-400 to-brand-500">
                <ShieldCheck className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-sm font-semibold">CQC Rated Good</span>
                <span className="text-xs text-white/70">Care Quality Commission</span>
              </span>
            </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ x: l2x, y: l1y }} className="absolute right-[6%] bottom-[-2%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.6 }}
              >
            <div className="flex animate-float items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-2xl [animation-delay:-5s]">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Plane className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-sm font-semibold">Memories beyond borders</span>
                <span className="text-xs text-muted">Assisted travel abroad</span>
              </span>
            </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1, ease, delay: 1.1 }}
            className="absolute top-[52%] left-[44%] hidden size-20 place-items-center sm:grid rounded-full bg-linear-to-br from-brand-500 to-navy-500 shadow-glow ring-8 ring-white/10"
          >
            <HeartHandshake className="size-9" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] tracking-[0.3em] text-white/50 uppercase md:flex"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-white"
          />
        </span>
        Scroll
      </motion.div>
    </section>
  );
}
