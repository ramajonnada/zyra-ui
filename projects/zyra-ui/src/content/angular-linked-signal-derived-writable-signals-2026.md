---
title: "Angular linkedSignal(): Derived Writable Signals Explained"
description: "Learn Angular's linkedSignal() API: writable signals that reset automatically when a source signal changes. Practical examples for selection state, pagination, and draft forms."
category:
    - "Angular 21"
tags:
    - "angular"
    - "linkedsignal"
    - "signals"
    - "derived state"
    - "angular 21"
keywords:
    - "angular linkedSignal"
    - "angular derived writable signal"
    - "linkedSignal vs computed"
    - "angular signals reset state"
    - "angular 21 signals api"
date: "2026-07-23T12:00:00.000Z"
slug: "angular-linked-signal-derived-writable-signals-2026"
---

# Angular linkedSignal(): Derived Writable Signals Explained

> **TL;DR:** `computed()` gives you read-only derived state. `linkedSignal()` gives you derived state you can still write to — and it automatically resets to a freshly-derived value whenever its source changes. It's the correct tool for "reset when X changes" patterns like selected-item state, pagination pages, and draft form values, replacing a manual `effect()` that calls `.set()`.

If you've written a `computed()` signal and then needed to let the user override it locally — a selected tab that defaults to the first one but can be clicked to a different one, a page number that should snap back to `1` whenever the filters change — you've hit the same wall: `computed()` signals are read-only. You can't call `.set()` on one. The usual workaround is a writable signal plus an `effect()` that watches the source and calls `.set()` to reset it, which works but adds a lifecycle dependency and a subtle bug risk if the effect's dependency tracking isn't exactly right.

`linkedSignal()`, stable as of Angular 19 and a standard tool by Angular 21, is built for exactly this. This post covers the two ways to call it, three real examples, and how it differs from both `computed()` and the manual effect-based pattern.

---

## The Problem: Writable State That Should Reset

Take a product page with color variants. The selected variant should default to the first one in the list, but the user can click a different swatch. So far that's just a writable signal seeded from a computed default. The catch: when the parent swaps to a *different* product, the previously selected variant (say, "Blue") almost certainly doesn't exist on the new product's variant list — and if it does exist by coincidence, that's still not the behavior you want. You want the selection to reset to the new product's first variant automatically.

```typescript
// The naive attempt — doesn't reset when `product` changes
export class VariantPickerComponent {
  product = input.required<Product>();

  // Seeded once, from the initial value only — never updates after that
  selectedVariant = signal(this.product().variants[0]);
}
```

This only reads `product()` once, at signal construction. It does not react to later changes at all.

---

## The effect() Workaround (and why it's worse)

Before `linkedSignal()`, the fix was a writable signal plus an [`effect()` with cleanup](/blog/angular-effect-cleanup-destroyref-memory-leaks-2026):

```typescript
export class VariantPickerComponent {
  product = input.required<Product>();
  selectedVariant = signal<Variant | null>(null);

  constructor() {
    effect(() => {
      // Runs whenever product() changes, resets the selection
      this.selectedVariant.set(this.product().variants[0]);
    });
  }
}
```

It works, but it's more moving parts than the problem deserves: a constructor, an `effect()` registration, and a signal that starts in a technically-invalid `null` state before the effect first runs. It also runs the reset as a side effect *after* change detection notices `product()` changed, rather than the value simply being correct synchronously.

---

## linkedSignal() — the Direct Fix

```typescript
import { Component, ChangeDetectionStrategy, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-variant-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (variant of product().variants; track variant.id) {
      <button
        [class.active]="variant.id === selectedVariant().id"
        (click)="selectedVariant.set(variant)"
      >
        {{ variant.label }}
      </button>
    }
  `,
})
export class VariantPickerComponent {
  product = input.required<Product>();

  // Writable — .set() works — but resets to product().variants[0]
  // every time product() itself changes.
  selectedVariant = linkedSignal(() => this.product().variants[0]);
}
```

`linkedSignal()` takes a computation function, exactly like `computed()`. The difference is the signal it returns is writable: `selectedVariant.set(variant)` and `selectedVariant.update(...)` both work. Angular tracks which signals the computation reads (`product()` here) and re-runs it whenever any of them change, overwriting whatever the user had set locally — which is precisely the "reset on source change" behavior the effect-based version was manually reproducing.

---

## The Two-Argument Form: Keeping Part of the Old Value

Sometimes a full reset is too aggressive. Consider pagination: when the user changes filters, you want the page to reset to `1`. But if the user changes the *page size* (10 → 25 rows per page), you'd rather keep them looking at roughly the same data, not snap back to page 1.

`linkedSignal()` has a second form that takes `{ source, computation }`, where `computation` receives both the new source value and the previous linked-signal value:

```typescript
import { Component, ChangeDetectionStrategy, input, linkedSignal, computed } from '@angular/core';

