"use client";

import { useState } from "react";

// Microsoft Fluent 3D emoji (MIT) — close to the iOS 3D emoji look.
const BASE = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";
export const EMOJI = {
  wave: `${BASE}/Waving%20hand/Default/3D/waving_hand_3d_default.png`,
  sparkles: `${BASE}/Sparkles/3D/sparkles_3d.png`,
  robot: `${BASE}/Robot/3D/robot_3d.png`,
  rocket: `${BASE}/Rocket/3D/rocket_3d.png`,
  laptop: `${BASE}/Laptop/3D/laptop_3d.png`,
  bulb: `${BASE}/Light%20bulb/3D/light_bulb_3d.png`,
  gear: `${BASE}/Gear/3D/gear_3d.png`,
};

/** 3D emoji image that falls back to the native emoji if the image can't load. */
export function Emoji3D({ src, alt, size, fallback, className = "" }: { src: string; alt: string; size: number; fallback: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className={className} style={{ fontSize: size * 0.85, lineHeight: 1 }}>
        {fallback}
      </span>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={size} height={size} draggable={false} loading="lazy" onError={() => setFailed(true)} className={`select-none ${className}`} />
  );
}
