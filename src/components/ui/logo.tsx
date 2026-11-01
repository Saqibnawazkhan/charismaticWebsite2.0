import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Brand logo. `light` shows the white version for dark backgrounds; both are rendered so they can cross-fade. */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Charismatic Care — home" className={cn("relative block h-12 w-[94px] shrink-0 sm:h-14 sm:w-[110px]", className)}>
      <Image
        src="/images/brand/logo.webp"
        alt="Charismatic Care Limited"
        fill
        sizes="110px"
        preload
        className={cn("object-contain transition-opacity duration-500", light ? "opacity-0" : "opacity-100")}
      />
      <Image
        src="/images/brand/logo-white.png"
        alt=""
        fill
        sizes="110px"
        preload
        className={cn("object-contain transition-opacity duration-500", light ? "opacity-100" : "opacity-0")}
      />
    </Link>
  );
}
