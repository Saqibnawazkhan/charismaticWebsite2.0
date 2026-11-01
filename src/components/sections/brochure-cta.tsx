"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Reveal, TiltCard } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { BrochureModal } from "@/components/forms/brochure-modal";

export function BrochureCTA() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-12 lg:py-16">
      <div className="container-x">
        <div className="grain relative overflow-hidden rounded-[2.75rem] bg-linear-to-br from-brand-600 via-brand-700 to-navy-600 px-7 py-14 text-white sm:px-14 lg:py-16">
          <div aria-hidden className="absolute inset-0 bg-grid" />
          <div aria-hidden className="absolute -top-24 -right-24 size-96 animate-aurora rounded-full bg-iris/50 blur-[100px]" />
          <div aria-hidden className="absolute -bottom-40 left-10 size-[420px] rounded-full border-[50px] border-white/[0.06]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHeading
                dark
                align="left"
                eyebrow="Want to Know More?"
                title="Download the Charismatic Care Brochure"
                highlight={["Brochure"]}
                description="Charismatic Care provides Supported Living, Respite, and Live-in Services for people with Learning Disabilities and Mental Health needs, offering personalised, compassionate support that promotes independence, safety, comfort, wellbeing, and peace."
              />
              <Reveal delay={0.3} y={20} className="mt-9">
                <Button variant="white" onClick={() => setOpen(true)} className="px-8! py-4!">
                  <Download className="size-5" />
                  Download Now
                </Button>
              </Reveal>
            </div>

            <Reveal y={60} className="mx-auto w-full max-w-[340px] [perspective:1200px]">
              <TiltCard max={12} className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Download the brochure"
                  className="relative block aspect-[1125/1410] w-full animate-float-slow transition-transform duration-500 hover:scale-[1.03]"
                >
                  <Image
                    src="/images/misc/brochure.webp"
                    alt="Charismatic Care brochure"
                    fill
                    sizes="340px"
                    className="object-contain drop-shadow-[0_40px_50px_rgb(7_10_36/0.55)]"
                  />
                </button>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
      <BrochureModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
