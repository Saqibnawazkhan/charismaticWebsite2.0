import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the same URL shape as the original WordPress site (e.g. /about-us/) so existing links and SEO carry over.
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      // The old multi-step "Apply Online" page now lives on the job listing.
      { source: "/apply-online", destination: "/jobs/junior-senior-staff-nurses/#apply", permanent: true },
      { source: "/jobs", destination: "/careers/", permanent: true },
    ];
  },
};

export default nextConfig;
