# ZyraUI Sprint Plan

This document is the working, sprint-by-sprint execution plan for building ZyraUI. It sits **alongside** [ROADMAP.md](ROADMAP.md), never replaces it:

- **ROADMAP.md** = long-term vision, phases, and the full component list. Don't edit it here.
- **SPRINT.md** = "what are we building right now, in what order, and how do we know a component is actually done." Rewritten/reset at the start of every sprint.

A component only counts as shipped when it clears every row of the [Development Checklist](#3-development-checklist) below — matching what `npm run audit:components` and the [Component Guidelines](COMPONENT_GUIDELINES.md) already enforce for lib spec / playground / showcase entries, plus the non-negotiables from that doc (accessibility, keyboard support, cross-theme review).

Completed sprints are archived in [SPRINT_HISTORY.md](SPRINT_HISTORY.md).

---

## How This System Works

1. Each sprint targets **one coherent slice** of the Phase 1 free-component backlog — ideally a full category from ROADMAP.md (e.g. "finish Layout"), or a small dependency-linked cluster if a category is too large for one sprint.
2. Every component in a sprint carries the same checklist, so progress is comparable across components and across sprints.
3. When a sprint closes, move its finished components into [SPRINT_HISTORY.md](SPRINT_HISTORY.md) and overwrite the sprint sections above with the next sprint's plan.
4. Priority order within a sprint should follow **reuse potential first, complexity second**: build the primitive other components will lean on before building the specialized/high-risk one, so later components in the same sprint benefit from patterns settled early.

---

## 1. Sprint Information

| Field | Value |
|---|---|
| Sprint Number | Sprint 8 |
| Sprint Goal | **Charts — foundation (opens Phase 2 / ZyraUI Pro)** — build the shared charting engine, then ship Line, Bar, and Pie against it. First paid-tier sprint. |
| Duration | 2 weeks (suggested — adjust to actual team velocity; not tracked elsewhere in the repo) |
| Status | Not Started |

### Why this grouping, and why this order

- Per [SPRINT_PLAN.md](SPRINT_PLAN.md)'s Full Sprint Index, Sprint 8 is the first Phase 2 sprint: shared charting engine + Line, Bar, Pie — the three most common chart types, built once against a shared engine before the remaining chart sprint (Sprint 9: Area, Radar, Heatmap, Treemap).
- **Charting engine first:** every chart type in Sprints 8–9 depends on shared rendering/scale/axis primitives — build the engine before any individual chart type so Line/Bar/Pie (and later Area/Radar/Heatmap/Treemap) don't each reinvent scales, axes, tooltips, and legends.
- **Line, Bar, Pie in that order:** Line and Bar share the same Cartesian axis/scale machinery (build/validate it once on Line, reuse directly for Bar); Pie is a deliberately separate radial layout, sequenced last so the Cartesian engine is proven first.
- **Licensing/gating is new for this sprint** — per [SPRINT_PLAN.md](SPRINT_PLAN.md#phase-2--zyraui-pro-sprints-8-17), Phase 2 components are paid-tier, so distribution follows the decided Pro-package plan (separate private package, not the public `zyra-ng-ui`) rather than the free-tier release flow used in Sprints 1–7.

---

## 2. Components Included

| Component | Priority | Final Status | Complexity | Dependencies |
|---|---|---|---|---|
| Charting engine | P0 | Not Started | High | None — shared scale/axis/tooltip/legend primitives every chart type below builds on |
| Line | P1 | Not Started | Medium | Charting engine |
| Bar | P2 | Not Started | Medium | Charting engine (reuses Line's Cartesian axis/scale setup) |
| Pie | P3 | Not Started | Medium | Charting engine (radial layout, separate from Line/Bar's Cartesian path) |

**Explicitly out of scope for Sprint 8:** Area, Radar, Heatmap, Treemap (Sprint 9), Dashboard Widgets/KPI Cards/Analytics Components (Sprint 10, depends on Charts), and every other Phase 2+ category.

---

## 3. Development Checklist

Every component below must clear all rows before it's considered done. This mirrors the non-negotiables in [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) (accessibility, keyboard support, cross-theme review, `npm run audit:components`).

| Step | Charting engine | Line | Bar | Pie |
|---|---|---|---|---|
| Requirements Analysis | ☐ | ☐ | ☐ | ☐ |
| API Design | ☐ | ☐ | ☐ | ☐ |
| Feature List | ☐ | ☐ | ☐ | ☐ |
| Accessibility Review | ☐ | ☐ | ☐ | ☐ |
| Keyboard Support | ☐ | ☐ | ☐ | ☐ |
| Theme Support (all 5 themes) | ☐ | ☐ | ☐ | ☐ |
| Responsive Support | ☐ | ☐ | ☐ | ☐ |
| SSR Compatibility | ☐ | ☐ | ☐ | ☐ |
| Zoneless Compatibility | ☐ | ☐ | ☐ | ☐ |
| Implementation | ☐ | ☐ | ☐ | ☐ |
| Unit Tests | ☐ | ☐ | ☐ | ☐ |
| Playground page | ☐ | ☐ | ☐ | ☐ |
| Documentation | ☐ | ☐ | ☐ | ☐ |
| Examples | ☐ | ☐ | ☐ | ☐ |
| Final Review | ☐ | ☐ | ☐ | ☐ |

---

## 4. Sprint Progress

| Metric | Count |
|---|---|
| Completed Components | 0 / 4 |
| Components In Progress | 0 / 4 |
| Remaining Components | 4 / 4 |
| **Overall Progress** | **0%** |

---

## 5. Risks & Notes

- **Nothing yet — sprint not started.**
- **Pro-tier distribution not yet built.** Per project decisions, Sprint 8's output ships via a separate private package (not the public `zyra-ng-ui`), gated by Supabase+Stripe-issued access tokens — that backend/licensing flow does not exist yet and is tracked as its own initiative, not part of this sprint's component checklist. Until it's built, Sprint 8 components should still be developed/tested inside the existing lib structure; packaging/gating is a release-time concern, not an implementation-time one.

---

## 6. Backlog / Future Sprint Candidates

The full multi-sprint plan — every remaining component and initiative across Phase 1 through Phase 5 of ROADMAP.md, in recommended order — lives in **[SPRINT_PLAN.md](SPRINT_PLAN.md)**. This section only tracks the *next* sprint candidate so it's visible without leaving this file:

- **Sprint 9 candidate — Charts: advanced:** Area, Radar, Heatmap, Treemap. Reuses the engine from Sprint 8; the remaining, less-common chart types.

See [SPRINT_PLAN.md](SPRINT_PLAN.md) for Sprints 10 onward, including the rest of Phase 2 (Pro components), Phase 3 (Templates), Phase 4 (ZyraAI), and Phase 5 (Zyra Studio). Re-prioritize at the start of each sprint based on what actually shipped, not just what was planned.

---

## Reusable Sprint Template

For future sprints, copy this file's structure and reset:

1. Increment **Sprint Number**, set a new **Sprint Goal** tied to one ROADMAP.md category (or a dependency cluster if a category is too large for one sprint), set **Status** to `Not Started`.
2. Rebuild the **Components Included** table from the next sprint in [SPRINT_PLAN.md](SPRINT_PLAN.md) — recompute priority/complexity/dependencies against what actually shipped, since a component finishing early may unblock something that looked riskier last sprint.
3. Regenerate the **Development Checklist** table with one column per component in the new sprint, all boxes unchecked.
4. Reset **Sprint Progress** counts to zero.
5. Clear **Risks & Notes** and start fresh — carry forward only items that are still genuinely open.
6. Refresh the **Backlog** section by removing what just got promoted into the sprint and re-grouping what's left.
7. Move the just-finished sprint's condensed summary into [SPRINT_HISTORY.md](SPRINT_HISTORY.md).

### Suggested cadence for future sprints

- Prefer **one ROADMAP.md category per sprint** when the category is 4–8 components — it produces a clean, reportable milestone.
- When a category is too large for one sprint, split it into **dependency clusters** instead of arbitrary halves, so each sprint still ships a coherent, testable group rather than an arbitrary N components.
- Always order components within a sprint by **reuse potential first, complexity second** (see [How This System Works](#how-this-system-works)).
- Keep Premium (Phase 2) components out of every Free Foundation sprint until ROADMAP.md's Phase 1 target (60+ free components) is actually met.
