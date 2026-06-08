/**
 * storage.ts
 * Thin wrapper around Vercel KV.
 * Falls back to in-memory Map when KV env vars are absent (local dev).
 */

let kv: typeof import("@vercel/kv").kv | null = null;

async function getKV() {
  if (kv) return kv;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const mod = await import("@vercel/kv");
      kv = mod.kv;
      return kv;
    }
  } catch {}
  return null;
}

// In-memory fallback (single server instance, no persistence)
const mem = new Map<string, { value: unknown; ttl?: number }>();

export async function get<T>(key: string): Promise<T | null> {
  const client = await getKV();
  if (client) return client.get<T>(key);
  const entry = mem.get(key);
  if (!entry) return null;
  if (entry.ttl && Date.now() > entry.ttl) { mem.delete(key); return null; }
  return entry.value as T;
}

export async function set(key: string, value: unknown, ttlSec?: number): Promise<void> {
  const client = await getKV();
  if (client) {
    if (ttlSec) await client.set(key, value, { ex: ttlSec });
    else        await client.set(key, value);
    return;
  }
  mem.set(key, { value, ttl: ttlSec ? Date.now() + ttlSec * 1000 : undefined });
}

export async function del(key: string): Promise<void> {
  const client = await getKV();
  if (client) { await client.del(key); return; }
  mem.delete(key);
}

export async function keys(pattern: string): Promise<string[]> {
  const client = await getKV();
  if (client) return client.keys(pattern);
  const prefix = pattern.replace("*", "");
  return Array.from(mem.keys()).filter((k) => k.startsWith(prefix));
}

// ── Typed helpers ─────────────────────────────────────────────────────

export type Prediction = {
  userId: string;
  fixtureId: number;
  homeScore: number;
  awayScore: number;
  savedAt: number;
};

export async function savePrediction(p: Prediction) {
  await set(`pred:${p.userId}:${p.fixtureId}`, p);
}
export async function getPredictions(userId: string): Promise<Prediction[]> {
  const ks = await keys(`pred:${userId}:*`);
  const all = await Promise.all(ks.map((k) => get<Prediction>(k)));
  return all.filter(Boolean) as Prediction[];
}
export async function deletePrediction(userId: string, fixtureId: number) {
  await del(`pred:${userId}:${fixtureId}`);
}

export type WatchlistItem = { userId: string; fixtureIds: number[] };

export async function getWatchlist(userId: string): Promise<number[]> {
  return (await get<number[]>(`watch:${userId}`)) ?? [];
}
export async function setWatchlist(userId: string, ids: number[]) {
  await set(`watch:${userId}`, ids);
}

export type LiveMatch = {
  id: string;
  group: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "live" | "ft" | "upcoming";
  venue?: string;
  updatedAt: number;
};

export async function setLiveMatches(matches: LiveMatch[]) {
  await set("live:matches", matches, 120); // 2 min TTL
}
export async function getLiveMatches(): Promise<LiveMatch[]> {
  return (await get<LiveMatch[]>("live:matches")) ?? [];
}
export async function setStandings(data: unknown) {
  await set("standings:all", data, 300); // 5 min TTL
}
export async function getStandings(): Promise<unknown> {
  return get("standings:all");
}
