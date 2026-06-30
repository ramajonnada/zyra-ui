---
title: 'Angular resource() and httpResource(): Reactive HTTP with Signals'
description: "A complete guide to Angular's resource() and httpResource() APIs — how to fetch data reactively with signals, handle loading and error states, refresh on demand, and replace RxJS-heavy data fetching patterns in Angular 21."
category:
    - 'Angular'
    - 'Angular 21'
tags:
    - 'angular resource'
    - 'angular httpresource'
    - 'angular signals'
    - 'angular http'
    - 'angular 21'
    - 'reactive data fetching'
    - 'angular zoneless'
keywords:
    - 'Angular resource API'
    - 'Angular httpResource'
    - 'Angular reactive HTTP signals'
    - 'Angular resource() tutorial'
    - 'Angular fetch data with signals'
date: '2026-06-29T10:00:00.000Z'
slug: 'angular-resource-api-httpresouce-signals-2026'
---

# Angular resource() and httpResource(): Reactive HTTP with Signals

> **TL;DR:** Angular's `resource()` and `httpResource()` APIs let you fetch async data reactively using signals — no RxJS, no manual subscriptions, no `ngOnInit` boilerplate. They expose `value()`, `status()`, `error()`, and `isLoading()` as signals so your templates stay lean, and they re-fetch automatically whenever their signal inputs change.

Fetching data in Angular used to mean a familiar chain: inject `HttpClient`, call `.pipe(takeUntilDestroyed())`, subscribe in `ngOnInit`, store the result in a local property, and manually handle loading and error states. It worked, but it was a lot of wiring for something that's just "load this data."

Angular's `resource()` and `httpResource()` APIs collapse that chain into a single reactive declaration. They are signal-native, zoneless-friendly, and designed to replace the most common RxJS data-fetching patterns without removing RxJS from your toolkit.

---

## resource() vs httpResource()

**`resource()`** accepts any async function — `fetch`, IndexedDB, or custom logic. You get full control over the loader, but it does not go through Angular's `HttpClient` pipeline, so interceptors and XSRF tokens don't apply. It has been available since Angular 19 (experimental) and is stable in v21.

**`httpResource()`** uses `HttpClient` under the hood. It runs through your interceptors, applies auth headers, and respects XSRF tokens automatically. Use it for all standard HTTP requests. It is available from Angular 21.

The rule is simple: reach for `httpResource()` for HTTP, and `resource()` only when you need async logic that doesn't go through `HttpClient`.

---

## httpResource() — the fast path

`httpResource()` takes a signal-returning URL function and gives back a resource object.

```ts
import { httpResource } from '@angular/common/http';
import { signal, Component } from '@angular/core';

interface Post {
    id: number;
    title: string;
    body: string;
}

@Component({
    standalone: true,
    template: `
        @if (post.isLoading()) {
            <app-skeleton />
        } @else if (post.error()) {
            <p class="error">Failed to load post.</p>
        } @else {
            <h1>{{ post.value()?.title }}</h1>
            <p>{{ post.value()?.body }}</p>
        }
    `,
})
export class PostDetailComponent {
    postId = signal(1);

    post = httpResource<Post>(() => `/api/posts/${this.postId()}`);
}
```

That's it. No `inject(HttpClient)`, no `subscribe()`, no teardown. When `postId` changes, `httpResource` re-fetches automatically.

### Reading the resource state

Every resource exposes four signals:

```ts
post.value(); // Post | undefined — the fetched data
post.status(); // ResourceStatus enum
post.isLoading(); // boolean — true while fetching
post.error(); // unknown — the error if fetch failed
```

`ResourceStatus` values:

```ts
import { ResourceStatus } from '@angular/core';

ResourceStatus.Idle; // 0 — no request made yet
ResourceStatus.Loading; // 1 — request in flight
ResourceStatus.Refreshing; // 2 — re-fetching with existing value
ResourceStatus.Resolved; // 3 — data available
ResourceStatus.Error; // 4 — fetch failed
ResourceStatus.Local; // 5 — value set manually via .set()
```

---

## Reactive re-fetching

The key feature: the URL function is a signal expression. Any signal read inside it becomes a dependency — when it changes, the resource re-fetches.

```ts
@Component({
    template: `
        <input [value]="search()" (input)="search.set($any($event.target).value)" />

        @for (user of users.value() ?? []; track user.id) {
            <app-user-card [user]="user" />
        }
    `,
})
export class UserSearchComponent {
    search = signal('');

    users = httpResource<User[]>(() => `/api/users?q=${this.search()}`);
}
```

Every time `search` updates, `users` re-fetches. The previous value stays in `users.value()` while the new fetch is in flight (status is `Refreshing`), so the UI never goes blank mid-search.

### Debouncing with RxJS interop

For search inputs you'll want to debounce. Bridge through `toObservable` / `toSignal`:

```ts
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

rawSearch = signal('');

debouncedSearch = toSignal(toObservable(this.rawSearch).pipe(debounceTime(300)), {
    initialValue: '',
});

users = httpResource<User[]>(() => `/api/users?q=${this.debouncedSearch()}`);
```

---

## resource() — custom async logic

When you need full control — a custom fetch, IndexedDB, or a multi-step async operation — use `resource()`:

