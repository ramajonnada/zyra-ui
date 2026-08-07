---
title: "Angular Lazy Routes with loadComponent: Route-Level Code Splitting in 2026"
description: "Learn how to use Angular's loadComponent and loadChildren for route-level code splitting, smaller bundles, and faster initial load in standalone apps."
category:
    - "Angular 21"
tags:
    - "angular"
    - "lazy loading"
    - "code splitting"
    - "routing"
    - "performance"
keywords:
    - "angular lazy routes loadComponent"
    - "angular route-level code splitting"
    - "loadChildren angular standalone"
    - "angular bundle size optimization"
    - "provideRouter tree-shakeable routing"
date: "2026-08-06T10:00:00.000Z"
slug: "angular-lazy-routes-loadcomponent-code-splitting-2026"
---

# Angular Lazy Routes with loadComponent: Route-Level Code Splitting in 2026

> **TL;DR:** Using `loadComponent` and `loadChildren` in Angular's router gives you automatic route-level code splitting with zero extra tooling. Each lazy route becomes its own JS chunk, loaded only when the user navigates there — often cutting initial bundle size by 40–70%.

When a user opens your Angular app, they should not have to download the code for every page upfront. Yet this is exactly what happens if you import all your components at the top of your routes file. Angular's **angular lazy routes loadComponent** API — available since Angular 15 and refined through Angular 22 — is the idiomatic fix. It integrates directly with the router and Webpack/esbuild to produce one JS chunk per lazy route automatically.

This post covers the problem, the modern route-level code splitting API, and the `source-map-explorer` tool for verifying your splits actually worked.

---

## The Problem: Eager Imports Blow Up Your Initial Bundle

Consider a typical routes file before lazy loading:

```typescript
// routes.ts — everything eagerly imported
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminPanelComponent } from './admin/admin-panel.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'admin', component: AdminPanelComponent },
];
```

Every static `import` at the top of this file gets bundled into your main chunk. A user who lands on `/dashboard` downloads the code for `ReportsComponent`, `AdminPanelComponent`, and everything they transitively import — even though they may never visit those routes. This is the **eager import tax**, and it grows linearly with your app.

**Angular lazy routes loadComponent** solves this by deferring the import to a dynamic `import()` call that bundlers split into a separate chunk.

---

## Route-Level Code Splitting with loadComponent

The simplest fix is replacing `component:` with `loadComponent:` and wrapping your import in a dynamic arrow function:

```typescript
// routes.ts — lazy loaded with loadComponent
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then(m => m.ReportsComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-panel.component').then(m => m.AdminPanelComponent),
  },
];
```

Each `import()` call is a split point for esbuild or Webpack. At build time, Angular's build system emits one chunk per dynamic import. At runtime, the chunk for `/reports` is only fetched when the user navigates there.

If your component is the default export, you can skip the `.then()`:

```typescript
loadComponent: () => import('./settings/settings.component'),
```

This works because Angular's router accepts both a resolved component and a default-export module.

---

## Grouping Routes with loadChildren for Feature Modules

When a feature has several sub-routes, `loadChildren` lets you lazy-load the route config itself as a separate chunk, deferring the whole feature until it's needed:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];
```

```typescript
// admin/admin.routes.ts — the feature's own route array
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'audit-log',
        loadComponent: () =>
          import('./audit-log/audit-log.component').then(m => m.AuditLogComponent),
      },
    ],
  },
];
```

Nobody outside the admin feature loads `admin.routes.ts` or any of its children — `loadChildren` splits off the route config, and each `loadComponent` inside it splits off its own component chunk, so `AdminShellComponent`, `UsersComponent`, and `AuditLogComponent` still end up in separate chunks, all deferred until a user navigates into `/admin`. You can nest `loadChildren` as deep as you like; each level is an independent split point.

---

## Providing Services Scoped to a Lazy Route

A common pattern with standalone routing is providing services only within a lazy feature. Use `providers` on the parent route:

```typescript
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  providers: [
    AdminApiService,
    { provide: ADMIN_CONFIG, useValue: { logLevel: 'verbose' } },
  ],
}
```

Services listed here are created in an environment injector scoped to that route and shared by its children, so `UsersComponent` and `AuditLogComponent` both resolve the same `AdminApiService` instance. That injector is destroyed when the route it's attached to is deactivated — for example navigating from `/admin/users` to a sibling route outside the `admin` subtree. This gives you feature-scoped singletons without NgModules — the modern equivalent of a lazy `NgModule` with `providers`.

---

## Preloading Strategies — Load in the Background After First Paint

Lazy loading can introduce a small delay on first navigation if a chunk hasn't been fetched yet. Angular's preloading strategies eliminate this for the common case:

```typescript
// app.config.ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
};
```

`PreloadAllModules` prefetches all lazy chunks after the initial render is complete. For most apps this is the right default — the user gets a fast initial load, and subsequent navigations feel instant.

For finer control, Angular's `QuicklinkStrategy` (from the [`ngx-quicklink`](https://github.com/mgechev/ngx-quicklink) package) only prefetches chunks for links visible in the current viewport — a smart default for content-heavy apps.

---

## Using source-map-explorer to Verify Your Splits

Switching to `loadComponent` does not guarantee splits happened — a misconfigured build or a circular static import can silently defeat the splitting. Always verify with `source-map-explorer`:

```bash
npm install --save-dev source-map-explorer

