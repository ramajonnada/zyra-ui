# Zyra UI — Claude Code Instructions

Read this file before touching any code in this repo. It covers known bugs to fix, permanent
rules for the token/theme system, and what never to do. It complements (does not replace) the
existing docs in `/docs/` — those cover architecture and workflow; this file covers mistakes
that have already happened and rules to prevent repeats.

---

## 1. Known bugs — fix these before anything else in the affected file

These are confirmed issues found via a full codebase audit. Fix them when you touch the
relevant file, or in a dedicated cleanup pass. Do NOT introduce new code with the same patterns.

### BUG-01 · WCAG failure — `zyra-alert` warning icon (HIGH — fix immediately)

**File:** `projects/zyra-ng-ui/src/lib/components/feedback/zyra-alert/zyra-alert.scss`

Lines ~95, 103, 111, 119 use `color: #fff` for the icon inside every alert variant. The
warning variant puts white text on `--zyra-color-warning` (amber/yellow), which fails WCAG AA.
The semantic token `--zyra-color-on-warning: #1a0e00` already exists for exactly this purpose.

**Fix:** Replace every `color: #fff` inside alert icon variants with the correct `on-*` token:

```scss
// ❌ Wrong — already in the file
.zyr-alert__icon { background: var(--zyra-color-warning); color: #fff; }

// ✅ Correct
.zyr-alert__icon { background: var(--zyra-color-warning); color: var(--zyra-color-on-warning); }
.zyr-alert__icon { background: var(--zyra-color-success); color: var(--zyra-color-on-success); }
.zyr-alert__icon { background: var(--zyra-color-danger);  color: var(--zyra-color-on-danger); }
.zyr-alert__icon { background: var(--zyra-color-info);    color: var(--zyra-color-on-info); }
```

---

### BUG-02 · Hardcoded shadows in `zyra-card` break on light theme (MEDIUM)

**File:** `projects/zyra-ng-ui/src/lib/components/layout/zyra-card/zyra-card.scss`

The base shadow (`0 2px 8px rgba(0,0,0,0.12)`) and the hover shadow
(`0 8px 24px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.16)`) are hardcoded black-alpha values
that look correct in dark mode but too heavy in light mode. The theme files already define
`--zyra-card-shadow` and `--zyra-card-elevated-shadow` per-theme for exactly this.

**Fix:**

```scss
// ❌ Wrong
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

// ✅ Correct — use the per-theme token
box-shadow: var(--zyra-card-shadow);

// ❌ Wrong (hover state)
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.16);

// ✅ Correct
box-shadow: var(--zyra-card-elevated-shadow);
```

---

### BUG-03 · Hardcoded scroll-fade indicators in `zyra-scroll-area` (MEDIUM)

**File:** `projects/zyra-ng-ui/src/lib/components/layout/zyra-scroll-area/zyra-scroll-area.scss`

Lines ~89-106: scroll shadow fade indicators use hardcoded `rgba(0, 0, 0, 0.18)`. These are
invisible on light theme surfaces (the fade is dark on a dark bg — fine; dark on a white bg —
disappears).

**Fix:** Add `--zyra-scroll-area-fade-color` to `_tokens-components.scss` pointing at
`var(--zyra-color-surface)` — the same surface color used as the scroll container background.
Using the surface token (not `--zyra-color-border-color`) makes the fade blend into the
container background correctly on every theme, including light.

---

### BUG-04 · `zyra-table` row hover borrows sidebar's token (MEDIUM)

**File:** `projects/zyra-ng-ui/src/lib/components/data-display/zyra-table/zyra-table.scss`

Row hover and selected state use `--zyra-color-sidebar-hover-bg` — a token from a completely
different component. Overriding sidebar styles will break table appearance silently.

**Fix:** Add `--zyra-color-table-row-hover-bg` to `_tokens-components.scss` pointing at
`var(--zyra-color-surface-inset)`. Use that in the table instead.

---

