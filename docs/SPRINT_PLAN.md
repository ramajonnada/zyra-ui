# ZyraUI — Total Sprint Plan (Phase 1 → Phase 5)

Master index of every sprint needed to carry ZyraUI from its current state through the full [ROADMAP.md](ROADMAP.md) vision. This file is the **table of contents**; it does not replace either of the other two planning docs:

- **[ROADMAP.md](ROADMAP.md)** — long-term product vision, phases, full component/feature list. Never edited by sprint planning.
- **[SPRINT.md](SPRINT.md)** — the *active* sprint only, with the full per-component Development Checklist. Reset at the start of every sprint to whichever sprint is current.
- **SPRINT_PLAN.md (this file)** — the durable, full list of sprints across the whole roadmap: what's in each one, in what order, and why. Updated as sprints complete or get re-prioritized; not reset.

**How to use this file:** when a sprint listed here becomes the active one, expand it into `SPRINT.md` using the same structure as Sprint 1 (Sprint Information → Components Included → Development Checklist → Sprint Progress → Risks & Notes). Don't pre-build full checklists for sprints that haven't started — priorities and complexity estimates shift as earlier sprints reveal real information, so detail is added just-in-time.

---

## Format note: two kinds of sprints

Phase 1 and Phase 2 are **component sprints** — each ships discrete, independently testable UI components against the standard [Development Checklist](SPRINT.md#3-development-checklist) (accessibility, keyboard, theme, SSR, zoneless, tests, docs, playground, etc.), same as Sprint 1.

Phase 3–5 are **initiative sprints** — Templates, AI generation, and the Studio platform aren't standalone components with an SSR/keyboard/theme checklist; they're epics with their own deliverables (a template's "checklist" is closer to "does it compose the right existing components correctly," and Phase 4/5 involve backend/AI infra this repo's component-audit tooling has no opinion on). These are listed at goal/scope level only. When one of these sprints comes up next, it needs its own lightweight checklist defined at that time — don't force the component checklist onto it.

---

## Full Sprint Index

| # | Phase | Sprint Goal | Format | Status |
|---|---|---|---|---|
| 1 | 1 — Free Foundation | Complete **Layout** category (Box, Flex, Grid, Container, Aspect Ratio, Scroll Area) | Component | See [SPRINT.md](SPRINT.md) — Not Started |
| 2 | 1 — Free Foundation | **Overlay & quick wins** (Confirm Dialog, Theme Switch, Drawer) | Component | Done |
| 3 | 1 — Free Foundation | **Forms — Select family** (Multi Select, Autocomplete) | Component | Done |
| 4 | 1 — Free Foundation | **Forms — Input family** (OTP Input, Password Input, Slider, File Upload) + Carousel pulled forward from Sprint 5 | Component | Done |
| 5 | 1 — Free Foundation | **Data Display — foundational** (Calendar) — Carousel shipped early in Sprint 4 | Component | Done |
| 6 | 1 — Free Foundation | **Data Display — complex** (Table, Tree View, Date Picker) | Component | Done |
| 7 | 1 — Free Foundation | **Utilities** (Image, JSON Viewer, Markdown Viewer, Command Palette) — closes out Phase 1 | Component | Done |
| 8 | 2 — ZyraUI Pro | **Charts — foundation** (shared charting engine + Line, Bar, Pie) | Component | Not Started |
| 9 | 2 — ZyraUI Pro | **Charts — advanced** (Area, Radar, Heatmap, Treemap) | Component | Not Started |
| 10 | 2 — ZyraUI Pro | **Dashboard** (Dashboard Widgets, KPI Cards, Analytics Components) | Component | Not Started |
| 11 | 2 — ZyraUI Pro | **Advanced Data — foundational** (Data Grid, Virtual Table) | Component | Not Started |
| 12 | 2 — ZyraUI Pro | **Advanced Data — complex** (Tree Grid, Pivot Table, Spreadsheet) | Component | Not Started |
| 13 | 2 — ZyraUI Pro | **Editors — lightweight** (Code Editor, JSON Editor, Markdown Editor) | Component | Not Started |
| 14 | 2 — ZyraUI Pro | **Rich Text Editor** (standalone — heaviest single component in Phase 2) | Component | Not Started |
| 15 | 2 — ZyraUI Pro | **Workflow** (Kanban Board, Gantt Chart, Workflow Builder) | Component | Not Started |
| 16 | 2 — ZyraUI Pro | **File Management** (File Manager, Image Cropper, PDF Viewer, Document Viewer) | Component | Not Started |
| 17 | 2 — ZyraUI Pro | **Scheduling** (Scheduler, Timeline Scheduler, Resource Scheduler) — closes out Phase 2 | Component | Not Started |
| 18 | 3 — Templates | **Template platform foundation** (Admin Dashboard shell, Authentication Pages, Landing Pages) | Initiative | Not Started |
| 19 | 3 — Templates | **Content templates** (Blog, Portfolio, Email Dashboard) | Initiative | Not Started |
| 20 | 3 — Templates | **Business dashboards** (Finance Dashboard, Analytics Dashboard) | Initiative | Not Started |
| 21 | 3 — Templates | **Domain management templates** (CRM, ERP, HRMS) | Initiative | Not Started |
| 22 | 3 — Templates | **Vertical templates** (E-Commerce, Hospital Management, School Management, Inventory Management) — closes out Phase 3 | Initiative | Not Started |
| 23 | 4 — ZyraAI | **AI foundation** (model integration, prompt infra, "generate component from prompt" MVP) | Initiative | Not Started |
| 24 | 4 — ZyraAI | **AI generation** (forms, dashboards, CRUD pages, routing, API services) | Initiative | Not Started |
| 25 | 4 — ZyraAI | **AI assist** (auth flow generation, layouts, explain code, refactor, accessibility improvements) | Initiative | Not Started |
| 26 | 4 — ZyraAI | **AI testing & docs** (generate tests, Storybook stories, documentation) — closes out Phase 4 | Initiative | Not Started |
| 27+ | 5 — Zyra Studio | **Prompt-to-app platform** (multi-sprint program — see [Phase 5](#phase-5--zyra-studio-sprints-27) below) | Initiative (program) | Not Started |

---

## Phase 1 — Free Foundation (Sprints 1–7)

Goal: reach ROADMAP.md's 60+ free-component target with every component clearing the full Development Checklist. Sprint 1 is fully detailed in [SPRINT.md](SPRINT.md); Sprints 2–7 below are the same reasoning applied to the rest of the remaining free-tier gap.

| Sprint | Components | Why this grouping / order |
|---|---|---|
| 1 | Box, Flex, Grid, Container, Aspect Ratio, Scroll Area | Layout primitives everything downstream composes on — see [SPRINT.md](SPRINT.md) for full rationale. |
| 2 | Confirm Dialog, Theme Switch, Drawer | Confirm Dialog wraps the already-shipped Modal (low risk, high value); Theme Switch is small and standalone; Drawer reuses Sidebar/Modal patterns. Bundled as a low-risk, high-visibility sprint after the heavier Layout sprint. |
| 3 | Multi Select, Autocomplete | Both extend the already-shipped Select component rather than starting from scratch — cheapest way to grow the Forms category. |
| 4 | OTP Input, Password Input, Slider, File Upload, Carousel | All extend/wrap the already-shipped Input component (File Upload reuses the same form-control/validation pattern); Carousel was pulled forward from Sprint 5 at the user's request and shipped as a standalone Data Display component in the same pass. |
| 5 | Calendar | Calendar must exist before Date Picker (Sprint 6) can consume it. Originally paired with Carousel, but Carousel shipped early in Sprint 4 — Calendar now stands alone. |
| 6 | Table, Tree View, Date Picker | The three most complex remaining Data Display components; Date Picker is sequenced here specifically because it depends on Calendar shipping in Sprint 5. |
| 7 | Image, JSON Viewer, Markdown Viewer, Command Palette | Utilities cleanup; JSON/Markdown Viewers can reuse rendering/tokenizer pieces from the already-shipped Code Block. Command Palette is added here as it's a standalone overlay/utility with no dependency on anything earlier, closing Phase 1 with a high-visibility component. |

---

## Phase 2 — ZyraUI Pro (Sprints 8–17)

Goal: ship the enterprise-grade component set. Same Development Checklist format as Phase 1, but these are paid-tier components, so licensing/gating concerns (not itemized here) will need to be added to each sprint's Risks & Notes when it's expanded into `SPRINT.md`.

| Sprint | Components | Why this grouping / order |
|---|---|---|
| 8 | Charting engine + Line, Bar, Pie | All chart types share one rendering engine — build it once against the three most common chart types first. |
| 9 | Area, Radar, Heatmap, Treemap | Reuses the engine from Sprint 8; the remaining, less-common chart types. |
| 10 | Dashboard Widgets, KPI Cards, Analytics Components | Depends on Charts (Sprints 8–9) — dashboard/analytics widgets are mostly chart compositions plus layout. |
| 11 | Data Grid, Virtual Table | Data Grid is the foundational table primitive; Virtual Table shares its virtualization/scroll logic, so building them together avoids solving windowing twice. |
| 12 | Tree Grid, Pivot Table, Spreadsheet | All three extend Data Grid's row/column model from Sprint 11 — sequenced after it deliberately. |
| 13 | Code Editor, JSON Editor, Markdown Editor | Grouped as the "lightweight" editors that can share one editor shell/toolbar pattern. |
| 14 | Rich Text Editor | Kept in its own sprint — it needs its own editing engine (not the shared shell from Sprint 13) and is the single heaviest component in Phase 2. |
| 15 | Kanban Board, Gantt Chart, Workflow Builder | Ordered by complexity: Kanban (simplest drag/drop) → Gantt (needs date/timeline logic, reuses Date Picker/Calendar from Phase 1) → Workflow Builder (node-graph editor, most complex). |
| 16 | File Manager, Image Cropper, PDF Viewer, Document Viewer | File Manager is the foundational shell; Image Cropper is standalone; PDF/Document Viewers share rendering concerns and are grouped last. |
| 17 | Scheduler, Timeline Scheduler, Resource Scheduler | Scheduler is the base; the other two extend its view model — closes out Phase 2. |

---

## Phase 3 — ZyraUI Templates (Sprints 18–22)

Goal: ship the 15 starter templates from ROADMAP.md. These are **initiative sprints**, not component sprints — deliverables are full page/route compositions built from Phase 1/2 components, not new library components with their own accessibility/SSR checklist.

| Sprint | Templates | Why this grouping / order |
|---|---|---|
| 18 | Admin Dashboard (shell), Authentication Pages, Landing Pages | Admin Dashboard's shell (nav, layout, auth-gated routing) is reused by nearly every other management template below — build it, plus the login/signup flow every template needs, first. |
| 19 | Blog, Portfolio, Email Dashboard | Content-focused templates, mostly free-tier components, independent of the Admin shell — safe to parallelize with later sprints if capacity allows. |
| 20 | Finance Dashboard, Analytics Dashboard | Depend on Charts/Dashboard components from Phase 2 (Sprints 8–10) — sequenced after those exist. |
| 21 | CRM, ERP, HRMS | Fork off the Admin Dashboard shell from Sprint 18; grouped as the core "business management" templates. |
| 22 | E-Commerce, Hospital Management, School Management, Inventory Management | Remaining vertical-specific templates, all built on the same Admin shell pattern — closes out Phase 3. |

---

## Phase 4 — ZyraAI (Sprints 23–26)

Goal: ship the AI-assisted generation features from ROADMAP.md. This phase depends on infrastructure (model access, prompt pipelines) outside this repo's current scope — treat every sprint below as provisional until that infra decision is made.

| Sprint | Scope | Why this grouping / order |
|---|---|---|
| 23 | Model integration, prompt pipeline, "generate component from prompt" MVP | Foundation everything else in this phase depends on — must exist before any other AI feature can ship. |
| 24 | Generate forms, dashboards, CRUD pages, routing, API services | The core "generate an app slice" feature set, built on the Sprint 23 foundation. |
| 25 | Generate authentication flows, generate layouts, explain code, refactor, improve accessibility | Assistive/editing features layered on top of pure generation. |
| 26 | Generate tests, generate Storybook stories, generate documentation | Closes the loop so AI-generated code meets this repo's own component checklist (tests/docs) automatically — natural last step of the phase. |

---

## Phase 5 — Zyra Studio (Sprints 27+)

Goal: the prompt-to-application platform described in ROADMAP.md. This is the largest, least-defined phase — it depends on Phase 4's generation engine plus the full Phase 1–3 component/template library, and its own scope (routing, state management, auth, theming, export) is really a multi-sprint program rather than a handful of sprints.

**Do not pre-plan this phase in detail now.** Revisit and break it into concrete sprints (following the same component/initiative format split used above) once Phase 4 has shipped a working generation engine — planning further than that today would be speculation, not a plan. At a minimum it will need:

- An MVP sprint: natural-language description → generated Angular app structure, routing, and pages using existing components/templates.
- Follow-on sprints for state management generation, auth generation, and theme wiring.
- A customization/export sprint (letting users edit and pull the generated project out of Studio).
- Documentation/test generation integration, reusing the Phase 4 Sprint 26 capability rather than rebuilding it.

---

## Maintaining this plan

- When a sprint starts, copy its row from the Full Sprint Index into `SPRINT.md` and expand it to the full template (see [SPRINT.md → Reusable Sprint Template](SPRINT.md#reusable-sprint-template)).
- When a sprint finishes, mark its Status column here as `Done`, and note any components that moved between sprints (e.g. a component that turned out more complex than estimated and got split into its own sprint).
- Component-count and dependency estimates above are based on the roadmap and current repo state as of 2026-07-08 — re-validate against `projects/zyra-ng-ui/src/public-api.ts` and `docs/COMPONENT_AUDIT.md` before expanding a far-future sprint, since intervening sprints may have already delivered pieces of it.
