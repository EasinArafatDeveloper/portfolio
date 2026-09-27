"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/profile";
import { setLive } from "@/lib/island";
import { Reveal, Section, Tilt } from "./ui";
import { GithubIcon } from "./BrandIcons";

function CardArt({ p, big = false }: { p: Project; big?: boolean }) {
  return (
    <motion.div
      layoutId={`art-${p.id}`}
      className={`relative overflow-hidden ${big ? "h-[42vh] min-h-72" : "h-64 sm:h-72"}`}
      style={{ background: p.gradient }}
    >
      <div className="absolute -top-16 -left-10 size-64 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -right-10 -bottom-20 size-72 rounded-full bg-black/15 blur-3xl" />
      <motion.span
        layoutId={`emoji-${p.id}`}
        className="absolute right-6 bottom-4 text-[110px] leading-none drop-shadow-[0_20px_30px_rgba(0,0,0,.25)] sm:text-[130px]"
      >
        {p.emoji}
      </motion.span>
      <motion.div layoutId={`title-${p.id}`} className="absolute top-5 left-6 right-6 text-white">
        <p className="text-[12px] font-semibold tracking-[0.12em] text-white/75 uppercase">{p.category}</p>
        <p className="font-display mt-1 text-[32px] leading-[1.05] font-bold tracking-tight sm:text-[36px]">{p.name}</p>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ p, onOpen, i }: { p: Project; onOpen: () => void; i: number }) {
  return (
    <Reveal delay={i * 0.06}>
      <Tilt max={5}>
        <motion.button
          layoutId={`card-${p.id}`}
          onClick={onOpen}
          whileTap={{ scale: 0.97 }}
          className="glass squircle block w-full overflow-hidden text-left"
          style={{ borderRadius: 28 }}
        >
          <CardArt p={p} />
          <div className="flex items-center gap-3 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] text-xl" style={{ background: p.gradient }}>
              {p.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold">{p.name}</span>
              <span className="block truncate text-[13px] text-fg-2">{p.summary}</span>
            </span>
            <span className="rounded-full bg-fg/8 px-4 py-1.5 text-[13px] font-bold text-accent dark:bg-white/10">VIEW</span>
          </div>
        </motion.button>
      </Tilt>
    </Reveal>
  );
}

function ProjectSheet({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    setLive({ kind: "recording", label: p.name, startedAt: Date.now() });
    return () => {
      setLive(null);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose, p.name]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${p.id}`}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        className="glass glass-strong relative max-h-[92svh] w-full max-w-2xl overflow-hidden overflow-y-auto no-scrollbar"
        style={{ borderRadius: 32 }}
        data-lenis-prevent
      >
        <CardArt p={p} big />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur-xl transition hover:bg-black/45 active:scale-90"
        >
          <X className="size-4.5" strokeWidth={2.5} />
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="p-6 sm:p-8"
        >
          <p className="text-[17px] leading-relaxed text-fg-2">{p.description}</p>

          <h3 className="mt-8 mb-3 text-[13px] font-semibold tracking-[0.1em] text-fg-3 uppercase">Highlights</h3>
          <ul className="overflow-hidden rounded-2xl bg-fg/[0.04] dark:bg-white/[0.05]">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 border-b border-sep px-4 py-3 text-[15px] last:border-0">
                <span className="grid size-5 place-items-center rounded-full bg-[#30d158] text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 mb-3 text-[13px] font-semibold tracking-[0.1em] text-fg-3 uppercase">Built with</h3>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="rounded-full bg-fg/[0.06] px-3.5 py-1.5 text-[13px] font-medium dark:bg-white/10">
                {t}
              </span>
            ))}
          </div>

          {(p.live || p.code) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white active:scale-95"
                >
                  Visit live <ArrowUpRight className="size-4" />
                </a>
              )}
              {p.code && (
                <a
                  href={p.code}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold active:scale-95"
                >
                  <GithubIcon className="size-4" /> Source
                </a>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  return (
    <Section id="projects" eyebrow="Today · Featured work" title="Things I've built.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} onOpen={() => setOpen(p)} />
        ))}
      </div>
      <AnimatePresence>{open && <ProjectSheet key={open.id} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Section>
  );
}
