---
title: "What's New in Angular 22: Signals, @Service, and the AI Era"
description: "Angular 22 stabilizes Signal Forms and the Resource API, makes OnPush the default, and introduces @Service, injectAsync, and experimental WebMCP tools."
category:
    - "Angular 22"
tags:
    - "angular"
    - "angular 22"
    - "signals"
    - "signal forms"
    - "resource api"
keywords:
    - "Angular 22 new features"
    - "Angular 22 Signal Forms stable"
    - "Angular 22 OnPush default"
    - "Angular @Service decorator"
    - "Angular 22 WebMCP injectAsync"
date: "2026-07-25T10:00:00.000Z"
slug: "whats-new-in-angular-22"
---

# What's New in Angular 22: Signals, @Service, and the AI Era

> **TL;DR:** Angular 22, released June 3, 2026, is a consolidation release. Signal Forms and the Resource API (`resource()`, `rxResource()`, `httpResource()`) graduate from experimental to stable. `OnPush` becomes the default change detection strategy. A new `@Service()` decorator simplifies service registration. `injectAsync()` enables lazy dependency injection. And `provideExperimentalWebMcpTools()` opens the door to AI agents talking directly to your Angular app.

Every framework goes through cycles: introduce, experiment, stabilize. Angular 22 is firmly in the stabilize phase. For the past year, if you wanted to use Signal Forms or `httpResource()` in production, you were technically on experimental APIs. That changes with this release — two of the most consequential additions to the Angular ecosystem in years are now production-ready.

There is also a broader theme here that goes beyond API graduation: Angular 22 positions the framework squarely in the AI tooling era, with WebMCP support and in-browser AI debugging interfaces shipped out of the box. This post covers the most important changes you need to know.

---

## Signal Forms Are Now Stable

Signal Forms were introduced as an experimental feature in Angular 21. If you are new to Angular's signal primitives, start with [Angular Signals Explained](/blog/angular-21-signals-explained-signals-signal-forms) for the foundation. Six months later, they are stable and officially recommended for production.

The core idea: instead of `FormGroup` and `FormControl`, you manage your form data in a plain signal. Angular derives the form structure from that data automatically. Validation rules live in a schema function. Template binding uses a single directive — `[formField]` — on any input.

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, schema, required, minLength } from '@angular/forms/signals';

interface Book {
  title: string;
  isbn: string;
}

const bookSchema = schema<Book>(path => {
  required(path.title);
  minLength(path.isbn, 10);
});

@Component({
  selector: 'app-book-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, JsonPipe],
  template: `
    <form>
      <input [formField]="bookForm.title" placeholder="Title" />
      @if (bookForm.title().invalid()) {
        <p class="error">{{ bookForm.title().errors() | json }}</p>
      }

      <input [formField]="bookForm.isbn" placeholder="ISBN" />
      @if (bookForm.isbn().invalid()) {
        <p class="error">{{ bookForm.isbn().errors() | json }}</p>
      }

      <button type="submit">Save</button>
    </form>
  `,
})
export class BookFormComponent {
  protected readonly bookData = signal<Book>({ title: '', isbn: '' });
  protected readonly bookForm = form(this.bookData, bookSchema);
}
```

Each field in the `FieldTree` (the object returned by `form()`) is a signal carrying `value`, `dirty`, `invalid`, and `errors`. Angular updates them reactively as the user types. No subscriptions, no `FormControl.valueChanges`, no manual `markAsDirty()` calls.

Existing Reactive Forms code does not have to be rewritten all at once. The `@angular/forms/signals/compat` package provides `compatForm` and `SignalFormControl`, which let Signal Forms and Reactive Forms coexist in the same component tree.

Angular 22 also adds a Submission API — you define `action`, `onInvalid`, and `ignoreValidators` directly in the `form()` call — and support for dynamic schemas via `validateStandardSchema`, which works with Zod and Valibot without an adapter.

---

## The Resource API Is Production-Ready

[`resource()`, `rxResource()`, and `httpResource()`](/blog/angular-resource-api-httpresouce-signals-2026) lose their developer-preview status in Angular 22. If you have been waiting for the "not experimental" label before adopting them in production, that wait is over.

The fastest path to reactive HTTP loading is `httpResource()`:

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface Book {
  id: number;
  title: string;
  author: string;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (books.isLoading()) {
      <p>Loading...</p>
    }

    @if (books.error()) {
      <p class="error">Failed to load books.</p>
    }

    @for (book of books.value(); track book.id) {
      <div class="book-card">
        <h3>{{ book.title }}</h3>
        <p>{{ book.author }}</p>
      </div>
    }
  `,
})
export class BookListComponent {
  protected readonly searchQuery = signal('');

