"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Bot, Check, Code2, Files, GitBranch, ListChecks, Lock, MessageCircle, MonitorPlay, PartyPopper, RefreshCw, Search, ShoppingBag, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { EMOJI, Emoji3D } from "./Emoji3D";
import { Reveal, Section } from "./ui";

/* ═════════════ Content: one full client project per scenario ═════════════ */

type Line = { code: string; stage?: number };
type Msg = { from: "client" | "me"; text: string; at: number };
type Scenario = {
  id: string;
  label: string;
  client: string;
  files: string[];
  url: string;
  brief: Msg[]; // 1. Message
  plan: string[]; // 2. Plan
  lines: Line[]; // 3. Code (stages build the preview)
  delivery: Msg[]; // 5. Done
  revision: { at: number; del?: string; add: string }; // 6. Revision (diff after line `at`)
  review: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "saas",
    label: "SaaS",
    client: "Nova Labs",
    files: ["billing.ts", "workspace.tsx", "auth.ts"],
    url: "app.nova.so",
    brief: [
      { from: "client", text: "Hi Easin! We want to launch a SaaS for team task management.", at: 300 },
      { from: "client", text: "Sign-up, subscription plans and a team dashboard.", at: 1400 },
      { from: "me", text: "Love it! Auth, Stripe billing and multi-tenant workspaces — plan coming.", at: 3000 },
    ],
    plan: ["Auth + team workspaces", "Pricing plans with Stripe", "Multi-tenant dashboard", "Usage analytics + launch"],
    lines: [
      { code: 'export const plans = ["Starter", "Pro", "Team"];', stage: 1 },
      { code: "" },
      { code: "export async function subscribe(team, plan) {" },
      { code: "  const session = await stripe.checkout.create({ plan });", stage: 2 },
      { code: "  await db.teams.update(team.id, { plan });" },
      { code: "  return session.url;" },
      { code: "}" },
      { code: "" },
      { code: "export default function Workspace({ team }) {" },
      { code: "  return (" },
      { code: "    <Dashboard>" },
      { code: "      <Sidebar team={team} />", stage: 3 },
      { code: "      <UsageChart org={team.id} />", stage: 4 },
      { code: "    </Dashboard>" },
      { code: "  );" },
      { code: "}" },
      { code: "// → launch 🚀", stage: 5 },
    ],
    delivery: [
      { from: "me", text: "Nova is live 🚀 — the first 50 teams already signed up!", at: 300 },
      { from: "client", text: "Incredible! Can we add a yearly plan with 20% off?", at: 1800 },
    ],
    revision: { at: 0, add: "export const yearlyDiscount = 0.2; // 20% off" },
    review: "Our MRR doubled in a month!",
  },
  {
    id: "web",
    label: "Web App",
    client: "Acme Inc.",
    files: ["page.tsx", "Stats.tsx", "api/route.ts"],
    url: "acme.app/dashboard",
    brief: [
      { from: "client", text: "Hi Easin! 👋 We need a web app to track our business numbers.", at: 300 },
      { from: "client", text: "Users, revenue and a growth chart — fast and clean.", at: 1400 },
      { from: "me", text: "Sounds great! I'll send you a plan in a few minutes.", at: 3000 },
    ],
    plan: ["Wireframe the dashboard layout", "Next.js pages + API routes", "Live stats and growth chart", "Deploy to Vercel"],
    lines: [
      { code: 'import { Navbar, Hero, Stats, Chart } from "@/ui";' },
      { code: "" },
      { code: "export default function Dashboard() {" },
      { code: "  return (" },
      { code: '    <main className="app">' },
      { code: '      <Navbar brand="Acme" />', stage: 1 },
      { code: '      <Hero title="Grow faster" />', stage: 2 },
      { code: "      <Stats items={metrics} />", stage: 3 },
      { code: "      <Chart data={revenue} />", stage: 4 },
      { code: "    </main>" },
      { code: "  );" },
      { code: "}" },
      { code: "// → vercel deploy --prod", stage: 5 },
    ],
    delivery: [
      { from: "me", text: "Deployed ✅ acme.app/dashboard is live.", at: 300 },
      { from: "client", text: "Love it! Can the hero say “Grow 10× faster”?", at: 1800 },
    ],
    revision: { at: 6, del: '      <Hero title="Grow faster" />', add: '      <Hero title="Grow 10× faster" />' },
    review: "Perfect — shipping it!",
  },
  {
    id: "extension",
    label: "Chrome Extension",
    client: "Growth Agency",
    files: ["content.ts", "popup.tsx", "manifest.json"],
    url: "facebook.com/ads/library",
    brief: [
      { from: "client", text: "Can you build a tool that finds leads from Facebook ads?", at: 300 },
      { from: "client", text: "We'd love to export them to CSV too.", at: 1400 },
      { from: "me", text: "Yes! A Chrome extension + dashboard. Plan coming up.", at: 3000 },
    ],
    plan: ["Scan Ads Library pages", "Parse advertiser details", "Popup with the lead list", "CSV export + badge count"],
    lines: [
      { code: "// content.ts — runs on the Ads Library" },
      { code: 'const ads = document.querySelectorAll("[data-ad]");', stage: 1 },
      { code: "const leads = [...ads].map(parseAdvertiser);", stage: 2 },
      { code: 'chrome.runtime.sendMessage({ type: "LEADS", leads });', stage: 3 },
      { code: "" },
      { code: "// popup.tsx" },
      { code: "export function Popup({ leads }) {" },
      { code: "  return <LeadList items={leads} />;", stage: 4 },
      { code: "}" },
      { code: 'chrome.action.setBadgeText({ text: "24" });', stage: 5 },
    ],
    delivery: [
      { from: "me", text: "Extension is ready — 24 leads found in the demo 🎯", at: 300 },
      { from: "client", text: "Amazing! Could it export to Google Sheets as well?", at: 1800 },
    ],
    revision: { at: 7, del: "  return <LeadList items={leads} />;", add: '  return <LeadList items={leads} exportTo={["csv", "sheets"]} />;' },
    review: "This saves us hours every week!",
  },
  {
    id: "shop",
    label: "E-commerce",
    client: "Havitall",
    files: ["shop/page.tsx", "cart.ts", "checkout.ts"],
    url: "myshop.com",
    brief: [
      { from: "client", text: "We're launching a store and need a fast shop with checkout.", at: 300 },
      { from: "client", text: "Mobile-first please! 📱", at: 1400 },
      { from: "me", text: "On it — Stripe checkout included. Plan in a sec!", at: 3000 },
    ],
    plan: ["Product catalogue + grid", "Cart with instant feedback", "Stripe checkout", "Mobile-first polish"],
    lines: [
      { code: "export default async function Shop() {" },
      { code: "  const products = await db.products.find();", stage: 1 },
      { code: "  return (" },
      { code: "    <Grid>" },
      { code: "      {products.map((p) => (" },
      { code: "        <ProductCard key={p.id} {...p} />", stage: 2 },
      { code: "      ))}" },
      { code: "    </Grid>" },
      { code: "  );" },
      { code: "}" },
      { code: "async function addToCart(id) {" },
      { code: "  await cart.add(id);", stage: 3 },
      { code: '  toast.success("Added to cart");', stage: 4 },
      { code: "}" },
      { code: "// checkout → Stripe ✓", stage: 5 },
    ],
    delivery: [
      { from: "me", text: "The store is live 🛍️ and the first order just came in!", at: 300 },
      { from: "client", text: "Wow! Can we add a free-shipping banner?", at: 1800 },
    ],
    revision: { at: 3, add: '    <Banner text="Free shipping over $50" />' },
    review: "Sales are up already. Thank you!",
  },
];

