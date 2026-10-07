import type { Resource } from "@/types";

// ─── Role → Required Skills ───────────────────────────────────────────────────

export type RoleSkills = {
  critical: string[];
  high: string[];
  medium: string[];
};

export const ROLE_SKILLS: Record<string, RoleSkills> = {
  "Data Analyst": {
    critical: ["SQL", "Excel", "Python", "Statistics", "Data Visualization"],
    high: ["Power BI", "Tableau", "Pandas", "NumPy", "Data Cleaning"],
    medium: [
      "R",
      "Machine Learning",
      "A/B Testing",
      "Business Intelligence",
      "ETL",
    ],
  },
  "AI/ML Engineer": {
    critical: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
    ],
    high: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "SQL",
      "Feature Engineering",
      "Model Deployment",
    ],
    medium: [
      "MLflow",
      "Docker",
      "Kubernetes",
      "Cloud Platforms",
      "NLP",
      "Computer Vision",
    ],
  },
  "Software Developer": {
    critical: [
      "Data Structures",
      "Algorithms",
      "Problem Solving",
      "Version Control",
      "Git",
    ],
    high: [
      "Java",
      "Python",
      "JavaScript",
      "REST APIs",
      "Databases",
      "SQL",
      "Testing",
    ],
    medium: [
      "Docker",
      "CI/CD",
      "Agile",
      "Cloud Platforms",
      "Microservices",
      "System Design",
    ],
  },
  "Web Developer": {
    critical: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Responsive Design",
      "Version Control",
    ],
    high: [
      "TypeScript",
      "Node.js",
      "REST APIs",
      "SQL",
      "Git",
      "Testing",
      "Performance Optimization",
    ],
    medium: [
      "Docker",
      "CI/CD",
      "GraphQL",
      "Next.js",
      "Tailwind CSS",
      "Accessibility",
    ],
  },
  "Data Scientist": {
    critical: [
      "Python",
      "Statistics",
      "Machine Learning",
      "Pandas",
      "NumPy",
      "SQL",
    ],
    high: [
      "Scikit-learn",
      "Data Visualization",
      "Feature Engineering",
      "Hypothesis Testing",
      "Matplotlib",
    ],
    medium: [
      "Deep Learning",
      "TensorFlow",
      "Spark",
      "R",
      "A/B Testing",
      "Storytelling with Data",
    ],
  },
  "Business Analyst": {
    critical: [
      "SQL",
      "Excel",
      "Data Analysis",
      "Requirements Gathering",
      "Business Process Modeling",
    ],
    high: [
      "Power BI",
      "Tableau",
      "Stakeholder Management",
      "Documentation",
      "Agile",
    ],
    medium: [
      "Python",
      "JIRA",
      "Confluence",
      "Wireframing",
      "Presentation Skills",
      "Project Management",
    ],
  },
};

// ─── Resources Database ───────────────────────────────────────────────────────

