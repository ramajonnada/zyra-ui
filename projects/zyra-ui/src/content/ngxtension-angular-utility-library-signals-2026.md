---
title: "ngxtension: The Angular Utility Library Every Signals Developer Should Know"
description: "Discover ngxtension — the community Angular utility library that fills the gaps in the signals API with computedAsync, injectParams, explicitEffect, and more."
category:
    - "Angular 21"
tags:
    - "Angular"
    - "Signals"
    - "ngxtension"
    - "Angular Utilities"
    - "State Management"
keywords:
    - "ngxtension Angular utility library"
    - "computedAsync Angular signals"
    - "injectParams injectQueryParams Angular"
    - "explicitEffect Angular signals"
    - "Angular signals utility helpers 2026"
date: "2026-08-07T10:00:00.000Z"
slug: "ngxtension-angular-utility-library-signals-2026"
---

# ngxtension: The Angular Utility Library Every Signals Developer Should Know

> **TL;DR:** ngxtension is an open-source collection of Angular utilities — `computedAsync`, `injectParams`, `explicitEffect`, `syncSignal`, and a dozen more — that patch the gaps left by Angular's built-in signals API. If you write modern Angular with signals, you almost certainly need it.

Angular's signals API is powerful, but the core team deliberately ships a minimal surface area. That leaves a handful of recurring problems every team has to solve themselves: deriving async data into a signal, reading route params as signals without `ActivatedRoute`, running an effect only when a specific dependency changes. The ngxtension library exists to handle exactly these cases — community-built, well-tested, and designed to feel like a natural extension of Angular's own APIs.

This post covers the utilities you will reach for most often, the problems they solve, and how to integrate ngxtension into a real Angular 22 application.

---

## The Problem: Angular Signals Leave Gaps for Async and Router Patterns

`computed()` is synchronous by design — it can only derive values from other signals, not from Promises or Observables. But in practice, you constantly need derived data that comes from HTTP calls, IndexedDB reads, or other async sources:

```typescript
// This does NOT work — computed() cannot be async
const userProfile = computed(async () => {
  const id = userId();
  return await fetchUserById(id); // WRONG: returns a Promise, not the resolved value
});
```

The idiomatic Angular fix is to bridge RxJS with `toSignal()` + `switchMap`, but that pattern adds boilerplate for every async derivation:

```typescript
// Works, but verbose for every async dependency
private readonly userId = signal(1);

private readonly userProfile = toSignal(
  toObservable(this.userId).pipe(
    switchMap(id => this.http.get<User>(`/api/users/${id}`))
  ),
  { initialValue: null }
);
```

Multiply this by five async dependencies per component and your service files balloon. ngxtension's `computedAsync` compresses this to one line.

Similarly, Angular 22's `withComponentInputBinding()` lets route params bind to `input()` signals — but only for components wired directly to a route definition. For nested components, services, or any code outside the routed component tree, you still need `inject(ActivatedRoute)`. ngxtension gives you clean signal-based alternatives here too.

---

## New Concept: What ngxtension Is and How It Works

[ngxtension](https://ngxtension.netlify.app) is a community-maintained Angular utility library started by Chau Tran and maintained by contributors across the Angular ecosystem. It is published as `ngxtension` on npm and targets Angular 16+ with full support for Angular 22.

Every utility in ngxtension follows the same contract:

- **Injectable by convention.** Utilities that need Angular's DI (like `injectParams`) use `inject()` internally, so they must be called in an injection context — constructor, `inject()`, field initializer, or a function passed to `runInInjectionContext`.
- **Signal-native.** All return values are signals or `Signal<T>` wrappers. They compose with `computed()`, `effect()`, and `afterRenderEffect()` without adapters.
- **Tree-shakeable.** Import only what you use — each utility is a standalone exported function, never a service class you have to provide.

Install it:

```bash
npm install ngxtension
```

No `providers`, no module imports. Just install and use.

---

## New Tool: The ngxtension Utilities You Will Use Every Day

### `computedAsync` — async derived signals

`computedAsync` accepts a function that returns a Promise or Observable and produces a signal of the resolved value. It re-runs automatically when any signal read inside the function changes — exactly like `computed()`, but async.

```typescript
import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { computedAsync } from 'ngxtension/computed-async';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (profile.value(); as user) {
      <p>{{ user.name }}</p>
    }
    @if (profile.isLoading()) {
      <span>Loading...</span>
    }
  `,
})
export class UserProfileComponent {
  private readonly http = inject(HttpClient);

