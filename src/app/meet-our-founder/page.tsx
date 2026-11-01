import type { Metadata } from "next";
import Image from "next/image";
import { Award, BriefcaseMedical, GraduationCap, HeartPulse, Pill, UsersRound } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { CtaBanner, Prose } from "@/components/page/blocks";
import { ContactSection } from "@/components/sections/contact-section";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Meet Our Founder — Gifty Agyemang",
  description:
    "Gifty Agyemang, Founder and Registered Care Manager of Charismatic Care Ltd — a Registered Nurse, Registered Social Worker and Independent Prescriber with over 11 years in the NHS.",
};

const credentials = [
  { label: "Registered Nurse", icon: HeartPulse },
  { label: "Registered Social Worker", icon: UsersRound },
  { label: "Registered Independent Prescriber", icon: Pill },
  { label: "Registered Care Manager", icon: BriefcaseMedical },
  { label: "Level 7 Leadership qualification", icon: GraduationCap },
  { label: "11+ years in the NHS", icon: Award },
];

export default function FounderPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", href: "/about-us/" }, { label: "Meet Our Founder" }]}
        eyebrow="Meet Our Founder"
        title="Gifty Agyemang"
        highlight={["Agyemang"]}
        description="Founder and Registered Care Manager of Charismatic Care Ltd."
        image="/images/about/ceo.webp"
        imageAlt="Gifty Agyemang, Founder of Charismatic Care"
        actions={false}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={40}>
              <div className="grain relative overflow-hidden rounded-[2.5rem] bg-hero p-8 text-white">
                <div aria-hidden className="absolute inset-0 bg-grid" />
                <p className="relative font-display text-7xl font-semibold text-gradient-light">
                  <Counter value={11} suffix="+" />
                </p>
                <p className="relative mt-2 text-white/75">Years of extensive experience within the NHS</p>
              </div>
            </Reveal>
            <Stagger as="ul" className="mt-6 grid gap-3" stagger={0.07}>
              {credentials.map(({ label, icon: Icon }) => (
                <StaggerItem as="li" key={label} className="flex items-center gap-4 rounded-2xl bg-mist px-5 py-4 ring-1 ring-brand-100">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-display font-medium text-ink">{label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div>
            <SectionHeading align="left" eyebrow="Her Story" title="A career devoted to person-centred care" highlight={["person-centred", "care"]} />
            <Prose
              className="mt-8"
              paragraphs={[
                "Gifty Agyemang is the Founder and Registered Care Manager of Charismatic Care Ltd. With over 11 years of extensive experience within the NHS, she has built a diverse and distinguished career spanning frontline clinical practice, social care, leadership, and management.",
                "Gifty is a Registered Nurse, Registered Social Worker, and Registered Independent Prescriber, bringing a unique combination of healthcare expertise, clinical knowledge, and compassionate leadership to the care sector. Throughout her career, she has supported individuals with complex health and social care needs while championing high standards of person-centred care, safeguarding, and professional excellence.",
                "Driven by a passion for empowering people to live independently and with dignity, Gifty founded Charismatic Care Ltd to provide compassionate, high-quality care that places individuals and their families at the heart of every decision. Her vision is to create a service where people feel valued, respected, and supported to achieve the best possible outcomes.",
                "As a lifelong learner and committed leader, Gifty recently achieved a Level 7 Leadership qualification, demonstrating her dedication to continuous professional development and effective leadership within health and social care.",
                "Under her leadership, Charismatic Care Ltd is committed to delivering safe, responsive, and exceptional care services that promote wellbeing, independence, and quality of life for every person we support.",
              ]}
            />

            <Reveal y={40} className="mt-14">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-mist p-8 ring-1 ring-brand-100 sm:p-12">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-white">
                    <Image src="/images/about/ceo.webp" alt="" fill sizes="64px" className="scale-[1.6] object-cover object-[50%_38%]" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-medium tracking-[0.2em] text-brand-600 uppercase">In her words</p>
                    <p className="font-display text-xl font-semibold text-ink">Why I founded Charismatic Care</p>
                  </div>
                </div>
                <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
                  <p>
                    Over the years, I have had the privilege of supporting individuals with learning disabilities, autism, Down syndrome, mental health
                    needs, and complex behavioural needs. While many people receive excellent support, I also witnessed the challenges that individuals
                    and families often face in finding services that truly understand their unique needs, aspirations, and potential.
                  </p>
                  <p className="font-display text-2xl font-semibold text-ink">I founded Charismatic Care Ltd because I wanted to create something different.</p>
                  <p>
                    I wanted to build an organisation where people are seen as individuals first, not defined by a diagnosis, disability, or behavioural
                    challenge. An organisation where compassion, professionalism, respect, and innovation are at the heart of everything we do.
                  </p>
                  <p>
                    At Charismatic Care Ltd, we focus on strengths rather than limitations. We believe every person deserves opportunities to thrive,
                    participate in their community, build meaningful relationships, and achieve their goals, regardless of their circumstances.
                  </p>
                </div>
                <blockquote className="mt-8 border-l-4 border-brand-500 pl-6 font-display text-xl leading-snug text-ink italic">
                  &ldquo;I believe that great care goes beyond meeting needs; it is about building trusting relationships, promoting dignity, and
                  empowering people to live fulfilling lives.&rdquo;
                </blockquote>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner title="Experience care led by expertise and compassion" />
      <ContactSection />
    </>
  );
}
