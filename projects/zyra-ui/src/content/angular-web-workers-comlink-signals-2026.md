---
title: "Angular Web Workers with Comlink and Signals for Non-Blocking Heavy Tasks"
description: "Run CPU-heavy tasks off the main thread in Angular using Web Workers and Comlink, then pipe results directly into signals for reactive, jank-free UIs."
category:
    - "Angular 21"
tags:
    - "angular"
    - "web workers"
    - "comlink"
    - "signals"
    - "performance"
keywords:
    - "Angular Web Workers tutorial"
    - "Comlink Angular integration"
    - "non-blocking Angular performance"
    - "Angular signals web worker"
    - "offload heavy computation Angular"
date: "2026-08-01T10:00:00.000Z"
slug: "angular-web-workers-comlink-signals-2026"
---

# Angular Web Workers with Comlink and Signals for Non-Blocking Heavy Tasks

> **TL;DR:** Web Workers move CPU-heavy work off Angular's main thread, eliminating UI jank. Comlink wraps the worker in a transparent async proxy so you never write `postMessage` by hand. Feeding results into a [signal](/blog/angular-21-signals-explained-signals-signal-forms) gives you reactive UI updates with zero extra plumbing.

You open a CSV with 80,000 rows and hit "Analyze." The browser freezes for three seconds. Buttons stop responding. The spinner stops spinning. Users assume it crashed.

This is the classic main-thread blockage problem. JavaScript is single-threaded, which means anything CPU-intensive — parsing, sorting, filtering, matrix math, client-side ML inference — competes directly with rendering, event handling, and Angular's change detection. The solution browsers have had for years, but that Angular developers underuse, is the Web Worker.

---

## The Problem: Heavy Computation Blocks the UI

Consider a component that scores a large dataset of product records against a set of user-defined criteria. The naive implementation runs the loop synchronously:

```typescript
// score.component.ts  — blocks the main thread
import { Component, signal, computed } from '@angular/core';
import { scoreRecords } from './scoring.utils';

@Component({
  selector: 'app-score',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="run()">Score dataset</button>
    @if (running()) {
      <p>Analyzing...</p>
    }
    @if (result()) {
      <p>Top score: {{ result()!.topScore }}</p>
    }
  `,
})
export class ScoreComponent {
  running = signal(false);
  result = signal<{ topScore: number } | null>(null);

  run() {
    this.running.set(true);
    // This call blocks for 2-4 seconds on large datasets
    const output = scoreRecords(largeDataset, criteria);
    this.result.set(output);
    this.running.set(false);
  }
}
```

Even with `OnPush`, the `"Analyzing..."` text never renders because the browser cannot paint while `scoreRecords()` is running. The `running` signal flips to `true` but the repaint is queued and never executed until the main thread is free again — after the work is already done.

---

## The Concept: Web Workers + Angular's CLI Support

A Web Worker runs JavaScript on a background thread, leaving the main thread free to handle rendering and user input. Browsers have supported workers since 2010, but wiring them up with `postMessage`/`onmessage` is tedious and type-unsafe.

Angular CLI has built-in worker scaffolding. You can generate a worker file that's automatically bundled:

```bash
ng generate web-worker scoring
```

This creates `src/app/scoring.worker.ts` and wires up the build configuration. The generated file is a valid Worker that Angular's esbuild pipeline bundles separately, so you get tree-shaking and type checking for free.

The traditional approach requires you to `postMessage` inputs and listen for `onmessage` responses — essentially a stringly-typed event bus:

```typescript
// scoring.worker.ts (naive approach — avoid this)
/// <reference lib="webworker" />
addEventListener('message', ({ data }) => {
  const result = scoreRecords(data.dataset, data.criteria);
  postMessage(result);
});
```

```typescript
// component (naive approach — avoid this)
const worker = new Worker(new URL('./scoring.worker', import.meta.url));
worker.onmessage = ({ data }) => { /* ... */ };
worker.postMessage({ dataset, criteria });
```

This works but you lose all type safety: any object can be posted, the callback shape is untyped, and error handling is manual. Comlink solves this entirely.

---

## The Tool: Comlink for Type-Safe Worker Proxies

[Comlink](https://github.com/GoogleChromeLabs/comlink) is a small library (~2.5 kB gzipped) from the Google Chrome team that wraps any Worker in a transparent `Proxy`. You export a class or object from the worker, and Comlink gives you an async mirror of it on the main thread — with full TypeScript inference.

```bash
npm install comlink
```

Rewrite the worker to export a class:

```typescript
// scoring.worker.ts
/// <reference lib="webworker" />
import { expose } from 'comlink';
import { scoreRecords } from './scoring.utils';

