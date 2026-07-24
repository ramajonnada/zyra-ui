---
title: "afterRenderEffect() in Angular 21: DOM-Safe Reactive Side Effects"
description: "Learn how afterRenderEffect() solves the DOM access problem in Angular 21 — reactive, SSR-safe, and signal-aware without lifecycle hook workarounds."
category:
    - "Angular 21"
tags:
    - "angular"
    - "signals"
    - "afterRenderEffect"
    - "DOM"
    - "performance"
keywords:
    - "afterRenderEffect Angular 21"
    - "Angular DOM-safe side effects"
    - "Angular signals DOM access"
    - "afterRenderEffect vs ngAfterViewInit"
    - "Angular SSR safe DOM manipulation"
date: "2026-07-24T10:00:00.000Z"
slug: "angular-afterrendereffect-dom-safe-side-effects-2026"
---

# afterRenderEffect() in Angular 21: DOM-Safe Reactive Side Effects

> **TL;DR:** `afterRenderEffect()` is Angular's answer to a classic problem — how do you run DOM-dependent code reactively, in response to signal changes, without breaking SSR? It runs after each render cycle, is guaranteed to have a stable DOM, and automatically tracks signal dependencies just like `effect()`.

If you have ever tried to initialize a chart library inside a signal `effect()` and gotten a cryptic error about running outside the Angular zone, or patched it with `ngAfterViewInit` only to find it fires once and never reacts to state changes, you are not alone. This pattern trips up most developers migrating to signals-first Angular.

The root cause is a separation that Angular has always enforced but that signals make more obvious: reading signal state and touching the DOM are two different phases of a render. `afterRenderEffect()` is the API that bridges them cleanly.

---

## The Problem: DOM Access in the Wrong Phase

Consider a common scenario — a chart component that wraps a third-party canvas library. The chart needs a DOM element to mount on, and it needs to re-render whenever a `data` signal changes.

The naive approach with `effect()` breaks:

```typescript
import { Component, ElementRef, ViewChild, signal, effect, inject } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  data = input.required<number[]>();

  constructor() {
    effect(() => {
      const values = this.data(); // track the signal
      // ERROR: this.canvasRef.nativeElement is undefined here
      // effect() runs during change detection, before the DOM is committed
      initChart(this.canvasRef.nativeElement, values);
    });
  }
}
```

The `@ViewChild` element does not exist yet when `effect()` first runs. Even if you guard with a null check, the effect will not re-run when the DOM is ready unless the signal changes. And `ngAfterViewInit` fires once, is not reactive, and involves importing `AfterViewInit` and writing imperative subscription code that you then have to clean up.

---

## The Solution: afterRenderEffect()

`afterRenderEffect()` runs after Angular has committed the DOM for a given render cycle. It tracks signal dependencies exactly like `effect()`, so it re-runs automatically whenever signals it reads change — but it only fires when those changes have been flushed to the DOM.

Here is the corrected component:

```typescript
import {
  Component,
  ElementRef,
  ViewChild,
  input,
  afterRenderEffect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  data = input.required<number[]>();

  private chart: Chart | null = null;

  constructor() {
    afterRenderEffect(() => {
      const values = this.data(); // reactive dependency

      if (this.chart) {
        this.chart.data.datasets[0].data = values;
        this.chart.update();
      } else {
        this.chart = new Chart(this.canvasRef.nativeElement, {
          type: 'bar',
          data: { datasets: [{ data: values }] },
        });
      }
    });
  }
}
```

When `data` changes, Angular runs change detection, commits the DOM, and then fires your `afterRenderEffect` callback — in that order, every time. The DOM is always stable when your callback runs.

---

## How afterRenderEffect() Compares to the Alternatives

`ngAfterViewInit` fires once after the component's view is initialized. It is not reactive. If you need to respond to signal changes after the DOM updates, you end up creating a subscription or calling `effect()` inside the lifecycle method — which then hits the original problem again.

`effect()` runs during the change detection phase, before the DOM is committed. This is by design: Angular processes signal graph changes, runs effects, then writes to the DOM. If you try to read a DOM element inside `effect()`, you are racing the renderer.

