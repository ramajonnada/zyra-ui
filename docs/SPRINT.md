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
| Status | Done |

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
| Image | P0 | Done | Low | None — new component |
| JSON Viewer | P1 | Done | Medium | Code Block (shipped) — reuses syntax-highlighting/rendering pieces |
| Markdown Viewer | P2 | Done | Medium | Code Block (shipped) — reuses rendering pieces for embedded code fences |
| Command Palette | P3 | Done | High | None — new component; reuses zyra-modal's focus-trap/scroll-lock/backdrop pattern (self-contained, no CDK portal — same as every other overlay in the library) |

**Explicitly out of scope for Sprint 7:** Code Editor, JSON Editor, Markdown Editor (Phase 2, Sprint 13 — this sprint's Viewers are read-only, no editing), and every other Phase 2+ category.

---

## 3. Development Checklist

Every component below must clear all rows before it's considered done. This mirrors the non-negotiables in [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) (accessibility, keyboard support, cross-theme review, `npm run audit:components`).

| Step | Image | JSON Viewer | Markdown Viewer | Command Palette |
|---|---|---|---|---|
| Requirements Analysis | ☑ | ☑ | ☑ | ☑ |
| API Design | ☑ | ☑ | ☑ | ☑ |
| Feature List | ☑ | ☑ | ☑ | ☑ |
| Accessibility Review | ☑ | ☑ | ☑ | ☑ |
| Keyboard Support | ☑ | ☑ | ☑ | ☑ |
| Theme Support (all 5 themes) | ☑ | ☑ | ☑ | ☑ |
| Responsive Support | ☑ | ☑ | ☑ | ☑ |
| SSR Compatibility | ☑ | ☑ | ☑ | ☑ |
| Zoneless Compatibility | ☑ | ☑ | ☑ | ☑ |
| Implementation | ☑ | ☑ | ☑ | ☑ |
| Unit Tests | ☑ | ☑ | ☑ | ☑ |
| Playground page | ☑ | ☑ | ☑ | ☑ |
| Documentation | ☑ | ☑ | ☑ | ☑ |
| Examples | ☑ | ☑ | ☑ | ☑ |
| Final Review | ☑ | ☑ | ☑ | ☑ |

---

## 4. Sprint Progress

| Metric | Count |
|---|---|
| Completed Components | 4 / 4 |
| Components In Progress | 0 / 4 |
| Remaining Components | 0 / 4 |
| **Overall Progress** | **100%** |

---

## 5. Risks & Notes

- **Feature scope came in above the original plan.** Mid-sprint, the plan was expanded with a detailed Core/Better feature breakdown per component. All "Core" tier items shipped for all four; "Better" tier items were deliberately scoped out (see below) rather than expanding the sprint further — same discipline as Table's virtualization scoping in Sprint 6.
- **Image:** shipped `src`/`alt`/`fallbackSrc`/`ratio`/`objectFit`/`radius`/`loading`/`caption`/`loaded`/`error`, plus `width`/`height`/`srcset`/`sizes`/`priority` (sets `loading="eager"` + `fetchpriority="high"`). Out of scope: blur-up placeholder (Better tier) — no dependency-free way to generate a base64 thumbnail without a build-time step, revisit if a real consumer need shows up.
- **JSON Viewer:** flattens to a linear row list (same technique as Tree View's `visibleNodes`) rather than deep recursive templates — expand/collapse state is override-based (`toggledPaths` XOR against `expandDepth`), which cleanly supports both "start partially expanded" and per-node toggling without tracking a full open-set. Added `maxDepth` as a safety cap (deeper containers stop recursing but still show their real item count) since it wasn't in the original Core list but is cheap and prevents runaway rendering on huge payloads. Out of scope: search/filter, type badges, keyboard nav, virtual scrolling, per-node copy (Better tier) — root-level copy (matching Code Block's pattern) covers the common case.
- **Markdown Viewer:** dependency-free block/inline parser (`zyra-markdown-viewer-parser.ts`), not CommonMark-complete — covers headings, paragraphs, bold/italic, links, images, inline code, fenced code (delegates to Code Block), ordered/unordered lists (flat, no nesting), blockquotes, tables (with alignment), and horizontal rules. Never uses `innerHTML`; `sanitize` (default true) strips raw HTML-looking tags from the source rather than ever interpreting them. Out of scope: heading anchor links, `(headings)` output for TOC generation, `allowHtml`, custom link renderer for `routerLink` (Better tier).
- **Command Palette — the sprint's highest-value component, per the expanded plan.** Self-contained overlay (no CDK), reusing zyra-modal's focus-trap/body-scroll-lock/backdrop-dismiss pattern exactly, consistent with every other overlay in the library. Global Ctrl/Cmd+K listener is a `document:keydown` HostListener, same technique zyra-modal already uses for its Escape handler — requires one `<zyra-command-palette>` to stay mounted (documented in a11y notes). Dependency-free fuzzy filter is a subsequence match (not a scored/ranked algorithm). Out of scope: injectable `ZyraCommandPaletteService` for dynamic registration, recent-items persistence, async `searchFn`, Angular Router integration (all Better tier) — the static `items` input covers the common case and the output/two-way `open` API is what a service or router integration would be built on top of later without a breaking change.
- **Bug found and fixed during visual QA — Command Palette activated the wrong row on open.** The active/hovered row used `(mouseenter)`, which fires even without pointer movement if a row happens to render underneath an already-stationary cursor (e.g. opening via the Ctrl/Cmd+K shortcut while the mouse rests over the page). Caught by screenshotting the freshly-opened palette and seeing row 4 highlighted instead of row 1. Fixed by switching to `(mousemove)`, which only fires on genuine pointer motion; added two regression tests (`does not change the active item on a bare mouseenter` / `moves the active item on real mousemove`).
- **Manual visual QA completed** for all four components across all 5 themes (dark, light, ocean, amber, rose) and both desktop/mobile widths, including interactive states (Image's error/fallback, JSON Viewer's expand/collapse, Markdown Viewer's fenced code + table rendering, Command Palette's opened overlay with live fuzzy filtering). No console/page errors, no horizontal overflow at any breakpoint. Full lib suite (944 tests) and the full site build (82 prerendered routes, including all 4 new doc pages) both pass clean.

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
