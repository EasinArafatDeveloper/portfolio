"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { achievements } from "@/data/profile";
import { Section } from "./ui";

/** iOS notification stack: collapsed pile that fans out on tap. */
export function Achievements() {
  const [expanded, setExpanded] = useState(false);
  const items = achievements;

  return (
    <Section id="achievements" eyebrow="Notification Center" title="Wins & milestones.">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between px-1">
          <p className="text-[20px] font-bold tracking-tight">
            Achievements <span className="text-fg-3">· {items.length}</span>
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="glass flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold active:scale-95"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Show all"}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="size-4" />
            </motion.span>
          </button>
        </div>

        <motion.div
          layout
          className="relative cursor-pointer"
          onClick={() => !expanded && setExpanded(true)}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map((a, i) => {
            const hidden = !expanded && i > 2;
            return (
              <AnimatePresence key={a.title} initial={false}>
                {!hidden && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: expanded ? 1 : 1 - i * 0.25,
                      scale: expanded ? 1 : 1 - i * 0.05,
                      y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, delay: expanded ? i * 0.04 : 0 }}
                    className={`glass glass-strong flex items-start gap-3 rounded-[24px] p-4 ${
                      expanded ? "relative mb-3" : i === 0 ? "relative z-30" : "absolute inset-x-0 top-0"
                    }`}
                    style={
                      expanded
                        ? undefined
                        : { zIndex: 30 - i, top: i * 12 }
                    }
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] text-xl shadow-sm">
                      {a.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-[12px] font-semibold tracking-wide text-fg-3 uppercase">{a.app}</span>
                        <span className="text-[12px] text-fg-3">{a.time}</span>
                      </span>
                      <span className="mt-0.5 block text-[15.5px] font-semibold">{a.title}</span>
                      <span className="block text-[14px] text-fg-2">{a.body}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
          {!expanded && <div style={{ height: 24 }} />}
        </motion.div>
      </div>
    </Section>
  );
}