`afterNextRender()` runs once after the next render, then never again. It is useful for one-shot initialization (measuring a container's initial size, for example) but not for reactive updates.

`afterRenderEffect()` sits in the gap all of these leave. It is reactive like `effect()` and DOM-aware like `afterNextRender()`:

| API | Reactive | DOM-safe | Runs how often |
|-----|----------|----------|----------------|
| `ngAfterViewInit` | No | Yes | Once |
| `afterNextRender()` | No | Yes | Once |
| `effect()` | Yes | No | On every signal change |
| `afterRenderEffect()` | Yes | Yes | On every signal change that causes a render |

---

## Cleanup Is Built In

Like `effect()`, `afterRenderEffect()` accepts an `onCleanup` parameter so you can tear down resources before each re-run:

```typescript
afterRenderEffect((onCleanup) => {
  const values = this.data();

  const chart = new Chart(this.canvasRef.nativeElement, {
    type: 'line',
    data: { datasets: [{ data: values }] },
  });

  onCleanup(() => chart.destroy());
});
```

When `data` changes, Angular destroys the previous chart instance before creating the new one. No memory leaks, no stale references, no manual teardown in `ngOnDestroy`.

---

## New Tool: ngxtension

`afterRenderEffect()` integrates well with the [ngxtension](https://ngxtension.netlify.app/) utility library, a community collection of Angular primitives that fills common gaps in the framework. Two utilities are particularly useful alongside DOM-reactive effects:

```bash
npm install ngxtension
```

`injectElementRef()` is a functional alternative to `@ViewChild('canvas')` for the host element:

```typescript
import { injectElementRef } from 'ngxtension/inject-element-ref';

export class ChartComponent {
  private host = injectElementRef<HTMLElement>();
  data = input.required<number[]>();

  constructor() {
    afterRenderEffect(() => {
      const canvas = this.host.nativeElement.querySelector('canvas');
      const values = this.data();
      // mount chart on canvas
    });
  }
}
```

`rxEffect()` from ngxtension is the RxJS counterpart — useful if your data source is an Observable rather than a signal. But for pure signal pipelines, `afterRenderEffect()` alone is enough.

---

## SSR and the Platform Check

`afterRenderEffect()` is SSR-safe by design: it does not run on the server at all. Angular's renderer runs in a no-op mode during server-side rendering, and `afterRenderEffect` callbacks are simply not invoked. You do not need to wrap your callback in `isPlatformBrowser()` checks — the framework handles it.

This is a meaningful improvement over `ngAfterViewInit`, which does run on the server and requires manual platform guards when you access browser APIs.

---

## Wrapping up

`afterRenderEffect()` closes a real gap in Angular's signal story. Before it existed, DOM-reactive code either required lifecycle hook gymnastics or broke SSR silently. The API is small — one function, the same cleanup pattern as `effect()` — and it composes naturally with `input()`, `signal()`, and `computed()`. Next time you reach for `ngAfterViewInit` plus an `effect()` workaround, check whether `afterRenderEffect()` does the job in a single call.

---

## Frequently asked questions

### What is the difference between afterRenderEffect() and effect()?

`effect()` runs during Angular's change detection phase, before the DOM is updated. `afterRenderEffect()` runs after Angular has committed changes to the DOM. Both track signal dependencies reactively, but only `afterRenderEffect()` guarantees the DOM is stable when your callback fires, which makes it safe for third-party library initialization, canvas operations, and measurements that depend on layout.

### Does afterRenderEffect() work with Angular SSR?

Yes. `afterRenderEffect()` does not run on the server during SSR. Angular's server-side renderer operates in a headless mode and skips all `afterRender*` callbacks automatically. You do not need to add `isPlatformBrowser()` guards inside your callback, which reduces boilerplate compared to `ngAfterViewInit`-based approaches.

### Can I use afterRenderEffect() outside a component?

`afterRenderEffect()` must be called in an injection context — inside a constructor, a field initializer, or a function called with `runInInjectionContext()`. It cannot be called from an arbitrary async callback. This is the same constraint as `effect()` and `inject()`. If you need to call it outside a component, pass the `Injector` explicitly as an option: `afterRenderEffect(fn, { injector: this.injector })`.

### When should I use afterNextRender() instead?

Use `afterNextRender()` for one-time setup that only needs to happen once after the component's first render — for example, measuring initial element dimensions, setting an autofocus, or initializing a library that does not need to respond to signal changes. Use `afterRenderEffect()` when the initialization needs to repeat whenever reactive state changes after a render cycle.
