"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

// Single-stroke cursive "hello" (our own lettering), drawn like a pen.
const HELLO =
  "M28 152 C58 142 94 92 104 56 C111 31 99 16 87 26 C74 39 71 92 69 160 " +
  "C77 121 99 101 117 103 C134 105 134 126 131 146 C129 161 137 166 149 159 " +
  "C169 149 194 129 199 111 C203 97 189 93 179 101 C164 113 161 146 179 159 C195 169 219 159 237 141 " +
  "C259 116 279 71 281 46 C283 26 269 21 261 36 C251 56 244 121 251 151 C257 169 279 161 294 146 " +
  "C317 119 335 73 337 46 C339 26 325 21 317 36 C307 56 300 121 307 151 C313 169 335 163 349 149 " +
  "C359 131 371 105 391 103 C413 101 421 126 409 149 C397 169 371 167 369 147 C367 127 389 111 403 113 C419 115 431 109 446 101";

const DRAW = 2.6; // seconds
const KEY = "hello-intro-seen";

/** The pre-paint script sets <html data-intro="show"> for first-time visitors. */
const noop = () => () => {};
function useShouldShow() {
  return useSyncExternalStore(noop, () => document.documentElement.dataset.intro === "show", () => false);
}

export function HelloIntro() {
  const shouldShow = useShouldShow();
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const open = shouldShow && !done;

  const finish = useCallback(() => {
    // Drop the pre-paint cover so the site shows through while the overlay fades out.
    document.documentElement.dataset.intro = "leaving";
    setDone(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  }, []);

  // After the word is written, show "Continue"; then continue on our own if the visitor waits.
  useEffect(() => {
    if (!open) return;
    const a = setTimeout(() => setReady(true), DRAW * 1000 + 300);
    const b = setTimeout(finish, DRAW * 1000 + 2800);
    const onKey = (e: KeyboardEvent) => (e.key === "Enter" || e.key === " " || e.key === "Escape") && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, finish]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        delete document.documentElement.dataset.intro;
        window.dispatchEvent(new Event("intro-done"));
      }}
    >
      {open && (
        <motion.div
          key="intro"
          data-lenis-prevent
          role="dialog"
          aria-label="Welcome"
          onClick={() => ready && finish()}
          className="fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center"
          style={{ background: "rgba(4,6,10,.62)", WebkitBackdropFilter: "blur(44px) saturate(140%)", backdropFilter: "blur(44px) saturate(140%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
        >
          <motion.svg
            viewBox="0 0 474 200"
            className="w-[min(78vw,560px)] overflow-visible"
            exit={{ scale: 1.25, opacity: 0, filter: "blur(12px)", transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
            aria-hidden
          >
            <motion.path
              d={HELLO}
              fill="none"
              stroke="#fff"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,.35))" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ pathLength: { duration: DRAW, ease: [0.55, 0.05, 0.35, 1], delay: 0.35 }, opacity: { duration: 0.2, delay: 0.35 } }}
            />
          </motion.svg>

          <AnimatePresence>
            {ready && (
              <motion.button
                onClick={finish}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="absolute bottom-[14vh] flex flex-col items-center gap-2 text-[13px] font-medium text-white/75"
                autoFocus
              >
                <span className="drop drop-on-dark grid size-11 place-items-center rounded-full text-white">
                  <ArrowRight className="size-5" strokeWidth={2.25} />
                </span>
                Continue
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
