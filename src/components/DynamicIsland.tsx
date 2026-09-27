"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUp, BellOff, Hammer, Link2, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { useActiveSection } from "@/hooks/useActiveSection";
import { dismiss, notify, useIslandActivity, type ShownActivity } from "@/lib/island";
import { useApp } from "./Providers";
import { IOSAppIcon } from "./IOSAppIcon";

const ids = sections.map((s) => s.id);
const spring = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.9 };

// Microsoft Fluent 3D emoji (MIT) — close to the iOS 3D emoji look.
const EMOJI = {
  wave: "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Waving%20hand/Default/3D/waving_hand_3d_default.png",
  sparkles: "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sparkles/3D/sparkles_3d.png",
};

function Emoji3D({ src, alt, size, fallback }: { src: string; alt: string; size: number; fallback: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{fallback}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} draggable={false} onError={() => setFailed(true)} className="select-none" />;
}

function WavingHand({ size }: { size: number }) {
  return (
    <motion.span
      className="inline-grid"
      style={{ originX: 0.7, originY: 0.85 }}
      animate={{ rotate: [0, 16, -8, 16, -6, 12, 0] }}
      transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
    >
      <Emoji3D src={EMOJI.wave} alt="Waving hand" size={size} fallback="👋" />
    </motion.span>
  );
}

/* ───────────── Viewport width (for numeric island sizes) ───────────── */

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function useViewportWidth() {
  return useSyncExternalStore(subscribeResize, () => window.innerWidth, () => 1024);
}

/* ───────────── Small building blocks ───────────── */

