---
title: 'Angular @defer Blocks: Lazy Load Any Component Instantly'
description: "Learn Angular's @defer block: lazy load components with on viewport, on interaction, and signal-driven when triggers to ship lighter bundles in 2026."
category:
    - 'Angular'
    - 'Angular 21'
tags:
    - 'angular defer'
    - 'angular lazy loading'
    - 'angular 21'
    - 'angular performance'
    - 'defer blocks'
    - 'angular templates'
    - 'code splitting'
keywords:
    - 'Angular defer blocks'
    - 'Angular lazy loading components'
    - 'Angular @defer tutorial'
    - '@defer on viewport'
    - 'Angular deferred loading 2026'
date: '2026-06-29T10:00:00.000Z'
slug: 'angular-defer-blocks-lazy-loading-2026'
---

# Angular @defer Blocks: Lazy Load Any Component Instantly

> **TL;DR:** Angular's `@defer` block lazily loads any component, directive, or pipe in your template with zero manual dynamic imports. Combine it with triggers like `on viewport`, `on interaction`, and `on idle` to ship lighter initial bundles, render critical content first, and only load heavy UI when it's actually needed.

Every Angular app has the same problem: you bundle everything, ship it all up front, and pay the load-time cost even for content the user might never see. Modals, comment sections, rich text editors, data-heavy tables — they all inflate your initial bundle and slow down your first paint.

Angular's `@defer` blocks solve this at the template level. No manual `import()` calls. No route-level splitting hacks. Just annotate your template and Angular handles the rest.

---

## What is @defer?

`@defer` is a built-in Angular template block (stable since Angular 17, widely used in Angular 21) that wraps part of your template and tells the Angular compiler to lazy load its dependencies as a separate chunk.

```html
@defer {
<app-comments />
}
```

That single block causes `AppCommentsComponent` — and everything it imports — to be split into its own JavaScript chunk. Angular downloads and renders it only when the defer condition is met.

---

## The four blocks

A full `@defer` group has four optional blocks:

```html
@defer (on viewport) {
<!-- rendered when deps are loaded and trigger fires -->
<app-heavy-chart />
} @loading (minimum 200ms) {
<!-- shown while the chunk is downloading -->
<app-skeleton height="300px" />
} @placeholder (minimum 100ms) {
<!-- shown immediately before the trigger fires -->
<div class="chart-placeholder"></div>
} @error {
<!-- shown if the chunk fails to load -->
<p>Failed to load chart. <button (click)="retry()">Retry</button></p>
}
```

| Block          | When it shows                                |
| -------------- | -------------------------------------------- |
| `@placeholder` | Before the trigger fires — shown immediately |
| `@loading`     | While the JS chunk is being fetched          |
| `@defer`       | After the chunk loads and renders            |
| `@error`       | If the chunk fetch fails                     |

The `minimum` parameter prevents flash-of-loading-state: the loading/placeholder blocks stay visible for at least that many milliseconds even if the chunk arrives faster.

---

## Triggers

Triggers control _when_ Angular fetches the deferred chunk. You can have multiple triggers on one block using `on`.

### on viewport

Downloads and renders when the placeholder scrolls into the viewport. Ideal for below-the-fold content.

```html
@defer (on viewport) {
<app-testimonials />
} @placeholder {
<div style="height: 400px"></div>
}
```

The placeholder must have visible dimensions so the browser can detect when it enters the viewport. A zero-height placeholder will trigger immediately.

### on interaction

Loads on the first click, focus, or touch of the placeholder. Use this for components that only matter when the user engages — a comment editor, a rich tooltip, a share dialog.

```html
@defer (on interaction) {
<app-comment-editor />
} @placeholder {
<button class="comment-trigger">Write a comment…</button>
}
```

### on idle

Loads during the browser's next idle period (via `requestIdleCallback`). Good for non-critical widgets — analytics dashboards, recommendation carousels — that improve the page but don't block any user flow.

