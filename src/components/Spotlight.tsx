"use client";

import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Moon, Search, Sun } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, skillGroups, tools } from "@/data/profile";
import { sections } from "@/data/sections";
import { useApp } from "./Providers";

type Item = { label: string; hint: string; target: string; icon: string };

const index: Item[] = [
  ...sections.map((s) => ({ label: s.label, hint: "Section", target: s.id, icon: "📍" })),
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
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSpotlight(false)}
          />
          <motion.div
            role="dialog"
            aria-label="Search"
            initial={{ opacity: 0, scale: 0.94, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="glass glass-strong relative h-fit w-full max-w-xl overflow-hidden rounded-[26px]"
          >
            <div className="flex items-center gap-3 border-b border-sep px-5 py-4">
              <Search className="size-5 text-fg-3" />
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
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent text-[19px] outline-none placeholder:text-fg-3"
              />
              <kbd className="rounded-md bg-fg/10 px-1.5 py-0.5 text-[11px] font-semibold text-fg-2">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
              {results.length === 0 && <li className="px-4 py-6 text-center text-fg-3">No results for “{q}”</li>}
              {results.map((r, i) => (
                <li key={r.label + r.hint}>
                  <button
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                      i === sel ? "bg-accent text-white" : ""
                    }`}
                  >
                    <span className="grid size-9 place-items-center rounded-[10px] bg-fg/[0.06] text-lg dark:bg-white/10">{r.icon}</span>
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
  );
}

/** Floating quick controls (useful on phones where ⌘K isn't available). */
export function QuickControls() {
  const { theme, setTheme, setSpotlight } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4 }}
      className="glass fixed right-4 bottom-4 z-40 flex gap-1 rounded-full p-1.5 sm:right-6 sm:bottom-6"
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => setSpotlight(true)}
        aria-label="Search"
        className="grid size-10 place-items-center rounded-full transition hover:bg-fg/[0.08]"
      >
        <Search className="size-[18px]" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85, rotate: 30 }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle dark mode"
        className="grid size-10 place-items-center rounded-full transition hover:bg-fg/[0.08]"
      >
        {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </motion.button>
    </motion.div>
  );
}
