"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { experience } from "@/data/profile";
import { Reveal, Section } from "./ui";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <Section id="experience" eyebrow="Journey" title="Where I've been.">
      <div ref={ref} className="relative mx-auto max-w-3xl">
        {/* Progress rail */}
        <div className="absolute top-2 bottom-2 left-[19px] w-[3px] rounded-full bg-fg/10 sm:left-[23px]" />
        <motion.div
          style={{ scaleY }}
          className="absolute top-2 bottom-2 left-[19px] w-[3px] origin-top rounded-full bg-gradient-to-b from-[#0a84ff] via-[#bf5af2] to-[#30d158] sm:left-[23px]"
        />

        <div className="flex flex-col gap-6">
          {experience.map((e, i) => (
            <Reveal key={e.org + e.role} delay={i * 0.05}>
              <div className="relative flex gap-5 sm:gap-7">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-40% 0px" }}
                  className="relative z-10 mt-6 grid size-10 shrink-0 place-items-center rounded-full border-4 border-[var(--bg)] sm:size-12"
                  style={{ background: e.color, boxShadow: `0 0 0 6px color-mix(in oklab, ${e.color} 25%, transparent)` }}
                >
                  <span className="size-2 rounded-full bg-white" />
                </motion.span>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass squircle flex-1 p-5 sm:p-7"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-[22px] font-bold tracking-tight sm:text-[24px]">{e.role}</h3>
                    <span className="rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: `color-mix(in oklab, ${e.color} 18%, transparent)`, color: e.color }}>
                      {e.period}
                    </span>
                  </div>
                  <p className="mt-1 text-[16px] font-medium text-fg-2">{e.org}</p>
                  <ul className="mt-4 space-y-2">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[15px] text-fg-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: e.color }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