### BUG-05 · Swapped tier comments in SCSS token files (MEDIUM)

**Files:**
- `projects/zyra-ng-ui/src/lib/styles/_tokens-dimension.scss` — header says **"Tier 2"** (wrong, it's Tier 1)
- `projects/zyra-ng-ui/src/lib/styles/_tokens-semantic.scss` — header says **"Tier 1"** (wrong, it's Tier 2)

The correct tier numbering per `docs/THEME_SYSTEM.md`:

| File | Correct tier |
|---|---|
| `_tokens-primitives.scss` | Tier 0 — Primitives |
| `_tokens-dimension.scss` | **Tier 1 — Dimension** |
| `_tokens-semantic.scss` | **Tier 2 — Semantic** |
| `_tokens-components.scss` | Tier 3 — Component |

**Fix:** Correct the header comment in each file to match the table above.

---

### BUG-06 · Hardcoded `#ffffff` switch thumb breaks theming (LOW)

**File:** `projects/zyra-ng-ui/src/lib/components/forms/zyra-switch/zyra-switch.scss` line ~35

`background: #ffffff` for the thumb knob. Add `--zyra-color-switch-thumb` to component tokens
pointing at `var(--zyra-color-text-inverse)`, which resolves correctly per-theme.

---

### BUG-07 · Login page is dead code — no route (LOW)

**File:** `projects/zyra-ui/src/app/pages/login/login.ts` — exists but has no entry in
`projects/zyra-ui/src/app/app.routes.ts`. Either add the route or delete the page.

---

### BUG-08 · Theming page shows internal tokens in "Active theme tokens" swatch (MEDIUM)

**File:** `projects/zyra-ui/src/app/pages/docs/theming/theming.ts`

`tokenSwatches` array shows raw per-theme tokens (`--zyra-color-bg-app`, `--zyra-color-accent`,
`--zyra-color-text`, `--zyra-color-border`) — these are marked **internal** on the theme-tokens
page. The page teaches consumers the wrong token names to copy.

**Fix:** Replace with the semantic equivalents:

```ts
// ❌ Wrong — internal tokens
{ name: 'Background', variable: '--zyra-color-bg-app' },
{ name: 'Primary',    variable: '--zyra-color-accent' },
{ name: 'Text',       variable: '--zyra-color-text' },
{ name: 'Border',     variable: '--zyra-color-border' },

// ✅ Correct — public semantic tokens
{ name: 'Background', variable: '--zyra-color-background' },
{ name: 'Primary',    variable: '--zyra-color-primary' },
{ name: 'Text',       variable: '--zyra-color-foreground' },
{ name: 'Border',     variable: '--zyra-color-border-color' },
```

---

### BUG-09 · Theme-tokens page labels dimension tier inconsistently (LOW)

**File:** `projects/zyra-ui/src/app/pages/docs/theme-tokens/theme-tokens.ts`

The dimension tier object is titled `"Tier 0 — Primitives (Dimension)"` in the UI but
documented as Tier 1 in `docs/THEME_SYSTEM.md` and Tier 2 in its own SCSS file comment.
Fix the title to `"Tier 1 — Dimension"` to match `THEME_SYSTEM.md`.

---

### BUG-10 · Missing `data-theme` on `<html>` in `index.html` (LOW)

**File:** `projects/zyra-ui/src/index.html`

`<html lang="en">` has no `data-theme` attribute. Dark theme only works because
`_dark-theme.scss` has a `:root` fallback. Add the default:

```html
<html lang="en" data-theme="dark">
```

This makes the SSR default explicit and prevents a potential flash if CSS load order changes.

---

## 2. Token system rules — permanent, non-negotiable

These rules apply to every component you create or modify. Violating them silently breaks
re-theming for consumers without any visible error.

### Rule T-1 · Component SCSS must only consume Tier 2 (semantic) or Tier 3 (component) tokens

```scss
/* ✅ CORRECT — component tier token (references semantic internally) */
background: var(--zyra-color-btn-primary-bg);

/* ✅ CORRECT — semantic tier token directly */
color: var(--zyra-color-foreground-muted);
border-color: var(--zyra-color-border-color);

/* ❌ WRONG — raw per-theme token (bypasses semantic layer) */
background: var(--zyra-color-accent);
color: var(--zyra-color-text);
border-color: var(--zyra-color-border);
background: var(--zyra-color-bg-app);
background: var(--zyra-color-card-bg);

/* ❌ WRONG — Tier 0 primitive reached from a component */
color: var(--zyra-color-cyan-500);
```

The full list of **forbidden raw tokens** to never use inside component SCSS:
`--zyra-color-bg-app`, `--zyra-color-bg-panel`, `--zyra-color-bg-surface`,
`--zyra-color-bg-raised`, `--zyra-color-accent`, `--zyra-color-accent-hover`,
`--zyra-color-accent-muted`, `--zyra-color-accent-border`, `--zyra-color-text`,
`--zyra-color-text-muted`, `--zyra-color-text-dim`, `--zyra-color-border`,
`--zyra-color-border-strong`, `--zyra-color-card-bg`, `--zyra-color-card-border`.

**Why this matters:** A consumer overrides `--zyra-color-primary` (Tier 2) expecting all
brand colors to change. If a component reads `--zyra-color-accent` directly, it ignores that
override. The semantic layer is the entire re-theming contract — bypassing it breaks it.

### Rule T-2 · Add a component-tier token stub before writing component SCSS

When adding a new color or size to a component, always add it to
`_tokens-components.scss` first, pointing at the correct semantic token. Then reference the
component token in the SCSS file — never the semantic token directly in SCSS rules.

```scss
/* _tokens-components.scss — add here first */
--zyra-color-table-row-hover-bg: var(--zyra-color-surface-inset);

/* zyra-table.scss — then use the component token */
&:hover { background: var(--zyra-color-table-row-hover-bg); }
```

**This rule applies to theme-dependent (color) values only.** Dimension tokens
(`--zyra-radius-md`, `--zyra-space-4`, `--zyra-transition-fast`, `--zyra-z-modal`) are
theme-invariant and may be referenced directly from component SCSS without a Tier 3 stub —
there is no re-theming concern for values that don't change between themes.

### Rule T-3 · Never borrow another component's Tier 3 token

Every component owns its own namespace in `_tokens-components.scss`. A table must not use
`--zyra-color-sidebar-hover-bg`. A modal must not use `--zyra-header-bg`. If a value is
shared, promote it to Tier 2 (semantic) and both components reference that.

### Rule T-4 · Never hardcode color values in component SCSS

No `#hexcode`, no `rgb()`, no `rgba()` with color information in component SCSS files.
The only allowed exception is `rgba(0,0,0,0)` / `transparent` for invisible states, and
`color-mix()` calls that take their base color from a token. Every other color must come
from a CSS custom property.

```scss
/* ❌ WRONG — hardcoded anywhere in component scss */
color: #fff;
background: rgba(0, 0, 0, 0.12);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.32);

/* ✅ CORRECT */
color: var(--zyra-color-on-danger);
box-shadow: var(--zyra-card-elevated-shadow);
```

### Rule T-5 · Use `on-*` tokens for text on filled backgrounds

When placing text or icons on a filled semantic background, use the matching `on-*` token —
never assume white will pass contrast in all themes.

| Background token | Text token to use |
|---|---|
| `--zyra-color-primary` | `--zyra-color-on-brand` |
| `--zyra-color-success-*` | `--zyra-color-on-success` |
| `--zyra-color-warning-*` | `--zyra-color-on-warning` ← **NOT `#fff`** |
| `--zyra-color-danger-*` | `--zyra-color-on-danger` |
| `--zyra-color-info-*` | `--zyra-color-on-info` |

Warning amber is bright — white fails WCAG AA on it. `--zyra-color-on-warning` is a dark
brown (`#1a0e00`) that passes AA. Always use it.

### Rule T-6 · New component tokens must reference Tier 2, not Tier 0

```scss
/* ❌ WRONG — component token pointing at raw theme token */
--zyra-color-my-comp-bg: var(--zyra-color-bg-surface);

/* ✅ CORRECT — component token pointing at semantic token */
--zyra-color-my-comp-bg: var(--zyra-color-surface-inset);
```

### Rule T-7 · Run the raw-token self-check before committing a new/touched component

A full-library audit (2026-07-20) found raw-token usage in **30 of 56 components** —
mostly components nobody had touched since they were first written. `new-component.ps1`
scaffolds correctly, but nothing enforces the rule on every subsequent edit. Before
committing, grep the component's own `.scss` file(s):

```bash
grep -nE "var\(--zyra-color-(accent|text|border|bg-app|bg-panel|bg-surface|bg-raised|card-bg|card-border|card-section-bg|danger|success|warning|info|text-muted|text-dim|text-inverse|border-strong)\)" \
  path/to/zyra-my-component.scss
```

Any match is a bug — replace it with the Tier 2/3 equivalent (see the quick reference
table in §7). Known accepted exceptions that will still match and are **not** bugs:
`--zyra-color-accent-secondary`/`-tertiary` (no Tier 2 alias exists — same status as
Badge's `purple` variant), and a small set of tokens deliberately tuned per-theme with no
separate Tier 3 name (`--zyra-card-shadow`, `--zyra-color-toast-bg`/`-border`,
`--zyra-color-tooltip-*`, `--zyra-color-btn-primary-text`) — these are documented inline
in `_tokens-components.scss` where they're referenced.

---

## 3. Cross-theme rule — always test all 5 themes

Before marking any component work done, visually verify in:
**dark · light · ocean · amber · rose**

The fastest path: run the site locally, open `/theming`, switch themes in the header while
the component is visible. A component that only looks right in `dark` is a bug. This applies
to every shadow, every border, every background, every text color.

---

## 4. WCAG — accessibility is not optional

- **Contrast:** All text on colored backgrounds must pass WCAG AA (4.5:1 for normal text,
  3:1 for large text / UI components). Don't eyeball it — use the existing theme file comments
  (they document contrast ratios) or a contrast checker.
- **Focus rings:** Never suppress `:focus-visible`. Use `--zyra-ring` or the relevant
  component focus shadow token. Do not write `outline: none` without an alternative visible ring.
- **Semantic HTML + ARIA:** Use the same role pattern already established in similar components
  before inventing a new one. Check `zyra-modal`, `zyra-tabs`, `zyra-radio` for reference patterns.

---

## 5. Web app (`zyra-ui`) doc rules

### Rule D-1 · Doc pages must show semantic tokens, not raw/internal ones

Any page that shows token names to consumers (theming page, token reference, component API
tables) must reference **Tier 2 semantic tokens** as examples. Raw per-theme tokens
(`--zyra-color-accent`, `--zyra-color-bg-app`, etc.) are internal — showing them teaches
consumers to depend on implementation details that can change.

Correct consumer-facing names:
- Background → `--zyra-color-background`
- Primary color → `--zyra-color-primary`
- Text → `--zyra-color-foreground`
- Border → `--zyra-color-border-color`
- Muted text → `--zyra-color-foreground-muted`

### Rule D-2 · Tier numbering must be consistent everywhere

The canonical tier numbers are in `docs/THEME_SYSTEM.md`:

| Tier | Name | File |
|---|---|---|
| 0 | Primitives | `_tokens-primitives.scss` |
| 1 | Dimension | `_tokens-dimension.scss` |
| 2 | Semantic | `_tokens-semantic.scss` |
| 3 | Component | `_tokens-components.scss` |

Use these numbers exactly — in SCSS file comments, in TypeScript component data, in HTML
templates, in any documentation. Never call dimension "Tier 0" or "Tier 2."

### Rule D-3 · Keep `ARCHITECTURE.md` current when the component count changes

`docs/ARCHITECTURE.md` has a mermaid diagram that lists components. When adding components,
update the diagram so it reflects the current component tree. Stale counts mislead contributors.

### Rule D-4 · Every component with color tokens needs a "Tokens" section on its doc page

There are no per-component doc page files — every component's page is one entry in the
`UI_COMPONENT_SHOWCASE` array in
`projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts`, rendered by the single
shared `ui-component-detail.html`/`.ts`. To document a component's tokens:

1. Add a `tokens: TokenEntry[]` array to that component's entry (shape: `{ name, variable,
   defaultValue, description }`) — the shared template renders it automatically after the
   API props table. No HTML/template changes needed.
2. Only list Tier 2 semantic or Tier 3 component tokens the component's SCSS actually reads
   — verify by grepping the real `.scss` file first. Never list a raw per-theme token, and
   never list a token whose default you're guessing at (read `_tokens-components.scss` for
   the real current value).
3. If a token has no real fix available yet (e.g. `accent-secondary`/`-tertiary` with no
   Tier 2 alias), leave it **out** of the doc entirely rather than showing something
   inaccurate or forbidden — same treatment as Badge's `purple` variant.
4. Components with zero color tokens (pure layout primitives like `zyra-aspect-ratio`,
   `zyra-stack`) don't need a `tokens` array at all — the field is optional.

---

## 6. What never to do — summary checklist

Before committing any SCSS change to the library, confirm:

- [ ] No `#hexcode` or `rgba(r,g,b,alpha)` with color data — use tokens
- [ ] No raw per-theme tokens (`--zyra-color-accent`, `--zyra-color-text`, etc.) in component SCSS
- [ ] No borrowing another component's Tier 3 tokens
- [ ] `on-*` tokens used for text on filled semantic backgrounds (especially warning)
- [ ] All 5 themes verified visually
- [ ] Any new color adds a Tier 3 stub to `_tokens-components.scss` first
- [ ] Ran the Rule T-7 raw-token grep against the component's own `.scss` file(s)

Before committing any doc/site change, confirm:

- [ ] Token examples shown to consumers are Tier 2 semantic, not raw internal
- [ ] Tier numbers match `docs/THEME_SYSTEM.md` exactly
- [ ] No new dead-code pages added without a route entry
- [ ] New or newly-fixed components have a `tokens` array on their `ui-components.data.ts`
      entry (Rule D-4), sourced from the real `.scss` file, not guessed

---

## 7. Quick reference — semantic token map

Use this when writing component SCSS to find the right semantic token for common needs:

| Intent | Use this token |
|---|---|
| Page background | `--zyra-color-background` |
| Panel / sidebar bg | `--zyra-color-background-elevated` |
| Card bg | `--zyra-color-surface` |
| Subtle section bg | `--zyra-color-surface-subtle` |
| Input/inset bg | `--zyra-color-surface-inset` |
| Dropdown bg | `--zyra-color-surface-dropdown` |
| Primary text | `--zyra-color-foreground` |
| Secondary text | `--zyra-color-foreground-muted` |
| Tertiary/hint text | `--zyra-color-foreground-subtle` |
| Brand / primary color | `--zyra-color-primary` |
| Brand hover | `--zyra-color-primary-hover` |
| Brand subtle bg | `--zyra-color-primary-subtle` |
| Brand border | `--zyra-color-primary-border` |
| Default border | `--zyra-color-border-color` |
| Strong border | `--zyra-color-border-strong-color` |
| Focus ring | `--zyra-ring` |
| Overlay scrim | `--zyra-color-overlay-scrim` |
| Text on brand fill | `--zyra-color-on-brand` |
| Text on success fill | `--zyra-color-on-success` |
| Text on warning fill | `--zyra-color-on-warning` |
| Text on danger fill | `--zyra-color-on-danger` |
| Text on info fill | `--zyra-color-on-info` |
