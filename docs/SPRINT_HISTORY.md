# ZyraUI Sprint History

Archive of completed sprints, condensed from [SPRINT.md](SPRINT.md) at the point each one closed. See [SPRINT_PLAN.md](SPRINT_PLAN.md) for the full forward-looking sprint index, and [SPRINT.md](SPRINT.md) for the currently active sprint.

---

## Sprint 6 — Data Display: complex (Done)

**Goal:** ship Date Picker, Table, and Tree View — the three most complex remaining Data Display components.

**Shipped:** Date Picker (P0, Medium, wraps Calendar from Sprint 5), Table (P1, High, sorting/selection/pagination against a plain non-virtualized row list), Tree View (P2, High, roving-tabindex + ARIA tree pattern shared with Sidebar/Calendar).

**Out of scope:** Virtual Table (Phase 2, Sprint 11), Data Grid, Tree Grid.

**Key notes:**
- Date Picker used Select's self-contained dropdown pattern instead of Popover, for consistency with sibling form components (Select, Autocomplete, Multi Select).
- Table reused Checkbox, Pagination, Skeleton, and Empty State rather than rebuilding their pieces.
- Full manual visual QA across all 5 themes and 5 viewport widths (375px–1440px) found and fixed one bug: `zyra-table.scss`'s `td` was missing `white-space: nowrap` (present on `th`), causing cell text to wrap/truncate on narrow viewports instead of triggering the existing horizontal-scroll wrapper. Fixed, verified, shipped as `zyra-ng-ui@3.4.5`.
- Also fixed an unrelated bug found during release prep: `scripts/bump-version-lib.js`'s CHANGELOG scaffold regex only matched `\n` line endings and silently no-op'd on this repo's CRLF `CHANGELOG.md`, printing a false success message. Made it CRLF-tolerant and made it throw instead of silently failing.

---

## Sprint 7 — Utilities (Done) — closes Phase 1

**Goal:** ship Image, JSON Viewer, Markdown Viewer, and Command Palette — the last four components in the Phase 1 free-component target, closing out Phase 1 (60+ free components).

**Shipped:** Image (P0, Low, standalone loading/fallback/aspect-ratio-aware `<img>` wrapper), JSON Viewer (P1, Medium, reused Code Block's syntax-highlighting/rendering pieces), Markdown Viewer (P2, Medium, reused Code Block's rendering for embedded code fences), Command Palette (P3, High, reused zyra-modal's focus-trap/scroll-lock/backdrop pattern — self-contained, no CDK portal, consistent with every other overlay in the library).

**Out of scope:** Code Editor, JSON Editor, Markdown Editor (Phase 2, Sprint 13 — these were read-only Viewers, no editing), and every other Phase 2+ category.

**Key notes:**
- All 4 components cleared the full Development Checklist (accessibility, keyboard, all 5 themes, responsive, SSR, zoneless, tests, playground, docs, examples, final review).
- This sprint closes **Phase 1 — Free Foundation** in full.

---

## Maintaining this file

When a sprint closes, add a new section above using the same shape as Sprint 6: goal, what shipped (priority/complexity/dependency), what was explicitly out of scope, and only the risks/notes that are still useful context later (not the full blow-by-blow from `SPRINT.md`). Newest sprint first is not required — appending chronologically is fine since this file is for archival lookup, not active tracking.
