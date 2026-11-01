import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { PageHero } from "@/components/page/page-hero";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download Charismatic Care policies and forms.",
};

const files = [
  {
    title: "Accident and Incident Reporting Policy and Procedure",
    description: "Our policy and procedure for reporting accidents and incidents.",
    href: "/downloads/accident-and-incident-reporting-policy.pdf",
    size: "PDF",
  },
  {
    title: "Time Sheet Form",
    description: "Time sheet form for Charismatic Care staff.",
    href: "/downloads/time-sheet-form.pdf",
    size: "PDF",
  },
];

export default function DownloadsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Downloads" }]} eyebrow="Resources" title="Downloads" highlight={["Downloads"]} actions={false} />
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <Stagger className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" stagger={0.12}>
            {files.map((f) => (
              <StaggerItem key={f.href}>
                <a
                  href={f.href}
                  download
                  className="group flex h-full flex-col rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-brand-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgb(153_0_204/0.4)]"
                >
                  <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
                    <FileText className="size-7" />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-semibold text-ink">{f.title}</h2>
                  <p className="mt-2 text-muted">{f.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 font-display font-semibold text-brand-600">
                    <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    Download Now
                    <span className="ml-auto rounded-full bg-mist px-3 py-1 text-xs text-muted">{f.size}</span>
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
