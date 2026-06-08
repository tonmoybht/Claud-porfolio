
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Calendar, BarChart2, Target, Bot, Radio,
  Bell, BellOff, Search, RefreshCw, Send, ChevronRight,
  Shield, X
} from "lucide-react";
import { FIXTURES, GROUPS, FLAGS, PLAYERS_TO_WATCH, KNOCKOUT_ROUNDS, type Fixture } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────
type Tab = "live" | "fixtures" | "groups" | "predict" | "picks" | "bracket";
type LiveMatch = {
  id: string; group: string; home: string; away: string;
  homeScore: number; awayScore: number; minute: number;
  status: "live" | "ft" | "upcoming"; venue?: string; updatedAt?: number;
};
type Prediction = { fixtureId: number; homeScore: number; awayScore: number; savedAt: number };
type ChatMessage = { role: "user" | "ai"; content: string; ts: number };

// ─── Constants ────────────────────────────────────────────────────────
const KICKOFF = new Date("2026-06-11T20:00:00Z");
const USER_ID =
  typeof window !== "undefined"
    ? localStorage.getItem("wc26_uid") ??
      (() => { const id = "u_" + Math.random().toString(36).slice(2, 10); localStorage.setItem("wc26_uid", id); return id; })()
    : "anon";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// ─── Confetti ─────────────────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d")!;
  canvas.width = innerWidth; canvas.height = innerHeight;
  const COLORS = ["#ffd700","#c41e3a","#00e676","#1e88e5","#fff"];
  const particles = Array.from({ length: 90 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 300,
    y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.7) * 16,
    w: 6 + Math.random() * 8, h: 3 + Math.random() * 5,
    rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 1, decay: 0.012 + Math.random() * 0.01,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.rot += p.rotV; p.life -= p.decay;
      if (p.life > 0) { alive = true; }
      ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function playGoalSFX() {
  try {
    const ctx = new AudioContext();
    [261, 329, 392, 523, 659].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = "sine";
      g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.3);
      o.start(ctx.currentTime + i * 0.09); o.stop(ctx.currentTime + i * 0.09 + 0.35);
    });
  } catch {}
}

// ─── Utility components ───────────────────────────────────────────────
function cn(...args: (string | boolean | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full bg-green animate-pulse-dot", className)} />
  );
}

function Badge({ label, variant = "default" }: { label: string; variant?: "green" | "gold" | "red" | "blue" | "default" }) {
  const styles = {
    green:   "bg-green/10 text-green border-green/25",
    gold:    "bg-gold/10 text-gold border-gold/20",
    red:     "bg-red/10 text-[#c41e3a] border-red/25",
    blue:    "bg-blue/10 text-blue border-blue/25",
    default: "bg-white/4 text-muted border-white/8",
  };
  return (
    <span className={cn("text-[10px] font-bold tracking-wider px-2 py-[2px] rounded border", styles[variant])}>
      {label}
    </span>
  );
}

