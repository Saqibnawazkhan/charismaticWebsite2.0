"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp, Phone } from "lucide-react";
import { company } from "@/data/site";
import { getLenis } from "@/lib/lenis";
import { ease } from "@/components/ui/motion";
import { Assistant } from "@/components/assistant/assistant";

/** Respects the visitor's "reduce motion" OS setting for every animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Thin gradient bar at the top of the viewport showing reading progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-brand-500 via-iris to-navy-500"
    />
  );
}

/** Bottom-right: the AI assistant launcher (and a call button on phones). Bottom-left: back to top. */
export function FloatingActions() {
  return (
    <>
      <BackToTop />
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        <a
          href={company.phone.href}
          aria-label={`Call ${company.phone.display}`}
          className="relative grid size-14 place-items-center rounded-full bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow sm:hidden"
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/50" />
          <Phone className="relative size-6" />
        </a>
        <Assistant />
      </div>
    </>
  );
}

/** Back-to-top button whose gradient ring fills up as you read down the page. */
function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.4, ease }}
          className="group fixed bottom-4 left-4 z-40 grid size-12 place-items-center rounded-full bg-white/90 text-brand-600 shadow-soft backdrop-blur-md transition-colors duration-300 hover:bg-brand-500 hover:text-white sm:bottom-6 sm:left-6"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <defs>
              <linearGradient id="to-top-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9900cc" />
                <stop offset="100%" stopColor="#7468f2" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={2.5} />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#to-top-ring)"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ pathLength: progress }}
              className="transition-opacity group-hover:opacity-0"
            />
          </svg>
          <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Brief branded intro shown once per browser session. */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cc-intro") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem("cc-intro", "1");
    const t = setTimeout(() => setVisible(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence custom={skip}>
      {visible && (
        <motion.div
          aria-hidden
          custom={skip}
          variants={{
            exit: (instant: boolean) =>
              instant
                ? { opacity: 0, transition: { duration: 0 } }
                : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
          }}
          exit="exit"
          // Safety net: fade out via CSS even if JavaScript never runs.
          style={{ animation: "preloader-out 0.5s ease 3s forwards" }}
          data-preloader
          className="grain fixed inset-0 z-[100] grid place-items-center bg-hero"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease }}
              className="relative h-24 w-[188px]"
            >
              <Image src="/images/brand/logo-white.png" alt="" fill sizes="188px" preload className="object-contain" />
            </motion.div>
            <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                className="h-full w-full bg-linear-to-r from-brand-400 via-iris to-navy-300"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
