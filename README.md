# Zyra UI

[![CI](https://github.com/ramajonnada/zyra-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ramajonnada/zyra-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/zyra-ng-ui.svg)](https://www.npmjs.com/package/zyra-ng-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A dark-mode-first Angular component library built with design tokens, signals, and zero-runtime theming.

**[Live Playground →](https://www.zyraui.dev)**

---

## Features

- **Angular 21+ signals-first** — every component uses `input()`, `output()`, `signal()`, `computed()`
- **Design-token theming** — swap the entire look with one CSS variable file
- **Dark-mode first** — designed in the dark, perfected in the light
- **Standalone components** — no NgModules, just import what you need
- **Tree-shakeable** — only ship what you use
- **WCAG 2.1 AA accessible** — keyboard nav, focus rings, ARIA labels built in

---

## Components

| Component | Selector | Description |
|-----------|----------|-------------|
| Button | `zyra-button` | Variants, sizes, loading, icons |
| Badge | `zyra-badge` | Status labels with dot indicator |
| Card | `zyra-card` | Content containers with slots |
| Input | `zyra-input` | Text input with validation states |
| Spinner | `zyra-spinner` | Loading indicator |
| Toast | `zyra-toast` | Notification toasts |
| Tooltip | `zyra-tooltip` | Hover tooltips with positioning |
| Avatar | `zyra-avatar` | Profile avatars with online indicator |
| Form Field | `zyra-form-field` | Label + input + hint wrapper |

---

## Installation

```bash
npm install zyra-ng-ui
```

### Peer dependencies

```bash
npm install @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

### Import styles

In your `styles.scss`:

```scss
@import 'zyra-ng-ui/styles';
```

---

## Quick Start

```typescript
import { ZyraButton, ZyraBadge } from 'zyra-ng-ui';

@Component({
  imports: [ZyraButton, ZyraBadge],
  template: `
    <zyra-button variant="primary" (clicked)="onClick()">
      Get Started
    </zyra-button>

    <zyra-badge variant="success" [dot]="true">Online</zyra-badge>
  `
})
export class AppComponent {
  onClick() {}
}
```

---

## Theming

All colors, spacing, and radii are CSS variables. Override them in your global styles:

```scss
:root {
  --zyr-accent: #your-brand-color;
  --zyr-radius-md: 8px;
}
```

---

## Monorepo Structure

```
projects/
  zyra-ng-ui/     ← publishable Angular library (npm)
  zyra-ui/        ← marketing site + component playground
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and branch workflow.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT © [Rama Jonnada](https://github.com/ramajonnada)
