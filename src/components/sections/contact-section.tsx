import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/data/site";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";

const details = [
  { Icon: Phone, label: "Call us everyday", value: company.phone.display, href: company.phone.href },
  { Icon: Mail, label: "Email us", value: company.email, href: `mailto:${company.email}` },
  { Icon: MapPin, label: "Find us", value: `${company.address.line1}, ${company.address.line2}. ${company.address.postcode}` },
  { Icon: Clock3, label: "Support available", value: "24 hours a day, 7 days a week" },
];

/** "Get Help Today" enquiry form, shown at the foot of most pages (as on the original site). */
export function ContactSection({ id = "contact" }: { id?: string }) {
  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden bg-mist py-24 lg:py-32">
      <div aria-hidden className="absolute top-0 right-0 size-[600px] rounded-full bg-brand-200/40 blur-[130px]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Get Help Today"
            title="Get expert support from Charismatic Care today"
            highlight={["expert", "support"]}
            description="Our friendly team will help you if you or a loved one needs professional home care."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ Icon, label, value, href }, i) => {
              const inner = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-[0.15em] text-muted uppercase">{label}</span>
                    <span className="mt-1 block font-display font-semibold break-words text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <Reveal key={label} delay={0.1 + i * 0.08} y={20}>
                  {href ? (
                    <a href={href} className="group flex h-full items-start gap-4 rounded-3xl bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1">
                      {inner}
                    </a>
                  ) : (
                    <div className="group flex h-full items-start gap-4 rounded-3xl bg-white p-5 shadow-card">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal y={50} className="h-full">
          <div className="relative flex h-full flex-col rounded-[2.5rem] bg-white p-7 shadow-[0_50px_100px_-40px_rgb(27_20_53/0.35)] ring-1 ring-brand-100 sm:p-10">
            <div aria-hidden className="absolute inset-x-12 -bottom-6 -z-10 h-24 rounded-full bg-brand-500/25 blur-3xl" />
            <h3 className="font-display text-2xl font-semibold text-ink">Book your appointment</h3>
            <p className="mt-2 mb-8 text-muted">Tell us a little about your needs and we&apos;ll get back to you.</p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
