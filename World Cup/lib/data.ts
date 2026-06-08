export type Fixture = {
  id: number;
  group: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
  matchday: "MD1" | "MD2" | "MD3";
  homeScore?: number;
  awayScore?: number;
  status?: "upcoming" | "live" | "ft";
  minute?: number;
};

export type Group = {
  letter: string;
  teams: string[];
  host?: string;
};

export type Standing = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string[];
};

export const FLAGS: Record<string, string> = {
  Mexico: "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", Czechia: "🇨🇿",
  Canada: "🇨🇦", "Bosnia & Herz.": "🇧🇦", Qatar: "🇶🇦", Switzerland: "🇨🇭",
  Brazil: "🇧🇷", Morocco: "🇲🇦", Haiti: "🇭🇹", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA: "🇺🇸", Paraguay: "🇵🇾", Australia: "🇦🇺", Turkey: "🇹🇷",
  Germany: "🇩🇪", "Curaçao": "🇨🇼", "Ivory Coast": "🇨🇮", Ecuador: "🇪🇨",
  Netherlands: "🇳🇱", Japan: "🇯🇵", Tunisia: "🇹🇳", Sweden: "🇸🇪",
  Belgium: "🇧🇪", Egypt: "🇪🇬", Iran: "🇮🇷", "New Zealand": "🇳🇿",
  Spain: "🇪🇸", "Cape Verde": "🇨🇻", Uruguay: "🇺🇾", "Saudi Arabia": "🇸🇦",
  France: "🇫🇷", Senegal: "🇸🇳", Norway: "🇳🇴", Iraq: "🇮🇶",
  Argentina: "🇦🇷", Algeria: "🇩🇿", Austria: "🇦🇹", Jordan: "🇯🇴",
  Portugal: "🇵🇹", Colombia: "🇨🇴", Uzbekistan: "🇺🇿", Jamaica: "🇯🇲",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croatia: "🇭🇷", Ghana: "🇬🇭", Panama: "🇵🇦",
};

