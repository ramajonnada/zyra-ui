---
title: "Angular input() and output(): Replace @Input/@Output with the Signal API"
description: "Learn how Angular's input() and output() functions replace @Input/@Output decorators, enable reactive component APIs, and integrate cleanly with signals."
category:
    - "Angular 21"
tags:
    - "angular"
    - "signals"
    - "input output"
    - "component api"
    - "angular 21"
keywords:
    - "angular input() function"
    - "angular output() function"
    - "replace @Input @Output Angular"
    - "angular signal inputs"
    - "angular 21 component props"
date: "2026-07-23T10:00:00.000Z"
slug: "angular-input-output-signal-api-replace-decorators"
---

# Angular input() and output(): Replace @Input/@Output Decorators with the Signal API

> **TL;DR:** Angular's `input()` and `output()` functions give component APIs first-class signal support. Inputs become readable signals — no `ngOnChanges` needed. Outputs become typed event emitters without `EventEmitter`. Together they remove a class of boilerplate and make parent-child data flow composable with the rest of Angular's reactive primitives.

If you've been writing Angular components for a while, you know the pattern: decorate a property with `@Input()`, decorate another with `@Output()`, wire up `EventEmitter`, and then sometimes add `ngOnChanges` just to react when an input value changes. It works, but it's friction — especially now that the rest of Angular leans on signals for reactivity.

Angular 17 introduced `input()` and `output()` as function-based replacements. They're stable in Angular 21, and they integrate directly with `computed()`, `effect()`, and the rest of the signal graph. This post covers what changes, what you gain, and how to migrate an existing component.

---

## The Problem with @Input and @Output

Consider a card component that accepts a `title` string and emits a `dismiss` event.

```typescript
// Before — decorator-based
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h2>{{ uppercasedTitle }}</h2>
      <button (click)="dismiss.emit()">Dismiss</button>
    </div>
  `
})
export class CardComponent implements OnChanges {
  @Input() title = '';
  @Output() dismiss = new EventEmitter<void>();

  uppercasedTitle = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['title']) {
      this.uppercasedTitle = this.title.toUpperCase();
    }
  }
}
```

Three things stand out as friction here. First, `uppercasedTitle` is derived state — it depends entirely on `title` — but you need a lifecycle hook to keep it in sync. Second, `EventEmitter` is an RxJS `Subject` that Angular treats specially; it's heavier than it needs to be for a simple event. Third, `@Input()` gives you no compile-time guarantee that a required property was actually passed by the parent.

---

## Rewriting with input() and output()

The signal API collapses all of that:

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h2>{{ uppercasedTitle() }}</h2>
      <button (click)="dismiss.emit()">Dismiss</button>
    </div>
  `
})
export class CardComponent {
  // Signal input — readable like any other signal
  title = input('');
  dismiss = output<void>();

  // Derived state — no lifecycle hook required
  uppercasedTitle = computed(() => this.title().toUpperCase());
}
```

`input()` returns an `InputSignal<T>` — a read-only signal. You read it in templates and in `computed()` / `effect()` calls the same way you read any signal, with `()`. Angular tracks the dependency automatically, so `uppercasedTitle` updates the moment `title` changes, without `ngOnChanges`.

`output()` returns an `OutputEmitterRef<T>`. You call `.emit(value)` on it exactly like `EventEmitter`, but it's not an Observable — it's a lightweight emitter with no RxJS dependency.

---

## Required Inputs

One of the most practical improvements is `input.required()`. With decorators, you could write `@Input({ required: true })` but Angular only checked this at runtime with a warning. The signal version makes the type reflect the requirement:

```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-user-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ name() }} ({{ role() }})</span>`
})
export class UserBadgeComponent {
  // TypeScript type: InputSignal<string> — never undefined
  name = input.required<string>();

  // Optional with a fallback
  role = input<string>('Viewer');

  // Required with a transform — raw type is string, resolved type is number
  userId = input.required<number, string>({ transform: (v) => parseInt(v, 10) });
}
```

The `transform` option on `input.required()` is useful when working with attribute values from the DOM, which arrive as strings. The second generic parameter is the raw input type (`string`), the first is the transformed type (`number`). The template and any `computed()` calls see the already-transformed value.

---

## Using Inputs in computed() and effect()

Because `input()` returns a real signal, it composes with the rest of Angular's reactive graph:

