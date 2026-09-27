import { Award, Briefcase, Home, LayoutGrid, MessageCircle, Sparkles, SlidersHorizontal } from "lucide-react";

export const sections = [
  { id: "lock", label: "Home", icon: Home, color: "#0a84ff" },
  { id: "apps", label: "About", icon: LayoutGrid, color: "#5e5ce6" },
  { id: "projects", label: "Projects", icon: Sparkles, color: "#ff375f" },
  { id: "experience", label: "Experience", icon: Briefcase, color: "#ff9f0a" },
  { id: "achievements", label: "Achievements", short: "Awards", icon: Award, color: "#ffd60a" },
  { id: "skills", label: "Skills", icon: SlidersHorizontal, color: "#30d158" },
  { id: "contact", label: "Contact", icon: MessageCircle, color: "#32d74b" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
