# Changelog

All notable changes to `zyra-ng-ui` are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

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