```typescript
import { Component, ChangeDetectionStrategy, input, computed, effect } from '@angular/core';

interface Product {
  name: string;
  price: number;
  originalPrice: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article>
      <h3>{{ product().name }}</h3>
      <p class="price">{{ formattedPrice() }}</p>
      @if (isOnSale()) {
        <span class="badge">Sale</span>
      }
    </article>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();

  formattedPrice = computed(() =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(this.product().price)
  );

  isOnSale = computed(() => this.product().price < this.product().originalPrice);

  constructor() {
    effect(() => {
      // Runs whenever product changes — useful for analytics, logging, etc.
      console.log('Product viewed:', this.product().name);
    });
  }
}
```

This replaces the pattern of copying input values into local state and recomputing in `ngOnChanges`. The computation and the input are wired directly — there's no sync step to forget.

---

## New Tool: ng-signal-devtools

For debugging signal graphs in components that use `input()`, `computed()`, and `effect()` together, the community-maintained [ng-signal-devtools](https://github.com/Celtian/ng-signal-devtools) browser extension is worth adding to your workflow.

Install it from the Chrome Web Store, then in your Angular app you get a dedicated panel in DevTools that shows which signals are active in the currently selected component, the current value of each `InputSignal` and `computed`, and which `effect()` calls are subscribed to which signals.

```bash
# No npm package needed — install the browser extension:
# Chrome Web Store: search "Angular Signal DevTools"
```

```typescript
// No code changes needed in your component.
// The extension reads Angular's internal signal graph via the debug API.
import { Component, input, computed } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true, template: `{{ doubled() }}` })
export class DemoComponent {
  count = input(0);
  doubled = computed(() => this.count() * 2);
  // Both appear in the Signal DevTools panel automatically
}
```

When working on components with more than a handful of inputs or derived computeds, the graph view helps you quickly trace which input change caused a re-render you didn't expect.

---

## Migration Pattern: Side-by-Side Comparison

If you have existing components with decorators and want to migrate incrementally, the pattern is mechanical:

```typescript
// Before — decorator API
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({ standalone: true, template: `{{ label }}` })
export class TagComponent implements OnChanges {
  @Input() label = 'default';
  @Input() color: 'blue' | 'green' | 'red' = 'blue';
  @Output() removed = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['label']) {
      // react to label change
    }
  }
}

// After — signal API
import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label() }}`
})
export class TagComponent {
  label = input('default');
  color = input<'blue' | 'green' | 'red'>('blue');
  removed = output<string>();

  constructor() {
    effect(() => {
      const current = this.label();
      // runs on every label change — replaces the ngOnChanges guard
    });
  }
}
```

The parent template syntax does not change — you still write `[label]="value"` and `(removed)="handler($event)"`. That's intentional: `input()` and `output()` are purely a component-internal change.

---

## Wrapping up

`input()` and `output()` are a genuine quality-of-life improvement, not just a stylistic preference. Required inputs surface contract violations at the type level. Signal inputs compose directly with `computed()` and `effect()`, eliminating `ngOnChanges` for the vast majority of derived-state use cases. And `output()` drops the `EventEmitter` / RxJS dependency from the emitting side. If you're starting a new component today, there's no reason to reach for the decorator API. Pick one component in your codebase, apply the migration pattern above, and see how much lifecycle scaffolding disappears.

---

## Frequently asked questions

### Does switching to input() and output() break parent templates?

No. The parent template binding syntax — `[inputName]="value"` and `(outputName)="handler($event)"` — is identical whether the component uses decorator or function APIs. The change is entirely internal to the child component, so you can migrate one component at a time without touching its consumers.

### Can I mix @Input() and input() in the same component?

Yes, Angular supports both in the same class during migration. In practice it adds confusion without benefit, so it's better to migrate one component fully rather than leaving it in a partial state. The Angular team's own schematics can automate the conversion if you have many components to update.

### What happens if a parent doesn't pass a required input()?

Angular throws a runtime error and logs a clear message identifying the missing input. Unlike `@Input({ required: true })`, the TypeScript type returned by `input.required<T>()` is `InputSignal<T>` — never `T | undefined` — so you also get better type inference in any `computed()` or `effect()` that reads it.

### Is output() compatible with RxJS when I need to subscribe?

`OutputEmitterRef` is not an Observable. If you need Observable interop, use `outputToObservable(myOutput)` to convert it, or `outputFromObservable(myObservable$)` to create an output that emits whenever the source Observable emits. Both helpers ship with `@angular/core/rxjs-interop` and require no additional packages.
