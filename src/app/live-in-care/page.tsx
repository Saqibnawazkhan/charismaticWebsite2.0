import type { Metadata } from "next";
import { Bath, CookingPot, Footprints, HeartHandshake, PartyPopper, Pill } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { CtaBanner, FeatureGrid, Prose, SplitSection } from "@/components/page/blocks";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Live-in Care",
  description:
    "Compassionate, person-centred live-in care across Lincolnshire and London. CQC regulated, with over 15 years of experience supporting independence, dignity and wellbeing at home.",
};

const includes = [
  { title: "Personal care", text: "We provide discreet and sensitive personal care such as bathing, dressing, shaving, and continence.", icon: Bath },
  {
    title: "Companionship",
    text: "We match you with a Carer that has similar interests and personality with you to ensure that life becomes interesting and enjoyable.",
    icon: HeartHandshake,
  },
  {
    title: "Medication management",
    text: "Our Carers are trained in Medication management and will prompt you to take medication. They can also make medical appointments or accompany you to health professionals.",
    icon: Pill,
  },
  {
    title: "Household tasks",
    text: "Our Carer will cook for/with you nutritious meals that suit your dietary needs. They will also help you keep your home tidy by cleaning it.",
    icon: CookingPot,
  },
  { title: "Assistance with safe mobility", text: "We make sure that your home is safe to improve mobility and movement whilst minimising falls.", icon: Footprints },
  {
    title: "Assistance with social activities",
    text: "We make sure that you stay in touch with your local community. This can be achieved by attending local events or visiting friends and family with the company of your Carer.",
    icon: PartyPopper,
  },
];

export default function LiveInCarePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Live-in Care" }]}
        eyebrow="Live-in Care"
        title="Compassionate Live-in Care"
        highlight={["Live-in", "Care"]}
        description="We understand how important it is to feel comfortable, secure and supported in familiar surroundings."
        image="/images/pages/live-in-care-img1.webp"
        imageAlt="Live-in carer with a client"
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              Over <span className="text-gradient">15 years</span> of experience, fully regulated by the Care Quality Commission.
            </h2>
          </Reveal>
          <Prose
            paragraphs={[
              "Charismatic Care provides compassionate, person-centred support across Lincolnshire and the London areas, helping individuals maintain independence, confidence and a sense of stability in everyday life.",
              "With over 15 years of experience and full regulation by the Care Quality Commission (CQC), you can rely on us to provide respectful and dependable care. Every support plan is tailored around the individual, with our carers focusing on dignity, choice, companionship and personal wellbeing.",
            ]}
          />
        </div>
      </section>

      <FeatureGrid eyebrow="Live-in Care" title="What does our Live-in care include?" highlight={["Live-in", "care"]} items={includes} />

      <SplitSection
        eyebrow="Around-the-clock support"
        title="Is Live-in Care the Right Choice for You?"
        highlight={["Right", "Choice"]}
        image="/images/pages/live-in-care-img3.webp"
        imageAlt="Carer and client relaxing at home"
        paragraphs={[
          "If you are starting to feel like you or your loved ones need around-the-clock support to stay comfortable and independent at home, live-in care could be the ideal solution. We provide a professional carer who lives with you in your home, providing consistent, personalised care throughout the day and night. Our carers will provide help with daily tasks like light housekeeping, preparing nutritious meals, and running errands. But their support doesn't stop there.",
          "At Charismatic Care, we take time to get to know your personal needs, preferences, and lifestyle. Because great care is never one-size-fits-all. We offer a holistic approach that supports not only your physical health but also your emotional and spiritual wellbeing.",
        ]}
      />

      <SplitSection
        reverse
        tone="mist"
        eyebrow="Specialist carers"
        title="Tailored Expert Care, Just for You"
        highlight={["Just", "for", "You"]}
        image="/images/pages/live-in-care-img2.webp"
        imageAlt="Carer supporting a client with daily routines"
        paragraphs={[
          "Our dedicated carers are highly trained to support individuals with learning disabilities, autism, complex behaviours and mental health needs. This can include help with communication, emotional wellbeing, daily routines and developing greater independence.",
          "We also provide respectful and dignified personal care, including support with washing, dressing and grooming, so you can continue living with confidence, comfort and as much independence as possible.",
        ]}
      />

      <CtaBanner />
      <ServicesShowcase exclude="live-in-care" eyebrow="Explore More" title="Other ways we can help" showAllLink={false} />
      <ContactSection />
      <Areas />
    </>
  );
}
