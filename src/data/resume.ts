// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for all site copy. Every component reads from
// here — edit content in exactly one place.
//
// Sources: the résumé PDF (experience, education, certifications, skills,
// leadership, awards) and the READMEs of the public repos at
// github.com/H0GR1D3R-CODE (project descriptions and every project number).
// Nothing here is rounded up or invented.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Nebin Stanly",
  role: "Full-Stack, ML & IoT Developer",
  university: "CHRIST (Deemed to be University), Bengaluru",
  degree: "Bachelor of Computer Applications (Hons.)",
  location: "Bengaluru, Karnataka, India",
  email: "nebinstanly12@gmail.com",
  phone: "+91 89219 51597",
  linkedin: "https://www.linkedin.com/in/nebin-stanly-379404231/",
  github: "https://github.com/H0GR1D3R-CODE",
  githubLabel: "github.com/H0GR1D3R-CODE",
  cvPath: "/Nebin-Stanly-CV.pdf",
  repoUrl: "https://github.com/H0GR1D3R-CODE/H0GR1D3R-CODE.github.io",
} as const;

export const nav = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
] as const;

/** The headline is one sentence, set in three voices: a quiet lead-in, the claim, and the part that matters. */
export const hero = {
  status: "Open to technical roles",
  where: "Bengaluru, India",
  lead: "Nebin Stanly builds",
  statement: "software that",
  emphasis: "actually runs.",
  intro:
    "BCA (Hons.) student at CHRIST University, working across full-stack web, machine learning and IoT. Every project here is deployed or runnable, and some of them will run right here on this page.",
} as const;

/** The résumé's professional summary, kept verbatim for metadata and print. */
export const summary =
  "Bachelor of Computer Applications (Hons.) undergraduate with hands-on experience in full-stack development, machine learning, IoT and IT infrastructure. Builds and deploys secure, user-focused applications from concept to production. Quick learner and collaborative team player seeking a technical role to deliver reliable, scalable solutions.";

export const about = [
  "I'm a BCA (Hons.) student at CHRIST University's Yeshwanthpur campus in Bengaluru. I like taking things past the tutorial stage: every project on this page is something I built, ran end to end, and debugged until it worked.",
  "Most of what I build sits between full-stack web, IoT and real-time systems, with more machine learning and NLP lately and cybersecurity on the side. One summer I configured and deployed 35+ IoT devices, CCTV cameras and biometric access controls across three offices, so I think about what happens to software once it meets real hardware and real networks.",
  "I'm looking for a technical role where I can ship reliable things with a team.",
];

// ── Work ─────────────────────────────────────────────────────────────────

export type Area = "Web" | "ML" | "IoT" | "Mobile" | "Tools";

export const areas: Area[] = ["Web", "ML", "IoT", "Mobile", "Tools"];

export type ProjectMedia = {
  /** A still image. For recordings this is the first frame, shown until the recording plays. */
  still: string;
  /** Animated recording of the real site, loaded only when it scrolls into view. */
  recording?: string;
  alt: string;
  width: number;
  height: number;
};

/** Lines copied verbatim from one file in the project's repository. */
export type ProjectEvidence = {
  /** Path of the file inside the repository. */
  path: string;
  lang: "js" | "py" | "kt" | "java";
  /** Line number of the first line in `code`. */
  line: number;
  /** Number of files in the repository. */
  files: number;
  code: string[];
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  /** capstone and latest get the large layouts, featured get a screenshot card, more is a compact row. */
  tier: "capstone" | "latest" | "featured" | "more";
  period: string;
  description: string;
  points?: string[];
  stack: string[];
  areas: Area[];
  live?: string;
  /**
   * A small static file on the live host. Fetching it is how the page checks
   * the demo is up: browsers refuse to let one site fetch another site's
   * HTML, but an icon or stylesheet is allowed.
   */
  ping?: string;
  /** True when the live site allows itself to be embedded, so the hero can run it in place. */
  runsInPage?: boolean;
  code: string;
  extra?: { label: string; href: string };
  media?: ProjectMedia;
  /** For projects with no screenshot: a real excerpt of their source, shown as proof they exist. */
  evidence?: ProjectEvidence;
};

const gh = (repo: string) => `https://github.com/H0GR1D3R-CODE/${repo}`;

