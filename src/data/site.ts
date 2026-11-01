/**
 * Central content for Charismatic Care. Everything here was carried over from
 * https://www.charismaticcare.net so it can be edited in one place.
 */

export const company = {
  name: "Charismatic Care",
  legalName: "Charismatic Care Ltd",
  tagline: "Compassionate Care, Empowering Lives.",
  url: "https://www.charismaticcare.net",
  phone: {
    display: "0208 152 4242",
    // The original site displays 0208 152 4242 but several of its links dial 0208 158 4242.
    // We use the displayed number everywhere — change it here if the other one is correct.
    href: "tel:+442081524242",
  },
  email: "contact@charismaticcare.net",
  address: {
    line1: "Unit A05, The Old Courthouse",
    line2: "Orsett Road",
    postcode: "RM17 5DD",
  },
  regions: ["London", "Lincolnshire", "Essex"],
  socials: {
    facebook: "https://www.facebook.com/Charismatic-Care-105852801917289",
    instagram: "https://www.instagram.com/officialcharismaticcare/",
    youtube: "https://www.youtube.com/channel/UCaYm2tP6TGVowo_FPPyrpMg",
    linkedin: "https://www.linkedin.com/company/63807978/",
  },
};

export type ServiceKey =
  | "supported-living"
  | "live-in-care"
  | "domiciliary-care"
  | "companionship"
  | "respite-care"
  | "travel-abroad";

export const services: {
  key: ServiceKey;
  title: string;
  href: string;
  tagline: string;
  summary: string;
  image: string;
}[] = [
  {
    key: "supported-living",
    title: "Supported Living",
    href: "/supported-living/",
    tagline: "Live independently with tailored, specialist support",
    summary:
      "Specialist care at home tailored to each individual's needs, promoting independence and well-being for people living with autism or learning disabilities.",
    image: "/images/blog/supported-living-for-people-with-a-learning-disability-is-it-the-right-choice.webp",
  },
  {
    key: "live-in-care",
    title: "Live-in Care",
    href: "/live-in-care/",
    tagline: "Round-the-clock care from a dedicated carer at home",
    summary:
      "Round-the-clock support from a dedicated carer who lives with you, offering personal care and companionship in the comfort of your own home.",
    image: "/images/services/liveincare-service-block.webp",
  },
  {
    key: "domiciliary-care",
    title: "Domiciliary Care",
    href: "/domiciliary-care/",
    tagline: "Flexible home visits to help with daily routines",
    summary:
      "Flexible, reliable support with daily tasks and routines from a few hours a week to multiple visits a day, all delivered in the comfort of your home.",
    image: "/images/blog/understanding-domiciliary-care-what-families-should-know.webp",
  },
  {
    key: "companionship",
    title: "Companionship",
    href: "/companionship/",
    tagline: "Friendly company, conversation and emotional support",
    summary:
      "Kind-hearted carers providing friendly company, conversation, and emotional support, perfect for those who may feel isolated or need a listening ear.",
    image: "/images/services/companionship-service-block.webp",
  },
  {
    key: "respite-care",
    title: "Respite Care",
    href: "/respite-care/",
    tagline: "A well-earned break for family carers",
    summary:
      "Short-term, high-quality care that gives family carers a well-earned break, while ensuring your loved one continues to receive the best support at home.",
    image: "/images/services/respite-care-block.jpg",
  },
  {
    key: "travel-abroad",
    title: "Travel Abroad",
    href: "/travel-abroad/",
    tagline: "Safe, assisted travel in the UK and abroad",
    summary:
      "Assisted travel for people with autism and learning disabilities — safe, comfortable journeys in the UK and abroad that create unforgettable memories.",
    image: "/images/services/travel-abroad-block.webp",
  },
];

