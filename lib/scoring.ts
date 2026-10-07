import type { RoleSkills } from "@/lib/knowledge-base";
import { ATS_RULES } from "@/lib/knowledge-base";

// ─── ATS Score ────────────────────────────────────────────────────────────────

/**
 * Computes an ATS compatibility score (0–100).
 *
 * Weights:
 *   40% — keyword match against common ATS-parsed fields
 *   30% — formatting checks (action verbs, quantified results, length)
 *   15% — required sections present
 *   15% — contact info complete
 */
export function computeAtsScore(resumeText: string, _role: string): number {
  const text = resumeText.toLowerCase();

  // Contact info (15%)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  const contactScore = ((hasEmail ? 1 : 0) + (hasPhone ? 1 : 0)) / 2;

  // Sections present (15%)
  const sectionChecks = [
    /\b(experience|work history|employment)\b/i.test(resumeText),
    /\b(education|degree|university|college)\b/i.test(resumeText),
    /\b(skills|competencies)\b/i.test(resumeText),
  ];
  const sectionScore = sectionChecks.filter(Boolean).length / sectionChecks.length;

  // Formatting (30%)
  const wordCount = resumeText.trim().split(/\s+/).length;
  const goodLength = wordCount >= 200 && wordCount <= 800;
  const hasActionVerbs =
    /\b(developed|implemented|designed|led|built|created|managed|improved|reduced|increased|analyzed|optimized)\b/i.test(
      resumeText
    );
  const hasQuantified = /\d+%|\d+ (users|customers|revenue|projects|teams|months|years)/i.test(
    resumeText
  );
  const formattingScore = ((goodLength ? 1 : 0) + (hasActionVerbs ? 1 : 0) + (hasQuantified ? 1 : 0)) / 3;

  // Keyword match (40%) — checks for generic professional keywords
  const professionalKeywords = [
    "experience",
    "project",
    "team",
    "skill",
    "develop",
    "implement",
    "manage",
    "design",
    "analyze",
    "result",
    "achieve",
    "improve",
    "lead",
    "collaborate",
  ];
  const matchedKeywords = professionalKeywords.filter((kw) => text.includes(kw)).length;
  const keywordScore = matchedKeywords / professionalKeywords.length;

  const total =
    contactScore * 0.15 +
    sectionScore * 0.15 +
    formattingScore * 0.3 +
    keywordScore * 0.4;

  return Math.round(total * 100);
}

// ─── Job Match Score ──────────────────────────────────────────────────────────

/**
 * Computes a job match score (0–100) by checking how many required skills
 * from the target role the resume already mentions.
 *
 * Weights:
 *   45% — critical skills
 *   35% — high skills
 *   20% — medium skills
 */
export function computeJobMatchScore(
  resumeSkills: string[],
  roleSkills: RoleSkills
): number {
  const normalize = (s: string) => s.toLowerCase().trim();
  const skillSet = new Set(resumeSkills.map(normalize));

  const hasSkill = (skill: string) => {
    const s = normalize(skill);
    return skillSet.has(s) || [...skillSet].some((rs) => rs.includes(s) || s.includes(rs));
  };

  const criticalMatch =
    roleSkills.critical.length > 0
      ? roleSkills.critical.filter(hasSkill).length / roleSkills.critical.length
      : 1;
  const highMatch =
    roleSkills.high.length > 0
      ? roleSkills.high.filter(hasSkill).length / roleSkills.high.length
      : 1;
  const mediumMatch =
    roleSkills.medium.length > 0
      ? roleSkills.medium.filter(hasSkill).length / roleSkills.medium.length
      : 1;

  const score = criticalMatch * 0.45 + highMatch * 0.35 + mediumMatch * 0.2;
  return Math.round(score * 100);
}

// ─── Skills Score ─────────────────────────────────────────────────────────────

/**
 * Simple ratio of matched skills to total skills required.
 */
export function computeSkillsScore(matched: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((matched / total) * 100);
}

// ─── Overall Score ────────────────────────────────────────────────────────────

/**
 * Weighted composite of the four sub-scores.
 *
 * Weights:
 *   30% — ATS score
 *   30% — job match score
 *   25% — skills score
 *   15% — content score
 */
export function computeOverallScore(
  ats: number,
  jobMatch: number,
  skills: number,
  content: number
): number {
  return Math.round(ats * 0.3 + jobMatch * 0.3 + skills * 0.25 + content * 0.15);
}

// ─── Run All ATS Checks ───────────────────────────────────────────────────────

export function runAtsChecks(resumeText: string) {
  return ATS_RULES.map((rule) => {
    const passed = rule.check(resumeText);
    return {
      category: rule.category,
      passed,
      message: passed ? rule.passMessage : rule.failMessage,
      suggestion: rule.suggestion,
    };
  });
}
