import { v4 as uuidv4 } from "uuid";
import type { Analysis, ContentSuggestion, ProjectRecommendation, SkillGap } from "@/types";
import { RESOURCES_DB, ROLE_SKILLS, normalizeRole } from "@/lib/knowledge-base";
import {
  computeAtsScore,
  computeJobMatchScore,
  computeOverallScore,
  computeSkillsScore,
  runAtsChecks,
} from "@/lib/scoring";

// ─── Skill Extractor ──────────────────────────────────────────────────────────

function extractSkillsFromText(text: string): string[] {
  const allSkills = new Set<string>();
  const lower = text.toLowerCase();

  // Collect every skill mentioned in ROLE_SKILLS
  for (const roleData of Object.values(ROLE_SKILLS)) {
    for (const skill of [
      ...roleData.critical,
      ...roleData.high,
      ...roleData.medium,
    ]) {
      if (lower.includes(skill.toLowerCase())) {
        allSkills.add(skill);
      }
    }
  }

  return [...allSkills];
}

// ─── Content Quality Analyzer ─────────────────────────────────────────────────

const WEAK_PHRASES: Array<{ pattern: RegExp; suggestion: string }> = [
  {
    pattern: /responsible for/gi,
    suggestion: "Replace 'responsible for' with a strong action verb like 'Led' or 'Managed'",
  },
  {
    pattern: /helped with/gi,
    suggestion:
      "Replace 'helped with' with a specific contribution: 'Contributed to X by doing Y'",
  },
  {
    pattern: /worked on/gi,
    suggestion: "Replace 'worked on' with a concrete action: 'Developed', 'Built', 'Implemented'",
  },
  {
    pattern: /assisted in/gi,
    suggestion:
      "Replace 'assisted in' with a direct action verb showing your individual impact",
  },
  {
    pattern: /involved in/gi,
    suggestion: "Replace 'involved in' with a specific role and outcome",
  },
];

function buildContentSuggestions(resumeText: string): ContentSuggestion[] {
  const suggestions: ContentSuggestion[] = [];

  for (const { pattern, suggestion } of WEAK_PHRASES) {
    const match = pattern.exec(resumeText);
    if (match) {
      suggestions.push({
        section: "Experience",
        priority: "high",
        current: match[0],
        suggested: suggestion,
        reason:
          "Weak phrases reduce ATS scoring and fail to communicate the impact of your work",
      });
    }
  }

  // Check for missing quantified achievements
  if (!/\d+%|\d+ (users|customers|revenue|projects|teams|months|years)/i.test(resumeText)) {
    suggestions.push({
      section: "Experience",
      priority: "high",
      current: "No quantified achievements found",
      suggested:
        "Add measurable results such as 'Improved load time by 35%' or 'Served 1,000+ users'",
      reason:
        "Quantified achievements are among the top factors recruiters and ATS systems look for",
    });
  }

  // Check for summary/objective section
  if (!/\b(summary|objective|profile|about)\b/i.test(resumeText)) {
    suggestions.push({
      section: "Summary",
      priority: "medium",
      current: "No professional summary found",
      suggested:
        "Add a 2–3 sentence professional summary at the top highlighting your experience, skills, and target role",
      reason:
        "A professional summary helps recruiters quickly understand your profile and improves ATS matching",
    });
  }

  return suggestions;
}

// ─── Project Recommendations ──────────────────────────────────────────────────

