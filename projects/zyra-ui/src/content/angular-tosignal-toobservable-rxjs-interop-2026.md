---
title: "Angular toSignal() and toObservable(): RxJS ↔ Signals Interop"
description: "Learn Angular's toSignal() and toObservable() rxjs-interop functions: converting Observables to signals and back, with initialValue, error handling, and injection context rules."
category:
    - "Angular 21"
tags:
    - "angular"
    - "rxjs"
    - "tosignal"
    - "toobservable"
    - "signals"
keywords:
    - "angular toSignal"
    - "angular toObservable"
    - "rxjs interop angular signals"
    - "angular signals and rxjs"
    - "angular 21 rxjs interop"
date: "2026-07-23T16:00:00.000Z"
slug: "angular-tosignal-toobservable-rxjs-interop-2026"
---

# Angular toSignal() and toObservable(): RxJS ↔ Signals Interop

> **TL;DR:** Angular didn't replace RxJS with signals — it built a two-way bridge between them. `toSignal()` converts an `Observable` into a readable signal (for use in templates and `computed()`); `toObservable()` converts a signal into an `Observable` (for use with RxJS operators like `debounceTime` or `switchMap`). Both live in `@angular/core/rxjs-interop` and are the correct way to mix the two reactivity models instead of manually subscribing and calling `.set()`.

[Signals](/blog/angular-21-signals-explained-signals-signal-forms) and RxJS solve overlapping but distinct problems. Signals are Angular's synchronous, glitch-free reactivity primitive for UI state — cheap to read, and Angular's change detection is built directly around tracking them. RxJS is a general-purpose async/event stream library — WebSockets, debounced search input, complex operator chains, `combineLatest` across multiple sources. Angular 21 doesn't ask you to pick one; `@angular/core/rxjs-interop` exists specifically so each can be used where it's actually the better fit.

---

## toSignal(): Observable → Signal

The most common interop need: you have an `Observable` (often from `HttpClient`, a `FormControl.valueChanges`, or a service) and you want to read its latest value as a signal in a template or `computed()`.

```typescript
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-current-user',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as u) {
      <p>Welcome, {{ u.name }}</p>
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class CurrentUserComponent {
  private readonly http = inject(HttpClient);

  // Observable<User> becomes Signal<User | undefined>
  user = toSignal(this.http.get<User>('/api/me'));
}
```

Without `toSignal()`, this would normally require an `async` pipe in the template, or a manual `.subscribe()` in the constructor that calls `.set()` on a signal you manage yourself — and then remembering to unsubscribe. `toSignal()` handles the subscription and its teardown automatically, tied to the surrounding injection context (typically the component), the same way `effect()` is.

### Handling the Initial Value

Before the Observable emits its first value, the signal needs *something* to return. By default that's `undefined`, which is why the template above checks `user(); as u` first. If `undefined` isn't a good fit for the type, provide an explicit `initialValue`:

```typescript
export class CurrentUserComponent {
  private readonly http = inject(HttpClient);

  user = toSignal(this.http.get<User>('/api/me'), {
    initialValue: null,
  });
  // Signal<User | null> instead of Signal<User | undefined>
}
```

### requireSync for Observables That Emit Immediately

Some Observables — `BehaviorSubject`, or anything built on one — emit synchronously on subscription, meaning a real value is available immediately and `undefined`/`initialValue` is never actually needed:

```typescript
import { BehaviorSubject } from 'rxjs';

const theme$ = new BehaviorSubject<'light' | 'dark'>('dark');

// requireSync: true asserts a value is available synchronously,
// so the resulting signal's type is Signal<'light' | 'dark'> — no `| undefined`
const theme = toSignal(theme$, { requireSync: true });
```

If the Observable does *not* actually emit synchronously and you use `requireSync: true`, `toSignal()` throws at runtime — so it's a real guarantee, not just a type-level suggestion.

---

## toObservable(): Signal → Observable

The reverse direction: you have a signal — often a component input — and you want to feed its changes through RxJS operators that have no signal equivalent, like `debounceTime` or `switchMap`.

