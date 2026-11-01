"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp, Phone } from "lucide-react";
import { company } from "@/data/site";
import { getLenis } from "@/lib/lenis";
import { ease } from "@/components/ui/motion";

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

/** Floating call button (mobile) and back-to-top button. */
export function FloatingActions() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
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
            className="grid size-12 place-items-center rounded-full bg-white text-brand-600 shadow-soft ring-1 ring-brand-100 transition-colors hover:bg-brand-500 hover:text-white"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <a
        href={company.phone.href}
        aria-label={`Call ${company.phone.display}`}
        className="relative grid size-14 place-items-center rounded-full bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow sm:hidden"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/50" />
        <Phone className="relative size-6" />
      </a>
    </div>
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