function Ring({ progress, color, size = 26, stroke = 3, children }: { progress: number; color: string; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
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

function AnimatedCheck({ size = 34, color = "#30d158" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" className="shrink-0">
      <motion.circle cx="26" cy="26" r="23" stroke={color} strokeWidth="3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 }} />
      <motion.path
        d="M15 27l7 7 15-16"
        stroke={color}
        strokeWidth="4"
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
    <span className="relative grid size-11 shrink-0 place-items-center">
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

/* ───────────── Island views ───────────── */
// Every view declares its exact size; the island shell animates to it and the
// content is centred inside, so nothing drifts into a corner mid-transition.

type Size = { w: number; h: number; r: number };
type View = { key: string; size: Size; node: React.ReactNode };

const pill = (w: number, h = 36): Size => ({ w, h, r: h / 2 });

function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex h-full w-full items-center ${className}`}>{children}</div>;
}

function AirDropContent({ title, subtitle }: { title: string; subtitle: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <Row className="gap-3 px-3">
      <AirDropIcon />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-tight font-semibold">{done ? "Delivered" : title}</span>
        <span className="block truncate text-[12.5px] text-white/55">{subtitle}</span>
      </span>
      {done ? <AnimatedCheck color="#0a84ff" /> : <Ring progress={1} color="#0a84ff" size={34} />}
    </Row>
  );
}

function BuildingContent({ name }: { name: string }) {
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
    <Row className="gap-3 px-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10">
        <Hammer className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] leading-tight font-medium text-white/55">Now building</span>
        <span className="block truncate text-[15px] font-semibold">{name}</span>
      </span>
      <Ring progress={1} color="#30d158" size={40} stroke={3.5}>
        <span className="text-[11px] font-bold tabular-nums">{n}</span>
      </Ring>
    </Row>
  );
}

function RecordingContent({ label, startedAt }: { label: string; startedAt: number }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - startedAt) / 1000));
  return (
    <Row className="justify-between gap-3 px-3.5">
      <span className="flex min-w-0 items-center gap-2">
        <motion.span className="size-2.5 shrink-0 rounded-full bg-[#ff453a]" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <span className="truncate text-[12.5px] font-semibold">{label}</span>
      </span>
      <span className="text-[13px] font-semibold text-[#ff453a] tabular-nums">
        {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
      </span>
    </Row>
  );
}

function activityView(a: ShownActivity, welcomeStep: number, wideW: number): View {
  switch (a.kind) {
    case "welcome":
      if (welcomeStep === 0)
        return {
          key: "w0",
          size: pill(124),
          node: (
            <Row className="justify-center gap-2">
              <Emoji3D src={EMOJI.wave} alt="" size={22} fallback="👋" />
              <span className="text-[13px] font-semibold">Hi</span>
            </Row>
          ),
        };
      if (welcomeStep === 1)
        return {
          key: "w1",
          size: { w: 176, h: 176, r: 52 },
          node: (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2.5">
              <WavingHand size={88} />
              <span className="text-[16px] font-semibold tracking-tight">Hello there!</span>
            </div>
          ),
        };
      return {
        key: "w2",
        size: pill(Math.min(wideW, 300), 44),
        node: (
          <Row className="justify-center gap-2.5 px-4">
            <WavingHand size={26} />
            <span className="truncate text-[14px] font-semibold">Welcome to my portfolio</span>
            <Emoji3D src={EMOJI.sparkles} alt="" size={22} fallback="✨" />
          </Row>
        ),
      };

    case "theme":
      return {
        key: `theme-${a.dark}`,
        size: pill(200),
        node: (
          <Row className="justify-between px-1.5">
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className={`flex h-7 items-center gap-1 rounded-full px-3 ${a.dark ? "bg-[#ff453a]" : "bg-white/15"}`}
            >
              {a.dark ? <Moon className="size-4" fill="currentColor" /> : <Sun className="size-4" />}
              {a.dark && <BellOff className="size-3.5 opacity-80" />}
            </motion.span>
            <span className={`pr-2.5 text-[14px] font-semibold ${a.dark ? "text-[#ff9f0a]" : "text-white"}`}>{a.dark ? "Dark" : "Light"}</span>
          </Row>
        ),
      };

    case "airdrop":
      return { key: `airdrop-${a.id}`, size: { w: wideW, h: 68, r: 34 }, node: <AirDropContent title={a.title} subtitle={a.subtitle} /> };

    case "building":
      return { key: `building-${a.id}`, size: { w: wideW, h: 68, r: 34 }, node: <BuildingContent name={a.name} /> };

    case "available":
      return {
        key: "available",
        size: pill(210),
        node: (
          <Row className="justify-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-[#30d158]/20 text-[#30d158]">
              <Link2 className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-[13px] font-semibold text-[#30d158]">Available for hire</span>
          </Row>
        ),
      };

    case "findMy":
      return {
        key: "findMy",
        size: { w: wideW, h: 68, r: 34 },
        node: (
          <Row className="gap-3 px-3">
            <span className="relative grid size-11 shrink-0 place-items-center">
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
              <span className="block text-[15px] leading-tight font-semibold">Find {profile.shortName}&apos;s work</span>
              <span className="block text-[12.5px] text-white/55">Tap to locate projects</span>
            </span>
          </Row>
        ),
      };

    case "recording":
      return { key: `rec-${a.id}`, size: pill(250), node: <RecordingContent label={a.label} startedAt={a.startedAt} /> };
  }
}

/* ───────────── Island ───────────── */

export function DynamicIsland() {
  const active = useActiveSection(ids);
  const activity = useIslandActivity();
  const [open, setOpen] = useState(false);
  const { scrollTo, setSpotlight } = useApp();
  const vw = useViewportWidth();
  const { scrollYProgress } = useScroll();
  const ringOffset = useTransform(scrollYProgress, [0, 1], [2 * Math.PI * 12, 0]);

  const wideW = Math.min(vw - 32, 360);
  const menuW = Math.min(vw - 32, 560);

  // Welcome intro
  useEffect(() => {
    const t = setTimeout(() => notify({ kind: "welcome" }), 400);
    return () => clearTimeout(t);
  }, []);

  // Welcome stages: small "Hi" → big waving hand → welcome banner
  const [welcomeStep, setWelcomeStep] = useState(0);
  const welcomeId = activity?.kind === "welcome" ? activity.id : null;
  useEffect(() => {
    if (welcomeId === null) return;
    const ts = [0, 650, 2700].map((ms, i) => setTimeout(() => setWelcomeStep(i), ms));
    return () => ts.forEach(clearTimeout);
  }, [welcomeId]);

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

  // Measure the expanded menu so the shell can animate to its real height
  const [menuH, setMenuH] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const expanded = open && !activity;
  useEffect(() => {
    const el = menuRef.current;
    if (!expanded || !el) return;
    const ro = new ResizeObserver(([e]) => setMenuH(Math.ceil(e.borderBoxSize[0].blockSize)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  const current = sections.find((s) => s.id === active) ?? sections[0];

  let view: View;
  if (activity) {
    view = activityView(activity, welcomeStep, wideW);
  } else if (expanded) {
    view = {
      key: "menu",
      size: { w: menuW, h: menuH || (vw >= 640 ? 146 : 222), r: 32 },
      node: (
        <div ref={menuRef} className="w-full self-start p-3">
          <div className="mb-3 flex items-center gap-3 px-1">
            <Avatar size={40} />
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
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-medium text-white/80 transition hover:bg-white/20"
            >
              <Search className="size-3.5" /> Search
              <kbd className="ml-1 hidden text-white/40 sm:inline">⌘K</kbd>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {sections.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollTo(s.id);
                    setOpen(false);
                  }}
                  className={`group flex flex-col items-center gap-1.5 rounded-[18px] pt-2 pb-1.5 text-[11px] font-medium tracking-tight transition active:scale-90 ${
                    isActive ? "bg-white/[0.12] text-white" : "text-white/75 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <IOSAppIcon app={s.id} size={46} shadow={false} className="transition group-hover:-translate-y-0.5" />
                  <span className="max-w-full truncate px-0.5">{"short" in s ? s.short : s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    };
  } else {
    view = {
      key: "compact",
      size: pill(184),
      node: (
        <Row className="justify-between px-1.5">
          <motion.span key={current.id} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid">
            <IOSAppIcon app={current.id} size={24} shadow={false} />
          </motion.span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.label}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-[13px] font-semibold tracking-tight"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
          <span className="relative mr-2 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#30d158] opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-[#30d158]" />
          </span>
        </Row>
      ),
    };
  }

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
          aria-label="Primary"
          aria-live="polite"
          onHoverStart={() => !activity && setOpen(true)}
          onHoverEnd={() => setOpen(false)}
          onClick={onIslandClick}
          initial={false}
          animate={{ width: view.size.w, height: view.size.h, borderRadius: view.size.r }}
          transition={spring}
          className="pointer-events-auto relative cursor-pointer overflow-hidden bg-black text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={view.key}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.1, duration: 0.3 } }}
              exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.12 } }}
            >
              {/* Content is laid out at the view's final size so it never reflows while the shell morphs */}
              <div className="flex shrink-0" style={{ width: view.size.w, height: view.size.h }}>
                {view.node}
              </div>
            </motion.div>
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
