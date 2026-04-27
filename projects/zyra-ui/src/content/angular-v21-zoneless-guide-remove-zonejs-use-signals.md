---
title: "Angular v21 Zoneless Guide: Remove ZoneJS, Use Signals"
description: "Learn what zoneless Angular means in v21, why ZoneJS is no longer the default, how signals fit in, and how to migrate safely."
category:
    - "Angular 21"
    - "zoneless angular"
tags:
    - "angular 21"
    - "zoneless change detection"
    - "angular signals"
    - "angular best practices"
    - "scalable angular apps"
    - "angular"
keywords:
    - "Angular"
    - "angular signals"
    - "Angular zoneless"
    - "zoneless angular "
    - "zoneless Angular migration"
date: "2026-04-27T13:48:15.259Z"
slug: "angular-v21-zoneless-guide-remove-zonejs-use-signals"
---

# Angular v21 Zoneless Guide: Remove ZoneJS and Build Faster Apps with Signals

Angular has been moving toward a more explicit and more predictable reactivity model for a while, and zoneless Angular is one of the biggest results of that shift.

As of Angular v21, zoneless is the default experience for new apps. Angular's roadmap also notes that zoneless became stable in v20.2, which means this is no longer a niche experiment. It is now part of the mainstream Angular direction.

If you build modern Angular apps with signals, standalone components, and SSR, this matters a lot.

In this guide, you will learn:

- what zoneless Angular actually means
- why Angular is moving away from ZoneJS
- how signals make zoneless apps practical
- how to migrate an existing app safely
- what can break during migration

---

## What does zoneless mean in Angular?

Traditionally, Angular used ZoneJS to patch browser APIs and detect when something *might* have changed.

That worked well for a long time, but it also meant Angular often had to run synchronization work more broadly than necessary. ZoneJS could tell that some async work happened, but it could not always tell whether your UI really needed to update.

Zoneless Angular removes that dependency and instead relies on explicit update signals from Angular APIs.

According to the Angular docs, Angular can update views when notifications come from places like:

- updating a signal that is read in a template
- `ChangeDetectorRef.markForCheck`
- `ComponentRef.setInput`
- bound host or template listeners
- attaching a view that was already marked dirty

That is the core idea: Angular updates because your app tells it something changed, not because a patched async task happened somewhere in the background.

---

## Why Angular moved away from ZoneJS

The official Angular zoneless guide highlights four big reasons:

- better performance
- improved Core Web Vitals
- simpler debugging
- better compatibility with browser APIs and the wider ecosystem

This is easy to understand in real projects.

With ZoneJS, a lot of change detection starts from "something async happened."
With zoneless Angular, rendering becomes more intentional.

That means:

- fewer unnecessary checks
- less framework overhead
- easier-to-follow stack traces
- less magic when debugging state problems

If your app has dashboards, data tables, complex forms, or lots of component interactions, those improvements can be meaningful.

---

## Why signals matter so much here

Signals are one of the main reasons zoneless Angular feels natural instead of difficult.

Signals give Angular a precise way to know what changed and where that value is used.

```ts
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    template: `
        <p>Count: {{ count() }}</p>
        <button (click)="increment()">Increment</button>
    `,
})
export class CounterComponent {
    count = signal(0);

    increment() {
        this.count.update((value) => value + 1);
    }
}
```

In a zoneless app, this is a great fit:

- the click handler is an Angular event boundary
- the signal update is explicit
- Angular knows exactly which binding depends on `count()`

This is why the combination of **signals + zoneless** feels like Angular's modern default mental model.

---

## Is zoneless stable in Angular now?

Yes.

Angular's roadmap says zoneless became stable in **Angular v20.2**. The current Angular zoneless guide also says that in **Angular v21 and later, zoneless is the default**, so new apps do not need extra setup to enable it.

That creates a simple rule:

- if you are on Angular v21+, verify you are not opting back into zone-based change detection
- if you are on Angular v20, you can enable zoneless manually

---

## How to enable zoneless in Angular

### Angular v21+

For Angular v21 and later, the docs say you do not need to enable zoneless manually.

Instead, verify that you are **not** using `provideZoneChangeDetection(...)` anywhere in your bootstrap or app configuration.

