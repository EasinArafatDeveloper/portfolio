"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronLeft, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { notify } from "@/lib/island";
import { Reveal, Section } from "./ui";

type Msg = { from: "me" | "them"; text: string; id: number };
type Step = "name" | "email" | "message" | "sending" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let uid = 0;

function Typing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className="flex w-fit gap-1 rounded-[20px] rounded-bl-md bg-[#e9e9eb] px-4 py-3 dark:bg-[#26252a]"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-fg-3"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

export function Messages() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({ name: "", email: "" });
  const [started, setStarted] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const hp = useRef<HTMLInputElement>(null);

  const say = (text: string, delay = 700) =>
    new Promise<void>((res) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { from: "them", text, id: ++uid }]);
        res();
      }, delay);
    });

  // Start the conversation when the section first scrolls into view.
  const startRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = startRef.current;
    if (!el) return;
    const io = new IntersectionObserver(async ([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        io.disconnect();
        await say(`Hey there 👋 I'm ${profile.shortName}.`, 600);
        await say("Got a project, a job or just want to say hi? What's your name?", 900);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || step === "sending" || step === "done") return;
    setError("");

    if (step === "email" && !EMAIL_RE.test(text)) {
      setError("That email doesn't look right.");
      return;
    }

    setMsgs((m) => [...m, { from: "me", text, id: ++uid }]);
    setInput("");

    if (step === "name") {
      setData((d) => ({ ...d, name: text }));
      setStep("email");
      await say(`Nice to meet you, ${text.split(" ")[0]}! What's the best email to reach you?`);
    } else if (step === "email") {
      setData((d) => ({ ...d, email: text }));
      setStep("message");
      await say("Perfect. Tell me what you have in mind ✨");
    } else if (step === "message") {
      setStep("sending");
      setTyping(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, message: text, company: hp.current?.value }),
        });
        const json = await res.json().catch(() => ({}));
        setTyping(false);
        if (!res.ok) throw new Error(json.error || "Something went wrong.");
        setStep("done");
        notify({ kind: "airdrop", title: `Sending to ${profile.shortName}…`, subtitle: `From ${data.name}` });
        await say("Delivered ✅ Thanks! I'll get back to you within 24 hours.", 500);
      } catch (err) {
        setTyping(false);
        setStep("message");
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  }

  const placeholder =
    step === "name" ? "Your name" : step === "email" ? "you@email.com" : step === "done" ? "Message sent" : "Type your message…";

  return (
    <Section id="contact" eyebrow="Messages" title="Let's build together.">
      <Reveal>
        <div ref={startRef} className="glass glass-strong mx-auto flex h-[620px] max-h-[80svh] w-full max-w-lg flex-col overflow-hidden rounded-[40px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sep px-4 pt-4 pb-3">
            <ChevronLeft className="size-6 text-accent" />
            <div className="flex flex-col items-center">
              <Avatar size={48} />
              <p className="mt-1 text-[12px] font-semibold">{profile.name} ›</p>
            </div>
            <Video className="size-6 text-accent" />
          </div>

          {/* Thread */}
          <div ref={scroller} data-lenis-prevent className="no-scrollbar flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-4">
            <p className="mb-2 text-center text-[11px] font-medium text-fg-3">iMessage · Today</p>
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, scale: 0.7, y: 16, originX: m.from === "me" ? 1 : 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className={`max-w-[78%] rounded-[20px] px-4 py-2.5 text-[15.5px] leading-snug ${
                    m.from === "me"
                      ? "self-end rounded-br-md bg-[#0a84ff] text-white"
                      : "self-start rounded-bl-md bg-[#e9e9eb] text-black dark:bg-[#26252a] dark:text-white"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && <Typing key="typing" />}
            </AnimatePresence>
            {step === "done" && <p className="mt-1 self-end text-[11px] font-medium text-fg-3">Delivered</p>}
          </div>

          {/* Composer */}
          <form onSubmit={submit} className="border-t border-sep p-3">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-2 text-[13px] text-[#ff453a]"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <input ref={hp} name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="flex items-center gap-2 rounded-full border border-sep bg-[var(--bg)]/40 py-1 pr-1 pl-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type={step === "email" ? "email" : "text"}
                disabled={step === "sending" || step === "done"}
                placeholder={placeholder}
                aria-label={placeholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-[16px] outline-none placeholder:text-fg-3"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.85 }}
                disabled={!input.trim()}
                aria-label="Send"
                className="grid size-9 place-items-center rounded-full bg-[#0a84ff] text-white transition disabled:opacity-30"
              >
                <ArrowUp className="size-5" strokeWidth={2.75} />
              </motion.button>
            </div>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}