/* ═════════════ Timeline ═════════════ */

const PHASES = [
  { id: "message", label: "Message", icon: MessageCircle },
  { id: "plan", label: "Plan", icon: ListChecks },
  { id: "code", label: "Code", icon: Code2 },
  { id: "result", label: "Result", icon: MonitorPlay },
  { id: "done", label: "Done", icon: PartyPopper },
  { id: "revision", label: "Revision", icon: RefreshCw },
] as const;

const STEP = 50; // ms per clock tick
const CHARS_PER_MS = 2 / 22; // typing speed
const PLAN_GAP = 650;

// Character offset where each code line starts, plus the total.
const OFFSETS = SCENARIOS.map((sc) => {
  const starts: number[] = [];
  let acc = 0;
  for (const l of sc.lines) {
    starts.push(acc);
    acc += l.code.length + 1;
  }
  return { starts, total: acc };
});

type Clock = { sc: number; phase: number; t: number };

/** Pure clock step: advance time, rolling into the next phase / project when a phase ends. */
function tick(c: Clock): Clock {
  const t = c.t + STEP;
  if (t < phaseDuration(c.phase, c.sc)) return { ...c, t };
  if (c.phase < PHASES.length - 1) return { ...c, phase: c.phase + 1, t: 0 };
  return { sc: (c.sc + 1) % SCENARIOS.length, phase: 0, t: 0 };
}

function phaseDuration(phase: number, sc: number) {
  switch (phase) {
    case 0:
      return 4800;
    case 1:
      return 400 + SCENARIOS[sc].plan.length * PLAN_GAP + 900;
    case 2:
      return OFFSETS[sc].total / CHARS_PER_MS + 700;
    case 3:
      return 2800;
    case 4:
      return 4000;
    default:
      return 4600;
  }
}

/* ═════════════ Syntax highlighting (GitHub dark palette) ═════════════ */

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"?|'[^']*'?|`[^`]*`?)|(<\/?[A-Z][\w.]*|<\/?[a-z]+(?=[\s>]))|\b(import|from|export|default|function|return|const|await|async|new)\b|\b(\d+)\b|([A-Za-z_$][\w$]*)(?=\()/g;
const COLORS = ["#8b949e", "#a5d6ff", "#7ee787", "#ff7b72", "#79c0ff", "#d2a8ff"];