If you are using standalone bootstrap, your setup should stay simple:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes)],
};
```

### Angular v20

If your app is still on Angular v20, you can enable zoneless like this:

```ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [provideZonelessChangeDetection()],
};
```

That is the official migration path before v21 default behavior.

---

## Removing ZoneJS from the build

The Angular docs recommend removing ZoneJS entirely from the build in zoneless apps.

That usually means:

1. remove `zone.js` and `zone.js/testing` from the `polyfills` entries in `angular.json`
2. remove `import 'zone.js';` and `import 'zone.js/testing';` if you use a `polyfills.ts` file
3. uninstall the package

```bash
npm uninstall zone.js
```

This is important because the goal is not only to *act* zoneless. The goal is to remove the extra dependency and overhead as well.

---

## What can break when migrating?

This is where teams need to be careful.

Angular's zoneless guide specifically calls out a few patterns that must be removed or rethought.

### 1. Code that depends on `NgZone.onStable` or similar APIs

These do not behave the same way in zoneless mode.

The Angular docs say to remove uses of:

- `NgZone.onMicrotaskEmpty`
- `NgZone.onUnstable`
- `NgZone.onStable`
- `NgZone.isStable`

If your app waits for those signals before running UI logic, you will need a different trigger.

### 2. Components that rely on implicit refresh behavior

Zoneless works best when updates happen through Angular-aware mechanisms such as:

- signals
- `AsyncPipe`
- `markForCheck`
- template event handlers

If a component mutates data in a way Angular cannot observe, the UI may stop updating when you expect it to.

### 3. Library compatibility edge cases

Most modern Angular code works well, but older third-party code may assume ZoneJS is present.

That is especially worth checking if you use:

- overlays
- custom portals
- legacy form wrappers
- older component libraries

---

## A practical migration checklist

If you are migrating an existing Angular app, this is a safe sequence:

1. Move more local UI state to signals.
2. Prefer `AsyncPipe` or explicit signal updates over manual subscription side effects.
3. Audit code that touches `NgZone`.
4. Check components that mutate objects without changing signal or observable boundaries.
5. Enable zoneless in development and test key flows.
6. Remove ZoneJS from the build only after the app is behaving correctly.

This approach keeps the migration controlled instead of turning it into a big-bang rewrite.

---

## Example: a more zoneless-friendly data flow

Here is a simple pattern that fits the modern Angular style well:

```ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
    id: number;
    name: string;
}

@Component({
    selector: 'app-users',
    template: `
        @if (loading()) {
            <p>Loading users...</p>
        } @else {
            <ul>
                @for (user of users(); track user.id) {
                    <li>{{ user.name }}</li>
                }
            </ul>
        }
    `,
})
export class UsersComponent {
    private readonly http = inject(HttpClient);

    users = signal<User[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.http.get<User[]>('/api/users').subscribe((data) => {
            this.users.set(data);
            this.loading.set(false);
        });
    }
}
```

This works well because the UI updates are explicit:

- the HTTP request returns data
- signals are updated
- the template reads those signals

No ZoneJS assumptions are required.

---

## Should every Angular app go zoneless immediately?

Not necessarily.

Zoneless is the direction Angular is clearly pushing toward, but that does not mean every mature production app should switch in one afternoon.

You should move faster if your app:

- already uses signals heavily
- uses standalone APIs
- avoids deep `NgZone` dependencies
- is actively improving performance

You should be more careful if your app:

- depends on older third-party libraries
- has a lot of legacy RxJS subscription code
- uses `NgZone` lifecycle hooks directly
- has not been audited for change-detection assumptions

For greenfield Angular v21 apps, zoneless should usually be the default choice.

For legacy apps, it should be a deliberate migration.

---

## Final thoughts

Zoneless Angular is not just a performance trick. It is a design shift.

Angular is moving from broad, framework-driven change detection toward explicit, app-driven reactivity. Signals are a big part of what makes that possible.

If you are building with Angular v21, this is one of the most important topics to understand in 2026.

The short version is:

- zoneless is stable
- zoneless is default in Angular v21+
- signals make it much easier to adopt
- migrations are usually straightforward if your app already follows modern Angular patterns

If you want to go deeper, start with the official Angular docs on zoneless mode, signals, and forms with signals:

- [Angular zoneless guide](https://angular.dev/guide/zoneless)
- [Angular signals guide](https://angular.dev/guide/signals)
- [Angular roadmap](https://angular.dev/roadmap)

That combination gives you the clearest picture of where Angular is heading next.