  protected readonly books = httpResource<Book[]>(
    () => ({
      url: '/api/books',
      params: { q: this.searchQuery() },
    }),
    { defaultValue: [] }
  );
}
```

When `searchQuery` changes, `httpResource()` automatically cancels any in-flight request and restarts — equivalent to RxJS `switchMap` but without Observable wiring. The `status` signal tracks the full lifecycle: `idle`, `loading`, `reloading`, `resolved`, `error`, and `local` (for optimistic updates).

Angular 22 also adds `resourceFromSnapshots()` for composing resources: you can transform a resource's value (filter, sort, enrich) without touching its loading logic. The companion `withPreviousValue()` utility carries the last resolved value through reloads, preventing blank states while new data arrives.

For SSR, resources now integrate with `TransferState` via the `transferCache` option — data loaded on the server transfers to the client, eliminating the redundant first-load request.

---

## OnPush Is the New Default

This is the change most likely to affect existing codebases. Starting in Angular 22, `ChangeDetectionStrategy.OnPush` applies to every component that does not explicitly set a strategy. The previous default (`Default`, now renamed `Eager`) is deprecated.

For new signal-based components this is invisible — signals already notify Angular precisely when to re-render, so `OnPush` has been the correct setting for a long time. But for components that update their view via direct property mutation outside a signal or observable, the display will silently stop updating after the upgrade.

The `ng update` command handles this automatically: it sets `changeDetection: ChangeDetectionStrategy.Eager` on every component that had no explicit strategy, preserving the previous runtime behavior. You can then migrate component by component, replacing mutable state with signals as you go.

```typescript
// Angular 22 — OnPush is now the implicit default
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `<p>{{ count() }}</p><button (click)="increment()">+</button>`,
})
export class CounterComponent {
  protected readonly count = signal(0);

  protected increment() {
    this.count.update(n => n + 1);
  }
}

// If you need the old behavior during migration:
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager, // replaces 'Default'
  // ...
})
export class LegacyComponent { }
```

---

## The @Service Decorator

One of the most ergonomic additions in Angular 22 is `@Service()`. It replaces the verbose `@Injectable({ providedIn: 'root' })` pattern for the common case: a service that lives in the root injector.

```typescript
// Before
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookStore { }

// After — Angular 22
import { Service } from '@angular/core';

@Service()
export class BookStore { }
```

`@Service()` enforces one deliberate constraint: constructor injection is not allowed. Dependencies must be resolved with `inject()`. This is not a bug — it is a nudge toward the functional DI style Angular has been moving toward since Angular 14.

The Angular CLI now generates services with `@Service()` by default (`ng generate service book-store`). If you specifically need `@Injectable()`, pass `--injectable`.

`@Service()` always provides the class at the root injector — there is no option to opt out of that. For services that should not be auto-provided at root — for example, services scoped to a lazy route or a specific component — stick with `@Injectable()` and provide the class manually where it belongs:

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class TabRegistry { }
```

`@Injectable()` is not deprecated. Use it when you need `providedIn: 'platform'`, constructor injection for third-party interop, or other configurations that `@Service()` does not expose.

---

## injectAsync: Lazy Dependency Injection

`injectAsync()` solves a real performance problem: heavyweight services — PDF renderers, Markdown parsers, chart engines — should not appear in the initial bundle. Until now, implementing a lazily loaded service required manual `Injector.get()` calls and your own caching logic. `injectAsync()` handles all of that.

```typescript
import { Component, ChangeDetectionStrategy, injectAsync, onIdle, signal, input } from '@angular/core';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="preview()">Preview</button>
    <div [innerHTML]="renderedHtml()"></div>
  `,
})
export class PostEditorComponent {
  readonly content = input('');
  protected readonly renderedHtml = signal('');

