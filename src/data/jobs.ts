// Vacancies shown on the Careers page. Add a new object here to publish another job.
// The slug matches the original site's URL (/jobs/<slug>/) so existing links keep working.
export const jobs = [
  {
    slug: "junior-senior-staff-nurses",
    title: "Junior & Senior Care Workers",
    type: "Full and Part Time",
    location: "TBC",
    posted: "2025-02-06",
    description: [
      "As a member of our care staff team you will help our residents live fulfilling lives by assisting them with their care needs. You will work alongside an experienced team of registered nurses and healthcare assistants (HCA). We are looking for candidates who have a caring and compassionate personality with strong clinical and interpersonal skills.",
      "The role involves shift work and working weekends.",
      "Your salary will be negotiable and will depend on your level of experience and qualifications. There are currently both full and part time vacancies available.",
      "Previous work experience in the care sector is not essential. We welcome applicants from all backgrounds but are particularly keen to hear from applicants who have experience caring for young or old family members with care needs.",
    ],
  },
];

export type Job = (typeof jobs)[number];
