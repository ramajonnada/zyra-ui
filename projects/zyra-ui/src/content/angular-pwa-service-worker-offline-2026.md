---
title: "Angular PWA Service Worker: Build Offline-First Apps in 2026"
description: "Learn how to build Angular PWA offline-first apps using @angular/service-worker, ngsw-config.json, and signal-based cache state in 2026."
category:
    - "Angular 21"
tags:
    - "angular pwa"
    - "service worker"
    - "offline-first"
    - "progressive web app"
    - "angular performance"
keywords:
    - "angular pwa service worker"
    - "angular offline-first app"
    - "ngsw-config angular"
    - "angular service worker caching"
    - "progressive web app angular 2026"
date: "2026-08-08T10:00:00.000Z"
slug: "angular-pwa-service-worker-offline-2026"
---

# Angular PWA Service Worker: Build Offline-First Apps in 2026

> **TL;DR:** Angular's `@angular/service-worker` package turns any standalone Angular app into a PWA with a single schematic, a declarative cache config, and built-in update notifications. This post walks you through the full setup, shows how to expose service worker state as Angular signals, and highlights where ZyraUI components make the install prompt and update banner production-ready in minutes.

Your users lose their connection. On a train, in a tunnel, on a spotty mobile plan — it happens constantly. A plain Angular SPA just shows a blank screen. An Angular PWA with a service worker keeps serving the last cached version, queues writes for later, and tells the user calmly that they're offline. **Angular PWA service worker** support is mature, declarative, and worth adding to every production app.

---

## The Problem: Blank Screens on Bad Connections

Without a service worker, an Angular app makes a network request for every asset on load. When the network is gone, the browser returns nothing and the user sees an error page. The fix is not complex — but it does require understanding the Angular service worker's caching model before you configure it.

The key mental model: the Angular service worker (`ngsw`) intercepts fetch events in the browser. On the first load it caches everything defined in `ngsw-config.json`. On subsequent loads, even with no network, it serves those cached assets. The app still loads. API calls are handled separately by a configurable data-group strategy.

---

## Step 1: Add the Angular PWA Schematic

Install the `@angular/pwa` schematics package and run the generator:

```bash
ng add @angular/pwa --project my-app
```

This does five things in one command:

1. Installs `@angular/service-worker`
2. Adds `ServiceWorkerModule` configuration to your app config (or `provideServiceWorker()` in standalone)
3. Generates a starter `ngsw-config.json` in your project root
4. Creates a `manifest.webmanifest` with icons
5. Patches `index.html` with `<link rel="manifest">` and `<meta name="theme-color">`

For standalone Angular apps (the norm in 2026), the generated code uses `provideServiceWorker()`:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

The `registerWhenStable:30000` strategy waits up to 30 seconds for the app to stabilize before registering the service worker. This avoids the worker slowing down initial paint. See the [Angular service worker guide on angular.dev](https://angular.dev/ecosystem/service-workers) for the full list of registration strategies.

---

## Step 2: Configure ngsw-config.json for Angular PWA Caching

The `ngsw-config.json` file is the heart of your angular pwa service worker setup. It declares which assets get cached and how API calls are handled.

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app-shell",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/manifest.webmanifest", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.(svg|cur|jpg|jpeg|png|webp|avif|gif|otf|ttf|woff|woff2)"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-freshness",
      "urls": ["/api/live/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1m",
        "timeout": "5s"
      }
    },
    {
      "name": "api-performance",
      "urls": ["/api/static/**"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 200,
        "maxAge": "1d"
      }
    }
  ]
}
```

Two `assetGroups` strategies matter here:

- **`prefetch`** — download all assets immediately when the service worker installs. Use this for the app shell (HTML, JS, CSS). Users can go offline the moment the first load finishes.
- **`lazy`** — download assets only when first requested, then keep them cached. Use this for images and fonts.

Two `dataGroups` strategies for API calls:

- **`freshness`** — try the network first, fall back to cache if the network is slower than `timeout`. Best for live data like dashboards.
- **`performance`** — serve from cache first, refresh in background. Best for mostly-static reference data.

The `maxAge` and `maxSize` fields prevent the cache from growing indefinitely. Angular's ngsw enforces both limits automatically.

---

## Step 3: Expose Update State as Angular Signals

The Angular service worker fires update events when a new version of your app is deployed. Reading those events as signals gives you reactive offline-first state that any component can consume without injecting `SwUpdate` in the constructor.

```typescript
// sw-update.service.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private swUpdate = inject(SwUpdate);

  readonly isEnabled = this.swUpdate.isEnabled;

  private versionReady$ = this.swUpdate.versionUpdates.pipe(
    filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY')
  );

  readonly updateAvailable = toSignal(this.versionReady$, { initialValue: null });

  readonly hasUpdate = computed(() => this.updateAvailable() !== null);

  activateUpdate(): Promise<boolean> {
    return this.swUpdate.activateUpdate().then(() => {
      document.location.reload();
      return true;
    });
  }
}
```

The `toSignal()` call bridges the RxJS observable from `SwUpdate.versionUpdates` into a signal, making it compatible with the signal graph across your app. Read more about the [RxJS-to-signals bridge](https://angular.dev/guide/signals/rxjs-interop) in the Angular docs.

---

## Using ZyraUI for the PWA Update Banner

Once you have update state exposed as signals, you need a UI to notify users. A dismissible banner with an "Update now" button is the standard pattern — and it's exactly where [ZyraUI components](https://www.zyraui.dev/docs/components) shine.

Here is a complete update-notification component using [ZyraUI's Alert component](https://www.zyraui.dev/docs/components/alert) and the `SwUpdateService` from above:

```typescript
// update-banner.component.ts
import { Component, inject } from '@angular/core';
import { SwUpdateService } from './sw-update.service';
import { ZyraAlertComponent, ZyraButtonComponent } from '@zyra-ui/angular';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  imports: [ZyraAlertComponent, ZyraButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sw.hasUpdate()) {
      <zyra-alert type="info" dismissible>
        <span>A new version is available.</span>
        <zyra-button size="sm" variant="primary" (click)="sw.activateUpdate()">
          Update now
        </zyra-button>
      </zyra-alert>
    }
  `,
})
export class UpdateBannerComponent {
  protected sw = inject(SwUpdateService);
}
```

