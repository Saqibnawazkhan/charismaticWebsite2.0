"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/** Charis's mark: a speech bubble holding a sparkle, with a small star twinkling beside it. */
export function ChatSparkleIcon({ className, still = false }: { className?: string; still?: boolean }) {
  const id = `cs${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const spin = "[transform-box:fill-box] origin-center";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="9" y1="11.5" x2="19" y2="22.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c66cf5" />
          <stop offset="0.5" stopColor="#9900cc" />
          <stop offset="1" stopColor="#2b2fb0" />
        </linearGradient>
      </defs>
      <path
        d="M14 7.5c6.35 0 11.5 4.25 11.5 9.5S20.35 26.5 14 26.5c-1.35 0-2.64-.19-3.84-.54L5 28l1.3-4.3C4.25 22.03 2.5 19.66 2.5 17c0-5.25 5.15-9.5 11.5-9.5z"
        fill="white"
      />
      <path
        className={cn(spin, !still && "animate-twinkle-slow")}
        d="M14 11.5c.45 2.75 2.25 4.55 5 5-2.75.45-4.55 2.25-5 5-.45-2.75-2.25-4.55-5-5 2.75-.45 4.55-2.25 5-5z"
        fill={`url(#${id})`}
      />
      <path
        className={cn(spin, !still && "animate-twinkle")}
        d="M26.5 1.5c.32 1.9 1.35 2.93 3.25 3.25-1.9.32-2.93 1.35-3.25 3.25-.32-1.9-1.35-2.93-3.25-3.25 1.9-.32 2.93-1.35 3.25-3.25z"
        fill="white"
      />
      <circle className={cn(spin, !still && "animate-twinkle [animation-delay:-1.1s]")} cx="30" cy="10.5" r="1.1" fill="white" />
    </svg>
  );
}

/**
 * Charis's avatar: a glossy brand-gradient sphere carrying the chat-sparkle mark.
 * `active` adds a spinning gradient ring (while replying); `halo` adds an orbit ring for hero use.
 */
export function CharisAvatar({ size = 40, active = false, halo = false, className }: { size?: number; active?: boolean; halo?: boolean; className?: string }) {
  return (
    <span aria-hidden style={{ width: size, height: size }} className={cn("relative inline-grid shrink-0 place-items-center", className)}>
      {halo && (
        <>
          <span className="absolute -inset-[22%] rounded-full bg-brand-400/30 blur-xl" />
          <span className="absolute -inset-[14%] animate-spin-slow rounded-full border border-dashed border-brand-300/70 [animation-duration:18s]" />
        </>
      )}
      <span
        className={cn(
          "absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,transparent,#bd55f0,#7468f2,#f48fd8,transparent)] opacity-0 transition-opacity duration-300",
          active && "animate-spin opacity-100 [animation-duration:1.4s]",
        )}
      />
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,#cf7cf7_0%,#9900cc_42%,#3d23a8_78%,#002b82_100%)] shadow-[inset_0_1px_1px_rgb(255_255_255/0.5),inset_0_-2px_6px_rgb(0_0_0/0.25),0_8px_18px_-8px_rgb(153_0_204/0.8)]" />
      <span className="absolute inset-x-[20%] top-[7%] h-[26%] rounded-full bg-linear-to-b from-white/45 to-white/0" />
      <ChatSparkleIcon className="relative w-[60%] translate-x-[3%] drop-shadow-[0_1px_2px_rgb(43_10_90/0.35)]" />
    </span>
  );
}
