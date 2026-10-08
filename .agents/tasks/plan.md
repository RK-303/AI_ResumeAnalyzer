# Implementation Plan — AI Resume Analyzer

> **Note:** This plan has been decomposed into FEAT artifacts under `.agents/tasks/task-ai-resume-analyzer/`. The workflow executes one FEAT coder step per feature in order. This file serves as the overview and fallback.

---

## Architecture Decisions

### Full-stack Next.js 16, no separate backend
All API logic lives in `app/api/*/route.ts` route handlers. In-memory Maps for MVP storage. Decision: simplest deployment path, easiest local dev, clean seam to add a real DB later.

### Next.js 16 async-only APIs (CRITICAL)
`params`, `searchParams`, `cookies()`, `headers()` are ALL async/Promise in Next.js 16. There is zero synchronous compatibility layer. Every server component page and layout must `await params`. Route handlers use `const { id } = await params`. Client components use `useParams()` (synchronous hook). Failure to do this causes build errors or silent runtime failures.

### Tailwind v4 CSS-first configuration
No `tailwind.config.js`. Configuration lives entirely in `app/globals.css` via `@theme {}` block. Import syntax: `@import "tailwindcss"` (not `@tailwind base/components/utilities`). Custom CSS variables bridge the app's dark navy theme to Tailwind utility classes via `@theme inline { --color-background: var(--background); ... }`.

### shadcn/ui manual install with latest API
The `shadcn` package is now a standalone npm package. Components import `cn` from the `cn` package. globals.css must also import `shadcn/tailwind.css` and `tw-animate-css`. CSS variables use `oklch()` color space.

### In-memory Map storage
Module-level `Map` objects in `lib/store.ts`. Seeded with demo user (demo@example.com / demo123) and demo analysis data on initialization. Comment clearly in code: "Replace with DB in production". This is safe for single-process dev; Vercel/serverless would need persistent storage.

### Deterministic mock analyzer
`lib/mock-analyzer.ts` uses pure keyword matching and scoring formulas — no randomness, no API calls. Same input always returns same output. This is intentional for testability and demo reliability.

### JWT in httpOnly cookies
Lightweight base64-encoded token (not a full JWT library) to avoid adding `jose` or `jsonwebtoken`. `request.cookies` on `NextRequest` is synchronous and available in route handlers. Server-side auth check in dashboard layout uses `await cookies()` from `next/headers`.

---

## Package Installation

Run once (node_modules does not exist yet):

```bash
npm install
npm install recharts react-hook-form zod @hookform/resolvers uuid bcryptjs tw-animate-css shadcn cn
npm install -D @types/uuid @types/bcryptjs
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-separator @radix-ui/react-avatar @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-accordion
```

---

## File Creation Order (dependency-ordered)

### Phase 1 — Foundation (FEAT-001)
1. `app/globals.css` — Tailwind v4 + shadcn CSS variables, dark navy theme
2. `app/layout.tsx` — Root layout, metadata, dark class on body
3. `types/index.ts` — All TypeScript interfaces
4. `lib/utils.ts` — cn() helper
5. `lib/knowledge-base.ts` — Skills by role + resources DB
6. `lib/scoring.ts` — Scoring formulas
7. `lib/mock-analyzer.ts` — Deterministic analysis engine
8. `lib/resume-parser.ts` — PDF/DOCX/TXT parsing
9. `lib/demo-data.ts` — Complete realistic demo dataset
10. `lib/auth.ts` — JWT token helpers
11. `app/page.tsx` — Placeholder (for build)

### Phase 2 — API Layer (FEAT-002)
12. `lib/store.ts` — In-memory Maps + demo seed data
13. `app/api/auth/register/route.ts`
14. `app/api/auth/login/route.ts`
15. `app/api/auth/me/route.ts`
16. `app/api/auth/logout/route.ts`
17. `app/api/resumes/route.ts`
18. `app/api/resumes/[id]/route.ts`
19. `app/api/jobs/route.ts`
20. `app/api/analysis/route.ts`
21. `app/api/analysis/[id]/route.ts`
22. `app/api/progress/route.ts`
23. `app/api/profile/route.ts`
24. `hooks/useAuth.ts`
25. `hooks/useResume.ts`
26. `hooks/useAnalysis.ts`

### Phase 3 — UI Components (FEAT-003)
27–44: All `components/ui/*.tsx` shadcn primitives
45–46: `components/layout/Navbar.tsx`, `Sidebar.tsx`
47–48: `components/common/LoadingState.tsx`, `EmptyState.tsx`
49–55: `components/dashboard/*.tsx`
56–58: `components/resume/*.tsx`
59–63: `components/analysis/*.tsx`
64–65: `components/resources/*.tsx`
66: `components/roadmap/RoadmapStep.tsx`

### Phase 4 — Landing + Auth Pages (FEAT-004)
67–73: `components/landing/*.tsx` (7 section components)
74: `app/page.tsx` — Full landing page (replaces placeholder)
75: `app/(auth)/login/page.tsx`
76: `app/(auth)/register/page.tsx`
77: `components/auth/LoginForm.tsx`
78: `components/auth/RegisterForm.tsx`
79: `app/(auth)/layout.tsx`

