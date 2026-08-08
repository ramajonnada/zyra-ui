# Zyra UI

[![CI](https://github.com/ramajonnada/zyra-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ramajonnada/zyra-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/zyra-ng-ui.svg)](https://www.npmjs.com/package/zyra-ng-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A signals-first Angular component library with token-driven, zero-runtime theming — 60+
components, five built-in themes, WCAG AA accessible, SSR-ready.

**[Live Playground →](https://www.zyraui.dev)**

---

## Features

- **Angular 21+ signals-first** — every component uses `input()`, `output()`, `signal()`, `computed()`
- **60+ production-ready components** — forms, data display, overlays, navigation, layout, utilities
- **Five built-in themes** — dark, light, ocean, amber, rose — swappable at runtime via `ZyraThemeService`
- **Token-driven theming** — a layered `--zyra-*` custom-property system; override the semantic
  layer to re-theme without touching component internals
- **Standalone components** — no NgModules, just import what you need
- **Tree-shakeable** — only ship what you use
- **SSR + zoneless-compatible**
- **WCAG 2.1 AA accessible** — keyboard nav, focus rings, ARIA roles built in

---

## Components

60+ components across Forms, Data Display, Overlays/Feedback, Navigation, Layout, and Utilities —
see the full, always-current catalog at **[zyraui.dev/components](https://www.zyraui.dev/components)**
or `projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts` in this repo.

---

## Installation

```bash
npm install zyra-ng-ui
```

No required peer dependencies beyond Angular itself (`@angular/core`, `@angular/common`,
`@angular/forms` ^21).

### Import styles

In your `styles.scss`:

```scss
@use 'zyra-ng-ui/styles';
```

This pulls in all five themes. To ship only the themes you use, import them individually instead
— see [docs/THEME_SYSTEM.md](docs/THEME_SYSTEM.md).

---

## Quick Start

```typescript
import { Component } from '@angular/core';
import { ApplicationConfig } from '@angular/core';
import { provideZyra, ZyraButton, ZyraBadge } from 'zyra-ng-ui';

// app.config.ts
export const appConfig: ApplicationConfig = {
    providers: [provideZyra({ theme: 'dark', respectSystemTheme: false })],
};

// some.component.ts
@Component({
    imports: [ZyraButton, ZyraBadge],
    template: `
        <zyra-button variant="primary" (clicked)="onClick()">Get Started</zyra-button>
        <zyra-badge variant="success" [dot]="true">Online</zyra-badge>
    `,
})
export class SomeComponent {
    onClick() {}
}
```

---

## Theming

Component styles consume a layered `--zyra-*` token system (primitive → dimension → semantic →
component tier) — override the **semantic** tier to re-theme without touching per-theme internals:

```scss
:root {
    --zyra-color-primary: #your-brand-color;
    --zyra-radius-md: 8px;
}
```

See [docs/THEME_SYSTEM.md](docs/THEME_SYSTEM.md) for the full tier breakdown and
[docs/TOKENS.md](docs/TOKENS.md) for the token reference.

---

## Monorepo Structure

```
projects/
  zyra-ng-ui/     ← publishable Angular library (npm: zyra-ng-ui)
  zyra-ui/        ← marketing site + component playground (zyraui.dev)
```

Paid-tier (Phase 2 / Pro) components are developed in a separate private repo, `zyra-ui-pro` — see
[docs/PHASE2_LAUNCH_CHECKLIST.md](docs/PHASE2_LAUNCH_CHECKLIST.md) for why.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and branch workflow.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT © [Rama Jonnada](https://github.com/ramajonnada)