```typescript
import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (result of results(); track result.id) {
      <p>{{ result.title }}</p>
    }
  `,
})
export class SearchResultsComponent {
  private readonly http = inject(HttpClient);

  query = input('');

  private readonly query$ = toObservable(this.query);

  results = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q ? this.http.get<SearchResult[]>(`/api/search?q=${q}`) : of([]))),
    ),
    { initialValue: [] },
  );
}
```

This is the signature interop pattern: signal in (`query`), through `toObservable()`, through RxJS operators that signals don't have a built-in equivalent for (`debounceTime`, `switchMap`), back out through `toSignal()` for the template to read. Neither system replaces the other here — each handles the part it's actually good at.

---

## Injection Context Rules

Both functions need to know when to tear down their internal subscription, and by default they infer that from the injection context they're called in — a component or directive constructor, for instance:

```typescript
// Fine — called during construction, inside the injection context
export class MyComponent {
  data = toSignal(this.someService.data$);
}
```

Calling either function outside an injection context — inside a method, a `setTimeout`, or after `async`/`await` — throws (the same injection context rules apply when using [effect() cleanup with DestroyRef](/blog/angular-effect-cleanup-destroyref-memory-leaks-2026)) unless you explicitly pass an `Injector`:

```typescript
import { Injector, inject } from '@angular/core';

export class MyComponent {
  private readonly injector = inject(Injector);

  loadLater() {
    // Needed because this runs outside the constructor's injection context
    const data = toSignal(this.someService.data$, { injector: this.injector });
  }
}
```

---

## Wrapping up

`toSignal()` and `toObservable()` are the sanctioned bridge between Angular's two reactivity systems, and using them is almost always better than hand-rolling the equivalent with a manual `.subscribe()` and a `signal.set()` call — you get automatic teardown, `initialValue`/`requireSync` for handling the "no value yet" case correctly, and code that reads as an intentional conversion rather than an ad hoc side effect. The [official Angular RxJS interop documentation](https://angular.dev/guide/rxjs-interop) covers all options, including `manualCleanup`. Reach for `toSignal()` when RxJS output needs to reach a template or `computed()`; reach for `toObservable()` when a signal's changes need to flow through an RxJS operator signals don't have natively.

---

## Frequently asked questions

### Do I need toObservable() if I'm not using RxJS operators?

No — if you just need to react to a signal changing with plain logic, `effect()` is simpler and doesn't need the conversion at all. Reach for `toObservable()` specifically when you need an RxJS operator that has no signal-based equivalent, such as `debounceTime`, `switchMap`, or `combineLatestWith`.

### What happens if the Observable passed to toSignal() errors?

By default, the error propagates to Angular's global error handler and the signal keeps its last value — it does not throw when read. If you need in-template error state, catch the error inside the Observable pipeline (e.g. with `catchError`) and map it to a value your signal's type can represent.

### Can toSignal() be used outside a component, like in a plain service?

Yes, but since services aren't always constructed within a component's injection context, pass an explicit `injector` (via `inject(Injector)` in the service's constructor) if there's any chance the call happens outside one — otherwise you'll hit the same "must be called within an injection context" error as any other injection-context-dependent API.

### Is toObservable() eager or lazy?

It's eager relative to construction — it starts observing the signal's changes as soon as it's called, independent of whether anything has subscribed to the resulting Observable yet, so the first emission reflects the signal's value at conversion time, not just future changes.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular effect() Cleanup: Preventing Memory Leaks with DestroyRef](/blog/angular-effect-cleanup-destroyref-memory-leaks-2026)
- [Angular resource() and httpResource(): Reactive HTTP with Signals](/blog/angular-resource-api-httpresouce-signals-2026)
- [NgRx Signal Store: Lightweight, Signal-Based State Management for Angular](/blog/ngrx-signal-store-angular-2026)
- [Official Angular RxJS interop documentation](https://angular.dev/guide/rxjs-interop)