  // The MarkdownParser bundle is NOT included in the initial chunk.
  // prefetch: onIdle loads it when the browser is idle, so the first
  // call to preview() is instant rather than waiting for a network request.
  readonly #markdownParser = injectAsync(
    () => import('../markdown-parser').then(m => m.MarkdownParser),
    { prefetch: onIdle }
  );

  async preview() {
    const parser = await this.#markdownParser();
    this.renderedHtml.set(parser.render(this.content()));
  }
}
```

The `prefetch: onIdle` option is the key detail. It schedules the bundle download during browser idle time (using `requestIdleCallback`, with a `setTimeout` fallback). The lazy service is available before the user needs it, but does not delay the initial page load.

For the lazy injection to resolve correctly, the service must be auto-provided — either with `@Injectable({ providedIn: 'root' })` or with the new `@Service()`.

---

## debounced: Signals That Wait

Angular 22 introduces `debounced()` — a way to delay a signal's emission without leaving the signal world. Previously, debouncing required converting to an Observable, applying `debounceTime()`, then converting back with `toSignal()`. Now:

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { debounced, resource } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input [value]="query()" (input)="query.set($any($event.target).value)" />

    @for (result of results.value(); track result.id) {
      <p>{{ result.title }}</p>
    }
  `,
})
export class SearchComponent {
  protected readonly query = signal('');
  protected readonly debouncedQuery = debounced(this.query, 300);

  protected readonly results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({ params }) => fetch(`/api/search?q=${params}`).then(r => r.json()),
  });
}
```

`debounced()` returns a `Resource` whose `value` is updated only after the specified millisecond delay. The `status` signal shows `loading` while waiting and `resolved` after the value settles. `debounced()` must be called inside an injection context so Angular can clean up the underlying timer when the injector is destroyed.

---

## WebMCP: AI Agents Can Now Talk to Your App

The most forward-looking addition in Angular 22 is experimental support for WebMCP — the Web Model Context Protocol. It lets browser-based AI agents (Claude, Gemini, and others) call structured tools exposed by your Angular application, rather than scraping the DOM or simulating clicks.

```typescript
// app.config.ts
import { provideExperimentalWebMcpTools } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpTools(),
    // ...
  ],
};
```

Once enabled, you declare tools with `declareExperimentalWebMcpTool()`. Angular registers them in the injector and removes them automatically when the injector is destroyed — which means route-scoped tools disappear when the user navigates away. Tool input is declared with `inputSchema` — the same field name the underlying Model Context Protocol spec uses — as a JSON Schema object:

```typescript
import { Service, inject } from '@angular/core';
import { declareExperimentalWebMcpTool } from '@angular/core';
import { BookStore } from './book-store';

@Service()
export class BookMcpTools {
  readonly #store = inject(BookStore);

