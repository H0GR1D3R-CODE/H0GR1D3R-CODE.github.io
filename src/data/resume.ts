// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for all site copy. Every section component reads
// from here — edit content in exactly one place.
//
// Sources: the résumé PDF (experience, education, metrics, certifications,
// skills) and the READMEs of the public repos at github.com/H0GR1D3R-CODE
// (the extra projects and the repo archive). Numbers are quoted from those
// sources, not rounded up.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Nebin Stanly",
  initials: "NS",
  role: "Full-Stack, ML & IoT Developer",
  tagline: "Building at the intersection of software, machine learning, and hardware — secure by design.",
  university: "CHRIST (Deemed to be University), Bengaluru",
  degree: "Bachelor of Computer Applications (Hons.)",
  batch: "Batch 2024 – Present",
  location: "Bengaluru, Karnataka, India",
  email: "nebinstanly12@gmail.com",
  phone: "+91 8921951597",
  linkedin: "https://www.linkedin.com/in/nebin-stanly-379404231/",
  linkedinLabel: "linkedin.com/in/nebin-stanly",
  github: "https://github.com/H0GR1D3R-CODE",
  githubLabel: "github.com/H0GR1D3R-CODE",
  githubUsername: "H0GR1D3R-CODE",
  cvPath: "/Nebin-Stanly-CV.pdf",
  repoUrl: "https://github.com/H0GR1D3R-CODE/H0GR1D3R-CODE.github.io",
} as const;

/** Domains repeated in the skills marquee — the résumé's own Domains line. */
export const focusAreas = [
  "Full-Stack Development",
  "Machine Learning & NLP",
  "Internet of Things",
  "Cybersecurity",
  "Mobile Development",
  "Automation",
] as const;

export type ApproachPrinciple = {
  title: string;
  description: string;
};

/**
 * Working principles, restated from the professional summary, experience
 * and projects already in this file — not new claims, just surfaced as their
 * own moment on the page.
 */
export const approach: ApproachPrinciple[] = [
  {
    title: "Secure by design",
    description:
      "Infrastructure and code get built with the vulnerability surface in mind from the start — from diagnosing network security in the field to token-verified API routes and explainable phishing detection.",
  },
  {
    title: "Full-stack fluency",
    description:
      "Comfortable moving from a Firebase-backed Flask API to a React front end to a scikit-learn model on the same project, so a feature stays coherent across every layer it touches.",
  },
  {
    title: "Hardware-aware software",
    description:
      "Time spent programming Arduino prototypes and wiring sensor networks means software decisions account for real-world latency, power, and failure modes — not just the happy path.",
  },
  {
    title: "Measured, not assumed",
    description:
      "Benchmarked classifiers on 40,000+ articles, backtested forecasts, and shipped algorithms with live in-browser tests — claims get a number next to them.",
  },
];

export const summary =
  "Bachelor of Computer Applications (Hons.) undergraduate with hands-on experience in full-stack development, machine learning, IoT and IT infrastructure. Builds and deploys secure, user-focused applications from concept to production. Quick learner and collaborative team player seeking a technical role to deliver reliable, scalable solutions.";

/** Headline numbers, each one lifted from a résumé bullet. */
export type Metric = {
  value: number;
  suffix: string;
  label: string;
  context: string;
};

export const metrics: Metric[] = [
  { value: 35, suffix: "+", label: "Devices deployed", context: "IoT, CCTV & biometric controls across 3 office sites" },
  { value: 99, suffix: "%", label: "Uptime maintained", context: "while resolving 50+ connectivity issues" },
  { value: 40, suffix: "+", label: "REST APIs", context: "behind the EcoTrack carbon-footprint platform" },
  { value: 40, suffix: "k+", label: "Articles benchmarked", context: "across 4 ML classifiers for fake-news detection" },
  { value: 500, suffix: "+", label: "Students reached", context: "through 5+ sustainability awareness programs" },
  { value: 15, suffix: "+", label: "Events supported", context: "building props and managing on-site set-up" },
];

export type Language = {
  name: string;
  level: string;
  weight: number; // 0-1, drives the proficiency meter fill
};

export const languages: Language[] = [
  { name: "English", level: "Full Professional", weight: 1 },
  { name: "Malayalam", level: "Full Professional", weight: 1 },
  { name: "Hindi", level: "Limited Working", weight: 0.55 },
  { name: "Arabic", level: "Limited Working", weight: 0.55 },
  { name: "German", level: "Elementary", weight: 0.3 },
];

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

export type ProjectLink = { label: string; href: string; kind: "live" | "code" };

