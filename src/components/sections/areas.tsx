import { MapPin } from "lucide-react";
import { areas } from "@/data/site";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function Areas() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Broad Reach" title="Areas We Cover" highlight={["Cover"]} />
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3" stagger={0.12}>
          {areas.map((a, i) => (
            <StaggerItem key={a.region}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-brand-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:ring-brand-300">
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 size-48 rounded-full bg-linear-to-br from-brand-200/60 to-navy-100/60 blur-2xl transition-transform duration-700 group-hover:scale-150"
                />
                <div className="relative flex items-center gap-4">
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow">
                    <MapPin className="size-6" />
                    <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-brand-500/40" style={{ animationDelay: `${i * 0.6}s` }} />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-ink">{a.region}</h3>
                    <p className="text-sm text-muted">
                      {a.towns.length} {a.region === "Essex" ? "areas" : "towns"} covered
                    </p>
                  </div>
                </div>
                <ul className="relative mt-7 flex flex-wrap gap-2">
                  {a.towns.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-mist px-3.5 py-1.5 font-display text-sm text-ink/80 ring-1 ring-brand-100 transition-colors duration-300 hover:bg-brand-500 hover:text-white"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