function highlight(text: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={m.index} style={{ color: COLORS[group], fontStyle: group === 0 ? "italic" : undefined }}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
    if (m[0].length === 0) TOKEN.lastIndex++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const Cursor = () => <span className="ml-px inline-block h-[1.15em] w-[2px] translate-y-[3px] animate-pulse bg-[#58a6ff]" />;

/* ═════════════ Left window: Messages / Notes / Editor ═════════════ */

function WindowChrome({ title, children, right }: { title: React.ReactNode; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#0d1117]/92 shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] backdrop-blur-xl">
      <div className="flex min-h-11 items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-4">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1">{title}</div>
        {right}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

function ChatWindow({ s, msgs, t }: { s: Scenario; msgs: Msg[]; t: number }) {
  const visible = msgs.filter((m) => t >= m.at);
  // "typing…" shows just before each of my replies
  const typingFor = msgs.find((m) => t < m.at && t >= m.at - 900);
  return (
    <WindowChrome
      title={
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-white/85">
          <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-pink-500 text-[11px] font-bold text-white">{s.client[0]}</span>
          {s.client}
          <span className="text-[11px] font-normal text-white/40">· Messages</span>
        </span>
      }
    >
      <div className="flex h-full flex-col justify-end gap-2 overflow-hidden p-4">
        <AnimatePresence initial={false}>
          {visible.map((m) => (
            <motion.div
              key={m.text}
              layout
              initial={{ opacity: 0, scale: 0.7, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              style={{ originX: m.from === "me" ? 1 : 0 }}
              className={`flex max-w-[85%] items-end gap-2 ${m.from === "me" ? "flex-row-reverse self-end" : "self-start"}`}
            >
              {m.from === "me" ? (
                <Avatar size={24} ring={false} />
              ) : (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-pink-500 text-[10px] font-bold text-white">{s.client[0]}</span>
              )}
              <span
                className={`rounded-[18px] px-3.5 py-2 text-[12.5px] leading-snug sm:text-[13.5px] ${
                  m.from === "me" ? "rounded-br-md bg-[#0a84ff] text-white" : "rounded-bl-md bg-[#26252a] text-white/90"
                }`}
              >
                {m.text}
              </span>
            </motion.div>
          ))}
          {typingFor && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className={`flex gap-1 rounded-[18px] bg-[#26252a] px-3.5 py-3 ${typingFor.from === "me" ? "self-end" : "self-start"}`}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ type: "tween", repeat: Infinity, duration: 1, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WindowChrome>
  );
}

function PlanWindow({ s, t }: { s: Scenario; t: number }) {
  return (
    <WindowChrome
      title={
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-white/85">
          <ListChecks className="size-4 text-amber-300" /> Project plan
          <span className="text-[11px] font-normal text-white/40">· Notes</span>
        </span>
      }
    >
      <div className="flex h-full flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-amber-300/80 uppercase">{s.client}</p>
        <p className="mt-1 text-[20px] font-bold tracking-tight text-white sm:text-[22px]">{s.label} — scope</p>
        <ul className="mt-5 flex flex-col gap-3">
          {s.plan.map((item, i) => {
            const shown = t >= 300 + i * PLAN_GAP;
            const ticked = t >= 300 + i * PLAN_GAP + PLAN_GAP * 0.7;
            return (
              <motion.li
                key={item}
                initial={false}
                animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -12 }}
                className="flex items-center gap-3 text-[13.5px] text-white/85 sm:text-[14.5px]"
              >
                <motion.span
                  initial={false}
                  animate={{ backgroundColor: ticked ? "#30d158" : "rgba(255,255,255,0)", borderColor: ticked ? "#30d158" : "rgba(255,255,255,.3)" }}
                  className="grid size-5 shrink-0 place-items-center rounded-full border-2"
                >
                  {ticked && <Check className="size-3 text-white" strokeWidth={3.5} />}
                </motion.span>
                <span className={ticked ? "text-white/55 line-through decoration-white/30" : ""}>{item}</span>
              </motion.li>
            );
          })}
        </ul>
        <motion.p
          initial={false}
          animate={{ opacity: t >= 300 + s.plan.length * PLAN_GAP ? 1 : 0 }}
          className="mt-auto flex items-center gap-2 text-[12px] font-medium text-emerald-300"
        >
          <Check className="size-3.5" strokeWidth={3} /> Plan approved by client
        </motion.p>
      </div>
    </WindowChrome>
  );
}

function EditorWindow({ s, typed, revisionTyped }: { s: Scenario; typed: number; revisionTyped: number | null }) {
  const { starts } = OFFSETS[SCENARIOS.indexOf(s)];
  const cursorLine = revisionTyped === null ? s.lines.findIndex((l, i) => typed - starts[i] < l.code.length) : -1;
  const rev = s.revision;
  const rows: React.ReactNode[] = [];
  let n = 0;

  s.lines.forEach((line, i) => {
    const isReplaced = revisionTyped !== null && rev.del !== undefined && i === rev.at;
    if (isReplaced) {
      rows.push(
        <div key={`del${i}`} className="flex bg-[#f85149]/15 pr-4">
          <span className="w-9 shrink-0 pr-3 text-right text-[#f85149]/70 select-none">−</span>
          <code className="whitespace-pre text-[#ffa198] line-through decoration-[#f85149]/50">{line.code}</code>
        </div>,
      );
    } else {
      const visible = line.code.slice(0, Math.max(0, typed - starts[i]));
      rows.push(
        <div key={i} className={`flex pr-4 ${cursorLine === i ? "bg-white/[0.04]" : ""}`}>
          <span className="w-9 shrink-0 pr-3 text-right text-white/20 select-none">{++n}</span>
          <code className="whitespace-pre text-[#e6edf3]">
            {highlight(visible)}
            {cursorLine === i && <Cursor />}
          </code>
        </div>,
      );
    }
    if (revisionTyped !== null && i === rev.at) {
      const done = revisionTyped >= rev.add.length;
      rows.push(
        <motion.div key={`add${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex bg-[#2ea043]/20 pr-4">
          <span className="w-9 shrink-0 pr-3 text-right text-[#3fb950] select-none">+</span>
          <code className="whitespace-pre text-[#e6edf3]">
            {highlight(rev.add.slice(0, revisionTyped))}
            {!done && <Cursor />}
          </code>
        </motion.div>,
      );
    }
  });

  return (
    <WindowChrome
      title={
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {s.files.map((f, i) => (
            <span key={f} className={`shrink-0 rounded-t-lg px-3 py-2.5 font-mono text-[11.5px] ${i === 0 ? "bg-[#0d1117] text-white/90" : "text-white/40"}`}>
              {f}
              {i === 0 && revisionTyped !== null && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-amber-400" />}
            </span>
          ))}
        </div>
      }
    >
      <div className="flex h-full">
        <div className="hidden flex-col items-center gap-4 border-r border-white/[0.06] px-3 py-4 text-white/30 sm:flex">
          <Files className="size-[18px] text-white/70" />
          <Search className="size-[18px]" />
          <GitBranch className="size-[18px]" />
          <Bot className="size-[18px]" />
        </div>
        <pre className="no-scrollbar min-w-0 flex-1 overflow-hidden py-3 font-mono text-[11px] leading-[1.75] sm:text-[12.5px]">{rows}</pre>
      </div>
    </WindowChrome>
  );
}

/* ═════════════ Right window: live product preview ═════════════ */

const pop = {
  initial: { opacity: 0, y: 14, scale: 0.96, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0 },
};
// Keyframe arrays can't use the global spring; give them a tween.
const tween = { type: "tween" as const, duration: 0.45, ease: "easeOut" as const };

type PreviewProps = { stage: number; revised: boolean; celebrate: boolean };

function SaasPreview({ stage, revised, celebrate }: PreviewProps) {
  const plans = [
    { name: "Starter", price: 9 },
    { name: "Pro", price: 29, best: true },
    { name: "Team", price: 79 },
  ];
  // Pricing first; once the workspace is built show the dashboard; the revision brings pricing back with yearly prices.
  const showDashboard = stage >= 3 && !revised;
  return (
    <div className="relative flex h-full flex-col gap-3 p-4">
      {stage >= 1 && (
        <motion.div {...pop} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
          <span className="flex items-center gap-2 text-[12px] font-bold text-slate-800">
            <span className="size-5 rounded-md bg-gradient-to-br from-sky-400 to-indigo-600" /> Nova
          </span>
          <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold text-white">{stage >= 2 ? "Pro plan" : "Sign up"}</span>
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        {stage >= 1 && !showDashboard && (
          <motion.div key="pricing" {...pop} className="flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex items-center justify-center gap-1 self-center rounded-full bg-white p-0.5 text-[9.5px] font-semibold shadow-sm">
              <span className={`rounded-full px-2.5 py-1 ${revised ? "text-slate-400" : "bg-slate-900 text-white"}`}>Monthly</span>
              <span className={`rounded-full px-2.5 py-1 ${revised ? "bg-slate-900 text-white" : "text-slate-400"}`}>
                Yearly <span className={revised ? "text-emerald-300" : "text-emerald-600"}>−20%</span>
              </span>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-2">
              {plans.map((p, i) => {
                const chosen = stage >= 2 && p.best;
                const price = revised ? Math.round(p.price * 0.8) : p.price;
                return (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, scale: chosen ? 1.04 : 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex flex-col rounded-xl bg-white p-2.5 shadow-sm ${p.best ? "ring-2 ring-indigo-500" : ""}`}
                  >
                    <p className="text-[10.5px] font-semibold text-slate-500">{p.name}</p>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p key={price} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-1 text-[18px] font-bold text-slate-800">
                        ${price}
                        <span className="text-[9px] font-medium text-slate-400">/mo</span>
                      </motion.p>
                    </AnimatePresence>
                    <div className="mt-2 flex flex-col gap-1">
                      {[0, 1, 2].map((k) => (
                        <span key={k} className="h-1.5 rounded-full bg-slate-100" style={{ width: `${90 - k * 18}%` }} />
                      ))}
                    </div>
                    <span className={`mt-auto rounded-md py-1 text-center text-[9.5px] font-semibold ${chosen ? "bg-emerald-500 text-white" : p.best ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {chosen ? "✓ Current plan" : "Choose"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        {showDashboard && (
          <motion.div key="dash" {...pop} className="flex min-h-0 flex-1 gap-2">
            <div className="flex w-[26%] flex-col gap-1.5 rounded-xl bg-slate-900 p-2 text-white">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold">
                <span className="size-4 rounded bg-gradient-to-br from-sky-400 to-indigo-500" /> Nova team
              </span>
              {["Overview", "Projects", "Members", "Billing"].map((x, i) => (
                <span key={x} className={`rounded-md px-1.5 py-1 text-[9px] ${i === 0 ? "bg-white/15" : "text-white/50"}`}>
                  {x}
                </span>
              ))}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  ["$12.4k", "MRR"],
                  ["50", "Teams"],
                  ["1.2%", "Churn"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-white p-2 shadow-sm">
                    <p className="text-[12.5px] font-bold text-slate-800">{v}</p>
                    <p className="text-[9px] text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex min-h-0 flex-1 items-end gap-1 rounded-lg bg-white p-2 shadow-sm">
                {stage >= 4 ? (
                  [30, 42, 38, 55, 61, 72, 86, 94].map((h, i) => (
                    <motion.span
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-indigo-500"
                      initial={{ height: "0%" }}
                      animate={{ height: `${h}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.05 }}
                    />
                  ))
                ) : (
                  <span className="m-auto text-[9.5px] text-slate-400">Collecting usage…</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toast show={celebrate} text="Launched · 50 teams signed up" />
    </div>
  );
}

function WebPreview({ stage, revised, celebrate }: PreviewProps) {
  const bars = [40, 65, 50, 80, 62, 95, 78];
  return (
    <div className="relative flex h-full flex-col gap-3 p-4">
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div key="nav" {...pop} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
            <span className="flex items-center gap-2 text-[12px] font-bold text-slate-800">
              <span className="size-5 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500" /> Acme
            </span>
            <span className="hidden gap-3 text-[10.5px] text-slate-400 sm:flex">
              <span>Product</span>
              <span>Pricing</span>
              <span>Docs</span>
            </span>
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">Sign in</span>
          </motion.div>
        )}
        {stage >= 2 && (
          <motion.div key="hero" {...pop} className="rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-4 text-white shadow-sm">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={revised ? "r" : "o"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-[18px] leading-tight font-bold tracking-tight"
              >
                {revised ? (
                  <>
                    Grow <mark className="rounded bg-yellow-300 px-1 text-indigo-700">10×</mark> faster
                  </>
                ) : (
                  "Grow faster"
                )}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 text-[10.5px] text-white/80">Analytics that turn data into decisions.</p>
            <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-indigo-600">Get started</span>
          </motion.div>
        )}
        {stage >= 3 && (
          <motion.div key="stats" {...pop} className="grid grid-cols-3 gap-2">
            {[
              ["12.4k", "Users"],
              ["$48k", "Revenue"],
              ["99.9%", "Uptime"],
            ].map(([v, l], i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl bg-white p-2.5 shadow-sm">
                <p className="text-[14px] font-bold text-slate-800">{v}</p>
                <p className="text-[10px] text-slate-400">{l}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        {stage >= 4 && (
          <motion.div key="chart" {...pop} className="flex min-h-0 flex-1 items-end gap-1.5 rounded-xl bg-white p-3 shadow-sm">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-fuchsia-400"
                initial={{ height: "0%" }}
                animate={{ height: `${h}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Toast show={celebrate} text="Deployed to production" />
    </div>
  );
}

function ExtensionPreview({ stage, revised }: PreviewProps) {
  const ads = ["Glow Skincare", "FitPro Gym", "Urban Shoes", "Chef Box"];
  const leads = ["Glow Skincare", "FitPro Gym", "Urban Shoes", "Chef Box", "Nova Tech"];
  return (
    <div className="relative h-full p-4">
      <div className="flex flex-col gap-2 pr-[44%]">
        {stage >= 1 &&
          ads.map((a, i) => (
            <motion.div key={a} {...pop} transition={{ delay: i * 0.06 }} className="relative overflow-hidden rounded-xl bg-white p-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-800">{a}</p>
                  <p className="text-[9px] text-slate-400">Sponsored</p>
                </div>
              </div>
              <div className="mt-2 h-6 rounded-md bg-slate-100" />
              {stage === 2 && (
                <motion.span
                  className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
                  initial={{ left: "-20%" }}
                  animate={{ left: "110%" }}
                  transition={{ type: "tween", duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              )}
              {stage >= 2 && (
                <span className="absolute top-2 right-2 grid size-4 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
              )}
            </motion.div>
          ))}
      </div>

      <div className="absolute top-3 right-3 flex w-[42%] flex-col items-end gap-2">
        <span className="relative grid size-7 place-items-center rounded-lg bg-white shadow-sm">
          <span className="size-3.5 rounded-sm bg-gradient-to-br from-blue-500 to-violet-500" />
          <AnimatePresence>
            {stage >= 5 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-500 px-1 text-[8.5px] font-bold text-white">
                24
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{ originX: 1, originY: 0 }}
              className="w-full rounded-xl bg-white p-2.5 shadow-lg ring-1 ring-slate-200"
            >
              <p className="text-[11px] font-bold text-slate-800">Lead Finder</p>
              <p className="mb-2 text-[9px] text-slate-400">{stage >= 4 ? "24 leads found" : "Scanning…"}</p>
              <div className="flex flex-col gap-1">
                {leads.map((l, i) =>
                  stage >= 4 ? (
                    <motion.div
                      key={l}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center justify-between rounded-md bg-slate-50 px-1.5 py-1"
                    >
                      <span className="truncate text-[9.5px] font-medium text-slate-700">{l}</span>
                      <span className="text-[8.5px] text-emerald-600">new</span>
                    </motion.div>
                  ) : (
                    <div key={l} className="h-5 animate-pulse rounded-md bg-slate-100" />
                  ),
                )}
              </div>
              {stage >= 4 && (
                <div className="mt-2 flex gap-1">
                  <span className="flex-1 rounded-md bg-blue-600 py-1 text-center text-[9.5px] font-semibold text-white">CSV</span>
                  <AnimatePresence>
                    {revised && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        className="flex-1 overflow-hidden rounded-md bg-emerald-600 py-1 text-center text-[9.5px] font-semibold whitespace-nowrap text-white"
                      >
                        Sheets
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShopPreview({ stage, revised, celebrate }: PreviewProps) {
  const items = [
    ["👟", "Runner Pro", "$89"],
    ["🎧", "Air Buds", "$129"],
    ["⌚", "Pulse Watch", "$199"],
    ["🕶️", "Shade X", "$59"],
  ];
  const added = stage >= 3;
  return (
    <div className="relative flex h-full flex-col gap-2.5 p-4">
      <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
        <span className="text-[12px] font-bold text-slate-800">myshop</span>
        <span className="relative">
          <ShoppingBag className="size-4 text-slate-700" />
          <AnimatePresence>
            {added && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={tween}
                className="absolute -top-1.5 -right-2 grid size-3.5 place-items-center rounded-full bg-rose-500 text-[8px] font-bold text-white"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <AnimatePresence>
        {revised && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden rounded-xl bg-emerald-500 px-3 py-1.5 text-center text-[10.5px] font-semibold text-white"
          >
            🚚 Free shipping over $50
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {items.map(([e, n, p], i) =>
          stage >= 2 ? (
            <motion.div key={n} {...pop} transition={{ delay: i * 0.07 }} className="flex flex-col rounded-xl bg-white p-2 shadow-sm">
              <span className="grid flex-1 place-items-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 text-[24px]">{e}</span>
              <div className="mt-1.5 flex items-center justify-between">
                <div>
                  <p className="text-[10.5px] font-semibold text-slate-800">{n}</p>
                  <p className="flex items-center gap-0.5 text-[9px] text-slate-400">
                    <Star className="size-2.5 fill-amber-400 text-amber-400" /> 4.9 · {p}
                  </p>
                </div>
                <motion.span
                  animate={added && i === 1 ? { scale: [1, 0.85, 1], backgroundColor: "#10b981" } : { scale: 1, backgroundColor: "#0f172a" }}
                  transition={tween}
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                >
                  {added && i === 1 ? "Added" : "Add"}
                </motion.span>
              </div>
            </motion.div>
          ) : stage >= 1 ? (
            <div key={n} className="animate-pulse rounded-xl bg-white/70" />
          ) : null,
        )}
      </div>
      <Toast show={stage === 4} text="Added to cart" />
      <AnimatePresence>
        {celebrate && (
          <motion.div key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 shadow-xl">
              <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="size-5" strokeWidth={3} />
              </span>
              <p className="text-[13px] font-bold text-slate-800">Order confirmed</p>
              <p className="text-[10px] text-slate-400">Paid securely with Stripe</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toast({ show, text }: { show: boolean; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-slate-900 py-1.5 pr-3.5 pl-1.5 text-[11px] font-semibold text-white shadow-xl"
        >
          <span className="grid size-5 place-items-center rounded-full bg-emerald-500">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Browser({ s, phase, stage, revised, review }: { s: Scenario; phase: number; stage: number; revised: boolean; review: boolean }) {
  const waiting = phase === 0 ? "Waiting for requirements…" : phase === 1 ? "Planning the build…" : "Waiting for code…";
  const P = { stage, revised, celebrate: phase === 3 };
  return (
    <motion.div
      animate={{ boxShadow: phase === 3 ? "0 0 0 3px rgba(139,107,255,.9), 0 30px 80px -20px rgba(0,0,0,.6)" : "0 0 0 0px rgba(139,107,255,0), 0 30px 80px -20px rgba(0,0,0,.6)" }}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/20 bg-[#eef1f7]"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
        </div>
        <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10.5px] text-slate-500">
          <Lock className="size-2.5 shrink-0" />
          <span className="truncate">{s.url}</span>
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        {stage === 0 && (
          <div className="absolute inset-0 grid place-items-center text-[11px] text-slate-400">
            <span className="flex items-center gap-2">
              <span className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" /> {waiting}
            </span>
          </div>
        )}
        {s.id === "saas" && <SaasPreview {...P} />}
        {s.id === "web" && <WebPreview {...P} />}
        {s.id === "extension" && <ExtensionPreview {...P} />}
        {s.id === "shop" && <ShopPreview {...P} />}

        {/* Client review after the revision */}
        <AnimatePresence>
          {review && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-slate-900/95 p-3 text-white shadow-2xl"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-pink-500 text-[12px] font-bold">{s.client[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                    </motion.span>
                  ))}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] font-medium">“{s.review}”</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═════════════ Decor ═════════════ */

// Deterministic, pre-rounded values so server and client render identical markup.
const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => (Math.sin(i * 928.37 + n * 71.9) + 1) / 2;
  const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
  return { x: `${round(r(1) * 100)}%`, y: `${round(r(2) * 80)}%`, s: `${round(1 + r(3) * 1.8, 1)}px`, d: round(2 + r(4) * 4, 1), delay: round(r(5) * 4, 1) };
});

const FLOATERS = [
  { src: EMOJI.robot, fb: "🤖", alt: "Robot", size: 92, className: "left-[2%] top-[5%]", dur: 6, rot: [-8, 6] },
  { src: EMOJI.rocket, fb: "🚀", alt: "Rocket", size: 80, className: "right-[3%] top-[4%]", dur: 5, rot: [10, -4] },
  { src: EMOJI.bulb, fb: "💡", alt: "Idea", size: 64, className: "left-[3%] bottom-[14%] hidden sm:block", dur: 7, rot: [-6, 8] },
  { src: EMOJI.gear, fb: "⚙️", alt: "Gear", size: 58, className: "right-[4%] bottom-[16%] hidden sm:block", dur: 8, rot: [0, 40] },
];

/* ═════════════ Section ═════════════ */

export function BuildShowcase() {
  const [{ sc, phase, t }, setClock] = useState<Clock>({ sc: 0, phase: 0, t: 0 }); // t = ms into the phase
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.3 });
  const reduce = useReducedMotion();
  const s = SCENARIOS[sc];
  const { starts, total } = OFFSETS[sc];

  // Reduced motion: show each phase in its finished state and don't auto-advance.
  const time = reduce ? Infinity : t;

  // One clock drives everything; advance phase/scenario when a phase's time is up.
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setClock(tick), STEP);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const typed = phase < 2 ? 0 : phase === 2 ? Math.min(total, Math.floor(time * CHARS_PER_MS)) : total;
  const stage = s.lines.reduce((st, l, i) => (l.stage && typed >= starts[i] + l.code.length ? Math.max(st, l.stage) : st), 0);
  const revisionTyped = phase === 5 ? Math.min(s.revision.add.length, Math.floor(Math.max(0, time - 500) * CHARS_PER_MS)) : null;
  const revised = phase === 5 && revisionTyped !== null && revisionTyped >= s.revision.add.length;
  const review = phase === 5 && time >= 500 + s.revision.add.length / CHARS_PER_MS + 900;
  const phaseProgress = Math.min(1, time / phaseDuration(phase, sc));

  const chatMsgs = phase === 4 ? [...s.brief.map((m) => ({ ...m, at: 0 })), ...s.delivery] : s.brief;
  const left = phase === 0 || phase === 4 ? "chat" : phase === 1 ? "plan" : "code";

  function jump(nextSc: number, nextPhase = 0) {
    setClock({ sc: nextSc, phase: nextPhase, t: 0 });
  }

  return (
    <Section id="build" eyebrow="How I work" title="From message to shipped product.">
      <Reveal>
        <div
          ref={stageRef}
          className="relative isolate overflow-hidden rounded-[36px] px-4 pt-6 pb-8 sm:px-10 sm:pt-10 sm:pb-10"
          style={{ background: "radial-gradient(120% 90% at 50% 115%, #7c5cff 0%, #3b2aa8 32%, #17134a 62%, #0b0a1f 100%)" }}
        >
          {/* Stars + glowing floor */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {STARS.map((st, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: st.x, top: st.y, width: st.s, height: st.s }}
                animate={{ opacity: [0.15, 0.9, 0.15] }}
                transition={{ type: "tween", duration: st.d, repeat: Infinity, delay: st.delay }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute bottom-[-30%] left-1/2 h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-[#8b6bff]/40 blur-3xl" />
          </div>

          {/* Floating 3D characters */}
          {FLOATERS.map((f) => (
            <motion.div
              key={f.alt}
              aria-hidden
              className={`pointer-events-none absolute z-20 drop-shadow-[0_18px_30px_rgba(0,0,0,.45)] ${f.className}`}
              animate={{ y: [0, -16, 0], rotate: f.rot }}
              transition={{ type: "tween", duration: f.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            >
              <Emoji3D src={f.src} alt="" size={f.size} fallback={f.fb} className="max-sm:!h-14 max-sm:!w-14" />
            </motion.div>
          ))}

          {/* Project type switcher */}
          <div className="relative z-30 mb-6 flex justify-center sm:mb-8">
            <div className="drop drop-on-dark flex flex-wrap justify-center gap-1 rounded-[22px] p-1" role="tablist" aria-label="Project type">
              {SCENARIOS.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={i === sc}
                  onClick={() => jump(i)}
                  className="relative rounded-full px-3 py-2 text-[12.5px] font-semibold text-white/70 transition hover:text-white sm:px-5 sm:text-[13.5px]"
                >
                  {i === sc && <motion.span layoutId="scenario-pill" className="absolute inset-0 rounded-full bg-white/15" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className={`relative ${i === sc ? "text-white" : ""}`}>{x.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workspace → Product */}
          <div className="relative z-10 mx-auto grid max-w-5xl gap-4 [perspective:1600px] lg:grid-cols-[1.15fr_1fr] lg:gap-6">
            <motion.div
              className="h-[300px] sm:h-[400px]"
              initial={{ rotateY: 10, opacity: 0, x: -30 }}
              whileInView={{ rotateY: 4, opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, damping: 16 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${s.id}-${left}`}
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                  transition={{ duration: 0.25 }}
                >
                  {left === "chat" && <ChatWindow s={s} msgs={chatMsgs} t={time} />}
                  {left === "plan" && <PlanWindow s={s} t={time} />}
                  {left === "code" && <EditorWindow s={s} typed={typed} revisionTyped={revisionTyped} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Flow arrow */}
            <div aria-hidden className="pointer-events-none absolute top-1/2 left-[53.5%] z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              <motion.div
                key={`${phase}-${stage}`}
                className="grid size-11 place-items-center rounded-full bg-white text-[#5b3cff] shadow-[0_0_30px_rgba(139,107,255,.8)]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <span className="text-[18px] font-bold">→</span>
              </motion.div>
            </div>

            <motion.div
              className="h-[300px] sm:h-[400px]"
              initial={{ rotateY: -10, opacity: 0, x: 30 }}
              whileInView={{ rotateY: -4, opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.1 }}
            >
              <Browser key={s.id} s={s} phase={phase} stage={stage} revised={revised} review={review} />
            </motion.div>
          </div>

          {/* Process stepper */}
          <ol className="relative z-10 mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:mt-10 sm:grid-cols-6" aria-label="Process">
            {PHASES.map((p, i) => {
              const Icon = p.icon;
              const state = i < phase ? "done" : i === phase ? "active" : "todo";
              return (
                <li key={p.id}>
                  <button
                    onClick={() => jump(sc, i)}
                    aria-current={state === "active" ? "step" : undefined}
                    className={`relative flex w-full flex-col items-center gap-1.5 overflow-hidden rounded-2xl px-2 py-2.5 text-[12px] font-semibold transition-colors sm:text-[12.5px] ${
                      state === "active" ? "bg-white/15 text-white" : state === "done" ? "text-white/85 hover:bg-white/5" : "text-white/40 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`grid size-7 place-items-center rounded-full transition-colors duration-500 ${
                        state === "done" ? "bg-[#8b6bff] text-white" : state === "active" ? "bg-white text-[#5b3cff]" : "bg-white/10"
                      }`}
                    >
                      {state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : <Icon className="size-3.5" strokeWidth={2.5} />}
                    </span>
                    {p.label}
                    {state === "active" && <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-white/70" style={{ transform: `scaleX(${phaseProgress})` }} />}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="relative z-10 mt-4 text-center text-[12.5px] text-white/50">
            Clear communication at every step — this is how {profile.shortName} works with every client.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
