import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { Prose } from "@/components/page/blocks";
import { JobApplicationForm } from "@/components/forms/job-form";
import { Reveal } from "@/components/ui/motion";
import { company } from "@/data/site";
import { jobs } from "@/data/jobs";
import { formatDate } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  return job ? { title: `${job.title} — Careers`, description: job.description[0] } : {};
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();

  const facts = [
    { icon: Clock, label: "Job type", value: job.type },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: CalendarDays, label: "Posted", value: formatDate(job.posted) },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers", href: "/careers/" }, { label: job.title }]}
        eyebrow="We're hiring"
        title={job.title}
        highlight={["Care", "Workers"]}
        actions={false}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }, i) => (
                <Reveal key={label} delay={i * 0.08} y={20}>
                  <div className="h-full rounded-2xl bg-mist p-5 ring-1 ring-brand-100">
                    <Icon className="size-5 text-brand-500" />
                    <p className="mt-3 text-xs font-semibold tracking-[0.15em] text-muted uppercase">{label}</p>
                    <p className="mt-1 font-display font-semibold text-ink">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <h2 className="mt-12 font-display text-3xl font-semibold text-ink">About the role</h2>
            <Prose className="mt-6" paragraphs={job.description} />
            <Reveal y={20} className="mt-10 flex items-center gap-4 rounded-3xl bg-mist p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-navy-500 text-white">
                <Phone className="size-5" />
              </span>
              <p className="text-muted">
                Questions about the role? Call us on{" "}
                <a href={company.phone.href} className="font-semibold text-brand-600 hover:underline">
                  {company.phone.display}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div id="apply" className="scroll-mt-28">
            <Reveal y={40}>
              <div className="rounded-[2.5rem] bg-white p-7 shadow-[0_50px_100px_-40px_rgb(27_20_53/0.35)] ring-1 ring-brand-100 sm:p-10 lg:sticky lg:top-28">
                <h2 className="font-display text-2xl font-semibold text-ink">Apply for this position</h2>
                <p className="mt-2 mb-8 text-muted">Fill in your details and attach your CV — it only takes a couple of minutes.</p>
                <JobApplicationForm position={job.title} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
