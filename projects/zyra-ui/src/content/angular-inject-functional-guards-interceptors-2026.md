---
title: "Angular inject() in Functional Guards and Interceptors: A Complete 2026 Guide"
description: "Learn how inject() unlocks composable functional guards, HTTP interceptors, and factory providers in Angular standalone apps — no class boilerplate needed."
category:
    - "Angular 21"
tags:
    - "angular"
    - "inject"
    - "functional guards"
    - "http interceptors"
    - "standalone"
keywords:
    - "angular inject function guards"
    - "angular functional guards 2026"
    - "angular http interceptors standalone"
    - "inject() outside constructor angular"
    - "angular composable guards inject"
date: "2026-07-27T10:00:00.000Z"
slug: "angular-inject-functional-guards-interceptors-2026"
---

# Angular inject() in Functional Guards and Interceptors: A Complete 2026 Guide

> **TL;DR:** The `inject()` function lets you access Angular's dependency injection system from any injection context — not just class constructors. Functional route guards and HTTP interceptors are leaner, more composable, and fully testable without class boilerplate. This post walks through exactly how to use `inject()` in guards, interceptors, and factory providers, plus how to test them with Mock Service Worker.

---

Class-based route guards and HTTP interceptors were Angular's standard for years. Every auth guard started the same way: implement `CanActivate`, inject your `AuthService` in the constructor, return an `Observable<boolean>`. Clean enough at the start, but as apps grow the inheritance chains, interface juggling, and stubbing complexity in tests starts to slow you down.

Angular's functional approach — enabled by `inject()` — eliminates the class ceremony entirely. This same pattern applies to [signal inputs and outputs](/blog/angular-input-output-signal-api-replace-decorators) in components, where `inject()` replaces constructor injection throughout. A guard becomes a plain function. An interceptor becomes a handler. Both are easier to compose, easier to read, and significantly easier to test.

---

## The Problem: Class Guards Do Not Compose Well

Suppose you have three requirements for a protected route: the user must be authenticated, must have a verified email, and must have accepted the latest terms of service. With class-based guards, you end up with three separate `CanActivate` implementations plus a compound guard that somehow delegates to all three — or you inherit from a base class and override methods, which Angular teams usually regret within six months.

```typescript
// The old way — three classes, three providers, glue logic in the router config
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAuthenticated$.pipe(
      map(ok => ok || this.router.createUrlTree(['/login']))
    );
  }
}
```

Now multiply that pattern by three and try to write a unit test for the compound case. You end up constructing three class instances, providing three sets of mock dependencies, and wiring them together in a `TestBed` setup that is longer than the guard logic itself.

The functional approach collapses this entirely.

---

## The Core Concept: inject() in Any Injection Context

`inject()` is not magic — it is a function that reads Angular's current injection context and resolves a token from it. Angular establishes an injection context in four places: class constructors decorated with `@Injectable` or `@Component`, the `providers` array (factory functions), `runInInjectionContext()`, and — crucially for this post — functional guard and interceptor functions called by the router and `HttpClient`.

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';

// A complete auth guard in five lines
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() || router.createUrlTree(['/login']);
};
```

Because `authGuard` is called by the router inside an injection context, `inject(AuthService)` resolves exactly the same instance as it would inside a class constructor. No `@Injectable`, no constructor parameters, no provider registration for the guard itself.

### Composing Guards with inject()

The real power shows up when you compose multiple concerns into one guard or share logic across many guards through plain functions.

```typescript
// auth.guards.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Reusable building block — not a guard itself, just a helper
function requireAuth(): true | ReturnType<Router['createUrlTree']> {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return true;
}

function requireVerifiedEmail(): true | ReturnType<Router['createUrlTree']> {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser()?.emailVerified) {
    return router.createUrlTree(['/verify-email']);
  }
  return true;
}

// Compose them into concrete guards
export const authGuard: CanActivateFn = () => requireAuth();

export const verifiedGuard: CanActivateFn = () => {
  const auth = requireAuth();
  if (auth !== true) return auth; // redirect if not logged in first
  return requireVerifiedEmail();
};
```

These two helpers share zero code other than the logic they are supposed to share. Add a third concern — terms acceptance, role check, feature flag — by writing another helper and composing it into the appropriate guard. No base classes, no `implements`, no provider array entries for the guards.

Wire them into the router as normal:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then(m => m.SettingsComponent),
    canActivate: [verifiedGuard],
  },
];
```

---

## Functional HTTP Interceptors

HTTP interceptors follow the same pattern. Instead of implementing `HttpInterceptor` and injecting via `HTTP_INTERCEPTORS`, you write a function of type `HttpInterceptorFn` and pass it to `withInterceptors()` in `provideHttpClient()`.

```typescript
// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  if (!token) return next(req);

  const authedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authedReq);
};
```

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

Composing interceptors is just passing more functions to `withInterceptors`. Order matters — they run in the order listed:

```typescript
provideHttpClient(
  withInterceptors([
    loggingInterceptor,  // runs first
    authInterceptor,     // runs second, attaches token
    retryInterceptor,    // runs third, retries on 5xx
  ])
)
```

Each interceptor is a plain function and `inject()` works in all of them — pull in any provided service or token without touching class constructors.

---

## inject() in Factory Providers

`inject()` also works inside the `useFactory` option of a provider, which is useful for building values that depend on multiple services without creating a dedicated wrapper class.