  readonly userId = signal(1);

  readonly profile = computedAsync(
    () => this.http.get<User>(`/api/users/${this.userId()}`),
    { initialValue: null }
  );
}
```

`computedAsync` cancels the previous in-flight request automatically when `userId` changes — the same cancellation semantics you get from `switchMap`. The return value exposes `.value()`, `.isLoading()`, and `.error()` sub-signals so you can handle each state in the template without a loading boolean you manage yourself.

---

### `injectParams` and `injectQueryParams` — router params as signals

Instead of injecting `ActivatedRoute` and subscribing to `paramMap`, you get a signal directly:

```typescript
import { injectParams, injectQueryParams } from 'ngxtension/inject-params';

@Component({ standalone: true, /* ... */ })
export class ProductDetailComponent {
  // Signal<string | null> — reactive to navigation
  readonly productId = injectParams('id');

  // Signal<string | null> — reactive to ?tab= changes
  readonly activeTab = injectQueryParams('tab');

  // Derived signal — reacts to both
  readonly pageTitle = computed(() =>
    `Product ${this.productId() ?? '...'} — ${this.activeTab() ?? 'overview'}`
  );
}
```

Because the return values are plain signals, you compose them with `computed()` and `effect()` exactly like any other signal — no async pipe, no subscription to clean up.

---

### `explicitEffect` — effects with selective dependency tracking

Angular's built-in `effect()` re-runs whenever any signal read inside it changes. That is usually what you want, but sometimes you need an effect that responds to one signal while reading others as "non-reactive" context:

```typescript
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({ standalone: true, /* ... */ })
export class SearchComponent {
  readonly query = signal('');
  readonly page = signal(1);
  readonly resultsPerPage = signal(20);

  constructor() {
    // Only re-runs when query changes — not when page or resultsPerPage change
    explicitEffect([this.query], ([q]) => {
      this.page.set(1); // Reset to page 1 when search query changes
      this.search(q, this.page(), this.resultsPerPage()); // reads others without tracking
    });
  }
}
```

The first argument is an explicit array of signals to track. The callback receives their current values as typed tuple arguments. Reads inside the callback that are not in the dependency array do not trigger re-runs.

---

### `syncSignal` — two-way binding between signals

`syncSignal` keeps two writable signals in sync bidirectionally. It is the cleanest way to bind a parent signal to a child component's `model()` signal or to persist a signal to localStorage:

```typescript
import { syncSignal } from 'ngxtension/sync-signal';

@Component({ standalone: true, /* ... */ })
export class ThemeSettingsComponent {
  readonly localTheme = signal<'dark' | 'light'>('dark');

  constructor() {
    // Any write to localTheme reflects in appTheme and vice versa
    syncSignal(this.localTheme, inject(AppStateService).theme);
  }
}
```

---

### `createInjectable` — simpler service authoring

The `@Service()` decorator arrived in Angular 22, but if you want the same ergonomics without the decorator, `createInjectable` produces a typed injectable factory with zero boilerplate:

```typescript
import { createInjectable } from 'ngxtension/create-injectable';
import { signal, computed } from '@angular/core';

