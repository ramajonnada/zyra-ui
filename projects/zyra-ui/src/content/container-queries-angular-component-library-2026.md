---
title: "Container Queries in Angular: Build Truly Responsive Components"
description: "CSS Container Queries let Angular components respond to their own space, not the viewport. Use :host, @container, and cqi units in standalone components."
category:
    - "Angular 21"
tags:
    - "angular"
    - "css"
    - "container-queries"
    - "component-library"
    - "responsive-design"
keywords:
    - "CSS container queries Angular"
    - "Angular responsive components"
    - "container-type inline-size Angular"
    - "Angular component library responsive"
    - "replace BreakpointObserver container queries"
date: "2026-08-05T10:00:00.000Z"
slug: "container-queries-angular-component-library-2026"
---

# Container Queries in Angular Component Libraries: Build Truly Responsive Components

> **TL;DR:** Media queries answer "how wide is the browser window" — useless for component library authors. CSS Container Queries answer "how much space does this component actually have." This post shows how to wire container queries into Angular standalone components using `:host`, use container query units (`cqi`, `cqw`) for fluid sizing, and replace `BreakpointObserver` for layout-level responsiveness.

---

If you maintain an Angular UI component library, you've hit this wall. You build a responsive card that stacks at small widths and goes side-by-side at larger ones. It passes every demo you run. Then a consumer drops it into a two-column dashboard — a 300px sidebar and a 900px main panel — on a 1440px screen. The viewport is wide, your media query never fires, and the card in the sidebar overflows or clips its content.

The media query did exactly what it was told. The viewport is wide. That's the problem.

---

## The Viewport Gap: Why Media Queries Fail Component Libraries

Consider a standard Angular card component:

```scss
.card {
  display: grid;
  grid-template-columns: 1fr; /* stacked by default */

  @media (min-width: 600px) {
    grid-template-columns: auto 1fr; /* side-by-side on wide screens */
  }
}
```

This works when your component occupies the full viewport width. It breaks the moment a consumer places it in a constrained column, a sidebar, a widget container, or a CSS grid cell. The viewport is still 1440px, so the wide layout fires — inside a 280px column.

Media queries are the right tool for page-level layout decisions. They are the wrong tool for component-level layout decisions. The two have been conflated for years because there was no alternative. There is now.

---

## CSS Container Queries: The Component-Level Answer

CSS Container Queries let an element react to the size of its **own containing box**, not the viewport. They have shipped in all major browsers since 2022 (Chrome 105, Firefox 110, Safari 16) and have no significant compatibility gaps as of 2026. The [MDN CSS Container Queries documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) covers the full specification.

### Declaring a container

Any element can become a container by setting `container-type`:

```scss
.card-wrapper {
  container-type: inline-size;
}
```

`inline-size` means the container tracks its width along the inline axis. Once declared, descendant elements can use `@container` blocks to write layout rules that fire based on the container's measured width:

```scss
.card {
  display: grid;
  grid-template-columns: 1fr; /* stacked: mobile-first */

  @container (min-width: 400px) {
    grid-template-columns: auto 1fr; /* side-by-side when container is wide enough */
  }
}
```

Now the card stacks in a 300px sidebar and goes side-by-side in a 900px main panel — on the exact same viewport. The breakpoint fires on the component's available space, not the screen.

### Named containers

When you nest components that each declare containment, you can use container names to target a specific ancestor:

```scss
.dashboard {
  container: dashboard / inline-size;
}

.sidebar {
  container: sidebar / inline-size;
}

/* Query a specific named ancestor, skipping intermediate containers */
.card {
  @container dashboard (min-width: 800px) {
    font-size: 1.125rem;
  }
}
```

Named containers are useful in component libraries where multiple containment boundaries may stack between the component and the element doing the querying.

### Container query units

Once an element has an established container, you can size things relative to that container using `cq` units:

| Unit | Meaning |
|------|---------|
| `cqw` | 1% of container width |
| `cqh` | 1% of container height |
| `cqi` | 1% of container inline size (equals `cqw` in horizontal writing modes) |
| `cqb` | 1% of container block size |
| `cqmin` | Smaller of `cqi` and `cqb` |
| `cqmax` | Larger of `cqi` and `cqb` |

Combining `cqi` with `clamp()` gives you fluid typography that scales with the component's own width:

