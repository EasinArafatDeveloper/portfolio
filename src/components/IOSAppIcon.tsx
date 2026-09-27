"use client";

import { useId, useSyncExternalStore } from "react";

export type AppId = "lock" | "apps" | "projects" | "experience" | "achievements" | "skills" | "contact" | "github" | "linkedin" | "facebook";

/** Live calendar face, e.g. "SUN|27". Server renders a neutral placeholder. */
const noop = () => () => {};
function useCalendarFace() {
  return useSyncExternalStore(
    noop,
    () => {
      const d = new Date();
      return `${d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}|${d.getDate()}`;
    },
    () => "TODAY|1",
  );
}

type Def = { bg: [string, string]; glyph: (id: string) => React.ReactNode; light?: boolean };

const WHITE = "#fff";

function Calendar() {
  const [day, date] = useCalendarFace().split("|");
  return (
    <>
      <text x="50" y="31" textAnchor="middle" fontSize="15" fontWeight="600" fill="#ff3b30" fontFamily="system-ui,-apple-system,sans-serif" letterSpacing="0.5">
        {day}
      </text>
      <text x="50" y="77" textAnchor="middle" fontSize="50" fontWeight="300" fill="#1c1c1e" fontFamily="system-ui,-apple-system,sans-serif" letterSpacing="-2">
        {date}
      </text>
    </>
  );
}

function Gear() {
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x="47" y="13" width="6" height="10" rx="1.5" fill="#3a3a3c" transform={`rotate(${i * 15} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="30" fill="#3a3a3c" />
      <circle cx="50" cy="50" r="23" fill="#aeaeb2" />
      <circle cx="50" cy="50" r="19" fill="#3a3a3c" />
      {Array.from({ length: 3 }, (_, i) => (
        <rect key={i} x="48" y="31" width="4" height="38" rx="2" fill="#8e8e93" transform={`rotate(${i * 60} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="7" fill="#aeaeb2" />
      <circle cx="50" cy="50" r="3.5" fill="#3a3a3c" />
    </g>
  );
}

function Rings() {
  const rings = [
    { r: 31, c: "#fa114f", p: 0.78 },
    { r: 22, c: "#92e82a", p: 0.88 },
    { r: 13, c: "#1eeaef", p: 0.66 },
  ];
  return (
    <g transform="rotate(-90 50 50)" fill="none" strokeWidth="8" strokeLinecap="round">
      {rings.map(({ r, c, p }) => {
        const len = 2 * Math.PI * r;
        return (
          <g key={r}>
            <circle cx="50" cy="50" r={r} stroke={c} strokeOpacity="0.25" />
            <circle cx="50" cy="50" r={r} stroke={c} strokeDasharray={`${len * p} ${len}`} />
          </g>
        );
      })}
    </g>
  );
}

const APPS: Record<AppId, Def> = {
  lock: {
    bg: ["#ffcc4d", "#ff9500"],
    glyph: () => (
      <path d="M50 21 L18 47 H27 V77 H43 V60 H57 V77 H73 V47 H82 Z" fill={WHITE} stroke={WHITE} strokeWidth="4" strokeLinejoin="round" />
    ),
  },
  apps: {
    bg: ["#f5f5f7", "#d1d1d6"],
    light: true,
    glyph: () => (
      <>
        <circle cx="47" cy="39" r="14" fill="#8e8e93" />
        <path d="M21 80 C21 62 33 56 47 56 C61 56 73 62 73 80 Z" fill="#8e8e93" />
        <rect x="84" y="18" width="16" height="15" fill="#ff3b30" />
        <rect x="84" y="35" width="16" height="15" fill="#ff9500" />
        <rect x="84" y="52" width="16" height="15" fill="#34c759" />
        <rect x="84" y="69" width="16" height="15" fill="#007aff" />
      </>
    ),
  },
  projects: {
    bg: ["#1ec8ff", "#1a6cff"],
    glyph: () => (
      <g stroke={WHITE} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M56 22 L33 63" />
        <path d="M44 22 L70 69" />
        <path d="M24 59 H63" />
        <path d="M29 71 L31.5 67" />
        <path d="M68 59 H76" />
      </g>
    ),
  },
  experience: { bg: ["#ffffff", "#ffffff"], light: true, glyph: () => <Calendar /> },
  achievements: { bg: ["#1c1c1e", "#000000"], glyph: () => <Rings /> },
  skills: { bg: ["#e5e5ea", "#8e8e93"], light: true, glyph: () => <Gear /> },
  contact: {
    bg: ["#6cf57f", "#0bbd29"],
    glyph: () => (
      <>
        <ellipse cx="51" cy="47" rx="29" ry="23.5" fill={WHITE} />
        <path d="M30 60 Q29 72 19 77 Q35 77 42 67 Z" fill={WHITE} />
      </>
    ),
  },
  github: {
    bg: ["#3d444d", "#0d1117"],
    glyph: () => (
      <path
        transform="translate(21 21) scale(2.42)"
        fill={WHITE}
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    ),
  },
  linkedin: {
    bg: ["#1d8fff", "#0a66c2"],
    glyph: () => (
      <g fill={WHITE}>
        <circle cx="32" cy="30" r="7" />
        <rect x="26" y="42" width="12" height="34" rx="2" />
        <path d="M45 42 H56 V47 C58.5 43 62.5 41 67.5 41 C76 41 79 46.5 79 55 V76 H67 V57 C67 52.5 65.5 50 61.5 50 C57.5 50 56.5 53 56.5 57 V76 H45 Z" />
      </g>
    ),
  },
  facebook: {
    bg: ["#19b3ff", "#0165e1"],
    glyph: () => (
      <path
        transform="translate(20 20) scale(2.5)"
        fill={WHITE}
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    ),
  },
};

/** iOS-style app icon: continuous-corner square, gradient, glossy highlight, soft shadow. */
export function IOSAppIcon({ app, size, className = "", shadow = true }: { app: AppId; size: number; className?: string; shadow?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const def = APPS[app];
  const clip = `clip-${uid}`;
  const bg = `bg-${uid}`;
  const gloss = `gloss-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={`shrink-0 ${className}`}
      style={shadow ? { filter: "drop-shadow(0 4px 10px rgba(0,0,0,.22)) drop-shadow(0 1px 2px rgba(0,0,0,.12))" } : undefined}
    >
      <defs>
        {/* iOS icon corner ≈ 22.5% of the side */}
        <clipPath id={clip}>
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={def.bg[0]} />
          <stop offset="1" stopColor={def.bg[1]} />
        </linearGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={def.light ? 0.5 : 0.28} />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="100" height="100" fill={`url(#${bg})`} />
        {def.glyph(uid)}
        <rect width="100" height="100" fill={`url(#${gloss})`} />
      </g>
      <rect x="0.5" y="0.5" width="99" height="99" rx="22" fill="none" stroke={def.light ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.14)"} />
    </svg>
  );
}
