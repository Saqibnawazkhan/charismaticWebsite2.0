import type { Metadata } from "next";
import { HeartHandshake, House, Palette, ShieldPlus, Sofa, UsersRound } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { FeatureGrid, ProcessSteps, Prose, SplitSection } from "@/components/page/blocks";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { Testimonials } from "@/components/sections/testimonials";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Care Services",
  description:
    "Exceptional care in the comfort of your own home across Lincolnshire, London and Essex — from weekly visits to round-the-clock live-in support.",
};

const benefits = [
  {
    title: "Dedicated One-to-One Support",
    text: "Home care offers personal, one-to-one attention from a carer who focuses entirely on your unique needs, ensuring consistent, compassionate support whenever it's needed.",
    icon: HeartHandshake,
  },
  {
    title: "Comfort of Familiar Surroundings",
    text: "Staying in a space you know and love can bring confidence, comfort, and peace of mind while you receive the extra help you need.",
    icon: Sofa,
  },
  {
    title: "Care That Fits You",
    text: "Your care plan is tailored just for you, offering just the right level of support to suit your health needs, preferences, and personal lifestyle choices.",
    icon: ShieldPlus,
  },
  {
    title: "Enjoy What You Love",
    text: "Whether it's your morning walk or hobbies, such as playing board games or gardening, home care helps you continue the routines and hobbies you enjoy.",
    icon: Palette,
  },
  {
    title: "Time with Family and Friends",
    text: "Home care gives you the freedom to stay connected with loved ones, and you spend time with them either in your own home or theirs.",
    icon: UsersRound,
  },
  {
    title: "All-in-One Care",
    text: "Our holistic approach supports your physical, emotional, and social well-being, ensuring that you and your family feel supported in every aspect of daily life.",
    icon: House,
  },
];

const steps = [
  { title: "Initial Conversation", text: "We discuss your care needs, preferences, and issues." },
  { title: "Care Assessment", text: "A personalised assessment helps identify the right support level." },
  { title: "Tailored Care Plan", text: "We create a care plan built around the individual." },
  { title: "Matched Carer Visits", text: "We carefully assign carers suited to the person and situation." },
  { title: "Review and Follow-up", text: "The care plan is reviewed regularly to adjust to the changes." },
];

export default function CareServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Care Services" }]}
        eyebrow="Care Services"
        title="Exceptional care in the comfort of your own home"
        highlight={["comfort", "own", "home"]}
        description="From weekly care visits to round-the-clock support, home care is flexible and designed around your unique lifestyle."
        image="/images/pages/care-services-1.webp"
        imageAlt="Carer supporting a client at home"
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              Care at home lets you stay <span className="text-gradient">independent</span> while getting the support you need.
            </h2>
          </Reveal>
          <Prose
            paragraphs={[
              "Also known as care at home, it allows individuals to stay independent while getting the support they need whether that's occasional help or regular, specialist care. From weekly care visits to round-the-clock medical support, home care is flexible and designed around your unique lifestyle. Every person's care needs are different, which is why having choice and control matters.",
              "At Charismatic Care, we proudly serve individuals across Lincolnshire, London and Essex, helping families feel confident that their loved ones are safe, comfortable, and well cared for right where they belong: at home.",
            ]}
          />
        </div>
      </section>

      <FeatureGrid eyebrow="Why Home Care" title="The benefits of care at home" highlight={["care", "at", "home"]} items={benefits} />

      <ServicesShowcase eyebrow="What We Offer" showAllLink={false} />

      <ProcessSteps eyebrow="Simple & Supportive" title="How Our Care Services Work" highlight={["Care", "Services"]} steps={steps} />

      <SplitSection
        tone="mist"
        eyebrow="Lincolnshire, London & Essex"
        title="When and Where You Need?"
        highlight={["You", "Need?"]}
        image="/images/pages/live-in-care-img2.webp"
        imageAlt="Carer and client sharing a happy moment"
        paragraphs={[
          "At Charismatic Care, we specialise in providing personalised home care that empowers your loved ones to live safely and confidently in their own homes. Whether you are in Lincolnshire, London and Essex, our dedicated team will help you receive the right level of care and support you need. Our trusted domiciliary care services are designed to offer practical help, emotional reassurance, and genuine companionship.",
          "We offer full-time live-in care, tailored to your personal needs and routines. Whatever your circumstances, our home care services are here to support you or your loved ones with dignity, respect, and heart.",
        ]}
      />

      <Testimonials />
      <ContactSection />
      <Areas />
    </>
  );
}