```scss
.card__title {
  /* Scales from 1rem to 1.5rem based on container width, never below or above */
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

This is strictly more useful than viewport-relative `vw` for components that appear in different layout contexts.

---

## Wiring Container Queries into Angular Standalone Components

Angular adds one complication: **View Encapsulation**. The default `Emulated` mode adds a unique attribute to the host element (`_nghost-xxx`) and scopes descendant styles with `_ngcontent-xxx` attributes. You need to know where to declare containment so Angular's scoping doesn't interfere.

### The `:host` pattern

Declare `container-type` on the `:host` pseudo-element. Angular compiles `:host` to the component's actual DOM element — the cleanest containment boundary for a component:

```scss
/* zyra-card.component.scss */

:host {
  display: block; /* required — :host is inline by default; inline-size needs a block box */
  container-type: inline-size;
}

.card {
  padding: var(--zyra-space-4);
  background: var(--zyra-color-surface);
  border: 1px solid var(--zyra-color-border-color);
  border-radius: var(--zyra-radius-md);

  @container (min-width: 480px) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--zyra-space-4);
  }
}

.card__image {
  width: clamp(80px, 25cqi, 160px);
  border-radius: var(--zyra-radius-sm);
  object-fit: cover;
}

.card__title {
  font-size: clamp(1rem, 4cqi, 1.25rem);
  font-weight: 600;
  color: var(--zyra-color-foreground);
}

.card__subtitle {
  font-size: 0.875rem;
  color: var(--zyra-color-foreground-muted);
  margin-top: var(--zyra-space-1);
}
```

The component TypeScript stays clean — no JavaScript involved in layout:

```typescript
// zyra-card.component.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'zyra-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './zyra-card.component.html',
  styleUrl: './zyra-card.component.scss',
})
export class ZyraCardComponent {
  title = input<string>('');
  subtitle = input<string>('');
  imageUrl = input<string>('');
}
```

```html
<!-- zyra-card.component.html -->
<div class="card">
  @if (imageUrl()) {
    <img class="card__image" [src]="imageUrl()" [alt]="title()" />
  }
  <div class="card__body">
    <h3 class="card__title">{{ title() }}</h3>
    @if (subtitle()) {
      <p class="card__subtitle">{{ subtitle() }}</p>
    }
    <ng-content />
  </div>
</div>
```

No `BreakpointObserver`. No signals driving a layout class. No subscription to clean up. The card adapts to whatever space its consumer gives it.

### ViewEncapsulation.None

If your library uses `ViewEncapsulation.None` to eliminate Angular's scoping attributes, `:host` still works. Alternatively, scope using the element selector:

```scss
/* ViewEncapsulation.None — scope with element selector instead of :host */
zyra-card {
  display: block;
  container-type: inline-size;
}

zyra-card .card {
  @container (min-width: 480px) {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

Either approach is valid. The `:host` form is more portable and works regardless of encapsulation mode.

---

## Replacing BreakpointObserver for Component Layout

Angular CDK's `BreakpointObserver` is the go-to tool for responsive logic in TypeScript:

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isNarrow()) {
      <div class="card--stacked">...</div>
    } @else {
      <div class="card--wide">...</div>
    }
  `,
})
export class CardComponent {
  private breakpoints = inject(BreakpointObserver);

  isNarrow = toSignal(
    this.breakpoints
      .observe(Breakpoints.Handset)
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );
}
```

This pattern has real costs when used for layout:

- Fires on viewport width, not component available width — wrong observable for the job
- Adds an RxJS subscription and cleanup lifecycle
- Pushes layout decisions into TypeScript, where they're harder to override or extend
- Renders differently in SSR without extra handling

Container queries eliminate all of this for the layout use case. **Reserve `BreakpointObserver` for decisions that genuinely require device-class knowledge. For other modern CSS techniques in Angular libraries, see [CSS @layer in Angular Component Libraries](/blog/css-layer-angular-component-library-2026) and [CSS Anchor Positioning](/blog/css-anchor-positioning-angular-tooltips-2026).** — loading different asset resolutions, disabling features on small screens, triggering route-level behavior. For "should this component show a stacked or side-by-side layout," pure CSS is the right layer.

---

## A Complete Example: Responsive Stat Card

Here is a production-ready stat card that adapts its own layout and typography with no JavaScript:

```typescript
// zyra-stat-card.component.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'zyra-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat">
      <div class="stat__icon">
        <ng-content select="[icon]" />
      </div>
      <div class="stat__content">
        <span class="stat__value">{{ value() }}</span>
        <span class="stat__label">{{ label() }}</span>
        @if (trend() !== undefined) {
          <span
            class="stat__trend"
            [class.stat__trend--positive]="trend()! > 0"
            [class.stat__trend--negative]="trend()! < 0"
          >
            {{ trend()! > 0 ? '+' : '' }}{{ trend() }}%
          </span>
        }
      </div>
    </div>
  `,
  styleUrl: './zyra-stat-card.component.scss',
})
export class ZyraStatCardComponent {
  value = input.required<string | number>();
  label = input.required<string>();
  trend = input<number>();
}
```

```scss
// zyra-stat-card.component.scss

