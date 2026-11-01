import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { AboutIntro } from "@/components/sections/about-intro";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { Specialisms } from "@/components/sections/specialisms";
import { TravelFeature } from "@/components/sections/travel-feature";
import { WhyUs } from "@/components/sections/why-us";
import { Gallery } from "@/components/sections/gallery";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { BrochureCTA } from "@/components/sections/brochure-cta";
import { LatestPosts } from "@/components/sections/latest-posts";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <AboutIntro />
      <ServicesShowcase />
      <Specialisms />
      <TravelFeature />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <FAQ />
      <BrochureCTA />
      <LatestPosts />
      <ContactSection />
      <Areas />
    </>
  );
}
