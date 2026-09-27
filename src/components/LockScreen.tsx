"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ChevronUp, MapPin } from "lucide-react";
import { useRef, useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { useApp } from "./Providers";

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
  { app: "Portfolio", icon: "👋", title: `Hi, I'm ${profile.name}`, body: profile.title, time: "now" },
  { app: "Status", icon: "🟢", title: profile.status, body: "Let's build something great together.", time: "now" },
  { app: "Workspace", icon: "🛠️", title: `Now building ${profile.nowBuilding}`, body: "Chrome extension + Node/Mongo dashboard", time: "2m ago" },
];

export function LockScreen() {
  const { time, date } = useClock(profile.timezone);
  const { scrollTo } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(14px)"]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="lock" ref={ref} className="relative h-[165svh]">
      <motion.div
        style={{ scale, opacity, filter: blur, y }}
        className="sticky top-0 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center px-5 pt-24 pb-10"
      >
        {/* Date + clock */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 text-[17px] font-semibold text-fg-2"
          suppressHydrationWarning
        >
          {date || " "}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 20 }}
          className="font-display text-[clamp(96px,22vw,188px)] leading-[0.9] font-bold tracking-[-0.06em] tabular-nums"
          style={{
            background: "linear-gradient(180deg, var(--fg) 30%, color-mix(in oklab, var(--fg) 55%, transparent))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
          aria-label="Local time in Dhaka"
          suppressHydrationWarning
        >
          {time || "00:00"}
        </motion.h1>

        {/* Name widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass mt-4 flex items-center gap-3 rounded-full py-2 pr-5 pl-2"
        >
          <Avatar size={36} priority />
          <span className="text-[15px] font-semibold tracking-tight">{profile.name}</span>
          <span className="flex items-center gap-1 text-[13px] text-fg-2">
            <MapPin className="size-3.5" /> {profile.location.split(",")[0]}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-balance mt-6 max-w-xl text-center text-[clamp(18px,2.4vw,22px)] leading-snug font-medium text-fg-2"
        >
          {profile.tagline}
        </motion.p>

        {/* Notification stack */}
        <div className="mt-10 flex w-full max-w-md flex-col gap-2.5">
          {notifications.map((n, i) => (
            <motion.button
              key={n.title}
              onClick={() => scrollTo(i === 2 ? "projects" : "apps")}
              initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 1 + i * 0.35, type: "spring", stiffness: 260, damping: 24 }}
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

        {/* Swipe up */}
        <motion.button
          onClick={() => scrollTo("apps")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
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