export type Project = {
  index: string;
  title: string;
  tech: string[];
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  links: ProjectLink[];
  /** Listed on the résumé PDF, as opposed to pulled in from GitHub only. */
  onResume: boolean;
};

const gh = (repo: string) => `https://github.com/H0GR1D3R-CODE/${repo}`;

export const projects: Project[] = [
  {
    index: "01",
    title: "EcoTrack — Cloud-Based Carbon Footprint Tracker",
    tech: ["React", "Python Flask", "Firebase", "Chart.js"],
    start: "Jul 2026",
    end: "Sep 2026",
    summary:
      "A full-stack platform that turns everyday activity across seven categories into kg CO₂, then closes the loop from measurement to action.",
    highlights: [
      "Powered by 40+ REST APIs; month-end emission forecasts with an 80% prediction interval and ranked reduction recommendations.",
      "Every route secured with Firebase token verification, ownership checks and optional 2FA; AI bill scanning via a Groq vision model.",
    ],
    links: [
      { label: "Live demo", href: "https://ecotrk.web.app/", kind: "live" },
      { label: "GitHub", href: gh("EcoTracker"), kind: "code" },
    ],
    onResume: true,
  },
  {
    index: "02",
    title: "Fake News Detection using NLP & Machine Learning",
    tech: ["Python", "NLP", "scikit-learn", "Flask"],
    start: "Jul 2026",
    end: "Sep 2026",
    summary:
      "An end-to-end NLP pipeline — cleaning, tokenization, TF-IDF — that classifies news articles as real or fake, with a dashboard showing every stage on real input.",
    highlights: [
      "Benchmarked 4 ML classifiers on 40,000+ articles; the best model reached 96% accuracy and a 0.95 F1-score.",
      "Probed source leakage and temporal generalisation to test whether the headline accuracy actually holds up.",
    ],
    links: [
      { label: "Live demo", href: "https://fake-news-detection-nlp.vercel.app/", kind: "live" },
      { label: "GitHub", href: gh("fake-news-detection-nlp"), kind: "code" },
    ],
    onResume: true,
  },
  {
    index: "03",
    title: "PhishGuard — Malicious URL Detector",
    tech: ["Python", "FastAPI", "scikit-learn", "SHAP", "React"],
    start: "Sep 2026",
    end: "Sep 2026",
    summary:
      "Paste in a URL, get a safe / suspicious / malicious verdict, a confidence score, and a plain-English breakdown of which URL features drove the call.",
    highlights: [
      "Random Forest over 24 lexical and structural features, trained on 6,494 URLs from three public sources: 88.3% accuracy, 95.7% ROC-AUC on a held-out test set.",
      "SHAP explains each prediction; no live network calls, so verdicts return in well under a second.",
    ],
    links: [{ label: "GitHub", href: gh("phishguard"), kind: "code" }],
    onResume: false,
  },
  {
    index: "04",
    title: "Corridor — Emergency-Routing Atlas",
    tech: ["JavaScript", "A*", "Dijkstra", "Canvas", "SVG"],
    start: "Oct 2026",
    end: "Oct 2026",
    summary:
      "Finds the fastest ambulance route across Bengaluru when every road's travel time depends on the hour, the weather and what is happening in the city.",
    highlights: [
      "Five shortest-path algorithms — Dijkstra, A*, Bidirectional, Bellman–Ford, Greedy — raced on a road graph of 832 junctions and 1,630 segments.",
      "Ten tests run live in the browser, plus a benchmark across cities of roughly 60 to 8,000 junctions.",
    ],
    links: [
      { label: "Live demo", href: "https://h0gr1d3r-code.github.io/corridor-routing-atlas/", kind: "live" },
      { label: "GitHub", href: gh("corridor-routing-atlas"), kind: "code" },
    ],
    onResume: false,
  },
  {
    index: "05",
    title: "FitAdapt AI — Adaptive Training System",
    tech: ["React", "Vite", "Tailwind CSS", "Canvas", "SVG"],
    start: "Aug 2026",
    end: "Aug 2026",
    summary:
      "An interactive front end for a multi-agent system that reads an athlete's daily biometric state and rewrites their training session.",
    highlights: [
      "A live Sensing → Decision → Execution pipeline with a step-by-step reasoning trace and the tool-call output the agent would emit.",
      "Hand-rolled SVG analytics and a canvas fatigue heat-map, in one ~4,650-line React file.",
    ],
    links: [
      { label: "Live demo", href: "https://fitadapt-ai.vercel.app/", kind: "live" },
      { label: "GitHub", href: gh("fitadapt-ai"), kind: "code" },
    ],
    onResume: false,
  },
  {
    index: "06",
    title: "IoT Smart Device for Visually Impaired Individuals",
    tech: ["Python", "Arduino", "Ultrasonic Sensors", "Tinkercad", "ThingSpeak"],
    start: "Feb 2026",
    end: "Mar 2026",
    summary:
      "A wearable navigation-aid prototype, paired with a cloud-connected environment monitor that streams sensor readings and flags threshold breaches.",
    highlights: [
      "Arduino with 2 ultrasonic sensors detects obstacles up to 2 m away; circuit logic simulated in Tinkercad first, cutting hardware rework by ~40%.",
      "Temperature, humidity and light streamed to ThingSpeak over REST, with pandas/matplotlib analysis, threshold alerts and pytest unit tests.",
    ],
    links: [{ label: "GitHub", href: gh("iot-environment-monitor"), kind: "code" }],
    onResume: true,
  },
];

