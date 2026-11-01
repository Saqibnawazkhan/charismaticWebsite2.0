import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Readex_Pro } from "next/font/google";
import "./globals.css";
import { company, areas } from "@/data/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { FloatingActions, MotionProvider, Preloader, ScrollProgress } from "@/components/layout/chrome";

const readex = Readex_Pro({ subsets: ["latin"], variable: "--font-readex", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Charismatic Care | Supported Living & Specialist Care in London, Lincolnshire & Essex",
    template: "%s | Charismatic Care",
  },
  description:
    "Professional, affordable, reliable, 24/7 supported care services for people with Learning Disabilities, Autism, Down Syndrome, and Behavioural needs across London, Lincolnshire, and Essex.",
  icons: { icon: "/images/brand/favicon.webp", apple: "/images/brand/favicon.webp" },
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_GB",
    images: [{ url: "/images/hero/hero.jpg", width: 1600, height: 583, alt: "Charismatic Care" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d33",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.legalName,
  url: company.url,
  telephone: company.phone.display,
  email: company.email,
  logo: `${company.url}/images/brand/logo.webp`,
  image: `${company.url}/images/hero/hero.jpg`,
  slogan: company.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    postalCode: company.address.postcode,
    addressCountry: "GB",
  },
  areaServed: areas.map((a) => a.region),
  sameAs: Object.values(company.socials),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${readex.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Hide the intro animation immediately for visitors who have already seen it this session.
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('cc-intro'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <MotionProvider>
          <a
            href="#main"
            className="sr-only z-[200] rounded-full bg-brand-500 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Skip to content
          </a>
          <Preloader />
          <ScrollProgress />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingActions />
        </MotionProvider>
      </body>
    </html>
  );
}
