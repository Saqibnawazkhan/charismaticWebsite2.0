import type { Metadata } from "next";
import { Bath, Footprints, HeartHandshake, ShoppingBag, Sparkles, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { CtaBanner, FeatureGrid, Prose, SplitSection } from "@/components/page/blocks";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Domiciliary Care",
  description:
    "Highly trained domiciliary carers helping people live independently at home in Lincolnshire and London — personal care, household tasks, mobility, light medical support and companionship.",
};

const services = [
  { title: "Personal Care", text: "We provide personal care with routines such as bathing, toileting, and getting dressed with dignity and respect.", icon: Bath },
  {
    title: "Household Tasks",
    text: "Our carer can help you at home with housekeeping tasks such as doing dishes, laundry, trash, meal preparation, and cleaning and vacuuming.",
    icon: Sparkles,
  },
  {
    title: "Moving Around at Home",
    text: "We trained each carer in mobility support, so they can help with getting in and out of bed, going to the toilet, and moving around the home.",
    icon: Footprints,
  },
  {
    title: "Light Medical Support",
    text: "Our highly trained carers can provide medical support, including PEG feeding and suppositories, catheter care and more.",
    icon: Stethoscope,
  },
  {
    title: "Friendly Companionship",
    text: "All of our carers are selected for their kind, compassionate personalities, so they provide amazing companionship.",
    icon: HeartHandshake,
  },
  {
    title: "Going Out and Running Errands",
    text: "Our carer will help you plan your travel and join you, whether you want to visit family, go shopping or go away on holiday.",
    icon: ShoppingBag,
  },
];

export default function DomiciliaryCarePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Domiciliary Care" }]}
        eyebrow="Home Care"
        title="Domiciliary Care"
        highlight={["Care"]}
        description="Highly trained and experienced home carers helping people live independently in their own homes."
        image="/images/pages/domicillary-care-new-1.webp"
        imageAlt="Domiciliary carer visiting a client at home"
      />

      <SplitSection
        eyebrow="What is domiciliary care?"
        title="Care and support in the comfort of home"
        highlight={["comfort", "of", "home"]}
        image="/images/pages/domicillary-care-new-2.webp"
        imageAlt="Carer helping a client with daily tasks"
        paragraphs={[
          "Domiciliary carers are often known as home carers or private carers. They help people who need care and support live independently in their own homes through live-in care or daily visits. Charismatic Care provides highly trained and experienced domiciliary carers who help people in need in Lincolnshire and the London areas.",
          "Home carers offer help with household tasks, dressing, meal preparations, toileting, medication, and other activities that help to maintain quality of life. It is an ideal choice for people who need support with daily housekeeping tasks, personal care or a listening ear within the comfort of their home.",
        ]}
      />

      <section className="bg-mist pt-20 lg:pt-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading align="left" eyebrow="Personalised for everyone" title="Who Might Need Domiciliary Care?" highlight={["Domiciliary", "Care?"]} />
          <Prose
            paragraphs={[
              "Domiciliary care is perfect for people who want to receive the support they need in the comfort of their home. People of all ages and with a wide range of situations and conditions can choose domiciliary care.",
              "As each person's care needs are different, one-size-fits-all does not work for domiciliary care. So, there is no particular type of care service it offers, but it caters to personalise care that meets unique needs.",
              "We staffed expertly trained carers to provide a wide range of customised care services for people with varying levels of needs. No matter whether simple or complex, it is perfect for all.",
            ]}
          />
        </div>
      </section>
      <FeatureGrid title="How our home carers help" highlight={["home", "carers"]} items={services} />

      <SplitSection
        reverse
        eyebrow="Trusted by families"
        title="Why Choose Us for Domiciliary Services?"
        highlight={["Why", "Choose", "Us"]}
        image="/images/pages/domicillary-care-new-3.webp"
        imageAlt="Smiling carer and client"
        paragraphs={[
          "Many families trust Charismatic Care for their compassionate and reliable domiciliary care services. We offer personalised home care in the Lincolnshire and London Areas to help people live independently and safely in their own homes.",
          "Our carers are selected for their passion to provide personalised care and support for each person, which promotes independence with dignity and respect. They provide help with daily living as well as emotional support to make each day better. We go above and beyond to deliver a service that feels truly personal and reassuring.",
        ]}
      />

      <CtaBanner />
      <ServicesShowcase exclude="domiciliary-care" eyebrow="Explore More" title="Other ways we can help" showAllLink={false} />
      <ContactSection />
      <Areas />
    </>
  );
}
