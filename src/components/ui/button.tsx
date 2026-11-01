import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { company } from "@/data/site";

type Variant = "primary" | "navy" | "white" | "outline" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-brand-500 via-brand-600 to-iris text-white shadow-glow hover:shadow-[0_24px_60px_-12px_rgb(153_0_204/0.6)] bg-[length:200%_100%] bg-left hover:bg-right",
  navy: "bg-navy-500 text-white shadow-[0_18px_40px_-14px_rgb(0_51_153/0.6)] hover:bg-navy-600",
  white: "bg-white text-brand-600 shadow-soft hover:text-navy-500",
  outline: "border-2 border-brand-500/80 text-brand-600 hover:bg-brand-500 hover:text-white",
  "outline-light": "border border-white/30 text-white hover:bg-white hover:text-navy-700 backdrop-blur-sm",
  ghost: "text-brand-600 hover:text-navy-500 px-0!",
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full px-7 py-3.5 font-display text-[0.95rem] font-medium tracking-wide transition-all duration-500 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

function Shine({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent" />
    </span>
  );
}

type Common = { variant?: Variant; className?: string; children: ReactNode; arrow?: boolean };

export function ButtonLink({ href, variant = "primary", className, children, arrow = false, ...rest }: Common & ComponentProps<typeof Link>) {
  const external = typeof href === "string" && /^(https?:|tel:|mailto:)/.test(href);
  const content = (
    <>
      <Shine show={variant === "primary"} />
      <span className="relative">{children}</span>
      {arrow && <ArrowRight className="relative size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </>
  );
  if (external) {
    return (
      <a href={href as string} className={cn(base, variants[variant], className)} {...(rest as ComponentProps<"a">)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {content}
    </Link>
  );
}

export function Button({ variant = "primary", className, children, arrow = false, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Shine show={variant === "primary"} />
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
      {arrow && <ArrowRight className="relative size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </button>
  );
}

/** Phone call-to-action with a pulsing icon, as used throughout the original site. */
export function CallButton({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <a href={company.phone.href} className={cn("group/call inline-flex items-center gap-3.5", className)}>
      <span className="relative grid size-12 place-items-center rounded-full bg-linear-to-br from-navy-500 to-brand-500 text-white shadow-glow">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/50" />
        <Phone className="relative size-5 transition-transform duration-300 group-hover/call:rotate-12" />
      </span>
      <span className="leading-tight">
        <span className={cn("block text-xs font-semibold tracking-[0.18em] uppercase", dark ? "text-white/60" : "text-muted")}>Call us now</span>
        <span className={cn("font-display text-lg font-semibold", dark ? "text-white" : "text-ink")}>{company.phone.display}</span>
      </span>
    </a>
  );
}
