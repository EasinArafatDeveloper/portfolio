// Portfolio content — edit this file to update the site.
// Items marked TODO are placeholders to be confirmed/replaced.

export const profile = {
  name: "Easin Arafat",
  shortName: "Easin",
  title: "Full-Stack Developer",
  tagline: "I build fast, beautiful web products — from Chrome extensions to e-commerce brands.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  status: "Available for freelance & full-time",
  nowBuilding: "FB Ad Lead Finder",
  about:
    "I'm a full-stack developer who loves turning ideas into polished, production-ready products. I work across the stack — React & Next.js on the front, Node.js & MongoDB on the back — and I care deeply about details: motion, performance and the feeling a product gives you.", // TODO: personalise
  email: "hello@example.com", // TODO: real contact email
  socials: {
    github: "https://github.com/Easin2023",
    linkedin: "https://linkedin.com/in/", // TODO
    facebook: "https://facebook.com/", // TODO
  },
};

export const stats = [
  { label: "Years coding", value: 3, suffix: "+" }, // TODO
  { label: "Projects shipped", value: 20, suffix: "+" }, // TODO
  { label: "Happy clients", value: 10, suffix: "+" }, // TODO
  { label: "Brands launched", value: 2, suffix: "" },
];

export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  tech: string[];
  gradient: string; // CSS gradient for the card art
  emoji: string;
  live?: string;
  code?: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: "fb-ad-lead-finder",
    name: "FB Ad Lead Finder",
    category: "SaaS · Chrome Extension",
    summary: "Find high-intent leads from Facebook ads, automatically.",
    description:
      "A Chrome extension worker that scans Facebook Ad Library results and extracts advertiser leads, paired with a Node.js + MongoDB web dashboard to filter, organise and export them.",
    tech: ["Chrome Extension", "Node.js", "MongoDB", "Express", "JavaScript"],
    gradient: "linear-gradient(135deg,#1877f2 0%,#6a5cff 55%,#b04dff 100%)",
    emoji: "🎯",
    highlights: ["Background extension worker", "Lead dashboard with filters", "CSV export"],
  },
  {
    id: "smspro",
    name: "SMSPro",
    category: "SaaS · Messaging",
    summary: "Bulk SMS platform for businesses.",
    description:
      "A messaging platform that lets businesses send and manage SMS campaigns at scale, with contact management and delivery tracking.", // TODO: confirm details
    tech: ["Next.js", "Node.js", "MongoDB"], // TODO
    gradient: "linear-gradient(135deg,#00c46a 0%,#00a3ff 100%)",
    emoji: "💬",
    highlights: ["Campaign management", "Delivery reports", "Contact groups"], // TODO
  },
  {
    id: "dcccorner",
    name: "DCC Corner",
    category: "E-commerce · Brand",
    summary: "An online store built and run end-to-end.",
    description:
      "dcccorner.com — an e-commerce brand I built from the ground up: storefront, product catalogue, checkout and operations.", // TODO
    tech: ["E-commerce", "Next.js", "Marketing"], // TODO
    gradient: "linear-gradient(135deg,#ff7a18 0%,#ff3d77 100%)",
    emoji: "🛍️",
    live: "https://dcccorner.com",
    highlights: ["Full storefront", "Order management", "Brand & marketing"],
  },
  {
    id: "havitall",
    name: "Havitall",
    category: "E-commerce · Brand",
    summary: "Lifestyle shop with a clean, fast storefront.",
    description:
      "havitall.shop — a lifestyle e-commerce brand focused on a smooth shopping experience on mobile.", // TODO
    tech: ["E-commerce", "Next.js"], // TODO
    gradient: "linear-gradient(135deg,#f7c948 0%,#ff8a3d 100%)",
    emoji: "🌿",
    live: "https://havitall.shop",
    highlights: ["Mobile-first storefront", "Product catalogue", "Checkout flow"],
  },
  {
    id: "food-sharing",
    name: "Food Sharing",
    category: "Web App · Community",
    summary: "Share surplus food with people nearby.",
    description:
      "A full-stack community app where users can post extra food, request available items and manage their shares — reducing food waste locally.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
    gradient: "linear-gradient(135deg,#34d399 0%,#059669 100%)",
    emoji: "🍱",
    highlights: ["Auth & private routes", "Request / manage food", "Responsive UI"],
  },
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  points: string[];
  color: string;
};

export const experience: Experience[] = [
  {
    role: "Founder & Developer", // TODO
    org: "ScaleUp Web",
    period: "2024 — Present",
    points: ["Building SaaS tools and client websites", "Leading product, design and engineering"],
    color: "#0a84ff",
  },
  {
    role: "E-commerce Founder",
    org: "DCC Corner & Havitall",
    period: "2024 — Present", // TODO
    points: ["Launched and operate two online brands", "Owned storefront, ops and growth"],
    color: "#ff9f0a",
  },
  {
    role: "Web Development Program",
    org: "Phitron — Batch 9",
    period: "2023", // TODO
    points: ["Full-stack JavaScript, React, Node & MongoDB", "Built multiple production-style projects"],
    color: "#30d158",
  },
];

export const achievements = [
  { app: "Phitron", title: "Completed Web Development Program", body: "Batch 9 — full-stack JavaScript track.", time: "2023", icon: "🎓" }, // TODO
  { app: "Business", title: "Launched 2 e-commerce brands", body: "dcccorner.com & havitall.shop are live.", time: "2024", icon: "🚀" },
  { app: "Product", title: "Shipped FB Ad Lead Finder", body: "Extension + dashboard, now in use.", time: "2025", icon: "🎯" },
  { app: "Clients", title: "10+ client projects delivered", body: "Websites & tools for businesses.", time: "Ongoing", icon: "🤝" }, // TODO
];

export type Skill = { name: string; level: number; color: string };

export const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 90, color: "#61dafb" },
      { name: "Next.js", level: 88, color: "#a1a1aa" },
      { name: "Tailwind", level: 92, color: "#38bdf8" },
      { name: "TypeScript", level: 78, color: "#3178c6" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 85, color: "#6cc24a" },
      { name: "Express", level: 85, color: "#f5f5f5" },
      { name: "MongoDB", level: 82, color: "#47a248" },
      { name: "Firebase", level: 75, color: "#ffca28" },
    ],
  },
];

export const tools = ["Git", "GitHub", "Figma", "VS Code", "Vercel", "Chrome APIs", "Postman", "Framer Motion"];
