import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, SplitSection } from "@/components/page/blocks";
import { AboutIntro } from "@/components/sections/about-intro";
import { Specialisms } from "@/components/sections/specialisms";
import { BrochureCTA } from "@/components/sections/brochure-cta";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Supported Living",
  description:
    "Supported living for people with learning disabilities, autism, Down's syndrome and complex needs across Lincolnshire, London and Essex — from a few hours a week to 24/7 support.",
};

const carePlan = [
  "Personal care",
  "Taking medication",
  "Community inclusion",
  "Domestic tasks such as cooking and cleaning",
  "Helping with managing benefits",
  "Managing finances and budgeting",
  "Supporting with finding employment or voluntary work",
  "Supporting healthy lifestyles",
  "Accessing leisure and social activities",
  "Maintaining relationships with friends and family, and establishing new ones",
];

const conditions = [
  "Mild to complex learning disabilities",
  "Autism with a learning disability",
  "Down's Syndrome",
  "Global developmental delay",
  "Communication or sensory processing challenges",
  "Co-occurring physical or mental health needs",
  "And more",
];

export default function SupportedLivingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Supported Living" }]}
        eyebrow="Servicing Lincolnshire, London & Essex"
        title="Supported Living"
        highlight={["Living"]}
        description="Charismatic Care believes that every person has the right to choose the life they want to live."
        image="/images/pages/supported-living-update1.webp"
        imageAlt="Support worker with a client in supported living"
      />

      <AboutIntro />
      <Specialisms />

      <SplitSection
        eyebrow="Person-centred"
        title="Bespoke Support Services"
        highlight={["Bespoke"]}
        image="/images/pages/supported-living-update2.webp"
        imageAlt="Client and support worker together"
        paragraphs={[
          "We work hand in hand with each person making them the centre of everything we do. A support plan will be crafted agreeing with the individual on how they want to be supported at home and in the community. We also involve their families and other healthcare professionals in ensuring the right support is given.",
          "We offer emotional and physical support from trained staff to meet their specific needs. Support workers are carefully matched to each person to create a mutually trusting and positive relationship. Support is available from a few hours a week to 24 hours a day, 7 days a week.",
        ]}
      >
        <Reveal delay={0.3} y={20} className="mt-8">
          <ButtonLink href="#contact" arrow>
            Get In Touch
          </ButtonLink>
        </Reveal>
      </SplitSection>

      <BrochureCTA />

      <SplitSection
        reverse
        tone="mist"
        eyebrow="Our care plans"
        title="How do we support you?"
        highlight={["support", "you?"]}
        image="/images/pages/supported-living-update3.webp"
        imageAlt="Support worker helping with daily living"
        paragraphs={["Our support plans enable individuals with a wide range of needs to lead a more fulfilling and joyful life. Care plans will include:"]}
      >
        <CheckList items={carePlan} columns={2} className="mt-8" />
      </SplitSection>

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl lg:text-[2.8rem]">
                Who Can Receive Our <span className="text-gradient">Learning Disability and Autism Care?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15} y={20}>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Home care for learning disabilities is not one-size-fits-all, and it can be personalised to meet unique needs.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                We provide personalised care plans for people of all ages and abilities. Whether someone needs help with daily life tasks,
                emotional support, or developing skills, we provide help and support to meet a person&apos;s needs.
              </p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <p className="mb-5 font-display text-lg font-semibold text-ink">Our Care Services are Perfect for those Living with:</p>
            </Reveal>
            <CheckList items={conditions} />
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />
      <ContactSection />
      <Areas />
    </>
  );
}
