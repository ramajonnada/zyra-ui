# zyra-ng-ui — Complete Visual Reference

> **npm install zyra-ng-ui** · Angular 21+ · Standalone · Signal-based · MIT

---

## Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [Theme System](#theme-system)
- [Design Tokens](#design-tokens)
- [Components](#components)
  - [ZyraButton](#zyrabutton)
  - [ZyraBadge](#zyrabadge)
  - [ZyraCard](#zyracard)
  - [ZyraAvatar](#zyraavatar)
  - [ZyraInput](#zyrainput)
  - [ZyraFormField](#zyraformfield)
  - [ZyraSpinner](#zyrespinner)
  - [ZyraToast](#zyratoast)
  - [ZyraTooltip](#zyratooltip)
- [SCSS File Structure](#scss-file-structure)
- [Public API Surface](#public-api-surface)

---

## Architecture

```
zyra-ng-ui (npm package)
│
├── Theme Layer
│   ├── ZyraThemeService      ← signal-based, reads/writes localStorage + OS pref
│   ├── provideZyra()         ← bootstrap provider, call once in app.config.ts
│   ├── ZyraConfig            ← { theme, storageKey, respectSystemTheme }
│   └── ZyraTheme             ← 'dark' | 'light'
│
├── CSS Token Layer
│   ├── _variables.scss       ← static: colors, typography, spacing, radius, z-index
│   ├── _shared-theme.scss    ← tokens shared by both themes
│   ├── _dark-theme.scss      ← [data-theme="dark"]  semantic --zyr-* tokens
│   ├── _light-theme.scss     ← [data-theme="light"] semantic --zyr-* tokens
│   └── _base.scss            ← global resets, scrollbar, font-face links
│
├── Shared Utilities
│   └── fontawesome-icons.ts  ← ZyraIcon type, zyraIcons map, asIconDefinition/asIconText
│
└── Components (all standalone, OnPush)
    ├── ZyraButton            ← Actions
    ├── ZyraBadge             ← Status
    ├── ZyraCard              ← Layout
    ├── ZyraAvatar            ← Identity
    ├── ZyraInput             ← Forms (CVA)
    ├── ZyraFormField         ← Forms (wrapper)
    ├── ZyraSpinner           ← Feedback
    ├── ZyraToast             ← Feedback  (ZyraToastService + ZyraToastItem + ZyraToastContainer)
    └── ZyraTooltip           ← Overlays
```

---

## Setup

### 1 — Install

```bash
npm install zyra-ng-ui
```

### 2 — Register provider (app.config.ts)

```ts
import { provideZyra } from 'zyra-ng-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZyra({ theme: 'dark' })   // 'light' | 'dark'
  ]
};
```

### 3 — Add styles (styles.scss)

```scss
@use 'zyra-ng-ui';
```

### 4 — Place toast container once (app.html)

```html
<zyra-toast-container />
```

### 5 — Use any component

```ts
import { ZyraButton } from 'zyra-ng-ui';

@Component({
  imports: [ZyraButton],
  template: `<zyra-button variant="primary">Save</zyra-button>`
})
```

---

## Theme System

```
provideZyra(config)
    │
    ├── ZYRA_CONFIG token  →  { theme, storageKey, respectSystemTheme }
    │
    └── ZyraThemeService (singleton)
            │
            ├── resolveInitialTheme()
            │       1. localStorage.getItem(storageKey)   ← wins if found
            │       2. window.matchMedia prefers-color-scheme  ← if respectSystemTheme
            │       3. config.theme default                 ← fallback
            │
            ├── _theme = signal<ZyraTheme>('dark' | 'light')
            │
            ├── effect() → document.documentElement.setAttribute('data-theme', theme)
            │
            └── Public API
                    .theme          readonly signal
                    .isDark         computed signal
                    .isLight        computed signal
                    .setTheme(t)    sets signal + persists to localStorage
                    .toggle()       flips dark ↔ light
```

### ZyraConfig options

| Property              | Type        | Default        | Description                         |
|-----------------------|-------------|----------------|-------------------------------------|
| `theme`               | `ZyraTheme` | `'dark'`       | Initial theme if nothing stored     |
| `storageKey`          | `string`    | `'zyra-theme'` | localStorage key                    |
| `respectSystemTheme`  | `boolean`   | `true`         | Follow OS dark/light preference     |

---

## Design Tokens

### Color Palette — Brand (SCSS variables)

| Token                  | Value      | Role               |
|------------------------|------------|--------------------|
| `$zyr-teal-400`        | `#63d2b4`  | Primary accent     |
| `$zyr-blue-400`        | `#4eaef5`  | Secondary accent   |
| `$zyr-purple-400`      | `#a78bfa`  | Tertiary accent    |
| `$zyr-red-400`         | `#f95f5f`  | Danger             |
| `$zyr-yellow-400`      | `#f9c86a`  | Warning            |
| `$zyr-green-400`       | `#4cca7c`  | Success            |

Each color has a scale: `100 → 200 → 300 → 400 → 500 → 600`

---

### Semantic CSS Tokens — Dark theme vs Light theme

| CSS Token               | Dark                   | Light             | Use for                     |
|-------------------------|------------------------|-------------------|-----------------------------|
| `--zyr-bg`              | `#080b10`              | `#f7f8fa`         | Page background             |
| `--zyr-bg-2`            | `#0d1117`              | `#ffffff`         | Card / surface background   |
| `--zyr-bg-3`            | `#13191f`              | `#eff1f5`         | Input background            |
| `--zyr-bg-4`            | `#1a2130`              | `#e5e8ee`         | Nested / subtle surfaces    |
| `--zyr-text`            | `#e8edf2`              | `#0d1117`         | Primary text                |
| `--zyr-text-muted`      | `#6b7a8d`              | `#5a6478`         | Secondary / hint text       |
| `--zyr-text-dim`        | `#3d4b5c`              | `#a0aabb`         | Disabled / placeholder      |
| `--zyr-border`          | `rgba(255,255,255,.07)`| `rgba(0,0,0,.08)` | Default borders             |
| `--zyr-accent`          | `#63d2b4`              | `#28a082`         | Primary interactive color   |
| `--zyr-accent-2`        | `#4eaef5`              | `#1a7fd4`         | Secondary interactive       |
| `--zyr-accent-3`        | `#a78bfa`              | `#7c5ce8`         | Tertiary interactive        |
| `--zyr-success`         | `#4cca7c`              | `#1e9e55`         | Success states              |
| `--zyr-warning`         | `#f9c86a`              | `#c47c10`         | Warning states              |
| `--zyr-danger`          | `#f95f5f`              | `#d63030`         | Error / danger states       |
| `--zyr-info`            | `#4eaef5`              | `#1a7fd4`         | Info states                 |
| `--zyr-card-bg`         | `#0f151c`              | `var(--zyr-bg-2)` | Card background             |
| `--zyr-input-bg`        | `var(--zyr-bg-3)`      | `var(--zyr-bg-2)` | Input background            |
| `--zyr-code-bg`         | `#0a0f15`              | `#f0f2f5`         | Code block background       |

---

### Typography

| SCSS Variable        | Value                       | Use             |
|----------------------|-----------------------------|-----------------|
| `$zyr-font-display`  | `'Syne', sans-serif`        | Headings        |
| `$zyr-font-body`     | `'Instrument Sans', sans-serif` | Body text   |
| `$zyr-font-mono`     | `'DM Mono', monospace`      | Code            |

| Size Token       | Value  |
|------------------|--------|
| `$zyr-text-xs`   | 11px   |
| `$zyr-text-sm`   | 12px   |
| `$zyr-text-base` | 14px   |
| `$zyr-text-md`   | 15px   |
| `$zyr-text-lg`   | 17px   |
| `$zyr-text-xl`   | 20px   |
| `$zyr-text-2xl`  | 24px   |
| `$zyr-text-3xl`  | 30px   |
| `$zyr-text-4xl`  | 36px   |
| `$zyr-text-5xl`  | 48px   |

---

### Spacing, Radius, Z-Index, Transitions, Breakpoints

**Spacing**

| Token            | Value |
|------------------|-------|
| `$zyr-space-1`   | 4px   |
| `$zyr-space-2`   | 8px   |
| `$zyr-space-3`   | 12px  |
| `$zyr-space-4`   | 16px  |
| `$zyr-space-5`   | 20px  |
| `$zyr-space-6`   | 24px  |
| `$zyr-space-8`   | 32px  |
| `$zyr-space-10`  | 40px  |
| `$zyr-space-12`  | 48px  |
| `$zyr-space-16`  | 64px  |
| `$zyr-space-20`  | 80px  |

**Border Radius**

| Token             | Value  |
|-------------------|--------|
| `$zyr-radius-xs`  | 4px    |
| `$zyr-radius-sm`  | 6px    |
| `$zyr-radius-md`  | 10px   |
| `$zyr-radius-lg`  | 14px   |
| `$zyr-radius-xl`  | 20px   |
| `$zyr-radius-2xl` | 28px   |
| `$zyr-radius-full`| 9999px |

**Z-Index**

| Token               | Value | Layer     |
|---------------------|-------|-----------|
| `$zyr-z-base`       | 0     | Base      |
| `$zyr-z-raised`     | 10    | Cards     |
| `$zyr-z-dropdown`   | 100   | Dropdowns |
| `$zyr-z-sticky`     | 200   | Sticky    |
| `$zyr-z-overlay`    | 300   | Overlays  |
| `$zyr-z-modal`      | 400   | Modals    |
| `$zyr-z-toast`      | 500   | Toasts    |

**Transitions**

| Token                   | Value                              |
|-------------------------|------------------------------------|
| `$zyr-transition-fast`  | `0.12s ease`                       |
| `$zyr-transition-base`  | `0.18s ease`                       |
| `$zyr-transition-slow`  | `0.3s ease`                        |
| `$zyr-transition-spring`| `0.2s cubic-bezier(.34,1.56,.64,1)`|

**Breakpoints**

| Token            | Value  |
|------------------|--------|
| `$zyr-screen-sm` | 480px  |
| `$zyr-screen-md` | 768px  |
| `$zyr-screen-lg` | 1024px |
| `$zyr-screen-xl` | 1280px |
| `$zyr-screen-2xl`| 1536px |

---

## Components

---

### ZyraButton

> **Selector:** `zyra-button` · **Category:** Actions · **Import:** `ZyraButton`

```
Inputs
  variant   ButtonVariant  'primary'   →  primary | secondary | ghost | danger | outline
  size      ButtonSize     'md'        →  sm | md | lg
  type      ButtonType     'button'    →  button | submit | reset
  loading   boolean        false
  disabled  boolean        false
  fullWidth boolean        false
  iconLeft  ZyraIcon       null        →  IconDefinition | string emoji | null
  iconRight ZyraIcon       null        →  IconDefinition | string emoji | null
  aria-label string | null null

Outputs
  clicked   MouseEvent

Computed (internal)
  hostClass   → 'zyr-btn zyr-btn--{variant} zyr-btn--{size}' + modifiers
  spinnerSize → sm→xs, md→sm, lg→md  (used internally for loading spinner)
  spinnerColor→ primary/danger → 'white', others → 'accent'
```

**Usage**

```html
<zyra-button variant="primary" size="md" (clicked)="save()">
  Save changes
</zyra-button>

<zyra-button variant="ghost" [loading]="isSaving" [disabled]="!form.valid">
  Submit
</zyra-button>
```

---

### ZyraBadge

> **Selector:** `zyra-badge` · **Category:** Status · **Import:** `ZyraBadge`

```
Inputs
  variant   BadgeVariant  'default'  →  success | warning | danger | info | purple | default
  size      BadgeSize     'md'       →  sm | md | lg
  dot       boolean       false      →  shows a live indicator dot
  ariaLabel string        ''

Computed (internal)
  hostClass → 'zyr-badge zyr-badge--{variant} zyr-badge--{size}'
```

**Usage**

```html
<zyra-badge variant="success" [dot]="true">Active</zyra-badge>
<zyra-badge variant="warning" size="sm">Pending</zyra-badge>
```

---

### ZyraCard

> **Selector:** `zyra-card` · **Category:** Layout · **Import:** `ZyraCard`

```
Inputs
  variant    CardVariant   'default'  →  default | outlined | elevated | ghost
  padding    CardPadding   'md'       →  none | sm | md | lg
  clickable  boolean       false      →  enables hover states + click output
  hasHeader  boolean       false      →  renders header slot
  hasFooter  boolean       false      →  renders footer slot

Outputs
  cardClick  void          (only fires when clickable=true)

Slots (ng-content)
  [slot="header"]   →  header area
  (default)         →  body content
  [slot="footer"]   →  footer area
```

**Usage**

```html
<zyra-card [hasHeader]="true" [hasFooter]="true" padding="lg">
  <div slot="header">Title</div>
  <p>Body content goes here</p>
  <div slot="footer">
    <zyra-button variant="primary" size="sm">Action</zyra-button>
  </div>
</zyra-card>
```

---

### ZyraAvatar

> **Selector:** `zyra-avatar` · **Category:** Identity · **Import:** `ZyraAvatar`

```
Inputs
  name     string         ''      →  used to generate initials
  src      string         ''      →  image URL (falls back to initials on error)
  size     AvatarSize     'md'    →  xs | sm | md | lg | xl
  variant  AvatarVariant  'teal'  →  teal | blue | purple | warm | neutral
  online   boolean | null  null   →  null=hidden, true=green dot, false=grey dot
  square   boolean        false   →  rounded-square instead of circle

Computed (internal)
  initials   →  1 word → first 2 chars, 2+ words → first+last initial
  ariaLabel  →  'Avatar for {name}' or 'Avatar'
  hostClass  →  'zyr-avatar zyr-avatar--{size} zyr-avatar--{variant}'
```

**Usage**

```html
<zyra-avatar name="Ava Patel" size="lg" variant="purple" [online]="true" />
<zyra-avatar src="/team/john.jpg" name="John Doe" size="md" />
```

---

### ZyraInput

> **Selector:** `zyra-input` · **Category:** Forms · **Import:** `ZyraInput`
> Implements `ControlValueAccessor` — works with both template-driven and reactive forms.

```
Inputs
  type         InputType   'text'   →  text | email | password | number | search | tel | url
  size         InputSize   'md'     →  sm | md | lg
  placeholder  string      ''
  readonly     boolean     false
  id           string      ''       →  auto-generated if not provided (zyra-input-N)

Outputs
  valueChange  string      →  emits on every keystroke
  focused      void        →  emits on focus
  blurred      void        →  emits on blur

Internal signals (read by ZyraFormField)
  innerValue    signal<string>   current value
  isFocused     signal<boolean>
  isTouched     signal<boolean>
  isDisabled    signal<boolean>
  showPassword  signal<boolean>  (password toggle)

Public methods (called by ZyraFormField)
  .clear()           → resets value to ''
  .togglePassword()  → flips showPassword signal
  .ngControl         → exposes NgControl for validation state
```

**Usage — standalone**

```html
<zyra-input type="email" placeholder="name@co.com" (valueChange)="onEmail($event)" />
```

**Usage — reactive form**

```ts
form = new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]) });
```
```html
<zyra-input type="email" [formControl]="form.controls.email" />
```

---

### ZyraFormField

> **Selector:** `zyra-form-field` · **Category:** Forms · **Import:** `ZyraFormField`
> Wraps a `<zyra-input>` child via `@ContentChild`.

```
Inputs
  label        string               ''        →  visible label text
  hint         string               ''        →  helper text below input
  successHint  string               ''        →  shown when field is valid + touched
  prefixIcon   ZyraIcon             ''        →  icon or emoji on left side
  suffixIcon   ZyraIcon             ''        →  icon or emoji on right side
  appearance   FormFieldAppearance  'outline' →  outline | filled | underline
  size         FormFieldSize        'md'      →  sm | md | lg
  maxLength    number | null        null      →  shows character counter
  clearButton  boolean              false     →  shows × to clear input
  loading      boolean              false     →  shows spinner in suffix area

Auto-detected from ZyraInput child
  isFocused     boolean
  isTouched     boolean
  isDisabled    boolean
  isPassword    boolean  → auto-shows password toggle button
  currentLength number   → used with maxLength for counter
  hasValue      boolean

Validation state (reads child NgControl)
  showError     →  ctrl.invalid && (ctrl.touched || isTouched)
  showSuccess   →  ctrl.valid && touched && hasValue
  isPending     →  ctrl.pending (async validators)
  errorMessage  →  mapped from ValidationErrors:
                    required | email | minlength | maxlength | min | max | pattern | custom

Status (drives border/glow)
  'default' | 'focused' | 'success' | 'error' | 'disabled'
```

**Usage**

```html
<zyra-form-field
  label="Email"
  hint="We'll never share your email."
  [clearButton]="true"
  [maxLength]="80"
>
  <zyra-input type="email" [formControl]="emailCtrl" />
</zyra-form-field>
```

---

### ZyraSpinner

> **Selector:** `zyra-spinner` · **Category:** Feedback · **Import:** `ZyraSpinner`
> Also used internally by `ZyraButton` and `ZyraFormField`.

```
Inputs
  size   SpinnerSize   'md'     →  xs(12px) | sm(16px) | md(24px) | lg(36px)
  color  SpinnerColor  'accent' →  accent | accent-2 | white | current
  label  string        'Loading…'  →  aria-label for screen readers
```

**Usage**

```html
<zyra-spinner size="lg" color="accent" label="Loading dashboard" />
```

---

### ZyraToast

> **Category:** Feedback
> Three exports work together: `ZyraToastService` + `ZyraToastContainer` + `ZyraToastItem`

```
ZyraToastService  (Injectable, providedIn: 'root')
│
├── toasts  readonly signal<Toast[]>   ← the live list
│
├── .success(title, opts?)
├── .error(title, opts?)
├── .warning(title, opts?)
├── .info(title, opts?)
├── .dismiss(id)
└── .dismissAll()

Toast shape
  id          string         auto-generated
  variant     ToastVariant   success | error | warning | info | default
  title       string
  description string         default ''
  duration    number (ms)    default 4000  →  0 = persistent

ZyraToastContainer  (place once in AppComponent)
  selector: zyra-toast-container
  reads:    ZyraToastService.toasts()
  renders:  one <zyra-toast-item> per toast

ZyraToastItem  (internal, rendered by container)
  input: toast (required)
  auto-selects icon by variant
  dismiss on click
```

**Usage**

```ts
// In any component:
private toast = inject(ZyraToastService);

save() {
  this.toast.success('Saved!', { description: 'Changes are live.', duration: 3000 });
}

// Persistent toast:
this.toast.error('Upload failed', { duration: 0 });
```

```html
<!-- In app.html (once) -->
<zyra-toast-container />
```

---

### ZyraTooltip

> **Selector:** `zyra-tooltip` · **Category:** Overlays · **Import:** `ZyraTooltip`

```
Inputs
  text      string          ''      →  tooltip label text
  position  TooltipPosition 'top'   →  top | bottom | left | right
  maxWidth  string          '200px' →  CSS max-width of tooltip bubble

Internal state
  visible   signal<boolean>  false  →  toggled on mouseenter / focus

Computed
  tooltipClass → 'zyr-tooltip zyr-tooltip--{position}'
```

**Usage**

```html
<zyra-tooltip text="Copy code" position="top">
  <zyra-button variant="secondary" size="sm">
    <fa-icon [icon]="icons.copy" />
  </zyra-button>
</zyra-tooltip>
```

---

## SCSS File Structure

```
projects/zyra-ng-ui/src/lib/styles/
│
├── index.scss          ←  entry: @forward variables, @use shared+base, @forward themes
├── _variables.scss     ←  STATIC: brand palette, typography, spacing, radius, z-index, transitions, breakpoints
├── _shared-theme.scss  ←  tokens shared across both themes (font stacks, animations)
├── _dark-theme.scss    ←  [data-theme="dark"] + :root  →  semantic --zyr-* tokens
├── _light-theme.scss   ←  [data-theme="light"]         →  semantic --zyr-* tokens
└── _base.scss          ←  global resets, font-face loading, scrollbar, box-sizing
```

**How themes are applied**

```
ZyraThemeService.applyToDom('dark')
    → document.documentElement.setAttribute('data-theme', 'dark')
        → CSS picks up [data-theme="dark"] block from _dark-theme.scss
            → all --zyr-* tokens resolve to dark values
```

---

## Public API Surface

Everything exported from `public-api.ts`:

```ts
// Theme
export { ZyraTheme, ZyraConfig, ZYRA_CONFIG }  from './lib/theme/theme-type';
export { ZyraThemeService }                     from './lib/theme/theme-service';
export { provideZyra }                          from './lib/theme/provide-zyra';

// Components
export { ZyraButton, ButtonVariant, ButtonSize, ButtonType }   from './lib/components/zyra-button/zyra-button';
export { ZyraCard, CardVariant, CardPadding }                  from './lib/components/zyra-card/zyra-card';
export { ZyraBadge, BadgeVariant, BadgeSize }                  from './lib/components/zyra-badge/zyra-badge';
export { ZyraAvatar, AvatarSize, AvatarVariant }               from './lib/components/zyra-avatar/zyra-avatar';
export { ZyraInput, InputType, InputSize }                     from './lib/components/zyra-input/zyra-input';
export { ZyraFormField, FormFieldAppearance, FormFieldSize }    from './lib/components/zyra-form-field/zyra-form-field';
export { ZyraSpinner, SpinnerSize, SpinnerColor }              from './lib/components/zyra-spinner/zyra-spinner';
export { ZyraToastService, ZyraToastContainer,
         ZyraToastItem, Toast, ToastVariant }                  from './lib/components/zyra-toast/zyra-toast';
export { ZyraTooltip, TooltipPosition }                        from './lib/components/zyra-tooltip/zyra-tooltip';
```

---

## Quick Component Cheat Sheet

| Component            | Selector               | Key Inputs                             | Key Outputs   |
|----------------------|------------------------|----------------------------------------|---------------|
| `ZyraButton`         | `zyra-button`          | variant, size, loading, disabled, iconLeft/Right | clicked |
| `ZyraBadge`          | `zyra-badge`           | variant, size, dot                     | —             |
| `ZyraCard`           | `zyra-card`            | variant, padding, clickable, hasHeader, hasFooter | cardClick |
| `ZyraAvatar`         | `zyra-avatar`          | name, src, size, variant, online, square | —           |
| `ZyraInput`          | `zyra-input`           | type, size, placeholder, readonly      | valueChange, focused, blurred |
| `ZyraFormField`      | `zyra-form-field`      | label, hint, appearance, prefixIcon, suffixIcon, clearButton, maxLength, loading | — |
| `ZyraSpinner`        | `zyra-spinner`         | size, color, label                     | —             |
| `ZyraToastContainer` | `zyra-toast-container` | —                                      | —             |
| `ZyraTooltip`        | `zyra-tooltip`         | text, position, maxWidth               | —             |
