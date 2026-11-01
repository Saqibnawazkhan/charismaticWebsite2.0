import type { Metadata } from "next";
import { CookingPot, HeartHandshake, Plane, ShoppingCart, Sofa, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { CtaBanner, FeatureGrid, Prose, SplitSection } from "@/components/page/blocks";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Companionship Care",
  description:
    "Non-medical companionship care from kind, carefully matched carers — friendly company, meals, shopping trips, travel help and emotional support to beat loneliness.",
};

const help = [
  { title: "General companionship", text: "Your carer is your friend who will provide fun and compassionate company throughout the week.", icon: HeartHandshake },
  {
    title: "Cooking your favourite meals",
    text: "Your companion can prepare fresh meals at the times you want to eat and can also sit and share the meal with you.",
    icon: CookingPot,
  },
  {
    title: "Weekly shopping trip",
    text: "A companion can help you with the shopping, either collect it for you or accompany you to the shops.",
    icon: ShoppingCart,
  },
  {
    title: "Help with travelling",
    text: "Travelling long distances can be challenging, but your companion can help you plan your journey as well as join you.",
    icon: Plane,
  },
  {
    title: "Domestic tasks help",
    text: "Your carer is providing fellowship as well as help with the household tasks, such as laundry and cleaning.",
    icon: Sparkles,
  },
  {
    title: "Ensure your comfort",
    text: "Your companion can help you feel comfortable and relaxed; they adjust the heating, plump your pillows, or tidy things up at home.",
    icon: Sofa,
  },
];

export default function CompanionshipPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Companionship" }]}
        eyebrow="Companionship"
        title="Companionship Care"
        highlight={["Care"]}
        description="The support of a trusted friend to boost your confidence and independence."
        image="/images/pages/companionship-new-1.webp"
        imageAlt="Companion carer enjoying time with a client"
      />

      <SplitSection
        eyebrow="Non-medical support"
        title="Regular visits from a friendly face"
        highlight={["friendly", "face"]}
        image="/images/pages/companionship-new-2.webp"
        imageAlt="Companion and client chatting"
        paragraphs={[
          "We offer companionship in a form of non-medical support to you or your loved one. Our Companions make regular visits, which vary in frequency depending on what you want. It may be one visit per week, two to three visits per week, or even daily visits.",
          "You will get assistance with daily tasks such a preparing meals, laundering, and light housework. Companions can even escort you to appointments, be it medical or social.",
        ]}
      />

      <section className="bg-mist pt-20 lg:pt-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading align="left" eyebrow="Companion care" title="What Does It Mean?" highlight={["Mean?"]} />
          <Prose
            paragraphs={[
              "Companion care means enjoying the support of a trusted friend to boost your confidence and independence.",
              "Sometimes people do not need support with complex medical needs or personal care tasks, but they want to live a life with freedom to do the things they love while enjoying human emotions.",
              "Companionship care is a type of home care service perfect for people who may be feeling lonely or who have been experiencing loneliness for a long time. A caregiver will visit the person's home daily or a few days a week to provide company and emotional support.",
            ]}
          />
        </div>
      </section>
      <FeatureGrid title="How your companion can help" highlight={["companion"]} items={help} />

      <SplitSection
        reverse
        eyebrow="Carefully matched"
        title="Personalised Support from Someone You Can Trust"
        highlight={["Someone", "You", "Can", "Trust"]}
        image="/images/pages/companionship-new-3.webp"
        imageAlt="Companion carer and client laughing together"
        paragraphs={[
          "We have a wonderful team of companionship carers who have all been provided with in-depth training and selected for their kind and compassionate personalities. You will be matched with a companionship carer who shares your interests, hobbies, and personality.",
          "They will spend quality time with you, whether you need visiting care or live-in care. A strong bond is formed that helps you overcome loneliness and depression.",
        ]}
      />

      <CtaBanner />
      <ServicesShowcase exclude="companionship" eyebrow="Explore More" title="Other ways we can help" showAllLink={false} />
      <ContactSection />
      <Areas />
    </>
  );
}