export const GROUPS: Group[] = [
  { letter: "A", teams: ["Mexico", "South Africa", "South Korea", "Czechia"], host: "Mexico" },
  { letter: "B", teams: ["Canada", "Bosnia & Herz.", "Qatar", "Switzerland"], host: "Canada" },
  { letter: "C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { letter: "D", teams: ["USA", "Paraguay", "Australia", "Turkey"], host: "USA" },
  { letter: "E", teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"] },
  { letter: "F", teams: ["Netherlands", "Japan", "Tunisia", "Sweden"] },
  { letter: "G", teams: ["Belgium", "Egypt", "Iran", "New Zealand"] },
  { letter: "H", teams: ["Spain", "Cape Verde", "Uruguay", "Saudi Arabia"] },
  { letter: "I", teams: ["France", "Senegal", "Norway", "Iraq"] },
  { letter: "J", teams: ["Argentina", "Algeria", "Austria", "Jordan"] },
  { letter: "K", teams: ["Portugal", "Colombia", "Uzbekistan", "Jamaica"] },
  { letter: "L", teams: ["England", "Croatia", "Ghana", "Panama"] },
];

export const FIXTURES: Fixture[] = [
  // GROUP A
  { id:1,  group:"A", home:"Mexico",       away:"South Africa", date:"2026-06-11", time:"15:00 ET", venue:"Estadio Azteca, Mexico City",          matchday:"MD1" },
  { id:2,  group:"A", home:"South Korea",  away:"Czechia",      date:"2026-06-11", time:"22:00 ET", venue:"Estadio Akron, Guadalajara",            matchday:"MD1" },
  { id:3,  group:"A", home:"Mexico",       away:"South Korea",  date:"2026-06-15", time:"22:00 ET", venue:"SoFi Stadium, Los Angeles",             matchday:"MD2" },
  { id:4,  group:"A", home:"Czechia",      away:"South Africa", date:"2026-06-15", time:"15:00 ET", venue:"Lumen Field, Seattle",                  matchday:"MD2" },
  { id:5,  group:"A", home:"South Africa", away:"South Korea",  date:"2026-06-19", time:"22:00 ET", venue:"Rose Bowl, Los Angeles",                matchday:"MD3" },
  { id:6,  group:"A", home:"Czechia",      away:"Mexico",       date:"2026-06-19", time:"22:00 ET", venue:"AT&T Stadium, Dallas",                  matchday:"MD3" },
  // GROUP B
  { id:7,  group:"B", home:"Canada",        away:"Bosnia & Herz.", date:"2026-06-12", time:"15:00 ET", venue:"BMO Field, Toronto",                 matchday:"MD1" },
  { id:8,  group:"B", home:"Qatar",         away:"Switzerland",    date:"2026-06-13", time:"15:00 ET", venue:"Levi's Stadium, Santa Clara",        matchday:"MD1" },
  { id:9,  group:"B", home:"Canada",        away:"Qatar",          date:"2026-06-17", time:"22:00 ET", venue:"BC Place, Vancouver",                matchday:"MD2" },
  { id:10, group:"B", home:"Switzerland",   away:"Bosnia & Herz.", date:"2026-06-17", time:"15:00 ET", venue:"Lincoln Financial Field, Philadelphia", matchday:"MD2" },
  { id:11, group:"B", home:"Bosnia & Herz.",away:"Qatar",          date:"2026-06-21", time:"15:00 ET", venue:"Arrowhead Stadium, Kansas City",     matchday:"MD3" },
  { id:12, group:"B", home:"Switzerland",   away:"Canada",         date:"2026-06-21", time:"15:00 ET", venue:"SoFi Stadium, Los Angeles",          matchday:"MD3" },
  // GROUP C
  { id:13, group:"C", home:"Brazil",   away:"Morocco",  date:"2026-06-13", time:"18:00 ET", venue:"MetLife Stadium, East Rutherford NJ", matchday:"MD1" },
  { id:14, group:"C", home:"Haiti",    away:"Scotland", date:"2026-06-13", time:"21:00 ET", venue:"Gillette Stadium, Foxborough MA",     matchday:"MD1" },
  { id:15, group:"C", home:"Brazil",   away:"Haiti",    date:"2026-06-17", time:"21:00 ET", venue:"AT&T Stadium, Dallas",                matchday:"MD2" },
  { id:16, group:"C", home:"Scotland", away:"Morocco",  date:"2026-06-17", time:"18:00 ET", venue:"Mercedes-Benz Stadium, Atlanta",      matchday:"MD2" },
  { id:17, group:"C", home:"Morocco",  away:"Haiti",    date:"2026-06-21", time:"21:00 ET", venue:"Rose Bowl, Los Angeles",              matchday:"MD3" },
  { id:18, group:"C", home:"Scotland", away:"Brazil",   date:"2026-06-21", time:"21:00 ET", venue:"NRG Stadium, Houston",                matchday:"MD3" },
  // GROUP D
  { id:19, group:"D", home:"USA",       away:"Paraguay", date:"2026-06-12", time:"21:00 ET", venue:"SoFi Stadium, Inglewood CA",          matchday:"MD1" },
  { id:20, group:"D", home:"Australia", away:"Turkey",   date:"2026-06-13", time:"21:00 ET", venue:"BC Place, Vancouver",                 matchday:"MD1" },
  { id:21, group:"D", home:"USA",       away:"Australia",date:"2026-06-17", time:"21:00 ET", venue:"Arrowhead Stadium, Kansas City",      matchday:"MD2" },
  { id:22, group:"D", home:"Turkey",    away:"Paraguay", date:"2026-06-17", time:"15:00 ET", venue:"Gillette Stadium, Foxborough MA",     matchday:"MD2" },
  { id:23, group:"D", home:"Paraguay",  away:"Australia",date:"2026-06-22", time:"15:00 ET", venue:"Estadio Azteca, Mexico City",         matchday:"MD3" },
  { id:24, group:"D", home:"Turkey",    away:"USA",      date:"2026-06-22", time:"15:00 ET", venue:"Lincoln Financial Field, Philadelphia",matchday:"MD3" },
  // GROUP E
  { id:25, group:"E", home:"Germany",      away:"Ivory Coast", date:"2026-06-20", time:"16:00 ET", venue:"BMO Field, Toronto",                   matchday:"MD1" },
  { id:26, group:"E", home:"Curaçao",      away:"Ecuador",     date:"2026-06-20", time:"20:00 ET", venue:"Arrowhead Stadium, Kansas City",        matchday:"MD1" },
  { id:27, group:"E", home:"Germany",      away:"Curaçao",     date:"2026-06-24", time:"22:00 ET", venue:"NRG Stadium, Houston",                  matchday:"MD2" },
  { id:28, group:"E", home:"Ecuador",      away:"Ivory Coast", date:"2026-06-24", time:"19:00 ET", venue:"Lincoln Financial Field, Philadelphia", matchday:"MD2" },
  { id:29, group:"E", home:"Ivory Coast",  away:"Germany",     date:"2026-06-28", time:"18:00 ET", venue:"MetLife Stadium, East Rutherford NJ",   matchday:"MD3" },
  { id:30, group:"E", home:"Ecuador",      away:"Curaçao",     date:"2026-06-28", time:"18:00 ET", venue:"Estadio BBVA, Monterrey",               matchday:"MD3" },
  // GROUP F
  { id:31, group:"F", home:"Netherlands", away:"Sweden",      date:"2026-06-20", time:"13:00 ET", venue:"NRG Stadium, Houston",           matchday:"MD1" },
  { id:32, group:"F", home:"Tunisia",     away:"Japan",       date:"2026-06-21", time:"01:00 ET", venue:"Estadio Jalisco, Guadalajara",   matchday:"MD1" },
  { id:33, group:"F", home:"Netherlands", away:"Japan",       date:"2026-06-25", time:"16:00 ET", venue:"AT&T Stadium, Dallas",           matchday:"MD2" },
  { id:34, group:"F", home:"Sweden",      away:"Tunisia",     date:"2026-06-25", time:"20:00 ET", venue:"Estadio Jalisco, Guadalajara",   matchday:"MD2" },
  { id:35, group:"F", home:"Japan",       away:"Sweden",      date:"2026-06-29", time:"18:00 ET", venue:"SoFi Stadium, Los Angeles",      matchday:"MD3" },
  { id:36, group:"F", home:"Tunisia",     away:"Netherlands", date:"2026-06-29", time:"18:00 ET", venue:"MetLife Stadium, East Rutherford NJ", matchday:"MD3" },
  // GROUP G
  { id:37, group:"G", home:"Belgium",     away:"Iran",        date:"2026-06-21", time:"15:00 ET", venue:"SoFi Stadium, Inglewood CA",     matchday:"MD1" },
  { id:38, group:"G", home:"New Zealand", away:"Egypt",       date:"2026-06-21", time:"21:00 ET", venue:"BC Place, Vancouver",            matchday:"MD1" },
  { id:39, group:"G", home:"Belgium",     away:"New Zealand", date:"2026-06-25", time:"22:00 ET", venue:"Arrowhead Stadium, Kansas City", matchday:"MD2" },
  { id:40, group:"G", home:"Egypt",       away:"Iran",        date:"2026-06-25", time:"15:00 ET", venue:"BMO Field, Toronto",             matchday:"MD2" },
  { id:41, group:"G", home:"Iran",        away:"New Zealand", date:"2026-06-29", time:"15:00 ET", venue:"Gillette Stadium, Foxborough MA",matchday:"MD3" },
  { id:42, group:"G", home:"Egypt",       away:"Belgium",     date:"2026-06-29", time:"15:00 ET", venue:"Lincoln Financial Field, Philadelphia", matchday:"MD3" },
  // GROUP H
  { id:43, group:"H", home:"Spain",       away:"Saudi Arabia",date:"2026-06-21", time:"12:00 ET", venue:"Mercedes-Benz Stadium, Atlanta", matchday:"MD1" },
  { id:44, group:"H", home:"Uruguay",     away:"Cape Verde",  date:"2026-06-21", time:"18:00 ET", venue:"Hard Rock Stadium, Miami",       matchday:"MD1" },
  { id:45, group:"H", home:"Spain",       away:"Uruguay",     date:"2026-06-25", time:"22:00 ET", venue:"NRG Stadium, Houston",           matchday:"MD2" },
  { id:46, group:"H", home:"Cape Verde",  away:"Saudi Arabia",date:"2026-06-25", time:"15:00 ET", venue:"BC Place, Vancouver",            matchday:"MD2" },
  { id:47, group:"H", home:"Saudi Arabia",away:"Uruguay",     date:"2026-06-29", time:"21:00 ET", venue:"Rose Bowl, Los Angeles",         matchday:"MD3" },
  { id:48, group:"H", home:"Cape Verde",  away:"Spain",       date:"2026-06-29", time:"21:00 ET", venue:"MetLife Stadium, East Rutherford NJ", matchday:"MD3" },
  // GROUP I
  { id:49, group:"I", home:"France",  away:"Norway",   date:"2026-06-13", time:"18:00 ET", venue:"Gillette Stadium, Foxborough MA",     matchday:"MD1" },
  { id:50, group:"I", home:"Iraq",    away:"Senegal",  date:"2026-06-16", time:"18:00 ET", venue:"BMO Field, Toronto",                  matchday:"MD1" },
  { id:51, group:"I", home:"France",  away:"Iraq",     date:"2026-06-22", time:"17:00 ET", venue:"Lincoln Financial Field, Philadelphia",matchday:"MD2" },
  { id:52, group:"I", home:"Norway",  away:"Senegal",  date:"2026-06-22", time:"20:00 ET", venue:"MetLife Stadium, East Rutherford NJ", matchday:"MD2" },
  { id:53, group:"I", home:"Norway",  away:"France",   date:"2026-06-26", time:"15:00 ET", venue:"Gillette Stadium, Foxborough MA",     matchday:"MD3" },
  { id:54, group:"I", home:"Senegal", away:"Iraq",     date:"2026-06-26", time:"15:00 ET", venue:"BMO Field, Toronto",                  matchday:"MD3" },
  // GROUP J
  { id:55, group:"J", home:"Argentina",away:"Algeria", date:"2026-06-16", time:"21:00 ET", venue:"Arrowhead Stadium, Kansas City",  matchday:"MD1" },
  { id:56, group:"J", home:"Austria",  away:"Jordan",  date:"2026-06-17", time:"01:00 ET", venue:"Levi's Stadium, Santa Clara",     matchday:"MD1" },
  { id:57, group:"J", home:"Argentina",away:"Austria", date:"2026-06-22", time:"13:00 ET", venue:"AT&T Stadium, Dallas",            matchday:"MD2" },
  { id:58, group:"J", home:"Jordan",   away:"Algeria", date:"2026-06-22", time:"23:00 ET", venue:"Levi's Stadium, Santa Clara",     matchday:"MD2" },
  { id:59, group:"J", home:"Algeria",  away:"Austria", date:"2026-06-26", time:"21:00 ET", venue:"Rose Bowl, Los Angeles",          matchday:"MD3" },
  { id:60, group:"J", home:"Jordan",   away:"Argentina",date:"2026-06-26",time:"21:00 ET", venue:"BC Place, Vancouver",             matchday:"MD3" },
  // GROUP K
  { id:61, group:"K", home:"Portugal",   away:"Colombia",  date:"2026-06-23", time:"20:00 ET", venue:"SoFi Stadium, Inglewood CA",      matchday:"MD1" },
  { id:62, group:"K", home:"Uzbekistan", away:"Jamaica",   date:"2026-06-23", time:"16:00 ET", venue:"Arrowhead Stadium, Kansas City",  matchday:"MD1" },
  { id:63, group:"K", home:"Portugal",   away:"Uzbekistan",date:"2026-06-27", time:"20:00 ET", venue:"AT&T Stadium, Dallas",            matchday:"MD2" },
  { id:64, group:"K", home:"Jamaica",    away:"Colombia",  date:"2026-06-27", time:"17:00 ET", venue:"Mercedes-Benz Stadium, Atlanta",  matchday:"MD2" },
  { id:65, group:"K", home:"Colombia",   away:"Uzbekistan",date:"2026-07-01", time:"21:00 ET", venue:"NRG Stadium, Houston",            matchday:"MD3" },
  { id:66, group:"K", home:"Jamaica",    away:"Portugal",  date:"2026-07-01", time:"21:00 ET", venue:"Hard Rock Stadium, Miami",        matchday:"MD3" },
  // GROUP L
  { id:67, group:"L", home:"England", away:"Croatia", date:"2026-06-18", time:"21:00 ET", venue:"AT&T Stadium, Dallas",               matchday:"MD1" },
  { id:68, group:"L", home:"Ghana",   away:"Panama",  date:"2026-06-18", time:"15:00 ET", venue:"NRG Stadium, Houston",               matchday:"MD1" },
  { id:69, group:"L", home:"England", away:"Ghana",   date:"2026-06-22", time:"22:00 ET", venue:"Mercedes-Benz Stadium, Atlanta",      matchday:"MD2" },
  { id:70, group:"L", home:"Panama",  away:"Croatia", date:"2026-06-22", time:"19:00 ET", venue:"Hard Rock Stadium, Miami",            matchday:"MD2" },
  { id:71, group:"L", home:"Croatia", away:"Ghana",   date:"2026-06-26", time:"18:00 ET", venue:"Levi's Stadium, Santa Clara",         matchday:"MD3" },
  { id:72, group:"L", home:"Panama",  away:"England", date:"2026-06-26", time:"18:00 ET", venue:"Rose Bowl, Los Angeles",              matchday:"MD3" },
];

export function getFixturesByGroup(group: string) {
  return FIXTURES.filter((f) => f.group === group);
}

export function getInitialStandings(group: string): Standing[] {
  const g = GROUPS.find((g) => g.letter === group);
  if (!g) return [];
  return g.teams.map((t) => ({
    team: t, played: 0, won: 0, drawn: 0, lost: 0,
    gf: 0, ga: 0, gd: 0, points: 0, form: [],
  }));
}

export const KNOCKOUT_ROUNDS = [
  { label: "Round of 32", dates: "Jun 28 – Jul 2", slots: 16 },
  { label: "Round of 16", dates: "Jul 4 – 5",      slots: 8  },
  { label: "Quarter-Finals", dates: "Jul 9 – 10",  slots: 4  },
  { label: "Semi-Finals",    dates: "Jul 14 – 15", slots: 2  },
  { label: "🏆 Final",       dates: "Jul 19, MetLife NJ", slots: 1 },
];

export const PLAYERS_TO_WATCH = [
  { flag:"🇦🇷", name:"Lionel Messi",    team:"Argentina",  role:"Captain & All-time great"  },
  { flag:"🇫🇷", name:"Kylian Mbappé",  team:"France",     role:"Speed & Goals"             },
  { flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", name:"Jude Bellingham",team:"England",    role:"Box-to-box midfielder"     },
  { flag:"🇵🇹", name:"Cristiano Ronaldo",team:"Portugal",  role:"Record WC appearances"     },
  { flag:"🇩🇪", name:"Jamal Musiala",   team:"Germany",    role:"Rising star"               },
  { flag:"🇧🇷", name:"Vinícius Jr.",    team:"Brazil",     role:"Most dangerous winger"     },
  { flag:"🇪🇸", name:"Pedri",           team:"Spain",      role:"Creative maestro"          },
  { flag:"🇳🇴", name:"Erling Haaland",  team:"Norway",     role:"Prolific striker"          },
];
