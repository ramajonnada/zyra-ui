# Zyra UI — Coding Standards

Concrete rules for code in this repo, both `projects/zyra-ng-ui` (the library) and `projects/zyra-ui` (the site). For component-authoring workflow specifically, see [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md). For the token/theme system, see [THEME_SYSTEM.md](THEME_SYSTEM.md).

## Formatting

Formatting is enforced by Prettier + `.editorconfig`, not personal preference:

- 4-space indentation, spaces not tabs (`.editorconfig`)
- Single quotes, 100-char print width (`package.json` → `prettier` config)
- Run `npm run format` before committing; CI-equivalent check is `npm run format:check`

## Angular conventions

- **Standalone components only** — no `NgModule`. Every component declares its own `imports` array.
- **Signals-first** — `input()`, `output()`, `model()`, `signal()`, `computed()`. Avoid `@Input()`/`@Output()` decorators and avoid RxJS for plain component state; `toSignal()` is fine for bridging router/HTTP streams.
- **`ChangeDetectionStrategy.OnPush`** on every component.
- **`booleanAttribute` transform** for boolean inputs, so attribute syntax works without `="true"`:
  ```ts
  disabled = input(false, { transform: booleanAttribute });
  ```
- **SSR safety** — inject `PLATFORM_ID` / `isPlatformBrowser()` before touching `window`, `document`, or `localStorage` directly (see `ZyraThemeService` for the pattern). Never assume a browser environment at construction time.
- **Lazy `NgControl` injection** for `ControlValueAccessor` components — inject `Injector` and resolve `NgControl` in `ngOnInit`, not the constructor, to avoid `NG0200` circular DI (see `ZyraInput`).

## Naming

- Library selectors: `zyra-*` (e.g. `zyra-button`). Site app selectors: `app-*` — enforced by `eslint.config.js`.
- Exported class names: `Zyra` + PascalCase (`ZyraButton`, `ZyraFormField`).
- BEM-style CSS classes scoped per component: `.zyr-button`, `.zyr-button--primary`.
- Directive-only helpers (e.g. content-projection markers) use the `Zyr` prefix without "a": `ZyrPrefix`, `ZyrSuffix`.

## File structure per component

Every library component is 4 files in `projects/zyra-ng-ui/src/lib/components/zyra-<name>/`:

```
zyra-<name>.ts        — component class
zyra-<name>.html      — template
zyra-<name>.scss      — styles (component-tier tokens only, see THEME_SYSTEM.md)
zyra-<name>.spec.ts   — tests
```

Don't split a component across more files than this unless it's a compound component (e.g. `zyra-select` + `zyra-option`, `zyra-tabs` + `zyra-tab`) — those get separate directories per part but stay under the same `components/` tree.

## Testing

- Karma + Jasmine (`ng test`), not the `vitest` devDependency directly — the project's `test` builder is `@angular/build:karma`. Don't run `npx vitest run` expecting it to pick up specs; use `npm run test` / `ng test <project> --watch=false --browsers=ChromeHeadless`.
- Use `scripts/gen-spec.js <path/to/component.ts>` to scaffold a meaningful spec from a component's actual shape (inputs, outputs, computed) rather than hand-writing boilerplate.
- Test host-component pattern: wrap the component under test in a small standalone host component with a template, don't `TestBed.createComponent(TargetComponent)` directly when you need to test content projection or two-way bindings.

## CSS / theming rules

- **No hardcoded colors** in component SCSS — every color is a `var(--zyra-color-...)` reference. Enforced by convention, not lint (nothing currently greps for hex literals — treat this as a manual review requirement).
- Components consume the **component tier** (`--zyra-color-btn-primary-bg`, etc.) or the **semantic tier** (`--zyra-color-border`) — never a per-theme raw token directly (`--zyra-color-bg-app`, `--zyra-color-accent`). See [THEME_SYSTEM.md](THEME_SYSTEM.md) for why this matters and where the codebase currently violates it.
- Support all 5 themes — a change that only looks right in `dark` isn't done. Check `light`, `ocean`, `amber`, `rose` too (the `/theming` page on the site is the fastest way to eyeball all 5 at once).

## Git / commits

- [Conventional Commits](https://www.conventionalcommits.org/) — see [CONTRIBUTING.md](../CONTRIBUTING.md) for the full prefix table.
- Never commit generated/build artifacts (`dist/`, `.angular/cache`, `node_modules`) — check `.gitignore` covers new tools before adding them.
- Never commit local tool state (npm cache dirs, IDE state) — this bit the repo once already (`.npm-cache/` was accidentally tracked for a while).
