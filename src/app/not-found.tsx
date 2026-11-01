import Link from "next/link";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { services } from "@/data/site";

export default function NotFound() {
  return (
    <section className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-hero pt-32 pb-20 text-white">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/4 left-1/4 size-[480px] animate-aurora rounded-full bg-brand-500/40 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 size-[420px] animate-aurora rounded-full bg-iris/30 blur-[120px] [animation-delay:-6s]" />
      </div>
      <div className="container-x text-center">
        <p className="font-display text-[8rem] leading-none font-semibold text-gradient-light sm:text-[12rem]">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
          The page may have moved. Head back home, explore our services, or give our friendly team a call.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <CallButton dark />
        </div>
        <ul className="mt-14 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <li key={s.key}>
              <Link href={s.href} className="glass inline-block rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white hover:text-navy-700">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
