import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, CtaBanner, SplitSection } from "@/components/page/blocks";
import { Gallery } from "@/components/sections/gallery";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Travel Abroad — Assisted Travel",
  description:
    "Assisted travel for people with autism and learning disabilities. Safe, confident and comfortable journeys in the UK and internationally with experienced support workers.",
};

const journeys = [
  "Holidays and respite breaks in the UK and abroad",
  "Airport and flight assistance",
  "Family visits and social events",
  "Medical and healthcare appointments",
  "Educational placements and training opportunities",
  "Employment and voluntary work",
  "Community activities and day trips",
  "Accompanied travel on trains, buses, coaches, taxis, and flights",
];

const understand = [
  "Preferred communication methods",
  "Sensory needs and triggers",
  "Individual routines and preferences",
  "Anxiety management strategies",
  "Behaviour support requirements",
  "Personal goals and aspirations",
];

const helps = [
  "Build confidence in new environments",
  "Develop travel and life skills",
  "Increase independence and self-esteem",
  "Access education, employment, and leisure opportunities",
  "Maintain relationships with family and friends",
  "Reduce social isolation",
  "Experience new cultures and destinations",
];

const whyUs = [
  "Specialists in Autism and Learning Disabilities support",
  "UK and International Assisted Travel Service",
  "Experienced and Compassionate Support Staff",
  "Person-Centred Travel Planning",
  "Flexible and Individualised Support Packages",
  "Focus on Independence, Choice, and Inclusion",
  "Safe, Reliable, and Dignified Support",
];

export default function TravelAbroadPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Travel Abroad" }]}
        eyebrow="Creating Memories Beyond Borders"
        title="Assisted Travel Service for People with Autism and Learning Disabilities"
        highlight={["Assisted", "Travel"]}
        image="/images/pages/travel-1.webp"
        imageAlt="Clients and staff on an assisted trip abroad"
      />

      <SplitSection
        eyebrow="Travel Abroad"
        title="Specialist Travel Support Tailored to Individual Needs"
        highlight={["Tailored"]}
        image="/images/pages/travel-abroad-7.webp"
        imageAlt="Clients enjoying a holiday"
        paragraphs={[
          "At Charismatic Care Ltd, we specialise in supporting individuals with Autism Spectrum Condition (ASC) and Learning Disabilities to travel safely, confidently, and comfortably. We understand that travel can present unique challenges, including anxiety, sensory sensitivities, communication difficulties, changes in routine, and navigating unfamiliar environments.",
          "Our Assisted Travel Service is designed to remove these barriers, enabling individuals to access opportunities, maintain independence, enjoy meaningful experiences, and participate fully in their communities, both within the UK and internationally.",
        ]}
      />

      <section className="relative overflow-hidden bg-mist py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Every step of the way"
              title="UK and International Assisted Travel"
              highlight={["International"]}
              description="We provide personalised travel support for a wide range of journeys, including:"
            />
            <Reveal delay={0.2} y={20}>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Our dedicated support workers can accompany service users throughout their entire journey, providing reassurance, guidance, and
                practical support every step of the way.
              </p>
            </Reveal>
          </div>
          <CheckList items={journeys} columns={2} />
        </div>
      </section>

      <Gallery initial={6} />

      <SplitSection
        tone="mist"
        eyebrow="Our expertise"
        title="Our Autism and Learning Disability Expertise"
        highlight={["Expertise"]}
        image="/images/pages/travel-3.webp"
        imageAlt="Support worker and client travelling together"
        paragraphs={[
          "Our team has extensive experience supporting people with autism and learning disabilities and understands the importance of providing care that is person-centred, structured, and responsive to individual needs. We take the time to understand:",
        ]}
      >
        <CheckList items={understand} columns={2} className="mt-7" />
        <Reveal delay={0.2} y={16}>
          <p className="mt-7 text-lg leading-relaxed text-muted">
            By tailoring our support to each individual&apos;s unique needs, we help create positive travel experiences that promote confidence,
            wellbeing, and independence.
          </p>
        </Reveal>
      </SplitSection>

      <SplitSection
        reverse
        eyebrow="Travel as a life skill"
        title="Building Confidence and Independence"
        highlight={["Confidence", "Independence"]}
        image="/images/pages/travel-abroad-6.webp"
        imageAlt="Client exploring a new destination"
        paragraphs={[
          "At Charismatic Care Ltd, we view travel as an important life skill. Our support is focused on empowering people to develop greater independence while remaining safe and supported. Our Assisted Travel Service helps individuals:",
        ]}
      >
        <CheckList items={helps} className="mt-7" />
        <Reveal delay={0.2} y={16}>
          <p className="mt-7 text-lg leading-relaxed text-muted">
            Where appropriate, we also offer travel training and gradual support plans to help individuals become more independent over time.
          </p>
        </Reveal>
      </SplitSection>

      <section className="grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <div aria-hidden className="absolute -top-40 left-1/3 size-[520px] animate-aurora rounded-full bg-brand-600/30 blur-[130px]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading dark align="left" eyebrow="Peace of mind" title="Safe, Person-Centred and Reliable" highlight={["Reliable"]} />
            <Reveal delay={0.2} y={20}>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Every journey is carefully planned with the individual&apos;s needs, preferences, and safety at the centre. Our experienced staff
                work closely with families, carers, local authorities, healthcare professionals, and other stakeholders to ensure seamless and
                enjoyable travel experiences.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Whether it&apos;s a local appointment, a family visit, a weekend away, or an overseas holiday, we are committed to providing
                compassionate, professional, and reliable support.
              </p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h3 className="mb-6 font-display text-2xl font-semibold">Why Choose Charismatic Care Ltd?</h3>
            </Reveal>
            <Stagger as="ul" className="grid gap-3" stagger={0.06}>
              {whyUs.map((w, i) => (
                <StaggerItem as="li" key={w} className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
                  <span className="font-display text-sm font-semibold text-brand-300">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display font-medium">{w}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CtaBanner title="Planning a trip or day out?" text="Talk to our team about safe, person-centred assisted travel in the UK and abroad." />
      <ContactSection />
      <Areas />
    </>
  );
}
