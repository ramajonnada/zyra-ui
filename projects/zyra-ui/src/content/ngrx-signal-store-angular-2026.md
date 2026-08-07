---
title: "NgRx Signal Store: Lightweight, Signal-Based State Management for Angular"
description: "Learn how @ngrx/signals SignalStore replaces boilerplate-heavy NgRx with composable, type-safe, signal-native state management for Angular apps."
category:
    - "Angular 21"
tags:
    - "ngrx"
    - "signals"
    - "state management"
    - "angular"
    - "performance"
keywords:
    - "ngrx signal store angular"
    - "angular state management signals 2026"
    - "@ngrx/signals withState withMethods"
    - "signal store vs ngrx store"
    - "angular patchState signalStore"
date: "2026-08-04T10:00:00.000Z"
slug: "ngrx-signal-store-angular-2026"
---

# NgRx Signal Store: Lightweight, Signal-Based State Management for Angular

> **TL;DR:** `@ngrx/signals` gives you composable, signal-native state management without the actions/reducers/effects boilerplate of classic NgRx. You define state with `withState()`, derive values with `withComputed()`, expose mutations with `withMethods()`, and patch state with `patchState()` — all in one tightly typed file that injects like any Angular service.

If you have ever looked at a classic NgRx feature and counted the files — action enum, action creators, reducer, selector file, effects class, and the facade on top — you know the pain. For large, team-owned slices of global state that is still often the right model. But for a shopping cart, a notification feed, a user preferences panel, or any self-contained feature, that ceremony becomes a liability. The NgRx team's answer is `@ngrx/signals`, and after shipping with Angular 22's stable [`resource()`](/blog/angular-resource-api-httpresouce-signals-2026) and signal forms, it has become the default recommendation for feature-level state in modern Angular apps.

---

## The Problem: NgRx Boilerplate Does Not Scale Down

Classic NgRx was designed for large, Redux-patterned apps where auditability and time-travel debugging justify the overhead. The moment you need a feature store for something like a paginated product list, you end up with five or more files before writing a single unit of business logic:

```typescript
// The classic approach — just to track a loading flag and a list
export const loadProducts = createAction('[Products] Load');
export const loadProductsSuccess = createAction(
  '[Products] Load Success',
  props<{ products: Product[] }>()
);

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  }))
);

export const selectProducts = createSelector(
  selectProductsState,
  state => state.products
);
```

That is four concepts — action, action creator, reducer, selector — to express two state transitions. Multiply that by every feature in your app and you have a file proliferation problem that slows onboarding, diffing, and refactoring.

---

## The New Concept: SignalStore and Its Composable Primitives

`@ngrx/signals` introduces `signalStore()`, a function that composes typed feature slices into a self-contained, injectable Angular service. Each `with*` feature is a plain function that receives and extends the store's type — this is what makes the pattern work without decorators or inheritance.

Install the package:

```bash
npm install @ngrx/signals
```

Here is a complete feature store for the same product list:

```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { switchMap, pipe, tap } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from './product.model';

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  filter: string;
};

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  filter: '',
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ products, filter }) => ({
    filteredProducts: computed(() =>
      filter()
        ? products().filter(p =>
            p.name.toLowerCase().includes(filter().toLowerCase())
          )
        : products()
    ),
    totalCount: computed(() => products().length),
    hasProducts: computed(() => products().length > 0),
  })),

  withMethods((store, productService = inject(ProductService)) => ({
    setFilter(value: string): void {
      patchState(store, { filter: value });
    },

    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          productService.getAll().pipe(
            tapResponse({
              next: products => patchState(store, { products, loading: false }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
            })
          )
        )
      )
    ),
  }))
);
```

There are a few things worth unpacking here.

`withState()` turns each key in your state object into a signal automatically. You do not call `signal()` yourself — the store emits `store.products()`, `store.loading()`, and so on as typed `Signal<T>` properties.

`withComputed()` receives the store's current signals and returns derived `computed()` values. The factory argument is destructured directly, which keeps the code readable and ensures TypeScript narrows the type precisely.

`withMethods()` is where mutations live. The second argument to the factory function uses `inject()` — no constructor needed, and the injection happens inside Angular's injection context automatically. `patchState()` accepts a partial state object and merges it shallowly, so you never mutate the state object directly.

`rxMethod()` bridges an RxJS `Observable` pipeline into a method that the rest of your app can call imperatively. For the full RxJS ↔ signals interop guide, see [Angular toSignal() and toObservable()](/blog/angular-tosignal-toobservable-rxjs-interop-2026). You pass a `pipe()` chain and get back a callable that accepts the source value. This is the replacement for classic NgRx effects without needing a separate `@Injectable` effects class.

---

## Using the Store in a Component

