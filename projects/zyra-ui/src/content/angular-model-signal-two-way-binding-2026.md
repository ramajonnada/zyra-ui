---
title: "Angular model() Signal: The Modern Two-Way Binding API"
description: "Learn how Angular model() replaces @Input/@Output two-way binding boilerplate with a clean signal-based API. Real-world examples for component library authors."
category:
    - "Angular 21"
tags:
    - "angular"
    - "signals"
    - "two-way binding"
    - "model signal"
    - "component library"
keywords:
    - "Angular model() signal two-way binding"
    - "ModelSignal Angular"
    - "replace @Input @Output Angular signals"
    - "Angular signals component API"
    - "Angular 21 model function"
date: "2026-08-06T10:00:00.000Z"
slug: "angular-model-signal-two-way-binding-2026"
---

# Angular model() Signal: The Modern Two-Way Binding API

> **TL;DR:** Angular's `model()` function replaces the old `@Input() value` + `@Output() valueChange` two-way binding pattern with a single signal that both reads and writes. It wires cleanly to the banana-in-a-box `[(value)]` syntax in parent templates, and works natively with computed() and effect() — no extra boilerplate.

If you have ever written a reusable Angular form control, you know the ritual. Declare `@Input() value`, declare `@Output() valueChange`, call `this.valueChange.emit(newValue)` in every handler, and remember to never mutate the input directly. Angular's `model()` signal — now stable — collapses all of that into one function call. This guide covers **Angular model() signal two-way binding** from first principles, with practical examples you can use in your own components today.

---

## The Problem: @Input/@Output Two-Way Binding Boilerplate

Before `model()`, a reusable toggle or input component needed at least four lines of ceremony just to support two-way binding:

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toggle',
  template: `
    <button (click)="toggle()">{{ checked ? 'On' : 'Off' }}</button>
  `,
})
export class ToggleComponent {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checkedChange.emit(!this.checked);
  }
}
```

The parent wires it up with `[(checked)]="isEnabled"`. It works, but it has real drawbacks:

- The component cannot read its own latest value after emitting — `this.checked` is stale until the parent updates.
- You cannot derive values from `checked` using `computed()` because it is a plain property, not a signal.
- Every handler that mutates state must manually call `emit`.
- The naming contract (`fooChange`) is implicit and easy to break.

Angular's new `model()` API fixes all of this at the source.

---

## The New Concept: model() and ModelSignal

[`model()`](https://angular.dev/api/core/model) is an Angular function that creates a **ModelSignal** — a writable signal that is also wired as a component input and automatically emits its value to the parent through a matching `Change` output. From the outside, it behaves exactly like the old `@Input`/`@Output` pair, so existing `[(prop)]` bindings in templates keep working unchanged.

Here is the same toggle rewritten with `model()`:

```typescript
import { Component, model, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toggle',
  template: `
    <button (click)="toggle()" [class.active]="checked()">
      {{ label() }}
    </button>
  `,
})
export class ToggleComponent {
  checked = model(false);                          // ModelSignal<boolean>
  label = computed(() => this.checked() ? 'On' : 'Off');  // derived signal

  toggle() {
    this.checked.set(!this.checked());            // write directly
  }
}
```

Parent template stays identical:

```html
<app-toggle [(checked)]="isEnabled" />
```

Every time `checked.set()` is called inside the component, Angular automatically emits `checkedChange` to the parent — no manual `emit()` call needed. And because `checked` is a real signal, `computed()`, `effect()`, and `toObservable()` all work on it without any conversion step.

### Required model inputs

Just like `input.required()`, there is a required variant for models where no default makes sense:

```typescript
value = model.required<string>();   // ModelSignal<string>, no default
```

With `strictTemplates` enabled, Angular's template type checker flags any usage that doesn't bind a value at compile time, the same way it does for `input.required()`.

### Reading vs. writing the signal

`ModelSignal` is a writable signal, so it exposes `set()` and `update()` the same way a plain `signal()` does. The difference is that every write also triggers the `<name>Change` output, keeping the parent in sync automatically.

---

## The New Tool: ngxtension Signal Utilities

[ngxtension](https://ngxtension.netlify.app/) is a community library that ships composable utilities built on top of Angular's signal primitives. It complements `model()` with helpers like `createSignal`, `derivedFrom`, and `injectQueryParams` that reduce repetitive signal wiring in real applications.

Install it with:

```bash
npm install ngxtension
```

One practical pairing with `model()` is `syncSignal` — it keeps two signals in sync across component boundaries without a manual effect:

```typescript
import { Component, model } from '@angular/core';
import { syncSignal } from 'ngxtension/sync-signal';
import { signal } from '@angular/core';

