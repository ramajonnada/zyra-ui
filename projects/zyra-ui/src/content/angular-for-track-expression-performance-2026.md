---
title: "Angular @for Track Expression Performance: The Silent Bug in Every List"
description: "Using track $index in Angular @for is a silent performance killer. Learn the right track expression to prevent DOM churn, broken animations, and lost form state."
category:
    - "Angular 21"
tags:
    - "angular"
    - "performance"
    - "signals"
    - "control-flow"
    - "rendering"
keywords:
    - "Angular @for track expression performance"
    - "Angular @for track $index vs track id"
    - "Angular control flow performance tips 2026"
    - "Angular @for rendering optimization"
    - "how to use track in Angular @for"
date: "2026-08-05T10:00:00.000Z"
slug: "angular-for-track-expression-performance-2026"
---

# Angular @for Track Expression Performance: The Silent Bug in Every List

> **TL;DR:** If you write `track $index` on a mutable list, Angular destroys and recreates every DOM node whenever items reorder, filter, or update — even if the data barely changed. Use `track item.id` instead. It sounds trivial. The perf difference is not.

Open any Angular codebase and search for `@for`. Odds are strong you will find one of two things: `track $index`, or nothing — because the developer forgot the expression is mandatory and the linter yelled at them until they added the nearest available thing.

Both habits are quietly wrecking list performance. Angular's **@for track expression** is not a formality. It is the identity key that tells Angular's diffing algorithm which DOM node belongs to which data item. Get it wrong on a large, dynamic list and you trigger full subtree demolition on every change — no error, no warning, just a slower app and confused users whose input fields lose state.

This post shows exactly what goes wrong, why `track $index` is almost always the wrong choice for mutable lists, and how to prove the problem with Angular DevTools in under two minutes.

---

## The Problem: What `track $index` Actually Does to Your DOM

Angular's `@for` block must reconcile the current list of items against the previous list on every change detection run. The `track` expression provides the key it uses for that reconciliation — identical to how React's `key` prop works or Vue's `:key` binding.

When the track key for a given DOM node matches a key in the new list, Angular reuses that node and updates only the parts that changed. When no match exists, Angular tears the node down completely and builds a new one.

`track $index` tells Angular: *"the identity of this item is its position in the array."* If you sort a 100-item list, every item is now at a different index. From Angular's perspective, every identity changed. It destroys all 100 nodes and creates 100 new ones — even though the data itself only moved around.

Here is the broken pattern in a realistic scenario:

```typescript
// WRONG — track $index on a mutable list
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input placeholder="Search..." (input)="filter($event)" />

    @for (product of visibleProducts(); track $index) {
      <div class="product-card">
        <input [value]="product.name" />
        <span>{{ product.price | currency }}</span>
      </div>
    }
  `,
})
export class ProductListComponent {
  private readonly allProducts = signal<Product[]>([]);
  private readonly query = signal('');

  readonly visibleProducts = computed(() => {
    const q = this.query().toLowerCase();
    return this.allProducts().filter(p => p.name.toLowerCase().includes(q));
  });

  filter(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
  }
}
```

Every keystroke in the search box recomputes `visibleProducts()`. Every item in the result still has `$index` starting at 0, so Angular sees "all positions changed" and rebuilds the entire list. The inline `<input [value]="product.name" />` inside each card loses its cursor position — or any unsaved edits — on every character typed. Animations defined on card enter/leave play on every re-render. With 200 items this is visually perceptible as flicker.

---

## The Right Concept: Track by Stable Identity, Not by Position

The fix is one word:

```typescript
// CORRECT — track by a stable, unique identifier
@for (product of visibleProducts(); track product.id) {
```

Now Angular's algorithm matches items by their `id`. When the search filter runs, items that survive the filter keep their existing DOM nodes. Angular patches only the text content that changed. No destruction, no recreation, no state loss.

The rule is straightforward: **use `track $index` only when the array is truly static** — a list that never reorders, filters, or grows at arbitrary positions. Static lists rendered once and never changed (a hardcoded nav menu, a list of config options) are fine with `track $index`. Every other list should track by a domain identifier.

```typescript
// Track by id — any mutable, fetched, or filterable list
@for (user of users(); track user.id) { ... }

// Track by slug — content lists from an API
@for (post of posts(); track post.slug) { ... }

// Track by the whole item reference for simple value objects
// (works when items are replaced by reference on update)
@for (tag of tags(); track tag) { ... }

// Acceptable — only for truly static lists that never reorder
@for (step of ['Intro', 'Config', 'Done']; track $index) { ... }
```

A subtlety worth knowing: if your data comes from an API and items are plain objects (no shared reference), `track item` compares by reference equality. Two objects with the same fields but different references are treated as different identities. For API data, always track by a primitive identifier like `id` or `slug`.

---

## Spotting the Problem with Angular DevTools

You do not need a benchmark to confirm tracking bugs. [Angular DevTools](https://angular.dev/tools/devtools) is a free Chrome extension that shows a component profiler with flame charts — available on any Angular app in development mode.

Install it, open Chrome DevTools, click the Angular tab, and switch to the Profiler view. Record a change detection cycle while you type in the search box:

- With `track $index`: you see your list container re-render with every child component lit up in the flame chart as fully re-checked. All 50 rows show non-zero render time.
- With `track product.id`: only the rows that genuinely changed their data show render time. Rows that stayed identical are grey — Angular skipped them entirely.

The difference in a profiler trace makes the bug impossible to argue with. For large lists the wall-clock savings are measurable: a 300-item list with `OnPush` and proper track often drops from ~40ms to ~4ms per keystroke.

You can also confirm DOM destruction is happening without the profiler: add a CSS transition on card enter (`@keyframes fadeIn`) and watch whether every card fades in on each search keystroke. With `track $index` they all do. With `track item.id` only genuinely new cards animate in.

---

## Using ZyraUI with Proper @for Track Expressions

If you are building data tables or card grids with [ZyraUI](https://www.zyraui.dev), the same tracking rules apply to any list that drives ZyraUI components. Here is a searchable product table using [`zyra-table`](https://www.zyraui.dev/docs/components/table) with correct tracking:

```typescript
import { Component, signal, computed } from '@angular/core';
import { ZyraTableComponent, ZyraSpinnerComponent } from '@zyra-ui/angular';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZyraTableComponent, ZyraSpinnerComponent],
  template: `
    <input
      class="search-input"
      placeholder="Filter products..."
      (input)="query.set($any($event.target).value)"
    />

    @if (rows().length) {
      <zyra-table [columns]="columns" [data]="rows()">
        <!-- ZyraUI renders rows internally — track is handled per-row by id -->
      </zyra-table>
    } @else {
      <zyra-spinner />
    }
  `,
})
export class ProductTableComponent {
  readonly query = signal('');

