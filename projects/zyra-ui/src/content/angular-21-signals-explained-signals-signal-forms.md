---
title: 'Angular 21 Signals Explained: Signals, Signal Forms'
description: 'In-depth Angular 21 Signals guide for 2026: learn signals, Signal Forms, zoneless change detection, and how to use Angular Signals with RxJS and HttpClient.'
slug: 'angular-21-signals-explained-signals-signal-forms'
tags:
    - 'angular 21'
    - 'angular signals'
    - 'signal forms'
    - 'zoneless change detection'
    - 'angular 2026'
    - 'angular reactivity'
    - 'rxjs interop'
keywords:
    - 'angular 21 signals'
    - 'angular signals tutorial'
    - 'angular signal forms'
    - 'angular computed signals'
    - 'angular effect signal'
    - 'toSignal angular'
    - 'angular zoneless change detection'
    - 'angular reactive state 2026'
    - 'angular signals vs rxjs'
    - 'angular signals example'
category:
    - 'angular 21'
    - 'angular 21 signal'
date: '2026-01-06T05:29:59.318Z'
---

# Angular 21 Signals Explained: Signals, Signal Forms

> **TL;DR:** A signal is a reactive value you read by calling it (`count()`) and update with `.set()` or `.update()`. Angular marks the views or consumers that depend on a signal for targeted update scheduling, rather than treating every signal change as a blanket full-tree refresh. Signal Forms bring the same model to form state, letting you work with validity and errors through signals without needing to bridge `FormControl.valueChanges` through observables manually. RxJS is not replaced — `toSignal()` and `toObservable()` let both models coexist cleanly.

Before signals, Angular's change detection was a blunt instrument. Zone.js patched every async browser API, and when something happened — a click, a timeout, an HTTP response — Angular checked the entire component tree for changes. For small apps, you never noticed. For dashboards with hundreds of bindings or components doing real-time updates, you felt it.

Signals solve this at the model level. Instead of asking "did anything change?" after every async operation, Angular now tracks a signal's readers at the moment they read it and schedules those dependent views or consumers for update. That gives the framework more targeted scheduling than a full tree walk, but it does not mean only one binding updates in isolation or that no other Angular synchronization passes run. Signals work perfectly well alongside Zone.js — you get the precision benefit either way. But that same precision is also what makes [zoneless change detection](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals) *possible*: without Zone.js, Angular can rely on signal-driven scheduling plus other framework notifications such as `markForCheck()`, component inputs, and bound listeners to decide when views need to refresh. Zoneless is a separate, opt-in feature (`provideZonelessChangeDetection()`), not something signals require or enable automatically.

---

## What a signal actually is

A signal is a wrapper around a value. The wrapper does two things: it lets Angular observe when the value is read, and it notifies Angular when the value changes. The full API is documented in the [Angular signals guide](https://angular.dev/guide/signals) — this post focuses on the parts that matter most for day-to-day component development.

```ts
import { signal, computed, effect } from '@angular/core';

const count = signal(0);

// Read
console.log(count()); // 0

// Write
count.set(5);
count.update(v => v + 1); // 6
```

That's it. No decorators. No Observable pipe. No subscription cleanup.

The real power shows up in templates. When Angular renders `{{ count() }}`, it registers that binding as a reader of `count`. The next time `count.set()` is called, Angular schedules that dependent binding for update, which is more targeted than a blanket tree-wide refresh but still part of the broader framework scheduling pipeline.

---

## `computed()` — derived state without manual wiring

`computed()` creates a read-only signal whose value is derived from other signals. Angular tracks the dependencies automatically.

```ts
import { signal, computed } from '@angular/core';

const price = signal(100);
const taxRate = signal(0.18);

const total = computed(() => price() * (1 + taxRate()));

console.log(total()); // 118
price.set(200);
console.log(total()); // 236
```

`total` is lazy — it only recomputes when one of its dependencies actually changes, and only when something reads it. If nothing reads `total` after `price.set()`, the computation doesn't run.

This matters when you have expensive derivations. A computed signal that formats a large data structure won't run on every keystroke — only when the underlying data changes and the template actually needs the new value.

---

## `effect()` — side effects that stay in sync

Use `effect()` when a signal change should trigger something outside the UI — logging, analytics, saving to localStorage, or initiating an HTTP call.

```ts
import { Component, afterRenderEffect, signal } from '@angular/core';

@Component({ selector: 'app-theme-toggle', template: `...` })
export class ThemeToggleComponent {
    theme = signal<'dark' | 'light'>('dark');

    constructor() {
        afterRenderEffect(() => {
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', this.theme());
            }
        });
    }
}
```

The hook re-runs whenever `theme()` changes. Dependencies are tracked the same way as `computed()` — whatever signals are read inside the callback become its dependencies.

Two important rules: DOM-affecting effects should run in an injection context (such as a component constructor), and you should not write to a signal inside the same callback if it also reads that same signal — that creates a cycle.

---

## Forms with signals

Signal Forms are available in Angular v21 and newer as an experimental preview alongside the existing Reactive Forms API. The goal is a signals-native replacement for the `FormBuilder` / `FormGroup` / `FormControl` model, with form state, validity, and errors exposed as signals you bind directly, without an async pipe or `valueChanges` subscription. Because the API is still marked experimental, check the [official Angular forms guide](https://angular.dev/guide/forms) for the current Signal Forms API before writing new code against it.

The underlying win is that form validity and errors are already signals — which means OnPush and zoneless apps get full change detection benefit on form state automatically, the same as any other signal.

If you need to keep using the classic `ReactiveFormsModule` API — for compatibility or because you're in a large codebase you can't migrate at once — you can bridge it to signals with `toSignal()`:

```ts
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
});

formValue = toSignal(this.loginForm.valueChanges, {
    initialValue: this.loginForm.value,
});
```

`formValue()` then behaves like any other signal in your template and computed properties.

---

## RxJS interop — not a replacement

Signals handle synchronous reactive state cleanly. RxJS handles time-based streams, WebSocket events, complex async coordination, and anything that needs operators like `debounceTime`, `switchMap`, or `combineLatest`.

The two work well together through a pair of utilities from `@angular/core/rxjs-interop`. For a deeper look at the interop layer — including `takeUntilDestroyed`, injection context rules, and `requireSync` — see the dedicated post on [toSignal and toObservable in Angular](/blog/angular-tosignal-toobservable-rxjs-interop-2026).

```ts
import { signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs';

// Observable → Signal
const users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });

// Signal → Observable (useful for switchMap chains)
const query = signal('');
const results$ = toObservable(query).pipe(
    debounceTime(300),
    switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`))
);
const results = toSignal(results$, { initialValue: [] });
```

`toSignal()` handles subscription cleanup automatically — when the component is destroyed, the subscription is torn down. No `takeUntilDestroyed()` or manual unsubscribe needed.

The practical rule: use signals for component state and UI values, use RxJS when you need operators or are working with existing Observable-based APIs, and bridge between them as needed.

---

## Zoneless change detection

Angular 21 defaults to zoneless for new apps. Without Zone.js, Angular does not patch browser APIs and does not trigger change detection after every async operation. Instead, it updates views only when a signal that a template reads actually changes.

The result is a simpler mental model and measurably better performance in data-heavy UIs. For a component library like ZyraUI — where components render in isolation and need to be responsive under OnPush — zoneless is the natural fit.

For a new Angular 21 project, zoneless is the default. If you are migrating, read the full [Angular zoneless migration guide](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals) — it covers the `NgZone` APIs to audit, what breaks, and the safe sequence for removing `zone.js` from your build.

---

## Putting it together: a realistic component

Here's what a data-loading component looks like with signals, `toSignal()`, and zoneless-compatible patterns:

```ts
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { ZyraSkeleton } from 'zyra-ng-ui';

interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}

@Component({
    selector: 'app-product-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSkeleton],
    template: `
        @if (loading()) {
            <zyra-skeleton count="4" />
        } @else if (loadError()) {
            <p class="error">{{ loadError() }}</p>
        } @else {
            <p class="count">{{ inStockCount() }} of {{ products().length }} in stock</p>
            <ul>
                @for (product of products(); track product.id) {
                    <li>{{ product.name }} — ₹{{ product.price }}</li>
                }
            </ul>
        }
    `,
})
export class ProductListComponent {
    private readonly http = inject(HttpClient);

    loading = signal(true);
    loadError = signal<string | null>(null);
    products = toSignal(
        this.http.get<Product[]>('/api/products').pipe(
            // Without catchError, a failed request would make the source
            // Observable error — and toSignal() re-throws that error the
            // next time the signal is read, crashing the template.
            catchError(() => {
                this.loadError.set('Could not load products. Please try again.');
                return of<Product[]>([]);
            }),
            // finalize, not tap — tap's callback only fires on success, so a
            // failed request would leave `loading` stuck true forever.
            finalize(() => this.loading.set(false))
        ),
        { initialValue: [] }
    );

    inStockCount = computed(() =>
        this.products().filter(p => p.inStock).length
    );
}
```

`loading` starts `true` and flips to `false` when the request settles — success or failure — and the template reacts to both transitions. `catchError` keeps the failure from propagating into `products()`, sets `loadError` instead, and the template checks `loadError()` before it ever reads `products()` or `inStockCount()`. `inStockCount` is derived automatically — no manual `ngOnChanges`, no subscription management, no `async` pipe.

---

## Key takeaways

Signals are not Angular's version of React state or Vue refs with Angular branding — they're a first-class primitive designed to work with Angular's template compilation, dependency injection, and change detection pipeline. The payoff is precise UI updates, less boilerplate for derived state, and a path to removing Zone.js from your build entirely.

Signal Forms take the same idea and apply it to form state — reactive, synchronous, and directly bindable in templates without the `valueChanges` / `toSignal` ceremony for every field.

If you're starting an Angular project in 2026, signals should be your default state model. If you're on an existing codebase, migrating incrementally with `toSignal()` and `toObservable()` is the practical path — you don't need to rewrite everything at once.

**Related reading:**
- [Angular toSignal and toObservable — RxJS interop deep dive](/blog/angular-tosignal-toobservable-rxjs-interop-2026)
- [Angular input() and output() — replacing @Input/@Output decorators](/blog/angular-input-output-signal-api-replace-decorators)
- [Zoneless Angular v21 guide](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals)
- [What's new in Angular 22](/blog/whats-new-in-angular-22)
- [Official Angular signals documentation](https://angular.dev/guide/signals)