function buildProjectRecommendations(
  missingSkills: string[],
  targetRole: string
): ProjectRecommendation[] {
  const roleProjects: Record<string, ProjectRecommendation[]> = {
    "Data Analyst": [
      {
        title: "Sales Dashboard with SQL & Power BI",
        description:
          "Build a complete sales analytics dashboard by querying a public dataset with SQL and visualizing KPIs in Power BI.",
        techStack: ["SQL", "Power BI", "Excel"],
        impact:
          "Demonstrates end-to-end data workflow — extraction, transformation, and visualization",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects section: 'Built a Power BI sales dashboard using SQL queries on 50,000+ records, reducing reporting time by 60%'",
      },
      {
        title: "Statistical Analysis of Public Dataset",
        description:
          "Perform exploratory data analysis and hypothesis testing on a Kaggle dataset using Python, Pandas, and statistical methods.",
        techStack: ["Python", "Pandas", "NumPy", "Statistics", "Matplotlib"],
        impact: "Shows proficiency in data analysis and statistical reasoning",
        estimatedTime: "1–2 weeks",
        resumeImpact:
          "Add to Projects: 'Performed statistical analysis on 10,000+ records, identifying 3 key revenue drivers'",
      },
      {
        title: "Customer Churn Prediction Model",
        description:
          "Analyze customer data to predict churn using Python and Scikit-learn, and present findings in a Tableau dashboard.",
        techStack: ["Python", "Pandas", "Scikit-learn", "Tableau"],
        impact:
          "Bridges data analysis with machine learning and storytelling — highly valued in data roles",
        estimatedTime: "3–4 weeks",
        resumeImpact:
          "Add to Projects: 'Built churn prediction model (82% accuracy) and Tableau dashboard used by a team of 3 analysts'",
      },
    ],
    "AI/ML Engineer": [
      {
        title: "Image Classification with CNN",
        description:
          "Build and train a convolutional neural network on a public image dataset using TensorFlow or PyTorch.",
        techStack: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
        impact: "Demonstrates hands-on deep learning model development",
        estimatedTime: "3–4 weeks",
        resumeImpact: "Add to Projects: 'Trained CNN achieving 94% accuracy on image classification'",
      },
      {
        title: "NLP Text Classification API",
        description:
          "Build a text classification model using Hugging Face Transformers and deploy it as a REST API with FastAPI.",
        techStack: ["Python", "NLP", "Hugging Face", "FastAPI", "Docker"],
        impact: "Shows end-to-end ML deployment skills",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects: 'Deployed NLP text classifier as REST API with 96% accuracy, handling 500 requests/day'",
      },
      {
        title: "ML Model Monitoring Dashboard",
        description:
          "Build a monitoring dashboard for a deployed ML model using MLflow and Streamlit.",
        techStack: ["Python", "MLflow", "Streamlit", "Scikit-learn"],
        impact: "Demonstrates MLOps knowledge, which is highly sought after",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects: 'Built MLflow tracking dashboard monitoring model drift across 3 production models'",
      },
    ],
    "Software Developer": [
      {
        title: "Full-Stack Task Management App",
        description:
          "Build a full-stack task management application with user authentication, CRUD operations, and a REST API.",
        techStack: ["Node.js", "React", "SQL", "REST APIs", "Git"],
        impact: "Demonstrates full-stack development and system design skills",
        estimatedTime: "3–4 weeks",
        resumeImpact:
          "Add to Projects: 'Built full-stack task app with JWT auth serving 500+ users, deployed on AWS'",
      },
      {
        title: "Microservices E-Commerce Backend",
        description:
          "Design and implement a microservices architecture for an e-commerce backend with Docker and CI/CD.",
        techStack: ["Docker", "CI/CD", "Microservices", "REST APIs"],
        impact: "Shows system design and DevOps competency",
        estimatedTime: "4–6 weeks",
        resumeImpact:
          "Add to Projects: 'Implemented microservices architecture reducing deployment time by 40%'",
      },
      {
        title: "Open-Source Contribution",
        description:
          "Contribute to a popular open-source project on GitHub — fix bugs, improve documentation, or add features.",
        techStack: ["Git", "Version Control", "Testing"],
        impact: "Shows real-world collaboration and code quality skills",
        estimatedTime: "1–2 weeks",
        resumeImpact:
          "Add to Projects: 'Contributed 3 PRs to [project] (1,200+ GitHub stars) improving test coverage by 15%'",
      },
    ],
    "Web Developer": [
      {
        title: "Responsive Portfolio Website",
        description:
          "Build a fully responsive personal portfolio with a modern UI, animations, and accessibility compliance.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        impact: "Live demo of your frontend skills",
        estimatedTime: "1–2 weeks",
        resumeImpact:
          "Add to Projects: 'Built portfolio site with 95+ Lighthouse score, fully responsive across all devices'",
      },
      {
        title: "Full-Stack Blog Platform",
        description:
          "Build a full-stack blog platform with a content management system, authentication, and SEO optimization.",
        techStack: ["Next.js", "Node.js", "SQL", "TypeScript"],
        impact: "Demonstrates both frontend and backend skills",
        estimatedTime: "3–4 weeks",
        resumeImpact:
          "Add to Projects: 'Built full-stack blog with CMS, SEO optimization, and 300ms average load time'",
      },
      {
        title: "Real-Time Chat Application",
        description: "Build a real-time chat application using WebSockets and a React frontend.",
        techStack: ["React", "Node.js", "WebSockets", "TypeScript"],
        impact: "Shows real-time programming and system design skills",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects: 'Built real-time chat app supporting 100 concurrent users with <50ms latency'",
      },
    ],
    "Data Scientist": [
      {
        title: "End-to-End ML Pipeline",
        description:
          "Build a complete machine learning pipeline from data collection to model deployment using Scikit-learn and MLflow.",
        techStack: ["Python", "Pandas", "Scikit-learn", "MLflow"],
        impact: "Shows end-to-end data science workflow",
        estimatedTime: "3–4 weeks",
        resumeImpact:
          "Add to Projects: 'Built ML pipeline (data → model → API) achieving 89% accuracy, deployed with MLflow'",
      },
      {
        title: "A/B Testing Framework",
        description:
          "Design and implement an A/B testing framework with statistical significance testing for a web application.",
        techStack: ["Python", "Statistics", "Pandas", "Hypothesis Testing"],
        impact: "Highly valued in product data science roles",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects: 'Built A/B testing framework detecting 5% conversion improvements at 95% confidence'",
      },
    ],
    "Business Analyst": [
      {
        title: "Business KPI Dashboard",
        description:
          "Create an executive-level KPI dashboard in Power BI using a public business dataset with drill-down capabilities.",
        techStack: ["Power BI", "SQL", "Excel"],
        impact: "Direct demonstration of business intelligence skills",
        estimatedTime: "1–2 weeks",
        resumeImpact:
          "Add to Projects: 'Built executive KPI dashboard tracking 15 metrics, reducing report generation time by 70%'",
      },
      {
        title: "Business Process Automation",
        description:
          "Map and automate a repetitive business process using Python scripting and document the solution.",
        techStack: ["Python", "Documentation", "Process Modeling"],
        impact: "Shows analytical and automation skills valued by employers",
        estimatedTime: "2–3 weeks",
        resumeImpact:
          "Add to Projects: 'Automated manual reporting process saving 8 hours/week for a team of 4'",
      },
    ],
  };

  const projects = roleProjects[targetRole] ?? roleProjects["Software Developer"];

  // Filter projects that are relevant to the missing skills
  const filtered = projects.filter((p) =>
    p.techStack.some((tech) =>
      missingSkills.some(
        (ms) => tech.toLowerCase().includes(ms.toLowerCase()) || ms.toLowerCase().includes(tech.toLowerCase())
      )
    )
  );

  // Return top 3 (filtered first, then pad with role defaults)
  const combined = [...filtered, ...projects.filter((p) => !filtered.includes(p))];
  return combined.slice(0, 3);
}