### Phase 5 — Dashboard Pages (FEAT-005)
80: `app/(dashboard)/layout.tsx` — Auth check, sidebar layout
81: `app/(dashboard)/dashboard/page.tsx`
82: `app/(dashboard)/resume/page.tsx`
83: `app/(dashboard)/analyze/page.tsx`
84: `app/(dashboard)/analysis/[id]/page.tsx`
85: `app/(dashboard)/skills/page.tsx`
86: `app/(dashboard)/resources/page.tsx`
87: `app/(dashboard)/roadmap/page.tsx`
88: `app/(dashboard)/progress/page.tsx`
89: `app/(dashboard)/profile/page.tsx`
90: `app/(dashboard)/settings/page.tsx`
91: `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `app/(dashboard)/error.tsx`

---

## Key Gotchas

### Next.js 16 — Async params in EVERY dynamic route
```ts
// ❌ WRONG (Next.js 14 pattern)
export default function Page({ params }: { params: { id: string } }) { ... }

// ✅ CORRECT (Next.js 16)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// ✅ Client component — use hook instead
'use client'
import { useParams } from 'next/navigation';
const params = useParams();
const id = params.id as string;
```

### Next.js 16 — Async cookies in Server Components
```ts
// ✅ CORRECT
import { cookies } from 'next/headers';
const cookieStore = await cookies();
const token = cookieStore.get('auth_token')?.value;
```

### Next.js 16 — Route handlers params also async
```ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}
```

### Tailwind v4 — globals.css
```css
/* ❌ WRONG — Tailwind v3 syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ CORRECT — Tailwind v4 syntax */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

### shadcn/ui — cn import
```ts
// Option A — import from cn package directly
import { cn } from 'cn';

// Option B — re-export from lib/utils (recommended for project consistency)
// lib/utils.ts: export { cn } from 'cn';  OR use clsx+tailwind-merge pattern
```

### pdfjs-dist v6 — Server-only import
`pdfjs-dist` v6 changed its API. Use the legacy build path for Node.js:
```ts
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
// Do NOT import pdfjs-dist in client components
// next.config.ts already has serverExternalPackages: ['pdfjs-dist', 'mammoth']
```

### Turbopack by default in Next.js 16
`npm run build` uses Turbopack. No custom webpack config exists, so this is fine.
The `serverExternalPackages` in next.config.ts handles pdfjs-dist and mammoth correctly.

### parallel routes default.js (Next.js 16 requirement)
If any parallel routes are used (`@folder` syntax), they require `default.js`. Avoid parallel routes in this MVP — use route groups `(auth)` and `(dashboard)` with regular layouts instead.

### React 19 + framer-motion v13
framer-motion v13 supports React 19. Use `motion.div` as usual. No special config needed.

### bcryptjs vs bcrypt
Use `bcryptjs` (pure JS, no native bindings). Already listed in packages to install. Avoid `bcrypt` which requires native compilation.

---

## In-Memory Storage Design

```ts
// lib/store.ts
const usersMap = new Map<string, StoredUser>();      // keyed by userId
const resumesMap = new Map<string, Resume>();         // keyed by resumeId  
const analysesMap = new Map<string, Analysis>();      // keyed by analysisId
const jobsMap = new Map<string, JobDescription>();    // keyed by jobId
const progressMap = new Map<string, ProgressEntry[]>(); // keyed by userId

// Seeded on module load:
// - Demo user: id='demo-user-id', email='demo@example.com', password=bcrypt('demo123')
// - Demo resume: DEMO_RESUME from demo-data.ts
// - Demo analysis: DEMO_ANALYSIS from demo-data.ts
```

---

## Authentication Flow

1. **Register**: POST body → zod validate → bcryptjs.hash → store user → signJWT → set httpOnly cookie → return user
2. **Login**: POST body → getUserByEmail → bcryptjs.compare → signJWT → set httpOnly cookie → return user
3. **Auth check (server)**: dashboard layout → `await cookies()` → `cookieStore.get('auth_token')` → verifyJWT → if invalid → `redirect('/login')`
4. **Auth check (client)**: useAuth hook → GET /api/auth/me → sets user state
5. **Logout**: POST /api/auth/logout → clear cookie → redirect to /

---

## Analysis Pipeline

```
User uploads resume file
  → POST /api/resumes → parseResume(buffer, mimeType) → extractResumeData(text)
  → Returns ResumeData + resumeId

User selects role + pastes job description
  → POST /api/analysis { resumeId, jobDescription, targetRole }
  → fetch resume text from store
  → analyzeResume(text, jobDescription, targetRole)
    → normalize role → match to ROLE_SKILLS
    → extract skills from text (keyword match)
    → computeAtsScore() → computeJobMatchScore() → computeSkillsScore()
    → build SkillGap[] (missing required skills)
    → build ATSCheck[] (formatting/keyword rules)  
    → build ContentSuggestion[] (weak phrases → strong alternatives)
    → map gaps to resources from RESOURCES_DB
    → generate ProjectRecommendation[] based on gaps
    → generate careerActions[]
  → store analysis
  → add progress entry
  → return { analysisId }

User redirected to /analysis/[analysisId]
  → fetch full Analysis object
  → render 6-tab report
```

---

## Verification Commands

```bash
# After FEAT-001:
cd C:\Users\kolte\AIresume\AI_ResumeAnalyzer && npm run build

# After each FEAT:
cd C:\Users\kolte\AIresume\AI_ResumeAnalyzer && npm run build

# Final verification:
cd C:\Users\kolte\AIresume\AI_ResumeAnalyzer && npm run dev
# Open http://localhost:3000
# Login with demo@example.com / demo123
# Navigate all pages
# Upload a resume file
# Run analysis
# View 6-tab report
```
