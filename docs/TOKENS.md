# Zyra UI — Design Tokens

This is the reference for `zyra-ng-ui`'s design token system: how it's structured, how theming works, and — since `v3.0.0` renamed every color token — the full old → new migration table.

For a live, visual preview of all five themes, see the [Theming page](https://www.zyraui.dev/theming) on the site, or run the app locally and visit `/theming`.

---

## How it's structured

Tokens are CSS custom properties, loaded in four tiers via `styles/index.scss`:

1. **Primitives** (`_tokens-primitives.scss`) — raw, theme-invariant values (e.g. `--zyra-color-cyan-500`). Never consumed directly by components.
2. **Dimension** (`_tokens-dimension.scss`) — typography, radius, motion, spacing, z-index. Same values regardless of theme (e.g. `--zyra-radius-md`, `--zyra-space-4`).
3. **Semantic** (`_tokens-semantic.scss`) — role-based aliases over the theme layer (e.g. `--zyra-color-primary` → `--zyra-color-accent`). This is the layer components and consumers should prefer.
4. **Component** (`_tokens-components.scss`) — per-component namespaced tokens that reference the semantic layer (e.g. `--zyra-color-btn-primary-bg`).

Alongside these, five **theme files** (`_dark-theme.scss`, `_light-theme.scss`, `_ocean-theme.scss`, `_amber-theme.scss`, `_rose-theme.scss`) each define the same set of variable names with different values, scoped under `[data-theme='...']`. Switching themes just flips the `data-theme` attribute on `<html>` — no component code changes, no reload.

## Naming convention

As of `v3.0.0`, every **color** token is prefixed `--zyra-color-*`. Structural tokens that aren't colors keep their existing names:

| Category | Example | Prefix |
|---|---|---|
| Color | `--zyra-color-accent`, `--zyra-color-bg-app` | `--zyra-color-*` |
| Radius | `--zyra-radius-md` | `--zyra-radius-*` |
| Spacing | `--zyra-space-4` | `--zyra-space-*` |
| Motion | `--zyra-transition-base`, `--zyra-duration-fast` | `--zyra-transition-*`, `--zyra-duration-*` |
| Shadow/ring/glow | `--zyra-shadow-md`, `--zyra-ring` | unprefixed (effect tokens, matches how e.g. shadcn keeps `--ring` bare) |
| Typography | `--zyra-font-body` | `--zyra-font-*` |
| Z-index | `--zyra-z-modal` | `--zyra-z-*` |

Numbered scales stay numbered where they're a genuine scale (`--zyra-color-cyan-500`, `--zyra-space-8`), but ordinal placeholders got real names: `--zyra-accent-2`/`--zyra-accent-3` are now `--zyra-color-accent-secondary`/`--zyra-color-accent-tertiary`.

## Public API tiers

Not every CSS custom property `zyra-ng-ui` ships is meant to be overridden. The four tiers split into two groups: things you're meant to customize, and internal wiring that happens to be visible in the compiled CSS because custom properties can't be truly private.

| Tier | File | Status | Why |
|---|---|---|---|
| 0 — Primitive | `_tokens-primitives.scss` | **Internal** | Raw, unnamed-role values (`--zyra-color-cyan-500`). No consumer — including components — should reference these directly. They exist only so the theme files can build named roles from them. |
| 1 — Foundation / Dimension | `_tokens-dimension.scss` | **Public** | Radius, spacing, typography, motion, z-index. Theme-invariant and safe to override globally — this is where you set your own type scale or corner radius. |
| 2 — Semantic | `_tokens-semantic.scss` (plus the raw per-theme color names it aliases, e.g. `--zyra-color-accent`, `--zyra-color-bg-app`) | **Public — primary customization layer** | Role-based names (`--zyra-color-primary`, `--zyra-color-surface`, `--zyra-color-danger`) that resolve differently per theme. This is the intended place to re-brand: change what "primary" or "surface" *means*, and every component picks it up automatically. |
| 3 — Component | `_tokens-components.scss` | **Internal** | Per-component namespaced tokens (`--zyra-color-btn-primary-hover-bg`, `--zyra-checkbox-focus-shadow`, `--zyra-card-radius`). These are how components consume tier 2 internally, not a public override surface — see below. |

**Why tier 3 is internal, not public:** almost every tier-3 token is a state color (hover/active/checked/focus) or a calculated value (`--zyra-color-glow-shadow`, composed from an RGB-channel primitive via `rgba()`). Depending on one directly means depending on a specific component's internal implementation — it can be renamed, split, or removed in a minor release without notice, because nothing in the library's public contract promises it will stay. If you need a button's hover state to look different, override the semantic token it's built from (`--zyra-color-accent-hover`) — every component that uses that role picks up the change, and the override survives refactors to any single component.

There is currently no dedicated "public component layout token" tier — per-variant sizing (button padding, card padding, etc.) is hardcoded in each component's `.scss` and controlled indirectly through tier-1 foundation tokens (`--zyra-radius-*`, `--zyra-space-*`) and variant classes (`--sm`/`--md`/`--lg`), not through overridable per-component dimension variables. Don't rely on undocumented tier-3 names to change a component's size or spacing.

## Token Stability Policy

- **Tier 0 (primitive):** No stability guarantee. Values and names may change at any time; nothing outside the library should reference them.
- **Tier 1 (foundation) and Tier 2 (semantic):** Treated as SemVer-stable public API. Renaming or removing one of these is a breaking change and ships in a major version, called out in the changelog (as the `v3.0.0` `--zyra-color-*` rename was).
- **Tier 3 (component):** No stability guarantee across minor/patch versions. These may be added, renamed, split, or collapsed as components are refactored. If you've overridden one and it stops working after an upgrade, that's expected — the fix is to move the override up to tier 2.

## Override Best Practices

**Safe — override tier 2 (semantic) or tier 1 (foundation):**

```css
/* global styles.css — safe: re-themes every component that uses these roles */
:root {
  --zyra-color-primary:       #7c3aed;  /* tier 2 semantic */
  --zyra-color-primary-muted: #ede9fe;  /* tier 2 semantic */
  --zyra-radius-md:           6px;      /* tier 1 foundation */
  --zyra-font-body:           'Inter', sans-serif; /* tier 1 foundation */
}
```

**Avoid — overriding tier 3 (component) or tier 0 (primitive) tokens:**

```css
/* avoid: reaches past the semantic tier into one component's internal wiring.
   Works today, but --zyra-color-btn-primary-hover-bg isn't a documented API
   and can be renamed/removed without a major version bump. */
:root {
  --zyra-color-btn-primary-hover-bg: #6d28d9;
}

/* avoid: primitive tokens are unnamed-role raw values, not a theming surface —
   changing this recolors the primitive everywhere it's referenced internally,
   with no guarantee about what that ends up touching. */
:root {
  --zyra-color-cyan-500: #6d28d9;
}
```

If you find yourself reaching into tier 3 to fix one component, look for the tier-2 semantic role it's aliasing first (check `_tokens-components.scss` — every entry there is `var(--zyra-color-<semantic-name>)`) and override that instead.

## Overriding tokens

```css
/* global styles.css — override any token */
:root {
  --zyra-color-accent:       #7c3aed;
  --zyra-color-accent-muted: #ede9fe;
  --zyra-radius-md:          6px;
  --zyra-font-body:          'Inter', sans-serif;
}
```

## Switching themes at runtime

```ts
import { inject } from '@angular/core';
import { ZyraThemeService } from 'zyra-ng-ui';

const theme = inject(ZyraThemeService);

theme.setTheme('ocean'); // 'dark' | 'light' | 'ocean' | 'amber' | 'rose'
theme.cycle();           // step through all 5 themes in order
theme.toggle();          // switch between dark and light only
```

`ZyraThemeService` persists the choice to `localStorage` (key: `zyra-theme`) and respects `prefers-color-scheme` on first load.

---

## Migrating from < v3.0.0

`v3.0.0` renamed every color token to the `--zyra-color-*` convention. If your app references `--zyra-*` tokens directly in CSS (not just through component inputs), update to the new names below. Structural tokens not listed here (`--zyra-radius-*`, `--zyra-space-*`, `--zyra-shadow-*`, `--zyra-ring`, `--zyra-transition-*`, `--zyra-duration-*`, `--zyra-ease-*`, `--zyra-font-*`, `--zyra-z-*`) are unchanged.

| Old (< v3.0.0) | New (>= v3.0.0) |
|---|---|
| `--zyra-accent-2-border` | `--zyra-color-accent-secondary-border` |
| `--zyra-accent-2-muted` | `--zyra-color-accent-secondary-muted` |
| `--zyra-accent-2` | `--zyra-color-accent-secondary` |
| `--zyra-accent-3-border` | `--zyra-color-accent-tertiary-border` |
| `--zyra-accent-3-muted` | `--zyra-color-accent-tertiary-muted` |
| `--zyra-accent-3` | `--zyra-color-accent-tertiary` |
| `--zyra-accent-border` | `--zyra-color-accent-border` |
| `--zyra-accent-hover` | `--zyra-color-accent-hover` |
| `--zyra-accent-muted` | `--zyra-color-accent-muted` |
| `--zyra-accent` | `--zyra-color-accent` |
| `--zyra-avatar-blue-end` | `--zyra-color-avatar-blue-end` |
| `--zyra-avatar-contrast` | `--zyra-color-avatar-contrast` |
| `--zyra-avatar-primary-end` | `--zyra-color-avatar-primary-end` |
| `--zyra-avatar-purple-end` | `--zyra-color-avatar-purple-end` |
| `--zyra-avatar-warm-end` | `--zyra-color-avatar-warm-end` |
| `--zyra-background-elevated` | `--zyra-color-background-elevated` |
| `--zyra-background` | `--zyra-color-background` |
| `--zyra-bg-app` | `--zyra-color-bg-app` |
| `--zyra-bg-panel` | `--zyra-color-bg-panel` |
| `--zyra-bg-raised` | `--zyra-color-bg-raised` |
| `--zyra-bg-surface` | `--zyra-color-bg-surface` |
| `--zyra-border-color` | `--zyra-color-border-color` |
| `--zyra-border-hover` | `--zyra-color-border-hover` |
| `--zyra-border-strong-color` | `--zyra-color-border-strong-color` |
| `--zyra-border-strong` | `--zyra-color-border-strong` |
| `--zyra-border` | `--zyra-color-border` |
| `--zyra-btn-danger-bg` | `--zyra-color-btn-danger-bg` |
| `--zyra-btn-danger-border` | `--zyra-color-btn-danger-border` |
| `--zyra-btn-danger-hover-bg` | `--zyra-color-btn-danger-hover-bg` |
| `--zyra-btn-danger-hover-border` | `--zyra-color-btn-danger-hover-border` |
| `--zyra-btn-danger-hover-text` | `--zyra-color-btn-danger-hover-text` |
| `--zyra-btn-danger-text` | `--zyra-color-btn-danger-text` |
| `--zyra-btn-ghost-hover-bg` | `--zyra-color-btn-ghost-hover-bg` |
| `--zyra-btn-ghost-hover-text` | `--zyra-color-btn-ghost-hover-text` |
| `--zyra-btn-ghost-text` | `--zyra-color-btn-ghost-text` |
| `--zyra-btn-outline-hover-bg` | `--zyra-color-btn-outline-hover-bg` |
| `--zyra-btn-outline-hover-border` | `--zyra-color-btn-outline-hover-border` |
| `--zyra-btn-primary-bg` | `--zyra-color-btn-primary-bg` |
| `--zyra-btn-primary-border` | `--zyra-color-btn-primary-border` |
| `--zyra-btn-primary-hover-bg` | `--zyra-color-btn-primary-hover-bg` |
| `--zyra-btn-primary-text` | `--zyra-color-btn-primary-text` |
| `--zyra-btn-secondary-bg` | `--zyra-color-btn-secondary-bg` |
| `--zyra-btn-secondary-border` | `--zyra-color-btn-secondary-border` |
| `--zyra-btn-secondary-hover-bg` | `--zyra-color-btn-secondary-hover-bg` |
| `--zyra-btn-secondary-hover-border` | `--zyra-color-btn-secondary-hover-border` |
| `--zyra-btn-secondary-text` | `--zyra-color-btn-secondary-text` |
| `--zyra-card-bg` | `--zyra-color-card-bg` |
| `--zyra-card-border` | `--zyra-color-card-border` |
| `--zyra-card-hover-border` | `--zyra-color-card-hover-border` |
| `--zyra-card-section-bg` | `--zyra-color-card-section-bg` |
| `--zyra-checkbox-bg` | `--zyra-color-checkbox-bg` |
| `--zyra-checkbox-border` | `--zyra-color-checkbox-border` |
| `--zyra-checkbox-checked-bg` | `--zyra-color-checkbox-checked-bg` |
| `--zyra-checkbox-checked-border` | `--zyra-color-checkbox-checked-border` |
| `--zyra-checkbox-mark` | `--zyra-color-checkbox-mark` |
| `--zyra-code-bg` | `--zyra-color-code-bg` |
| `--zyra-cyan-50` … `--zyra-cyan-950` | `--zyra-color-cyan-50` … `--zyra-color-cyan-950` |
| `--zyra-danger-border-color` | `--zyra-color-danger-border-color` |
| `--zyra-danger-border` | `--zyra-color-danger-border` |
| `--zyra-danger-foreground` | `--zyra-color-danger-foreground` |
| `--zyra-danger-muted` | `--zyra-color-danger-muted` |
| `--zyra-danger-subtle` | `--zyra-color-danger-subtle` |
| `--zyra-danger` | `--zyra-color-danger` |
| `--zyra-field-bg` | `--zyra-color-field-bg` |
| `--zyra-field-border` | `--zyra-color-field-border` |
| `--zyra-field-counter-color` | `--zyra-color-field-counter-color` |
| `--zyra-field-counter-error` | `--zyra-color-field-counter-error` |
| `--zyra-field-counter-warn` | `--zyra-color-field-counter-warn` |
| `--zyra-field-error-color` | `--zyra-color-field-error-color` |
| `--zyra-field-filled-bg` | `--zyra-color-field-filled-bg` |
| `--zyra-field-focus-border` | `--zyra-color-field-focus-border` |
| `--zyra-field-hint-color` | `--zyra-color-field-hint-color` |
| `--zyra-field-icon-color` | `--zyra-color-field-icon-color` |
| `--zyra-field-label-color` | `--zyra-color-field-label-color` |
| `--zyra-field-required-mark` | `--zyra-color-field-required-mark` |
| `--zyra-field-success-color` | `--zyra-color-field-success-color` |
| `--zyra-foreground-muted` | `--zyra-color-foreground-muted` |
| `--zyra-foreground-subtle` | `--zyra-color-foreground-subtle` |
| `--zyra-foreground` | `--zyra-color-foreground` |
| `--zyra-glass-bg` | `--zyra-color-glass-bg` |
| `--zyra-glow` | `--zyra-color-glow` |
| `--zyra-header-glass-bg` | `--zyra-color-header-glass-bg` |
| `--zyra-info-border-color` | `--zyra-color-info-border-color` |
| `--zyra-info-border` | `--zyra-color-info-border` |
| `--zyra-info-foreground` | `--zyra-color-info-foreground` |
| `--zyra-info-muted` | `--zyra-color-info-muted` |
| `--zyra-info-subtle` | `--zyra-color-info-subtle` |
| `--zyra-info` | `--zyra-color-info` |
| `--zyra-input-bg` | `--zyra-color-input-bg` |
| `--zyra-input-border` | `--zyra-color-input-border` |
| `--zyra-on-brand` | `--zyra-color-on-brand` |
| `--zyra-on-danger` | `--zyra-color-on-danger` |
| `--zyra-on-info` | `--zyra-color-on-info` |
| `--zyra-on-success` | `--zyra-color-on-success` |
| `--zyra-on-warning` | `--zyra-color-on-warning` |
| `--zyra-overlay-bg` | `--zyra-color-overlay-bg` |
| `--zyra-overlay-scrim` | `--zyra-color-overlay-scrim` |
| `--zyra-pill-active-bg` | `--zyra-color-pill-active-bg` |
| `--zyra-preview-stage-bg` | `--zyra-color-preview-stage-bg` |
| `--zyra-primary-border` | `--zyra-color-primary-border` |
| `--zyra-primary-hover` | `--zyra-color-primary-hover` |
| `--zyra-primary-subtle` | `--zyra-color-primary-subtle` |
| `--zyra-primary` | `--zyra-color-primary` |
| `--zyra-progress-danger` | `--zyra-color-progress-danger` |
| `--zyra-progress-default` | `--zyra-color-progress-default` |
| `--zyra-progress-info` | `--zyra-color-progress-info` |
| `--zyra-progress-label-color` | `--zyra-color-progress-label-color` |
| `--zyra-progress-success` | `--zyra-color-progress-success` |
| `--zyra-progress-track-bg` | `--zyra-color-progress-track-bg` |
| `--zyra-progress-track-border` | `--zyra-color-progress-track-border` |
| `--zyra-progress-warning` | `--zyra-color-progress-warning` |
| `--zyra-radio-bg` | `--zyra-color-radio-bg` |
| `--zyra-radio-border` | `--zyra-color-radio-border` |
| `--zyra-radio-checked-bg` | `--zyra-color-radio-checked-bg` |
| `--zyra-radio-checked-border` | `--zyra-color-radio-checked-border` |
| `--zyra-radio-dot` | `--zyra-color-radio-dot` |
| `--zyra-scrollbar-thumb` | `--zyra-color-scrollbar-thumb` |
| `--zyra-scrollbar-track` | `--zyra-color-scrollbar-track` |
| `--zyra-select-bg` | `--zyra-color-select-bg` |
| `--zyra-select-border` | `--zyra-color-select-border` |
| `--zyra-select-filled-bg` | `--zyra-color-select-filled-bg` |
| `--zyra-select-focus-border` | `--zyra-color-select-focus-border` |
| `--zyra-select-icon` | `--zyra-color-select-icon` |
| `--zyra-select-panel-bg` | `--zyra-color-select-panel-bg` |
| `--zyra-select-panel-border` | `--zyra-color-select-panel-border` |
| `--zyra-select-placeholder` | `--zyra-color-select-placeholder` |
| `--zyra-select-text` | `--zyra-color-select-text` |
| `--zyra-spinner-inverse-head` | `--zyra-color-spinner-inverse-head` |
| `--zyra-spinner-inverse-track` | `--zyra-color-spinner-inverse-track` |
| `--zyra-success-border-color` | `--zyra-color-success-border-color` |
| `--zyra-success-border` | `--zyra-color-success-border` |
| `--zyra-success-foreground` | `--zyra-color-success-foreground` |
| `--zyra-success-muted` | `--zyra-color-success-muted` |
| `--zyra-success-subtle` | `--zyra-color-success-subtle` |
| `--zyra-success` | `--zyra-color-success` |
| `--zyra-surface-dropdown` | `--zyra-color-surface-dropdown` |
| `--zyra-surface-inset` | `--zyra-color-surface-inset` |
| `--zyra-surface-inverse` | `--zyra-color-surface-inverse` |
| `--zyra-surface-subtle` | `--zyra-color-surface-subtle` |
| `--zyra-surface` | `--zyra-color-surface` |
| `--zyra-switch-track-off` | `--zyra-color-switch-track-off` |
| `--zyra-switch-track-on` | `--zyra-color-switch-track-on` |
| `--zyra-tabs-badge-active-bg` | `--zyra-color-tabs-badge-active-bg` |
| `--zyra-tabs-badge-active-text` | `--zyra-color-tabs-badge-active-text` |
| `--zyra-tabs-badge-bg` | `--zyra-color-tabs-badge-bg` |
| `--zyra-tabs-badge-text` | `--zyra-color-tabs-badge-text` |
| `--zyra-tabs-border` | `--zyra-color-tabs-border` |
| `--zyra-tabs-indicator` | `--zyra-color-tabs-indicator` |
| `--zyra-tabs-pill-active-bg` | `--zyra-color-tabs-pill-active-bg` |
| `--zyra-tabs-text-active` | `--zyra-color-tabs-text-active` |
| `--zyra-tabs-text-hover` | `--zyra-color-tabs-text-hover` |
| `--zyra-tabs-text` | `--zyra-color-tabs-text` |
| `--zyra-text-dim` | `--zyra-color-text-dim` |
| `--zyra-text-inverse` | `--zyra-color-text-inverse` |
| `--zyra-text-muted` | `--zyra-color-text-muted` |
| `--zyra-text` | `--zyra-color-text` |
| `--zyra-toast-bg` | `--zyra-color-toast-bg` |
| `--zyra-toast-border` | `--zyra-color-toast-border` |
| `--zyra-toggle-bg-on` | `--zyra-color-toggle-bg-on` |
| `--zyra-toggle-border` | `--zyra-color-toggle-border` |
| `--zyra-toggle-fg-on` | `--zyra-color-toggle-fg-on` |
| `--zyra-tooltip-bg` | `--zyra-color-tooltip-bg` |
| `--zyra-tooltip-border` | `--zyra-color-tooltip-border` |
| `--zyra-tooltip-text` | `--zyra-color-tooltip-text` |
| `--zyra-warning-border-color` | `--zyra-color-warning-border-color` |
| `--zyra-warning-border` | `--zyra-color-warning-border` |
| `--zyra-warning-foreground` | `--zyra-color-warning-foreground` |
| `--zyra-warning-muted` | `--zyra-color-warning-muted` |
| `--zyra-warning-subtle` | `--zyra-color-warning-subtle` |
| `--zyra-warning` | `--zyra-color-warning` |

A quick way to migrate: find-and-replace `--zyra-` with `--zyra-color-` in your override stylesheet, then fix the handful of tokens above that don't just get the prefix inserted (`--zyra-accent-2`/`-3`, `--zyra-on-*`).
