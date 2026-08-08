---
title: "Angular CDK Virtual Scroll: Render 100,000 Rows Without Killing Performance"
description: "Learn how Angular CDK Virtual Scroll renders massive lists without freezing the browser — with signals, custom strategies, and ZyraUI table integration."
category:
    - "Angular 21"
tags:
    - "angular cdk"
    - "virtual scroll"
    - "performance"
    - "signals"
    - "component library"
keywords:
    - "angular cdk virtual scroll large lists"
    - "angular virtual scrolling performance"
    - "cdk scroll strategy angular"
    - "angular render 100k rows"
    - "angular list performance optimization"
date: "2026-08-08T10:00:00.000Z"
slug: "angular-cdk-virtual-scroll-large-lists-2026"
---

# Angular CDK Virtual Scroll: Render 100,000 Rows Without Killing Performance

> **TL;DR:** Angular CDK's `CdkVirtualScrollViewport` only renders the rows currently visible on screen. Combine it with signals for reactive data loading and a custom `ItemSizeEstimator` for variable-height rows, and you can scroll through 100,000 items at 60 fps without breaking a sweat.

Rendering a large table or list is one of the first real performance walls Angular developers hit in production. You load 10,000 contacts from an API, drop them into a `@for` loop, and suddenly your app feels like it is running through wet cement. The browser is creating tens of thousands of DOM nodes that are almost entirely off-screen — work that gains you nothing and costs you everything.

Angular CDK Virtual Scroll solves this with a simple mental shift: instead of rendering all rows and hiding most of them, render only the rows the user can actually see, and swap them in and out as the viewport scrolls. The result is a list that behaves identically to a fully-rendered one but keeps the active DOM node count in the dozens regardless of dataset size.

---

## The Problem: DOM Bloat Kills Scrolling Performance

When you render a list with `@for`, Angular creates a DOM node for every item — visible or not. With 10,000 rows each containing a handful of text nodes and a button, you are looking at 50,000–100,000 DOM nodes sitting in memory. The browser must keep all of them in the layout tree, recalculate paint geometry on every scroll event, and re-run change detection across the entire list.

The symptoms are familiar: janky scrolling, high memory usage (often 500 MB+ on a modest dataset), and a lag between user input and visual response that makes the app feel broken. The naive fix — pagination — works but trades one problem for another: the user loses the ability to scan and jump freely through the data.

Angular CDK Virtual Scroll gives you the smooth, continuous scrolling of a fully-rendered list with the low DOM footprint of pagination.

---

## New Concept: How CdkVirtualScrollViewport Works

Angular CDK Virtual Scroll is part of `@angular/cdk/scrolling`. Its core primitive, `CdkVirtualScrollViewport`, maintains a fixed-size container with a CSS transform that shifts a small pool of rendered items to match the current scroll position. As the user scrolls, items that leave the viewport are reused for items entering it — the same "recycling" pattern used in native mobile list views.

The CDK ships with two built-in item-size strategies:

- **`FixedSizeVirtualScrollStrategy`** — every item has the same pixel height; this is fast and simple.
- **`AutoSizeVirtualScrollStrategy`** — items can vary in height; the CDK measures each item after render and refines its scroll model. More accurate but slightly more work.

For most data-table use cases, fixed-size is the right default. The CDK also exposes a `VirtualScrollStrategy` interface so you can write a custom estimator if your design requires truly dynamic row heights without auto-measurement overhead.

