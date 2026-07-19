# Changelog

All notable changes to `zyra-ng-ui` are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [3.4.3] — 2026-07-19

### Added

- New semantic token `--zyra-color-foreground-inverse`, for text/icons/knobs placed on a filled inverse surface (resolves to white on dark themes, dark on light) — replaces ad hoc `text-inverse` reaches and hardcoded `#ffffff` in component SCSS.

### Fixed

- `zyra-alert`: warning-variant icon now uses `--zyra-color-on-warning` instead of a hardcoded white, fixing a WCAG AA contrast failure on the amber background.
- `zyra-card`: base and hover shadows now use the per-theme `--zyra-card-shadow` / `--zyra-card-elevated-shadow` tokens instead of hardcoded black-alpha values that were too heavy on light theme; the inset top-edge highlight now uses new `--zyra-card-inset-highlight` / `--zyra-card-inset-highlight-hover` tokens (built on `--zyra-color-foreground-inverse`) instead of an inline hardcoded `color-mix(..., white ...)`.
- `zyra-scroll-area`: added `--zyra-scroll-area-fade-color` (defaults to `--zyra-color-surface`) so the scroll-fade indicators blend with the container's own background and stay visible on light theme surfaces, not just dark.
- `zyra-table`: added `--zyra-color-table-row-hover-bg` — row hover/selected states no longer borrow `zyra-sidebar`'s hover token.
- `zyra-switch`: added `--zyra-color-switch-thumb` (now built on `--zyra-color-foreground-inverse`) / `--zyra-switch-thumb-shadow` tokens, replacing a hardcoded `#ffffff` thumb and shadow.
- Corrected swapped Tier 1/Tier 2 header comments in `_tokens-dimension.scss` and `_tokens-semantic.scss`.

## [3.4.2] — 2026-07-19

### Added

- `zyra-checkbox`: new `tabbable` input to exclude a checkbox from the normal Tab order when a parent row already handles it via roving tabindex (used by `zyra-table` and `zyra-tree-view`).

### Fixed

- `zyra-table`: header/row roving-tabindex now revalidates against the currently visible sortable columns/rows, so the table doesn't drop out of Tab order when sorting or filtering changes what's rendered; `page` clamping now also handles the lower bound, `NaN`, and non-integer values, not just the upper bound; selection checkbox/radio cells now stop `keydown` (not just `click`) from bubbling into row navigation, preventing double-toggling.
- `zyra-tree-view`: selection checkboxes no longer add a separate Tab stop on top of the row's own roving tabindex; Enter/Space on a leaf node now fires `nodeClick` in `selectionMode="none"` too, matching mouse-click behavior.
- `zyra-date-picker`: the footer "Clear" button now honors the `clearable` input, like the trigger's own clear button; the portaled panel is now capped to the viewport size so it can't overflow on narrow screens or with wide content; keyboard handling (Escape, Tab) now works while focus is inside the portaled calendar panel, not just the trigger.
- `zyra-header`: body-scroll-lock and focus-trap logic now consistently use Angular's injected `DOCUMENT` instead of the global `document`.
- Body-scroll-lock state is now scoped per-`Document` (via a `WeakMap`) instead of shared module-level globals, fixing state leakage across multiple documents (e.g. SSR).
- Marketing site sitemap: `/privacy` and `/terms` now derive `lastmod` from each page's actual last commit date instead of the build date.

### Changed

- Narrowed the `zyra-sidebar-item` component-selector lint override to that file only, instead of a project-wide allowance.

## [3.4.1] — 2026-07-18

### Added

- Added an `ariaLabel` input to `zyra-checkbox` for standalone usage without a visible label (e.g. table/tree-view selection checkboxes).

### Deprecated

- `zyra-input`'s `search` output is deprecated in favor of `searched` — the old name shadowed the native DOM `search` event, which Angular's style guide disallows for component outputs. `search` still emits (identically, alongside `searched`) and will be removed in a future major version — this release does not break existing usage.

### Changed

- Added a shared, reference-counted body-scroll-lock utility used by `zyra-header`'s mobile drawer, `zyra-modal`, and `zyra-drawer`, so scroll stays locked correctly if more than one is open at once.
- `zyra-header`'s mobile drawer now traps keyboard focus while open and no longer tries to restore focus to the hidden burger button after a breakpoint change.

### Fixed

- `zyra-date-picker`: the calendar panel now escapes clipping ancestors (portaled to `<body>`, matching `zyra-popover`), honors `min`/`max` when picking "Today", keeps the clear button keyboard-reachable and outside the focusable trigger, and Tab now moves focus into the calendar instead of closing the panel.
- `zyra-table`: `page` is now clamped when the available page range shrinks, and row/select-all checkboxes have real accessible names.
- `zyra-tree-view`: roving focus recovers when the tracked node is hidden (e.g. its parent collapses), disabled nodes can no longer be expanded, and selection checkboxes respect the tree's own `disabled` input.

---

## [3.4.0] — 2026-07-18

### Added

