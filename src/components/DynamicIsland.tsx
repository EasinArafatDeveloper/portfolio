"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useState } from "react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useApp } from "./Providers";

const ids = sections.map((s) => s.id);

export function DynamicIsland() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const { scrollTo, setSpotlight } = useApp();
  const current = sections.find((s) => s.id === active) ?? sections[0];
  const Icon = current.icon;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <motion.nav
        layout
        aria-label="Primary"
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto overflow-hidden bg-black text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)]"
        style={{ borderRadius: open ? 30 : 999 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!open ? (
            <motion.div
              key="compact"
              layout="position"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              className="flex h-9 min-w-[180px] cursor-pointer items-center justify-between gap-6 px-2"
            >
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
            </motion.div>
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
    </div>
  );
}
