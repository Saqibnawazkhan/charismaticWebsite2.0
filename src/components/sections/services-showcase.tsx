import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, type ServiceKey } from "@/data/site";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { serviceIcons } from "@/components/ui/icons";

export function ServicesShowcase({
  exclude,
  title = "Personalised Complete Care For Your Needs",
  eyebrow = "Our Services",
  showAllLink = true,
}: {
  exclude?: ServiceKey;
  title?: string;
  eyebrow?: string;
  showAllLink?: boolean;
}) {
  const list = services.filter((s) => s.key !== exclude);

  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <div aria-hidden className="absolute inset-0 bg-dots opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          highlight={["Complete", "Care"]}
          description="We provide a wide range of services, including full-time live-in care, supported living, domiciliary care, companionship care, and respite care for people with Learning Disability, Autism, Down Syndrome, and Behavioural Needs."
        />

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {list.map((s, i) => {
            const Icon = serviceIcons[s.key];
            return (
              <StaggerItem key={s.key}>
                <Link
                  href={s.href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy-900 shadow-card transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgb(153_0_204/0.55)]"
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/40 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-700/90 via-brand-600/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <span className="absolute top-5 left-5 font-display text-sm font-medium text-white/60">0{i + 1}</span>
                  <span className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-brand-600">
                    <ArrowUpRight className="size-5" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-iris shadow-glow">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                    <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                      <p className="overflow-hidden text-[0.95rem] leading-relaxed text-white/80">
                        <span className="block pt-3">{s.summary}</span>
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-medium text-brand-200">
                      Read more
                      <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-12" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        {showAllLink && (
          <div className="mt-14 flex justify-center">
            <ButtonLink href="/care-services/" variant="outline" arrow>
              View All Services
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
