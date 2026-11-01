"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gallery } from "@/data/site";
import { getLenis } from "@/lib/lenis";
import { ease } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function Gallery({ initial = 9 }: { initial?: number }) {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const visible = showAll ? gallery : gallery.slice(0, initial);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((dir: number) => setActive((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length)), []);

  useEffect(() => {
    if (active === null) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [active, close, step]);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Heartfelt Moments, Exceptional Care" title="A Glimpse into Charismatic Care" highlight={["Charismatic", "Care"]} />

        <div className="mt-16 columns-2 gap-4 md:columns-3 lg:gap-5">
          {visible.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
              className="group relative mb-4 block w-full overflow-hidden rounded-3xl bg-mist break-inside-avoid lg:mb-5"
              aria-label={`Open photo ${i + 1} of ${gallery.length}`}
            >
              <Image
                src={img.src}
                alt={`Charismatic Care moments — photo ${i + 1}`}
                width={img.width}
                height={img.height}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-linear-to-t from-brand-800/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute right-4 bottom-4 grid size-11 translate-y-4 place-items-center rounded-full bg-white text-brand-600 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <Expand className="size-5" />
              </span>
            </motion.button>
          ))}
        </div>

        {!showAll && gallery.length > initial && (
          <div className="mt-10 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(true)}>
              View More Moments
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-xl"
            onClick={close}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease }}
                className="relative h-[82vh] w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={gallery[active].src} alt={`Charismatic Care moments — photo ${active + 1}`} fill sizes="90vw" className="object-contain" />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-navy-900"
            >
              <X className="size-6" />
            </button>
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(dir);
                }}
                aria-label={dir < 0 ? "Previous photo" : "Next photo"}
                className={`absolute top-1/2 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-500 ${dir < 0 ? "left-3 sm:left-6" : "right-3 sm:right-6"}`}
              >
                {dir < 0 ? <ChevronLeft className="size-7" /> : <ChevronRight className="size-7" />}
              </button>
            ))}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-sm tracking-widest text-white/60">
              {active + 1} / {gallery.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
