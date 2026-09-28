"use client";

import { useId } from "react";

export type AppId = "lock" | "apps" | "build" | "projects" | "experience" | "achievements" | "skills" | "contact" | "github" | "linkedin" | "facebook";

type Ids = { glyph: string; accent: string; uid: string };
type Def = {
  /** Background gradient, top-left → bottom-right */
  bg: [string, string];
  /** Glyph gradient bottom colour (top is white) — gives the soft 3D look */
  tint: string;
  /** Optional accent gradient (e.g. the blue person on About) */
  accent?: [string, string];
  light?: boolean;
  glyph: (ids: Ids) => React.ReactNode;
};

function starPoints(cx: number, cy: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

const APPS: Record<AppId, Def> = {
  // Home — blue, white house with chimney
  lock: {
    bg: ["#35b0ff", "#0a52ff"],
    tint: "#cfe4ff",
    glyph: ({ glyph }) => (
      <g fill={`url(#${glyph})`} stroke={`url(#${glyph})`} strokeWidth="3" strokeLinejoin="round">
        <rect x="64" y="24" width="9" height="18" rx="2" />
        <path d="M50 20 L17.5 48.5 C16 50 17 52.5 19 52.5 H26 V77 C26 78.7 27.3 80 29 80 H42 V63 C42 61.9 42.9 61 44 61 H56 C57.1 61 58 61.9 58 63 V80 H71 C72.7 80 74 78.7 74 77 V52.5 H81 C83 52.5 84 50 82.5 48.5 Z" />
      </g>
    ),
  },

  // About — white, blue person
  apps: {
    bg: ["#ffffff", "#dde5f5"],
    tint: "#ffffff",
    accent: ["#3d9bff", "#0a58ff"],
    light: true,
    glyph: ({ accent }) => (
      <g fill={`url(#${accent})`}>
        <circle cx="50" cy="35" r="15.5" />
        <path d="M23 75 C23 60 35 54 50 54 C65 54 77 60 77 75 C77 77.5 75.5 79 73 79 H27 C24.5 79 23 77.5 23 75 Z" />
      </g>
    ),
  },

  // Process — indigo, code brackets
  build: {
    bg: ["#9a7bff", "#3d2bb0"],
    tint: "#ddd3ff",
    glyph: ({ glyph }) => (
      <g fill="none" stroke={`url(#${glyph})`} strokeLinecap="round" strokeLinejoin="round">
        <path d="M37 33 L21 50 L37 67" strokeWidth="7.5" />
        <path d="M63 33 L79 50 L63 67" strokeWidth="7.5" />
        <path d="M55 27 L45 73" strokeWidth="6.5" />
      </g>
    ),
  },

  // Projects — dark, stacked colourful folders
  projects: {
    bg: ["#3a3a44", "#0b0b10"],
    tint: "#ffffff",
    glyph: ({ uid }) => (
      <>
        <defs>
          <linearGradient id={`fb${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff6a8a" />
            <stop offset="1" stopColor="#d62ad8" />
          </linearGradient>
          <linearGradient id={`fm${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd84a" />
            <stop offset="1" stopColor="#ff7a2a" />
          </linearGradient>
          <linearGradient id={`ff${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22dcff" />
            <stop offset="1" stopColor="#1a5cff" />
          </linearGradient>
        </defs>
        <rect x="30" y="31" width="50" height="40" rx="7" fill={`url(#fb${uid})`} />
        <path d="M22 30 C22 26.7 24.7 24 28 24 H39 C41 24 42.6 25 43.6 26.7 L45.5 30 H70 C73.3 30 76 32.7 76 36 V66 H22 Z" fill={`url(#fm${uid})`} />
        <rect x="20" y="37" width="54" height="37" rx="7" fill={`url(#ff${uid})`} />
        <rect x="20" y="37" width="54" height="10" rx="7" fill="#fff" opacity="0.14" />
      </>
    ),
  },

  // Skills — green, three rising bars
  skills: {
    bg: ["#68e884", "#0bb055"],
    tint: "#c6f3d6",
    glyph: ({ glyph }) => (
      <g fill={`url(#${glyph})`}>
        <rect x="23" y="56" width="15" height="23" rx="5.5" />
        <rect x="42.5" y="41" width="15" height="38" rx="5.5" />
        <rect x="62" y="22" width="15" height="57" rx="5.5" />
      </g>
    ),
  },

  // Experience — purple, briefcase
  experience: {
    bg: ["#bf66ff", "#5528ff"],
    tint: "#dcd3ff",
    glyph: ({ glyph }) => (
      <>
        <path d="M39 37 V30.5 C39 27.5 41.5 25 44.5 25 H55.5 C58.5 25 61 27.5 61 30.5 V37" fill="none" stroke={`url(#${glyph})`} strokeWidth="5.5" />
        <rect x="19" y="35" width="62" height="43" rx="9" fill={`url(#${glyph})`} />
        <path d="M19.5 50 Q50 60 80.5 50" fill="none" stroke="#5a2dff" strokeOpacity="0.28" strokeWidth="2.5" />
        <rect x="44" y="49" width="12" height="10" rx="2.5" fill={`url(#${glyph})`} stroke="#5a2dff" strokeOpacity="0.35" strokeWidth="2" />
      </>
    ),
  },

  // Achievements — violet, trophy with gold star
  achievements: {
    bg: ["#c866ff", "#4a2bff"],
    tint: "#ddd6ff",
    glyph: ({ glyph }) => (
      <>
        <g fill="none" stroke={`url(#${glyph})`} strokeWidth="5" strokeLinecap="round">
          <path d="M33 30 H26 C23.8 30 22.5 31.5 22.5 33.5 C22.5 41.5 27.5 46.5 35 47.5" />
          <path d="M67 30 H74 C76.2 30 77.5 31.5 77.5 33.5 C77.5 41.5 72.5 46.5 65 47.5" />
        </g>
        <g fill={`url(#${glyph})`}>
          <rect x="30" y="20" width="40" height="7" rx="2.5" />
          <path d="M32 25 H68 V40 C68 51 60 59.5 50 59.5 C40 59.5 32 51 32 40 Z" />
          <rect x="45.5" y="58" width="9" height="11" />
          <rect x="35" y="67.5" width="30" height="9.5" rx="3" />
        </g>
        <polygon points={starPoints(50, 39.5, 10.5, 4.6)} fill="#ffc414" stroke="#ff9d00" strokeWidth="1" strokeLinejoin="round" />
      </>
    ),
  },

  // Contact — orange→red, envelope
  contact: {
    bg: ["#ff9a3c", "#ff1d4d"],
    tint: "#ffdfe6",
    glyph: ({ glyph }) => (
      <>
        <rect x="19" y="28" width="62" height="45" rx="8" fill={`url(#${glyph})`} />
        <path d="M22 33 L50 54.5 L78 33" fill="none" stroke="#ff2d55" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },

  github: {
    bg: ["#454c56", "#0d1117"],
    tint: "#d9dee5",
    glyph: ({ glyph }) => (
      <path
        transform="translate(21 21) scale(2.42)"
        fill={`url(#${glyph})`}
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    ),
  },
  linkedin: {
    bg: ["#2b9bff", "#0a5fc2"],
    tint: "#cfe4ff",
    glyph: ({ glyph }) => (
      <g fill={`url(#${glyph})`}>
        <circle cx="32" cy="30" r="7" />
        <rect x="26" y="42" width="12" height="34" rx="2.5" />
        <path d="M45 42 H56 V47 C58.5 43 62.5 41 67.5 41 C76 41 79 46.5 79 55 V76 H67 V57 C67 52.5 65.5 50 61.5 50 C57.5 50 56.5 53 56.5 57 V76 H45 Z" />
      </g>
    ),
  },
  facebook: {
    bg: ["#2bb8ff", "#0161e0"],
    tint: "#cfe4ff",
    glyph: ({ glyph }) => (
      <path
        transform="translate(20 20) scale(2.5)"
        fill={`url(#${glyph})`}
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    ),
  },
};

/** iOS-style app icon: rounded square, vivid gradient, soft 3D glyph, glossy top edge. */
export function IOSAppIcon({ app, size, className = "", shadow = true }: { app: AppId; size: number; className?: string; shadow?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const def = APPS[app];
  const ids = { clip: `c${uid}`, bg: `b${uid}`, gloss: `g${uid}`, glyph: `y${uid}`, accent: `a${uid}`, soft: `s${uid}` };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={`shrink-0 ${className}`}
      style={shadow ? { filter: "drop-shadow(0 6px 14px rgba(0,0,0,.25)) drop-shadow(0 1px 2px rgba(0,0,0,.12))" } : undefined}
    >
      <defs>
        <clipPath id={ids.clip}>
          <rect width="100" height="100" rx="23" />
        </clipPath>
        <linearGradient id={ids.bg} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={def.bg[0]} />
          <stop offset="1" stopColor={def.bg[1]} />
        </linearGradient>
        <linearGradient id={ids.gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={def.light ? 0.6 : 0.3} />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.glyph} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={def.tint} />
        </linearGradient>
        {def.accent && (
          <linearGradient id={ids.accent} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={def.accent[0]} />
            <stop offset="1" stopColor={def.accent[1]} />
          </linearGradient>
        )}
        {/* Soft shadow under the glyph for depth */}
        <filter id={ids.soft} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000" floodOpacity={def.light ? 0.16 : 0.28} />
        </filter>
      </defs>
      <g clipPath={`url(#${ids.clip})`}>
        <rect width="100" height="100" fill={`url(#${ids.bg})`} />
        <rect width="100" height="100" fill={`url(#${ids.gloss})`} />
        <g filter={`url(#${ids.soft})`}>{def.glyph({ glyph: ids.glyph, accent: ids.accent, uid })}</g>
      </g>
      <rect x="0.5" y="0.5" width="99" height="99" rx="22.5" fill="none" stroke={def.light ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.18)"} />
    </svg>
  );
}
