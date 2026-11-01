import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock, MapPin, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, ProcessSteps, SplitSection } from "@/components/page/blocks";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { jobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Charismatic Care. We're hiring passionate, committed and reliable Carers, Care Managers and Bookkeepers — with comprehensive training and clear career progression.",
};

const training = [
  "Learning Disability Awareness",
  "Autism Awareness and Autism-Specific Support",
  "Positive Behaviour Support (PBS)",
  "Mental Health Awareness",
  "Managing Behaviours of Concern",
  "Safeguarding Adults and Children",
  "Medication Administration",
  "Mental Capacity Act and Deprivation of Liberty Safeguards",
  "Communication and Person-Centred Planning",
  "Equality, Diversity and Inclusion",
  "Health and Safety",
  "First Aid and Emergency Response",
];

const pathway = [
  "Senior Support Worker",
  "Team Leader",
  "Positive Behaviour Support Practitioner",
  "Care Coordinator",
  "Deputy Manager",
  "Registered Manager",
  "Specialist Practitioner Roles",
  "Quality and Compliance Positions",
  "Training and Development Roles",
];

const steps = [
  { title: "Apply online", text: "Complete our application form online." },
  { title: "Interview", text: "A face-to-face interview. Bring your ID and certification so they can be checked with your application." },
  { title: "DBS check", text: "Your application will be submitted to the Disclosure and Barring Service (DBS)." },
  { title: "Training", text: "Once your DBS has been returned, in-house training will start." },
  { title: "Welcome aboard", text: "With good feedback from training, you'll be offered a position, sign a contract and start work." },
];

export default function CareersPage() {
  const applyHref = `/jobs/${jobs[0].slug}/#apply`;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers" }]}
        eyebrow="Careers"
        title="Care for our clients, and we care for you!"
        highlight={["we", "care", "for", "you!"]}
        description="We are hiring passionate, committed, and reliable individuals to join our team as Carers, Care Managers, and Bookkeepers."
        image="/images/pages/about-4-new.webp"
        imageAlt="Charismatic Care team member"
        actions={false}
      />

      <SplitSection
        eyebrow="Learning & development"
        title="Our Training and Development Approach"
        highlight={["Training", "Development"]}
        image="/images/pages/career-img2.webp"
        imageAlt="Carer during training"
        aspect="aspect-square"
        paragraphs={[
          "At Charismatic Care Ltd, we believe exceptional care begins with exceptional training.",
          "Every member of our team completes a comprehensive induction programme alongside mandatory and specialist training before supporting individuals independently. We are committed to continuous professional development and ensuring our workforce remains competent, confident, and responsive to changing needs.",
        ]}
      />

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="What you'll learn" title="Our training programmes include" highlight={["training", "programmes"]} />
          <CheckList items={training} columns={2} className="mx-auto mt-12 max-w-4xl lg:grid-cols-3 lg:max-w-none" />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 text-lg leading-relaxed text-muted md:grid-cols-2">
            <Reveal y={20}>
              <p>
                Training is supported through regular supervision, competency assessments, reflective practice sessions, mentoring, and ongoing
                professional development opportunities. This approach ensures that our staff remain informed about best practice and are equipped to
                deliver high-quality specialist care.
              </p>
            </Reveal>
            <Reveal y={20} delay={0.1}>
              <p>
                We also work collaboratively with healthcare professionals, behavioural specialists, families, commissioners, and multidisciplinary
                teams to strengthen staff knowledge and improve outcomes for the people we support.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <div aria-hidden className="absolute -bottom-40 left-0 size-[560px] animate-aurora rounded-full bg-brand-600/30 blur-[130px]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              dark
              align="left"
              eyebrow="Grow with us"
              title="Career Development and Progression"
              highlight={["Progression"]}
              description="At Charismatic Care Ltd, we believe that investing in our people leads to better outcomes for those we support."
            />
            <Reveal delay={0.2} y={20}>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                We offer clear career pathways and actively encourage staff to develop their skills, achieve professional qualifications, and progress
                into leadership and specialist roles. Many team members begin their journey as Support Workers and are supported to advance through
                structured development opportunities.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                We provide access to nationally recognised qualifications, specialist training, mentoring, coaching, leadership development programmes,
                and continuous professional development opportunities.
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute top-4 bottom-4 left-[1.45rem] w-px bg-linear-to-b from-brand-400 via-iris to-transparent" />
            <Stagger as="ol" className="relative grid gap-3" stagger={0.07}>
              <StaggerItem as="li" className="flex items-center gap-4">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-600">
                  <Briefcase className="size-5" />
                </span>
                <span className="font-display text-lg font-semibold">Support Worker — where many begin</span>
              </StaggerItem>
              {pathway.map((p) => (
                <StaggerItem as="li" key={p} className="flex items-center gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-iris shadow-glow">
                    <TrendingUp className="size-5" />
                  </span>
                  <span className="glass flex-1 rounded-2xl px-5 py-3 font-display font-medium">{p}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <ProcessSteps eyebrow="How to join" title="Steps to work with us" highlight={["work", "with", "us"]} steps={steps}>
        <div className="mt-14 flex justify-center">
          <ButtonLink href={applyHref} arrow>
            Apply Online
          </ButtonLink>
        </div>
      </ProcessSteps>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Join the team" title="Available Jobs" highlight={["Jobs"]} />
          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-5" stagger={0.1}>
            {jobs.map((job) => (
              <StaggerItem key={job.slug}>
                <Link
                  href={`/jobs/${job.slug}/`}
                  className="group flex flex-col gap-6 rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-brand-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-30px_rgb(153_0_204/0.4)] sm:flex-row sm:items-center sm:p-9"
                >
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow">
                    <Briefcase className="size-7" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-2xl font-semibold text-ink transition-colors group-hover:text-brand-600">{job.title}</span>
                    <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4 text-brand-500" /> {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 text-brand-500" /> {job.location}
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 font-display font-semibold text-brand-600">
                    More details
                    <span className="grid size-11 place-items-center rounded-full bg-brand-50 transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand-500 group-hover:text-white">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SplitSection
        eyebrow="Ready?"
        title="Start your career in care with us"
        highlight={["career", "in", "care"]}
        image="/images/pages/career-img-new.webp"
        imageAlt="Smiling carer"
        aspect="aspect-square"
        paragraphs={["Previous work experience in the care sector is not essential. We welcome applicants from all backgrounds."]}
      >
        <Reveal delay={0.3} y={20} className="mt-8">
          <ButtonLink href={applyHref} arrow>
            Apply Online
          </ButtonLink>
        </Reveal>
      </SplitSection>
    </>
  );
}
