import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { ContactSection } from "@/components/sections/contact-section";
import { Areas } from "@/components/sections/areas";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/ui/motion";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with Charismatic Care. Call ${company.phone.display}, email ${company.email} or send us a message — our team is ready to help.`,
};

const mapQuery = encodeURIComponent(`${company.address.line1}, ${company.address.line2}, ${company.address.postcode}`);

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact Us" }]}
        eyebrow="Contact Us"
        title="We are always excited to hear from you"
        highlight={["hear", "from", "you"]}
        description="Please feel free to get in touch with us through a call or through the contact form if you need any more information. Our team will be ready to assist you."
      />

      <ContactSection />

      <section className="pb-6">
        <div className="container-x">
          <Reveal y={40}>
            <div className="overflow-hidden rounded-[2.5rem] shadow-card ring-1 ring-brand-100">
              <iframe
                title="Map showing Charismatic Care's office"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-[420px] w-full grayscale-[30%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Areas />
      <FAQ />
    </>
  );
}
