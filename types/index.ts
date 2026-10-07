// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  targetRole?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

// ─── Resume Data Structures ───────────────────────────────────────────────────

export interface WorkExperience {
  company: string;
  title: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  achievements: string[];
  links: string[];
}

export interface Resume {
  id: string;
  userId: string;
  filename: string;
  text: string;
  parsedData: ResumeData;
  createdAt: string;
}

// ─── Analysis Structures ──────────────────────────────────────────────────────

export interface SkillGap {
  skill: string;
  importance: "critical" | "high" | "medium";
  present: boolean;
  matchPercentage: number;
  reason: string;
  whatToDo: string;
}

export interface ATSCheck {
  category: string;
  passed: boolean;
  message: string;
  suggestion: string;
}

export interface ContentSuggestion {
  section: string;
  priority: "high" | "medium" | "low";
  current: string;
  suggested: string;
  reason: string;
}

export interface Resource {
  skill: string;
  title: string;
  type: "course" | "article" | "video" | "book" | "practice";
  provider: string;
  url: string;
  free: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  techStack: string[];
  impact: string;
  estimatedTime: string;
  resumeImpact: string;
}

export interface Analysis {
  id: string;
  userId: string;
  resumeId: string;
  jobDescription: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  skillsScore: number;
  contentScore: number;
  strengths: string[];
  weaknesses: string[];
  skillGaps: SkillGap[];
  atsSuggestions: ATSCheck[];
  contentSuggestions: ContentSuggestion[];
  resources: Resource[];
  projects: ProjectRecommendation[];
  careerActions: string[];
  createdAt: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
