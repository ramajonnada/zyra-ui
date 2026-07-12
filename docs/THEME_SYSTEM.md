# Zyra UI — Theme System

How theming is actually built, for anyone modifying the token layer or adding a new theme. For the token naming convention and the full old→new migration table, see [TOKENS.md](TOKENS.md) — this doc is about the architecture, not the name list.

## The four tiers

Defined in `projects/zyra-ng-ui/src/lib/styles/`, loaded in this order via `index.scss`:

| Tier | File | Theme-dependent? | Who consumes it |
|---|---|---|---|
| 0. Primitives | `_tokens-primitives.scss` | No — same raw palette in every theme | Nobody directly; only the theme files reference these |
| 1. Dimension | `_tokens-dimension.scss` | No — radius, spacing, motion, typography, z-index | Components, directly |
| 2. Semantic | `_tokens-semantic.scss` | Indirectly — aliases the active theme's raw values under stable names (`--zyra-color-primary` → `var(--zyra-color-accent)`) | Components and consumer overrides — **this is the intended public customization surface** |
| 3. Component | `_tokens-components.scss` | Indirectly — namespaced per-component tokens that reference tier 2 | Component `.scss` files only |

Then, separately, **five theme files** — `_dark-theme.scss`, `_light-theme.scss`, `_ocean-theme.scss`, `_amber-theme.scss`, `_rose-theme.scss` — each define the *same* set of raw variable names (`--zyra-color-bg-app`, `--zyra-color-accent`, `--zyra-color-text`, ...) with different values, scoped under `[data-theme='<name>']`. These raw names are what tier 2 (semantic) aliases point to.

CSS custom properties resolve lazily at computed-value time, so `index.scss` can load the semantic tier *before* the theme files without breaking anything — by the time a value is actually needed for paint, whichever `[data-theme]` block is active on `<html>` has already won.

## Why the tier separation matters

Tier 1 (foundation/dimension) and tier 2 (semantic) are the public contract — see [TOKENS.md](TOKENS.md#public-api-tiers) for the full public/internal breakdown and stability guarantees. Tier 0 (primitive) and tier 3 (component) are implementation detail — they're allowed to be restructured between minor versions because nothing outside the library is supposed to depend on them directly.

Concretely, tier 3 in `_tokens-components.scss` is almost entirely state colors (`--zyra-color-btn-primary-hover-bg`, `--zyra-color-checkbox-checked-bg`, `--zyra-color-tabs-badge-active-bg`, ...) and a few calculated or fixed values (`--zyra-color-glow-shadow`, `--zyra-card-radius`, `--zyra-btn-disabled-opacity`). None of it is a documented override surface — it's how a component wires itself to tier 2, not a knob for consumers. A consumer who wants a different hover color changes the tier-2 role the component reads from (`--zyra-color-accent-hover`), not the tier-3 alias.

**This rule is not fully enforced today.** Some component `.scss` files reach past the semantic tier straight into raw theme tokens (e.g. referencing `--zyra-color-accent` instead of `--zyra-color-primary`), and a few tier-2 entries are redundant aliases of a tier-lower token with an near-identical name (`--zyra-color-border-color` vs `--zyra-color-border`). This is a known rough edge, not an intentional design — new component work should consume tier 2/3 correctly even where existing code doesn't, and cleanup is welcome but out of scope for a single change (see [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md)).

## Runtime switching — `ZyraThemeService`

`projects/zyra-ng-ui/src/lib/theme/theme-service.ts`. Signal-based, SSR-safe (checks `isPlatformBrowser` before touching `window`/`localStorage`).

- `theme` — readonly signal of the current `ZyraTheme` (`'dark' | 'light' | 'ocean' | 'amber' | 'rose'`).
- `setTheme(theme)` — sets and persists.
- `cycle()` — steps through all 5 in order.
- `toggle()` — dark/light only, ignores the extended themes.
- `clearStoredTheme()` — drops the saved preference and re-resolves from `prefers-color-scheme`.

An `effect()` in the constructor calls `applyToDom()` on every change: sets `data-theme` and `data-zyra-theme` attributes on `<html>`, toggles `.zyra-theme-dark`/`.zyra-theme-light` classes, and sets `document.documentElement.style.colorScheme`. That attribute flip is the entire mechanism — no component re-renders, no JS-driven restyling, just the browser repainting against different `[data-theme]` CSS.

`provideZyra(config)` wires the service app-wide via `APP_INITIALIZER`, so the theme is resolved and applied *before* first paint (avoids flash-of-wrong-theme). Default config: `{ theme: 'dark', storageKey: 'zyra-theme', respectSystemTheme: true }`.

## Adding a 6th theme

1. Create `_your-theme.scss` in `projects/zyra-ng-ui/src/lib/styles/`, copying the full variable list from an existing theme file (e.g. `_amber-theme.scss`) under `[data-theme='your-theme']`. Every variable the other 5 define must be present — the semantic tier will silently fall back to nothing for anything missing.
2. `@forward 'your-theme';` in `index.scss`, alongside the other 5.
3. Add `'your-theme'` to `ZYRA_THEME_NAMES` and a `ZYRA_THEME_COLOR_SCHEME` entry (`'dark'` or `'light'`) in `theme-type.ts`.
4. Add an entry in `package.json`'s `exports` map (`"./your-theme": { "style": "./styles/_your-theme.scss" }`) if consumers should be able to import it standalone.
5. Add it to the `themes` array in the site's `/theming` page (`projects/zyra-ui/src/app/pages/theming/theming.ts`) so it shows up in the live switcher.
6. Verify contrast — every theme file has WCAG-AA-passing comments next to button-text and focus-ring colors; match that bar, don't just eyeball it.

## Testing tokens

`projects/zyra-ng-ui/src/lib/styles/theme-tokens.spec.ts` + `testing/theme-token-host.scss` assert that the expected token names actually resolve to non-empty computed values per theme. Extend this when adding tokens, not just when adding themes.

## Overriding tokens as a consumer

Covered in depth in [TOKENS.md](TOKENS.md) and the site's `/docs` and `/theming` pages — short version: override tier-2 semantic tokens (or dimension tokens) in your own global stylesheet after `@use 'zyra-ng-ui';`. Don't override tier-3 component tokens or raw per-theme tokens directly; they're not the stable surface.
