import type { ResumeData, WorkExperience, Education, Project } from "@/types";

// ─── Text Extraction ──────────────────────────────────────────────────────────

/**
 * Extract plain text from a resume file buffer.
 * Supports PDF (via pdfjs-dist), DOCX (via mammoth), and TXT.
 */
export async function parseResume(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/x-pdf"
  ) {
    return extractTextFromPdf(buffer);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/docx" ||
    mimeType === "application/msword"
  ) {
    return extractTextFromDocx(buffer);
  }

  // Fallback: treat as plain text
  return new TextDecoder("utf-8").decode(buffer);
}

async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  // pdfjs-dist v6 — server-side import (no browser globals needed)
  // We use the legacy build which has a standalone worker
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Disable worker on server — use fake worker
  pdfjs.GlobalWorkerOptions.workerSrc = "";

  const uint8 = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data: uint8, useWorkerFetch: false, useSystemFonts: true });
  const pdf = await loadingTask.promise;

  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? (item.str as string) : ""))
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n");
}

async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const nodeBuffer = Buffer.from(buffer);
  const result = await mammoth.extractRawText({ buffer: nodeBuffer });
  return result.value;
}

// ─── Resume Data Extraction ───────────────────────────────────────────────────

/**
 * Parse plain resume text into structured ResumeData using regex heuristics.
 */
export function extractResumeData(text: string): ResumeData {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Name: first non-empty line that doesn't look like a URL or email
  const name = extractName(lines);

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Phone
  const phoneMatch = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // Links
  const links = extractLinks(text);

  // Sections
  const sections = splitIntoSections(text);

  // Summary
  const summary = extractSummary(sections);

  // Skills
  const skills = extractSkills(sections, text);

  // Experience
  const experience = extractExperience(sections);

  // Education
  const education = extractEducation(sections);

  // Projects
  const projects = extractProjects(sections);

  // Certifications
  const certifications = extractListSection(sections, [
    "certifications",
    "certificates",
    "licenses",
  ]);

  // Achievements
  const achievements = extractListSection(sections, [
    "achievements",
    "awards",
    "honors",
    "accomplishments",
  ]);

  return {
    name,
    email,
    phone,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements,
    links,
  };
}

// ─── Section Splitter ─────────────────────────────────────────────────────────

const SECTION_HEADERS = [
  "summary",
  "objective",
  "profile",
  "about",
  "experience",
  "work experience",
  "professional experience",
  "employment",
  "work history",
  "education",
  "academic",
  "skills",
  "technical skills",
  "core competencies",
  "projects",
  "personal projects",
  "certifications",
  "certificates",
  "licenses",
  "achievements",
  "awards",
  "honors",
  "accomplishments",
  "publications",
  "languages",
  "interests",
  "hobbies",
  "references",
];

function splitIntoSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = text.split(/\r?\n/);
  let currentSection = "header";
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect a section header: all-caps line OR matches known headers
    const lower = trimmed.toLowerCase().replace(/[^a-z\s]/g, "");
    const isHeader =
      (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 40) ||
      SECTION_HEADERS.some((h) => lower === h || lower.startsWith(h));

    if (isHeader) {
      if (buffer.length) sections[currentSection] = buffer.join("\n");
      currentSection = lower.trim();
      buffer = [];
    } else {
      buffer.push(trimmed);
    }
  }

  if (buffer.length) sections[currentSection] = buffer.join("\n");
  return sections;
}

// ─── Individual Field Extractors ──────────────────────────────────────────────

