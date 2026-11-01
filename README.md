# Charismatic Care — Website

A rebuild of [charismaticcare.net](https://www.charismaticcare.net) in Next.js, carrying over all of the original content, images, brand colours and URLs, with a new animated design.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion (animations) · Lenis (smooth scrolling)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Phone, email, address, social links, services, FAQs, testimonials, areas, gallery | `src/data/site.ts` |
| Blog posts (27, imported from the old site) | `src/data/posts.json` |
| Job vacancies | `src/data/jobs.ts` |
| Pages | `src/app/<page>/page.tsx` |
| Reusable page sections (hero, services, FAQ, gallery…) | `src/components/sections/` |
| Inner-page building blocks (page hero, split sections, feature grids) | `src/components/page/` |
| Animation helpers (reveal, word-by-word headings, counters, parallax, marquee) | `src/components/ui/motion.tsx` |
| Brand colours, fonts, keyframes | `src/app/globals.css` (`@theme` block) |
| Images, video, PDFs | `public/images`, `public/videos`, `public/downloads` |

Most copy changes only need an edit to `src/data/site.ts` or the relevant `page.tsx`.

## Forms (contact, brochure request, job application)

All three forms post to `src/app/api/enquiry/route.ts`. To have them emailed to you:

1. Create a free account at [resend.com](https://resend.com) and verify your domain.
2. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL`.

Without an API key, submissions are printed to the server console instead (useful in development). Job applications include the uploaded CV as an attachment.

## Deploying

The site deploys as-is to [Vercel](https://vercel.com) (import the repo, add the environment variables above). All pages except the form API are pre-rendered as static HTML.

URLs match the original WordPress site (`/about-us/`, `/live-in-care/`, `/blog/<slug>/`, `/jobs/<slug>/`…), so existing links and search rankings carry over. `/apply-online/` redirects to the job application form.

## Accessibility

Animations respect the visitor's "reduce motion" setting, every interactive element is keyboard-accessible, and there's a skip-to-content link.
