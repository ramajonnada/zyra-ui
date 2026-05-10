# Changelog

All notable changes to `zyra-ng-ui` are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

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