export const RESOURCES_DB: Record<string, Resource[]> = {
  SQL: [
    {
      skill: "SQL",
      title: "SQL Tutorial",
      type: "article",
      provider: "W3Schools",
      url: "https://www.w3schools.com/sql/",
      free: true,
      difficulty: "beginner",
      duration: "10 hours",
    },
    {
      skill: "SQL",
      title: "The Mode Analytics SQL Tutorial",
      type: "course",
      provider: "Mode Analytics",
      url: "https://mode.com/sql-tutorial/",
      free: true,
      difficulty: "beginner",
      duration: "8 hours",
    },
    {
      skill: "SQL",
      title: "SQLZoo — Interactive SQL Practice",
      type: "practice",
      provider: "SQLZoo",
      url: "https://sqlzoo.net/",
      free: true,
      difficulty: "beginner",
      duration: "15 hours",
    },
  ],
  Python: [
    {
      skill: "Python",
      title: "The Python Tutorial",
      type: "article",
      provider: "Python.org",
      url: "https://docs.python.org/3/tutorial/",
      free: true,
      difficulty: "beginner",
      duration: "20 hours",
    },
    {
      skill: "Python",
      title: "Learn Python 3",
      type: "course",
      provider: "Codecademy",
      url: "https://www.codecademy.com/learn/learn-python-3",
      free: false,
      difficulty: "beginner",
      duration: "25 hours",
    },
    {
      skill: "Python",
      title: "Python for Everybody Specialization",
      type: "course",
      provider: "Coursera / University of Michigan",
      url: "https://www.coursera.org/specializations/python",
      free: false,
      difficulty: "beginner",
      duration: "40 hours",
    },
  ],
  Pandas: [
    {
      skill: "Pandas",
      title: "10 Minutes to pandas",
      type: "article",
      provider: "Pandas Documentation",
      url: "https://pandas.pydata.org/docs/user_guide/10min.html",
      free: true,
      difficulty: "beginner",
      duration: "2 hours",
    },
    {
      skill: "Pandas",
      title: "Data Analysis with Python — pandas",
      type: "course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
      free: true,
      difficulty: "intermediate",
      duration: "20 hours",
    },
  ],
  Statistics: [
    {
      skill: "Statistics",
      title: "Statistics and Probability",
      type: "course",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/statistics-probability",
      free: true,
      difficulty: "beginner",
      duration: "30 hours",
    },
    {
      skill: "Statistics",
      title: "Think Stats",
      type: "book",
      provider: "Allen B. Downey",
      url: "https://greenteapress.com/thinkstats2/",
      free: true,
      difficulty: "intermediate",
      duration: "20 hours",
    },
  ],
  "Power BI": [
    {
      skill: "Power BI",
      title: "Power BI Guided Learning",
      type: "course",
      provider: "Microsoft Learn",
      url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi",
      free: true,
      difficulty: "beginner",
      duration: "10 hours",
    },
    {
      skill: "Power BI",
      title: "Power BI Essential Training",
      type: "course",
      provider: "LinkedIn Learning",
      url: "https://www.linkedin.com/learning/power-bi-essential-training",
      free: false,
      difficulty: "beginner",
      duration: "8 hours",
    },
  ],
  Tableau: [
    {
      skill: "Tableau",
      title: "Tableau Free Training Videos",
      type: "video",
      provider: "Tableau",
      url: "https://www.tableau.com/learn/training",
      free: true,
      difficulty: "beginner",
      duration: "12 hours",
    },
    {
      skill: "Tableau",
      title: "Data Visualization with Tableau Specialization",
      type: "course",
      provider: "Coursera / UC Davis",
      url: "https://www.coursera.org/specializations/data-visualization",
      free: false,
      difficulty: "intermediate",
      duration: "30 hours",
    },
  ],
  Excel: [
    {
      skill: "Excel",
      title: "Excel for Data Analysis",
      type: "course",
      provider: "Microsoft Learn",
      url: "https://learn.microsoft.com/en-us/training/paths/excel-data-analysis/",
      free: true,
      difficulty: "beginner",
      duration: "8 hours",
    },
  ],
  "Machine Learning": [
    {
      skill: "Machine Learning",
      title: "Machine Learning Specialization",
      type: "course",
      provider: "Coursera / Andrew Ng",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      free: false,
      difficulty: "intermediate",
      duration: "90 hours",
    },
    {
      skill: "Machine Learning",
      title: "Intro to Machine Learning",
      type: "course",
      provider: "Kaggle",
      url: "https://www.kaggle.com/learn/intro-to-machine-learning",
      free: true,
      difficulty: "beginner",
      duration: "5 hours",
    },
  ],
  "Deep Learning": [
    {
      skill: "Deep Learning",
      title: "Deep Learning Specialization",
      type: "course",
      provider: "Coursera / deeplearning.ai",
      url: "https://www.coursera.org/specializations/deep-learning",
      free: false,
      difficulty: "advanced",
      duration: "120 hours",
    },
  ],
  React: [
    {
      skill: "React",
      title: "React Official Tutorial",
      type: "article",
      provider: "React",
      url: "https://react.dev/learn",
      free: true,
      difficulty: "beginner",
      duration: "15 hours",
    },
  ],
  "Node.js": [
    {
      skill: "Node.js",
      title: "Introduction to Node.js",
      type: "course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/introduction-to-node-js/",
      free: true,
      difficulty: "beginner",
      duration: "10 hours",
    },
  ],
  Docker: [
    {
      skill: "Docker",
      title: "Docker Getting Started",
      type: "article",
      provider: "Docker Docs",
      url: "https://docs.docker.com/get-started/",
      free: true,
      difficulty: "beginner",
      duration: "5 hours",
    },
  ],
  Git: [
    {
      skill: "Git",
      title: "Pro Git Book",
      type: "book",
      provider: "Git SCM",
      url: "https://git-scm.com/book/en/v2",
      free: true,
      difficulty: "beginner",
      duration: "10 hours",
    },
  ],
  "Data Visualization": [
    {
      skill: "Data Visualization",
      title: "Data Visualization with Python",
      type: "course",
      provider: "Kaggle",
      url: "https://www.kaggle.com/learn/data-visualization",
      free: true,
      difficulty: "beginner",
      duration: "4 hours",
    },
  ],
  "Scikit-learn": [
    {
      skill: "Scikit-learn",
      title: "Scikit-learn Tutorials",
      type: "article",
      provider: "Scikit-learn",
      url: "https://scikit-learn.org/stable/tutorial/",
      free: true,
      difficulty: "intermediate",
      duration: "8 hours",
    },
  ],
  TypeScript: [
    {
      skill: "TypeScript",
      title: "TypeScript Handbook",
      type: "article",
      provider: "TypeScript",
      url: "https://www.typescriptlang.org/docs/handbook/",
      free: true,
      difficulty: "intermediate",
      duration: "12 hours",
    },
  ],
};