```html
@defer (on idle) {
<app-recommendation-carousel />
}
```

### on timer

Loads after a fixed delay. Use sparingly — prefer `on idle` unless you need precise timing.

```html
@defer (on timer(3s)) {
<app-cookie-banner />
}
```

### on immediate

Loads as soon as possible after the critical content renders. Effectively the next microtask after the view initializes. Useful when you want lazy loading for bundle-splitting benefits but don't want to wait for a user action.

```html
@defer (on immediate) {
<app-secondary-sidebar />
}
```

### when (conditional trigger)

A `when` expression triggers loading when a boolean expression becomes truthy. Combine with signals for reactive control:

```html
@defer (when showEditor()) {
<app-rich-editor />
} @placeholder {
<div class="editor-placeholder">Click to edit</div>
}
```

```ts
showEditor = signal(false);

openEditor() {
  this.showEditor.set(true);
}
```

---

## Prefetching

Defer by default waits for the trigger to fire before even starting the network request. `prefetch` separates the download from the render: download the chunk early, render it later.

```html
@defer (on interaction; prefetch on idle) {
<app-modal-content />
} @placeholder {
<button (click)="openModal()">Open</button>
}
```

Here the chunk downloads during idle time, so when the user clicks, rendering is instant — no network wait.

Common combos:

```html
<!-- Download on idle, render when user clicks -->
@defer (on interaction; prefetch on idle) { ... }

<!-- Download on hover/focus area, render on viewport -->
@defer (on viewport; prefetch on idle) { ... }
```

---

## Combining @defer with signals

`@defer` and signals compose naturally. Signal state controls `when` triggers, and components inside `@defer` work with signals exactly as outside.

```ts
@Component({
    template: `
        <button (click)="loadChart.set(true)">Show Chart</button>

        @defer (when loadChart()) {
            <app-analytics-chart [data]="chartData()" />
        } @loading {
            <app-skeleton />
        }
    `,
})
export class DashboardComponent {
    loadChart = signal(false);
    chartData = signal<ChartData | null>(null);

    constructor(private analytics: AnalyticsService) {
        effect(() => {
            if (this.loadChart()) {
                this.analytics.getData().then((d) => this.chartData.set(d));
            }
        });
    }
}
```

Because `loadChart` is a signal, the `when` expression re-evaluates reactively with no Zone.js needed.

---

## Real-world patterns

### Below-the-fold page sections

Split your landing page into above-fold (shipped with the initial bundle) and below-fold (deferred):

```html
<!-- Ships in main bundle — critical for LCP -->
<app-hero />
<app-features />

<!-- Deferred — not needed until user scrolls -->
@defer (on viewport; prefetch on idle) {
<app-pricing-table />
} @placeholder {
<div class="section-placeholder" style="min-height: 600px"></div>
} @defer (on viewport; prefetch on idle) {
<app-testimonials />
} @placeholder {
<div class="section-placeholder" style="min-height: 400px"></div>
} @defer (on viewport) {
<app-footer />
}
```

### Heavy third-party wrappers

If you wrap a chart library, PDF viewer, or map component, defer it so the vendor chunk never blocks your initial paint:

```html
@defer (on viewport) {
<app-map [location]="location()" />
} @loading {
<app-skeleton variant="map" />
} @error {
<p class="error-text">Map failed to load.</p>
}
```

### Feature-flagged UI

Combine `when` with a feature flag signal to ship UI that only loads for users who have access:

```html
@defer (when featureFlags.advancedEditor()) {
<app-advanced-editor />
}
```

The chunk never downloads for users without the flag — a clean alternative to hiding with `[hidden]` or `*ngIf`.

---

## What gets deferred?

Angular defers any **standalone** component, directive, or pipe inside the `@defer` block. Non-standalone (module-based) dependencies are **not** deferrable and stay in the main bundle.