  private readonly all = signal<Product[]>([
    { id: 1, name: 'Widget Pro', category: 'Hardware', price: 29.99 },
    { id: 2, name: 'Gadget Lite', category: 'Software', price: 9.99 },
    { id: 3, name: 'Thingamajig', category: 'Hardware', price: 49.99 },
  ]);

  readonly rows = computed(() => {
    const q = this.query().toLowerCase();
    return q ? this.all().filter(p => p.name.toLowerCase().includes(q)) : this.all();
  });

  readonly columns = [
    { key: 'id',       label: 'ID'       },
    { key: 'name',     label: 'Product'  },
    { key: 'category', label: 'Category' },
    { key: 'price',    label: 'Price'    },
  ];
}
```

If you are rendering rows yourself (outside ZyraUI's internal table), always pair the signal-derived list with `track row.id`. The component above uses `ChangeDetectionStrategy.OnPush` — which means Angular only checks it when signal dependencies change — so every unnecessary DOM rebuild is directly visible as wasted budget inside that check.

Explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev), including the [full component catalogue](https://www.zyraui.dev/docs/components) with cards, modals, and data display components that are built to pair with signal-driven, `OnPush` component patterns.

---

## Wrapping Up

The `@for` track expression is one of the smallest things to get right and one of the easiest to get wrong. `track $index` is almost always the wrong default for real data. Replacing it with `track item.id` takes five seconds and can save tens of milliseconds per interaction on any medium-sized list. Open Angular DevTools, record a profiler trace on your next list component, and see for yourself. Then check the [ZyraUI docs](https://www.zyraui.dev/docs) for table and card components designed to work with exactly this pattern.

---

## Frequently asked questions

### Why does Angular @for require a track expression at all?
Angular's modern control flow syntax makes `track` mandatory — the compiler enforces it and will not compile without it. The Angular team made this decision because omitting a track key was the single most common source of list performance regressions in legacy template code. Making it mandatory forces developers to make the identity decision explicitly rather than accidentally defaulting to undefined behaviour.

### When is `track $index` actually the right choice?
Use `track $index` when the array is definitively static — rendered once and never reordered, filtered, or updated in-place. Hardcoded navigation items, a fixed list of wizard steps, or a read-only enum list are all fine. The moment items can be added at arbitrary positions, removed, filtered, or sorted at runtime, switch to a stable domain identifier like `id`.

### Does the track expression affect `OnPush` change detection?
Yes, indirectly. With `OnPush`, Angular only enters a component's change detection when its signal dependencies change or a relevant event fires. But once inside, it still needs to reconcile the list. A wrong track expression forces full subtree destruction and creation regardless of the change detection strategy — you pay the cost of reconstructing DOM nodes and running all child component lifecycle hooks, which `OnPush` alone cannot prevent.

### What if my API data has no stable unique identifier?
Generate one before storing the data in a signal. A simple approach: `items.set(apiData.map((item, i) => ({ ...item, _key: \`${item.someField}-${i}\` })))`. The key just needs to be stable across re-renders for the same logical item — even a composite string works. Do not use `$index` as a workaround here; if the order changes, the composite key based on a field value will still match the right item while `$index` will not.