interface Filters {
  category: string;
  pageSize: number;
}

@Component({
  selector: 'app-results-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Page {{ page() }} of {{ totalPages() }}</p>`,
})
export class ResultsTableComponent {
  filters = input.required<Filters>();
  totalItems = input.required<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.filters().pageSize));

  page = linkedSignal({
    source: () => this.filters(),
    computation: (newFilters, previous) => {
      // Category changed — reset to page 1.
      if (previous && previous.source.category !== newFilters.category) {
        return 1;
      }
      // Page size changed only — keep the current page number.
      return previous?.value ?? 1;
    },
  });
}
```

`previous` is `undefined` on the very first run, and on every subsequent run it's `{ source, value }` — the prior source value and the prior linked-signal value — so the computation can decide, per change, whether to reset or carry the value forward. That granularity isn't something `computed()` or a single `effect()` can express cleanly; you'd end up tracking the previous filters yourself in another signal just to diff against.

---

## linkedSignal() vs computed(): When to Reach for Which

| | `computed()` | `linkedSignal()` |
|---|---|---|
| Writable? | No — read-only | Yes — `.set()` / `.update()` work |
| Purpose | Pure derivation, always in sync with sources | Derived *default*, user (or other code) can override it |
| Resets on source change? | N/A — it's always freshly derived | Yes — recomputes and overwrites local overrides |

The test to apply: if the value should *only* ever be a pure function of other signals, use `computed()`. If a user action needs to override the derived value *until* the source changes again, that's a `linkedSignal()`.

---

## Wrapping up

`linkedSignal()` fills a real gap between `signal()` and `computed()` — writable state that still has a defined relationship to another signal, with automatic reset semantics you'd otherwise hand-roll with an `effect()`. Selected-item state, pagination pages, draft/edit-mode form values seeded from a record, and any "local override with an upstream default" pattern are the concrete cases to reach for it. If you find yourself writing an `effect()` whose only job is to call `.set()` on another signal in response to a change, that's the signal (no pun intended) to reach for `linkedSignal()` instead. The [official Angular linkedSignal documentation](https://angular.dev/api/core/linkedSignal) covers the full API.

---

## Frequently asked questions

### Is linkedSignal() the same as computed() but writable?

Not quite — the writability is the headline feature, but the more important part is the reset behavior. When the source signals a `linkedSignal()` reads change, it re-runs its computation and *overwrites* any value a consumer had `.set()`, exactly like a fresh `computed()` would. A plain writable `signal()` with a `computed()` fallback value would not do this automatically.

### Does linkedSignal() work with input()?

Yes — this is one of its most common use cases. Since `input()` returns a signal, a component's `input.required<T>()` — covered in depth in [Angular input() and output()](/blog/angular-input-output-signal-api-replace-decorators) — can be read directly inside a `linkedSignal()` computation, giving you writable, per-render-cycle-resettable state derived from a parent-provided input, without an `ngOnChanges` or constructor `effect()`.

### What happens if I never call .set() on a linkedSignal?

It behaves exactly like a `computed()` — its value always tracks the latest computation result from its source signals. The writable capability is opt-in; if nothing ever calls `.set()`/`.update()`, there's no functional difference from using `computed()`.

### Can linkedSignal() cause an infinite loop if the computation reads its own value?

No — the computation function only tracks the signals it reads for the *source*, not the linked signal's own current value (in the single-argument form). In the two-argument `{ source, computation }` form, the `computation` function explicitly receives the previous value as a parameter rather than through signal tracking, so reading it there doesn't create a circular dependency either.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular effect() Cleanup: Preventing Memory Leaks with DestroyRef](/blog/angular-effect-cleanup-destroyref-memory-leaks-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Angular resource() and httpResource(): Reactive HTTP with Signals](/blog/angular-resource-api-httpresouce-signals-2026)
- [Official Angular linkedSignal documentation](https://angular.dev/api/core/linkedSignal)
