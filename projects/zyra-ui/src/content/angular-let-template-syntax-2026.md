---
title: "Angular @let: Template Variables Without a Directive Hack"
description: "Learn Angular's @let template syntax: declare local template variables cleanly, replacing the *ngIf=\"value as x\" workaround, with scoping rules and practical examples."
category:
    - "Angular 21"
tags:
    - "angular"
    - "@let"
    - "templates"
    - "angular control flow"
    - "angular 21"
keywords:
    - "angular @let syntax"
    - "angular template variable"
    - "angular let directive"
    - "ngIf as workaround replacement"
    - "angular 21 templates"
date: "2026-07-23T15:00:00.000Z"
slug: "angular-let-template-syntax-2026"
---

# Angular @let: Template Variables Without a Directive Hack

> **TL;DR:** `@let name = expression;` declares a local variable scoped to the template block it's written in. It replaces the long-standing `*ngIf="value as x"` hack — which only worked because `*ngIf` happens to support an `as` clause — with syntax that says what it actually does: declare a variable, no conditional required.

Before Angular 17.2, if you wanted to compute an expression once in a template and reuse the result across several bindings, there wasn't a clean built-in way to do it. The common workaround borrowed `*ngIf`'s `as` clause, even when there was nothing to conditionally show:

```html
<!-- The "workaround": *ngIf just to get a template variable -->
<ng-container *ngIf="user() as currentUser">
  <h2>{{ currentUser.name }}</h2>
  <p>{{ currentUser.email }}</p>
  <span>Member since {{ currentUser.joinedAt | date }}</span>
</ng-container>
```

This works, but it's borrowing unrelated syntax — a structural directive meant for conditional rendering — purely for its side effect of exposing a variable. It also means the content is wrapped in a conditional that always evaluates truthy in practice, adding a layer of indirection to read.

---

## The Direct Replacement

```html
@let currentUser = user();

<h2>{{ currentUser.name }}</h2>
<p>{{ currentUser.email }}</p>
<span>Member since {{ currentUser.joinedAt | date }}</span>
```

No `<ng-container>`, no borrowed conditional, no `as`. For more on Angular's modern template syntax, the [`@defer` block guide](/blog/angular-defer-blocks-lazy-loading-2026) covers `@if`, `@for`, and lazy loading in templates. `@let` declares exactly what it looks like it declares: a variable, computed once per change-detection pass, available to every binding after it in the same scope.

---

## Scoping Rules

`@let` variables are scoped to the block they're declared in — same as JavaScript's `let`/`const` block scoping. A `@let` declared at the top of a template is available throughout that template. One declared inside an `@if` or `@for` block is only visible inside that block:

```html
@let items = cartItems();

@if (items.length > 0) {
  @let total = calculateTotal(items);
  <p>{{ items.length }} items — {{ total | currency }}</p>
} @else {
  <p>Your cart is empty.</p>
}

<!-- `total` is NOT accessible here — it was scoped to the @if block -->
```

This matches how most developers already expect variable scoping to work, unlike the `*ngIf="... as x"` pattern, where the variable's actual scope (the element the directive is on, and its descendants) was easy to get wrong when nesting conditionals.

---

## Avoiding Repeated Expensive Calls

A frequent, subtle bug in Angular templates is calling the same method multiple times across a template when it should only run once per render:

```html
<!-- Before — calls calculateDiscount() three separate times -->
<p>Original: {{ product().price }}</p>
<p>Discount: {{ calculateDiscount(product()) }}</p>
<p>Final: {{ product().price - calculateDiscount(product()) }}</p>
```

If `calculateDiscount()` does anything nontrivial, this runs it three times per change-detection cycle for no reason. `@let` computes the expression exactly once and every reference downstream reads the cached result:

```html
@let discount = calculateDiscount(product());

<p>Original: {{ product().price }}</p>
<p>Discount: {{ discount }}</p>
<p>Final: {{ product().price - discount }}</p>
```

---

## Combining @let with the New Control Flow

`@let` reads naturally alongside `@if`, `@for`, and `@switch` — no special interop needed, since they're all part of the same built-in template syntax introduced together:

```html
@let sortedUsers = users() | orderBy: 'name';

@for (user of sortedUsers; track user.id) {
  @let isAdmin = user.role === 'admin';

  <div class="user-row" [class.is-admin]="isAdmin">
    {{ user.name }}
    @if (isAdmin) {
      <span class="badge">Admin</span>
    }
  </div>
}
```

---

## What @let Cannot Do

`@let` declares a read-only binding for the current change-detection pass — it is not a mutable variable and cannot be reassigned imperatively from an event handler:

```html
<!-- This does NOT work — @let is not a two-way-writable variable -->
@let count = 0;
<button (click)="count = count + 1">{{ count }}</button>
```

For state that needs to change in response to user interaction, that state belongs in the component class as a [signal()](/blog/angular-21-signals-explained-signals-signal-forms) — `@let` is for *deriving* a template-local value from expressions, not for holding mutable UI state.

---

## Wrapping up

`@let` is a small addition with an outsized readability payoff: it replaces a directive borrowed for a side effect it wasn't designed for, gives variables real, predictable block scoping, and avoids the "call the same expensive expression three times" trap that's easy to fall into in template-heavy components. The [official Angular @let documentation](https://angular.dev/api/core/@let) covers scoping rules and edge cases. If you have any `*ngIf="... as x"` left in your templates purely to get a variable — not to conditionally render anything — that's a direct, mechanical `@let` conversion.

---

## Frequently asked questions

### Does @let replace *ngIf entirely?

No — only the specific pattern of using `*ngIf="expr as x"` purely to create a variable, with no actual conditional rendering intent. If you genuinely need to conditionally show or hide content, use `@if`, which is the built-in control-flow replacement for real `*ngIf` use cases.

### Can I use @let with async values?

Yes, combine it with the `async` pipe exactly like you would in an interpolation: `@let user = user$ | async;`. If the source can emit `null` before resolving, guard downstream bindings with `@if (user)` as usual.

### Is @let available in Angular 21?

Yes. `@let` shipped as a developer preview in Angular 17.2 and has been stable since Angular 18, so it's fully available and safe to use in Angular 21 projects without any preview flags.

### Does @let hurt performance if declared but never used far down the template?

No meaningful cost — it's evaluated once per change-detection pass for the enclosing block, the same as any other template expression would be if written inline. The benefit is avoiding *redundant* evaluations of the same expression, not avoiding evaluation altogether.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular @defer Blocks: Lazy Load Any Component Instantly](/blog/angular-defer-blocks-lazy-loading-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [What's New in Angular 22](/blog/whats-new-in-angular-22)
- [Official Angular @let template syntax documentation](https://angular.dev/api/core/@let)