export const projects: Project[] = [
  {
    id: "ecotrack",
    name: "EcoTrack",
    tagline: "Know your carbon, then change it.",
    tier: "capstone",
    period: "Jul – Sep 2026",
    description:
      "A cloud-based carbon footprint tracker, built as my BCA specialization project and aligned with UN SDG 13 (Climate Action). You log everyday activity across seven categories, and every entry is converted to kg of CO₂ with a published emission factor you can check.",
    points: [
      "Forecasts your month-end footprint with an 80% prediction interval, backtested against a naive baseline.",
      "Recommends swaps ranked by how much they save, each citing the DEFRA, IPCC or CEA factors behind it.",
      "Scans bills: photograph an electricity bill and a vision model reads the units for you to confirm.",
      "40+ REST APIs, every route behind Firebase token verification and ownership checks, with optional 2FA.",
    ],
    stack: ["React", "Vite", "Flask", "Firebase Firestore", "Firebase Auth", "Chart.js"],
    areas: ["Web"],
    live: "https://ecotrk.web.app/",
    ping: "https://ecotrk.web.app/icons/icon-32.webp",
    code: gh("EcoTracker"),
    extra: { label: "Try the 30-second estimator", href: "https://ecotrk.web.app/estimate" },
    media: {
      still: "/shots/ecotrack-poster.webp",
      recording: "/shots/ecotrack.webp",
      alt: "A tour of EcoTrack: the landing page reading “Know your carbon. Then change it.”, the 30-second footprint estimator, and the sourced explainers.",
      width: 1200,
      height: 638,
    },
  },
  {
    id: "corridor",
    name: "Corridor",
    tagline: "An emergency-routing atlas for Bengaluru.",
    tier: "latest",
    period: "Oct 2026",
    description:
      "Finds the fastest route for an ambulance when every road's travel time depends on the day, the hour, the weather and what is happening in the city.",
    points: [
      "Routes over a graph of 832 junctions and 1,630 road segments, with 15 hospitals.",
      "Races five shortest-path algorithms on the same trip: Dijkstra, A*, Bidirectional Dijkstra, Bellman–Ford and Greedy best-first.",
      "Backs its verdict with ten tests and a benchmark lab that run live in the browser.",
    ],
    stack: ["JavaScript", "Graph algorithms", "Canvas", "No build step, no dependencies"],
    areas: ["Web"],
    live: "https://h0gr1d3r-code.github.io/corridor-routing-atlas/",
    ping: "https://h0gr1d3r-code.github.io/corridor-routing-atlas/css/style.css",
    runsInPage: true,
    code: gh("corridor-routing-atlas"),
    extra: { label: "Watch the 5-minute film", href: "https://h0gr1d3r-code.github.io/corridor-routing-atlas/film/" },
    media: {
      still: "/shots/corridor-poster.webp",
      recording: "/shots/corridor.webp",
      alt: "Corridor's live board: ambulances being routed to hospitals across a map of Bengaluru, above counters for 832 junctions, 1,630 road segments, 15 hospitals and 5 algorithms raced.",
      width: 1200,
      height: 638,
    },
  },
  {
    id: "phishguard",
    name: "PhishGuard",
    tagline: "A phishing URL detector that explains itself.",
    tier: "featured",
    period: "Sep 2026",
    description:
      "Paste a URL, get a verdict: safe, suspicious or malicious. A Random Forest trained on 6,494 real labelled URLs reads 24 features straight from the URL string, and SHAP explains in plain English which ones drove the call. It scores 88.3% accuracy and 95.7% ROC-AUC on a held-out test set.",
    stack: ["Python", "FastAPI", "scikit-learn", "SHAP", "React", "Docker"],
    areas: ["ML", "Web"],
    code: gh("phishguard"),
    media: {
      still: "/shots/phishguard.webp",
      alt: "PhishGuard flagging a URL as malicious with a 96% risk score and the five signals that drove the verdict.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "fitadapt",
    name: "FitAdapt AI",
    tagline: "A training plan that adapts to how you feel today.",
    tier: "featured",
    period: "Aug 2026",
    description:
      "Interactive front end for a multi-agent system that reads an athlete's soreness, sleep and energy each day and rewrites the training session to match. Includes a live Sensing → Decision → Execution pipeline you can step through. Sign-in and the model calls are mocked by default, so it all runs in the browser.",
    stack: ["React", "Vite", "Tailwind CSS"],
    areas: ["Web"],
    live: "https://fitadapt-ai.vercel.app/",
    ping: "https://fitadapt-ai.vercel.app/favicon.svg",
    runsInPage: true,
    code: gh("fitadapt-ai"),
    media: {
      still: "/shots/fitadapt.webp",
      alt: "FitAdapt AI home screen with a biometric readout of an athlete's body.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "veritas",
    name: "Veritas",
    tagline: "Fake news detection with classic NLP.",
    tier: "featured",
    period: "Jul – Sep 2026",
    description:
      "TF-IDF features into Logistic Regression, SVM and Random Forest, behind a dashboard that shows every stage of the pipeline running on the article you paste in. On 7,732 held-out articles the SVM reaches 99.75% accuracy, but recall drops to 45.45% on a news subject it never trained on, and the write-up says so. Built with Don Pradeep.",
    stack: ["Python", "scikit-learn", "NLTK", "Flask"],
    areas: ["ML"],
    live: "https://fake-news-detection-nlp.vercel.app/",
    ping: "https://fake-news-detection-nlp.vercel.app/static/css/app.css",
    runsInPage: true,
    code: gh("fake-news-detection-nlp"),
    media: {
      still: "/shots/veritas.webp",
      alt: "Veritas, a fake news detection dashboard styled as a newspaper forensics desk.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "hogrider",
    name: "hogrider",
    tagline: "A Clash Royale deck builder and analyzer.",
    tier: "featured",
    period: "2026",
    description:
      "Pick 8 cards and get a live elixir curve and matchup checks: win condition, spell support, and answers to swarms, air and tanks. Decks live in the URL, so sharing one is just copying the link.",
    stack: ["React", "Vite", "GitHub Pages"],
    areas: ["Web"],
    live: "https://h0gr1d3r-code.github.io/hogrider/?deck=hog-rider,musketeer,ice-golem,ice-spirit,skeletons,cannon,fireball,the-log",
    ping: "https://h0gr1d3r-code.github.io/hogrider/favicon.svg",
    runsInPage: true,
    code: gh("hogrider"),
    media: {
      still: "/shots/hogrider.webp",
      alt: "hogrider with the 2.6 hog cycle deck loaded: 2.6 average elixir, an elixir curve, and five passed matchup checks.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "collabcanvas",
    name: "collabcanvas",
    tagline: "Real-time collaborative whiteboard.",
    tier: "more",
    period: "Aug 2026",
    description:
      "Several people draw on one board at once, with live cursors and presence. Boards persist in MongoDB and are shared by link. The canvas engine is hand-rolled on the Canvas 2D API.",
    stack: ["React", "Socket.IO", "Node/Express", "MongoDB"],
    areas: ["Web"],
    code: gh("collabcanvas"),
    evidence: {
      path: "server/sockets/boardSocket.js",
      lang: "js",
      line: 43,
      files: 38,
      code: [
        "    socket.on('draw-end', async (stroke) => {",
        "      if (!currentBoardId) return;",
        "      socket.to(currentBoardId).emit('draw-end', stroke);",
        "",
        "      try {",
        "        await Stroke.create({",
        "          boardId: currentBoardId,",
        "          strokeId: stroke.strokeId,",
        "          tool: stroke.tool,",
        "          points: stroke.points,",
        "          color: stroke.color,",
        "          width: stroke.width,",
        "          text: stroke.text,",
      ],
    },
  },
  {
    id: "campus-connect",
    name: "campus-connect",
    tagline: "Campus club and event platform.",
    tier: "more",
    period: "Aug 2026",
    description:
      "Students browse clubs and RSVP to events; club admins run their own calendar; a site admin onboards clubs. JWT auth with three roles, and API tests in Jest and Supertest.",
    stack: ["React", "Node/Express", "MongoDB", "JWT"],
    areas: ["Web"],
    code: gh("campus-connect"),
    evidence: {
      path: "server/middleware/auth.js",
      lang: "js",
      line: 18,
      files: 54,
      code: [
        "  const decoded = jwt.verify(token, process.env.JWT_SECRET);",
        "  const user = await User.findById(decoded.id);",
        "",
        "  if (!user) {",
        "    throw new ApiError(401, 'Not authorized, user no longer exists');",
        "  }",
        "",
        "  req.user = user;",
        "  next();",
        "});",
        "",
        "// Restricts a route to one or more roles, e.g. authorize('site_admin')",
        "const authorize = (...roles) => (req, res, next) => {",
      ],
    },
  },
  {
    id: "iot-environment-monitor",
    name: "iot-environment-monitor",
    tagline: "Sensor pipeline from device to cloud to analysis.",
    tier: "more",
    period: "Feb – Aug 2026",
    description:
      "ESP32 and DHT22 firmware, plus a Python simulator, publishing temperature, humidity and light to ThingSpeak, with pandas analysis and threshold alerts. It grew out of a wearable obstacle-detection prototype: an Arduino with two ultrasonic sensors, simulated in Tinkercad first.",
    stack: ["Arduino/C++", "Python", "ThingSpeak API", "pandas"],
    areas: ["IoT"],
    code: gh("iot-environment-monitor"),
    evidence: {
      path: "simulator/sensor_simulator.py",
      lang: "py",
      line: 60,
      files: 18,
      code: [
        "    def generate_temperature(self, timestamp: datetime) -> float:",
        "        \"\"\"Temperature peaks in mid-afternoon (~15:00) and troughs before dawn (~03:00).\"\"\"",
        "        hour = self._hour_fraction(timestamp)",
        "        signal = self.TEMPERATURE_AMPLITUDE_C * math.cos(",
        "            2 * math.pi * (hour - 15) / 24",
        "        )",
        "        noise = self._rng.gauss(0, self.TEMPERATURE_NOISE_STD)",
        "        return self.MEAN_TEMPERATURE_C + signal + noise",
        "",
        "    def generate_humidity(self, timestamp: datetime) -> float:",
        "        \"\"\"Humidity roughly mirrors temperature: highest overnight, lowest mid-afternoon.\"\"\"",
        "        hour = self._hour_fraction(timestamp)",
        "        signal = self.HUMIDITY_AMPLITUDE_PCT * math.cos(",
      ],
    },
  },
  {
    id: "expense-tracker-android",
    name: "expense-tracker-android",
    tagline: "Native Android expense tracker.",
    tier: "more",
    period: "Aug 2026",
    description:
      "Log expenses, set a monthly budget and see spending by category. Offline-first: everything is stored locally with Room and the app asks for no network permission.",
    stack: ["Kotlin", "Jetpack Compose", "Room", "MVVM"],
    areas: ["Mobile"],
    code: gh("expense-tracker-android"),
    evidence: {
      path: "app/src/main/java/com/nebin/expensetracker/data/local/ExpenseDao.kt",
      lang: "kt",
      line: 10,
      files: 56,
      code: [
        "@Dao",
        "interface ExpenseDao {",
        "",
        "    @Query(\"SELECT * FROM expenses ORDER BY date DESC, id DESC\")",
        "    fun getAllExpenses(): Flow<List<Expense>>",
        "",
        "    @Query(\"SELECT * FROM expenses WHERE id = :expenseId LIMIT 1\")",
        "    suspend fun getExpenseById(expenseId: Long): Expense?",
        "",
        "    @Insert",
        "    suspend fun insertExpense(expense: Expense): Long",
        "",
        "    @Update",
      ],
    },
  },
  {
    id: "library-management-system",
    name: "library-management-system",
    tagline: "Console library system.",
    tier: "more",
    period: "Aug 2026",
    description:
      "Issue and return workflow with 14-day due dates and automatic overdue fines, persisted in SQLite and covered by JUnit 5 tests.",
    stack: ["Java", "JDBC", "SQLite"],
    areas: ["Tools"],
    code: gh("library-management-system"),
    evidence: {
      path: "src/main/java/com/library/service/FineCalculator.java",
      lang: "java",
      line: 24,
      files: 18,
      code: [
        "    public static double calculate(LocalDate dueDate, LocalDate returnDate) {",
        "        return calculate(dueDate, returnDate, DEFAULT_RATE_PER_DAY);",
        "    }",
        "",
        "    public static double calculate(LocalDate dueDate, LocalDate returnDate, double ratePerDay) {",
        "        if (dueDate == null || returnDate == null) {",
        "            throw new IllegalArgumentException(\"dueDate and returnDate must not be null\");",
        "        }",
        "        long daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);",
        "        if (daysLate <= 0) {",
        "            return 0.0;",
        "        }",
        "        return daysLate * ratePerDay;",
      ],
    },
  },
  {
    id: "finance-analyzer-cli",
    name: "finance-analyzer-cli",
    tagline: "Personal finance from the terminal.",
    tier: "more",
    period: "Aug 2026",
    description:
      "Reads a transactions CSV and prints category breakdowns, monthly trends and top expenses, and exports charts as PNG.",
    stack: ["Python", "pandas", "matplotlib"],
    areas: ["Tools"],
    code: gh("finance-analyzer-cli"),
    evidence: {
      path: "financeanalyzer/analyzer.py",
      lang: "py",
      line: 47,
      files: 17,
      code: [
        "def get_category_breakdown(df: pd.DataFrame) -> pd.DataFrame:",
        "    \"\"\"Return expense totals per category with each category's % of total spend.\"\"\"",
        "    expenses = df[df[\"type\"] == \"expense\"]",
        "    total = expenses[\"amount\"].sum()",
        "",
        "    breakdown = (",
        "        expenses.groupby(\"category\")[\"amount\"]",
        "        .sum()",
        "        .reset_index()",
        "        .rename(columns={\"amount\": \"total\"})",
        "        .sort_values(\"total\", ascending=False)",
        "        .reset_index(drop=True)",
        "    )",
      ],
    },
  },
];

// ── About ────────────────────────────────────────────────────────────────

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "C", "C++", "C# (.NET)", "JavaScript", "Kotlin", "SQL", "PL/SQL", "HTML5", "CSS3", "JSP"],
  },
  {
    label: "Frameworks & libraries",
    items: ["React", "Flask", "Node.js", "scikit-learn", "NLTK", "pandas", "Chart.js"],
  },
  {
    label: "Databases & cloud",
    items: ["Firebase (Firestore, Auth, Hosting)", "MongoDB", "MySQL", "Oracle Database", "Vercel"],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "Android Studio", "UiPath (RPA)", "Arduino", "Tinkercad", "MySQL Workbench"],
  },
];

