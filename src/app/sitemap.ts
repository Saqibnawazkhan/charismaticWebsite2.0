import type { MetadataRoute } from "next";
import { company } from "@/data/site";
import { jobs } from "@/data/jobs";
import { getPosts } from "@/lib/posts";

const pages = [
  "",
  "care-services",
  "supported-living",
  "live-in-care",
  "domiciliary-care",
  "companionship",
  "respite-care",
  "travel-abroad",
  "about-us",
  "meet-our-founder",
  "careers",
  "contact",
  "blog",
  "downloads",
  "privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${company.url}/${path ? `${path}/` : ""}`;
  return [
    ...pages.map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...jobs.map((j) => ({ url: url(`jobs/${j.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getPosts().map((p) => ({ url: url(`blog/${p.slug}`), lastModified: p.date, priority: 0.6 })),
  ];
}