@Component({ standalone: true, selector: 'app-demo', template: '' })
export class DemoComponent {
  value = model(0);
  doubled = signal(0);

  constructor() {
    // keep doubled in sync whenever value changes
    syncSignal(this.value, this.doubled, (v) => v * 2);
  }
}
```

ngxtension also provides `injectRouteData` and `injectQueryParams` as typed signals, which pair cleanly with `model()` components that need to reflect URL state. Browse the full utility list at [ngxtension.netlify.app](https://ngxtension.netlify.app/).

---

## Using ZyraUI for Two-Way Binding Component Patterns

Angular component libraries like ZyraUI are exactly where `model()` shines — reusable controls that consumers wire up with `[(value)]` expect clean two-way binding without leaking implementation details.

The ZyraUI rating component, for example, exposes a writable `value` model so consumers can pre-populate and react to rating changes entirely through signal bindings:

```typescript
import { Component, signal, computed } from '@angular/core';
import { ZyraRatingComponent } from '@zyra-ui/angular';

@Component({
  standalone: true,
  imports: [ZyraRatingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <zyra-rating [(value)]="userRating" [max]="5" />

    @if (userRating() > 3) {
      <p>Thanks for the positive rating!</p>
    }

    <p>Current rating: {{ ratingLabel() }}</p>
  `,
})
export class ReviewFormComponent {
  userRating = signal(0);
  ratingLabel = computed(() => `${this.userRating()} / 5`);
}
```

Because ZyraUI components follow the `model()` pattern internally, the `[(value)]` binding wires directly to a `ModelSignal` inside the component — no intermediate `EventEmitter`, no `ChangeDetectorRef.markForCheck()`, no stale reads. The parent's `userRating` signal stays current automatically.

When you need a full form experience — inputs, dropdowns, modals, tables — [ZyraUI components](https://www.zyraui.dev/docs/components) are built for Angular 21+ and ship with [ZyraUI theming](https://www.zyraui.dev/theming) support out of the box. Explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) and the [ZyraUI docs](https://www.zyraui.dev/docs) for integration guides.

---

## Wrapping Up

`model()` is one of those Angular additions that makes you wonder how you shipped component libraries without it. One function replaces four lines of boilerplate, gives you a real signal to derive from, and keeps two-way binding working with zero template changes. If you are building or maintaining Angular components — especially in a library context — switching to `model()` should be one of your first refactors. Check out the [Angular model() API docs](https://angular.dev/api/core/model) for the full spec, and see how ZyraUI puts it into practice at [zyraui.dev](https://www.zyraui.dev).

---

## Frequently Asked Questions

### What is Angular model() signal two-way binding and when should I use it?
`model()` is a stable Angular API that creates a `ModelSignal` — a writable signal exposed as both a component input and an auto-emitting output. Use it any time you need two-way binding on a reusable component, especially in component libraries or custom form controls where the old `@Input`/`@Output` pattern creates maintainability overhead.

### Does model() work with Angular reactive forms and ngModel?
Yes. Because `model()` honors the same `[(prop)]` banana-in-a-box contract as the old `@Input`/`@Output` pair, it works wherever that syntax is valid. For full reactive forms integration with `ControlValueAccessor`, you still need to implement that interface, but `model()` can sit alongside it to handle display-only two-way state.

### What is the difference between model() and input() in Angular signals?
`input()` creates a read-only `InputSignal` — the component can only read it, not write it. `model()` creates a writable `ModelSignal` — the component can both read and write it, and writes are automatically emitted to the parent. Use `input()` for data flowing down, `model()` for data flowing both ways.

### Can I use computed() and effect() with a ModelSignal?
Yes — `ModelSignal` is a full signal, so `computed(() => myModel())` and `effect(() => console.log(myModel()))` work exactly as they do with `signal()`. This is the key improvement over the old pattern: you can derive reactive values from a model input without converting it first.
