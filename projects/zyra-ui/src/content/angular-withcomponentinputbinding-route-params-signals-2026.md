---
title: "Route Params as Signals: withComponentInputBinding() in Angular 22"
description: "Stop subscribing to ActivatedRoute manually. withComponentInputBinding() maps route params, query params, and resolver data directly to signal inputs."
category:
    - "Angular 21"
tags:
    - "angular"
    - "routing"
    - "signals"
    - "withComponentInputBinding"
    - "angular 22"
keywords:
    - "withComponentInputBinding angular"
    - "route params as signals angular"
    - "angular signal inputs routing"
    - "ActivatedRoute replacement angular 22"
    - "angular query params signals 2026"
date: "2026-07-26T10:00:00.000Z"
slug: "angular-withcomponentinputbinding-route-params-signals-2026"
---

# Route Params as Signals: withComponentInputBinding() in Angular 22

> **TL;DR:** Add `withComponentInputBinding()` to `provideRouter()` and your route params, query params, path data, and resolver results are automatically bound to matching `input()` signal inputs on the routed component — no `ActivatedRoute` subscription needed.

If you have been writing Angular for more than a year, you have written this code dozens of times:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({ standalone: true, template: '' })
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productId = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') ?? '';
      // now load data, trigger effects...
    });
  }
}
```

It works, but it has real costs. You are wiring a subscription manually, you need to remember to unsubscribe (or use `takeUntilDestroyed`), and the route param lives in a separate observable pipeline from everything else in your component. If you want the param to drive a `resource()` load or a `computed()` value, you bridge the gap with `toSignal()` — one more import, one more mental layer.

Angular's answer is `withComponentInputBinding()`, and it eliminates the boilerplate entirely.

---

## The Problem: Route Params Belong in Component State

Route parameters *are* component inputs. A product detail page receives an `id` the same way a dumb UI component receives a `color` prop — the caller passes it in, the component reacts. The mental model is identical, but for years Angular made you use an entirely different mechanism for routed params versus component inputs.

This disconnect became harder to justify once `input()` signal inputs arrived. A signal input is reactive by default. If you could just get route params *into* a signal input, your whole reactive graph would connect automatically — `computed()`, `resource()`, `effect()`, all of it.

`withComponentInputBinding()` closes that gap.

---

## How withComponentInputBinding() Works

Enable it once at the application level inside `provideRouter()`:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

That single call instructs the router to inspect the activated component's `input()` declarations and bind matching values automatically. The router merges values from three sources, in priority order (highest wins on a name collision):

1. **Route data** — the `data: { ... }` object on a route definition merged with whatever your `resolve: { ... }` functions return (resolver output overwrites static data when both use the same key)
2. **Path parameters** — `:id` in `/products/:id`
3. **Query parameters** — `?page=2`

If an `input()` name on the component matches a key from any of those sources, the router binds the value for you. When the URL changes, the input updates and your reactive graph re-runs.

---

## Before and After: A Product Detail Page

Here is the same component written both ways. First, the old approach with explicit `ActivatedRoute` access:

```typescript
// OLD — ActivatedRoute subscription
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product()) {
      <h1>{{ product()!.name }}</h1>
      <p>Page: {{ page() }}</p>
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  page = signal(1);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const id = params.get('id') ?? '';
      this.productService.getProduct(id).subscribe(p => this.product.set(p));
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(qp => {
      this.page.set(Number(qp.get('page') ?? 1));
    });
  }

  ngOnInit() {}
}
```

Now, with `withComponentInputBinding()` and Angular's [`resource()` API](/blog/angular-resource-api-httpresouce-signals-2026):

```typescript
// NEW — signal inputs bound directly by the router
import {
  Component, ChangeDetectionStrategy, inject, input, computed
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ProductService } from './product.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (productResource.value()) {
      <h1>{{ productResource.value()!.name }}</h1>
      <p>Page: {{ page() }}</p>
    } @else if (productResource.isLoading()) {
      <p>Loading...</p>
    } @else {
      <p>Product not found.</p>
    }
  `,
})
export class ProductDetailComponent {
  // Router binds ':id' path param here automatically
  id = input.required<string>();

  // Router binds '?page' query param here automatically. The router calls
  // setInput() for every declared input on every navigation, even when the
  // query param is absent — a bare `transform: Number` would turn that
  // missing value into NaN. Guard for undefined so the default of 1 survives.
  page = input(1, { transform: (v: string | undefined) => (v == null ? 1 : Number(v)) });

  private productService = inject(ProductService);

  // httpResource re-fetches whenever id() changes
  productResource = httpResource(() =>
    this.productService.getProductUrl(this.id())
  );
}
```

