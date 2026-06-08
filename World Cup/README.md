# ⚽ World Cup 2026 — Live Hub

A full-stack Next.js 15 app for tracking the FIFA World Cup 2026 in real time.

**Live scores · AI predictions · Fixtures · Group standings · My Picks · Knockout bracket**

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, PPR) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + Framer Motion |
| Database | Vercel KV (Redis) |
| Real-time | Server-Sent Events (SSE) |
| Cron | Vercel Cron (every minute) |
| AI | Anthropic Claude Sonnet 4 |
| Live Scores | football-data.org API (free tier) |
| Hosting | Vercel |

---

## Deploy to Vercel in 3 steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "World Cup 2026 app"
gh repo create wc2026 --public --push
```

### 2. Import to Vercel

1. Go to → [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add environment variables (see below)
5. Click **Deploy**

### 3. Add Vercel KV

In your Vercel dashboard → Storage → Create KV Database → Link to project.
Vercel auto-sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

---

## Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Required | Where to get |
|----------|----------|--------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | [console.anthropic.com](https://console.anthropic.com) |
| `FOOTBALL_API_KEY` | For live scores | [football-data.org](https://www.football-data.org/client/register) (free) |
| `KV_REST_API_URL` | Auto-set by Vercel KV | — |
| `KV_REST_API_TOKEN` | Auto-set by Vercel KV | — |
| `CRON_SECRET` | ✅ Yes | Any random string |

---

## Local Development

```bash
# 1. Install deps
npm install

# 2. Copy env
cp .env.example .env.local
# Fill in your keys in .env.local

# 3. Run dev server
npm run dev

# Open http://localhost:3000
```

> **KV locally:** Without KV env vars, the app uses an in-memory fallback.
> Data won't persist across server restarts but everything works.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/live` | Currently live matches |
| `GET` | `/api/fixtures` | All 72+ fixtures |
| `GET` | `/api/standings` | Group standings A–L |
| `POST` | `/api/ai` | Claude AI chat |
| `GET` | `/api/events` | SSE real-time stream |
| `GET/POST/DELETE` | `/api/predictions` | Save predictions |
| `GET/POST/DELETE` | `/api/watchlist` | Watchlist |
| `GET` | `/api/cron` | Score poll (Vercel Cron) |

Send `x-user-id: your-name` header to scope predictions/watchlist to you.

---

## Features

- **🔴 Live Scores** — Real-time via SSE, auto-reconnects, Vercel Cron polls every minute
- **⚽ Demo Mode** — Simulates live matches with confetti + sound for testing
- **📅 Fixtures** — All 72 group matches, search + filter by group, watchlist
- **📊 Groups** — All 12 groups, click team → see their fixtures
- **🤖 AI Analyst** — Claude Sonnet 4 for tactical analysis, score predictions, quick questions
- **🎯 My Picks** — Predict scores for every match, synced server-side
- **🏆 Bracket** — Full knockout bracket, players to watch
- **🔔 Notifications** — Browser push for goals (when notifications allowed)
- **📻 Ticker** — Live score bar at the bottom of screen

---

## Project Structure

```
wc2026/
├── app/
│   ├── layout.tsx          Root layout
│   ├── page.tsx            Full app (client)
│   ├── globals.css         Tailwind + animations
│   └── api/
│       ├── ai/             Claude AI chat
│       ├── live/           Live match scores
│       ├── fixtures/       All fixtures
│       ├── standings/      Group standings
│       ├── predictions/    User predictions (KV)
│       ├── watchlist/      Watched matches (KV)
│       ├── events/         SSE real-time stream
│       └── cron/           Vercel Cron score poller
├── lib/
│   ├── data.ts             All 72 fixtures + groups (TypeScript)
│   ├── football.ts         football-data.org client
│   └── storage.ts          Vercel KV wrapper + in-memory fallback
├── vercel.json             Cron schedule + function config
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## Tournament Dates

| Stage | Dates |
|-------|-------|
| Group Stage | Jun 11 – Jun 27 |
| Round of 32 | Jun 28 – Jul 2 |
| Round of 16 | Jul 4 – 5 |
| Quarter-Finals | Jul 9 – 10 |
| Semi-Finals | Jul 14 – 15 |
| **🏆 Final** | **Jul 19 — MetLife Stadium, NJ** |

---

Built with Next.js 15 · Vercel · Claude AI · football-data.org
