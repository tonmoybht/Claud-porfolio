/**
 * SSE real-time stream — Hobby-plan friendly.
 * Fetches live scores directly from football-data.org every 30s.
 * No cron job needed.
 */
import { NextResponse } from "next/server";
import { fetchLiveMatches } from "@/lib/football";
import { getLiveMatches, setLiveMatches, type LiveMatch } from "@/lib/storage";
 
export const runtime = "nodejs";
export const maxDuration = 60;
 
export async function GET() {
  const encoder = new TextEncoder();
 
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {}
      }
 
      // 1. Send current cached state immediately
      const cached = await getLiveMatches();
      send("init", { live: cached, ts: Date.now() });
 
      // 2. Fetch + push every 30s
      let prevJson = JSON.stringify(cached);
 
      async function refresh() {
        try {
          // Try real API first, fall back to cache
          const apiMatches = await fetchLiveMatches();
          const live: LiveMatch[] = apiMatches.map((m) => ({
            id:        m.id,
            group:     m.group,
            home:      m.home,
            away:      m.away,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            minute:    m.minute,
            status:    m.status as "live" | "ft" | "upcoming",
            venue:     m.venue,
            updatedAt: Date.now(),
          }));
 
          // Persist to KV (if available)
          if (live.length > 0) await setLiveMatches(live);
 
          const currJson = JSON.stringify(live);
          send("update", { live, changed: currJson !== prevJson, ts: Date.now() });
 
          // Detect goals
          if (currJson !== prevJson) {
            const prev: LiveMatch[] = JSON.parse(prevJson);
            live.forEach((m) => {
              const p = prev.find((x) => x.id === m.id);
              if (p && (p.homeScore !== m.homeScore || p.awayScore !== m.awayScore)) {
                send("goal", { fixture: m, prev: { home: p.homeScore, away: p.awayScore } });
              }
            });
          }
          prevJson = currJson;
        } catch {
          // Keep alive with heartbeat on error
          send("heartbeat", { ts: Date.now() });
        }
      }
 
      // First fetch immediately
      await refresh();
 
      // Then every 30s
      const interval = setInterval(refresh, 30_000);
 
      // Close after 55s (Hobby function limit)
      setTimeout(() => {
        clearInterval(interval);
        send("reconnect", { ts: Date.now() });
        try { controller.close(); } catch {}
      }, 55_000);
    },
  });
 
  return new NextResponse(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
