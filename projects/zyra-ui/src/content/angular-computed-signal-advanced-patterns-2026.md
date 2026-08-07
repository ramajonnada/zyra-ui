---
title: "Angular computed() Advanced Patterns: Chaining and Derived State in 2026"
description: "Master Angular computed() advanced patterns — chaining signals, lazy memoization, derived state trees, and derivedAsync for async derivation in Angular 22."
category:
    - "Angular 21"
tags:
    - "angular"
    - "signals"
    - "computed"
    - "state management"
    - "performance"
keywords:
    - "Angular computed() advanced patterns"
    - "Angular signal derived state"
    - "computed signal chaining Angular"
    - "Angular signal memoization"
    - "derivedAsync Angular signals"
date: "2026-08-06T10:00:00.000Z"
slug: "angular-computed-signal-advanced-patterns-2026"
---

# Angular computed() Advanced Patterns: Chaining and Derived State in 2026

> **TL;DR:** `computed()` in Angular does far more than simple value derivation. This post covers advanced patterns — chaining computed signals into dependency graphs, relying on Angular's built-in memoization to avoid redundant recalculations, building complex derived state trees that replace RxJS selector chains, and using `derivedAsync` from ngxtension for async-derived values.

If you have used Angular signals for more than a week, you have written a `computed()`. Something like this:

```typescript
const fullName = computed(() => `${firstName()} ${lastName()}`);
```

That is the easy part. The patterns that actually pay off in a real app — ones that previously required RxJS `combineLatest` chains, Reselect-style memoized selectors, or careful `distinctUntilChanged` wiring — are less obvious. Angular computed() advanced patterns are what separate a signals app that performs well from one that recalculates everything on every change.

This post covers those patterns using modern Angular — standalone components, `OnPush`, `inject()`, `@if`, `@for`, no NgModule, no constructor DI.

---

## The Problem: Expensive Derived State Without Good Patterns

Consider a dashboard that shows a filtered, sorted, and paginated list of orders. The naive approach recalculates everything together:

```typescript
// BAD: one giant computed that does everything
readonly displayedOrders = computed(() => {
  const raw = this.orders();
  const query = this.searchQuery().toLowerCase();
  const sort = this.sortColumn();
  const page = this.currentPage();
  const pageSize = this.pageSize();

  const filtered = raw.filter(o => o.customerName.toLowerCase().includes(query));
  const sorted = [...filtered].sort((a, b) => a[sort] < b[sort] ? -1 : 1);
  return sorted.slice((page - 1) * pageSize, page * pageSize);
});
```

Every time any of the four signals changes — even just the page number — the entire filter and sort runs again. With 10,000 orders, that is a real performance problem.

---

## Angular Signal Derived State: Chaining computed() Signals

The fix is to split the derivation into a chain of computed signals. Angular's reactive graph ensures that each computed only re-runs when its own direct dependencies change — not when unrelated signals update. This is the core of Angular signal memoization.

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Showing {{ displayedOrders().length }} of {{ filteredOrders().length }} results</p>
    @for (order of displayedOrders(); track order.id) {
      <app-order-row [order]="order" />
    }
  `,
})
export class OrderDashboardComponent {
  private orderService = inject(OrderService);

  // Tier 1: raw server data
  readonly orders = this.orderService.orders; // WritableSignal<Order[]>

  // Tier 2: user controls
  readonly searchQuery = signal('');
  readonly sortColumn = signal<keyof Order>('createdAt');
  readonly currentPage = signal(1);
  readonly pageSize = signal(25);

  // Tier 3: filtered — only recomputes when orders or searchQuery changes
  readonly filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.orders().filter(o =>
      o.customerName.toLowerCase().includes(query)
    );
  });

  // Tier 4: sorted — only recomputes when filteredOrders or sortColumn changes
  readonly sortedOrders = computed(() => {
    const col = this.sortColumn();
    return [...this.filteredOrders()].sort((a, b) =>
      a[col] < b[col] ? -1 : 1
    );
  });

  // Tier 5: paginated — only recomputes when sortedOrders, currentPage, or pageSize changes
  readonly displayedOrders = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    return this.sortedOrders().slice((page - 1) * size, page * size);
  });
}
```

Now when the user clicks to the next page, only `displayedOrders` re-runs. The expensive filter and sort are skipped entirely. This is the primary benefit of chaining computed signals: Angular's reactive graph tracks dependencies at the level of individual computeds, not at the component level.

