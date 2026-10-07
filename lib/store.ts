/**
 * lib/store.ts
 * In-memory data store using module-level Maps.
 * Replace with database calls (Prisma / Drizzle) to add persistence.
 */

import bcrypt from "bcryptjs";
import type { Resume, Analysis, User } from "@/types";
import { DEMO_RESUME, DEMO_ANALYSIS, DEMO_USER } from "@/lib/demo-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredUser extends User {
  passwordHash: string;
}

export interface JobDescription {
  id: string;
  userId: string;
  description: string;
  targetRole: string;
  createdAt: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  resumeId: string;
  analysisId: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  skillsScore: number;
  createdAt: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

export const usersMap = new Map<string, StoredUser>();
export const resumesMap = new Map<string, Resume>();
export const analysesMap = new Map<string, Analysis>();
export const progressMap = new Map<string, ProgressEntry[]>();
export const jobsMap = new Map<string, JobDescription>();

// ─── Seed ─────────────────────────────────────────────────────────────────────

let seeded = false;

async function seed() {
  if (seeded) return;
  seeded = true;

  // Demo user
  const passwordHash = await bcrypt.hash("demo123", 10);
  const demoUser: StoredUser = {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    targetRole: "Data Analyst",
    createdAt: "2024-01-01T00:00:00Z",
    passwordHash,
  };
  usersMap.set(demoUser.id, demoUser);

  // Demo resume
  resumesMap.set(DEMO_RESUME.id, DEMO_RESUME);

  // Demo analysis
  analysesMap.set(DEMO_ANALYSIS.id, DEMO_ANALYSIS);

  // Demo progress entry
  const demoProgress: ProgressEntry = {
    id: "progress-demo-001",
    userId: DEMO_USER.id,
    resumeId: DEMO_RESUME.id,
    analysisId: DEMO_ANALYSIS.id,
    targetRole: DEMO_ANALYSIS.targetRole,
    overallScore: DEMO_ANALYSIS.overallScore,
    atsScore: DEMO_ANALYSIS.atsScore,
    jobMatchScore: DEMO_ANALYSIS.jobMatchScore,
    skillsScore: DEMO_ANALYSIS.skillsScore,
    createdAt: DEMO_ANALYSIS.createdAt,
  };
  progressMap.set(DEMO_USER.id, [demoProgress]);
}

// Kick off seeding immediately (top-level await not allowed in CJS, so use .then)
const seedPromise = seed();

/** Ensure seed has completed before first read. */
export async function ensureSeeded(): Promise<void> {
  await seedPromise;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(id: string): Promise<StoredUser | undefined> {
  await ensureSeeded();
  return usersMap.get(id);
}

export async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  await ensureSeeded();
  const lower = email.toLowerCase();
  for (const user of usersMap.values()) {
    if (user.email.toLowerCase() === lower) return user;
  }
  return undefined;
}

export async function createUser(
  id: string,
  email: string,
  name: string,
  passwordHash: string
): Promise<StoredUser> {
  await ensureSeeded();
  const user: StoredUser = {
    id,
    email: email.toLowerCase(),
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  usersMap.set(id, user);
  return user;
}

export async function updateUser(id: string, updates: Partial<Pick<User, "name" | "targetRole">>): Promise<StoredUser | undefined> {
  await ensureSeeded();
  const user = usersMap.get(id);
  if (!user) return undefined;
  const updated: StoredUser = { ...user, ...updates };
  usersMap.set(id, updated);
  return updated;
}

// ─── Resumes ──────────────────────────────────────────────────────────────────

export async function getResume(id: string): Promise<Resume | undefined> {
  await ensureSeeded();
  return resumesMap.get(id);
}

export async function getUserResumes(userId: string): Promise<Resume[]> {
  await ensureSeeded();
  const results: Resume[] = [];
  for (const resume of resumesMap.values()) {
    if (resume.userId === userId) results.push(resume);
  }
  return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createResume(resume: Resume): Promise<Resume> {
  await ensureSeeded();
  resumesMap.set(resume.id, resume);
  return resume;
}

export async function updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
  await ensureSeeded();
  const resume = resumesMap.get(id);
  if (!resume) return undefined;
  const updated: Resume = { ...resume, ...updates };
  resumesMap.set(id, updated);
  return updated;
}

// ─── Analyses ─────────────────────────────────────────────────────────────────

export async function getAnalysis(id: string): Promise<Analysis | undefined> {
  await ensureSeeded();
  return analysesMap.get(id);
}

export async function getUserAnalyses(userId: string): Promise<Analysis[]> {
  await ensureSeeded();
  const results: Analysis[] = [];
  for (const analysis of analysesMap.values()) {
    if (analysis.userId === userId) results.push(analysis);
  }
  return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createAnalysis(analysis: Analysis): Promise<Analysis> {
  await ensureSeeded();
  analysesMap.set(analysis.id, analysis);
  return analysis;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getUserProgress(userId: string): Promise<ProgressEntry[]> {
  await ensureSeeded();
  return progressMap.get(userId) ?? [];
}

export async function addProgressEntry(userId: string, entry: ProgressEntry): Promise<void> {
  await ensureSeeded();
  const existing = progressMap.get(userId) ?? [];
  progressMap.set(userId, [...existing, entry]);
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function getJob(id: string): Promise<JobDescription | undefined> {
  await ensureSeeded();
  return jobsMap.get(id);
}

export async function createJob(job: JobDescription): Promise<JobDescription> {
  await ensureSeeded();
  jobsMap.set(job.id, job);
  return job;
}
