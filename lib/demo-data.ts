import type { Resume, Analysis, AuthUser } from "@/types";

// ─── Demo User ────────────────────────────────────────────────────────────────

export const DEMO_USER: AuthUser = {
  id: "demo-user-001",
  email: "demo@example.com",
  name: "Demo User",
};

// ─── Demo Resume ──────────────────────────────────────────────────────────────

export const DEMO_RESUME: Resume = {
  id: "resume-demo-001",
  userId: "demo-user-001",
  filename: "Alex_Johnson_Resume.pdf",
  text: `ALEX JOHNSON
alex.johnson@email.com | (555) 123-4567 | linkedin.com/in/alexjohnson | github.com/alexjohnson

EDUCATION
State University — Bachelor of Science in Computer Science
Expected Graduation: May 2024 | GPA: 3.7/4.0

EXPERIENCE

Tech Solutions Inc. — Software Engineering Intern
June 2023 – August 2023
• Worked on developing a customer dashboard using React and Node.js
• Helped with implementing REST APIs for user authentication
• Assisted in debugging production issues and writing unit tests
• Participated in daily stand-ups and sprint planning meetings

Campus IT Help Desk — Student Technician
September 2022 – May 2023
• Responsible for troubleshooting hardware and software issues for students and faculty
• Helped with setting up new workstations and installing software
• Worked on documenting common technical issues

PROJECTS

E-Commerce Web Application
Developed a full-stack e-commerce website as a team project
Technologies: React, JavaScript, HTML, CSS, Firebase
Implemented user authentication, product catalog, shopping cart functionality

Weather Forecast App
Built a weather application that displays forecasts using a public API
Technologies: JavaScript, HTML, CSS, API Integration
Worked on responsive design for mobile devices

SKILLS
Programming: Python, JavaScript, HTML, CSS
Tools: Git, VS Code, Postman
Other: Communication, Teamwork, Problem Solving

ACHIEVEMENTS
• Dean's List (Fall 2022, Spring 2023)
• Completed 2 online courses in web development`,
  parsedData: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    summary: "",
    skills: [
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Node.js",
      "Git",
      "REST APIs",
      "Firebase",
    ],
    experience: [
      {
        company: "Tech Solutions Inc.",
        title: "Software Engineering Intern",
        duration: "June 2023 – August 2023",
        bullets: [
          "Worked on developing a customer dashboard using React and Node.js",
          "Helped with implementing REST APIs for user authentication",
          "Assisted in debugging production issues and writing unit tests",
          "Participated in daily stand-ups and sprint planning meetings",
        ],
      },
      {
        company: "Campus IT Help Desk",
        title: "Student Technician",
        duration: "September 2022 – May 2023",
        bullets: [
          "Responsible for troubleshooting hardware and software issues for students and faculty",
          "Helped with setting up new workstations and installing software",
          "Worked on documenting common technical issues",
        ],
      },
    ],
    education: [
      {
        institution: "State University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        year: "2024",
      },
    ],
    projects: [
      {
        name: "E-Commerce Web Application",
        description:
          "Developed a full-stack e-commerce website as a team project. Implemented user authentication, product catalog, shopping cart functionality",
        techStack: ["React", "JavaScript", "HTML", "CSS", "Firebase"],
      },
      {
        name: "Weather Forecast App",
        description:
          "Built a weather application that displays forecasts using a public API. Worked on responsive design for mobile devices",
        techStack: ["JavaScript", "HTML", "CSS", "API Integration"],
      },
    ],
    certifications: [],
    achievements: [
      "Dean's List (Fall 2022, Spring 2023)",
      "Completed 2 online courses in web development",
    ],
    links: [
      "linkedin.com/in/alexjohnson",
      "github.com/alexjohnson",
    ],
  },
  createdAt: "2024-01-15T10:30:00Z",
};

// ─── Demo Job Description ─────────────────────────────────────────────────────

export const DEMO_JOB = {
  role: "Data Analyst",
  description: `Data Analyst — FinTech Innovations Inc.

Location: Remote | Full-Time

About the Role:
We are seeking a detail-oriented Data Analyst to join our analytics team. You will be responsible for analyzing large datasets, building dashboards, and providing data-driven insights to support business decisions.

Responsibilities:
• Analyze customer behavior, transaction patterns, and product performance using SQL and Python
• Build interactive dashboards and visualizations in Power BI and Tableau
• Perform statistical analysis and A/B testing to measure product improvements
• Collaborate with product managers, engineers, and stakeholders to define metrics and KPIs
• Clean, transform, and validate data from multiple sources
• Present findings to non-technical stakeholders in a clear and actionable manner

Requirements:
• Bachelor's degree in Computer Science, Statistics, Economics, or related field
• Proficiency in SQL for querying and manipulating large datasets
• Experience with Python (Pandas, NumPy) for data analysis
• Strong understanding of statistics, probability, and hypothesis testing
• Experience building dashboards in Power BI or Tableau
• Excellent communication and presentation skills
• 0-2 years of experience (internships and projects count)

Nice to Have:
• Experience with Excel (pivot tables, VLOOKUP, macros)
• Familiarity with data warehousing concepts and ETL pipelines
• Knowledge of machine learning basics
• Experience with version control (Git)

What We Offer:
• Competitive salary and equity
• Remote-first culture
• Professional development budget
• Mentorship from senior data scientists and analysts`,
};

// ─── Demo Analysis ────────────────────────────────────────────────────────────