Read more about the underlying recycling mechanics in the [Angular CDK Scrolling docs on angular.dev](https://angular.dev/guide/components/advanced-configuration) and the broader [browser rendering performance model on web.dev](https://web.dev/articles/rendering-performance).

---

## Implementation: Virtual Scroll With Signals

Here is a complete, production-ready standalone component that loads data into a signal, pipes it into a virtual scroll viewport, and stays reactive to filter changes without triggering full re-renders.

First, install the CDK if it is not already in your project:

```bash
npm install @angular/cdk
```

Then wire up the viewport:

```typescript
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

interface Contact {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, FormsModule],
  template: `
    <input
      type="search"
      placeholder="Filter by name..."
      [(ngModel)]="filterText"
    />

    <cdk-virtual-scroll-viewport itemSize="56" class="viewport">
      @for (contact of filtered(); track contact.id) {
        <div class="row">
          <span class="name">{{ contact.name }}</span>
          <span class="email">{{ contact.email }}</span>
          <span class="role">{{ contact.role }}</span>
        </div>
      }
    </cdk-virtual-scroll-viewport>

    <p class="count">
      Showing {{ filtered().length }} of {{ contacts().length }} contacts
    </p>
  `,
  styles: [`
    .viewport { height: 480px; }
    .row { display: flex; gap: 1rem; align-items: center; height: 56px; border-bottom: 1px solid #eee; }
  `],
})
export class ContactListComponent implements OnInit {
  private http = inject(HttpClient);

  contacts = signal<Contact[]>([]);
  filterText = signal('');

  filtered = computed(() => {
    const q = this.filterText().toLowerCase();
    return q
      ? this.contacts().filter(c => c.name.toLowerCase().includes(q))
      : this.contacts();
  });

  ngOnInit() {
    this.http.get<Contact[]>('/api/contacts').subscribe(data => {
      this.contacts.set(data);
    });
  }
}
```

The critical attribute is `itemSize="56"` on `cdk-virtual-scroll-viewport` — this tells the fixed-size strategy that every row is exactly 56 px tall. The CDK uses this to pre-calculate which rows belong in the viewport at any scroll offset without measuring DOM elements at runtime.

The `filtered` computed signal re-evaluates only when `contacts` or `filterText` changes, and the viewport automatically recalculates its rendering window when the backing array changes length.

---

## New Tool: `@angular/cdk/scrolling` Auto-Size Strategy

When rows genuinely vary in height — expandable rows, multi-line content, embedded images — the fixed-size strategy produces incorrect scroll offsets. The CDK's auto-size strategy fixes this by measuring each item's rendered height on first paint and refining the scroll model progressively.

```typescript
import { Component } from '@angular/core';
import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy } from '@angular/cdk-experimental/scrolling';

@Component({
  standalone: true,
  imports: [ScrollingModule],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: () => new AutoSizeVirtualScrollStrategy(50, 250),
      // minBufferPx: 50, maxBufferPx: 250
    },
  ],
  template: `
    <cdk-virtual-scroll-viewport class="viewport">
      @for (item of items; track item.id) {
        <div class="variable-row">{{ item.body }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
})
export class VariableHeightListComponent {}
```

Install the experimental package alongside the CDK:

```bash
npm install @angular/cdk-experimental
```

The two constructor arguments — `minBufferPx` and `maxBufferPx` — control how many pixels of off-screen buffer the CDK keeps rendered. A larger buffer reduces the chance of a scroll-outpacing-render flash but increases DOM count; 50/250 is a reasonable starting point for most use cases.

---

## Using ZyraUI for Virtual Scroll Table UIs

A raw `cdk-virtual-scroll-viewport` gives you the scrolling engine, but production data tables need sticky headers, loading skeletons, empty states, sort controls, and selection states. Pairing the CDK viewport with [ZyraUI components](https://www.zyraui.dev/docs/components) lets you build a polished result without reinventing common UI patterns.

Here is a pattern combining the CDK viewport with the ZyraUI card and spinner components to show a realistic loading state while the dataset fetches:

```typescript
import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ZyraCardComponent } from '@zyra-ui/angular';
import { ZyraSpinnerComponent } from '@zyra-ui/angular';

interface Row { id: number; label: string; value: number; status: string; }

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, ZyraCardComponent, ZyraSpinnerComponent],
  template: `
    <zyra-card>
      <h2>Dataset ({{ rows().length }} rows)</h2>

      @if (loading()) {
        <zyra-spinner size="lg" label="Loading data..." />
      } @else if (rows().length === 0) {
        <p>No data found.</p>
      } @else {
        <div class="table-header">
          <span>Label</span><span>Value</span><span>Status</span>
        </div>

        <cdk-virtual-scroll-viewport itemSize="48" class="table-viewport">
          @for (row of rows(); track row.id) {
            <div class="table-row">
              <span>{{ row.label }}</span>
              <span>{{ row.value }}</span>
              <span>{{ row.status }}</span>
            </div>
          }
        </cdk-virtual-scroll-viewport>
      }
    </zyra-card>
  `,
  styles: [`
    .table-viewport { height: 400px; }
    .table-header, .table-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; padding: 0 1rem; }
    .table-row { height: 48px; align-items: center; border-bottom: 1px solid var(--border-color); }
  `],
})
export class DataTableComponent implements OnInit {
  private http = inject(HttpClient);
  rows = signal<Row[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.http.get<Row[]>('/api/data').subscribe({
      next: data => { this.rows.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
```

The `zyra-spinner` component handles the loading skeleton, and `zyra-card` provides consistent surface styling without hardcoding any colors — both work correctly across all five ZyraUI themes out of the box. You can explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) — including [tables, cards, spinners, and data display components](https://www.zyraui.dev/docs/components).

For more on theming and token-based styling in ZyraUI, visit the [ZyraUI docs](https://www.zyraui.dev/docs).

---

## Wrapping Up

Angular CDK Virtual Scroll is one of the highest-impact performance tools in the Angular ecosystem. Combined with `OnPush` change detection, signals-based filtering, and a component library like ZyraUI for the shell UI, you can take a list that would stall the browser at 5,000 items and scroll it at 60 fps with 500,000. The key takeaway: fix-size strategy for uniform rows, auto-size for variable heights, and always pair the viewport with reactive signal-driven data sources rather than static arrays. Visit the [ZyraUI components page](https://www.zyraui.dev/docs/components) to find the table and data display components that complement this pattern in production apps.

---

## Frequently Asked Questions

### What is Angular CDK Virtual Scroll and why does it improve performance?
Angular CDK Virtual Scroll renders only the list items currently visible in the viewport, recycling DOM nodes as the user scrolls. Instead of creating 100,000 DOM elements for a 100,000-item list, the viewport maintains a small fixed pool — typically 10–30 visible rows plus a small buffer. This drastically reduces memory usage, layout recalculation time, and change detection overhead.

### When should I use fixed-size vs auto-size virtual scroll strategy?
Use `itemSize` (fixed-size strategy) whenever all rows have a known, uniform height — it is fast, predictable, and requires no DOM measurement. Use `AutoSizeVirtualScrollStrategy` from `@angular/cdk-experimental/scrolling` when rows have genuinely variable heights, such as expandable detail rows or multi-line text content. Note that auto-size involves runtime measurement and is slightly more expensive.

### Can I combine Angular CDK Virtual Scroll with signals and OnPush change detection?
Yes — and this is the recommended pattern. Store your dataset in a `signal()` and use `computed()` for filtered or sorted views. Pass the computed signal directly to the viewport's `@for` loop. With `OnPush` change detection, Angular will only re-render when the signal value reference changes, which means filtering re-renders only the affected slice of visible rows rather than the full list.

### Does virtual scroll work with Angular SSR?
The viewport renders normally during server-side rendering — the CDK outputs a standard `<div>` container. However, the scroll-position-based recycling logic only activates in the browser where `window` and `ResizeObserver` are available. For SSR builds, the CDK correctly skips client-only APIs, so hydration works without errors; the initial HTML will contain the first visible batch of items.
