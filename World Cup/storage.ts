/**
 * storage.ts — Simple in-memory store with optional Upstash Redis.
 * Works perfectly on Vercel Hobby with zero configuration.
 * Predictions also saved to client localStorage for persistence.
 */

// ── In-memory fallback (always works, no setup needed) ────────────────
const mem = new Map<string, { value: unknown; exp?: number }>();

function memGet<T>(key: string): T | null {
  const e = mem.get(key);
  if (!e) return null;
  if (e.exp && Date.now() > e.exp) { mem.delete(key); return null; }
  return e.value as T;
}
function memSet(key: string, value: unknown, ttlSec?: number) {
  mem.set(key, { value, exp: ttlSec ? Date.now() + ttlSec * 1000 : undefined });
}
function memDel(key: string) { mem.delete(key); }
function memKeys(prefix: string) {
  return Array.from(mem.keys()).filter(k => k.startsWith(prefix));
}

// ── Optional Upstash Redis (auto-used if env vars present) ────────────
async function getRedis() {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Redis } = await import("@upstash/redis");
      return new Redis({
        url:   process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    }
  } catch {}
  return null;
}

// ── Public API ────────────────────────────────────────────────────────
export async function get<T>(key: string): Promise<T | null> {
  const r = await getRedis();
  if (r) return r.get<T>(key);
  return memGet<T>(key);
}

export async function set(key: string, value: unknown, ttlSec?: number) {
  const r = await getRedis();
  if (r) {
    ttlSec ? await r.set(key, value, { ex: ttlSec }) : await r.set(key, value);
    return;
  }
  memSet(key, value, ttlSec);
}

export async function del(key: string) {
  const r = await getRedis();
  if (r) { await r.del(key); return; }
  memDel(key);
}

export async function keys(prefix: string): Promise<string[]> {
  const r = await getRedis();
  if (r) return r.keys(`${prefix}*`);
  return memKeys(prefix);
}

// ── Typed helpers ─────────────────────────────────────────────────────
export type Prediction = {
  userId: string; fixtureId: number;
  homeScore: number; awayScore: number; savedAt: number;
};
export type LiveMatch = {
  id: string; group: string; home: string; away: string;
  homeScore: number; awayScore: number; minute: number;
  status: "live" | "ft" | "upcoming"; venue?: string; updatedAt?: number;
};

export async function savePrediction(p: Prediction) {
  await set(`pred:${p.userId}:${p.fixtureId}`, p);
}
export async function getPredictions(userId: string): Promise<Prediction[]> {
  const ks = await keys(`pred:${userId}:`);
  const all = await Promise.all(ks.map(k => get<Prediction>(k)));
  return all.filter(Boolean) as Prediction[];
}
export async function deletePrediction(userId: string, fixtureId: number) {
  await del(`pred:${userId}:${fixtureId}`);
}
export async function getWatchlist(userId: string): Promise<number[]> {
  return (await get<number[]>(`watch:${userId}`)) ?? [];
}
export async function setWatchlist(userId: string, ids: number[]) {
  await set(`watch:${userId}`, ids);
}
export async function setLiveMatches(matches: LiveMatch[]) {
  await set("live:matches", matches, 120);
}
export async function getLiveMatches(): Promise<LiveMatch[]> {
  return (await get<LiveMatch[]>("live:matches")) ?? [];
}
export async function setStandings(data: unknown) {
  await set("standings:all", data, 300);
}
export async function getStandings() {
  return get("standings:all");
}