:host {
  display: block;
  container-type: inline-size;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--zyra-space-3);
  padding: var(--zyra-space-4);
  background: var(--zyra-color-surface);
  border: 1px solid var(--zyra-color-border-color);
  border-radius: var(--zyra-radius-md);

  @container (min-width: 220px) {
    flex-direction: row;
    align-items: center;
  }
}

.stat__icon {
  flex-shrink: 0;
  width: clamp(2rem, 10cqi, 3rem);
  height: clamp(2rem, 10cqi, 3rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--zyra-radius-sm);
  background: var(--zyra-color-primary-subtle);
  color: var(--zyra-color-primary);
}

.stat__value {
  font-size: clamp(1.25rem, 8cqi, 2rem);
  font-weight: 700;
  color: var(--zyra-color-foreground);
  line-height: 1;
}

.stat__label {
  font-size: clamp(0.75rem, 3.5cqi, 0.875rem);
  color: var(--zyra-color-foreground-muted);
  margin-top: var(--zyra-space-1);
}

.stat__trend {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: var(--zyra-space-1) var(--zyra-space-2);
  border-radius: var(--zyra-radius-sm);
}

.stat__trend--positive {
  background: var(--zyra-color-success-subtle);
  color: var(--zyra-color-on-success);
}

.stat__trend--negative {
  background: var(--zyra-color-danger-subtle);
  color: var(--zyra-color-on-danger);
}
```

Place this component in a four-column grid or a narrow sidebar — it reads its own container width, adjusts the flex direction at 220px, and scales the icon and value text fluidly using `cqi` units. Zero JavaScript, zero event listeners.

---

## Wrapping Up

Container queries give component library authors something media queries never could: a component that honestly knows its own available space. With `container-type: inline-size` on `:host` and `@container` breakpoints in your SCSS, Angular components become genuinely self-contained — consumers can place them anywhere and the internals adapt without touching TypeScript. Pick one layout-sensitive component in your library and convert it today. Once you see how much conditional logic disappears, you'll keep going.

---

## Frequently Asked Questions

### Do container queries work with Angular's default View Encapsulation?

Yes. With `Emulated` encapsulation (the default), declare `container-type` on `:host`. Angular renders `:host` as the component's actual DOM element, so the encapsulation attribute is applied to the same node that holds the container context. `@container` blocks inside the component's SCSS work exactly as expected. With `ViewEncapsulation.None`, scope your container declaration using the element selector (e.g. `zyra-card { container-type: inline-size; }`) instead of `:host`.

### Why does `container-type: inline-size` require `display: block` on `:host`?

Angular's `:host` defaults to `display: inline` because custom elements are inline by default in HTML. An inline box has no definitive width to measure for `inline-size` containment. Setting `display: block` (or `flex`, `grid`) on `:host` gives the element a block formatting context so the browser has a real width to report to `@container` queries.

### What is the difference between `container-type: inline-size` and `container-type: size`?

`inline-size` tracks only the element's inline dimension (width in horizontal writing modes). `size` tracks both width and height. Use `inline-size` in almost every case — tracking height requires the container to have a constrained height, which most component wrappers don't. `inline-size` also has fewer layout side effects and composes more predictably when containment contexts nest.

### Should I still use BreakpointObserver at all?

Yes, but for the right problems. `BreakpointObserver` is the correct tool when your logic depends on the actual device class — loading smaller images on Handset, disabling a drag-and-drop feature on touch devices, or triggering different routing behavior. It is the wrong tool for "should this card stack vertically or horizontally" — that decision belongs entirely in CSS, and container queries handle it without the subscription overhead.

---

**Related reading:**
- [CSS @layer in Angular Component Libraries: Take Control of the Cascade](/blog/css-layer-angular-component-library-2026)
- [CSS Anchor Positioning for Angular Tooltips](/blog/css-anchor-positioning-angular-tooltips-2026)
- [Angular SSR & SEO in 2026: Core Web Vitals Done Right](/blog/angular-ssr-seo-2026-core-web-vitals-component-library)
- [Angular @defer Blocks: Lazy Load Any Component Instantly](/blog/angular-defer-blocks-lazy-loading-2026)
- [MDN CSS Container Queries documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