export type RepoCategory = "Web Apps" | "ML & Security" | "Mobile & IoT" | "Systems & Tools";

export const repoCategories: RepoCategory[] = ["Web Apps", "ML & Security", "Mobile & IoT", "Systems & Tools"];

export type Repo = {
  name: string;
  description: string;
  language: string;
  category: RepoCategory;
  date: string;
  href: string;
  live?: string;
  featured?: boolean;
};

/** Every public repo worth showing, newest first. Mirrors github.com/H0GR1D3R-CODE. */
export const repos: Repo[] = [
  {
    name: "corridor-routing-atlas",
    description: "Emergency-routing atlas for Bengaluru: five shortest-path algorithms, live traffic scenes, in-browser tests and benchmarks.",
    language: "JavaScript",
    category: "Systems & Tools",
    date: "Oct 2026",
    href: gh("corridor-routing-atlas"),
    live: "https://h0gr1d3r-code.github.io/corridor-routing-atlas/",
    featured: true,
  },
  {
    name: "phishguard",
    description: "ML-based phishing and malicious URL detector — FastAPI, scikit-learn, SHAP explainability and a React front end.",
    language: "Python",
    category: "ML & Security",
    date: "Sep 2026",
    href: gh("phishguard"),
    featured: true,
  },
  {
    name: "EcoTracker",
    description: "Cloud-based carbon footprint tracker with forecasting, ranked reduction advice and AI bill scanning.",
    language: "JavaScript",
    category: "Web Apps",
    date: "Jul 2026",
    href: gh("EcoTracker"),
    live: "https://ecotrk.web.app/",
    featured: true,
  },
  {
    name: "fitadapt-ai",
    description: "Interactive front end for a multi-agent system that adapts an athlete's training session to their daily biometric state.",
    language: "JavaScript",
    category: "Web Apps",
    date: "Aug 2026",
    href: gh("fitadapt-ai"),
    live: "https://fitadapt-ai.vercel.app/",
    featured: true,
  },
  {
    name: "fake-news-detection-nlp",
    description: "Fake news classification with NLP and machine learning — TF-IDF pipeline, four classifiers, Flask dashboard.",
    language: "Python",
    category: "ML & Security",
    date: "Aug 2026",
    href: gh("fake-news-detection-nlp"),
    live: "https://fake-news-detection-nlp.vercel.app/",
    featured: true,
  },
  {
    name: "iot-environment-monitor",
    description: "ESP32 firmware and a Python simulator publishing sensor data to ThingSpeak, with analysis and threshold alerting.",
    language: "Python",
    category: "Mobile & IoT",
    date: "Aug 2026",
    href: gh("iot-environment-monitor"),
    featured: true,
  },
  {
    name: "collabcanvas",
    description: "Real-time collaborative whiteboard — live cursors, presence and persistent history over Socket.IO and MongoDB, on a hand-rolled canvas engine.",
    language: "JavaScript",
    category: "Web Apps",
    date: "Aug 2026",
    href: gh("collabcanvas"),
  },
  {
    name: "campus-connect",
    description: "Full-stack MERN club and event platform with JWT auth, three-tier role-based access and one-click RSVPs.",
    language: "JavaScript",
    category: "Web Apps",
    date: "Aug 2026",
    href: gh("campus-connect"),
  },
  {
    name: "expense-tracker-android",
    description: "Native Android expense tracker — Kotlin, Jetpack Compose, Room and MVVM, with budgets and category breakdowns.",
    language: "Kotlin",
    category: "Mobile & IoT",
    date: "Aug 2026",
    href: gh("expense-tracker-android"),
  },
  {
    name: "finance-analyzer-cli",
    description: "Python CLI that turns a transactions CSV into category breakdowns, monthly trends and charts.",
    language: "Python",
    category: "Systems & Tools",
    date: "Aug 2026",
    href: gh("finance-analyzer-cli"),
  },
  {
    name: "library-management-system",
    description: "Java console app on JDBC and SQLite: issue/return workflow, due dates and automatic overdue fines.",
    language: "Java",
    category: "Systems & Tools",
    date: "Aug 2026",
    href: gh("library-management-system"),
  },
  {
    name: "hogrider",
    description: "Clash Royale deck builder and analyzer — live elixir curve, matchup checks and decks shareable by URL.",
    language: "JavaScript",
    category: "Web Apps",
    date: "May 2026",
    href: gh("hogrider"),
    live: "https://h0gr1d3r-code.github.io/hogrider/",
  },
  {
    name: "H0GR1D3R-CODE.github.io",
    description: "This site — React 19, GSAP, Three.js and Tailwind v4, deployed to GitHub Pages.",
    language: "TypeScript",
    category: "Web Apps",
    date: "Aug 2026",
    href: "https://github.com/H0GR1D3R-CODE/H0GR1D3R-CODE.github.io",
  },
];

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
    label: "Frameworks & Libraries",
    items: ["React", "Flask", "Node.js", "scikit-learn", "NLTK", "pandas", "Chart.js"],
  },
  {
    label: "Databases & Cloud",
    items: ["Firebase (Firestore, Auth, Hosting)", "MongoDB", "MySQL", "Oracle Database", "Vercel"],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "Android Studio", "UiPath (RPA)", "Arduino", "Tinkercad", "MySQL Workbench"],
  },
  {
    label: "Domains",
    items: [
      "Full-Stack Development",
      "Machine Learning & NLP",
      "IoT",
      "Cybersecurity",
      "Mobile Development",
      "Automation",
    ],
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
  {
    name: "CPCG Career Development Bootcamp",
    issuer: "CHRIST University",
    date: "Jun 2025 – Mar 2026",
  },
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
    org: "Student Welfare Office (SWO), CHRIST University, Bengaluru",
    role: "Creatives Volunteer & Choir Member",
    start: "Aug 2024",
    end: "Mar 2026",
    bullets: [
      "Designed and built event props with the Creatives wing and managed on-site set-up for 15+ university events.",
      "Performed with the university choir at official events and convocations.",
    ],
  },
  {
    org: "SDG Cell & Association of Christian Christites (ACC), Bengaluru",
    role: "Sustainability Volunteer & Choir Member",
    start: "Jul 2024",
    end: "Mar 2026",
    bullets: [
      "Organized 5+ awareness programs on sustainability and green building, reaching 500+ students.",
    ],
  },
];

