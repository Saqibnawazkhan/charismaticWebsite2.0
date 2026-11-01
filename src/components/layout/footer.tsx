import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { company, navigation, services } from "@/data/site";
import { Logo } from "@/components/ui/logo";
import { Marquee } from "@/components/ui/motion";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/icons";

const socials = [
  { label: "Facebook", href: company.socials.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: company.socials.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: company.socials.youtube, Icon: YoutubeIcon },
  { label: "LinkedIn", href: company.socials.linkedin, Icon: LinkedinIcon },
];

const marqueeWords = ["Compassionate Care", "Empowering Lives", "Professional", "Respectful", "Innovative", "Transforming The Way We Care"];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />

      <div className="relative border-b border-white/10 py-10">
        <Marquee speed={45}>
          {marqueeWords.map((t) => (
            <span key={t} className="flex items-center gap-12 font-display text-5xl font-semibold whitespace-nowrap md:text-7xl">
              <span className="text-transparent transition-colors duration-500 [-webkit-text-stroke:1px_rgb(255_255_255/0.35)] hover:text-white">
                {t}
              </span>
              <span className="text-brand-400">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-6">
          <Logo light className="h-16! w-[125px]!" />
          <p className="max-w-xs leading-relaxed text-white/60">
            Professional, affordable, reliable, 24/7 supported care for people with Learning Disabilities, Autism, Down Syndrome and Behavioural
            needs.
          </p>
          <div className="flex gap-2.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500 hover:ring-brand-400"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <FooterList title="Useful Links" links={navigation.useful} />
        <FooterList
          title="Our Services"
          links={[{ label: "Care Services", href: "/care-services/" }, ...services.map((s) => ({ label: s.title, href: s.href }))]}
        />

        <div>
          <h3 className="font-display text-lg font-semibold">Get In Touch</h3>
          <ul className="mt-6 space-y-4 text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-300" />
              <span>
                {company.address.line1}, {company.address.line2}. {company.address.postcode}
              </span>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="flex gap-3 transition-colors hover:text-white">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand-300" />
                {company.email}
              </a>
            </li>
            <li>
              <a href={company.phone.href} className="flex gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-300" />
                {company.phone.display}
              </a>
            </li>
          </ul>
          <div className="mt-7 flex items-center gap-3">
            <div className="overflow-hidden rounded-xl bg-white p-1.5">
              <Image src="/images/badges/cqc-good.jpg" alt="CQC rated Good" width={83} height={62} className="h-12 w-auto" />
            </div>
            <div className="overflow-hidden rounded-xl bg-white p-1.5">
              <Image src="/images/badges/rating.jpg" alt="Rated 8.0 on carehome.co.uk" width={209} height={62} className="h-12 w-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="font-display tracking-wide text-white/60">{company.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="mt-6 space-y-3">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="group inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white">
              <span className="relative">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-300 transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