export class ScoringWorker {
  score(dataset: ProductRecord[], criteria: ScoringCriteria): ScoringResult {
    return scoreRecords(dataset, criteria);
  }

  filter(dataset: ProductRecord[], minScore: number): ProductRecord[] {
    return dataset.filter(r => scoreRecords([r], {}).topScore >= minScore);
  }
}

expose(ScoringWorker);
```

On the main thread, `wrap` gives you an `async` version of the class. Every method call returns a `Promise`, transparently:

```typescript
// scoring-worker.service.ts
import { Injectable } from '@angular/core';
import { wrap, Remote } from 'comlink';
import type { ScoringWorker } from './scoring.worker';

@Injectable({ providedIn: 'root' })
export class ScoringWorkerService {
  private worker = new Worker(new URL('./scoring.worker', import.meta.url), {
    type: 'module',
  });
  private remote: Remote<ScoringWorker>;

  constructor() {
    const WorkerClass = wrap<typeof ScoringWorker>(this.worker);
    this.remote = new WorkerClass();
  }

  score(dataset: ProductRecord[], criteria: ScoringCriteria) {
    // remote.score() is typed: Promise<ScoringResult>
    return this.remote.then(r => r.score(dataset, criteria));
  }
}
```

Wait — `Remote<ScoringWorker>` wraps the constructor too, so the instance itself is a `Promise`. A cleaner pattern stores the remote instance directly:

```typescript
@Injectable({ providedIn: 'root' })
export class ScoringWorkerService implements OnDestroy {
  private readonly worker = new Worker(
    new URL('./scoring.worker', import.meta.url),
    { type: 'module' }
  );

  // `wrap` returns a proxied constructor; calling `new` gives a proxied instance
  private readonly api = wrap<InstanceType<typeof ScoringWorker>>(this.worker);

  async score(
    dataset: ProductRecord[],
    criteria: ScoringCriteria
  ): Promise<ScoringResult> {
    return this.api.score(dataset, criteria);
  }

  async filter(dataset: ProductRecord[], minScore: number): Promise<ProductRecord[]> {
    return this.api.filter(dataset, minScore);
  }

  ngOnDestroy() {
    this.worker.terminate();
  }
}
```

TypeScript knows the return type of `score()` is `Promise<ScoringResult>` because Comlink infers it from the real class definition. If you rename or change the method signature, the TypeScript compiler catches the mismatch immediately.

---

## Wiring the Worker Result into a Signal

With the service in place, the component becomes a straightforward async → signal bridge:

```typescript
// score.component.ts
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScoringWorkerService } from './scoring-worker.service';
import type { ScoringResult } from './scoring.utils';

