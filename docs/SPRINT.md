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
| Sprint Number | Sprint 7 |
| Sprint Goal | **Utilities (closes Phase 1)** — ship Image, JSON Viewer, Markdown Viewer, and Command Palette, the last four components in the Phase 1 free-component target. |
| Duration | 2 weeks (suggested — adjust to actual team velocity; not tracked elsewhere in the repo) |
| Status | Not Started |

### Why this grouping, and why this order

- Per [SPRINT_PLAN.md](SPRINT_PLAN.md)'s Full Sprint Index, Sprint 7 was always slated as Image + JSON Viewer + Markdown Viewer + Command Palette — the remaining Utilities, closing out Phase 1's 60+ free-component target.
- **Image first (P0):** simplest, no dependencies — a standalone loading/fallback/aspect-ratio-aware wrapper around `<img>`. Lowest risk, quickest win to open the sprint.
- **JSON Viewer second (P1):** can reuse rendering/tokenizer pieces from the already-shipped Code Block (syntax highlighting, copy-to-clipboard, line handling) rather than building a renderer from scratch.
- **Markdown Viewer third (P2):** same reuse rationale as JSON Viewer — leans on Code Block for embedded code-fence rendering — and benefits from any tokenizer/rendering patterns settled while building JSON Viewer immediately before it.
- **Command Palette last (P3):** highest complexity (global keyboard shortcut, fuzzy search/filtering, overlay/portal, roving selection) and no dependency on the other three, so it's sequenced last to close the sprint on the highest-visibility component once the simpler ones are settled.

---

## 2. Components Included

| Component | Priority | Final Status | Complexity | Dependencies |
|---|---|---|---|---|
| Image | P0 | Not Started | Low | None — new component |
| JSON Viewer | P1 | Not Started | Medium | Code Block (shipped) — reuses syntax-highlighting/rendering pieces |
| Markdown Viewer | P2 | Not Started | Medium | Code Block (shipped) — reuses rendering pieces for embedded code fences |
| Command Palette | P3 | Not Started | High | None — new component; likely reuses Modal/Popover's overlay/portal pattern |

**Explicitly out of scope for Sprint 7:** Code Editor, JSON Editor, Markdown Editor (Phase 2, Sprint 13 — this sprint's Viewers are read-only, no editing), and every other Phase 2+ category.

---

## 3. Development Checklist

Every component below must clear all rows before it's considered done. This mirrors the non-negotiables in [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) (accessibility, keyboard support, cross-theme review, `npm run audit:components`).

| Step | Image | JSON Viewer | Markdown Viewer | Command Palette |
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

- Nothing yet — sprint not started.

---

## 6. Backlog / Future Sprint Candidates

The full multi-sprint plan — every remaining component and initiative across Phase 1 through Phase 5 of ROADMAP.md, in recommended order — lives in **[SPRINT_PLAN.md](SPRINT_PLAN.md)**. This section only tracks the *next* sprint candidate so it's visible without leaving this file:

- **Sprint 8 candidate — Charts: foundation (opens Phase 2):** shared charting engine + Line, Bar, Pie. First Phase 2 (paid-tier) sprint — build the rendering engine once against the three most common chart types before the remaining chart sprint (Sprint 9: Area, Radar, Heatmap, Treemap).

See [SPRINT_PLAN.md](SPRINT_PLAN.md) for Sprints 9 onward, including the rest of Phase 2 (Pro components), Phase 3 (Templates), Phase 4 (ZyraAI), and Phase 5 (Zyra Studio). Re-prioritize at the start of each sprint based on what actually shipped, not just what was planned.

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
