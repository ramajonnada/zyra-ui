# Zyra UI — Component Guidelines

How to add or change a component in `zyra-ng-ui` so it's consistent with everything else in the library. For general TS/Angular style, see [CODING_STANDARDS.md](CODING_STANDARDS.md). For token usage rules, see [THEME_SYSTEM.md](THEME_SYSTEM.md).

## What every component needs

A component isn't done when it renders. `scripts/audit-components.js` (`npm run audit:components`) enforces three things exist for every directory under `projects/zyra-ng-ui/src/lib/components/`:

1. A **lib spec** (`*.spec.ts`) next to the component.
2. A **playground registry entry** — `projects/zyra-ui/src/app/pages/ui-components/shared/playground/playground-registry.ts` imports a `<Name>Renderer` for it.
3. A **showcase data entry** — a matching `slug:` in `projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts`.

Run `npm run audit:components` after adding a component — it'll tell you exactly what's missing. `npm run count:check` (or `count:fix`) separately verifies every hardcoded "N components" reference on the site matches the real count in `ui-components.data.ts`.

## Scaffolding a new component

```powershell
.\scripts\new-component.ps1 -Name date-picker
.\scripts\new-playground.ps1 -Name date-picker
```

`new-component.ps1` creates the 4 files, adds the `public-api.ts` export, and inserts a component-tier token stub into `_tokens-components.scss` (tier 3, referencing tier-2 semantic tokens — see [THEME_SYSTEM.md](THEME_SYSTEM.md)). Because tier 2 already resolves per-theme, this one stub covers all 5 themes; there's no need to touch the raw theme files for ordinary component styling. `new-playground.ps1` creates the renderer and wires the registry + showcase entries.

After scaffolding:

1. Fill in inputs/outputs/computed in `.ts`.
2. Build the template in `.html`.
3. Style with real component-tier tokens in `.scss` (add them to `_tokens-components.scss` first, referencing the semantic tier).
4. Regenerate a meaningful spec: `node scripts/gen-spec.js projects/zyra-ng-ui/src/lib/components/zyra-<name>/zyra-<name>.ts --force`
5. `npm run build:lib` to confirm it compiles standalone.
6. `npm run audit:components` to confirm nothing's missing.

## API design

- Prefer signal `input()`/`output()`/`model()` over decorators (see [CODING_STANDARDS.md](CODING_STANDARDS.md)).
- Variant/size inputs are string union types, not booleans-per-variant: `variant = input<ButtonVariant>('primary')`, not `primary = input(false)`.
- Boolean inputs use `booleanAttribute` transform so `<zyra-button loading>` works without `="true"`.
- Form controls (`zyra-input`, `zyra-select`, `zyra-checkbox`, ...) implement `ControlValueAccessor` and integrate with `zyra-form-field` for labels/errors — don't invent a parallel label/error mechanism per component.
- Content projection uses directive markers (`ZyrPrefix`, `ZyrSuffix`) or `slot`-attribute selectors (`<ng-content select="[slot=header]" />`), not positional `<ng-content>` order, so consumers can't silently break by reordering markup.

## Accessibility (non-negotiable)

Every component ships accessible by default, not as a follow-up:

- Correct ARIA role (`role="switch"`, `role="alert"`, `role="status"`, etc. — check what similar existing components use before inventing a new pattern).
- Full keyboard navigation for anything interactive (arrow keys for `zyra-radio-group`/`zyra-tabs`, Escape to close `zyra-modal`/`zyra-tooltip`).
- Visible focus ring using the shared `--zyra-ring` / `--zyra-color-*-focus-shadow` tokens — don't suppress `:focus-visible`.
- Focus trap + return-focus-on-close for anything modal.

## Cross-theme review

Before calling a component done, check it in all 5 themes, not just the one you were looking at while building it. The fastest way: run the site locally and visit `/theming`, or the component's own page at `/components/<slug>` while switching themes from the header dropdown. A component that only looks right in `dark` is a bug, not a style preference — see [THEME_SYSTEM.md](THEME_SYSTEM.md).
