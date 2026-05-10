# zyra-ng-ui

[![npm version](https://img.shields.io/npm/v/zyra-ng-ui.svg)](https://www.npmjs.com/package/zyra-ng-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ramajonnada/zyra-ui/blob/main/LICENSE)

A dark-mode-first Angular component library built with design tokens, signals, and zero-runtime theming.

**[Live Playground →](https://www.zyraui.dev)**

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
import { ZyraButton, ZyraBadge, ZyraCard } from 'zyra-ng-ui';

@Component({
  imports: [ZyraButton, ZyraBadge, ZyraCard],
  template: `
    <zyra-button variant="primary" (clicked)="save()">Save</zyra-button>
    <zyra-badge variant="success" [dot]="true">Online</zyra-badge>
  `
})
export class AppComponent {}
```

---

## Components

### zyra-button

```html
<zyra-button
  variant="primary"
  size="md"
  [loading]="false"
  [disabled]="false"
  [fullWidth]="false"
  (clicked)="onClick()"
>
  Click me
</zyra-button>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `primary` \| `secondary` \| `outline` \| `ghost` \| `danger` | `primary` | Visual style |
| `size` | `sm` \| `md` \| `lg` | `md` | Button size |
| `loading` | `boolean` | `false` | Shows spinner |
| `disabled` | `boolean` | `false` | Disables interaction |
| `fullWidth` | `boolean` | `false` | Stretches to full width |

---

### zyra-badge

```html
<zyra-badge variant="success" size="md" [dot]="true">Online</zyra-badge>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `success` \| `warning` \| `danger` \| `info` \| `purple` \| `default` | `default` | Color variant |
| `size` | `sm` \| `md` \| `lg` | `md` | Badge size |
| `dot` | `boolean` | `false` | Shows status dot |

---

### zyra-card

```html
<zyra-card variant="default" padding="md" [hasHeader]="true" [hasFooter]="true" [clickable]="false" (cardClick)="onClick()">
  <div slot="header">Header</div>
  Card body content
  <div slot="footer">Footer</div>
</zyra-card>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `default` \| `elevated` \| `outlined` \| `ghost` | `default` | Card style |
| `padding` | `none` \| `sm` \| `md` \| `lg` | `md` | Inner padding |
| `hasHeader` | `boolean` | `false` | Enables header slot |
| `hasFooter` | `boolean` | `false` | Enables footer slot |
| `clickable` | `boolean` | `false` | Adds hover + pointer |

---

### zyra-input

```html
<zyra-input
  label="Email"
  placeholder="you@example.com"
  type="email"
  hint="We'll never share your email"
/>
```

---

### zyra-spinner

```html
<zyra-spinner size="md" color="accent" />
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `xs` \| `sm` \| `md` \| `lg` | `md` | Spinner size |
| `color` | `accent` \| `accent-2` \| `white` \| `current` | `accent` | Spinner color |

---

### zyra-tooltip

```html
<zyra-tooltip text="Helpful hint" position="top" maxWidth="200px">
  <zyra-button variant="secondary">Hover me</zyra-button>
</zyra-tooltip>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | `string` | — | Tooltip content |
| `position` | `top` \| `bottom` \| `left` \| `right` | `top` | Tooltip placement |
| `maxWidth` | `string` | `240px` | Max tooltip width |

---

### zyra-avatar

```html
<zyra-avatar name="Arjun Kumar" size="md" variant="teal" [online]="true" />
```

---

### zyra-toast

```typescript
import { ZyraToastService } from 'zyra-ng-ui';

export class AppComponent {
  toast = inject(ZyraToastService);

  showToast() {
    this.toast.show({ message: 'Saved!', type: 'success' });
  }
}
```

Add to your root template:

```html
<zyra-toast-container />
```

---

## Theming

All design tokens are CSS variables. Override in your global styles:

```scss
:root {
  --zyr-accent: #00c9a7;
  --zyr-radius-md: 8px;
  --zyr-font-body: 'Inter', sans-serif;
}
```

---

## Requirements

- Angular 17+
- Node 18+

---

## Links

- [Live Playground](https://www.zyraui.dev)
- [GitHub](https://github.com/ramajonnada/zyra-ui)
- [Changelog](https://github.com/ramajonnada/zyra-ui/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/ramajonnada/zyra-ui/blob/main/CONTRIBUTING.md)

## License

MIT © [Rama Jonnada](https://github.com/ramajonnada)
