"use client";

import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { profile, stats } from "@/data/profile";
import { sections } from "@/data/sections";
import { useApp } from "./Providers";
import { Avatar } from "./Avatar";
import { CountUp, Magnetic, Reveal, Section, Tilt } from "./ui";
import { IOSAppIcon, type AppId } from "./IOSAppIcon";

const socialApps: { label: string; href: string; app: AppId }[] = [
  { label: "GitHub", href: profile.socials.github, app: "github" },
  { label: "LinkedIn", href: profile.socials.linkedin, app: "linkedin" },
  { label: "Facebook", href: profile.socials.facebook, app: "facebook" },
];

function AppIcon({
  label,
  app,
  onClick,
  href,
  i,
}: {
  label: string;
  app: AppId;
  onClick?: () => void;
  href?: string;
  i: number;
}) {
  const inner = (
    <>
      <motion.span whileHover={{ y: -4, scale: 1.06 }} whileTap={{ scale: 0.88 }} className="grid size-[62px] rounded-[14px] sm:size-[70px]">
        <IOSAppIcon app={app} size={70} className="size-full" />
      </motion.span>
      <span className="text-[12px] font-medium tracking-tight text-fg">{label}</span>
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
  // "build" is left out so the grid stays a tidy 4×2 with the socials.
  const appSections = sections.filter((s) => s.id !== "lock" && s.id !== "apps" && s.id !== "build");

  return (
    <Section id="apps" eyebrow="About me" title={<>Hello, I&apos;m {profile.shortName}.</>}>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {/* Large About widget */}
        <Reveal className="col-span-2 row-span-2">
          <Tilt className="h-full" max={4}>
            <div className="glass glass-refract squircle flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar size={80} className="max-sm:!size-16" />
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
              return <AppIcon key={s.id} i={i} label={s.label} app={s.id} onClick={() => scrollTo(s.id)} />;
            })}
            {socialApps.map((a, i) => (
              <AppIcon key={a.label} i={appSections.length + i} label={a.label} app={a.app} href={a.href} />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
