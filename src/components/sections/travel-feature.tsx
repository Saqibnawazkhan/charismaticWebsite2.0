import Image from "next/image";
import { Check, Plane } from "lucide-react";
import { gallery } from "@/data/site";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const highlights = ["Scenic cruises & cultural tours", "Visits to iconic landmarks", "Safe, comfortable & inspiring journeys"];

function PhotoColumn({ images, reverse, className }: { images: string[]; reverse?: boolean; className?: string }) {
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex animate-marquee-y flex-col gap-4 pb-4"
          style={{ animationDirection: reverse ? "reverse" : "normal", animationDuration: "38s" }}
        >
          {images.map((src) => (
            <div key={src + copy} className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-3xl">
              <Image src={src} alt="" fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Assisted travel feature with two photo columns drifting in opposite directions. */
export function TravelFeature() {
  const colA = gallery.filter((_, i) => i % 2 === 0).slice(0, 6).map((g) => g.src);
  const colB = gallery.filter((_, i) => i % 2 === 1).slice(0, 6).map((g) => g.src);

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Creating Memories Beyond Borders"
            title="Travelled Abroad (Assisted Travel)"
            highlight={["Abroad"]}
            description="At Charismatic Care, we take assisted travel to the next level, ensuring our residents experience the joy of exploration and adventure. From sipping wine on a scenic cruise to guided cultural tours in Europe, our trips are designed to enrich lives and create unforgettable memories."
          />
          <Reveal delay={0.2} y={20}>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Whether it&apos;s a visit to iconic landmarks, relaxing at picturesque destinations, or engaging in curated activities abroad,
              Charismatic Care ensures every journey is safe, comfortable, and inspiring.
            </p>
          </Reveal>
          <Reveal delay={0.3} y={20}>
            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 font-display font-medium text-ink">
                  <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.4} y={20} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="/travel-abroad/" arrow>
              Learn More
            </ButtonLink>
            <CallButton />
          </Reveal>
        </div>

        <Reveal y={60} className="relative">
          <div className="relative grid h-[560px] grid-cols-2 gap-4 overflow-hidden rounded-[2.5rem] bg-mist p-4 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:h-[640px]">
            <PhotoColumn images={colA} />
            <PhotoColumn images={colB} reverse className="-mt-24" />
          </div>
          <div className="glass-light absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl">
            <span className="grid size-12 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-navy-500 text-white">
              <Plane className="size-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold text-ink">UK &amp; International</span>
              <span className="text-sm text-muted">Assisted travel service</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
