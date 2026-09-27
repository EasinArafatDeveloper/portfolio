"use client";

import { motion, useInView } from "motion/react";
import { Briefcase, Globe, Moon, Palette, Sun, Wifi, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { skillGroups, tools, type Skill } from "@/data/profile";
import { useApp } from "./Providers";
import { LiquidToggle } from "./LiquidToggle";
import { Reveal, Section } from "./ui";

function RoundToggle({
  on,
  onClick,
  color,
  label,
  children,
}: {
  on: boolean;
  onClick: () => void;
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2" aria-pressed={on} aria-label={label}>
      <motion.span
        whileTap={{ scale: 0.85 }}
        animate={{ backgroundColor: on ? color : "rgba(127,127,127,0.22)", color: on ? "#fff" : "var(--fg)" }}
        className="grid size-14 place-items-center rounded-full"
      >
        {children}
      </motion.span>
      <span className="text-[11.5px] font-medium text-fg-2">{label}</span>
    </button>
  );
}

function SkillSlider({ s, i }: { s: Skill; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex flex-col items-center gap-2.5">
      <div className="relative h-40 w-full max-w-[64px] overflow-hidden rounded-[22px] bg-fg/[0.12] sm:h-48 dark:bg-white/10">
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: inView ? `${s.level}%` : "0%" }}
          transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.1 + i * 0.08 }}
          className="absolute inset-x-0 bottom-0"
          style={{ background: `linear-gradient(to top, ${s.color}, color-mix(in oklab, ${s.color} 60%, white))` }}
        />
        <span className="absolute inset-x-0 top-3 text-center text-[13px] font-bold tabular-nums mix-blend-difference text-white">
          {s.level}
        </span>
      </div>
      <span className="text-[12.5px] font-semibold">{s.name}</span>
    </div>
  );
}

export function ControlCenter() {
  const { theme, setTheme, tint, setTint } = useApp();
  const [toggles, setToggles] = useState({ work: true, remote: true, freelance: true, fast: true });
  const flip = (k: keyof typeof toggles) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <Section id="skills" eyebrow="Control Center" title="Skills & tools.">
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {/* Availability toggles */}
        <Reveal>
          <div className="glass squircle grid aspect-square grid-cols-2 place-items-center p-4">
            <RoundToggle on={toggles.work} onClick={() => flip("work")} color="#30d158" label="Open to work">
              <Briefcase className="size-6" />
            </RoundToggle>
            <RoundToggle on={toggles.remote} onClick={() => flip("remote")} color="#0a84ff" label="Remote">
              <Wifi className="size-6" />
            </RoundToggle>
            <RoundToggle on={toggles.freelance} onClick={() => flip("freelance")} color="#ff9f0a" label="Freelance">
              <Globe className="size-6" />
            </RoundToggle>
            <RoundToggle on={toggles.fast} onClick={() => flip("fast")} color="#bf5af2" label="Fast delivery">
              <Zap className="size-6" />
            </RoundToggle>
          </div>
        </Reveal>

        {/* Appearance — actually controls the site */}
        <Reveal delay={0.05}>
          <div className="glass squircle flex aspect-square flex-col gap-3 p-4">
            <div className="flex flex-1 items-center gap-3 rounded-[20px] bg-fg/[0.06] pr-3 pl-3.5 dark:bg-white/10">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg text-[var(--bg)]">
                {theme === "dark" ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">Dark mode</span>
                <span className="block text-[12.5px] text-fg-2">{theme === "dark" ? "On" : "Off"}</span>
              </span>
              <LiquidToggle checked={theme === "dark"} onChange={(v, o) => setTheme(v ? "dark" : "light", o)} label="Dark mode" icons={false} />
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-[20px] bg-fg/[0.06] pr-3 pl-3.5 dark:bg-white/10">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full text-white transition-colors"
                style={{ background: tint ? "var(--accent)" : "rgba(127,127,127,.4)" }}
              >
                <Palette className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">Tinted glass</span>
                <span className="block text-[12.5px] text-fg-2">{tint ? "On" : "Off"}</span>
              </span>
              <LiquidToggle checked={tint} onChange={setTint} label="Tinted glass" onColor="#0a84ff" icons={false} />
            </div>
          </div>
        </Reveal>

        {/* Skill sliders */}
        {skillGroups.map((g, gi) => (
          <Reveal key={g.title} delay={0.1 + gi * 0.05} className="col-span-2">
            <div className="glass squircle h-full p-5">
              <p className="mb-4 text-[13px] font-semibold tracking-[0.1em] text-fg-3 uppercase">{g.title}</p>
              <div className="grid grid-cols-4 gap-3">
                {g.skills.map((s, i) => (
                  <SkillSlider key={s.name} s={s} i={i} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* Tools */}
        <Reveal delay={0.2} className="col-span-2 lg:col-span-2">
          <div className="glass squircle h-full p-5">
            <p className="mb-4 text-[13px] font-semibold tracking-[0.1em] text-fg-3 uppercase">Toolbox</p>
            <div className="flex flex-wrap gap-2">
              {tools.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="rounded-full bg-fg/[0.07] px-4 py-2 text-[14px] font-medium dark:bg-white/10"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
