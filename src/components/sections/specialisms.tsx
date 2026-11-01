"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { company, specialisms } from "@/data/site";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { specialismIcons } from "@/components/ui/icons";

/** Card with a soft light that follows the cursor. */
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition-colors duration-500 hover:border-white/25 ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--x) var(--y), rgb(189 85 240 / 0.22), transparent 45%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Specialisms() {
  return (
    <section className="grain relative overflow-hidden bg-navy-950 py-24 text-white lg:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div aria-hidden className="absolute -top-40 right-0 size-[600px] animate-aurora rounded-full bg-brand-600/30 blur-[130px]" />
      <div aria-hidden className="absolute -bottom-40 -left-20 size-[500px] animate-aurora rounded-full bg-navy-500/40 blur-[120px] [animation-delay:-8s]" />

      <div className="container-x relative">
        <SectionHeading
          dark
          eyebrow="Specialist Support"
          title="Specialists in Complex and Person-Centred Support"
          highlight={["Person-Centred", "Support"]}
          description="We provide tailored support for individuals who require specialist care and understanding, including:"
        />

        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {specialisms.map((s, i) => {
            const Icon = specialismIcons[s.icon];
            return (
              <StaggerItem key={s.title}>
                <SpotlightCard>
                  <div className="flex items-start justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-iris shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon className="size-7" />
                    </span>
                    <span className="font-display text-5xl font-semibold text-white/[0.07] transition-colors duration-500 group-hover:text-white/15">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{s.text}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
          <StaggerItem>
            <div className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[2rem] bg-linear-to-br from-brand-500 via-brand-600 to-navy-500 p-8 shadow-glow">
              <div aria-hidden className="absolute -right-16 -bottom-16 size-56 rounded-full border-[28px] border-white/10" />
              <div className="relative">
                <h3 className="font-display text-2xl font-semibold">Need specialist support?</h3>
                <p className="mt-3 text-white/80">Talk to our team about tailored care for you or your loved one.</p>
              </div>
              <div className="relative mt-8 flex flex-col gap-3">
                <a href={company.phone.href} className="inline-flex items-center gap-3 font-display text-lg font-semibold">
                  <span className="grid size-10 place-items-center rounded-full bg-white text-brand-600">
                    <Phone className="size-4" />
                  </span>
                  {company.phone.display}
                </a>
                <Link href="/contact/" className="group inline-flex items-center gap-2 font-display text-sm font-medium text-white/85 hover:text-white">
                  Or send us a message
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