export const navigation = {
  main: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/care-services/",
      children: [
        { label: "Care Services", href: "/care-services/", description: "Exceptional care in the comfort of your own home" },
        ...services.map((s) => ({ label: s.title, href: s.href, description: s.tagline })),
      ],
    },
    {
      label: "About",
      href: "/about-us/",
      children: [
        { label: "About Us", href: "/about-us/", description: "Compassionate specialist care that empowers lives" },
        { label: "Meet Our Founder", href: "/meet-our-founder/", description: "Gifty Agyemang, Founder & Registered Care Manager" },
        { label: "Careers", href: "/careers/", description: "Care for our clients, and we care for you" },
        { label: "Downloads", href: "/downloads/", description: "Policies and forms for our team" },
      ],
    },
    { label: "Blog", href: "/blog/" },
    { label: "Contact", href: "/contact/" },
  ],
  useful: [
    { label: "About Us", href: "/about-us/" },
    { label: "Meet Our Founder", href: "/meet-our-founder/" },
    { label: "Careers", href: "/careers/" },
    { label: "Blog", href: "/blog/" },
    { label: "Downloads", href: "/downloads/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy-policy/" },
  ],
};

export const specialisms = [
  {
    title: "Learning Disabilities",
    icon: "puzzle",
    text: "We support individuals to develop life skills, increase independence, access education and employment opportunities, build relationships, and participate fully within their communities.",
  },
  {
    title: "Autism Spectrum Conditions",
    icon: "infinity",
    text: "We provide structured, consistent, and person-centred support that respects individuality while promoting communication, social engagement, emotional wellbeing, and independence.",
  },
  {
    title: "Down Syndrome Support",
    icon: "sparkles",
    text: "We deliver tailored support that enables individuals to maximise their potential, build confidence, achieve personal goals, and enjoy greater independence.",
  },
  {
    title: "Complex Challenging Behaviour",
    icon: "shield",
    text: "Our highly trained staff use positive behaviour support approaches to understand behaviours, reduce distress, improve outcomes, and create safe, supportive environments that promote wellbeing and stability.",
  },
  {
    title: "Mental Health Support",
    icon: "brain",
    text: "We provide compassionate support for individuals experiencing mental health challenges through recovery-focused, strengths-based approaches that encourage resilience, confidence, and social inclusion.",
  },
] as const;

export const whyUs = [
  {
    title: "Expert and Trained Staff",
    text: "We carefully handpicked staff for their kind personalities and compassion to deliver high-quality care tailored to diverse needs.",
  },
  {
    title: "Extending Our Services",
    text: "We keep an eye on the feedback to extend our services to better serve our clients and address their evolving needs.",
  },
  {
    title: "Client-Centered Satisfaction",
    text: "Our team is dedicated to providing high-quality care that is built around the client's needs and well-being.",
  },
];

export const stats = [
  { value: 15, suffix: "+", label: "Years of care experience" },
  { value: 24, suffix: "/7", label: "Support, day and night" },
  { value: 3, suffix: "", label: "Regions: London, Lincolnshire & Essex" },
  { value: 20, suffix: "", label: "Towns & areas we cover" },
];

export const testimonials = [
  {
    quote:
      "Thank you for the support you have given Cassius, myself and my family since I first contacted you. The company has made such a difference to Cassius's life and I am so pleased you agreed to assess Cassius for care all those months ago.",
    name: "Hannah",
    role: "Family member",
  },
  {
    quote:
      "We are delighted with the care Cassius has in place, the team is part of our family and I can see they all clearly love Cassius also. You have a fabulous company built on great ethics and morals. We are so lucky to have found you.",
    name: "Hannah",
    role: "Client's Mum",
  },
  {
    quote:
      "Thank you for your and your team's great support to AK. It is so encouraging to hear such a positive feedback from people involved.",
    name: "Jan",
    role: "Family member",
  },
  {
    quote:
      "We want to thank you for all that you do for Karin and how you have accommodated our ever-changing circumstances, with our Mum's continued deterioration.",
    name: "Shelley & Dean",
    role: "Family members",
  },
];