---

## How Angular Signal Memoization Actually Works

Angular's `computed()` is lazy and memoized. "Lazy" means it does not run until something reads its value. "Memoized" means that once it has run and none of its dependencies have changed, subsequent reads return the cached result immediately without re-running the function.

The dependency tracking is automatic. When a computed runs for the first time, Angular records which signals were accessed. If any of those signals emit a new value, the computed is marked stale. The next read triggers a re-run; otherwise it returns the cached value.

Two subtleties are worth knowing:

**1. Conditional dependencies are tracked correctly.** If your computed reads signal A first and only reads signal B under a condition, and that condition is false, signal B is not tracked for that run. If B later changes, the computed does not re-run — because it is not watching B at that moment.

```typescript
// B is only tracked when featureFlag() is true
const result = computed(() => {
  if (!featureFlag()) return 'off';
  return processData(expensiveData()); // expensiveData tracked only when on
});
```

**2. Object identity matters for downstream computeds.** If a computed returns a new array or object reference every time — even with the same contents — downstream computeds that depend on it will always re-run. Where identity stability matters, consider returning the same reference when the contents have not changed:

```typescript
readonly activeUsers = computed(() => {
  const prev = this._cachedActiveUsers;
  const next = this.users().filter(u => u.active);
  // Shallow equality check to preserve reference stability
  if (prev && prev.length === next.length && prev.every((u, i) => u.id === next[i].id)) {
    return prev;
  }
  this._cachedActiveUsers = next;
  return next;
});
private _cachedActiveUsers: User[] | null = null;
```

For most UIs this is unnecessary. Mention it because it becomes relevant in large lists where downstream computeds do heavy work.

---

## derivedAsync: Async Derived State with ngxtension

Standard `computed()` is synchronous. You cannot `await` inside it. For a derived value that requires an HTTP call or IndexedDB read, the community-standard tool is `derivedAsync` from [ngxtension](https://ngxtension.netlify.app/) — the successor to the older `computedAsync`, renamed because the result is not a memoized `computed()` but a signal *derived* from an async source.

```bash
npm install ngxtension
```

`derivedAsync` gives you a signal that can be derived asynchronously, tracks signal dependencies the same way `computed()` does, and re-triggers when those dependencies change:

```typescript
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as p) {
      <h1>{{ p.name }}</h1>
      <p>{{ p.description }}</p>
    } @else {
      <app-skeleton />
    }
  `,
})
export class ProductDetailComponent {
  private productService = inject(ProductService);

  readonly productId = signal<string | null>(null);

  readonly product = derivedAsync(
    () => {
      const id = this.productId();
      if (!id) return null;
      // Re-fetches whenever productId() changes
      return this.productService.getById(id);
    },
    { initialValue: null }
  );
}
```

When `productId` changes, `derivedAsync` cancels the previous async operation (if it was an Observable, it unsubscribes; if a Promise, it ignores the resolved value) and starts the new one. This is the async analog of computed signal chaining — each layer of async derivation only re-runs when its own upstream signals change.

---

## Using ZyraUI for Complex Derived State UIs

Derived state patterns shine when combined with UI components that reflect the state tree without managing it themselves. [ZyraUI](https://www.zyraui.dev) components are fully standalone and pair naturally with this pattern — you pass in signals, the component renders.

Here is the paginated order list wired to ZyraUI's table and spinner components:

```typescript
import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ZyraTableComponent, ZyraSpinnerComponent, ZyraPaginationComponent } from '@zyra-ui/angular';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZyraTableComponent, ZyraSpinnerComponent, ZyraPaginationComponent],
  template: `
    @if (loading()) {
      <zyra-spinner size="lg" />
    } @else {
      <zyra-table
        [columns]="columns"
        [rows]="displayedOrders()"
        [sortColumn]="sortColumn()"
        (sortChange)="sortColumn.set($event)"
      />
      <zyra-pagination
        [total]="filteredOrders().length"
        [pageSize]="pageSize()"
        [page]="currentPage()"
        (pageChange)="currentPage.set($event)"
      />
    }
  `,
})
export class OrdersPageComponent {
  private orderService = inject(OrderService);

  readonly loading = this.orderService.loading;
  readonly orders = this.orderService.orders;
  readonly searchQuery = signal('');
  readonly sortColumn = signal<string>('createdAt');
  readonly currentPage = signal(1);
  readonly pageSize = signal(25);

