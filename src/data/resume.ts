// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for all site copy. Every section component reads
// from here — edit content in exactly one place.
//
// Items marked "TODO: VERIFY" are drafted from the resume's one-line project
// titles (the resume itself has no long-form project descriptions). Confirm
// or rewrite them before treating the site as final.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Nebin Stanly",
  initials: "NS",
  role: "Full-Stack & IoT Developer",
  tagline: "Building at the intersection of software, hardware, and secure systems.",
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
  cvPath: "/Nebin-Stanly-CV.pdf",
} as const;

export const summary =
  "Bachelor of Computer Applications (Hons.) student with hands-on experience spanning full-stack web development, IoT architecture, and systems automation. Demonstrated capability to build responsive cross-platform applications, program hardware prototypes, and optimize generative AI model frameworks. Seeking a technical role to leverage scalable programming, secure system design, and cross-functional problem-solving skills.";

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
      "Engineered secure localized hardware-software infrastructure integrations across localized enterprise endpoints.",
      "Managed the configuration, testing, and deployment of network-connected IoT devices, CCTV systems, and biometric access controls.",
      "Collaborated with IT security teams to diagnose network vulnerabilities and perform system up-time troubleshooting.",
    ],
  },
];

export type Project = {
  index: string;
  title: string;
  tech: string[];
  start: string;
  end: string;
  description: string;
  verified: boolean;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "IoT Smart Device for Visually Impaired Individuals",
    tech: ["Python", "Arduino", "Sensor Networks", "Tinkercad"],
    start: "Feb 2026",
    end: "Mar 2026",
    // TODO: VERIFY — drafted from resume title, confirm before publishing
    description:
      "An assistive wearable prototype combining ultrasonic obstacle sensing with real-time haptic and audio feedback. Arduino-driven firmware handles sensor polling while a Python-side layer processes distance data and triggers alerts, with the full circuit modeled and validated in Tinkercad before physical assembly.",
    verified: false,
  },
  {
    index: "02",
    title: "Custom GPT Architecture Optimization",
    tech: ["Generative AI", "Prompt Engineering", "InfoSec"],
    start: "Jan 2026",
    end: "Mar 2026",
    // TODO: VERIFY — drafted from resume title, confirm before publishing
    description:
      "A structured framework for tuning and hardening custom GPT system prompts — refining instruction design for consistency, evaluating outputs against prompt-injection and data-leakage attack surfaces, and iterating on guardrails to keep responses reliable under adversarial input.",
    verified: false,
  },
  {
    index: "03",
    title: "Full-Stack Web & Mobile App Development",
    tech: ["Java", "SQL", "Android Studio", "Frontend Tech"],
    start: "Jan 2025",
    end: "Mar 2025",
    // TODO: VERIFY — drafted from resume title, confirm before publishing
    description:
      "A cross-platform application pairing a native Android client — built in Java on Android Studio over a SQL data layer — with a companion web front end in HTML/CSS/JSP, sharing a common data model across both surfaces.",
    verified: false,
  },
];

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Technical",
    items: [
      "Python",
      "Java",
      "C",
      "C++",
      "C# (.NET)",
      "JavaScript",
      "Kotlin",
      "SQL",
      "PL/SQL",
      "HTML5",
      "CSS3",
      "JSP",
      "XTML",
      "Git",
    ],
  },
  {
    label: "Tools & Systems",
    items: [
      "MySQL Workbench",
      "MongoDB",
      "Oracle Database",
      "Android Studio",
      "UiPath (RPA)",
      "Arduino",
    ],
  },
  {
    label: "Domain",
    items: [
      "Full-Stack Web Development",
      "Internet of Things (IoT)",
      "Cybersecurity",
      "Mobile Application Development",
      "Systems Automation",
    ],
  },
  {
    label: "Soft Skills",
    items: [
      "Project Management",
      "Cross-functional Team Leadership",
      "Strategic Problem Solving",
      "Creative Concept Design",
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
};

export const certifications: Certification[] = [
  { name: "Privacy and Security in Online Social Media", issuer: "NPTEL", date: "Oct 2025" },
  { name: "Robotic Process Automation (RPA)", issuer: "UiPath", date: "Mar 2026" },
  { name: "Google AI & Emerging Technologies", issuer: "Google Workshop", date: "Feb 2026" },
  {
    name: "Full-Stack, HTML, JavaScript IoT & Cybersecurity Technical Track",
    issuer: "Infosys Springboard",
    date: "Jul 2024 – Jan 2026",
  },
  {
    name: "CPCG Career Development Bootcamp",
    issuer: "Christ University",
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
      "Coordinated visual strategy and promotional media for major university initiatives, managing project timelines alongside student leadership teams.",
      "Collaborated within live vocal performance teams during official institutional events and convocations, enhancing cross-functional team execution.",
    ],
  },
  {
    org: "SDG Cell & Association of Christian Christites (ACC), Bengaluru",
    role: "Sustainability Volunteer & Choir Member",
    start: "Jul 2024",
    end: "Mar 2026",
    bullets: [
      "Organized campus awareness programs focused on green building design, social responsibility frameworks, and sustainable development practices.",
      "Assisted multiple student committees in planning, coordinating, and executing community events to optimize organizational workflows.",
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
    title: "Double Certification of Honour",
    issuer: "SWO, Christ University",
    description:
      "Recognized by university administration for outstanding project management and cross-functional leadership across major institutional events.",
    date: "Mar 2026",
  },
  {
    title: "Co-Curricular Scholarship",
    issuer: "CHRIST University",
    description: "Awarded for participation in extracurricular programs.",
    date: "2025 – 2026",
  },
  {
    title: "Certification of Honour (Choral Excellence)",
    issuer: "University Choir (SWO)",
    description:
      "Awarded for exceptional vocal performance and team coordination during official university convocations and showcases.",
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
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certs" },
  { id: "leadership", label: "Leadership" },
  { id: "awards", label: "Awards" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
