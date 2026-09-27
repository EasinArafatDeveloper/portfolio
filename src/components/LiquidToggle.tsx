"use client";

import { animate, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const W = 64; // track
const H = 30;
const KW = 38; // knob
const KH = 26;
const PAD = 2;
const TRAVEL = W - KW - PAD * 2;
const slide = { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.9 };

/**
 * iOS 26 liquid-glass switch. At rest the knob is a solid white pill; while pressed
 * or dragged it swells into a clear refracting lens that stretches with speed.
 */
export function LiquidToggle({
  checked,
  onChange,
  label,
  onColor = "#34c759",
  icons = true,
}: {
  checked: boolean;
  onChange: (v: boolean, origin: { x: number; y: number }) => void;
  label: string;
  onColor?: string;
  icons?: boolean;
}) {
  // Optimistic state so the knob animates before the (heavier) theme change lands.
  const [pending, setPending] = useState<boolean | null>(null);
  const on = pending ?? checked;
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(checked ? TRAVEL : 0);
  const drag = useRef<{ startX: number; startKnob: number; moved: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // Follow external changes (e.g. the theme switched from elsewhere)
  useEffect(() => {
    if (!drag.current) animate(x, on ? TRAVEL : 0, slide);
  }, [on, x]);

  // Lens swell + speed stretch
  const velocity = useVelocity(x);
  const stretch = useTransform(velocity, [-900, 0, 900], [1.28, 1, 1.28], { clamp: true });
  const swellX = useSpring(1, { stiffness: 420, damping: 22 });
  const swellY = useSpring(1, { stiffness: 420, damping: 22 });
  const scaleX = useTransform(() => swellX.get() * stretch.get());
  const scaleY = useTransform(() => swellY.get() / Math.sqrt(stretch.get()));

  function press(v: boolean) {
    setPressed(v);
    swellX.set(v ? 1.45 : 1);
    swellY.set(v ? 1.4 : 1);
  }

  function commit(next: boolean) {
    animate(x, next ? TRAVEL : 0, slide);
    if (next === checked) return setPending(null);
    setPending(next);
    // Let the knob finish its glide before the page re-themes.
    const r = btn.current?.getBoundingClientRect();
    const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
    setTimeout(() => {
      onChange(next, origin);
      setPending(null);
    }, 320);
  }

  return (
    <button
      ref={btn}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="relative shrink-0 cursor-pointer touch-none rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
      style={{ width: W, height: H }}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        drag.current = { startX: e.clientX, startKnob: x.get(), moved: false };
        press(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.startX;
        if (Math.abs(dx) > 3) d.moved = true;
        if (d.moved) x.set(Math.min(TRAVEL, Math.max(0, d.startKnob + dx)));
      }}
      onPointerUp={() => {
        const d = drag.current;
        drag.current = null;
        commit(d?.moved ? x.get() > TRAVEL / 2 : !on);
        setTimeout(() => press(false), 180);
      }}
      onPointerCancel={() => {
        drag.current = null;
        press(false);
        animate(x, on ? TRAVEL : 0, slide);
      }}
      onKeyDown={(e) => {
        if (e.key !== " " && e.key !== "Enter") return;
        e.preventDefault();
        press(true);
        commit(!on);
        setTimeout(() => press(false), 260);
      }}
    >
      {/* Track */}
      <motion.span
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{ backgroundColor: on ? onColor : "rgba(120,120,128,0.28)" }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,.12)" }}
      />
      {icons && (
        <>
          <motion.span
            className="absolute top-1/2 left-[9px] -translate-y-1/2 text-white"
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.5 }}
          >
            <Moon className="size-3.5" fill="currentColor" />
          </motion.span>
          <motion.span
            className="absolute top-1/2 right-[9px] -translate-y-1/2 text-fg-2"
            initial={false}
            animate={{ opacity: on ? 0 : 1, scale: on ? 0.5 : 1 }}
          >
            <Sun className="size-3.5" strokeWidth={2.5} />
          </motion.span>
        </>
      )}

      {/* Knob: solid white at rest → clear liquid lens while pressed */}
      <motion.span
        className="absolute rounded-full"
        style={{
          top: (H - KH) / 2,
          left: PAD,
          width: KW,
          height: KH,
          x,
          scaleX,
          scaleY,
          WebkitBackdropFilter: "blur(0.5px) saturate(1.8) brightness(1.08)",
          backdropFilter: "blur(0.5px) saturate(1.8) brightness(1.08)",
        }}
        initial={false}
        animate={
          pressed
            ? {
                backgroundColor: "rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,.95), inset 0 -1px 1px rgba(255,255,255,.55), inset 3px 0 4px -2px rgba(70,170,255,.6), inset -3px 0 4px -2px rgba(255,80,170,.5), 0 6px 16px rgba(0,0,0,.18)",
              }
            : {
                backgroundColor: "rgba(255,255,255,1)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,1), inset 0 -1px 1px rgba(0,0,0,0), inset 0 0 0 0 rgba(70,170,255,0), inset 0 0 0 0 rgba(255,80,170,0), 0 3px 8px rgba(0,0,0,.16)",
              }
        }
        transition={{ duration: 0.22 }}
      />
    </button>
  );
}