function SectionTitle({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <h2 className="flex items-center gap-2 font-rajdhani font-bold text-lg tracking-wide">
        {icon} <span className="text-gold">{label.split(" ")[0]}</span>&nbsp;{label.split(" ").slice(1).join(" ")}
      </h2>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────
function Countdown() {
  const [parts, setParts] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    function tick() {
      const diff = KICKOFF.getTime() - Date.now();
      if (diff <= 0) { setParts({ d:"00",h:"00",m:"00",s:"🔴" }); return; }
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      setParts({ d:String(d).padStart(2,"0"), h:String(h).padStart(2,"0"), m:String(m).padStart(2,"0"), s:String(s).padStart(2,"0") });
    }
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);
  const units = [{ v: parts.d, l: "DAYS" },{ v: parts.h, l: "HRS" },{ v: parts.m, l: "MIN" },{ v: parts.s, l: "SEC" }];
  return (
    <div className="flex gap-2 justify-center">
      {units.map(({ v, l }) => (
        <div key={l} className="bg-card border border-white/6 rounded-xl px-3 py-2 min-w-[56px] text-center">
          <div className="font-orbitron font-black text-2xl text-gold leading-none drop-shadow-[0_0_12px_rgba(255,215,0,.5)]">{v}</div>
          <div className="text-[9px] text-muted tracking-widest mt-1">{l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Toast notifications ──────────────────────────────────────────────
type Toast = { id: string; title: string; msg: string; type: "goal" | "info" | "warn" };
function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed top-16 right-3 z-[9500] flex flex-col gap-2 w-[300px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ x: 320, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={cn(
              "pointer-events-auto flex gap-3 items-start rounded-lg p-3 border backdrop-blur-xl cursor-pointer",
              "bg-card2/95 border-white/10",
              t.type === "goal" && "border-l-[3px] border-l-gold shadow-gold",
              t.type === "info" && "border-l-[3px] border-l-green shadow-green",
              t.type === "warn" && "border-l-[3px] border-l-red",
            )}
            onClick={() => dismiss(t.id)}
          >
            <span className="text-xl shrink-0">{t.type === "goal" ? "⚽" : t.type === "warn" ? "⚠️" : "ℹ️"}</span>
            <div className="flex-1 min-w-0">
              <div className="font-rajdhani font-bold text-sm">{t.title}</div>
              <div className="text-xs text-muted mt-0.5 leading-snug">{t.msg}</div>
            </div>
            <button className="text-muted hover:text-white text-sm shrink-0" onClick={() => dismiss(t.id)}>×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Live Match Card ──────────────────────────────────────────────────
function LiveCard({ match, onGoal }: { match: LiveMatch; onGoal?: () => void }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef({ h: match.homeScore, a: match.awayScore });

  useEffect(() => {
    if (prevScore.current.h !== match.homeScore || prevScore.current.a !== match.awayScore) {
      setFlash(true); setTimeout(() => setFlash(false), 700);
      prevScore.current = { h: match.homeScore, a: match.awayScore };
      onGoal?.();
    }
  }, [match.homeScore, match.awayScore, onGoal]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl p-4 border cursor-pointer overflow-hidden",
        "bg-card border-green/20 hover:border-green/40 transition-all duration-200 hover:-translate-y-0.5",
        flash && "animate-goal-flash",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <LiveDot /><span className="text-green font-bold text-[10px] tracking-widest">LIVE</span>
        </div>
        <span className="text-[10px] text-muted">GRP {match.group} · {match.minute}&apos;</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{FLAGS[match.home] ?? "🏳"}</span>
          <span className="font-rajdhani font-bold text-sm text-center leading-tight">{match.home}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className={cn("font-orbitron font-black text-3xl text-gold leading-none", flash && "animate-score-flip")}>
            {match.homeScore} <span className="text-muted font-light">:</span> {match.awayScore}
          </div>
          <div className="text-[10px] text-green">⏱ {match.minute}&apos;</div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{FLAGS[match.away] ?? "🏳"}</span>
          <span className="font-rajdhani font-bold text-sm text-center leading-tight">{match.away}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fixture Card ─────────────────────────────────────────────────────
function FixtureCard({
  fixture, watched, onWatch, onAnalyse,
}: {
  fixture: Fixture; watched: boolean;
  onWatch: () => void; onAnalyse: () => void;
}) {
  const d = new Date(fixture.date + "T12:00:00");
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 3 }}
      className={cn(
        "bg-card border border-white/6 rounded-xl px-4 py-3",
        "grid grid-cols-[52px_1fr_80px] gap-3 items-center cursor-pointer",
        "hover:border-white/12 hover:bg-card2 transition-all",
        watched && "border-l-[3px] border-l-gold",
      )}
      onClick={onAnalyse}
    >
      <div className="flex flex-col items-center">
        <span className="text-[9px] text-muted tracking-wider">{MONTHS[d.getMonth()]}</span>
        <span className="font-orbitron font-bold text-lg leading-tight">{d.getDate()}</span>
        <span className="text-[9px] text-muted">{fixture.time}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{FLAGS[fixture.home] ?? "🏳"}</span>
          <span className="font-rajdhani font-semibold text-sm">{fixture.home}</span>
        </div>
        <span className="text-muted text-xs px-1">VS</span>
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <span className="text-base">{FLAGS[fixture.away] ?? "🏳"}</span>
          <span className="font-rajdhani font-semibold text-sm">{fixture.away}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge label={`GRP ${fixture.group} · ${fixture.matchday}`} variant="blue" />
        <button
          className={cn("text-sm transition-colors", watched ? "text-gold" : "text-muted hover:text-gold")}
          onClick={(e) => { e.stopPropagation(); onWatch(); }}
          title="Watchlist"
        >★</button>
        <span className="text-[9px] text-muted text-right leading-tight max-w-[80px]">
          {fixture.venue.split(",")[0]}
        </span>
      </div>
    </motion.div>
  );
}

// ─── AI Chat ──────────────────────────────────────────────────────────
function AiChat({ initialQuestion }: { initialQuestion?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "ai", ts: Date.now(),
    content: "Welcome! I'm your 2026 World Cup analyst. Ask me about any match, team tactics, score predictions, or tournament analysis. ⚽",
  }]);
  const [input, setInput] = useState(initialQuestion ?? "");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (initialQuestion) { setInput(initialQuestion); } }, [initialQuestion]);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: msg, ts: Date.now() }]);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages.slice(-6) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply ?? "Sorry, I couldn't generate a response.", ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "⚠️ Connection error. Please try again.", ts: Date.now() }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  const QUICK = [
    "🏆 Who will win the 2026 World Cup?",
    "💀 Which is the Group of Death?",
    "⭐ Top 5 players to watch?",
    "🌙 Best dark horse teams?",
    "⚽ Key tactical trends expected?",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar */}
      <div className="space-y-3">
        <div className="bg-card border border-white/6 rounded-xl p-4">
          <p className="text-xs text-muted font-rajdhani font-bold tracking-wider mb-3">💬 QUICK QUESTIONS</p>
          {QUICK.map(q => (
            <button key={q}
              className="w-full text-left bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 rounded-lg px-3 py-2 text-xs mb-2 last:mb-0 transition-all"
              onClick={() => send(q)}
            >{q}</button>
          ))}
        </div>
        <div className="bg-card border border-white/6 rounded-xl p-4">
          <p className="text-xs text-muted mb-2">⚡ Match Analyser</p>
          <select
            className="w-full bg-card2 border border-white/8 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-gold/30"
            onChange={e => {
              const fx = FIXTURES.find(f => f.id === Number(e.target.value));
              if (fx) send(`Analyse and predict: ${fx.home} vs ${fx.away} (Group ${fx.group}, ${fx.date})`);
            }}
          >
            <option value="">Select a match...</option>
            {GROUPS.map(g =>
              <optgroup key={g.letter} label={`Group ${g.letter}`}>
                {FIXTURES.filter(f => f.group === g.letter).map(f =>
                  <option key={f.id} value={f.id}>{FLAGS[f.home] ?? ""} {f.home} vs {f.away} {FLAGS[f.away] ?? ""}</option>
                )}
              </optgroup>
            )}
          </select>
        </div>
      </div>
      {/* Chat */}
      <div className="bg-card border border-white/6 rounded-xl flex flex-col h-[520px]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
          <Bot size={18} className="text-gold" />
          <div>
            <div className="font-rajdhani font-bold text-sm">World Cup AI Analyst</div>
            <div className="text-[10px] text-green flex items-center gap-1"><LiveDot />Powered by Claude Sonnet 4</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("max-w-[90%]", m.role === "user" ? "self-end" : "self-start")}
              >
                <div className="text-[9px] text-muted mb-1 font-bold tracking-wider">
                  {m.role === "ai" ? "🤖 CLAUDE AI" : "👤 YOU"}
                </div>
                <div className={cn(
                  "rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "bg-card2 border border-white/6 rounded-tl-sm"
                    : "bg-red/15 border border-red/20 rounded-tr-sm",
                )}>
                  {m.content.split("\n").map((line, j) => <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start">
              <div className="bg-card2 border border-white/6 rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-white/6 flex gap-2">
          <textarea
            rows={1} value={input}
            className="flex-1 bg-card2 border border-white/8 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/30 resize-none max-h-20"
            placeholder="Ask about any match, team, or player..."
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button
            onClick={() => send()}
            className="bg-red hover:bg-[#e53935] rounded-lg w-9 h-9 flex items-center justify-center transition-all hover:shadow-red shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<Tab>("live");
  const [live, setLive] = useState<LiveMatch[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [demoMatches, setDemoMatches] = useState<LiveMatch[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [grpFilter, setGrpFilter] = useState("all");
  const [aiQuestion, setAiQuestion] = useState<string | undefined>();
  const [clock, setClock] = useState("");
  const [predInputs, setPredInputs] = useState<Record<number, { h: string; a: string }>>({});
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setClock(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Toast helpers
  const toast = useCallback((title: string, msg: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5500);
  }, []);
  const dismiss = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("wc26_preds");
    if (saved) setPredictions(JSON.parse(saved));
    const wl = localStorage.getItem("wc26_watch");
    if (wl) setWatchlist(JSON.parse(wl));
    setTimeout(() => toast("⚽ World Cup 2026", "Opens June 11 · Click 🔔 for goal alerts", "info"), 800);
    setTimeout(() => toast("💡 Tip", "Star ★ any fixture to add to your watchlist", "info"), 3000);
  }, [toast]);

  // SSE for real-time scores
  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/events");
      sseRef.current = es;
      es.addEventListener("init",   (e) => { const d = JSON.parse(e.data); if (d.live?.length) setLive(d.live); });
      es.addEventListener("update", (e) => { const d = JSON.parse(e.data); if (d.live?.length) setLive(d.live); });
      es.addEventListener("goal",   (e) => {
        const { fixture: m } = JSON.parse(e.data);
        toast(`⚽ GOAL! ${m.home} ${m.homeScore}–${m.awayScore} ${m.away}`, "", "goal");
        launchConfetti(); playGoalSFX();
        if (notifEnabled) new Notification("⚽ GOAL", { body: `${m.home} ${m.homeScore}–${m.awayScore} ${m.away}` });
      });
      es.addEventListener("reconnect", () => { es.close(); setTimeout(connect, 1000); });
      es.onerror = () => { es.close(); setTimeout(connect, 8000); };
    }
    connect();
    return () => { sseRef.current?.close(); };
  }, [toast, notifEnabled]);

  // Demo mode
  const DEMO_INIT: LiveMatch[] = [
    { id:"d1", group:"A", home:"Mexico",    away:"South Africa", homeScore:2, awayScore:1, minute:67, status:"live" },
    { id:"d2", group:"C", home:"Brazil",    away:"Morocco",      homeScore:1, awayScore:1, minute:38, status:"live" },
    { id:"d3", group:"J", home:"Argentina", away:"Algeria",      homeScore:3, awayScore:0, minute:82, status:"live" },
  ];
  function toggleDemo() {
    if (demoMode) {
      setDemoMode(false); setDemoMatches([]);
      if (demoTimer.current) clearInterval(demoTimer.current);
      toast("⏹ Demo stopped", "", "info");
    } else {
      setDemoMode(true);
      setDemoMatches(JSON.parse(JSON.stringify(DEMO_INIT)));
      toast("🎮 Demo Mode", "Simulating 3 live matches", "info");
      demoTimer.current = setInterval(() => {
        setDemoMatches(prev => prev.map(m => {
          const r = Math.random();
          const newMin = Math.min(m.minute + Math.floor(Math.random() * 2 + 1), 90);
          if (r < 0.18) {
            const isHome = Math.random() > 0.45;
            return { ...m, minute: newMin, homeScore: isHome ? m.homeScore + 1 : m.homeScore, awayScore: isHome ? m.awayScore : m.awayScore + 1 };
          }
          return { ...m, minute: newMin };
        }));
      }, 7000);
    }
  }

  // Watchlist
  function toggleWatch(id: number) {
    setWatchlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("wc26_watch", JSON.stringify(next));
      toast(prev.includes(id) ? "Removed from watchlist" : "⭐ Added to watchlist", "", "info");
      return next;
    });
  }

  // Predictions
  function savePred(id: number) {
    const inp = predInputs[id];
    if (!inp || inp.h === "" || inp.a === "") { toast("Enter both scores","","warn"); return; }
    const pred: Prediction = { fixtureId: id, homeScore: Number(inp.h), awayScore: Number(inp.a), savedAt: Date.now() };
    setPredictions(prev => { const n = { ...prev, [id]: pred }; localStorage.setItem("wc26_preds", JSON.stringify(n)); return n; });
    fetch("/api/predictions", { method:"POST", headers:{"Content-Type":"application/json","x-user-id":USER_ID}, body: JSON.stringify({ fixtureId: id, homeScore: pred.homeScore, awayScore: pred.awayScore }) }).catch(() => {});
    toast(`🎯 Prediction saved`, `${FIXTURES.find(f=>f.id===id)?.home} ${pred.homeScore}–${pred.awayScore} ${FIXTURES.find(f=>f.id===id)?.away}`, "info");
  }

  // Notifications
  async function toggleNotifs() {
    if (notifEnabled) { setNotifEnabled(false); toast("🔕 Notifications off","","info"); return; }
    if (!("Notification" in window)) { toast("Not supported","","warn"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { setNotifEnabled(true); toast("🔔 Notifications on","You'll get live goal alerts","info"); }
    else toast("Notifications blocked","Allow in browser settings","warn");
  }

  const displayMatches = demoMode ? demoMatches : live;
  const filteredFixtures = FIXTURES.filter(f => {
    if (grpFilter !== "all" && f.group !== grpFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!f.home.toLowerCase().includes(s) && !f.away.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  // Group by date
  const byDate: Record<string, Fixture[]> = {};
  filteredFixtures.forEach(f => { (byDate[f.date] = byDate[f.date] ?? []).push(f); });
  const dates = Object.keys(byDate).sort();

  const savedPredCount = Object.keys(predictions).length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:"live",    label:"LIVE",     icon:<Radio size={14}/>     },
    { id:"fixtures",label:"FIXTURES", icon:<Calendar size={14}/>  },
    { id:"groups",  label:"GROUPS",   icon:<BarChart2 size={14}/> },
    { id:"predict", label:"AI PICK",  icon:<Bot size={14}/>       },
    { id:"picks",   label:`MY PICKS ${savedPredCount > 0 ? `(${savedPredCount})` : ""}`, icon:<Target size={14}/> },
    { id:"bracket", label:"BRACKET",  icon:<Trophy size={14}/>    },
  ];

  return (
    <div className="min-h-screen relative z-10">
      <canvas id="confetti-canvas" />
      <ToastStack toasts={toasts} dismiss={dismiss} />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-[600] h-14 bg-bg/92 backdrop-blur-2xl border-b border-white/6 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl animate-spin-slow inline-block">⚽</span>
          <span className="font-orbitron font-black text-sm tracking-widest hidden sm:inline">
            <span className="text-gold">WORLD</span><span className="text-red">CUP</span><span className="text-white/80"> 2026</span>
          </span>
        </div>

        <nav className="flex-1 flex gap-0.5 overflow-x-auto scrollbar-none">
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-rajdhani font-bold tracking-wider whitespace-nowrap transition-all shrink-0",
                tab === t.id
                  ? "text-gold bg-gold/8 shadow-[inset_0_-2px_0_#ffd700]"
                  : "text-muted hover:text-white hover:bg-white/4",
              )}
            >{t.icon}{t.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {(displayMatches.length > 0) && (
            <div className="flex items-center gap-1.5 bg-green/10 border border-green/25 rounded-full px-2.5 py-1 text-green text-[10px] font-bold tracking-widest">
              <LiveDot /><span className="hidden sm:inline">LIVE</span>
            </div>
          )}
          <button onClick={toggleNotifs} className="p-1.5 border border-white/8 rounded-lg hover:bg-white/4 transition-all">
            {notifEnabled ? <Bell size={14} className="text-gold" /> : <BellOff size={14} className="text-muted" />}
          </button>
          <span className="font-orbitron text-[10px] text-muted tracking-wider hidden md:inline">{clock}</span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative border-b border-white/6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg2/95 to-bg/98 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center hidden md:block">
            <div className="text-5xl animate-trophy inline-block">🏆</div>
            <div className="text-[10px] text-muted tracking-[0.2em] mt-2 font-rajdhani font-bold">THE GREATEST SHOW</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] text-muted tracking-widest font-rajdhani font-bold mb-1.5">⏱ TOURNAMENT OPENS IN</div>
            <Countdown />
            <div className="text-[10px] text-muted mt-2 text-center">🗓 JUN 11 – JUL 19 · USA · CANADA · MEXICO</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["48","TEAMS"],["104","MATCHES"],["16","VENUES"]].map(([n, l]) => (
              <div key={l} className="bg-card border border-white/6 rounded-xl p-2.5 text-center">
                <div className="font-orbitron font-black text-2xl text-gold leading-none drop-shadow-[0_0_8px_rgba(255,215,0,.4)]">{n}</div>
                <div className="text-[9px] text-muted tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-5xl mx-auto px-4 py-5 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

            {/* ── LIVE TAB ── */}
            {tab === "live" && (
              <div>
                <SectionTitle icon={<Radio size={16} className="text-red" />} label="Live Scores" sub={demoMode ? "● DEMO ACTIVE" : "Real-time via SSE"} />
                <div className="flex gap-2 mb-4">
                  <button onClick={toggleDemo}
                    className={cn("px-4 py-1.5 rounded-lg font-rajdhani font-bold text-sm border transition-all",
                      demoMode ? "bg-green/10 border-green/30 text-green" : "bg-red/10 border-red/25 text-[#c41e3a] hover:bg-red/15")}
                  >{demoMode ? "⏹ Stop Demo" : "▶ Demo Mode"}</button>
                  <button onClick={async () => { await fetch("/api/cron", {method:"GET"}); toast("Refreshed","","info"); }}
                    className="px-3 py-1.5 border border-white/8 rounded-lg text-muted hover:text-white hover:border-white/15 transition-all"
                  ><RefreshCw size={13} /></button>
                </div>

                {displayMatches.length === 0 ? (
                  <div className="bg-card border border-white/6 rounded-xl p-12 text-center">
                    <div className="text-4xl mb-3 opacity-30">⏰</div>
                    <p className="text-muted text-sm leading-relaxed mb-4">No matches live.<br />Tournament opens <span className="text-gold font-bold">June 11, 2026</span>.</p>
                    <button onClick={toggleDemo} className="bg-red/90 hover:bg-red text-white font-rajdhani font-bold px-5 py-2 rounded-lg text-sm transition-all">
                      ▶ Preview with Demo Mode
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayMatches.map(m => (
                      <LiveCard key={m.id} match={m}
                        onGoal={() => { launchConfetti(); playGoalSFX(); toast("⚽ GOAL!","goal","goal"); }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── FIXTURES TAB ── */}
            {tab === "fixtures" && (
              <div>
                <SectionTitle icon={<Calendar size={16} className="text-blue" />} label="Match Fixtures" sub="72 group stage matches" />
                <div className="flex gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-card border border-white/8 rounded-full px-3 py-1.5 flex-1 min-w-[160px] max-w-xs">
                    <Search size={12} className="text-muted shrink-0" />
                    <input className="bg-transparent text-sm outline-none w-full placeholder:text-muted" placeholder="Search team..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button onClick={() => setSearch("")}><X size={12} className="text-muted hover:text-white" /></button>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {["all","A","B","C","D","E","F","G","H","I","J","K","L"].map(g => (
                    <button key={g} onClick={() => setGrpFilter(g)}
                      className={cn("px-2.5 py-1 rounded-full text-[11px] font-rajdhani font-bold tracking-wider border transition-all",
                        grpFilter === g ? "border-gold text-gold bg-gold/6" : "border-white/8 text-muted hover:border-white/15 hover:text-white")}
                    >{g === "all" ? "ALL" : `GRP ${g}`}</button>
                  ))}
                </div>
                <div className="space-y-4">
                  {dates.map(dt => {
                    const d = new Date(dt + "T12:00:00");
                    return (
                      <div key={dt}>
                        <div className="text-[11px] text-muted font-rajdhani font-bold tracking-wider pl-1 mb-2 border-l-2 border-red">
                          {DAYS[d.getDay()]}, {MONTHS[d.getMonth()]} {d.getDate()}
                        </div>
                        <div className="space-y-1.5">
                          {byDate[dt].map(f => (
                            <FixtureCard key={f.id} fixture={f} watched={watchlist.includes(f.id)}
                              onWatch={() => toggleWatch(f.id)}
                              onAnalyse={() => { setAiQuestion(`Analyse and predict: ${f.home} vs ${f.away} at ${f.venue} on ${f.date} (Group ${f.group})`); setTab("predict"); }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {dates.length === 0 && <p className="text-center text-muted py-12">No matches found.</p>}
                </div>
              </div>
            )}

            {/* ── GROUPS TAB ── */}
            {tab === "groups" && (
              <div>
                <SectionTitle icon={<BarChart2 size={16} className="text-purple" />} label="Group Standings" sub="Top 2 + 8 best 3rd advance" />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {GROUPS.map(g => (
                    <div key={g.letter} className="bg-card border border-white/6 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 bg-gold/3">
                        <span className="font-orbitron font-black text-gold">GROUP {g.letter}</span>
                        {g.host && <Badge label={`🏠 ${g.host.toUpperCase()}`} variant="red" />}
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-muted text-[10px] tracking-wider border-b border-white/6">
                            <th className="text-left px-2 py-1.5">TEAM</th>
                            <th>P</th><th>W</th><th>D</th><th>L</th>
                            <th>GD</th><th className="text-gold">PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.teams.map((team, i) => (
                            <tr key={team}
                              className={cn("border-b border-white/4 hover:bg-white/2 cursor-pointer transition-colors",
                                i === 1 && "border-b-green/40 border-b-2",
                                i === 2 && "border-b-green/20 border-b-dashed")}
                              onClick={() => { setSearch(team); setTab("fixtures"); }}
                              title="Click to see all fixtures"
                            >
                              <td className="px-2 py-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">{FLAGS[team] ?? "🏳"}</span>
                                  <span className="font-rajdhani font-semibold text-[11px]">{team}</span>
                                  {i < 2 && <Badge label="Q" variant="green" />}
                                </div>
                              </td>
                              <td className="text-center">0</td><td className="text-center">0</td>
                              <td className="text-center">0</td><td className="text-center">0</td>
                              <td className="text-center">0</td>
                              <td className="text-center font-orbitron font-bold text-gold">0</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── AI PREDICT TAB ── */}
            {tab === "predict" && (
              <div>
                <SectionTitle icon={<Bot size={16} className="text-purple" />} label="AI Analyst" sub="Claude Sonnet 4 · Tactical analysis & predictions" />
                <AiChat initialQuestion={aiQuestion} />
              </div>
            )}

            {/* ── MY PICKS TAB ── */}
            {tab === "picks" && (
              <div>
                <SectionTitle icon={<Target size={16} className="text-gold" />} label="My Predictions" sub={`${savedPredCount} saved · Click Save to lock in your score`} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                  {[
                    { n: savedPredCount, l: "PREDICTED",  c: "text-gold" },
                    { n: 0,              l: "CORRECT",    c: "text-green" },
                    { n: 0,              l: "PARTIAL",    c: "text-gold" },
                    { n: 0,              l: "POINTS",     c: "text-purple" },
                  ].map(({ n, l, c }) => (
                    <div key={l} className="bg-card border border-white/6 rounded-xl p-3 text-center">
                      <div className={cn("font-orbitron font-black text-2xl", c)}>{n}</div>
                      <div className="text-[9px] text-muted tracking-wider mt-1">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {FIXTURES.map(f => {
                    const pred = predictions[f.id];
                    return (
                      <motion.div key={f.id} layout
                        className={cn("bg-card border border-white/6 rounded-xl p-3.5 transition-all",
                          pred && "border-l-[3px] border-l-gold")}
                      >
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] text-muted">{f.date} · Grp {f.group} · {f.matchday}</span>
                          {pred && <Badge label="SAVED ✓" variant="gold" />}
                        </div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-1">
                            <span>{FLAGS[f.home] ?? "🏳"}</span>
                            <span className="font-rajdhani font-semibold text-sm">{f.home}</span>
                          </div>
                          <span className="text-muted text-xs">vs</span>
                          <div className="flex items-center gap-1.5 flex-1 justify-end flex-row-reverse">
                            <span>{FLAGS[f.away] ?? "🏳"}</span>
                            <span className="font-rajdhani font-semibold text-sm">{f.away}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <input type="number" min="0" max="20"
                            value={predInputs[f.id]?.h ?? pred?.homeScore ?? ""}
                            placeholder="0"
                            onChange={e => setPredInputs(prev => ({ ...prev, [f.id]: { ...prev[f.id], h: e.target.value, a: prev[f.id]?.a ?? "" }}))}
                            className="w-12 h-9 bg-card2 border border-white/8 rounded-lg text-center font-orbitron font-bold text-base outline-none focus:border-gold/35 transition-colors"
                          />
                          <span className="text-muted text-lg">:</span>
                          <input type="number" min="0" max="20"
                            value={predInputs[f.id]?.a ?? pred?.awayScore ?? ""}
                            placeholder="0"
                            onChange={e => setPredInputs(prev => ({ ...prev, [f.id]: { ...prev[f.id], h: prev[f.id]?.h ?? "", a: e.target.value }}))}
                            className="w-12 h-9 bg-card2 border border-white/8 rounded-lg text-center font-orbitron font-bold text-base outline-none focus:border-gold/35 transition-colors"
                          />
                          <button onClick={() => savePred(f.id)}
                            className={cn("px-3 py-1.5 rounded-lg font-rajdhani font-bold text-xs tracking-wider transition-all",
                              pred ? "bg-gold/10 border border-gold/30 text-gold hover:bg-gold/15" : "bg-red/90 hover:bg-red text-white")}
                          >{pred ? "✓ Update" : "Save"}</button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BRACKET TAB ── */}
            {tab === "bracket" && (
              <div>
                <SectionTitle icon={<Trophy size={16} className="text-gold" />} label="Knockout Bracket" sub="Begins June 28 · Final July 19, MetLife Stadium" />
                <div className="bg-card border border-gold/15 rounded-xl p-4 mb-4 text-sm text-muted leading-relaxed">
                  Group stage concludes <span className="text-gold font-bold">June 27</span>.
                  For the first time ever, the World Cup features a <span className="text-white font-bold">Round of 32</span> with 48 teams.
                  The <span className="text-red font-bold">Final</span> takes place at MetLife Stadium, New Jersey on <span className="text-gold font-bold">July 19</span>.
                </div>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-3 min-w-[900px]">
                    {KNOCKOUT_ROUNDS.map((round) => (
                      <div key={round.label} className="flex-1">
                        <div className="text-[10px] font-rajdhani font-bold tracking-widest text-muted text-center pb-2 border-b border-white/6 mb-2.5">
                          {round.label}
                          <div className="text-[9px] mt-0.5 text-muted/60">{round.dates}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: round.slots }).map((_, i) => (
                            <div key={i} className={cn("rounded-lg border overflow-hidden", round.label.includes("FINAL") ? "border-gold/25 bg-gold/3" : "border-white/6 bg-card")}>
                              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/6 text-xs text-muted">
                                <Shield size={10} />TBD
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted">
                                <Shield size={10} />TBD
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-rajdhani font-bold text-sm text-muted mb-3 tracking-wider">⭐ PLAYERS TO WATCH</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PLAYERS_TO_WATCH.map(p => (
                      <div key={p.name} className="bg-card border border-white/6 rounded-xl p-3 flex items-center gap-2 hover:border-white/12 transition-all cursor-pointer"
                        onClick={() => { setAiQuestion(`Tell me about ${p.name} at the 2026 World Cup`); setTab("predict"); }}
                      >
                        <span className="text-2xl shrink-0">{p.flag}</span>
                        <div>
                          <div className="font-rajdhani font-bold text-xs">{p.name}</div>
                          <div className="text-[10px] text-muted">{p.team}</div>
                          <div className="text-[9px] text-muted/70">{p.role}</div>
                        </div>
                        <ChevronRight size={12} className="text-muted ml-auto shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── TICKER BAR ── */}
      <AnimatePresence>
        {displayMatches.length > 0 && (
          <motion.div
            initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
            className="fixed bottom-0 left-0 right-0 z-[700] h-9 bg-bg/96 backdrop-blur-xl border-t border-white/6 flex items-center overflow-hidden"
          >
            <div className="bg-red shrink-0 h-full flex items-center px-3 gap-1.5">
              <LiveDot /><span className="font-orbitron font-bold text-[10px] tracking-widest text-white">LIVE</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="ticker-inner flex items-center gap-6 whitespace-nowrap">
                {[...displayMatches, ...displayMatches].map((m, i) => (
                  <div key={i} className="inline-flex items-center gap-2 text-xs px-2 border-r border-white/8">
                    <span>{FLAGS[m.home] ?? "🏳"} {m.home}</span>
                    <span className="font-orbitron font-bold text-gold">{m.homeScore} : {m.awayScore}</span>
                    <span>{FLAGS[m.away] ?? "🏳"} {m.away}</span>
                    <span className="text-green text-[10px]">{m.minute}&apos;</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
