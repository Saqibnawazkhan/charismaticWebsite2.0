import { Award, Sparkles, UsersRound } from "lucide-react";
import { stats, whyUs } from "@/data/site";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = [Award, Sparkles, UsersRound];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <div aria-hidden className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-iris/15 blur-[110px]" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Care for every Situation"
          title="24-Hour Care and Companionship for Those Requiring Extra Help"
          highlight={["24-Hour", "Care"]}
        />

        <Stagger className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {whyUs.map((w, i) => {
            const Icon = icons[i];
            return (
              <StaggerItem key={w.title}>
                <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-9 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgb(153_0_204/0.4)]">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-brand-500 to-navy-500 transition-transform duration-700 group-hover:scale-x-100"
                  />
                  <div className="flex items-center justify-between">
                    <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
                      <Icon className="size-7" />
                    </span>
                    <span className="font-display text-6xl font-semibold text-brand-100 transition-colors duration-500 group-hover:text-brand-200">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-xl font-semibold text-ink">{w.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{w.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal y={40} className="mt-10">
          <div className="grain relative grid overflow-hidden rounded-[2.5rem] bg-hero p-2 text-white sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute inset-0 bg-grid" />
            {stats.map((s, i) => (
              <div key={s.label} className="relative px-8 py-10 text-center">
                {i > 0 && <span aria-hidden className="absolute top-1/2 left-0 hidden h-16 w-px -translate-y-1/2 bg-white/15 lg:block" />}
                <p className="font-display text-5xl font-semibold text-gradient-light lg:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
