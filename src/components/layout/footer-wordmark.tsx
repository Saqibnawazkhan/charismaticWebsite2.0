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
  hidden: { y: "-1.2em", scale: 0.3, opacity: 0 },
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
          <span key={i} className="group relative inline-block">
            {/* Only the letter is clipped (for the rise-in); the dot sits outside the clip so it is never cut off. */}
            <span className="block overflow-hidden pt-[0.32em] pb-[0.06em]">
              <motion.span
                custom={i}
                variants={letter}
                className="inline-block transition-[color,transform] duration-500 group-hover:-translate-y-[0.04em] group-hover:text-brand-300"
              >
                {ch}
              </motion.span>
            </span>
            {ch === "ı" && <Dot ring={i === 4} />}
          </span>
        ))}
      </motion.p>
    </div>
  );
}

// Readex Pro Bold's dotless i: the stem's ink runs from 0.0625em to 0.234em of the glyph, so its
// centre is 0.148em from the letter's left edge (measured in the browser). Each dot is centred there,
// with its centre 0.33em below the top padding - just above the x-height, like a real i-dot.
const STEM_CENTER = 0.148;
const DOT_CENTER_Y = 0.33;

function Dot({ ring }: { ring: boolean }) {
  const size = ring ? 0.23 : 0.2;
  return (
    <motion.span
      custom={ring ? 0 : 1}
      variants={dot}
      className="absolute block"
      style={{ width: `${size}em`, height: `${size}em`, left: `${STEM_CENTER - size / 2}em`, top: `${DOT_CENTER_Y - size / 2}em` }}
    >
      {ring ? (
        <span
          className="block size-full animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#9900cc,#7468f2,#f48fd8,#bd55f0,#9900cc)] [animation-duration:9s]"
          style={{ mask: "radial-gradient(farthest-side, transparent 57%, #000 58%)", WebkitMask: "radial-gradient(farthest-side, transparent 57%, #000 58%)" }}
        />
      ) : (
        <span className="block size-full rounded-full bg-linear-to-br from-iris to-blush" />
      )}
    </motion.span>
  );
}
