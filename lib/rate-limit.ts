import "server-only";
import crypto from "crypto";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function hashIp(ip: string) {
  return crypto
    .createHash("sha256")
    .update(`${ip}:fansipan-rate-limit`)
    .digest("hex")
    .slice(0, 24);
}

export function checkRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export function clientIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}

export function isLikelySpam({
  honeypot,
  startedAt,
}: {
  honeypot: FormDataEntryValue | null;
  startedAt: FormDataEntryValue | null;
}) {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
  if (typeof startedAt === "string") {
    const value = Number(startedAt);
    if (Number.isFinite(value) && Date.now() - value < 2500) return true;
  }
  return false;
}
