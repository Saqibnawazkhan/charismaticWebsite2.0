"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
import { faqs } from "@/data/site";
import { Reveal, Stagger, StaggerItem, ease } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button, CallButton } from "@/components/ui/button";
import { openAssistant } from "@/components/assistant/assistant";
import { cn } from "@/lib/cn";

export function FAQ({ items = faqs }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow="FAQs" title="Frequently Asked Questions" highlight={["Questions"]} />
          <Reveal delay={0.2} y={30} className="relative mt-10 max-w-md">
            <Image
              src="/images/misc/faqs-new.webp"
              alt="Charismatic Care support worker with a client"
              width={613}
              height={511}
              className="h-auto w-full animate-float-slow"
            />
          </Reveal>
          <Reveal delay={0.3} y={20} className="mt-8 rounded-3xl bg-mist p-6">
            <p className="font-display font-semibold text-ink">Still have questions?</p>
            <p className="mt-1 mb-5 text-sm text-muted">Our friendly team is happy to talk things through — or ask our AI assistant, any time.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <CallButton />
              <Button variant="outline" onClick={() => openAssistant()} className="px-5! py-2.5! text-sm">
                <Sparkles className="size-4" />
                Ask Charis
              </Button>
            </div>
          </Reveal>
        </div>

        <Stagger className="flex flex-col gap-4" stagger={0.08}>
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <StaggerItem key={f.q}>
                <div
                  className={cn(
                    "overflow-hidden rounded-3xl border transition-all duration-500",
                    isOpen ? "border-transparent bg-white shadow-[0_30px_60px_-30px_rgb(153_0_204/0.35)] ring-1 ring-brand-200" : "border-brand-100 bg-white hover:border-brand-200",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 p-6 text-left sm:p-7"
                  >
                    <span
                      className={cn(
                        "font-display text-sm font-semibold transition-colors",
                        isOpen ? "text-brand-500" : "text-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-lg font-semibold text-ink">{f.q}</span>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full transition-all duration-500",
                        isOpen ? "rotate-45 bg-linear-to-br from-brand-500 to-navy-500 text-white" : "bg-brand-50 text-brand-600",
                      )}
                    >
                      <Plus className="size-5" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                      >
                        <p className="px-6 pb-7 pl-[3.6rem] leading-relaxed text-muted sm:px-7 sm:pl-[4.1rem]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