This is one more reason to use standalone everywhere in modern Angular: non-standalone dependencies opt you out of defer's bundle-splitting benefits silently.

```ts
// Deferrable — standalone
@Component({ standalone: true, ... })
export class HeavyChartComponent {}

// Not deferrable — module-based
@NgModule({ declarations: [LegacyComponent] })
export class LegacyModule {}
```

---

## Measuring the impact

Check that defer actually split your bundle by inspecting the Network tab in DevTools:

1. Open DevTools → Network → filter by JS
2. Hard-reload the page and note the initial JS chunks
3. Scroll down (or trigger the interaction) and watch new chunks appear

You should see named chunks load on demand instead of up front. If a deferred chunk appears in the initial load, check that all its dependencies are standalone and not imported elsewhere in the main bundle.

In Lighthouse, you'll typically see improvement in:

- **FCP / LCP** — less JS to parse before first render
- **TBT / INP** — less main-thread work on startup
- **Bundle size** — split chunks shown in the JS transfer breakdown

---

## Common mistakes

**Placeholder has no height.** A zero-height placeholder enters the viewport immediately, so `on viewport` fires on page load — defeating the point. Always give placeholders a realistic min-height.

**Forgetting `@error`.** Network failures happen. Without `@error`, the user sees nothing and has no way to retry. Add a fallback.

**Deferring too aggressively.** Content that's always visible above the fold — nav, hero, CTA — should not be deferred. Defer costs a network round-trip; it only pays off for content the user might never reach.

**Skipping `prefetch`.** If an interaction is predictable (a visible "Load more" button), add `prefetch on idle` so the chunk is ready before the click.

**Using non-standalone dependencies.** Angular silently keeps non-standalone deps in the main bundle. Run `ng build --stats-json` and check `webpack-bundle-analyzer` if a defer block seems to have no effect.

---

## Quick reference

```html
<!-- Simplest: load when in viewport -->
@defer (on viewport) { <app-widget /> }

<!-- With all four blocks -->
@defer (on interaction) {
<app-editor />
} @loading (minimum 300ms) {
<app-skeleton />
} @placeholder {
<button>Open editor</button>
} @error {
<p>Failed to load.</p>
}

<!-- Signal-driven -->
@defer (when open()) { <app-modal-body /> }

<!-- Prefetch early, render late -->
@defer (on interaction; prefetch on idle) { <app-share-sheet /> }

<!-- Multiple triggers -->
@defer (on viewport; on timer(5s)) { <app-cookie-banner /> }
```

---

Angular's `@defer` blocks are the most impactful performance tool the framework has shipped in years. They require no architectural changes, no route restructuring, and no manual dynamic import wiring. Add them progressively to any template and watch your initial bundle shrink while your user experience gets sharper.

---

## Frequently asked questions

### What is the Angular @defer block?

The `@defer` block is a built-in Angular template syntax that lazily loads any standalone component, directive, or pipe as a separate JS chunk. Angular only downloads and renders the deferred content when a trigger fires — such as the element scrolling into view, the user clicking, or a signal becoming true.

### What triggers are available for Angular @defer?

Angular `@defer` supports `on viewport` (when the placeholder enters the viewport), `on interaction` (on first click, focus, or touch), `on idle` (during browser idle time), `on timer` (after a fixed delay), `on immediate` (as soon as possible after initial render), and `when` (a custom boolean expression, including signals).

### What is the difference between @placeholder and @loading?

`@placeholder` is shown immediately before the trigger fires — it represents the space before the user requests the content. `@loading` is shown while the JS chunk is actively being fetched from the network. Once the chunk arrives and renders, both are replaced by the main `@defer` block content.

### Can I use @defer with non-standalone Angular components?

No. Only standalone components, directives, and pipes are deferrable. Non-standalone (module-based) dependencies stay in the main bundle even if wrapped in a `@defer` block. This is a strong reason to migrate to standalone components in modern Angular.