- Added `zyra-date-picker` — a dropdown date field wrapping `zyra-calendar` in a select-style trigger, with single or start/end range selection, a formatted display label, min/max constraints, and full Angular Forms (CVA) integration.
- Added `zyra-table` — a data table with sortable columns (full keyboard navigation via roving tabindex across both headers and rows), single/multiple row selection, built-in pagination, loading skeleton rows, and an empty state — composing `zyra-checkbox`, `zyra-pagination`, `zyra-skeleton`, and `zyra-empty-state` rather than reimplementing them.
- Added `zyra-tree-view` — a hierarchical, expandable list with unlimited nesting, single/multiple selection, per-node icons and disabled state, and the same roving-tabindex keyboard pattern as `zyra-calendar` and the app sidebar.
- Added a `calendar` icon to the shared icon set, used by `zyra-date-picker`'s trigger.

---

## [3.2.0] — 2026-07-12

### Added

- Added new form controls and input patterns including `zyra-autocomplete`, `zyra-file-upload`, `zyra-multi-select`, `zyra-slider`, and additional form field enhancements.
- Added new data-display primitives such as `zyra-calendar`, `zyra-carousel`, `zyra-code-block`, `zyra-empty-state`, and `zyra-timeline`.
- Added new overlay and feedback components including `zyra-confirm-dialog`, `zyra-drawer`, `zyra-theme-switch`, and related interactive utilities.
- Added new layout primitives such as `zyra-box`, `zyra-flex`, `zyra-grid`, `zyra-container`, `zyra-aspect-ratio`, and `zyra-scroll-area`.

### Changed

- Expanded the public API surface of `zyra-ng-ui` with a broader set of exports for actions, forms, layouts, navigation, overlays, feedback, and data-display components.
- Reorganized component files into more structured category folders for easier maintenance and clearer consumer imports.
- Refined the library package structure to present a more complete component library experience for end users.

### Fixed

- Improved library discoverability and consistency by aligning the exported components with the current component inventory and folder structure.

---

## [3.1.0] — 2026-07-12

### Added

- Expanded the library public API with new exports for layout, form, overlay, navigation, data-display, feedback, and action components.
- Added new components and modules for `zyra-button-group`, `zyra-calendar`, `zyra-carousel`, `zyra-confirm-dialog`, `zyra-drawer`, `zyra-file-upload`, `zyra-multi-select`, `zyra-slider`, `zyra-theme-switch`, `zyra-box`, `zyra-flex`, `zyra-grid`, `zyra-container`, `zyra-aspect-ratio`, and `zyra-scroll-area`.
- Added new utility-style layout primitives for more flexible composition in app UIs.

### Changed

- Reorganized the component source structure into clearer category folders such as actions, forms, layout, navigation, overlays, feedback, status, and identity.
- Updated the library surface to expose a broader and more complete set of components from a single public entry point.
- Refined component organization and export paths so consumers can import from a more consistent API.

### Fixed

- Improved component discoverability and library structure for existing consumers by aligning the public exports with the current component inventory.

---

## [3.0.0] — 2026-07-05

### Changed

- **BREAKING:** Renamed all color design tokens to a consistent `--zyra-color-*` convention (e.g. `--zyra-text` → `--zyra-color-text`, `--zyra-accent` → `--zyra-color-accent`). Structural tokens (`--zyra-radius-*`, `--zyra-space-*`, `--zyra-shadow-*`, `--zyra-ring`, etc.) are unchanged. `--zyra-accent-2`/`--zyra-accent-3` are renamed to `--zyra-color-accent-secondary`/`--zyra-color-accent-tertiary`. Consumers referencing `--zyra-*` tokens directly in their own CSS must update to the new names — see the token reference in the docs for the full mapping.

---

## [2.0.0] — 2026-07-05

### Added

- `zyra-switch`: New on/off switch component with `role="switch"`, label/labelPosition, and size variants
- Internal `ZyraIcon` component and `zyra-icons` icon set, replacing the FontAwesome dependency
- Three new themes — Ocean, Amber, Rose — alongside dark/light
- Layered design-token architecture: primitive, dimension, semantic, and component tokens

### Changed

- Theme tokens realigned across all components to the new token layers
- Accessibility pass across all components
- Boolean inputs across most components switched to `booleanAttribute`-transformed signals

### Removed