export const DEMO_ANALYSIS: Analysis = {
  id: "analysis-demo-001",
  userId: "demo-user-001",
  resumeId: "resume-demo-001",
  jobDescription: DEMO_JOB.description,
  targetRole: "Data Analyst",
  overallScore: 64,
  atsScore: 58,
  jobMatchScore: 61,
  skillsScore: 45,
  contentScore: 71,
  strengths: [
    "Strong skill set: Python, JavaScript, HTML",
    "Includes relevant projects",
    "Has certifications or achievements",
  ],
  weaknesses: [
    "Missing critical skills: SQL, Excel, Statistics, Data Visualization",
    "ATS compatibility needs improvement",
    "Experience bullets lack measurable achievements",
    "Significant skill gaps relative to target role",
  ],
  skillGaps: [
    {
      skill: "SQL",
      importance: "critical",
      present: false,
      matchPercentage: 0,
      reason:
        "SQL is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn SQL fundamentals, complete a SQL project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Excel",
      importance: "critical",
      present: false,
      matchPercentage: 0,
      reason:
        "Excel is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn Excel fundamentals, complete a Excel project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Statistics",
      importance: "critical",
      present: false,
      matchPercentage: 0,
      reason:
        "Statistics is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn Statistics fundamentals, complete a Statistics project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Data Visualization",
      importance: "critical",
      present: false,
      matchPercentage: 0,
      reason:
        "Data Visualization is a critical skill for Data Analyst roles and is not present in your resume",
      whatToDo:
        "Learn Data Visualization fundamentals, complete a Data Visualization project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Power BI",
      importance: "high",
      present: false,
      matchPercentage: 0,
      reason:
        "Power BI is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn Power BI fundamentals, complete a Power BI project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Tableau",
      importance: "high",
      present: false,
      matchPercentage: 0,
      reason:
        "Tableau is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn Tableau fundamentals, complete a Tableau project, and add the skill and resulting project/certification to your resume",
    },
    {
      skill: "Pandas",
      importance: "high",
      present: false,
      matchPercentage: 0,
      reason:
        "Pandas is explicitly mentioned in the target job description but is missing from your resume",
      whatToDo:
        "Learn Pandas fundamentals, complete a Pandas project, and add the skill and resulting project/certification to your resume",
    },
  ],
  atsSuggestions: [
    {
      category: "Contact Information",
      passed: true,
      message: "Email address detected",
      suggestion: "Add a professional email address to the top of your resume",
    },
    {
      category: "Contact Information",
      passed: true,
      message: "Phone number detected",
      suggestion: "Add a phone number to your contact information section",
    },
    {
      category: "Resume Sections",
      passed: true,
      message: "Experience section detected",
      suggestion:
        "Add a clearly labeled 'Experience' or 'Work Experience' section",
    },
    {
      category: "Resume Sections",
      passed: true,
      message: "Education section detected",
      suggestion:
        "Add an 'Education' section listing your degrees and institutions",
    },
    {
      category: "Resume Sections",
      passed: true,
      message: "Skills section detected",
      suggestion:
        "Add a dedicated 'Skills' section with your technical and soft skills",
    },
    {
      category: "Formatting",
      passed: true,
      message: "Resume length is appropriate",
      suggestion: "Aim for 400–600 words for a one-page resume",
    },
    {
      category: "Content Quality",
      passed: false,
      message: "No quantified achievements found",
      suggestion:
        "Add measurable results (e.g., 'Increased sales by 20%', 'Managed a team of 5')",
    },
    {
      category: "Content Quality",
      passed: true,
      message: "Action verbs detected in experience",
      suggestion:
        "Start each bullet point with a strong action verb like 'Developed', 'Led', or 'Implemented'",
    },
  ],
  contentSuggestions: [
    {
      section: "Experience",
      priority: "high",
      current: "Worked on",
      suggested:
        "Replace 'worked on' with a concrete action: 'Developed', 'Built', 'Implemented'",
      reason:
        "Weak phrases reduce ATS scoring and fail to communicate the impact of your work",
    },
    {
      section: "Experience",
      priority: "high",
      current: "Helped with",
      suggested:
        "Replace 'helped with' with a specific contribution: 'Contributed to X by doing Y'",
      reason:
        "Weak phrases reduce ATS scoring and fail to communicate the impact of your work",
    },
    {
      section: "Experience",
      priority: "high",
      current: "Responsible for",
      suggested:
        "Replace 'responsible for' with a strong action verb like 'Led' or 'Managed'",
      reason:
        "Weak phrases reduce ATS scoring and fail to communicate the impact of your work",
    },
    {
      section: "Experience",
      priority: "high",
      current: "No quantified achievements found",
      suggested:
        "Add measurable results such as 'Improved load time by 35%' or 'Served 1,000+ users'",
      reason:
        "Quantified achievements are among the top factors recruiters and ATS systems look for",
    },
    {
      section: "Summary",
      priority: "medium",
      current: "No professional summary found",
      suggested:
        "Add a 2–3 sentence professional summary at the top highlighting your experience, skills, and target role",
      reason:
        "A professional summary helps recruiters quickly understand your profile and improves ATS matching",
    },
  ],
  resources: [
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
  ],
  projects: [
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
  careerActions: [
    "Complete at least one hands-on project in SQL",
    "Earn a certification relevant to Data Analyst (e.g., from Coursera or LinkedIn Learning)",
    "Rewrite all experience bullets to start with strong action verbs and include measurable outcomes",
    "Increase your skill match from 45% to 80%+ by learning the missing skills",
    "Update your LinkedIn profile to match your improved resume",
    "Apply to 5 relevant internships/roles and track your application outcomes",
  ],
  createdAt: "2024-01-15T14:45:00Z",
};
