import { getDb } from "@/lib/mongodb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Simple per-IP throttle (best effort; resets on server restart).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  // Honeypot: bots fill hidden fields.
  if (body.company) return Response.json({ ok: true });

  if (!name || !EMAIL_RE.test(email) || message.length < 2) {
    return Response.json({ error: "Please provide a name, a valid email and a message." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ error: "Too many messages — please try again later." }, { status: 429 });

  try {
    const db = await getDb();
    await db.collection("messages").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      read: false,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  } catch (err) {
    console.error("[contact] failed to save message", err);
    return Response.json({ error: "Could not send right now. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
