"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { company, navigation, type ServiceKey } from "@/data/site";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenis";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { serviceIcons } from "@/components/ui/icons";
import { ease } from "@/components/ui/motion";

type NavItem = (typeof navigation.main)[number];
type NavChild = { label: string; href: string; description: string };

function iconFor(href: string) {
  const key = href.replaceAll("/", "") as ServiceKey | "care-services";
  return serviceIcons[key];
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > 500 && y > prev && !mobileOpen && !open);
  });

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  // Pause page scrolling while the mobile menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (mobileOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // White logo/text over dark backgrounds: the top of every page's hero, and the open mobile menu.
  const light = mobileOpen || !scrolled;

  const openMenu = (label: string) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-500",
            scrolled && !mobileOpen ? "glass-light py-2 shadow-[0_8px_30px_-12px_rgb(27_20_53/0.18)]" : "py-4",
          )}
        >
          <div className="container-x relative flex items-center justify-between gap-6">
            <Logo light={light} />

            <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
              {navigation.main.map((item: NavItem) => {
                const children = "children" in item ? (item.children as NavChild[]) : undefined;
                const active = isActive(item.href) || children?.some((c) => isActive(c.href));
                return (
                  <div
                    key={item.label}
                    className={cn(item.label !== "Services" && "relative")}
                    onPointerEnter={() => children && openMenu(item.label)}
                    onPointerLeave={() => children && scheduleClose()}
                  >
                    <div className="relative">
                    {children ? (
                      <button
                        type="button"
                        aria-expanded={open === item.label}
                        onClick={() => setOpen(open === item.label ? null : item.label)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-4 py-2 font-display text-[0.93rem] font-medium transition-colors",
                          light ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-brand-600",
                          active && (light ? "text-white" : "text-brand-600"),
                        )}
                      >
                        {item.label}
                        <ChevronDown className={cn("size-4 transition-transform duration-300", open === item.label && "rotate-180")} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "relative block rounded-full px-4 py-2 font-display text-[0.93rem] font-medium transition-colors",
                          light ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-brand-600",
                          active && (light ? "text-white" : "text-brand-600"),
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn("absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full", light ? "bg-white" : "bg-brand-500")}
                      />
                    )}
                    </div>

                    <AnimatePresence>
                      {children && open === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.3, ease }}
                          className={cn(
                            "absolute top-full pt-4",
                            item.label === "Services" ? "left-1/2 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2" : "left-0 w-[340px]",
                          )}
                        >
                          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-[0_30px_80px_-20px_rgb(27_20_53/0.35)] ring-1 ring-brand-100">
                            {item.label === "Services" ? (
                              <div className="grid grid-cols-[1fr_230px] gap-3">
                                <div className="grid grid-cols-2 gap-1">
                                  {children.map((c) => {
                                    const Icon = iconFor(c.href);
                                    return (
                                      <Link
                                        key={c.href}
                                        href={c.href}
                                        className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50"
                                      >
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-50 to-navy-50 text-brand-600 ring-1 ring-brand-100 transition-all duration-300 group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
                                          {Icon && <Icon className="size-5" />}
                                        </span>
                                        <span>
                                          <span className="block font-display text-sm font-semibold text-ink">{c.label}</span>
                                          <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted">{c.description}</span>
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                                <Link href="/contact/" className="group relative overflow-hidden rounded-2xl">
                                  <Image src="/images/gallery/gallery23.webp" alt="" fill sizes="230px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-linear-to-t from-navy-900/95 via-brand-900/50 to-transparent" />
                                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                    <p className="font-display text-lg leading-tight font-semibold">Not sure which care is right?</p>
                                    <p className="mt-1.5 text-sm text-white/75">Talk to our friendly team today.</p>
                                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200">
                                      Get in touch <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            ) : (
                              <div className="grid gap-1">
                                {children.map((c) => (
                                  <Link key={c.href} href={c.href} className="group rounded-2xl p-3 transition-colors hover:bg-brand-50">
                                    <span className="flex items-center justify-between font-display text-sm font-semibold text-ink">
                                      {c.label}
                                      <ArrowRight className="size-4 -translate-x-2 text-brand-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                    </span>
                                    <span className="mt-0.5 block text-xs text-muted">{c.description}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={company.phone.href}
                className={cn(
                  "hidden items-center gap-2 font-display text-sm font-semibold transition-colors xl:flex",
                  light ? "text-white" : "text-ink hover:text-brand-600",
                )}
              >
                <span className={cn("grid size-9 place-items-center rounded-full", light ? "bg-white/15" : "bg-brand-50 text-brand-600")}>
                  <Phone className="size-4" />
                </span>
                {company.phone.display}
              </a>
              <ButtonLink href="/contact/" className="px-6! py-3! text-sm max-sm:hidden!">
                Get In Touch
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "grid size-11 place-items-center rounded-full transition-colors lg:hidden",
                  mobileOpen ? "bg-white text-navy-700" : light ? "bg-white/15 text-white" : "bg-brand-50 text-brand-600",
                )}
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isActive={isActive} />
    </>
  );
}

function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (href: string) => boolean }) {
  const [expanded, setExpanded] = useState<string | null>("Services");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
          transition={{ duration: 0.7, ease }}
          className="grain fixed inset-0 z-[45] overflow-y-auto bg-hero lg:hidden"
          data-lenis-prevent
        >
          <div className="container-x flex min-h-full flex-col pt-28 pb-10">
            <motion.nav
              aria-label="Mobile"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
              className="flex flex-col"
            >
              {navigation.main.map((item) => {
                const children = "children" in item ? (item.children as NavChild[]) : undefined;
                return (
                  <motion.div
                    key={item.label}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                    className="border-b border-white/10"
                  >
                    {children ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          aria-expanded={expanded === item.label}
                          className="flex w-full items-center justify-between py-4 font-display text-3xl font-medium text-white"
                        >
                          {item.label}
                          <ChevronDown className={cn("size-6 text-brand-300 transition-transform duration-300", expanded === item.label && "rotate-180")} />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-1 pb-4 sm:grid-cols-2">
                                {children.map((c) => {
                                  const Icon = iconFor(c.href);
                                  return (
                                    <Link
                                      key={c.href}
                                      href={c.href}
                                      onClick={onClose}
                                      className={cn(
                                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                                        isActive(c.href) && "bg-white/10 text-white",
                                      )}
                                    >
                                      {Icon ? <Icon className="size-4 text-brand-300" /> : <ArrowRight className="size-4 text-brand-300" />}
                                      {c.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn("block py-4 font-display text-3xl font-medium text-white", isActive(item.href) && "text-gradient-light")}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease }}
              className="mt-auto space-y-3 pt-10"
            >
              <a href={company.phone.href} className="glass flex items-center gap-3 rounded-2xl p-4 text-white">
                <Phone className="size-5 text-brand-300" /> {company.phone.display}
              </a>
              <a href={`mailto:${company.email}`} className="glass flex items-center gap-3 rounded-2xl p-4 text-white">
                <Mail className="size-5 text-brand-300" /> {company.email}
              </a>
              <ButtonLink href="/contact/" onClick={onClose} className="w-full" arrow>
                Get In Touch
              </ButtonLink>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

