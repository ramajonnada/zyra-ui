---
title: "Angular effect() Cleanup: Preventing Memory Leaks with DestroyRef"
description: "Learn how to clean up side effects inside Angular's effect() function using the onCleanup callback and DestroyRef, and avoid the most common signal-based memory leaks."
category:
    - "Angular 21"
tags:
    - "angular"
    - "effect"
    - "destroyref"
    - "signals"
    - "memory leaks"
keywords:
    - "angular effect cleanup"
    - "angular destroyref"
    - "angular effect memory leak"
    - "angular oncleanup effect"
    - "angular 21 effect api"
date: "2026-07-23T14:00:00.000Z"
slug: "angular-effect-cleanup-destroyref-memory-leaks-2026"
---

# Angular effect() Cleanup: Preventing Memory Leaks with DestroyRef

> **TL;DR:** `effect()` runs a function whenever the signals it reads change, but if that function starts something — a timer, a subscription, an event listener, a WebSocket — it needs to stop that thing before the next run and when the component is destroyed. `effect()`'s callback receives an `onCleanup` function for exactly this, and every `effect()` is automatically tied to its enclosing injection context's lifetime via `DestroyRef`, so it stops on its own when the component is destroyed — but only if you clean up what you started inside it.

`effect()` is convenient specifically because it *feels* like it doesn't need cleanup — no subscription object to store, no explicit `.unsubscribe()` call at the bottom of `ngOnDestroy`. That convenience hides a real trap: if the function passed to `effect()` starts something with a lifetime (a `setInterval`, an `addEventListener`, a WebSocket connection), and you don't explicitly stop it, it keeps running — including the *previous* run's version of it, even after the effect re-runs with new signal values.

---

## The Leak: Starting Something Without Stopping It

```typescript
import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';

@Component({
  selector: 'app-live-price',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ price }}</span>`,
})
export class LivePriceComponent {
  symbol = input.required<string>();
  price = '';

  constructor() {
    effect(() => {
      const sym = this.symbol();
      // BUG: a new interval is created every time `symbol` changes,
      // but the previous interval is never cleared.
      setInterval(() => this.fetchPrice(sym), 2000);
    });
  }

  private fetchPrice(symbol: string) {
    // ...
  }
}
```

Every time the parent changes `symbol` — say, switching from "AAPL" to "GOOG" — this effect re-runs and calls `setInterval` again. The first interval, still polling for "AAPL", is never cleared. Switch symbols five times and you have five intervals running concurrently, each fetching a different symbol's price into the same component. Worse, none of them stop when the component itself is destroyed, because nothing ever called `clearInterval`.

---

## The Fix: onCleanup

The function passed to `effect()` receives a second parameter — an object with an `onCleanup` method. Register a cleanup callback with it, and Angular calls that callback immediately before the *next* run of the effect, and one final time when the effect itself is destroyed:

```typescript
import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';

@Component({
  selector: 'app-live-price',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ price }}</span>`,
})
export class LivePriceComponent {
  symbol = input.required<string>();
  price = '';

  constructor() {
    effect((onCleanup) => {
      const sym = this.symbol();
      const intervalId = setInterval(() => this.fetchPrice(sym), 2000);

      onCleanup(() => clearInterval(intervalId));
    });
  }

  private fetchPrice(symbol: string) {
    // ...
  }
}
```

Now, when `symbol` changes from "AAPL" to "GOOG", Angular calls the registered cleanup (clearing the old interval) *before* running the effect body again with the new value. Exactly one interval is ever active. When the component is destroyed, the same cleanup runs one last time, so nothing is left polling after the component is gone.

---

## Why effect() Doesn't Need ngOnDestroy for This

Every `effect()` call captures the injection context it was created in — normally a component's constructor — and Angular ties the effect's own lifetime to that context via `DestroyRef` internally. You don't need to inject `DestroyRef` yourself or write an `ngOnDestroy` just to stop the effect from running after the component is destroyed; that part is automatic.

`DestroyRef` becomes relevant when you want to register cleanup logic *outside* of an effect, or want a component to clean something up on destroy without wrapping it in a reactive `effect()` at all:

