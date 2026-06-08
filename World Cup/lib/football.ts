/**
 * football.ts
 * Client for football-data.org (free tier).
 * WC 2026 competition code: WC
 */

const BASE = "https://api.football-data.org/v4";
const KEY  = process.env.FOOTBALL_API_KEY ?? "";

const STATUS: Record<string, string> = {
  SCHEDULED: "upcoming", TIMED: "upcoming",
  IN_PLAY: "live", PAUSED: "live",
  FINISHED: "ft", AWARDED: "ft",
};

async function apiFetch(path: string) {
  if (!KEY || KEY === "your_key_here") return null;
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": KEY },
    next: { revalidate: 55 },          // ISR: revalidate every 55s
  });
  if (!res.ok) {
    console.error(`[football-api] ${res.status} ${path}`);
    return null;
  }
  return res.json();
}

export type ApiMatch = {
  id: string;
  group: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: string;
  venue: string;
  date: string;
};

export async function fetchLiveMatches(): Promise<ApiMatch[]> {
  const data = await apiFetch("/competitions/WC/matches?status=IN_PLAY,PAUSED");
  if (!data) return [];
  return (data.matches ?? []).map(mapMatch);
}

export async function fetchAllMatches(): Promise<ApiMatch[]> {
  const data = await apiFetch("/competitions/WC/matches");
  if (!data) return [];
  return (data.matches ?? []).map(mapMatch);
}

export async function fetchStandings() {
  const data = await apiFetch("/competitions/WC/standings");
  if (!data) return null;
  const result: Record<string, unknown[]> = {};
  for (const section of data.standings ?? []) {
    const g = (section.group as string)?.replace("GROUP_", "");
    if (!g) continue;
    result[g] = section.table.map((row: Record<string, unknown>) => ({
      team:    (row.team as Record<string,string>)?.shortName ?? (row.team as Record<string,string>)?.name,
      played:  row.playedGames,
      won:     row.won,
      drawn:   row.draw,
      lost:    row.lost,
      gf:      row.goalsFor,
      ga:      row.goalsAgainst,
      gd:      row.goalDifference,
      points:  row.points,
    }));
  }
  return result;
}

function mapMatch(m: Record<string, unknown>): ApiMatch {
  const score = (m.score as Record<string, Record<string,number>>)?.fullTime
             ?? (m.score as Record<string, Record<string,number>>)?.halfTime
             ?? {};
  const home = (m.homeTeam as Record<string,string>);
  const away = (m.awayTeam as Record<string,string>);
  return {
    id:         String(m.id),
    group:      (m.group as string)?.replace("GROUP_", "") ?? "?",
    home:       home?.shortName ?? home?.name ?? "",
    away:       away?.shortName ?? away?.name ?? "",
    homeScore:  score.home ?? 0,
    awayScore:  score.away ?? 0,
    minute:     (m.minute as number) ?? 0,
    status:     STATUS[m.status as string] ?? "upcoming",
    venue:      (m.venue as string) ?? "",
    date:       (m.utcDate as string)?.split("T")[0] ?? "",
  };
}

export const hasApiKey = () => Boolean(KEY && KEY !== "your_key_here");