The `@if (sw.hasUpdate())` block renders the banner only when the signal fires — zero flicker, zero extra subscriptions. Drop `<app-update-banner>` into your app shell and your angular offline-first app handles its own update lifecycle.

You can explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) — including [cards, modals, tables, forms, and more](https://www.zyraui.dev/docs/components). The [ZyraUI docs](https://www.zyraui.dev/docs) also cover theming, so your update banner inherits your brand colors automatically.

---

## Step 4: Testing Your Angular PWA Service Worker Locally

The service worker only activates in a production build. The typical local workflow:

```bash
# Build in production mode
ng build --configuration production

# Serve with a static server that supports service worker headers
npx serve -s dist/my-app/browser -l 4200
```

Open DevTools → Application → Service Workers. You'll see `ngsw-worker.js` listed as `activated and running`. Switch to the Network tab and check "Offline." Reload — your app still loads. That's your angular service worker caching working.

To simulate an app update, change a component, rebuild, and refresh. DevTools will show "Update available" in the Service Workers panel, and your `UpdateBannerComponent` should render.

Tools like [Workbox](https://developer.chrome.com/docs/workbox/) from Google are an alternative to `ngsw` for teams who need more fine-grained cache strategies — but for most Angular apps, the declarative ngsw approach requires less configuration and is better integrated with the Angular CLI build pipeline.

---

## Wrapping Up

Angular PWA service worker support covers the full lifecycle: offline asset serving via prefetch/lazy asset groups, API caching with freshness and performance strategies, and reactive update notifications with signals. The `@angular/pwa` schematic gets you from zero to working in one command, and `ngsw-config.json` keeps cache policy reviewable in plain JSON.

For the UI layer, [ZyraUI's component library](https://www.zyraui.dev) gives you production-ready alert, button, and toast components that wire directly to your signal-based service worker state — no extra work needed. Check out the [ZyraUI docs](https://www.zyraui.dev/docs) to see how it fits your stack.

---

## Frequently asked questions

### What is the Angular PWA service worker and how does it work?
The Angular PWA service worker (`ngsw-worker.js`) is a generated script that intercepts browser fetch events and serves assets from a versioned cache. It is configured entirely via `ngsw-config.json` and managed through the `@angular/service-worker` package. During a production build, the Angular CLI generates the worker script and a manifest of hashed assets, so the worker knows exactly which files to cache and when to invalidate them after a new deployment.

### Does the Angular service worker work with standalone components?
Yes. In Angular 17+ standalone apps, you use `provideServiceWorker()` in your `app.config.ts` providers array instead of the older `ServiceWorkerModule.register()`. The rest of the `ngsw-config.json` setup is identical regardless of whether your app uses NgModules or standalone components.

### What is the difference between the freshness and performance data group strategies?
The `freshness` strategy tries the network first and falls back to cache only if the network times out (controlled by the `timeout` field). Use it for endpoints where stale data would be wrong — dashboards, prices, user-specific data. The `performance` strategy serves from cache first and refreshes in the background. Use it for mostly-static data like product catalogs or reference lists where a few seconds of staleness is acceptable.

### How do I force users to update to a new app version?
Call `SwUpdate.activateUpdate()` after detecting a `VERSION_READY` event, then reload the page with `document.location.reload()`. You can gate this on user confirmation using a dialog. Angular's service worker will never silently replace a running app — the new version only activates when you explicitly call `activateUpdate()` or the user closes and reopens all tabs running the app.
