"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronUp } from "lucide-react";
import { useRef, useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { GlassClock } from "./GlassClock";
import { useApp } from "./Providers";
import { Magnetic } from "./ui";

function subscribeClock(cb: () => void) {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
}

function useClock(tz: string) {
  const ms = useSyncExternalStore(subscribeClock, () => Math.floor(Date.now() / 1000) * 1000, () => 0);
  if (!ms) return { time: "", date: "" };
  const now = new Date(ms);
  return {
    time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now),
    date: new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: tz }).format(now),
  };
}

const notifications = [
  { app: "Status", icon: "🟢", title: profile.status, body: "Let's build something great together.", time: "now" },
  { app: "Workspace", icon: "🛠️", title: `Now building ${profile.nowBuilding}`, body: "Chrome extension + Node/Mongo dashboard", time: "2m ago" },
];

export function LockScreen() {
  const { time, date } = useClock(profile.timezone);
  const { scrollTo } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Stay crisp while the visitor reads the hero; only fade once it's mostly scrolled away.
  const scale = useTransform(scrollYProgress, [0.45, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const blur = useTransform(scrollYProgress, (p) => (p < 0.5 ? "none" : `blur(${((p - 0.5) * 24).toFixed(1)}px)`));
  const y = useTransform(scrollYProgress, [0.45, 1], [0, -60]);

  return (
    <section id="lock" ref={ref} className="relative">
      <motion.div
        style={{ scale, opacity, filter: blur, y }}
        className="mx-auto flex min-h-[100svh] w-full max-w-6xl origin-top flex-col px-5 pt-24 pb-8 sm:px-8 lg:pt-16"
      >
        {/* Mobile: clock → intro → notifications. Desktop: intro on the left, lock-screen clock + notifications on the right. */}
        <div className="flex flex-1 flex-col items-center gap-y-8 lg:grid lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-16 lg:gap-y-5">
          <div className="flex w-full flex-col items-center lg:col-start-2 lg:row-start-1 lg:self-end">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 text-[17px] font-semibold text-fg-2"
              suppressHydrationWarning
            >
              {date || " "}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 20 }}
              className="-my-2 w-full max-w-[520px]"
            >
              <GlassClock time={time || "00:00"} label={`Local time in Dhaka: ${time}`} />
            </motion.div>

          </div>

          <div className="flex flex-col items-center text-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:items-start lg:self-center lg:text-left">
            {/* Name widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="glass flex items-center gap-3 rounded-full py-2 pr-5 pl-2"
            >
              <Avatar size={36} priority />
              <span className="text-[15px] font-semibold tracking-tight">{profile.name}</span>
              <span className="h-4 w-px bg-fg/15" />
              <span className="text-[13.5px] font-medium text-fg-2">{profile.title}</span>
              <span className="relative ml-0.5 flex size-2" title={profile.status}>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#30d158] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#30d158]" />
              </span>
            </motion.div>

            {/* Headline — what I do, at a glance */}
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.7, type: "spring", stiffness: 110, damping: 20 }}
              className="font-display text-balance mt-6 max-w-2xl text-[clamp(30px,4.6vw,64px)] leading-[1.03] font-bold tracking-[-0.035em]"
            >
              <span
                className="px-[0.04em]"
                style={{
                  background: "linear-gradient(100deg, #0a84ff 0%, #5e5ce6 45%, #bf5af2 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {profile.headline.lead}
              </span>{" "}
              {profile.headline.rest}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-balance mt-4 max-w-xl text-[clamp(16px,1.6vw,19px)] leading-relaxed text-fg-2 lg:text-pretty"
            >
              {profile.tagline}
            </motion.p>

            {/* Focus areas */}
            <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Focus areas">
              {profile.focus.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.05 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                  className="glass rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                >
                  {f}
                </motion.li>
              ))}
            </ul>

            {/* Calls to action */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <Magnetic>
                <button
                  onClick={() => scrollTo("projects")}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-[0_10px_28px_-10px_var(--accent)] transition active:scale-95"
                >
                  View my work <ArrowRight className="size-4" />
                </button>
              </Magnetic>
              <Magnetic>
                <button onClick={() => scrollTo("contact")} className="drop rounded-full px-6 py-3 text-[15px] font-semibold active:scale-95">
                  Let&apos;s talk
                </button>
              </Magnetic>
            </motion.div>

          </div>

          <div className="w-full max-w-md lg:col-start-2 lg:row-start-2 lg:self-start lg:justify-self-center">
            {/* Notification stack */}
            <div className="flex w-full flex-col gap-2.5">
              {notifications.map((n, i) => (
                <motion.button
                  key={n.title}
                  onClick={() => scrollTo(i === 1 ? "projects" : "contact")}
                  initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 1.45 + i * 0.3, type: "spring", stiffness: 260, damping: 24 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass glass-refract flex w-full items-start gap-3 rounded-[22px] p-3.5 text-left"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/60 text-lg dark:bg-white/10">{n.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold">{n.title}</span>
                      <span className="shrink-0 text-[12px] text-fg-3">{n.time}</span>
                    </span>
                    <span className="block truncate text-[13.5px] text-fg-2">{n.body}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe up */}
        <motion.button
          onClick={() => scrollTo("apps")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="mt-auto flex flex-col items-center gap-2 pt-10 text-[13px] font-medium text-fg-2"
        >
          <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronUp className="size-5" />
          </motion.span>
          Swipe up to explore
          <span className="mt-1 h-[5px] w-32 rounded-full bg-fg/80" />
        </motion.button>
      </motion.div>
    </section>
  );
}
