# 🚀 ZyraUI Product Roadmap

> This is the current, canonical roadmap. The original [ROADMAP.md](ROADMAP.md) is kept as a
> historical reference and is no longer updated.

## 🎯 Vision

ZyraUI is a modern Angular product-building system: signals-first, standalone, fully typed,
accessible components, first — with paid tiers, templates, and AI tooling layered on top of
that foundation, not ahead of it.

AI is moving fast, but a library that leads with AI claims before it has a strong component
system underneath is building on sand. ZyraUI's order is deliberate: prove the foundation,
monetize real developer pain points, then use AI to accelerate what already works — not to
replace having a working system in the first place.

---

## Where ZyraUI is now

The free tier is the trusted core: a growing catalog of signals-first, standalone, typed,
accessible Angular components, MIT-licensed, themeable across five built-in themes, with SSR
and zoneless support. This is shipped and real, not a promise — see the
[changelog](https://www.zyraui.dev/changelog) for release-by-release history.

Everything below builds on that base. Nothing later in this roadmap is worth doing if the
foundation isn't solid, so Phase 1 stays open and improving even while later phases start.

---

## 1. Foundation — **Complete, ongoing**

**Goal:** Be the Angular component library developers reach for by default.

* 60+ free, production-ready components across Actions, Data Display, Feedback, Forms,
  Identity, Layout, Navigation, Overlays, and Status
* MIT License
* Signals-first, standalone, fully typed
* WCAG AA accessibility, verified per component
* Five built-in themes, token-driven theming
* SSR support, zoneless-compatible
* Tree-shakeable architecture
* Comprehensive unit tests and documentation

This phase never truly "finishes" — it keeps growing independently of everything else on
this roadmap. Later phases are additive, not a replacement for continued investment here.

---

## 2. Pro Apps / Advanced Components — **Now**

**Goal:** Solve the problems teams actually hit once they outgrow basic components — and turn
that into ZyraUI's first monetizable tier.

* Charting engine (Line, Bar, Pie first — then Area, Radar, Heatmap, Treemap)
* Advanced data components: Data Grid, Virtual Table, Tree Grid, Pivot Table, Spreadsheet
* Editors: Rich Text, Markdown, JSON, Code
* Workflow: Kanban Board, Gantt Chart, Workflow Builder
* Scheduling: Scheduler, Timeline Scheduler, Resource Scheduler
* File management: File Manager, Image Cropper, PDF/Document Viewer
* Dashboard primitives: Widgets, KPI Cards, Analytics Components

This is deliberately **before** AI on this roadmap. These are components teams will pay for
today, with no AI dependency — the surest path to a sustainable business, and the thing that
funds everything after it.

---

## 3. Blocks / Templates / Accelerators — **Next**

**Goal:** Let teams start from a working app, not a blank page.

* Full starter templates: Admin Dashboard, CRM, ERP, HRMS, E-Commerce, Finance Dashboard,
  Hospital/School/Inventory Management, Blog, Portfolio, Landing Pages, Auth Pages, Email
  Dashboard
* Composable page-level blocks (not just full templates) built from Phase 1/2 components, so
  teams can assemble faster without committing to a whole template
* Built entirely on top of Phase 1 + 2 — no new component primitives introduced here

---

## 4. Developer Workflow — CLI, Codegen, Docs Assistant — **Later**

**Goal:** Reduce the friction of using ZyraUI at scale, using plain tooling before reaching
for AI.

* Angular CLI schematics for scaffolding components/pages from the library
* Non-AI codegen: turn a component's typed API into boilerplate (forms, tables) mechanically
* A docs assistant scoped strictly to ZyraUI's own documentation — answering "how do I use
  `zyra-data-grid` with server-side sorting," not open-ended app generation
* VS Code extension, Figma integration

This phase is where "AI" first appears on the roadmap — but scoped, grounded in ZyraUI's own
docs and APIs, not a general-purpose code generator. It's an accelerator on existing tooling,
not a new product identity.

---

## 5. AI Layer — ZyraAI / Zyra Studio — **Later**

**Goal:** Once Phases 1–4 are real and monetizing, use AI to accelerate building with them —
not to replace them.

* ZyraAI: generate components, forms, dashboards, and CRUD pages from a prompt, built on the
  existing component library and its typed APIs
* Zyra Studio: prompt-to-application — describe an app, get a working, customizable Angular
  project assembled from Phases 1–4

This is presented last on purpose. AI-generated code is only as good as the system it's
generated from — a strong, typed, accessible component library is what makes the generated
output trustworthy instead of a novelty demo.

---

## Truth in the current AI market

Most "AI-native" component libraries and app builders today are thin wrappers around a
general-purpose LLM, with no real component system underneath — the demo looks impressive,
the generated code is often inconsistent, untyped, or inaccessible, and teams end up rewriting
it anyway. Leading with AI claims before the underlying system is solid is a marketing
strategy, not a product strategy. ZyraUI is choosing the slower, more honest path: build the
system AI would need to generate good output from, first.

---

## Why this is monetizable

Phase 2 (Pro Apps / Advanced Components) doesn't depend on AI working, on AI hype cycles, or
on convincing anyone to trust AI-generated code in production. Data grids, charts, schedulers,
and rich editors are components teams need and will pay for regardless of what happens in the
AI market over the next few years. That's a durable, boring, sustainable revenue base — and it
funds Phases 3–5 without ZyraUI's business depending on an unproven AI product landing.

---

## Long-term AI evolution

AI's role here grows in stages, matching what's actually reliable at each point:

1. **Docs assistant** (Phase 4) — narrow, grounded in ZyraUI's own documentation, low risk of
   wrong answers because the scope is small.
2. **Scoped codegen** (Phase 4/5 boundary) — generating components/forms/CRUD from prompts,
   but always built on ZyraUI's typed component APIs, so output is constrained and reviewable.
3. **Full application generation** (Phase 5, Zyra Studio) — only attempted once the component
   system, templates, and scoped codegen have all proven out. This is the highest-risk,
   highest-reward layer, and it's sequenced last deliberately.

---

## What stays free vs. what becomes Pro

| Stays free (Phase 1) | Becomes Pro (Phase 2+) |
|---|---|
| All 60+ core components | Charting engine |
| Theming system, all 5 themes | Data Grid, Virtual Table, Pivot Table, Spreadsheet |
| Accessibility, SSR, zoneless support | Rich Text / Markdown / JSON / Code editors |
| Design token system | Kanban, Gantt, Workflow Builder |
| Documentation and examples | Scheduler and scheduling components |
| Community support | Templates (Phase 3) |
| — | ZyraAI / Zyra Studio (Phase 4/5) |

The free tier is not a trial — it keeps shipping and improving on its own. Pro is additive,
for teams that need the advanced surface, not a gate on what already works today.

---

## See also

* [Changelog](https://www.zyraui.dev/changelog) — what's already shipped, release by release
* [Component docs](https://www.zyraui.dev/docs/components) — the full current component catalog
* [ROADMAP.md](ROADMAP.md) — the original roadmap, kept for historical reference
