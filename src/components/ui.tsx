"use client";

import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Section wrapper with an iOS large-title header that reveals on scroll. */
export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 ${className}`}>
      <Reveal>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="section-title mb-10 text-[clamp(40px,7vw,76px)] sm:mb-14">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 36,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 22, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up once it scrolls into view. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

/** 3D tilt that follows the pointer, with spring return. */
export function Tilt({ children, className = "", max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Button that is gently pulled toward the cursor. */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.div
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