export const CartStore = createInjectable(() => {
  const items = signal<CartItem[]>([]);
  const total = computed(() =>
    items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  function addItem(item: CartItem) {
    items.update(current => [...current, item]);
  }

  return { items, total, addItem };
});

// Usage in a component
readonly cart = inject(CartStore);
```

No class, no `@Injectable()`, no `providedIn` — just a function that returns what you want to expose.

---

## Using ZyraUI with ngxtension

Where ngxtension shines most is when the signals it produces drive UI state in a component library. Combining `computedAsync` for data fetching with [ZyraUI components](https://www.zyraui.dev/docs/components) for rendering gives you a clean, declarative pattern with very little manual state management.

Here is a complete data table component that uses `computedAsync` for async data and `injectQueryParams` for pagination — rendering results in a `zyra-table` with a `zyra-spinner` loading state:

```typescript
import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { computedAsync } from 'ngxtension/computed-async';
import { injectQueryParams } from 'ngxtension/inject-params';
import { ZyraTableComponent, ZyraSpinnerComponent } from '@zyra-ui/angular';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZyraTableComponent, ZyraSpinnerComponent],
  template: `
    @if (products.isLoading()) {
      <zyra-spinner size="lg" />
    }

    @if (products.error()) {
      <p class="error">Failed to load products.</p>
    }

    @if (products.value(); as rows) {
      <zyra-table
        [rows]="rows"
        [columns]="columns"
        [pageSize]="pageSize()"
      />
    }
  `,
})
export class ProductTableComponent {
  private readonly http = inject(HttpClient);

  readonly page = injectQueryParams('page');
  readonly pageSize = computed(() => 20);

  readonly columns = [
    { key: 'name', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
  ];

  readonly products = computedAsync(
    () =>
      this.http.get<Product[]>(`/api/products`, {
        params: { page: this.page() ?? '1', size: String(this.pageSize()) },
      }),
    { initialValue: [] }
  );
}
```

No subscription management, no `ngOnDestroy`, no `BehaviorSubject`. When the `?page=` query param changes, `products` re-fetches automatically and cancels any in-flight request. Explore all 60+ free components — tables, spinners, modals, cards, and more — at [zyraui.dev](https://www.zyraui.dev) and in the [ZyraUI component docs](https://www.zyraui.dev/docs/components).

---

## Wrapping up

ngxtension fills the gaps that Angular's minimal signals API intentionally leaves — async derivation, selective effect dependencies, route param signals, and more. If you are building a signals-first Angular 22 app, adding `ngxtension` to your dependency list early will save hours of RxJS plumbing. Browse the [full ngxtension docs](https://ngxtension.netlify.app) to see the complete list of utilities, and check the [ZyraUI docs](https://www.zyraui.dev/docs) for UI components that pair well with the signal patterns shown here.

---

## Frequently asked questions

### What is ngxtension and why do Angular developers need it?
ngxtension is a community-maintained Angular utility library that provides signal-based helpers the Angular core team did not include in the framework itself. Utilities like `computedAsync`, `injectParams`, and `explicitEffect` solve common patterns — async signal derivation, router param signals, selective dependency tracking — that otherwise require verbose RxJS bridging code. It targets Angular 16+ and fully supports Angular 22.

### Does ngxtension conflict with Angular's built-in signals API?
No. ngxtension is designed as a thin extension on top of Angular's signals, not a replacement. Every utility it exports returns standard `Signal<T>` types that compose with Angular's own `computed()`, `effect()`, `input()`, `model()`, and `toSignal()` without any adapters. You can adopt individual utilities incrementally — there is no all-or-nothing commitment.

### How does `computedAsync` handle race conditions?
`computedAsync` uses `switchMap` semantics internally: when the signals it depends on change, it cancels the previous in-flight Observable or Promise and starts a new one. This means only the latest request's result is ever reflected in the signal's value, preventing stale data from an earlier response overwriting a newer one.

### Can I use ngxtension utilities outside of components?
Yes — any utility that relies on Angular DI (such as `injectParams` or `injectQueryParams`) must be called within an injection context, but that includes field initializers, `inject()` calls in constructors, and functions passed to `runInInjectionContext()`. `computedAsync` and `explicitEffect` work anywhere you have an injection context, including `createInjectable` factories and `@Service()` decorated services.