  readonly filteredOrders = computed(() =>
    this.orders().filter(o =>
      o.customerName.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  readonly sortedOrders = computed(() =>
    [...this.filteredOrders()].sort((a, b) =>
      a[this.sortColumn()] < b[this.sortColumn()] ? -1 : 1
    )
  );

  readonly displayedOrders = computed(() =>
    this.sortedOrders().slice(
      (this.currentPage() - 1) * this.pageSize(),
      this.currentPage() * this.pageSize()
    )
  );

  readonly columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'total', label: 'Total' },
    { key: 'createdAt', label: 'Date' },
  ];
}
```

Notice that the component has no logic for when to update — it just declares the signal graph and reads from it in the template. ZyraUI components do the rendering; Angular's reactive graph handles the scheduling. You can explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev), including [tables, pagination, spinners, and more](https://www.zyraui.dev/docs/components).

---

## Replacing RxJS Selector Chains with computed()

If you have used NgRx with Reselect-style selectors, the pattern above will look familiar. The difference is that `computed()` requires no store boilerplate — the signals and their computeds live directly on the component or in an injectable service.

For shared state across multiple components, move the signals and computeds into a `@Injectable` service (or an `@ngrx/signals` store if you need devtools):

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  readonly orders = signal<Order[]>([]);
  readonly searchQuery = signal('');
  readonly sortColumn = signal<keyof Order>('createdAt');

  // These computeds are shared — any component that injects this service
  // reads the already-memoized result; no redundant recalculation
  readonly filteredOrders = computed(() =>
    this.orders().filter(o =>
      o.customerName.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  readonly sortedOrders = computed(() =>
    [...this.filteredOrders()].sort((a, b) =>
      a[this.sortColumn()] < b[this.sortColumn()] ? -1 : 1
    )
  );
}
```

Multiple components can inject `OrderStateService` and read `sortedOrders()` — they all share the same memoized result. If nothing has changed, it is a zero-cost read. See the [Angular dependency injection docs](https://angular.dev/guide/di) for patterns around service scope if you need per-route rather than global state.

---

## Wrapping Up

`computed()` in Angular 22 is not just a convenience wrapper — it is the primary tool for building efficient, readable derived state. Chaining computeds into a dependency graph means expensive operations only re-run when their specific inputs change. Angular's built-in memoization means downstream reads are free when nothing has changed. And `derivedAsync` from ngxtension extends the same model to async derivation without manual subscription management.

These patterns replace what previously required RxJS selector chains, `combineLatest`, and careful `distinctUntilChanged` usage — with far less ceremony and the same performance guarantees. Check out the [ZyraUI docs](https://www.zyraui.dev/docs) and the [ZyraUI components](https://www.zyraui.dev/docs/components) library to see how these patterns compose with a production-ready Angular component set.

---

## Frequently Asked Questions

### When should I use computed() versus effect() in Angular?
Use `computed()` when you need a derived value — something you want to read from the template or pass to another computed. It is synchronous, memoized, and read-only. Use `effect()` when you need a side effect that reacts to signal changes — logging, DOM manipulation, syncing to localStorage, or calling an external API. A good rule of thumb: if you are producing a value, reach for `computed()`; if you are doing something, reach for `effect()`.

### Does computed() work with OnPush change detection?
Yes, and it is the recommended combination. Angular's template binding reads a computed signal, which marks the view as dirty only when the computed's value actually changes. With `OnPush`, Angular skips change detection for the component unless the view is dirty. The result is that templates re-render only when the derived output genuinely changes, not on every cycle.

### Can I use derivedAsync without ngxtension?
You can approximate it manually by combining `effect()` with a `WritableSignal` that holds the async result. However, `derivedAsync` from [ngxtension](https://ngxtension.netlify.app/) handles cancellation, initial values, and error states out of the box. For new projects it is the right default. The ngxtension library is a zero-dependency collection of Angular utilities maintained by the Angular community.

### How many computed() calls is too many?
There is no hard limit, and computed signals are cheap when their dependencies have not changed. The practical concern is readability — a chain of ten computeds can be hard to trace. For very large derived state graphs, moving computeds into a shared service or an `@ngrx/signals` store gives you a cleaner boundary and optionally Angular DevTools signal graph visualization.