# build with source maps
ng build --source-map

# analyse
npx source-map-explorer dist/your-app/browser/*.js
```

The tool opens a treemap in your browser. Each box is a module. If you see `ReportsComponent` inside your `main-*.js` chunk, the split did not happen — trace the static imports back from `routes.ts` to find the offender.

`source-map-explorer` pairs well with Angular's built-in `--stats-json` flag and [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) if you're still on a Webpack-based build.

---

## Using ZyraUI for Angular Lazy Routes

When building a dashboard with multiple lazy routes, you still need a polished loading experience for the moment a chunk is being fetched. ZyraUI's `zyra-spinner` component gives you a lightweight, accessible loading indicator that fits naturally into Angular's router events.

```typescript
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ZyraSpinnerComponent } from '@zyra-ui/angular';

@Component({
  standalone: true,
  imports: [RouterOutlet, ZyraSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="route-loading-overlay">
        <zyra-spinner size="lg" aria-label="Loading page" />
      </div>
    }
    <router-outlet />
  `,
})
export class AppShellComponent {
  loading = signal(false);

  constructor() {
    const router = inject(Router);

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading.set(false);
      }
    });
  }
}
```

The `zyra-spinner` renders an accessible `role="status"` element with a smooth animation — no extra CSS needed. You can also use [`zyra-skeleton`](https://www.zyraui.dev/docs/components/skeleton) to show placeholder shapes that match your route's layout while the chunk loads, giving users a better perceived performance experience than a centered spinner.

Explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) — including [cards, modals, tables, forms, and more](https://www.zyraui.dev/docs/components).

---

## Wrapping Up

Route-level code splitting with `loadComponent` and `loadChildren` is one of the highest-ROI performance improvements you can make in an Angular app. It requires no third-party libraries and integrates directly with the [Angular router](https://angular.dev/guide/routing) — flip static imports to dynamic ones and the build system does the rest. Pair it with a preloading strategy to avoid navigation delays, and verify your splits with `source-map-explorer`. For the full Angular component toolkit, check out [ZyraUI docs](https://www.zyraui.dev/docs).

---

## Frequently Asked Questions

### What is the difference between loadComponent and loadChildren for angular lazy routes?
`loadComponent` lazily loads a single standalone component for a specific route path. `loadChildren` lazily loads an entire route array (subtree), making it the right choice when a feature has multiple child routes that should all share a single chunk boundary. Use `loadComponent` for leaf routes and `loadChildren` for feature-level groups.

### Does angular lazy routes loadComponent work with OnPush change detection?
Yes — `loadComponent` has no impact on how a component detects changes. Components loaded lazily can and should use `ChangeDetectionStrategy.OnPush`. Because `OnPush` is the default in Angular 22, any newly scaffolded standalone component is already set up correctly.

### How do I preload specific routes instead of all routes for angular bundle size optimization?
Implement a custom `PreloadingStrategy`. Return `Observable<void>` from the `preload()` method — emit immediately for routes you want preloaded, return `NEVER` for the rest. You can use route data (e.g. `data: { preload: true }`) as the decision signal, giving you per-route control without a third-party library.

### Will angular route-level code splitting work with SSR and Angular Universal?
Yes. Angular's SSR renders each route on the server using the full route tree, so lazy chunks are resolved server-side at render time. On the client, Angular's hydration picks up where the server left off. The chunk for the hydrated route is typically already in the browser cache from the server-sent link preload headers — navigation feels instant.
