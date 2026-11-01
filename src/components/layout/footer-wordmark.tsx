"use client";

import { motion, type Variants } from "motion/react";
import { ease } from "@/components/ui/motion";

// "charismatic" set with dotless i's (ı) so each dot can be a brand shape, like the logo's round head.
const LETTERS = ["c", "h", "a", "r", "ı", "s", "m", "a", "t", "ı", "c"];

const letter: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease, delay: i * 0.045 } }),
};

const dot: Variants = {
  hidden: { y: "-3em", scale: 0.3, opacity: 0 },
  show: (d: number) => ({ y: 0, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 140, damping: 11, delay: 0.75 + d * 0.15 } }),
};

/**
 * Giant edge-to-edge brand wordmark at the foot of every page. Sized in container-query units so it
 * always spans the full width (the word measures 5.2em at -0.05em tracking, so 100/5.2 ≈ 19.2cqw).
 */
export function FooterWordmark() {
  return (
    <div aria-hidden className="relative px-3 [container-type:inline-size] sm:px-5">
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        className="flex font-display leading-[0.74] font-bold tracking-[-0.05em] whitespace-nowrap text-[#efeaf9] select-none"
        style={{ fontSize: "19.1cqw" }}
      >
        {LETTERS.map((ch, i) => (
          <span key={i} className="group relative inline-block overflow-hidden pt-[0.32em] pb-[0.06em]">
            <motion.span
              custom={i}
              variants={letter}
              className="inline-block transition-[color,transform] duration-500 group-hover:-translate-y-[0.04em] group-hover:text-brand-300"
            >
              {ch}
            </motion.span>
            {ch === "ı" && <Dot ring={i === 4} />}
          </span>
        ))}
      </motion.p>
    </div>
  );
}

function Dot({ ring }: { ring: boolean }) {
  return (
    <motion.span
      custom={ring ? 0 : 1}
      variants={dot}
      // Centred over the stem, between the x-height and the ascender line.
      className="absolute top-[0.2em] left-1/2 -ml-[0.13em] block size-[0.26em]"
    >
      {ring ? (
        <span
          className="block size-full animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#9900cc,#7468f2,#f48fd8,#bd55f0,#9900cc)] [animation-duration:9s]"
          style={{ mask: "radial-gradient(farthest-side, transparent 57%, #000 58%)", WebkitMask: "radial-gradient(farthest-side, transparent 57%, #000 58%)" }}
        />
      ) : (
        <span className="block size-full scale-[0.82] rounded-full bg-linear-to-br from-iris to-blush" />
      )}
    </motion.span>
  );
}