```typescript
import { Component, DestroyRef, inject } from '@angular/core';

@Component({ selector: 'app-socket-status', standalone: true, template: `` })
export class SocketStatusComponent {
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const socket = new WebSocket('wss://example.com/status');

    // Not signal-driven — just "run this exactly once on destroy."
    this.destroyRef.onDestroy(() => socket.close());
  }
}
```

The rule of thumb: if the side effect should restart whenever some signal changes, use `effect()` with `onCleanup`. See [Angular Signals Explained](/blog/angular-21-signals-explained-signals-signal-forms) for the full signal primitives overview including `computed()` and `effect()`. If it's a one-time setup for the component's whole lifetime with no signal dependency, `DestroyRef.onDestroy()` alone is simpler and doesn't need the reactive machinery of `effect()` at all.

---

## A Second Common Leak: Event Listeners

The same pattern applies to any browser API that returns a "stop" handle or needs a matching "remove":

```typescript
import { Component, ChangeDetectionStrategy, input, effect, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-resize-watcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #box class="watched-box"><ng-content /></div>`,
})
export class ResizeWatcherComponent {
  private readonly el = inject(ElementRef<HTMLElement>);
  threshold = input(400);

  constructor() {
    effect((onCleanup) => {
      const minWidth = this.threshold();
      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        this.el.nativeElement.classList.toggle('is-narrow', width < minWidth);
      });

      observer.observe(this.el.nativeElement);
      onCleanup(() => observer.disconnect());
    });
  }
}
```

Without the `onCleanup(() => observer.disconnect())` call, changing `threshold` would create a new `ResizeObserver` on top of the old one, doubling (then tripling) the work done on every resize — a classic gradual-slowdown bug that's easy to miss in development and painful in production under real usage.

---

## Wrapping up

`effect()`'s automatic tie to `DestroyRef` handles the "stop running after the component dies" half of cleanup for free — that part genuinely needs no boilerplate. (The [official Angular signals guide](https://angular.dev/guide/signals) documents the full effect lifecycle.) But it can't know what *you* started inside the callback. Any `setInterval`, `setTimeout`, `addEventListener`, `ResizeObserver`, `IntersectionObserver`, or subscription created inside an `effect()` needs an explicit `onCleanup()` call undoing it, or it leaks — both across re-runs of the same effect and, ultimately, past the component's own destruction. For DOM-safe reactive side effects that run after rendering, see [afterRenderEffect() in Angular 21](/blog/angular-afterrendereffect-dom-safe-side-effects-2026). The fix is one line per resource; the bug it prevents is the kind that only shows up after your app has been open for a while.

---

## Frequently asked questions

### Does every effect() need onCleanup?

No — only effects that start something with a lifetime (a timer, a listener, a subscription, an observer). An effect that just recomputes a value, updates a DOM property directly, or calls `console.log()` has nothing to clean up, since there's no ongoing resource left running after the callback returns.

### What's the difference between onCleanup and DestroyRef.onDestroy()?

`onCleanup()` is scoped to a single `effect()` — it runs before every re-run of that specific effect *and* once when the effect is destroyed. `DestroyRef.onDestroy()` is scoped to the entire injection context (usually the component) and runs exactly once, when that context is destroyed — it has no concept of "re-running."

### Can I call onCleanup() more than once inside the same effect run?

Yes. Each call registers an additional cleanup callback, and Angular runs all of them, in registration order, before the next effect run or on final destroy. This is useful when a single effect run starts more than one resource (e.g. two separate listeners).

### Does forgetting cleanup cause an error, or just a silent leak?

Silent leak, which is what makes it dangerous — there's no thrown exception or console warning by default. The symptom is usually degraded performance or duplicated side effects (multiple network requests, multiple DOM class toggles) that only becomes obvious after the affected signal has changed several times, which is often well into normal usage rather than during initial testing.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [afterRenderEffect() in Angular 21: DOM-Safe Reactive Side Effects](/blog/angular-afterrendereffect-dom-safe-side-effects-2026)
- [Angular linkedSignal(): Derived Writable Signals Explained](/blog/angular-linked-signal-derived-writable-signals-2026)
- [Angular toSignal() and toObservable(): RxJS ↔ Signals Interop](/blog/angular-tosignal-toobservable-rxjs-interop-2026)
- [Official Angular signals guide](https://angular.dev/guide/signals)
