import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBanner, SplitSection } from "@/components/page/blocks";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { PostCard } from "@/components/sections/post-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Respite Care",
  description:
    "Compassionate, personalised respite care for individuals with learning disabilities, autism, complex behaviours and mental health conditions — giving family carers a well-earned break.",
};

export default function RespiteCarePage() {
  const guides = getPosts()
    .filter((p) => p.topic === "Respite Care")
    .slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/care-services/" }, { label: "Respite Care" }]}
        eyebrow="Respite Care"
        title="Compassionate Respite Care"
        highlight={["Respite", "Care"]}
        description="Short-term, high-quality care that gives family carers a well-earned break, while your loved one continues to receive the best support."
        image="/images/pages/respite-img-new-4.webp"
        imageAlt="Carer providing respite support"
      />

      <SplitSection
        eyebrow="Person-centred care"
        title="Care tailored around the individual"
        highlight={["tailored"]}
        image="/images/pages/respite-care-new-img-2.webp"
        imageAlt="Support worker with a client"
        paragraphs={[
          "Charismatic Care provides compassionate and personalised support for individuals with learning disabilities, autism, complex behaviours and mental health conditions. We understand that every person has different needs, routines and ways of communicating, so our care is tailored around the individual.",
          "Our experienced team focuses on promoting independence, building confidence and supporting emotional and physical wellbeing. Whether support is required short-term or on an ongoing basis, we provide safe, respectful and person-centred care designed around each person's needs.",
        ]}
      />

      <SplitSection
        reverse
        tone="mist"
        eyebrow="Good to know"
        title="What You Need to Know About Respite Care?"
        highlight={["Respite", "Care?"]}
        image="/images/pages/respite-img-new-5.webp"
        imageAlt="Client enjoying an activity with a carer"
        paragraphs={[
          "When someone is living with a learning disability or autism, personalised support can help them maintain independence, confidence and wellbeing. Care can be tailored to individual needs, routines and preferences, whether support is required at home or in the community.",
          "This may include help with daily activities, communication, emotional wellbeing, developing life skills or managing behaviours that may be challenging. The right care provides consistent, person-centred support designed around each individual's needs and personal goals.",
        ]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Respite Care Designed Around Your Needs"
            title="Occasional support or more complex care"
            highlight={["complex", "care"]}
            description="Our experienced carers support individuals with daily routines, personal care, communication, emotional wellbeing and staying connected with the community. We create personalised care plans around each person's specific needs, preferences and personal goals. Whether you need occasional support or more complex care, our dedicated team provides safe, respectful and person-centred support that promotes comfort, confidence and independence."
          />
        </div>
      </section>

      <CtaBanner title="Need a well-earned break?" text="Talk to us about respite support for your loved one — short-term or ongoing." />

      {guides.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Helpful Guides" title="Learn more about respite care" highlight={["respite", "care"]} />
            <Stagger className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {guides.map((p) => (
                <StaggerItem key={p.slug}>
                  <PostCard post={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <ServicesShowcase exclude="respite-care" eyebrow="Explore More" title="Other ways we can help" showAllLink={false} />
      <ContactSection />
      <Areas />
    </>
  );
}