function extractName(lines: string[]): string {
  for (const line of lines.slice(0, 5)) {
    if (
      !/[^a-zA-Z\s'.,-]/.test(line) &&
      line.split(" ").length >= 2 &&
      line.length < 60 &&
      !line.toLowerCase().includes("@")
    ) {
      return line;
    }
  }
  return lines[0] ?? "";
}

function extractLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;
  const matches = text.match(urlRegex) ?? [];
  // Also catch github.com, linkedin.com without http
  const bareLinks = text.match(/(?:github|linkedin|portfolio)\.com\/[^\s"'<>]+/gi) ?? [];
  return [...new Set([...matches, ...bareLinks])];
}

function extractSummary(sections: Record<string, string>): string {
  const keys = ["summary", "objective", "profile", "about"];
  for (const key of keys) {
    const found = Object.keys(sections).find((k) => k.includes(key));
    if (found && sections[found]) return sections[found].slice(0, 500);
  }
  return "";
}

function extractSkills(sections: Record<string, string>, fullText: string): string[] {
  const keys = ["skills", "technical skills", "core competencies"];
  for (const key of keys) {
    const found = Object.keys(sections).find((k) => k.includes(key));
    if (found && sections[found]) {
      const raw = sections[found];
      // Split by comma, bullet, pipe, newline
      const skills = raw
        .split(/[,|•\n\r·▪▸►]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 50);
      if (skills.length > 0) return skills;
    }
  }

  // Fallback: look for common tech keywords in full text
  const COMMON_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Swift",
    "HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask",
    "FastAPI", "Spring", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Git",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "REST", "GraphQL",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy",
    "Scikit-learn", "Tableau", "Power BI", "Excel", "R", "Statistics", "Spark",
    "Hadoop", "Kafka", "Airflow",
  ];
  return COMMON_SKILLS.filter((s) =>
    fullText.toLowerCase().includes(s.toLowerCase())
  );
}

function extractExperience(sections: Record<string, string>): WorkExperience[] {
  const keys = ["experience", "work experience", "professional experience", "employment", "work history"];
  const found = Object.keys(sections).find((k) => keys.some((key) => k.includes(key)));
  if (!found || !sections[found]) return [];

  const text = sections[found];
  const experiences: WorkExperience[] = [];
  const lines = text.split("\n").filter(Boolean);

  let current: Partial<WorkExperience> | null = null;
  let bullets: string[] = [];

  for (const line of lines) {
    // Heuristic: lines that look like "Company | Title | Duration" or "Company — Title"
    const isTitleLine =
      /\d{4}/.test(line) ||
      /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line) ||
      /present|current/i.test(line);

    if (isTitleLine && line.length < 120) {
      if (current) {
        experiences.push({
          company: current.company ?? "",
          title: current.title ?? "",
          duration: current.duration ?? "",
          bullets,
        });
        bullets = [];
      }
      // Try to parse title/duration
      const parts = line.split(/[|–—,]/);
      current = {
        company: parts[0]?.trim() ?? line,
        title: parts[1]?.trim() ?? "",
        duration: parts[2]?.trim() ?? parts[parts.length - 1]?.trim() ?? "",
      };
    } else if (current && (line.startsWith("•") || line.startsWith("-") || line.startsWith("▪"))) {
      bullets.push(line.replace(/^[•\-▪►▸]\s*/, "").trim());
    } else if (current && line.length > 20) {
      bullets.push(line);
    }
  }

  if (current) {
    experiences.push({
      company: current.company ?? "",
      title: current.title ?? "",
      duration: current.duration ?? "",
      bullets,
    });
  }

  return experiences.slice(0, 5);
}

function extractEducation(sections: Record<string, string>): Education[] {
  const found = Object.keys(sections).find(
    (k) => k.includes("education") || k.includes("academic")
  );
  if (!found || !sections[found]) return [];

  const lines = sections[found].split("\n").filter(Boolean);
  const educations: Education[] = [];

  for (let i = 0; i < lines.length; i += 2) {
    const line1 = lines[i] ?? "";
    const line2 = lines[i + 1] ?? "";

    // Look for year
    const yearMatch = (line1 + " " + line2).match(/\b(19|20)\d{2}\b/);

    educations.push({
      institution: line1,
      degree: line2.split(",")[0] ?? "",
      field: line2.split(",")[1]?.trim() ?? "",
      year: yearMatch ? yearMatch[0] : "",
    });
  }

  return educations.slice(0, 3);
}

function extractProjects(sections: Record<string, string>): Project[] {
  const found = Object.keys(sections).find(
    (k) => k.includes("project")
  );
  if (!found || !sections[found]) return [];

  const lines = sections[found].split("\n").filter(Boolean);
  const projects: Project[] = [];
  let current: Partial<Project> | null = null;
  let descLines: string[] = [];

  for (const line of lines) {
    // Project title heuristic: short line (< 80 chars) followed by description
    if (line.length < 80 && !line.startsWith("•") && !line.startsWith("-") && descLines.length === 0) {
      if (current) {
        projects.push({
          name: current.name ?? "",
          description: descLines.join(" "),
          techStack: current.techStack ?? [],
        });
        descLines = [];
      }
      current = { name: line, techStack: [] };
    } else if (current) {
      // Tech stack line: "Technologies: React, Node.js, ..."
      if (/tech(nolog|stack)|built with|tools:/i.test(line)) {
        const techPart = line.replace(/tech(nolog(ies|y)|stack)|built with|tools:/i, "");
        current.techStack = techPart
          .split(/[,|•]/)
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        descLines.push(line.replace(/^[•\-▪]\s*/, ""));
      }
    }
  }

  if (current) {
    projects.push({
      name: current.name ?? "",
      description: descLines.join(" "),
      techStack: current.techStack ?? [],
    });
  }

  return projects.slice(0, 5);
}

function extractListSection(sections: Record<string, string>, keys: string[]): string[] {
  const found = Object.keys(sections).find((k) => keys.some((key) => k.includes(key)));
  if (!found || !sections[found]) return [];

  return sections[found]
    .split(/[,|\n•·▪►▸\-]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 200);
}