// ─── Main Analyzer ────────────────────────────────────────────────────────────

export function analyzeResume(
  resumeText: string,
  jobDescription: string,
  targetRole: string,
  userId = "demo-user",
  resumeId = "demo-resume"
): Analysis {
  // 1. Normalize role
  const normalizedRole = normalizeRole(targetRole);
  const roleSkills = ROLE_SKILLS[normalizedRole] ?? ROLE_SKILLS["Software Developer"];

  // 2. Extract skills from resume text
  const resumeSkills = extractSkillsFromText(resumeText);

  // 3. Also look for skills mentioned in the job description
  const jdSkills = extractSkillsFromText(jobDescription);

  // 4. Compute scores
  const atsScore = computeAtsScore(resumeText, normalizedRole);
  const jobMatchScore = computeJobMatchScore(resumeSkills, roleSkills);
  const allRoleSkills = [
    ...roleSkills.critical,
    ...roleSkills.high,
    ...roleSkills.medium,
  ];
  const matchedCount = allRoleSkills.filter((s) => resumeSkills.includes(s)).length;
  const skillsScore = computeSkillsScore(matchedCount, allRoleSkills.length);

  // Content score: based on presence of action verbs, quantified achievements, and sections
  const contentItems = [
    /\b(developed|implemented|designed|led|built|created|managed|improved|reduced|increased|analyzed|optimized)\b/i.test(
      resumeText
    ),
    /\d+%|\d+ (users|customers|revenue|projects|teams|months|years)/i.test(resumeText),
    /\b(summary|objective|profile)\b/i.test(resumeText),
    /\b(certifications?|awards?|achievements?)\b/i.test(resumeText),
    !WEAK_PHRASES.some(({ pattern }) => pattern.test(resumeText)),
  ];
  const contentScore = Math.round((contentItems.filter(Boolean).length / contentItems.length) * 100);

  const overallScore = computeOverallScore(atsScore, jobMatchScore, skillsScore, contentScore);

  // 5. Build skill gaps
  const skillGaps: SkillGap[] = [];
  const missingSkills: string[] = [];

  const normalize = (s: string) => s.toLowerCase().trim();
  const resumeSkillSet = new Set(resumeSkills.map(normalize));
  const hasSkill = (skill: string) => {
    const s = normalize(skill);
    return (
      resumeSkillSet.has(s) ||
      [...resumeSkillSet].some((rs) => rs.includes(s) || s.includes(rs))
    );
  };

  const skillsToCheck: Array<{ skill: string; importance: SkillGap["importance"] }> = [
    ...roleSkills.critical.map((s) => ({ skill: s, importance: "critical" as const })),
    ...roleSkills.high.map((s) => ({ skill: s, importance: "high" as const })),
    ...roleSkills.medium.map((s) => ({ skill: s, importance: "medium" as const })),
  ];

  for (const { skill, importance } of skillsToCheck) {
    const present = hasSkill(skill);
    if (!present) {
      missingSkills.push(skill);
      // Check if it appears in the job description
      const inJD = jdSkills.includes(skill) || jobDescription.toLowerCase().includes(skill.toLowerCase());

      skillGaps.push({
        skill,
        importance,
        present: false,
        matchPercentage: 0,
        reason: inJD
          ? `${skill} is explicitly mentioned in the target job description but is missing from your resume`
          : `${skill} is a ${importance} skill for ${normalizedRole} roles and is not present in your resume`,
        whatToDo: `Learn ${skill} fundamentals${
          RESOURCES_DB[skill] ? `, complete a ${skill} project` : ""
        }, and add the skill and resulting project/certification to your resume`,
      });
    }
  }

  // 6. ATS checks
  const atsSuggestions = runAtsChecks(resumeText);

  // 7. Content suggestions
  const contentSuggestions = buildContentSuggestions(resumeText);

  // 8. Resources: map each missing skill to resources from DB
  const resources = missingSkills
    .flatMap((skill) => RESOURCES_DB[skill] ?? [])
    .slice(0, 8);

  // 9. Project recommendations
  const projects = buildProjectRecommendations(missingSkills, normalizedRole);

  // 10. Strengths & weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (resumeSkills.length >= 3) strengths.push(`Strong skill set: ${resumeSkills.slice(0, 3).join(", ")}`);
  if (atsScore >= 60) strengths.push("Resume passes basic ATS checks");
  if (/\b(project|github|portfolio)\b/i.test(resumeText)) strengths.push("Includes relevant projects");
  if (/\b(certif|award|achievement)\b/i.test(resumeText)) strengths.push("Has certifications or achievements");

  if (missingSkills.filter((_, i) => skillsToCheck[i]?.importance === "critical").length > 0)
    weaknesses.push(
      `Missing critical skills: ${roleSkills.critical.filter((s) => !hasSkill(s)).join(", ")}`
    );
  if (atsScore < 60) weaknesses.push("ATS compatibility needs improvement");
  if (contentScore < 60) weaknesses.push("Experience bullets lack measurable achievements");
  if (skillGaps.length > 5) weaknesses.push("Significant skill gaps relative to target role");

  // 11. Career actions
  const careerActions = [
    `Complete at least one hands-on project in ${missingSkills[0] ?? "your target skill area"}`,
    `Earn a certification relevant to ${normalizedRole} (e.g., from Coursera or LinkedIn Learning)`,
    "Rewrite all experience bullets to start with strong action verbs and include measurable outcomes",
    `Increase your skill match from ${skillsScore}% to 80%+ by learning the missing skills`,
    "Update your LinkedIn profile to match your improved resume",
    "Apply to 5 relevant internships/roles and track your application outcomes",
  ];

  return {
    id: uuidv4(),
    userId,
    resumeId,
    jobDescription,
    targetRole: normalizedRole,
    overallScore,
    atsScore,
    jobMatchScore,
    skillsScore,
    contentScore,
    strengths,
    weaknesses,
    skillGaps,
    atsSuggestions,
    contentSuggestions,
    resources,
    projects,
    careerActions,
    createdAt: new Date().toISOString(),
  };
}