export type Award = {
  title: string;
  issuer: string;
  description: string;
  date: string;
};

export const awards: Award[] = [
  {
    title: "Double Certificate of Honour",
    issuer: "SWO, CHRIST University",
    description: "Recognized for project management and leadership across major institutional events.",
    date: "Mar 2026",
  },
  {
    title: "Co-Curricular Scholarship",
    issuer: "CHRIST University",
    description: "Awarded for participation in extracurricular programs.",
    date: "2025 – 2026",
  },
  {
    title: "Certificate of Honour (Choral Excellence)",
    issuer: "University Choir, SWO",
    description: "Awarded for choral excellence with the university choir.",
    date: "Mar 2026",
  },
];

export type EducationItem = {
  institution: string;
  credential: string;
  metricLabel: string;
  metricValue: number; // numeric for count-up animation
  metricSuffix: string;
  start: string;
  end: string;
};

export const education: EducationItem[] = [
  {
    institution: "CHRIST (Deemed to be University), Bengaluru",
    credential: "Bachelor of Computer Applications (Hons.)",
    metricLabel: "CGPA",
    metricValue: 8.22,
    metricSuffix: "",
    start: "Jul 2024",
    end: "May 2027 (Expected)",
  },
  {
    institution: "Christ Academy Junior College (CBSE), Bengaluru, India",
    credential: "Class XII",
    metricLabel: "Score",
    metricValue: 81.8,
    metricSuffix: "%",
    start: "Jun 2022",
    end: "Apr 2024",
  },
  {
    institution: "St. Mary's Catholic High School, Fujairah, UAE",
    credential: "Class X",
    metricLabel: "Score",
    metricValue: 89.33,
    metricSuffix: "%",
    start: "Apr 2010",
    end: "Apr 2022",
  },
];

export const navSections = [
  { id: "about", label: "About" },
  { id: "approach", label: "Approach" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certs" },
  { id: "opensource", label: "Open Source" },
  { id: "leadership", label: "Leadership" },
  { id: "awards", label: "Awards" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
