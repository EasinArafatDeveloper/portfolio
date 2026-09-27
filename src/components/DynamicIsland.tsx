"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUp, BellOff, Hammer, Link2, Lock, LockOpen, Moon, ScanFace, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { dismiss, notify, useIslandActivity, type ShownActivity } from "@/lib/island";
import { useApp } from "./Providers";

const ids = sections.map((s) => s.id);
const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

/* ───────────── Small building blocks ───────────── */

function Ring({ progress, color, size = 26, stroke = 3, children }: { progress: number; color: string; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - progress) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {children && <span className="absolute inset-0 grid place-items-center">{children}</span>}
    </span>
  );
}

function AnimatedCheck({ size = 56, color = "#30d158" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <motion.circle cx="26" cy="26" r="23" stroke={color} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 }} />
      <motion.path
        d="M15 27l7 7 15-16"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.35 }}
      />
    </svg>
  );
}

function AirDropIcon() {
  return (
    <span className="relative grid size-11 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2 border-[#0a84ff]"
          style={{ width: 14 + i * 12, height: 14 + i * 12, borderBottomColor: "transparent" }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
        />
      ))}
      <span className="size-2 rounded-full bg-[#0a84ff]" />
    </span>
  );
}

/** Island body shapes. Radius = half the height for pills. */
function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      className={`flex h-9 items-center justify-between gap-5 px-2 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Wide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      className="flex h-[68px] w-[min(88vw,360px)] items-center gap-3 px-3"
    >
      {children}
    </motion.div>
  );
}

/* ───────────── Activities ───────────── */

function UnlockActivity() {
  // lock → Face ID scan → success → unlocked
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ts = [700, 1900, 2750].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, []);

  const body =
    step === 1 || step === 2 ? (
      <motion.div
        key="faceid"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative grid size-[116px] place-items-center"
      >
        {step === 1 ? (
          <>
            <ScanFace className="size-14 text-white/85" strokeWidth={1.4} />
            <motion.span
              className="absolute inset-x-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#30d158] to-transparent"
              animate={{ top: ["22%", "78%", "22%"] }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
          </>
        ) : (
          <AnimatedCheck />
        )}
      </motion.div>
    ) : (
    <Pill key={step === 0 ? "locked" : "unlocked"} className="w-[190px]">
      <motion.span initial={{ rotate: step === 3 ? -20 : 0 }} animate={{ rotate: 0 }} className="grid size-6 place-items-center">
        {step === 0 ? <Lock className="size-4" strokeWidth={2.5} /> : <LockOpen className="size-4" strokeWidth={2.5} />}
      </motion.span>
      <span className="text-[12.5px] font-semibold text-white/70">{step === 0 ? "Locked" : "Welcome"}</span>
      <span className="size-6" />
    </Pill>
    );

  return <AnimatePresence mode="popLayout">{body}</AnimatePresence>;
}

function ThemeActivity({ dark }: { dark: boolean }) {
  return (
    <Pill className="w-[210px]">
      <motion.span
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        className={`flex h-7 items-center gap-1 rounded-full px-3 ${dark ? "bg-[#ff453a]" : "bg-white/15"}`}
      >
        {dark ? <Moon className="size-4" fill="currentColor" /> : <Sun className="size-4" />}
        {dark && <BellOff className="size-3.5 opacity-80" />}
      </motion.span>
      <span className={`pr-2 text-[14px] font-semibold ${dark ? "text-[#ff9f0a]" : "text-white"}`}>{dark ? "Dark" : "Light"}</span>
    </Pill>
  );
}

function AirDropActivity({ title, subtitle }: { title: string; subtitle: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <Wide>
      <AirDropIcon />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{done ? "Delivered" : title}</span>
        <span className="block truncate text-[12.5px] text-white/55">{subtitle}</span>
      </span>
      {done ? <AnimatedCheck size={34} color="#0a84ff" /> : <Ring progress={1} color="#0a84ff" size={34} />}
    </Wide>
  );
}

function BuildingActivity({ name }: { name: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(100, v + 4);
      setN(v);
      if (v === 100) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, []);
  return (
    <Wide>
      <span className="grid size-11 place-items-center rounded-full bg-white/10">
        <Hammer className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-medium text-white/55">Now building</span>
        <span className="block truncate text-[15px] font-semibold">{name}</span>
      </span>
      <Ring progress={1} color="#30d158" size={40} stroke={3.5}>
        <span className="text-[11px] font-bold tabular-nums">{n}</span>
      </Ring>
    </Wide>
  );
}

function AvailableActivity() {
  return (
    <Pill className="w-[220px]">
      <span className="grid size-6 place-items-center rounded-full bg-[#30d158]/20 text-[#30d158]">
        <Link2 className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-[13px] font-semibold text-[#30d158]">Available for hire</span>
      <span className="size-2" />
    </Pill>
  );
}

function FindMyActivity() {
  return (
    <Wide>
      <span className="relative grid size-11 place-items-center">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute size-11 rounded-full bg-[#30d158]/40"
            animate={{ scale: [0.3, 1.3], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.8 }}
          />
        ))}
        <span className="relative size-4 rounded-full border-[3px] border-white bg-[#30d158]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">Find {profile.shortName}&apos;s work</span>
        <span className="block text-[12.5px] text-white/55">Tap to locate projects</span>
      </span>
    </Wide>
  );
}

function RecordingActivity({ label, startedAt }: { label: string; startedAt: number }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - startedAt) / 1000));
  return (
    <Pill className="w-[250px]">
      <span className="flex items-center gap-2">
        <motion.span className="size-2.5 rounded-full bg-[#ff453a]" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <span className="max-w-[140px] truncate text-[12.5px] font-semibold">{label}</span>
      </span>
      <span className="pr-1.5 text-[13px] font-semibold text-[#ff453a] tabular-nums">
        {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
      </span>
    </Pill>
  );
}

function ActivityView({ a }: { a: ShownActivity }) {
  switch (a.kind) {
    case "unlock":
      return <UnlockActivity />;
    case "theme":
      return <ThemeActivity dark={a.dark} />;
    case "airdrop":
      return <AirDropActivity title={a.title} subtitle={a.subtitle} />;
    case "building":
      return <BuildingActivity name={a.name} />;
    case "available":
      return <AvailableActivity />;
    case "findMy":
      return <FindMyActivity />;
    case "recording":
      return <RecordingActivity label={a.label} startedAt={a.startedAt} />;
  }
}

/* ───────────── Island ───────────── */

export function DynamicIsland() {
  const active = useActiveSection(ids);
  const activity = useIslandActivity();
  const [open, setOpen] = useState(false);
  const { scrollTo, setSpotlight } = useApp();
  const current = sections.find((s) => s.id === active) ?? sections[0];
  const Icon = current.icon;
  const { scrollYProgress } = useScroll();
  const ringOffset = useTransform(scrollYProgress, [0, 1], [2 * Math.PI * 12, 0]);

  // Intro: Face ID unlock
  useEffect(() => {
    const t = setTimeout(() => notify({ kind: "unlock" }), 350);
    return () => clearTimeout(t);
  }, []);

  // First visit to a section triggers its activity
  const seen = useRef(new Set<string>());
  useEffect(() => {
    if (seen.current.has(active)) return;
    seen.current.add(active);
    if (active === "projects") notify({ kind: "building", name: profile.nowBuilding });
    if (active === "contact") notify({ kind: "available" });
  }, [active]);

  // "Find My" nudge if the visitor lingers on the hero without scrolling
  const nudged = useRef(false);
  useEffect(() => {
    if (active !== "lock" || nudged.current) return;
    let t = setTimeout(fire, 12000);
    function fire() {
      nudged.current = true;
      notify({ kind: "findMy" });
    }
    const reset = () => {
      clearTimeout(t);
      if (!nudged.current) t = setTimeout(fire, 12000);
    };
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", reset);
    };
  }, [active]);

  const expanded = open && !activity;
  const tall = activity && (activity.kind === "unlock" ? false : ["airdrop", "building", "findMy"].includes(activity.kind));
  const radius = expanded ? 32 : tall ? 34 : 999;
  const showBubble = !expanded && (activity?.kind === "available" || (!activity && active !== "lock"));

  function onIslandClick() {
    if (activity) {
      if (activity.kind === "findMy") scrollTo("projects");
      if (activity.kind !== "recording") dismiss(activity.id);
      return;
    }
    setOpen((v) => !v);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <div className="flex items-start gap-2">
        <motion.nav
          layout
          aria-label="Primary"
          aria-live="polite"
          onHoverStart={() => setOpen(true)}
          onHoverEnd={() => setOpen(false)}
          onClick={onIslandClick}
          className="pointer-events-auto cursor-pointer overflow-hidden bg-black text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)]"
          style={{ borderRadius: activity?.kind === "unlock" ? 40 : radius }}
          transition={spring}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {activity ? (
              <motion.div key={`a-${activity.id}`} layout="position">
                <ActivityView a={activity} />
              </motion.div>
            ) : !expanded ? (
              <Pill key="compact" className="min-w-[180px]">
                <motion.span
                  key={current.id}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid size-6 place-items-center rounded-full"
                  style={{ background: current.color }}
                >
                  <Icon className="size-3.5" strokeWidth={2.5} />
                </motion.span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.label}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[13px] font-semibold tracking-tight"
                  >
                    {current.label}
                  </motion.span>
                </AnimatePresence>
                <span className="relative mr-1.5 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#30d158] opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#30d158]" />
                </span>
              </Pill>
            ) : (
              <motion.div
                key="expanded"
                layout="position"
                initial={{ opacity: 0, filter: "blur(8px)", scale: 0.96 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                className="w-[min(92vw,560px)] p-3"
              >
                <div className="mb-3 flex items-center gap-3 px-1">
                  <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-lg font-bold">
                    {profile.shortName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold">{profile.name}</p>
                    <p className="truncate text-[12px] text-white/55">Now building · {profile.nowBuilding}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpotlight(true);
                      setOpen(false);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-medium text-white/80 transition hover:bg-white/20"
                  >
                    <Search className="size-3.5" /> Search
                    <kbd className="ml-1 hidden text-white/40 sm:inline">⌘K</kbd>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                  {sections.map((s) => {
                    const SIcon = s.icon;
                    const isActive = s.id === active;
                    return (
                      <button
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollTo(s.id);
                          setOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl py-2 text-[10.5px] font-medium transition active:scale-95 ${
                          isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <span className="grid size-8 place-items-center rounded-[10px]" style={{ background: s.color }}>
                          <SIcon className="size-4" strokeWidth={2.2} />
                        </span>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Detached bubble — splits off the island like iOS dual activities */}
        <AnimatePresence>
          {showBubble && (
            <motion.button
              key={activity?.kind === "available" ? "hotspot" : "progress"}
              initial={{ opacity: 0, scale: 0.3, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.3, x: -30 }}
              transition={spring}
              onClick={() => (activity?.kind === "available" ? scrollTo("contact") : scrollTo("lock"))}
              aria-label={activity?.kind === "available" ? "Go to contact" : "Back to top"}
              className="pointer-events-auto grid size-9 place-items-center rounded-full bg-black text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]"
            >
              {activity?.kind === "available" ? (
                <Link2 className="size-4 text-[#30d158]" strokeWidth={2.5} />
              ) : (
                <span className="relative grid size-7 place-items-center">
                  <svg width="28" height="28" className="absolute -rotate-90">
                    <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2.5" />
                    <motion.circle
                      cx="14"
                      cy="14"
                      r="12"
                      fill="none"
                      stroke="#0a84ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 12}
                      style={{ strokeDashoffset: ringOffset }}
                    />
                  </svg>
                  <ArrowUp className="size-3.5" strokeWidth={2.75} />
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