export const faqs = [
  {
    q: "What is Supported Living?",
    a: "Supported Living enables individuals to have their own home and tenancy while receiving personalised care and support. At Charismatic Care, our goal is to help people live as independently as possible while having the right support available when they need it.",
  },
  {
    q: "Who does Charismatic Care support?",
    a: "We provide specialist support for adults with Learning Disabilities, Autism Spectrum Conditions, Down Syndrome, Mental Health Needs, Complex Behavioural Needs, Dual Diagnoses, and Communication or Sensory Needs.",
  },
  {
    q: "How much support can Charismatic Care provide?",
    a: "Support is tailored to each individual and can range from four hours continuous to 24-hour support. We assess each person's needs, preferences, abilities, and goals to determine the appropriate level of support.",
  },
  {
    q: "What can you help individuals with?",
    a: "Our team can support individuals with maintaining their home, daily living skills, budgeting and finances, attending appointments, accessing education or employment, developing relationships, participating in community activities, and maintaining their physical and emotional wellbeing.",
  },
  {
    q: "How do you promote independence and personal choice?",
    a: "Our person-centred approach places each individual at the heart of their care. We work alongside them to build confidence, develop practical and social skills, and achieve personal goals while always respecting their choices, dignity, preferences, and aspirations.",
  },
];

export const areas = [
  {
    region: "Lincolnshire",
    towns: ["Boston", "Spalding", "Billinghay", "Wyberton", "Kirton", "Spilsby", "Surfleet", "Old Leake", "Langrick", "Sleaford", "Donnington", "Sibsey"],
  },
  { region: "London", towns: ["Thurrock", "Upminster", "Hornchurch", "Havering"] },
  { region: "Essex", towns: ["West Essex", "Central Essex", "South Essex", "North Essex"] },
];

export const accreditations = [
  { src: "/images/badges/cqc-good.jpg", alt: "CQC rated Good", width: 83, height: 62 },
  { src: "/images/badges/rating.jpg", alt: "Rated 8.0 on carehome.co.uk", width: 209, height: 62 },
  { src: "/images/badges/UKHCA.png", alt: "UKHCA member", width: 67, height: 80 },
  { src: "/images/badges/home-care-association.png", alt: "Homecare Association member", width: 96, height: 61 },
  { src: "/images/badges/member.png", alt: "Registered with the Information Commissioner's Office", width: 104, height: 61 },
  { src: "/images/badges/cqc-2.jpg", alt: "Care Quality Commission rated Good", width: 200, height: 50 },
];

export const gallery: { src: string; width: number; height: number }[] = [
  { src: "/images/gallery/gallery23.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery26.webp", width: 1600, height: 1200 },
  { src: "/images/gallery/gallery25.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery27.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery30.webp", width: 1600, height: 1200 },
  { src: "/images/gallery/gallery31.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery29.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery21.webp", width: 900, height: 1600 },
  { src: "/images/gallery/gallery28.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery20.webp", width: 900, height: 1600 },
  { src: "/images/gallery/gallery22.webp", width: 900, height: 1600 },
  { src: "/images/gallery/gallery24.webp", width: 1200, height: 1600 },
  { src: "/images/gallery/gallery8.webp", width: 750, height: 1000 },
  { src: "/images/gallery/gallery-2-scaled.webp", width: 2560, height: 1920 },
  { src: "/images/gallery/gallery9.webp", width: 750, height: 1000 },
  { src: "/images/gallery/gallery10.webp", width: 750, height: 1000 },
  { src: "/images/gallery/gallery-1-scaled.webp", width: 2560, height: 1920 },
];

export const enquiryTypes = ["Supported Living Enquiry", "Home Care Enquiry", "Live-In Care Enquiry", "Job Enquiry", "Something Else"];
export const heardAboutOptions = ["Google", "Facebook", "Word of mouth", "Referral", "Family / friend"];
