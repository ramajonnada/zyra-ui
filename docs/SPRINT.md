# ZyraUI Sprint Plan

This document is the working, sprint-by-sprint execution plan for building ZyraUI. It sits **alongside** [ROADMAP.md](ROADMAP.md), never replaces it:

- **ROADMAP.md** = long-term vision, phases, and the full component list. Don't edit it here.
- **SPRINT.md** = "what are we building right now, in what order, and how do we know a component is actually done." Rewritten/reset at the start of every sprint.

A component only counts as shipped when it clears every row of the [Development Checklist](#development-checklist) below — matching what `npm run audit:components` and the [Component Guidelines](COMPONENT_GUIDELINES.md) already enforce for lib spec / playground / showcase entries, plus the non-negotiables from that doc (accessibility, keyboard support, cross-theme review).

---

## How This System Works

1. Each sprint targets **one coherent slice** of the Phase 1 free-component backlog — ideally a full category from ROADMAP.md (e.g. "finish Layout"), or a small dependency-linked cluster if a category is too large for one sprint.
2. Every component in a sprint carries the same checklist, so progress is comparable across components and across sprints.
3. When a sprint closes, move its finished components into a "Shipped" line at the bottom of this file (or a `docs/SPRINT_HISTORY.md` if that log gets long) and overwrite the sprint sections above with the next sprint's plan.
4. Priority order within a sprint should follow **reuse potential first, complexity second**: build the primitive other components will lean on before building the specialized/high-risk one, so later components in the same sprint benefit from patterns settled early.

---

## 1. Sprint Information

| Field | Value |
|---|---|
| Sprint Number | Sprint 5 |
| Sprint Goal | **Data Display — foundational** — ship Calendar, a from-scratch month-grid date picker with full keyboard support and Angular Forms (CVA) integration. (Carousel, originally paired with Calendar in this sprint, shipped early in Sprint 4 at the user's request.) |
| Duration | 2 weeks (suggested — adjust to actual team velocity; not tracked elsewhere in the repo) |
| Status | Done |

### Why Calendar, and why now

- Sprint 4 (Forms Input family + Carousel) shipped. Per [SPRINT_PLAN.md](SPRINT_PLAN.md)'s Full Sprint Index, Sprint 5 was originally Calendar + Carousel; Carousel moved to Sprint 4, leaving Calendar to stand alone here.
- Calendar has no dependency on anything built so far — it's a self-contained month-grid component (own date-math helpers, own CVA). It's sequenced now specifically because **Date Picker (Sprint 6)** will need it as a foundation — building it first removes that dependency risk from the next sprint.

---

## 2. Components Included

| Component | Priority | Final Status | Complexity | Dependencies |
|---|---|---|---|---|
| Calendar | P0 | Done | Medium | None — new component, own date-math helpers |

**Explicitly out of scope for Sprint 5:** Date Picker (queued as Sprint 6 — it will wrap this Calendar in a popover trigger), and every other Phase 1 category.

---

## 3. Development Checklist

Every component below must clear all rows before it's considered done. This mirrors the non-negotiables in [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) (accessibility, keyboard support, cross-theme review, `npm run audit:components`).

| Step | Calendar |
|---|---|
| Requirements Analysis | ☑ |
| API Design | ☑ |
| Feature List | ☑ |
| Accessibility Review | ☑ |
| Keyboard Support | ☑ |
| Theme Support (all 5 themes) | ☑ |
| Responsive Support | ☑ |
| SSR Compatibility | ☑ |
| Zoneless Compatibility | ☑ |
| Implementation | ☑ |
| Unit Tests | ☑ |
| Playground page | ☑ |
| Documentation | ☑ |
| Examples | ☑ |
| Final Review | ☑ |

---

## 4. Sprint Progress

| Metric | Count |
|---|---|
| Completed Components | 1 / 1 |
| Components In Progress | 0 / 1 |
| Remaining Components | 0 / 1 |
| **Overall Progress** | **100%** |

---

## 5. Risks & Notes

- **Own date-math, no date library:** Calendar implements its own `sameDay`/`startOfDay`/month-grid generation using plain `Date` objects rather than pulling in a date library (date-fns, Luxon, etc.). Reasonable for a single-date month grid; if Date Picker (Sprint 6) or later range-selection needs grow complex (timezones, locales beyond `Intl`, recurring ranges), revisit whether a date library earns its weight then — don't add one preemptively.
- **Roving tabindex for keyboard nav:** only the currently-focused day is in the tab order (`tabindex="0"`); all others are `-1`. Arrow keys move a `focusedDate` signal independently of the *selected* date, matching the standard ARIA grid/date-picker keyboard pattern.
- **Post-sprint polish (user-reported):** after Sprint 4/5 shipped, the user flagged the Carousel playground demo as low-contrast (arrows blended into the dark background) with no visible slide transition. Fixed both in this pass: arrows now use `--zyra-color-card-bg` + a shadow instead of matching the carousel's own background (so they read as floating buttons), and the track's `[style]` binding was switched to `[style.transform]` for a reliable CSS transition. The playground demo slides were also redesigned as centered `zyra-aspect-ratio` cards with distinct accent colors, closer to what the user referenced.
- Verified end-to-end: `npm run build:lib`, `npm run audit:components`, and the full unit suite (790/791 — the 1 failure is the same pre-existing flaky layout-measurement test in `zyra-button-group.spec.ts` from earlier sprints, unrelated to this work) all pass. `/docs/components/calendar` and `/docs/components/carousel` both confirmed rendering on the local dev server after the Carousel fixes.

---

## 6. Backlog / Future Sprint Candidates

The full multi-sprint plan — every remaining component and initiative across Phase 1 through Phase 5 of ROADMAP.md, in recommended order — lives in **[SPRINT_PLAN.md](SPRINT_PLAN.md)**. This section only tracks the *next* sprint candidate so it's visible without leaving this file:

- **Sprint 6 candidate — Data Display complex:** Table, Tree View, Date Picker — the three most complex remaining Data Display components. Date Picker is sequenced here specifically because it depends on Calendar (this sprint).

See [SPRINT_PLAN.md](SPRINT_PLAN.md) for Sprints 7 onward, including Phase 2 (Pro components), Phase 3 (Templates), Phase 4 (ZyraAI), and Phase 5 (Zyra Studio). Re-prioritize at the start of each sprint based on what actually shipped, not just what was planned.

---

## Reusable Sprint Template

For future sprints, copy this file's structure and reset:

1. Increment **Sprint Number**, set a new **Sprint Goal** tied to one ROADMAP.md category (or a dependency cluster if a category is too large for one sprint), set **Status** to `Not Started`.
2. Rebuild the **Components Included** table from the next sprint in [SPRINT_PLAN.md](SPRINT_PLAN.md) — recompute priority/complexity/dependencies against what actually shipped, since a component finishing early may unblock something that looked riskier last sprint.
3. Regenerate the **Development Checklist** table with one column per component in the new sprint, all boxes unchecked.
4. Reset **Sprint Progress** counts to zero.
5. Clear **Risks & Notes** and start fresh — carry forward only items that are still genuinely open.
6. Refresh the **Backlog** section by removing what just got promoted into the sprint and re-grouping what's left.

### Suggested cadence for future sprints

- Prefer **one ROADMAP.md category per sprint** when the category is 4–8 components — it produces a clean, reportable milestone.
- When a category is too large for one sprint, split it into **dependency clusters** instead of arbitrary halves, so each sprint still ships a coherent, testable group rather than an arbitrary N components.
- Always order components within a sprint by **reuse potential first, complexity second** (see [How This System Works](#how-this-system-works)).
- Keep Premium (Phase 2) components out of every Free Foundation sprint until ROADMAP.md's Phase 1 target (60+ free components) is actually met.
