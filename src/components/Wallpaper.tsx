"use client";

import { motion } from "motion/react";

const blobs = [
  { c: "var(--blob-1)", size: "55vmax", x: ["-10%", "15%", "-5%"], y: ["-15%", "5%", "-10%"], d: 26, left: "-10%", top: "-15%" },
  { c: "var(--blob-2)", size: "45vmax", x: ["10%", "-10%", "5%"], y: ["0%", "15%", "-5%"], d: 30, left: "55%", top: "-5%" },
  { c: "var(--blob-3)", size: "50vmax", x: ["0%", "12%", "-8%"], y: ["10%", "-10%", "5%"], d: 34, left: "-5%", top: "45%" },
  { c: "var(--blob-4)", size: "38vmax", x: ["-5%", "-18%", "4%"], y: ["-5%", "8%", "-12%"], d: 22, left: "60%", top: "55%" },
];

/** Animated iOS-style mesh wallpaper + the SVG filter used for liquid refraction. */
export function Wallpaper() {
  return (
    <>
      <div aria-hidden className="wallpaper">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="blob"
            style={{ background: b.c, width: b.size, height: b.size, left: b.left, top: b.top }}
            animate={{ x: b.x, y: b.y, scale: [1, 1.12, 1] }}
            transition={{ duration: b.d, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        ))}
        <div className="grain" />
      </div>

      {/* Displacement map that bends whatever sits behind .glass-refract */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id="liquid-refraction" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="55" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}
