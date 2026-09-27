"use client";

import { useId } from "react";

/**
 * iOS 26-style lock screen time: tall condensed numerals rendered as liquid glass.
 * Pure SVG — translucent fill, specular bevel, bright inner rim and an outer-only shadow.
 */
export function GlassClock({ time, label }: { time: string; label: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fill = `gf${uid}`;
  const glass = `gg${uid}`;

  return (
    <svg
      role="img"
      aria-label={label}
      className="block h-[clamp(170px,34vw,300px)] w-full overflow-visible"
      style={{
        fontFamily: "var(--font-clock), var(--font-display), system-ui, sans-serif",
        // Narrowest width, tallest figures, thin-ish weight
        fontVariationSettings: "'wdth' 25, 'YTFI' 788, 'opsz' 144, 'wght' 380",
        fontSize: "clamp(190px, 40vw, 340px)",
      }}
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--clock-fill-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--clock-fill-bottom)" }} />
        </linearGradient>

        <filter id={glass} x="-10%" y="-15%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          {/* 1. Specular bevel: light the blurred alpha as a height map */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="height" />
          <feSpecularLighting in="height" surfaceScale="7" specularConstant="1.15" specularExponent="26" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="235" elevation="52" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />

          {/* 2. Bright inner rim along the glyph edge */}
          <feMorphology in="SourceAlpha" operator="erode" radius="1.6" result="eroded" />
          <feComposite in="SourceAlpha" in2="eroded" operator="out" result="edge" />
          <feFlood floodColor="#ffffff" floodOpacity="0.9" />
          <feComposite in2="edge" operator="in" result="rim" />

          {/* 3. Soft shadow, kept outside the glyph so the glass stays clean */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="sb" />
          <feOffset in="sb" dy="8" result="so" />
          <feFlood style={{ floodColor: "var(--clock-shadow)" }} />
          <feComposite in2="so" operator="in" result="sc" />
          <feComposite in="sc" in2="SourceAlpha" operator="out" result="shadow" />

          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specIn" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={`url(#${fill})`}
        filter={`url(#${glass})`}
        style={{ fontFeatureSettings: "'tnum'", letterSpacing: "-0.01em" }}
        suppressHydrationWarning
      >
        {time}
      </text>
    </svg>
  );
}
