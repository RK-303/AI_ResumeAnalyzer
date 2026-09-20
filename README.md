# CareerOS — AI Resume Analyzer & Career Enhancer

Modern Next.js MVP that scores a resume against ATS standards, highlights missing keywords, rewrites weak bullets, and generates a four-week learning roadmap.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + Shadcn-style UI primitives
- Lucide icons + Framer Motion
- `/api/analyze` for OpenAI or Gemini, with a local mock fallback

## File tree

```
app/
  page.tsx                 # Landing
  analyze/page.tsx         # Upload + diagnostic
  dashboard/page.tsx       # Results
  api/analyze/route.ts     # LLM (or mock) analysis
components/
  header.tsx
  resume-uploader.tsx
  score-gauge.tsx
  metric-card.tsx
  content-comparison-card.tsx
  interactive-roadmap.tsx
  ui/                      # Button, Card, Tabs, Badge, Input
lib/
  types.ts
  mock-analysis.ts
  storage.ts
  extract-text.ts
```

## Local setup

1. Install Node.js 20+ (LTS).
2. Clone this folder and install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
copy .env.example .env.local
```

On macOS/Linux use `cp .env.example .env.local`.

4. Optional: add `OPENAI_API_KEY` or `GEMINI_API_KEY`. If neither is set, the API still returns a high-quality mock analysis so the demo works.

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project at [https://vercel.com/new](https://vercel.com/new).
3. Framework preset: Next.js (see `vercel.json`).
4. Set environment variables in the Vercel project:
   - `OPENAI_API_KEY` (recommended) and optionally `OPENAI_MODEL=gpt-4o-mini`
   - **or** `GEMINI_API_KEY` and optionally `GEMINI_MODEL=gemini-2.0-flash`
5. Deploy. Without keys, production still works in mock mode.

```bash
npx vercel
```

## Usage

1. Open `/` and click **Analyze My Resume**.
2. Upload PDF/DOCX/TXT or paste text. Add an optional job role or description.
3. Review `/dashboard` for ATS score, keywords, rewrites, skill gaps, and the checklist roadmap.
4. **Export PDF** uses the browser print dialog. **Share link** copies a URL that reloads the report from this browser's local storage.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
