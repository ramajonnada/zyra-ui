# Zyra UI — Codex Agent Instructions

This is the Angular monorepo for **Zyra UI** — an Angular component library (`zyra-ng-ui`) and its
marketing/docs site (`zyra-ui`). Angular 21, signals-first, SSR, deployed on Vercel.

## Repo structure

```
projects/
  zyra-ng-ui/          Angular component library (published to npm)
  zyra-ui/             Marketing + docs site (SSR, Vercel)
    src/
      app/             Angular app
      content/         Blog posts (markdown + index.json)
      seo/             SEO service
scripts/               Automation scripts (Node.js + PowerShell)
```

## Key npm commands

```bash
npm run blog:list           # list all existing blog slugs + titles
npm run blog:new -- <slug> "<Title>"   # scaffold a new blog post
npm run build               # production build
npm run lint                # lint both projects
npm run format              # prettier format
```

---

## Task: Write a new blog post

When asked to write a blog post (or when running autonomously), follow these steps exactly.

### Step 1 — Check existing topics

Run this first, always. Never skip it.

```bash
npm run blog:list
```

Read every slug and title in the output. You must NOT write about any topic already covered.

### Step 2 — Pick a topic

Choose a trending Angular topic (2025/2026) that does NOT match any existing slug or title.
Good areas to pick from:

- Angular signals: `input()`, `output()`, `model()`, `linkedSignal()`, `toSignal()`
- Angular control flow: `@if`, `@for`, `@switch`, `@defer`, incremental hydration
- Angular testing: Vitest, component harnesses, testing signals
- Performance: zoneless Angular, lazy routes, preloading strategies, Core Web Vitals
- Tooling: Angular CLI, esbuild, Vite, Angular DevTools, standalone migration
- State management: NgRx Signal Store, lightweight stores with signals
- CDK: drag-and-drop, virtual scroll, overlay, accessibility utilities
- Angular + AI: prompting patterns, SSE streaming, AI-generated components

Pick the topic most likely to rank well on Google (high search intent, low existing coverage).

### Step 3 — Scaffold the post

```bash
npm run blog:new -- <slug> "<Full Title>"
```

Use kebab-case for the slug. Example:
```bash
npm run blog:new -- angular-ngrx-signal-store-guide "NgRx Signal Store: Complete Guide for Angular 21"
```

### Step 4 — Write the markdown body

Open `projects/zyra-ui/src/content/<slug>.md` and write the full post body.

Requirements:
- Length: 1500–2500 words
- Start with a TL;DR blockquote: `> **TL;DR:** ...`
- Use clear H2 sections (`##`)
- Include TypeScript and HTML code examples with fenced code blocks and language tags
- Include a practical quick-reference or cheat-sheet section near the end
- End with a short conclusion
- No filler — every paragraph must be actionable or informative
- Do not mention Zyra UI in the body unless directly relevant

### Step 5 — Complete index.json entry

Open `projects/zyra-ui/src/content/index.json`. The scaffold added a skeleton entry at the top.
Fill in every field:

```json
{
    "imageUrl": "",
    "readTime": "<N mins>",
    "slug": "<slug>",
    "title": "<Full Title>",
    "description": "<One sentence, SEO-optimised, max 155 chars>",
    "category": ["Angular 21"],
    "tags": ["<tag1>", "<tag2>", "<tag3>"],
    "keywords": ["<long-tail keyword 1>", "<long-tail keyword 2>", "<long-tail keyword 3>"],
    "date": "<YYYY-MM-DD>",
    "faq": [
        { "q": "<question someone would Google>", "a": "<concise answer>" },
        { "q": "<question 2>", "a": "<answer 2>" },
        { "q": "<question 3>", "a": "<answer 3>" },
        { "q": "<question 4>", "a": "<answer 4>" }
    ]
}
```

Rules:
- Always 4 FAQ items
- `readTime`: estimate based on word count (~200 wpm), e.g. "8 mins"
- `keywords`: long-tail phrases someone would search, not single words
- `description`: must be unique and different from the title
- Leave `imageUrl` as empty string `""`

### Step 6 — Verify

Run:
```bash
npm run blog:list
```

Confirm the new slug appears at the top of the list. Done.
