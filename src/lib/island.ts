"use client";

import { useSyncExternalStore } from "react";

/**
 * Dynamic Island "live activities".
 * Transient activities queue up and auto-dismiss; a single `live` activity
 * (e.g. recording) stays until cleared and shows whenever the queue is empty.
 */
export type Activity =
  | { kind: "welcome" }
  | { kind: "theme"; dark: boolean }
  | { kind: "airdrop"; title: string; subtitle: string }
  | { kind: "building"; name: string }
  | { kind: "available" }
  | { kind: "findMy" }
  | { kind: "recording"; label: string; startedAt: number };

export type ShownActivity = Activity & { id: number };

const DURATION: Record<Activity["kind"], number> = {
  welcome: 4200,
  theme: 1700,
  airdrop: 3200,
  building: 3200,
  available: 2800,
  findMy: 6000,
  recording: Infinity,
};

let uid = 0;
let queue: ShownActivity[] = [];
let live: ShownActivity | null = null;
let current: ShownActivity | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  const next = queue[0] ?? live;
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

function scheduleHead() {
  clearTimeout(timer);
  const head = queue[0];
  if (head) timer = setTimeout(() => dismiss(head.id), DURATION[head.kind]);
}

/** Show a transient activity. Same-kind activities replace each other instead of stacking. */
export function notify(a: Activity) {
  const item = { ...a, id: ++uid } as ShownActivity;
  const sameIdx = queue.findIndex((q) => q.kind === a.kind);
  if (sameIdx === 0) {
    queue = [item, ...queue.slice(1)];
    scheduleHead();
  } else if (sameIdx > 0) {
    queue = queue.map((q, i) => (i === sameIdx ? item : q));
  } else {
    queue = [...queue, item];
    if (queue.length === 1) scheduleHead();
  }
  emit();
}

export function dismiss(id: number) {
  if (live?.id === id) live = null;
  const wasHead = queue[0]?.id === id;
  queue = queue.filter((q) => q.id !== id);
  if (wasHead) scheduleHead();
  emit();
}

export function setLive(a: Activity | null) {
  live = a ? ({ ...a, id: ++uid } as ShownActivity) : null;
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useIslandActivity() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