```ts
import { resource, signal } from '@angular/core';

@Component({ standalone: true, ... })
export class ProductComponent {
  productId = signal(42);

  product = resource({
    request: () => ({ id: this.productId() }),
    loader: async ({ request, abortSignal }) => {
      const res = await fetch(`/api/products/${request.id}`, { signal: abortSignal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }
  });
}
```

Key points:

- `request` is a signal expression that produces the loader's input. When it changes, `loader` re-runs.
- `loader` receives `{ request, abortSignal }` — cancelled automatically when the request changes mid-flight, preventing stale responses.
- Throw an error in `loader` to put the resource into the `Error` state.

---

## Conditional fetching

Skip fetching when the input isn't ready by returning `undefined` from the URL function:

```ts
userId = signal<number | null>(null);

profile = httpResource<Profile>(() => (this.userId() ? `/api/users/${this.userId()}` : undefined));
```

When the URL function returns `undefined`, the resource stays `Idle` and makes no request. As soon as `userId` becomes a number, it fetches automatically.

---

## Manual refresh and optimistic updates

### Reload

Trigger a manual re-fetch without changing any input signal:

```html
<button (click)="comments.reload()">Refresh</button>
```

### Optimistic updates with .set()

Override the resource value directly, then reconcile after the server responds:

```ts
addComment(comment: Comment) {
  // Optimistically update the UI instantly
  this.comments.set([...(this.comments.value() ?? []), comment]);

  // Persist — reload on success, rollback on error
  this.http.post('/api/comments', comment).subscribe({
    next: () => this.comments.reload(),
    error: () => this.comments.reload()
  });
}
```

After calling `.set()`, the status becomes `Local` until the next fetch.

---

## Request options with httpResource

Pass a full request config object instead of just a URL string:

```ts
posts = httpResource<Post[]>(() => ({
    url: '/api/posts',
    method: 'GET',
    params: { page: this.page(), limit: 20 },
    headers: { 'X-Custom': 'value' },
}));
```

This runs through Angular's `HttpClient` pipeline, so your interceptors, auth headers, and XSRF tokens apply automatically.

---

## Replacing common RxJS patterns

### Before — manual subscription

```ts
@Component({ ... })
export class OldComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = true;
    this.http.get<Post[]>('/api/posts')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => { this.posts = data; this.isLoading = false; },
        error: err => { this.error = err.message; this.isLoading = false; }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### After — httpResource

```ts
@Component({ ... })
export class NewComponent {
  posts = httpResource<Post[]>(() => '/api/posts');
}
```

Same result. No lifecycle hooks, no subscriptions, no teardown.

---

## Template patterns

### Loading skeleton + error state

```html
@if (data.isLoading()) {
<app-skeleton [rows]="5" />
} @else if (data.error()) {
<app-error-state (retry)="data.reload()" />
} @else {
<app-data-table [rows]="data.value() ?? []" />
}
```

### Refreshing without blanking the UI

Use `status()` to distinguish the first load from a re-fetch so the list stays visible while updating:

```html
<div class="list-wrapper" [class.refreshing]="data.status() === 2">
    @for (item of data.value() ?? []; track item.id) {
    <app-item [item]="item" />
    }
</div>
```

```scss
.refreshing {
    opacity: 0.6;
    pointer-events: none;
    transition: opacity 150ms;
}
```

---

## SSR and httpResource

`httpResource()` works correctly with Angular SSR. On the server it fetches data before serializing the HTML, so crawlers and users receive real content — important for Core Web Vitals and SEO.

Pair it with `withHttpTransferCache()` so the server's fetched data is transferred to the browser, avoiding a double fetch on hydration:

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
    providers: [provideHttpClient(withFetch(), withHttpTransferCache())],
};
```

With this, `httpResource()` fetches once on the server, serializes the result into the page, and the browser skips the request on hydration.

---

## When to stick with RxJS

`resource()` and `httpResource()` cover the majority of data-fetching cases, but RxJS is still the right tool for:

- **Complex stream composition** — `combineLatest`, `switchMap`, `mergeMap`
- **WebSockets** or server-sent events
- **Retry with backoff** — `retry({ delay, count })`
- **Polling** — `interval` + `switchMap`
- **Accumulating pagination** (infinite scroll)

For those, keep RxJS and bridge to signals with `toSignal()` when the template needs the result.

---

## Quick reference

```ts
// Simple GET
const data = httpResource<T>(() => '/api/endpoint');

// Reactive — re-fetches when id() changes
const item = httpResource<T>(() => `/api/items/${this.id()}`);

// Conditional — skips fetch when null
const item = httpResource<T>(() => (this.id() ? `/api/items/${this.id()}` : undefined));

// With params
const list = httpResource<T[]>(() => ({
    url: '/api/items',
    params: { page: this.page(), q: this.search() },
}));

// Custom async (resource)
const item = resource({
    request: () => ({ id: this.id() }),
    loader: async ({ request, abortSignal }) => {
        const res = await fetch(`/api/items/${request.id}`, { signal: abortSignal });
        return res.json() as Promise<T>;
    },
});

// Reading state
data.value(); // T | undefined
data.isLoading(); // boolean
data.error(); // unknown
data.status(); // ResourceStatus (0–5)

// Actions
data.reload(); // re-fetch
data.set(newValue); // set local value (optimistic update)
```

---

`resource()` and `httpResource()` are the clearest sign yet that Angular's signal story is complete. Data fetching — historically one of the most boilerplate-heavy parts of an Angular component — is now a one-liner that stays reactive, handles request cancellation, and plugs into SSR out of the box.
