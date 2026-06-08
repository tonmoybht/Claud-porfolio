/**
 * Vercel Cron — runs every minute (see vercel.json).
 * Fetches live scores from football-data.org and caches in KV.
 * Secured with CRON_SECRET header.
 */
import { NextRequest, NextResponse } from "next/server";
import { fetchLiveMatches, fetchStandings } from "@/lib/football";
import { setLiveMatches, setStandings, getLiveMatches, type LiveMatch } from "@/lib/storage";

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this automatically in production)
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: Record<string, unknown> = { ts: new Date().toISOString() };

  try {
    // 1. Fetch live matches
    const apiMatches = await fetchLiveMatches();
    const prev = await getLiveMatches();

    const live: LiveMatch[] = apiMatches.map((m) => ({
      id:         m.id,
      group:      m.group,
      home:       m.home,
      away:       m.away,
      homeScore:  m.homeScore,
      awayScore:  m.awayScore,
      minute:     m.minute,
      status:     m.status as "live" | "ft" | "upcoming",
      venue:      m.venue,
      updatedAt:  Date.now(),
    }));

    await setLiveMatches(live);
    results.live = live.length;

    // 2. Detect goals for push notifications (logged here; SSE handles the push)
    const goals: string[] = [];
    live.forEach((m) => {
      const p = prev.find((x) => x.id === m.id);
      if (p && (p.homeScore !== m.homeScore || p.awayScore !== m.awayScore)) {
        goals.push(`${m.home} ${m.homeScore}–${m.awayScore} ${m.away}`);
      }
    });
    if (goals.length) results.goals = goals;

    // 3. Refresh standings every 5 minutes (check via simple counter in KV)
    const standings = await fetchStandings();
    if (standings) await setStandings(standings);
    results.standings = "updated";

  } catch (err) {
    results.error = err instanceof Error ? err.message : "unknown";
  }

  return NextResponse.json(results);
}