The route definition stays simple:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailComponent,
  },
];
```

No subscriptions. No `takeUntilDestroyed`. No `toSignal()` bridge. The `id` signal input is a first-class reactive value — `httpResource` reads it and automatically re-fetches when it changes, which happens whenever the user navigates to a different product. The `page` input even uses the `transform` option to coerce the string query param into a number — see [Angular input() and output()](/blog/angular-input-output-signal-api-replace-decorators) for all signal input options including `transform` and `alias`.

---

## Resolver Data and Static Route Data

The binding works equally well with resolvers and static data, which makes it clean to pre-load data before a component renders:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    data: { breadcrumb: 'Product Detail' },
    resolve: { product: productResolver },
  },
];
```

```typescript
// component — resolver result bound to 'product' input, static data to 'breadcrumb'
@Component({ standalone: true, template: '' })
export class ProductDetailComponent {
  id         = input.required<string>();
  product    = input<Product | null>(null);   // from resolver
  breadcrumb = input('');                     // from route data
}
```

If both a path param and a resolver return a key named `product`, the resolver value wins — it appears first in the priority order.

---

## New Tool: Biome for Angular Projects

While you are cleaning up routing boilerplate, it is worth considering Biome as a replacement for ESLint and Prettier in Angular workspaces. Biome is a single Rust-based toolchain that lints and formats JavaScript and TypeScript roughly 25-35x faster than the Node-based alternatives.

Install it in an Angular workspace:

```bash
npm install --save-dev --exact @biomejs/biome
npx @biomejs/biome init
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "biome lint ./projects",
    "format": "biome format --write ./projects"
  }
}
```

Biome's Angular support covers everything relevant to a standalone-first codebase: TypeScript strict-mode rules, unused imports, `no-explicit-any`, and import sorting. It does not yet parse Angular templates (`.html` files) — for template-specific rules, you still need `@angular-eslint/template-parser`. A practical setup uses Biome for TypeScript files and `@angular-eslint` for templates only, cutting total lint time significantly on large component libraries.

---

## Things to Watch Out For

**Input name conflicts.** If your component has a signal input named `id` but also a path param named `id` and a resolver result named `id`, you get the resolver value. Make sure your input names are unambiguous — or name resolver keys explicitly to avoid collisions.

**Required inputs without a matching route param.** If you declare `input.required<string>()` but the route does not define that param, Angular throws at runtime. Validate your route definitions against your component inputs, especially when using resolvers whose keys might change.

**Opt-in, not automatic.** `withComponentInputBinding()` must be added to `provideRouter()`. It does nothing to components that are not activated via the router, so `input()` on regular nested components behaves as always — no unexpected binding occurs.

---

## Wrapping Up

`withComponentInputBinding()` is one of those features that feels obvious in hindsight. The [official Angular routing documentation](https://angular.dev/guide/routing) covers the full router feature set. — route params always belonged in component inputs, and now they work exactly like that. Combined with `input.required()`, the `transform` option, and `httpResource()`, you can write fully reactive routed components without a single subscription or `ngOnInit` lifecycle hook. Enable it once in `provideRouter()` and let the router do the wiring.

---

## Frequently Asked Questions

### Does withComponentInputBinding() work with lazy-loaded routes?

Yes. It applies to all routed components regardless of whether the route is eagerly loaded or uses `loadComponent` / `loadChildren`. The binding happens at route activation time, after the module chunk has been fetched.

### Can I use input.required() for route params?

Yes, and it is the right choice for path params that are always present in the URL (like `:id`). For optional query params, use `input(defaultValue)` instead so the component has a sensible default when the query param is absent.

### Does this replace ActivatedRoute entirely?

For most components, yes. The main remaining use case for `ActivatedRoute` is reading the `url` or `fragment` observables, or reacting to URL changes inside a parent component that needs to observe child route changes. For anything param- or data-related in a leaf component, `withComponentInputBinding()` covers it completely.

### What Angular version introduced this?

`withComponentInputBinding()` was introduced as experimental in Angular 16 and stabilized in Angular 17. Angular 22 keeps the same API. If you are on Angular 17 or later, there is no reason not to enable it — it is a purely additive opt-in with no breaking changes.

---

**Related reading:**
- [Angular resource() and httpResource(): Reactive HTTP with Signals](/blog/angular-resource-api-httpresouce-signals-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [What's New in Angular 22](/blog/whats-new-in-angular-22)
- [Official Angular routing documentation](https://angular.dev/guide/routing)