  readonly searchBooks = declareExperimentalWebMcpTool({
    name: 'search_books',
    description: 'Search the catalog by title or author',
    inputSchema: { query: { type: 'string' } },
    execute: ({ query }) => this.#store.search(query),
  });
}
```

The bridge to Signal Forms is particularly interesting: with the `experimentalWebMcpTool` option on `form()`, Angular automatically exposes the form as a WebMCP tool with a JSON schema derived from the validation rules. This bridge needs its own provider alongside `provideExperimentalWebMcpTools()`:

```typescript
// app.config.ts
import { provideExperimentalWebMcpTools, provideExperimentalWebMcpFormsBridge } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpTools(),
    provideExperimentalWebMcpFormsBridge(),
    // ...
  ],
};
```

An AI agent can fill out the form through the tool rather than through the DOM.

In development mode, Angular 22 also registers `angular:di-graph` — a debug interface that exposes the full dependency injection graph to in-browser AI assistants. This is a preview of what AI-assisted Angular debugging will look like.

---

## Other Notable Changes

**Incremental Hydration is now the default.** If your app uses `provideClientHydration()`, Incremental Hydration activates automatically. Use `withNoIncrementalHydration()` to opt out.

**HttpClient now uses the Fetch API by default.** `withFetch()` is deprecated. The only case that requires explicit configuration is upload progress tracking — for that, call `provideHttpClient(withXhr())`. The `ng update` migration handles existing projects automatically.

**Template syntax improvements:** Arrow functions with implicit returns are now valid in templates (`@for (item of items(); track item.id) { <button (click)="select((x) => x.id === item.id)">...</button> }`). Spread syntax works in object and array bindings. `instanceof` is valid inside `@if`. Exhaustive `@switch` via `@default never;` catches unhandled union variants at compile time.

**`isActive()` returns a signal.** Instead of subscribing to router events to track active routes, inject a Signal: `protected readonly dashboardActive = isActive('/dashboard', this.router);`. Use it directly in class bindings.

**TypeScript 6 is required.** TypeScript 5.9 support was dropped in Angular 21.2. Node.js 26 is now officially supported.

**Webpack builders are deprecated.** The esbuild-based `application` builder is the default for all new projects and has been for several major versions. If your project is still using `@angular-devkit/build-angular:browser`, migrate now: `ng update @angular/cli --name use-application-builder`.

---

## Upgrading

Run the standard update command:

```bash
ng update @angular/core@22 @angular/cli@22
```

The included schematics handle:
- Setting `ChangeDetectionStrategy.Eager` on components without an explicit strategy
- Removing `withFetch()` from `provideHttpClient()` (now the default)
- Adding `withXhr()` where upload progress was in use
- Removing redundant `withIncrementalHydration()` from `provideClientHydration()`
- Converting `fakeAsync`/`tick` test patterns to Vitest fake timers (if you have already migrated to Vitest)

---

## Wrapping Up

Angular 22 closes out the experimental phase for two of the framework's biggest bets. The [official Angular 22 release announcement](https://blog.angular.dev/angular-v22-is-now-available-e0e9dd7f8571) covers the full changelog. Signal Forms and the Resource API are production-ready — no more hedging in code reviews, no more "we'll wait until it's stable." Combined with `OnPush` as the default, `@Service()`, and `injectAsync()`, Angular 22 is the clearest expression yet of what signal-first Angular looks like end to end. Start with `ng update`, let the schematics land, then migrate one component or form at a time.

---

## Frequently Asked Questions

### Do I need to update all my components to OnPush after upgrading to Angular 22?

No. Running `ng update` automatically adds `changeDetection: ChangeDetectionStrategy.Eager` to every component that did not have an explicit strategy, preserving the previous runtime behavior. You can then opt individual components into `OnPush` at your own pace. Components already using signals will generally work correctly with `OnPush` without any changes.

### Is @Injectable() deprecated now that @Service() exists?

No. `@Injectable()` remains fully supported. `@Service()` is a shorthand for the most common case — `providedIn: 'root'` with `inject()`-based DI. Use `@Injectable()` when you need constructor injection for third-party library interop, `providedIn: 'platform'`, or other configuration options that `@Service()` does not expose.

### Can I use Signal Forms alongside existing Reactive Forms?

Yes. The `@angular/forms/signals/compat` package provides `compatForm` and `SignalFormControl` to bridge the two worlds. A Signal Form can contain Reactive Form controls, and vice versa. Angular's documentation includes a migration guide with both top-down and bottom-up strategies for incremental adoption.

### What does WebMCP actually enable that I couldn't do before?

WebMCP lets browser-based AI agents interact with your app through declared, typed tool calls rather than DOM scraping or simulated user input. This means an agent can call `search_books({ query: "..."})` and get a structured JSON response instead of clicking into a search field and parsing whatever text appears on screen. It's experimental in Angular 22 — aimed at developers building AI-assisted app experiences, not something most apps need on day one.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular resource() and httpResource(): Reactive HTTP with Signals](/blog/angular-resource-api-httpresouce-signals-2026)
- [Angular v21 Zoneless Guide: Remove ZoneJS, Use Signals](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals)
- [NgRx Signal Store: Lightweight, Signal-Based State Management for Angular](/blog/ngrx-signal-store-angular-2026)
- [Official Angular 22 release announcement](https://blog.angular.dev/angular-v22-is-now-available-e0e9dd7f8571)
