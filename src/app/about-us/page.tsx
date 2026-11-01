import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Eye, Handshake, Lightbulb, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { Prose, SplitSection } from "@/components/page/blocks";
import { WhyUs } from "@/components/sections/why-us";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Charismatic Care Ltd is a specialist health and social care provider supporting people with learning disabilities, autism, Down syndrome, mental health and complex behavioural needs.",
};

const values = [
  {
    title: "Professional",
    text: "Doing the right thing, every time. We act with honesty, integrity, accountability, and professionalism while maintaining the highest standards of care and support.",
    icon: ShieldCheck,
  },
  {
    title: "Respectful",
    text: "We value every person, treating them with dignity, kindness, fairness, and respect while promoting choice, independence, equality, and inclusion.",
    icon: Handshake,
  },
  {
    title: "Innovative",
    text: "We embrace learning, evidence-based practice, and continuous improvement to deliver responsive, effective, and forward-thinking support.",
    icon: Lightbulb,
  },
  {
    title: "Transforming the Way We Care",
    text: "We go beyond completing tasks. We focus on empowering people, building meaningful relationships, promoting independence, and creating positive outcomes that truly change lives.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About Us" }]}
        eyebrow="About Us"
        title="Compassionate Specialist Care That Empowers Lives"
        highlight={["Empowers", "Lives"]}
        description="A specialist health and social care provider dedicated to supporting individuals with Learning Disabilities, Autism Spectrum Conditions, Down Syndrome, Mental Health Needs, and Complex Behavioural Needs."
        image="/images/about/about-img-new-1.webp"
        imageAlt="Charismatic Care clients and staff on a trip"
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              Every individual has unique strengths, abilities, aspirations, and <span className="text-gradient">the right to live a fulfilling life.</span>
            </h2>
          </Reveal>
          <Prose
            paragraphs={[
              "At Charismatic Care Ltd (CCL), we are a specialist health and social care provider dedicated to supporting individuals with Learning Disabilities, Autism Spectrum Conditions, Down Syndrome, Mental Health Needs, and Complex Behavioural Needs.",
              "We believe that every individual has unique strengths, abilities, aspirations, and the right to live a fulfilling life within their community. Our purpose is to provide high-quality, person-centred support that promotes independence, dignity, inclusion, and positive outcomes.",
              "Our services are designed to meet the diverse and often complex needs of the people we support. We work closely with individuals, families, local authorities, healthcare professionals, and multidisciplinary teams to develop tailored support plans that focus on each person's goals, preferences, strengths, and wellbeing.",
              "At CCL, we understand that effective support goes beyond meeting care needs. It involves building trusting relationships, understanding individual communication styles, recognising personal strengths, and creating opportunities for people to thrive.",
              "Guided by our core values of Professional, Respectful, Innovative, and Transforming the Way We Care, we strive to make a lasting difference in the lives of the people we support every day.",
            ]}
          />
        </div>
      </section>

      {/* Founder quote */}
      <section className="pb-20 lg:pb-28">
        <div className="container-x">
          <Reveal y={50}>
            <div className="grain relative grid items-center gap-10 overflow-hidden rounded-[2.75rem] bg-hero p-8 text-white sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:p-16">
              <div aria-hidden className="absolute inset-0 bg-grid" />
              <div className="relative mx-auto aspect-[673/609] w-full max-w-[380px]">
                <Image src="/images/about/ceo.webp" alt="Gifty Agyemang, Founder & Registered Care Manager" fill sizes="380px" className="object-contain" />
              </div>
              <div className="relative">
                <Quote className="size-12 text-brand-300" />
                <blockquote className="mt-6 font-display text-2xl leading-snug font-light sm:text-3xl">
                  &ldquo;At Charismatic Care Ltd, we don&apos;t just provide support. We build relationships, unlock potential, champion independence,
                  and transform lives through compassionate, specialist care.&rdquo;
                </blockquote>
                <p className="mt-8 font-display text-xl font-semibold">Gifty Agyemang</p>
                <p className="text-white/60">Founder &amp; Registered Care Manager</p>
                <Link
                  href="/meet-our-founder/"
                  className="group mt-8 inline-flex items-center gap-2 font-display font-medium text-brand-200 transition-colors hover:text-white"
                >
                  Meet our founder <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading align="left" eyebrow="Our Story" title="Why I Started Charismatic Care Ltd" highlight={["Charismatic", "Care", "Ltd"]} />
          <Prose
            paragraphs={[
              "My journey to founding Charismatic Care Ltd began through my experiences working across health and social care as a Registered Nurse, Registered Social Worker, Independent Prescriber, and Registered Care Manager.",
              "Over the years, I have had the privilege of supporting individuals with learning disabilities, autism, Down syndrome, mental health needs, and complex behavioural needs. While many people receive excellent support, I also witnessed the challenges that individuals and families often face in finding services that truly understand their unique needs, aspirations, and potential.",
              "I founded Charismatic Care Ltd because I wanted to create something different.",
              "I wanted to build an organisation where people are seen as individuals first, not defined by a diagnosis, disability, or behavioural challenge. An organisation where compassion, professionalism, respect, and innovation are at the heart of everything we do.",
              "At Charismatic Care Ltd, we focus on strengths rather than limitations. We believe every person deserves opportunities to thrive, participate in their community, build meaningful relationships, and achieve their goals, regardless of their circumstances.",
            ]}
          />
        </div>
      </section>

      <SplitSection
        eyebrow="Our People"
        title="Our Highly Skilled and Compassionate Team"
        highlight={["Compassionate", "Team"]}
        image="/images/about/our-team-new.webp"
        imageAlt="Members of the Charismatic Care team"
        paragraphs={[
          "At Charismatic Care Ltd, our greatest strength is our people. Our team is made up of dedicated, compassionate, and highly skilled professionals who are passionate about supporting individuals with learning disabilities, autism, Down syndrome, mental health needs, and complex behavioural needs. Led by our Founder and Registered Care Manager, we combine professional expertise, specialist knowledge, and a genuine commitment to helping every individual live a fulfilling, meaningful, and independent life.",
          "Every team member is selected for their skills and experience as well as their compassion, integrity, and commitment to achieving positive outcomes. Our staff work as advocates, mentors, and trusted partners alongside individuals, families, and other professionals to promote independence, choice, dignity, inclusion, and personal development.",
          "All members of our care team hold a minimum Level 2 qualification in Health and Social Care and have successfully completed the Care Certificate, while many hold advanced qualifications and specialist expertise in learning disabilities, autism, mental health, behavioural support, leadership, and clinical practice. Through ongoing training and professional development, our team is equipped to consistently provide safe, effective, compassionate, and person-centred care.",
        ]}
      />

      <section className="grain relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <div aria-hidden className="absolute -top-40 right-0 size-[600px] animate-aurora rounded-full bg-brand-600/30 blur-[130px]" />
        <div className="container-x relative">
          <SectionHeading dark eyebrow="What we stand for" title="Our Values" highlight={["Values"]} />
          <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {values.map(({ title, text, icon: Icon }, i) => (
              <StaggerItem key={title}>
                <div className="group h-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-brand-400/50 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-iris shadow-glow transition-transform duration-500 group-hover:-rotate-6">
                      <Icon className="size-6" />
                    </span>
                    <span className="font-display text-4xl font-semibold text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal y={50} className="mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[592/557] animate-float-slow">
              <Image src="/images/about/about-new-5.webp" alt="Charismatic Care support in the community" fill sizes="520px" className="object-contain" />
            </div>
          </Reveal>
          <Stagger className="grid gap-6" stagger={0.15}>
            {[
              {
                icon: Compass,
                title: "Our Mission",
                text: "To deliver outstanding specialist care and support services that empower individuals with learning disabilities, autism, Down syndrome, mental health conditions, and complex behavioural needs to live fulfilling, independent, and meaningful lives.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To be a leading specialist care provider recognised for transforming lives through compassionate, innovative, and person-centred support that enables people to reach their full potential.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="flex gap-6 rounded-[2rem] bg-mist p-8 ring-1 ring-brand-100">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
                    <p className="mt-3 text-lg leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SplitSection
        reverse
        tone="mist"
        eyebrow="Our Promise"
        title="We do not simply provide care."
        highlight={["provide", "care."]}
        image="/images/about/about-new-6.webp"
        imageAlt="Smiling client with a carer"
        paragraphs={[
          "At Charismatic Care Ltd, we do not simply provide care.",
          "We champion potential, celebrate individuality, promote independence, and empower people to live the lives they choose. Through professionalism, compassion, innovation, and a commitment to excellence, we are transforming the way care is delivered for individuals with learning disabilities, autism, Down syndrome, mental health conditions, and complex behavioural needs.",
        ]}
      />

      <section className="py-20 text-center lg:py-28">
        <div className="container-x">
          <Reveal>
            <p className="font-display text-sm font-medium tracking-[0.3em] text-brand-600 uppercase">Charismatic Care Ltd</p>
            <p className="mx-auto mt-6 max-w-5xl font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl lg:text-6xl">
              Professional. Respectful. Innovative. <span className="text-gradient">Transforming the Way We Care.</span>
            </p>
          </Reveal>
        </div>
      </section>

      <WhyUs />
      <ContactSection />
      <Areas />
    </>
  );
}
