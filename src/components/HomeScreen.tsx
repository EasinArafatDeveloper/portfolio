"use client";

import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { profile, stats } from "@/data/profile";
import { sections } from "@/data/sections";
import { useApp } from "./Providers";
import { CountUp, Magnetic, Reveal, Section, Tilt } from "./ui";
import { FacebookIcon, GithubIcon, LinkedinIcon } from "./BrandIcons";

const socialApps = [
  { label: "GitHub", href: profile.socials.github, Icon: GithubIcon, bg: "linear-gradient(145deg,#3a3a3c,#0b0b0f)" },
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: LinkedinIcon, bg: "linear-gradient(145deg,#2a8cff,#0a66c2)" },
  { label: "Facebook", href: profile.socials.facebook, Icon: FacebookIcon, bg: "linear-gradient(145deg,#4b9bff,#1877f2)" },
];

function AppIcon({
  label,
  bg,
  children,
  onClick,
  href,
  i,
}: {
  label: string;
  bg: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  i: number;
}) {
  const inner = (
    <>
      <motion.span
        whileHover={{ y: -4, scale: 1.06 }}
        whileTap={{ scale: 0.88 }}
        className="relative grid size-[62px] place-items-center rounded-[18px] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,.35)] sm:size-[70px] sm:rounded-[20px]"
        style={{ background: bg }}
      >
        {/* glossy top highlight */}
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 via-white/0 to-transparent" />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/25 ring-inset" />
        {children}
      </motion.span>
      <span className="text-[12px] font-medium text-fg">{label}</span>
    </>
  );
  const cls = "flex flex-col items-center gap-1.5 outline-none focus-visible:[&>span:first-child]:ring-4 focus-visible:[&>span:first-child]:ring-accent/50";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.05 }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <button onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export function HomeScreen() {
  const { scrollTo } = useApp();
  const appSections = sections.filter((s) => s.id !== "lock" && s.id !== "apps");

  return (
    <Section id="apps" eyebrow="About me" title={<>Hello, I&apos;m {profile.shortName}.</>}>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {/* Large About widget */}
        <Reveal className="col-span-2 row-span-2">
          <Tilt className="h-full" max={4}>
            <div className="glass glass-refract squircle flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] text-2xl font-bold text-white sm:size-20 sm:text-3xl">
                    {profile.shortName[0]}
                  </div>
                  <span className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-[3px] border-white bg-[#30d158] dark:border-black" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">{profile.name}</p>
                  <p className="text-fg-2">{profile.title}</p>
                </div>
              </div>
              <p className="mt-6 text-[17px] leading-relaxed text-fg-2">{profile.about}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Magnetic>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_var(--accent)] transition active:scale-95"
                  >
                    Let&apos;s talk
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    onClick={() => scrollTo("projects")}
                    className="glass flex items-center gap-1.5 rounded-full px-6 py-3 text-[15px] font-semibold transition active:scale-95"
                  >
                    See my work <ArrowUpRight className="size-4" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </Tilt>
        </Reveal>

        {/* Stat widgets */}
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={0.08 * i}>
            <Tilt max={10}>
              <div className="glass squircle flex aspect-square flex-col justify-between p-5">
                <Sparkles className="size-5 text-accent" />
                <div>
                  <p className="font-display text-[clamp(40px,6vw,56px)] leading-none font-bold tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-[14px] font-medium text-fg-2">{s.label}</p>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}

        {/* Location widget */}
        <Reveal className="col-span-2">
          <div className="squircle relative flex h-full min-h-40 items-end overflow-hidden bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] p-6 text-white shadow-[var(--glass-shadow)]">
            <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/20 blur-2xl" />
            <div className="relative">
              <p className="flex items-center gap-1.5 text-[15px] font-semibold">
                <MapPin className="size-4" /> {profile.location}
              </p>
              <p className="mt-1 text-white/80">Working with clients worldwide · GMT+6</p>
            </div>
          </div>
        </Reveal>

        {/* App icon grid */}
        <Reveal className="col-span-2">
          <div className="glass squircle grid h-full grid-cols-4 place-items-center gap-y-5 p-5">
            {appSections.map((s, i) => {
              const Icon = s.icon;
              return (
                <AppIcon
                  key={s.id}
                  i={i}
                  label={s.label}
                  bg={`linear-gradient(145deg, color-mix(in oklab, ${s.color} 75%, white), ${s.color})`}
                  onClick={() => scrollTo(s.id)}
                >
                  <Icon className="size-7" strokeWidth={2} />
                </AppIcon>
              );
            })}
            {socialApps.map((a, i) => (
              <AppIcon key={a.label} i={appSections.length + i} label={a.label} bg={a.bg} href={a.href}>
                <a.Icon className="size-7" />
              </AppIcon>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
