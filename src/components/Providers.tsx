"use client";

import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { notify } from "@/lib/island";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme, origin?: { x: number; y: number }) => void;
  tint: boolean;
  setTint: (v: boolean) => void;
  spotlight: boolean;
  setSpotlight: (v: boolean) => void;
  scrollTo: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function subscribeHtml(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-tint"] });
  return () => mo.disconnect();
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Theme lives on <html data-theme / data-tint> (set before paint); React subscribes to it.
  const theme = useSyncExternalStore(subscribeHtml, () => (document.documentElement.dataset.theme as Theme) ?? "light", () => "light" as Theme);
  const tint = useSyncExternalStore(subscribeHtml, () => document.documentElement.dataset.tint === "true", () => false);
  const [spotlight, setSpotlight] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const el = document.documentElement;
    // Real SVG refraction only works in Chromium's backdrop-filter.
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (brands?.some((b) => b.brand === "Chromium")) el.classList.add("liquid");
  }, []);

  const setTheme = useCallback((t: Theme, origin?: { x: number; y: number }) => {
    const el = document.documentElement;
    const apply = () => {
      el.dataset.theme = t;
    };
    // New theme grows as a circle from the control that was used (instant switch where unsupported).
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const vt = doc.startViewTransition(apply);
      const { x, y } = origin ?? { x: innerWidth / 2, y: 0 };
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      vt.ready
        .then(() =>
          el.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 650, easing: "cubic-bezier(.22,.9,.26,1)", pseudoElement: "::view-transition-new(root)" },
          ),
        )
        .catch(() => {});
    } else apply();
    safeSet("theme", t);
    notify({ kind: "theme", dark: t === "dark" });
  }, []);

  const setTint = useCallback((v: boolean) => {
    document.documentElement.dataset.tint = String(v);
    safeSet("tint", String(v));
  }, []);

  // Smooth scrolling
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause smooth scroll while an overlay is open.
  useEffect(() => {
    if (spotlight) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [spotlight]);

  const scrollTo = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -20, duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Specular highlight: every .glass element tracks the pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".glass") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ⌘K / Ctrl+K opens Spotlight
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight((v) => !v);
      }
      if (e.key === "Escape") setSpotlight(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, tint, setTint, spotlight, setSpotlight, scrollTo }}>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 320, damping: 30 }}>
        {children}
      </MotionConfig>
    </AppContext.Provider>
  );
}