export const spokenLanguages = [
  { name: "English", level: "full professional" },
  { name: "Malayalam", level: "full professional" },
  { name: "Hindi", level: "limited working" },
  { name: "Arabic", level: "limited working" },
  { name: "German", level: "elementary" },
];

// ── Timeline sources (straight from the résumé) ──────────────────────────

export type Experience = {
  org: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    org: "One15 Investments",
    role: "IT Configuration Assistant",
    location: "Kollam, Kerala",
    start: "May 2025",
    end: "Jul 2025",
    bullets: [
      "Configured, tested and deployed 35+ IoT devices, CCTV cameras and biometric access controls across 3 office sites.",
      "Integrated on-premise hardware and software securely, cutting per-device setup time by ~30% through documented procedures.",
      "Worked with IT security teams to fix network vulnerabilities and resolve 50+ connectivity issues, maintaining 99% uptime.",
    ],
  },
];

export type EducationItem = {
  institution: string;
  credential: string;
  result: string;
  start: string;
  end: string;
};

export const education: EducationItem[] = [
  {
    institution: "CHRIST (Deemed to be University), Bengaluru",
    credential: "Bachelor of Computer Applications (Hons.)",
    result: "CGPA 8.22",
    start: "Jul 2024",
    end: "May 2027 (expected)",
  },
  {
    institution: "Christ Academy Junior College (CBSE), Bengaluru",
    credential: "Class XII",
    result: "81.8%",
    start: "Jun 2022",
    end: "Apr 2024",
  },
  {
    institution: "St. Mary's Catholic High School, Fujairah, UAE",
    credential: "Class X",
    result: "89.33%",
    start: "Apr 2010",
    end: "Apr 2022",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
};

export const certifications: Certification[] = [
  { name: "Robotic Process Automation (RPA)", issuer: "UiPath", date: "Mar 2026" },
  { name: "Google AI & Emerging Technologies", issuer: "Google Workshop", date: "Feb 2026" },
  { name: "Privacy and Security in Online Social Media", issuer: "NPTEL", date: "Oct 2025" },
  {
    name: "Full-Stack, HTML, JavaScript, IoT & Cybersecurity Technical Track",
    issuer: "Infosys Springboard",
    date: "Jul 2024 – Jan 2026",
  },
  { name: "CPCG Career Development Bootcamp", issuer: "CHRIST University", date: "Jun 2025 – Mar 2026" },
];

export type Leadership = {
  org: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export const leadership: Leadership[] = [
  {
    org: "Student Welfare Office (SWO), CHRIST University",
    role: "Creatives Volunteer & Choir Member",
    start: "Aug 2024",
    end: "Mar 2026",
    bullets: [
      "Designed and built event props with the Creatives wing and managed on-site set-up for 15+ university events.",
      "Performed with the university choir at official events and convocations.",
    ],
  },
  {
    org: "SDG Cell & Association of Christian Christites (ACC)",
    role: "Sustainability Volunteer & Choir Member",
    start: "Jul 2024",
    end: "Mar 2026",
    bullets: ["Organized 5+ awareness programs on sustainability and green building, reaching 500+ students."],
  },
];

export type Award = {
  title: string;
  issuer: string;
  note?: string;
  date: string;
};

export const awards: Award[] = [
  {
    title: "Double Certificate of Honour",
    issuer: "SWO, CHRIST University",
    note: "For project management and leadership.",
    date: "Mar 2026",
  },
  { title: "Certificate of Honour (Choral Excellence)", issuer: "University Choir, SWO", date: "Mar 2026" },
  { title: "Co-Curricular Scholarship", issuer: "CHRIST University", date: "2025 – 2026" },
];

// ── Timeline (derived: one list, newest first) ───────────────────────────

export type TimelineKind = "Work" | "Education" | "Certificate" | "Leadership" | "Award";

export type TimelineEntry = {
  kind: TimelineKind;
  title: string;
  org: string;
  date: string;
  detail?: string;
  bullets?: string[];
  /** Work and education carry the weight; the rest render as single lines. */
  major: boolean;
  ongoing: boolean;
  year: number;
  sort: number;
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Reads the last "Mon YYYY" or bare "YYYY" out of a résumé date string, so entries sort by when they ended. */
function endOf(date: string): { year: number; sort: number } {
  const all = [...date.matchAll(/(?:([A-Za-z]{3})[a-z]*\s+)?(\d{4})/g)];
  const last = all[all.length - 1];
  if (!last) return { year: 0, sort: 0 };
  const year = Number(last[2]);
  const month = last[1] ? MONTHS.indexOf(last[1].toLowerCase()) + 1 : 0;
  return { year, sort: year * 100 + month };
}

const KIND_ORDER: TimelineKind[] = ["Work", "Education", "Award", "Certificate", "Leadership"];

function entry(e: Omit<TimelineEntry, "year" | "sort" | "ongoing">): TimelineEntry {
  return { ...e, ...endOf(e.date), ongoing: /expected|present/i.test(e.date) };
}

export const timeline: TimelineEntry[] = [
  ...experience.map((x) =>
    entry({
      kind: "Work",
      title: x.role,
      org: `${x.org}, ${x.location}`,
      date: `${x.start} – ${x.end}`,
      bullets: x.bullets,
      major: true,
    })
  ),
  ...education.map((x) =>
    entry({
      kind: "Education",
      title: x.credential,
      org: x.institution,
      date: `${x.start} – ${x.end}`,
      detail: x.result,
      major: true,
    })
  ),
  ...certifications.map((x) => entry({ kind: "Certificate", title: x.name, org: x.issuer, date: x.date, major: false })),
  ...leadership.map((x) =>
    entry({
      kind: "Leadership",
      title: x.role,
      org: x.org,
      date: `${x.start} – ${x.end}`,
      bullets: x.bullets,
      major: false,
    })
  ),
  ...awards.map((x) =>
    entry({ kind: "Award", title: x.title, org: x.issuer, date: x.date, detail: x.note, major: false })
  ),
].sort(
  (a, b) =>
    Number(b.ongoing) - Number(a.ongoing) ||
    b.sort - a.sort ||
    KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
);
