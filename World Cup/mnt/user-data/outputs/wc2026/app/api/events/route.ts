/**
 * Server-Sent Events (SSE) endpoint.
 * Streams live score updates to connected clients in real-time.
 * Vercel allows long-lived streaming functions up to 300s (Pro) / 60s (Hobby).
 */
import { NextResponse } from "next/server";
import { getLiveMatches } from "@/lib/storage";

export const runtime = "edge";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(msg));
      }

      // 1. Send initial state
      const live = await getLiveMatches();
      send("init", { live, ts: Date.now() });

      // 2. Poll every 20s and push deltas
      let prev = JSON.stringify(live);
      const interval = setInterval(async () => {
        try {
          const current = await getLiveMatches();
          const curr = JSON.stringify(current);
          // Always push to keep connection alive (heartbeat)
          send("update", { live: current, changed: curr !== prev, ts: Date.now() });
          // Detect goals
          if (curr !== prev) {
            const prevArr: typeof current = JSON.parse(prev);
            current.forEach((m) => {
              const p = prevArr.find((x) => x.id === m.id);
              if (p && (p.homeScore !== m.homeScore || p.awayScore !== m.awayScore)) {
                send("goal", { fixture: m, prev: { home: p.homeScore, away: p.awayScore } });
              }
            });
          }
          prev = curr;
        } catch {
          send("heartbeat", { ts: Date.now() });
        }
      }, 20_000);

      // 3. Clean up after 55s (Vercel Hobby limit safety margin)
      setTimeout(() => {
        clearInterval(interval);
        send("reconnect", { message: "Reconnect to continue receiving updates" });
        controller.close();
      }, 55_000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection:      "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