- `@fortawesome/angular-fontawesome`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons` peer dependencies

### BREAKING CHANGES

- `zyra-card`: output `cardClick` renamed to `clicked`
- `zyra-toggle`: `checked` input/model renamed to `pressed`; `label` and `labelPosition` inputs removed — use `zyra-switch` for a labeled on/off control
- `ZyraTheme` type gained `'ocean' | 'amber' | 'rose'` — exhaustive switches over this type without a `default` case will now fail to compile
- Any consumer passing custom FontAwesome icon inputs will need to migrate to the new icon system

---

## [1.7.0] — 2026-06-29

### Added

- `zyra-checkbox`: New form checkbox component with `ControlValueAccessor` support, indeterminate state, and label slot
- `zyra-radio` / `zyra-radio-group`: New radio button and group components with `ControlValueAccessor` support
- `zyra-select` / `zyra-option`: New select dropdown with custom options, multi-select, and form integration
- `zyra-skeleton`: New skeleton loader with shape presets (text, avatar, card, list, table, form) and animation modes
- `zyra-tabs` / `zyra-tab`: New tabs component with pill variant, directional slide transitions, and lazy content
- `zyra-textarea`: New textarea component with auto-resize, character count, and validation states

### Changed

- `zyra-tabs`: Added pill variant, directional slide transition, updated indicator and layout styles
- `zyra-skeleton`: Extended with rich preset shapes and configurable animation
- `zyra-checkbox`: Refined focus ring and disabled state styles
- `zyra-radio`: Refined layout and disabled state styles
- Theme tokens: Refined light and dark theme color scales and animation keyframes
- `zyra-form-field`, `zyra-modal`, `zyra-toggle`: Internal refactor for cleaner signal usage

---

## [1.6.0] — 2026-05-25

### Added

- `zyra-accordion` / `zyra-accordion-item`: New collapsible accordion component with animated expand/collapse
- `zyra-chip`: New chip component with toggle selection and `selectedChange` output

### Changed

- `zyra-form-field`: Refactored to cleaner signal-based implementation
- `zyra-modal`: Refactored lifecycle and event handling for simplicity
- `zyra-toggle`: Refactored `ControlValueAccessor` implementation

---

## [1.5.32] — 2026-05-21

### Added

- `ZyrPrefix` / `ZyrSuffix` directives — custom prefix/suffix slot content in `zyra-form-field` (any HTML: SVG, text, emoji)
- `zyra-alert`: smooth dismiss animation (fade + height collapse) via CSS keyframes
- `zyra-alert`: entry animation on mount
- `zyra-input`: `maxlength`, `min`, `max` inputs
- `zyra-toggle`: full `ControlValueAccessor` support — works with `formControl`, `formControlName`, and `ngModel`

### Fixed

- `zyra-modal`: replaced `document.body` mutation with SSR-safe `DOCUMENT` injection token
- `zyra-modal`: replaced fragile `setTimeout` focus with `afterNextRender`
- `zyra-modal`: added Tab/Shift+Tab focus trap (WCAG compliance)
- `zyra-modal`: footer buttons now have correct padding and gap
- `zyra-button`: removed `CommonModule` import and dead commented-out code
- `zyra-alert`: replaced Unicode icon characters with inline SVG for consistent cross-platform rendering
- `zyra-alert`: added `aria-live="polite"` for screen reader announcements
- `zyra-alert`: `dismissed` output now fires after animation ends, not immediately
- `zyra-chip`: `selectedChange` output now emits on toggle (was silently missing)
- `zyra-input`: `id` input now works correctly via `resolvedId` computed
- `zyra-form-field`: label `[for]` now uses `resolvedId()` to respect custom `id` input

### Changed

- `zyra-button`: `loading`, `disabled`, `fullWidth` now use `booleanAttribute` transform — attribute syntax (`<zyra-button loading>`) supported
- `zyra-alert`: `dismissible` now uses `booleanAttribute` transform

---

## [1.5.31] — 2026-05-19

### Added

- `zyra-progress`: Linear progress bar with indeterminate support
- `zyra-divider`: Horizontal and vertical separator component
- Playground pages for both components in zyra-ui

---

## [1.5.30] — 2026-05-19

### Changed

- Centralized style system: removed `_variables.scss`, introduced `_mixins.scss` and `_animations.scss`
- Removed per-component SCSS variable duplication — all tokens now flow from `_shared-theme.scss`

---

## [1.5.29] — 2026-05-09

### Fixed

- `zyra-avatar`: removed duplicate `alt` attribute and dead `hostStyle` computed
- Centralized `LIBRARY_VERSION` token in `zyra-ui` app
- Live GitHub stars display in header

---

## [1.5.28] — 2026-05-09

### Fixed

- `zyra-toast`: Added `role="region"` and `aria-live="polite"` to toast container for screen-reader support

---

## [1.5.27] — 2026-05-08

### Added

- Cyan palette tokens: `--zyr-accent`, `--zyr-accent-muted`, `--zyr-accent-border`
- Updated neutral scale across light and dark themes

---

## [1.5.0] — 2026-04-28

### Added

- `zyra-tooltip`: New component with position, maxWidth, and text inputs
- `zyra-avatar`: Profile avatar with online indicator and color variants
- `zyra-spinner`: Loading spinner with size and color variants

### Changed

- All components migrated to Angular signals (`input()`, `output()`)

---

## [1.0.0] — 2026-04-01

### Added

- `zyra-button`: Variants, sizes, loading, disabled, fullWidth, icon slots
- `zyra-badge`: Variants, sizes, dot indicator
- `zyra-card`: Variants, padding, header/footer slots, clickable
- `zyra-input`: Text input with validation states
- `zyra-toast` + `zyra-toast-container`: Notification toasts with auto-dismiss
