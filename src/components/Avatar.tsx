import Image from "next/image";
import { profile } from "@/data/profile";

/** Profile photo with an iOS-style gradient ring. `size` is in px. */
export function Avatar({ size, ring = true, priority = false, className = "" }: { size: number; ring?: boolean; priority?: boolean; className?: string }) {
  const pad = ring ? Math.max(2, Math.round(size / 28)) : 0;
  return (
    <span
      className={`relative inline-grid shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        padding: pad,
        background: ring ? "conic-gradient(from 210deg, #0a84ff, #5e5ce6, #bf5af2, #ff375f, #ff9f0a, #0a84ff)" : undefined,
      }}
    >
      <Image
        src={profile.avatar}
        alt={profile.name}
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="size-full rounded-full object-cover"
        style={{ boxShadow: ring ? "0 0 0 1.5px var(--bg)" : undefined }}
      />
    </span>
  );
}