@Component({
  selector: 'app-score',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="run()" [disabled]="running()">
      {{ running() ? 'Analyzing...' : 'Score dataset' }}
    </button>

    @if (error()) {
      <p class="error">{{ error() }}</p>
    }

    @if (result(); as r) {
      <p>Top score: {{ r.topScore }}</p>
      <p>Records scored: {{ r.count }}</p>
    }
  `,
})
export class ScoreComponent {
  private scoringService = inject(ScoringWorkerService);

  running = signal(false);
  result = signal<ScoringResult | null>(null);
  error = signal<string | null>(null);

  async run() {
    this.running.set(true);
    this.error.set(null);

    try {
      const output = await this.scoringService.score(largeDataset, criteria);
      this.result.set(output);
    } catch (e) {
      this.error.set('Analysis failed. Please try again.');
    } finally {
      this.running.set(false);
    }
  }
}
```

Because `run()` is `async` and the heavy work happens in the worker, the `this.running.set(true)` call now takes effect immediately. Angular can render the "Analyzing..." state, animate a spinner, and handle other user interactions while the worker crunches numbers in parallel.

### Transferable objects for large payloads

If your dataset is very large, serializing it through `postMessage` costs time proportional to the data size (structured clone). For `ArrayBuffer`, `TypedArray`, and `ImageBitmap`, you can transfer ownership instead of copying — zero-copy across the thread boundary:

```typescript
// In the service — pass transferable to Comlink via transfer()
import { transfer } from 'comlink';

async processBuffer(buffer: ArrayBuffer): Promise<Float32Array> {
  return this.api.processBuffer(transfer(buffer, [buffer]));
}
```

After transfer, the original `buffer` reference in the main thread is neutered (detached). The worker owns it. This matters for ML inference pipelines where you're passing `Float32Array` tensors.

---

## Wrapping Up

Moving CPU-heavy work to a Web Worker is one of the highest-impact Angular performance changes you can make — it directly unblocks rendering and event handling during long computations. Comlink removes the main friction point (hand-written `postMessage` protocol) by giving you a typed async proxy with almost no boilerplate. Feeding the results into signals means your UI reacts automatically with Angular's existing change detection pipeline. For other Angular performance techniques, see [Angular @defer Blocks](/blog/angular-defer-blocks-lazy-loading-2026) for lazy loading and [Angular UI Performance in Zoneless Apps](/blog/angular-ui-library-zoneless-ai-streaming-rerenders) for streaming scenarios.

Pick one slow operation in your current app — a data filter, a report aggregation, a schema validator — spin up a worker with `ng generate web-worker`. For other Angular performance techniques, see [Angular @defer Blocks](/blog/angular-defer-blocks-lazy-loading-2026) for lazy loading and [Angular UI Performance in Zoneless Apps](/blog/angular-ui-library-zoneless-ai-streaming-rerenders) for streaming scenarios., wrap it with Comlink, and measure the difference in your browser's Performance panel.

---

## Frequently asked questions

### Can I use Angular services inside a Web Worker?
No. Workers run in a separate global scope without access to the DOM or Angular's DI container. Keep worker code as plain TypeScript utilities — pure functions or classes with no Angular imports. If you need data from a service, fetch it on the main thread first and pass it to the worker as a plain object.

### Does Comlink work with Angular's build system (esbuild)?
Yes. Comlink is a pure ES module library and works with Angular's esbuild-based builder in Angular 17+. The `ng generate web-worker` command configures the build correctly. You just need to make sure you use `{ type: 'module' }` in the `Worker` constructor so esbuild knows to bundle the worker as an ES module.

### How many workers should I create?
Create one worker instance per task type and reuse it — do not create a new `Worker` on every button click. Worker startup has overhead (parsing, initialization). The pattern shown in `ScoringWorkerService` creates one worker in the service constructor and terminates it only on `ngOnDestroy`. For parallel work, a worker pool is the next step (libraries like `workerpool` handle this).

### What data types can be passed to a worker?
Structured-cloneable types: plain objects, arrays, `ArrayBuffer`, `TypedArray`, `Map`, `Set`, `Date`, `RegExp`, and `Error`. You cannot pass functions, DOM nodes, or class instances with methods. Comlink handles serialization transparently for supported types, and the TypeScript compiler will surface type errors if you try to pass something that cannot be cloned.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular @defer Blocks: Lazy Load Any Component Instantly](/blog/angular-defer-blocks-lazy-loading-2026)
- [Angular v21 Zoneless Guide: Remove ZoneJS, Use Signals](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals)
- [Angular UI Performance in Zoneless, AI-Streaming Apps](/blog/angular-ui-library-zoneless-ai-streaming-rerenders)
- [Comlink on npm](https://www.npmjs.com/package/comlink)
