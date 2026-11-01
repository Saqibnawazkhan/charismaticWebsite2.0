import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AnimatedHeading, Reveal } from "./motion";

export function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-display text-xs font-medium tracking-[0.2em] uppercase",
        dark ? "glass text-brand-200" : "bg-brand-50 text-brand-600 ring-1 ring-brand-100",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  dark = false,
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string[];
  description?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <AnimatedHeading
        as={as}
        text={title}
        highlight={highlight}
        highlightClassName={dark ? "text-gradient-light" : "text-gradient"}
        className={cn("text-3xl leading-[1.12] font-semibold sm:text-4xl lg:text-[3.1rem]", dark ? "text-white" : "text-ink")}
      />
      {description && (
        <Reveal delay={0.15} y={16}>
          <div className={cn("text-lg leading-relaxed", dark ? "text-white/70" : "text-muted")}>{description}</div>
        </Reveal>
      )}
    </div>
  );
}