// ─── ATS Rules ────────────────────────────────────────────────────────────────

export interface ATSRule {
  id: string;
  description: string;
  category: string;
  check: (resumeText: string) => boolean;
  passMessage: string;
  failMessage: string;
  suggestion: string;
}

export const ATS_RULES: ATSRule[] = [
  {
    id: "contact-email",
    category: "Contact Information",
    description: "Resume contains an email address",
    check: (text) => /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text),
    passMessage: "Email address detected",
    failMessage: "No email address found",
    suggestion: "Add a professional email address to the top of your resume",
  },
  {
    id: "contact-phone",
    category: "Contact Information",
    description: "Resume contains a phone number",
    check: (text) =>
      /(\+?\d[\d\s\-().]{7,}\d)/.test(text),
    passMessage: "Phone number detected",
    failMessage: "No phone number found",
    suggestion: "Add a phone number to your contact information section",
  },
  {
    id: "sections-experience",
    category: "Resume Sections",
    description: "Resume has an Experience or Work History section",
    check: (text) =>
      /\b(experience|work history|employment|professional experience)\b/i.test(text),
    passMessage: "Experience section detected",
    failMessage: "No Experience section found",
    suggestion: "Add a clearly labeled 'Experience' or 'Work Experience' section",
  },
  {
    id: "sections-education",
    category: "Resume Sections",
    description: "Resume has an Education section",
    check: (text) => /\b(education|academic|degree|university|college)\b/i.test(text),
    passMessage: "Education section detected",
    failMessage: "No Education section found",
    suggestion: "Add an 'Education' section listing your degrees and institutions",
  },
  {
    id: "sections-skills",
    category: "Resume Sections",
    description: "Resume has a Skills section",
    check: (text) => /\b(skills|technical skills|core competencies|competencies)\b/i.test(text),
    passMessage: "Skills section detected",
    failMessage: "No Skills section found",
    suggestion: "Add a dedicated 'Skills' section with your technical and soft skills",
  },
  {
    id: "length-appropriate",
    category: "Formatting",
    description: "Resume is an appropriate length (200–800 words)",
    check: (text) => {
      const wordCount = text.trim().split(/\s+/).length;
      return wordCount >= 200 && wordCount <= 800;
    },
    passMessage: "Resume length is appropriate",
    failMessage: "Resume may be too short or too long",
    suggestion: "Aim for 400–600 words for a one-page resume",
  },
  {
    id: "quantified-achievements",
    category: "Content Quality",
    description: "Resume contains measurable achievements (numbers/percentages)",
    check: (text) => /\d+%|\d+ (users|customers|revenue|projects|teams|months|years)/i.test(text),
    passMessage: "Quantified achievements detected",
    failMessage: "No quantified achievements found",
    suggestion:
      "Add measurable results (e.g., 'Increased sales by 20%', 'Managed a team of 5')",
  },
  {
    id: "action-verbs",
    category: "Content Quality",
    description: "Experience bullets use strong action verbs",
    check: (text) =>
      /\b(developed|implemented|designed|led|built|created|managed|improved|reduced|increased|analyzed|optimized)\b/i.test(
        text
      ),
    passMessage: "Action verbs detected in experience",
    failMessage: "Weak or missing action verbs in experience",
    suggestion:
      "Start each bullet point with a strong action verb like 'Developed', 'Led', or 'Implemented'",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalize a free-text role name to one of the known ROLE_SKILLS keys */
export function normalizeRole(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes("data analyst") || lower.includes("data analysis"))
    return "Data Analyst";
  if (lower.includes("ml") || lower.includes("machine learning") || lower.includes("ai engineer"))
    return "AI/ML Engineer";
  if (lower.includes("data scientist")) return "Data Scientist";
  if (lower.includes("web dev") || lower.includes("frontend") || lower.includes("front-end"))
    return "Web Developer";
  if (lower.includes("business analyst")) return "Business Analyst";
  if (lower.includes("software") || lower.includes("backend") || lower.includes("back-end"))
    return "Software Developer";
  // default
  return "Software Developer";
}
