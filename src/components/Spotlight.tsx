"use client";

import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, skillGroups, tools } from "@/data/profile";
import { sections } from "@/data/sections";
import { useApp } from "./Providers";
import { IOSAppIcon, type AppId } from "./IOSAppIcon";

type Item = { label: string; hint: string; target: string; icon: string; app?: AppId };

const index: Item[] = [
  ...sections.map((s) => ({ label: s.label, hint: "Section", target: s.id, icon: "", app: s.id })),
  ...projects.map((p) => ({ label: p.name, hint: p.category, target: "projects", icon: p.emoji })),
  ...skillGroups.flatMap((g) => g.skills.map((s) => ({ label: s.name, hint: `${g.title} skill`, target: "skills", icon: "⚡️" }))),
  ...tools.map((t) => ({ label: t, hint: "Tool", target: "skills", icon: "🧰" })),
];

export function Spotlight() {
  const { spotlight } = useApp();
  return <AnimatePresence>{spotlight && <SpotlightPanel />}</AnimatePresence>;
}

function SpotlightPanel() {
  const { setSpotlight, scrollTo } = useApp();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? index.filter((i) => i.label.toLowerCase().includes(s) || i.hint.toLowerCase().includes(s)) : index.slice(0, 7);
    return list.slice(0, 8);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const go = (i: Item) => {
    setSpotlight(false);
    setTimeout(() => scrollTo(i.target), 150);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-center px-4 pt-[14vh]">
      <motion.div
        className="absolute inset-0 bg-black/10 backdrop-blur-md dark:bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSpotlight(false)}
      />
      <div role="dialog" aria-label="Search" className="relative flex h-fit w-full max-w-xl flex-col gap-3">
        {/* Search pill + close drop */}
        <div className="flex items-center gap-3">
          <motion.label
            initial={{ opacity: 0, scale: 0.9, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="drop flex h-14 flex-1 items-center gap-3 rounded-full pr-4 pl-6"
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSel((s) => Math.min(s + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSel((s) => Math.max(s - 1, 0));
                } else if (e.key === "Enter" && results[sel]) go(results[sel]);
              }}
              placeholder="Search"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent text-[18px] outline-none placeholder:text-fg-3"
            />
            <Search className="size-6 shrink-0" strokeWidth={2.25} />
          </motion.label>
          <motion.button
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.06 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => setSpotlight(false)}
            aria-label="Close search"
            className="drop grid size-14 shrink-0 place-items-center rounded-full"
          >
            <X className="size-6" strokeWidth={2} />
          </motion.button>
        </div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.08 }}
          className="glass glass-strong overflow-hidden rounded-[26px]"
        >
          <ul className="no-scrollbar max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
            {results.length === 0 && <li className="px-4 py-6 text-center text-fg-3">No results for “{q}”</li>}
            {results.map((r, i) => (
              <li key={r.label + r.hint}>
                <button
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(r)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${i === sel ? "bg-accent text-white" : ""}`}
                >
                  {r.app ? (
                    <IOSAppIcon app={r.app} size={36} shadow={false} />
                  ) : (
                    <span className="grid size-9 place-items-center rounded-[10px] bg-fg/[0.06] text-lg dark:bg-white/10">{r.icon}</span>
                  )}
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">{r.label}</span>
                    <span className={`block text-[12.5px] ${i === sel ? "text-white/75" : "text-fg-3"}`}>{r.hint}</span>
                  </span>
                  {i === sel && <CornerDownLeft className="size-4 opacity-80" />}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/** Floating quick controls (useful on phones where ⌘K isn't available). */
export function QuickControls() {
  const { theme, setTheme, setSpotlight } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 2.4, type: "spring", stiffness: 300, damping: 20 }}
      className="drop fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-full px-2 py-1.5 sm:right-6 sm:bottom-6"
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => setSpotlight(true)}
        aria-label="Search"
        className="grid size-10 place-items-center rounded-full transition hover:bg-white/15"
      >
        <Search className="size-[19px]" strokeWidth={2.25} />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.8, rotate: 30 }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle dark mode"
        className="grid size-10 place-items-center rounded-full transition hover:bg-white/15"
      >
        {theme === "dark" ? <Sun className="size-[19px]" strokeWidth={2.25} /> : <Moon className="size-[19px]" strokeWidth={2.25} />}
      </motion.button>
    </motion.div>
  );
}
