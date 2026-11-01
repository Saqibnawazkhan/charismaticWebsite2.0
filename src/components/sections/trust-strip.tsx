import Image from "next/image";
import { accreditations } from "@/data/site";
import { Marquee } from "@/components/ui/motion";

/** Accreditation badges that slide past continuously. Sits on a rounded panel overlapping the hero. */
export function TrustStrip() {
  return (
    <section aria-label="Accreditations" className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-white pt-12 pb-6">
      <p className="container-x text-center font-display text-xs font-medium tracking-[0.25em] text-muted uppercase">
        Regulated, accredited &amp; trusted by families
      </p>
      <Marquee speed={35} className="mt-8">
        {accreditations.map((a) => (
          <div
            key={a.src}
            className="flex h-20 shrink-0 items-center rounded-2xl bg-white px-6 ring-1 ring-brand-100/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-card"
          >
            <Image src={a.src} alt={a.alt} width={a.width} height={a.height} className="h-12 w-auto object-contain" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