```typescript
// analytics-config.token.ts
import { inject, InjectionToken } from '@angular/core';
import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';

export interface AnalyticsConfig {
  userId: string | null;
  env: 'dev' | 'prod';
}

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('ANALYTICS_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const auth = inject(AuthService);
    const env = inject(EnvironmentService);
    return {
      userId: auth.currentUser()?.id ?? null,
      env: env.isProd ? 'prod' : 'dev',
    };
  },
});
```

The `factory` function runs inside an injection context, so `inject()` resolves services normally. No need for a dedicated provider class or a `useFactory: (auth, env) => ...` with a long `deps` array that loses type safety.

---

## The New Tool: Mock Service Worker for Testing Interceptors

Testing HTTP interceptors used to mean using `HttpTestingController` by hand and asserting on raw request details. [Mock Service Worker (MSW)](https://mswjs.io/) is a network-level API mocking library that intercepts requests before they leave the browser or Node process — your Angular code runs exactly as it would in production, with no `TestBed` HTTP overrides needed.

Install it:

```bash
npm install msw --save-dev
npx msw init public/ --save
```

Write a handler for the endpoint your interceptor protects:

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/profile', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({ id: '123', name: 'Test User' });
  }),
];
```

Then in a Jest test (which runs in Node), spin up the MSW Node server and let your real `HttpClient` + interceptor call it:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('attaches Authorization header when token is present', async () => {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      { provide: AuthService, useValue: { accessToken: signal('test-token-123') } },
    ],
  });

  const http = TestBed.inject(HttpClient);
  const result = await firstValueFrom(http.get('/api/profile'));

  // MSW enforced the auth check at the network level —
  // if we got a 200 here, the header was present and correct
  expect(result).toEqual({ id: '123', name: 'Test User' });
});
```

Because MSW intercepts at the network boundary, you are testing the full pipeline — `HttpClient`, your interceptor, and the response parsing — without mocking Angular internals. Swap the mock token for a missing one and confirm the interceptor does not attach a header, then watch MSW return a 401. The tests read like real user scenarios rather than implementation assertions.

Karma runs your tests in a real browser, not Node, so `msw/node`'s `setupServer` doesn't apply there — Node's `http`/`https` module interception has nothing to hook into in a browser. For Karma (or any browser-based runner), use MSW's browser integration instead: `setupWorker` from `msw/browser`, which registers a Service Worker to intercept `fetch`/`XHR` calls, started with `worker.start()` in place of `server.listen()`. The handlers array is identical either way — only the setup/teardown calls differ between the two environments.

---

## Wrapping up

Functional guards and interceptors backed by `inject()` cut through the class ceremony that made this layer of Angular apps tedious. A guard becomes a five-line function. An interceptor composes with other interceptors by simply being next in the array. Testing the whole pipeline with MSW is straightforward and produces tests that survive refactors. Replace your next class-based guard with a functional one — the `CanActivateFn` type and `withInterceptors()` have been stable since Angular v15, and the pattern has only gotten cleaner since then. For testing these guards and interceptors, [Playwright Component Testing](/blog/playwright-component-testing-angular-2026) and [Vitest](/blog/vitest-angular-faster-unit-tests-2026) both work well with functional DI patterns.

---

## Frequently asked questions

### Can inject() be called inside a setTimeout or Promise callback inside a guard?

No — `inject()` must be called synchronously during the injection context setup phase. The [official Angular dependency injection guide](https://angular.dev/guide/di) explains injection contexts in detail. Calling it inside a `setTimeout`, a Promise `.then()`, or an RxJS operator callback throws a runtime error. The fix is to call `inject()` at the top of your functional guard or interceptor to capture the service reference, then use that captured reference inside any async callbacks.

### Do functional guards cover every use case the old class-based guards did?

Yes. `CanActivateFn`, `CanActivateChildFn`, `CanDeactivateFn`, `CanMatchFn`, and `ResolveFn` cover every case the old interface-based guards covered — Angular routes both to the same internal hooks. The only reason to keep a class-based guard today is if a large codebase is undergoing a phased migration and the team is not ready to convert everything at once.

### What is the difference between withInterceptors() and the old HTTP_INTERCEPTORS token?

`withInterceptors()` registers functional interceptors in a predictable order defined explicitly at `provideHttpClient()` call time. The old `HTTP_INTERCEPTORS` multi-token approach used provider registration order, which became unpredictable in large apps with multiple lazy-loaded modules each adding their own interceptors. The functional approach also tree-shakes unused interceptors automatically because they are direct function references rather than class tokens resolved at runtime.

### Does inject() work inside computed() or effect()?

Not inside the callback itself. `computed()` and `effect()` can be *created* in an injection context (a component constructor, for example), but the callback function you pass to them runs later — potentially many times, whenever a dependency changes — outside that context, the same as the `setTimeout`/Promise case above. Calling `inject()` inside the callback body throws. Call `inject()` before creating the `computed()`/`effect()` to capture the service reference, then use that captured reference inside the callback. If you need `inject()` inside a standalone utility function that runs outside a component lifecycle — such as in a helper module — wrap the call in `runInInjectionContext(injector, () => { ... })` and pass the `Injector` instance retrieved earlier from within a valid context.

---

**Related reading:**
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [Faster Angular Tests with Vitest: Drop Jest and Never Look Back](/blog/vitest-angular-faster-unit-tests-2026)
- [Playwright CT for Angular: Component Testing in a Real Browser](/blog/playwright-component-testing-angular-2026)
- [Official Angular dependency injection guide](https://angular.dev/guide/di)
