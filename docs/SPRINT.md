# ZyraUI Sprint Plan

This document is the working, sprint-by-sprint execution plan for building ZyraUI. It sits **alongside** [ROADMAP.md](ROADMAP.md), never replaces it:

- **ROADMAP.md** = long-term vision, phases, and the full component list. Don't edit it here.
- **SPRINT.md** = "what are we building right now, in what order, and how do we know a component is actually done." Rewritten/reset at the start of every sprint.

A component only counts as shipped when it clears every row of the [Development Checklist](#3-development-checklist) below — matching what `npm run audit:components` and the [Component Guidelines](COMPONENT_GUIDELINES.md) already enforce for lib spec / playground / showcase entries, plus the non-negotiables from that doc (accessibility, keyboard support, cross-theme review).

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
| Sprint Number | Sprint 6 |
| Sprint Goal | **Data Display — complex** — ship Date Picker, Table, and Tree View, the three most complex remaining Data Display components. |
| Duration | 2 weeks (suggested — adjust to actual team velocity; not tracked elsewhere in the repo) |
| Status | Done |

### Why this grouping, and why this order

- Per [SPRINT_PLAN.md](SPRINT_PLAN.md)'s Full Sprint Index, Sprint 6 was always slated as Table + Tree View + Date Picker — the three most complex Data Display components left in Phase 1.
- **Date Picker first (P0):** it depends on Calendar (shipped in Sprint 5) and composes the already-shipped Popover for its trigger/panel — lowest net-new complexity of the three since it's mostly wiring, not new primitives. Sequencing it first also validates Calendar's CVA/keyboard contract works inside a real consumer before the sprint moves to fully new components.
- **Table second (P1):** foundational and independent of the other two, but high complexity (sorting, selection, pagination hooks) — no dependency on Date Picker or Tree View, so it can start in parallel once Date Picker's shape is settled.
- **Tree View third (P2):** highest complexity, no hard dependency on Table, but expandable-row/selection-state patterns settled while building Table's rows are likely to transfer directly to Tree View's node expand/collapse and selection model.

---

## 2. Components Included

| Component | Priority | Final Status | Complexity | Dependencies |
|---|---|---|---|---|
| Date Picker | P0 | Done | Medium | Calendar (Sprint 5) — wraps it directly, no Popover dependency needed |
| Table | P1 | Done | High | None — new component |
| Tree View | P2 | Done | High | None — new component; reuses the roving-tabindex keyboard pattern from Sidebar/Calendar |

**Explicitly out of scope for Sprint 6:** Virtual Table / virtualized scrolling (Phase 2, Sprint 11 — Table in this sprint is a plain, non-virtualized implementation), Data Grid, Tree Grid, and every other Phase 1/2 category.

---

## 3. Development Checklist

Every component below must clear all rows before it's considered done. This mirrors the non-negotiables in [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) (accessibility, keyboard support, cross-theme review, `npm run audit:components`).

| Step | Date Picker | Table | Tree View |
|---|---|---|---|
| Requirements Analysis | ☑ | ☑ | ☑ |
| API Design | ☑ | ☑ | ☑ |
| Feature List | ☑ | ☑ | ☑ |
| Accessibility Review | ☑ | ☑ | ☑ |
| Keyboard Support | ☑ | ☑ | ☑ |
| Theme Support (all 5 themes) | ☑ | ☑ | ☑ |
| Responsive Support | ☑ | ☑ | ☑ |
| SSR Compatibility | ☑ | ☑ | ☑ |
| Zoneless Compatibility | ☑ | ☑ | ☑ |
| Implementation | ☑ | ☑ | ☑ |
| Unit Tests | ☑ | ☑ | ☑ |
| Playground page | ☑ | ☑ | ☑ |
| Documentation | ☑ | ☑ | ☑ |
| Examples | ☑ | ☑ | ☑ |
| Final Review | ☑ | ☑ | ☑ |

---

## 4. Sprint Progress

| Metric | Count |
|---|---|
| Completed Components | 3 / 3 |
| Components In Progress | 0 / 3 |
| Remaining Components | 0 / 3 |
| **Overall Progress** | **100%** |

---

## 5. Risks & Notes

- **Date Picker ended up not needing Popover:** the plan assumed Date Picker would wrap Calendar in a `zyra-popover` trigger. In practice it follows `zyra-select`'s self-contained dropdown pattern instead (own `isOpen` signal, outside-click/Escape/Tab handling, absolutely-positioned panel) — `zyra-popover` is a portal-to-`<body>` overlay with no other internal consumers in the library yet, while every other form dropdown (Select, Autocomplete, Multi Select) already uses the self-contained pattern. Consistency with sibling form components won out over reusing Popover. No Calendar API changes were needed — min/max, CVA, and single/range modes already covered everything Date Picker needed.
- **Table scope discipline:** kept to sorting, row selection, and pagination against a plain (non-virtualized) row list, per plan. Reused four existing components rather than rebuilding their pieces: Checkbox (row/select-all selection), Pagination (page footer), Skeleton (loading rows), and Empty State (zero rows) — no virtualization, matching that Virtual Table stays Phase 2 (Sprint 11).
- **Tree View selection/expand state:** followed the same roving-tabindex + ARIA (`role="tree"`/`treeitem"`, `aria-level`, `aria-expanded`) pattern used in Calendar's day grid (Sprint 5) and Sidebar's nav tree, per plan, for consistency across the library's keyboard-nav components.
- **Manual visual QA completed:** all three components were opened in a running dev server and checked across all 5 themes (dark, light, ocean, amber, rose) and 5 viewport widths (375px through 1440px), including opened/interactive states (Date Picker's calendar panel, Table's row hover/selection, Tree View's expand + multi-select checkbox). No console/page errors and no horizontal page overflow at any breakpoint.
- **Bug found and fixed — Table wrapped instead of scrolling on narrow viewports:** `zyra-table.scss`'s `td` was missing `white-space: nowrap` (present on `th` but not `td`), so at mobile widths cell text wrapped and the table shrank below its natural content width instead of triggering the existing `.zyr-table__scroll { overflow-x: auto }` wrapper — the Status column was visibly truncated (e.g. "Suspended" rendered as "Suspe"). Fixed by adding `white-space: nowrap` to `td` in `projects/zyra-ng-ui/src/lib/components/data-display/zyra-table/zyra-table.scss`; verified the scroll container now reports `scrollWidth > clientWidth` at 375px and content no longer truncates. Full unit suite (882 tests) still passes.

---

## 6. Backlog / Future Sprint Candidates

The full multi-sprint plan — every remaining component and initiative across Phase 1 through Phase 5 of ROADMAP.md, in recommended order — lives in **[SPRINT_PLAN.md](SPRINT_PLAN.md)**. This section only tracks the *next* sprint candidate so it's visible without leaving this file:

- **Sprint 7 candidate — Utilities (closes Phase 1):** Image, JSON Viewer, Markdown Viewer, Command Palette. JSON/Markdown Viewers can reuse rendering/tokenizer pieces from the already-shipped Code Block; Command Palette has no dependency on anything earlier and closes Phase 1 with a high-visibility component.

See [SPRINT_PLAN.md](SPRINT_PLAN.md) for Sprints 8 onward, including Phase 2 (Pro components), Phase 3 (Templates), Phase 4 (ZyraAI), and Phase 5 (Zyra Studio). Re-prioritize at the start of each sprint based on what actually shipped, not just what was planned.

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