Because `ProductsStore` is provided at root (or at component level if you pass `providedIn` to a component's `providers` array), you inject it with `inject()`:

```typescript
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductsStore } from './products.store';

@Component({
  selector: 'app-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <input
      type="text"
      placeholder="Filter products..."
      (input)="store.setFilter($any($event.target).value)"
    />

    <p>{{ store.totalCount() }} total products</p>

    @if (store.loading()) {
      <p>Loading...</p>
    }

    @if (store.error()) {
      <p class="error">{{ store.error() }}</p>
    }

    @for (product of store.filteredProducts(); track product.id) {
      <div class="product-card">
        <h3>{{ product.name }}</h3>
        <span>{{ product.price | currency }}</span>
      </div>
    } @empty {
      <p>No products match your filter.</p>
    }
  `,
})
export class ProductsComponent implements OnInit {
  readonly store = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadProducts();
  }
}
```

Because all store properties are signals, this component works perfectly with `OnPush`. Angular's signal-based change detection tracks reads automatically — no `async` pipe, no manual subscriptions, no `markForCheck()`.

---

## The Tool: `@ngrx/signals/entities` for Collection State

The package ships a dedicated sub-entry point for managing entity collections — the pattern you would previously handle with `@ngrx/entity` and its adapter. `withEntities()` gives you `entityMap`, `ids`, and `entities` signals plus pre-built `setEntities()`, `addEntity()`, `updateEntity()`, `removeEntity()`, and `removeAllEntities()` updaters:

```typescript
import { signalStore, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setEntities, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { Product } from './product.model';

export const CartStore = signalStore(
  { providedIn: 'root' },
  withEntities<Product>(),
  withMethods(store => ({
    addToCart(product: Product): void {
      patchState(store, setEntities([product]));
    },
    updateQuantity(id: string, quantity: number): void {
      patchState(store, updateEntity({ id, changes: { quantity } }));
    },
    removeFromCart(id: string): void {
      patchState(store, removeEntity(id));
    },
  }))
);
```

`withEntities()` defaults to using an `id` property as the entity identifier. You can override it with `withEntities<Product>({ selectId: (product) => product.sku })` if your model uses a different field — `selectId` is a function, not a key name, since the identifier doesn't have to be a single property lookup. The resulting `store.entities()` signal gives you a typed `Product[]` in insertion order, while `store.entityMap()` gives you a record keyed by id for O(1) lookups.

---

## Signal Store vs Classic NgRx: When to Use Each

NgRx Signal Store is not a full replacement for classic NgRx in every situation. Classic `@ngrx/store` still wins when you need Redux DevTools time-travel across the entire application state, cross-feature action dispatching as the primary integration point, or a codebase where the action log is a first-class audit requirement. For those cases, the extra boilerplate buys you real observability.

For everything else — feature-scoped state, UI state, async data fetching with a narrow owner — Signal Store is the better default. It ships fewer files, colocates logic, plays directly with Angular's signal graph, and eliminates the need for a facade pattern on top.

---

## Wrapping Up

`@ngrx/signals` solves the real problem with state management in Angular: most features do not need a Redux store, they need a typed, reactive service. With `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, and `patchState()`, you get all the structure of NgRx with a fraction of the ceremony. Start with one feature store in your current app — the migration path from a service-with-subjects is straightforward. The [official NgRx Signal Store documentation](https://ngrx.io/guide/signals) covers all available `with*` features., and the resulting code is easier to test and reason about.

---

## Frequently asked questions

### Do I need to remove classic NgRx to use @ngrx/signals?

No. The two packages are independent and can coexist in the same app. A common migration path is to leave existing NgRx slices in place and use Signal Store for all new features, gradually replacing the old slices as you touch them.

### Can I use patchState outside of withMethods?

Yes. `patchState(store, partialState)` is a standalone function you can call anywhere you have a reference to the store instance. In practice, keeping all mutations inside `withMethods()` is the recommended convention because it makes the store's public API explicit and testable.

### How do I test a SignalStore?

Inject the store directly in a `TestBed` setup using `providers: [ProductsStore]`. Because `withMethods()` uses `inject()` internally, you can provide mock services via `{ provide: ProductService, useValue: mockService }` in the same `providers` array. Signal values are readable synchronously in tests, so no `fakeAsync` or `tick()` is required for pure state reads.

### Does Signal Store work with Angular DevTools?

Yes. Angular DevTools (the browser extension) surfaces signal values from injectable services including Signal Stores. You can inspect the current value of any signal in the store under the component injector tree. For full Redux-style action logging, you would need to add `@ngrx/store-devtools` with a classic NgRx store, which Signal Store does not plug into directly.

---

**Related reading:**
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Angular resource() and httpResource(): Reactive HTTP with Signals](/blog/angular-resource-api-httpresouce-signals-2026)
- [Angular toSignal() and toObservable(): RxJS ↔ Signals Interop](/blog/angular-tosignal-toobservable-rxjs-interop-2026)
- [Angular v21 Zoneless Guide: Remove ZoneJS, Use Signals](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals)
- [Official NgRx Signal Store documentation](https://ngrx.io/guide/signals)
