---
title: "Fix NG0908: In This Configuration Angular Requires Zone.js"
description: "What the Angular error 'NG0908: In this configuration Angular requires Zone.js' means, why it happens, and the two ways to fix it — restore Zone.js or configure zoneless correctly."
category:
    - "Angular Errors"
    - "Angular 21"
tags:
    - "angular error"
    - "ng0908"
    - "zonejs"
    - "angular zoneless"
    - "angular 21"
    - "change detection"
    - "polyfills"
keywords:
    - "In this configuration Angular requires Zone.js"
    - "NG0908"
    - "Angular requires Zone.js error"
    - "Angular zoneless error"
    - "Angular zone.js polyfills"
date: "2026-05-23T10:00:00.000Z"
slug: "fix-ng0908-in-this-configuration-angular-requires-zonejs"
---

# Fix NG0908: In This Configuration Angular Requires Zone.js

> **TL;DR:** The error `NG0908: In this configuration Angular requires Zone.js` means your app is set up for zone-based change detection, but `zone.js` is not loaded. You have two fixes, and you must pick one deliberately. To **keep zones**, add `zone.js` back to the `polyfills` array in `angular.json` (or `import 'zone.js'` in your polyfills file). To **go zoneless**, remove zone-based change detection and provide `provideZonelessChangeDetection()` (Angular v20.2+); in Angular v21 zoneless is the default, so just make sure nothing is forcing zones back on.

If you hit this error, your app usually shows a blank screen and the console prints:

```
ERROR Error: NG0908: In this configuration Angular requires Zone.js
```

It is one of those errors that looks scary but has a precise, fixable cause. This post explains exactly what triggers it and how to resolve it in both directions.

---

## What does NG0908 mean?

Angular has two change detection modes:

- **Zone-based** — the traditional mode that relies on `zone.js` to know when something might have changed.
- **Zoneless** — the modern mode where Angular updates from explicit signals instead of `zone.js`.

`NG0908` is Angular telling you there is a mismatch: your configuration expects Zone.js to be present, but it could not find it at runtime. In other words, you are *half* zoneless — zones were removed from the build, but the app was never told to run without them (or something re-enabled zone change detection).

---

## Why this error happens

The most common triggers, roughly in order of frequency:

1. **You removed `zone.js` from `polyfills` but kept zone-based change detection.** This is the classic case. Someone cleans up `angular.json`, deletes the `zone.js` polyfill, and the app still bootstraps in zone mode.
2. **You enabled zoneless incorrectly.** A partial or mistyped zoneless setup can leave the app expecting zones while the polyfill is gone.
3. **A library or tool resets the config.** Storybook, certain test runners, and some build setups can bootstrap Angular in a way that expects Zone.js even when your app is configured without it. This is a known source of NG0908 in Angular library projects.
4. **`@angular/localize/init` or another polyfill is present, but `zone.js` is not.** The polyfills array looks populated, so the missing entry is easy to miss.

---

## Fix option 1: keep Zone.js (the quick fix)

If you are not trying to go zoneless yet, the fastest fix is to make sure `zone.js` is actually loaded.

In modern Angular projects, polyfills are listed in `angular.json`:

```json
"polyfills": ["zone.js"],
```

If `zone.js` is missing from that array, add it back. Make sure you do this for **both** the `build` and `test` targets — a missing test polyfill is a frequent cause of the error appearing only when running unit tests.

If your project uses a `src/polyfills.ts` file instead, ensure it imports Zone.js:

```ts
import 'zone.js'; // Included with Angular CLI.
```

And confirm the package is installed:

```bash
npm install zone.js
```

Restart the dev server after changing `angular.json` — polyfill changes are not picked up by hot reload.

---

## Fix option 2: go zoneless (the modern fix)

If removing `zone.js` was intentional, then finish the job: tell Angular to run without zones.

### Angular v20.2+

Provide zoneless change detection explicitly and make sure you are **not** also providing zone-based change detection:

```ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
    ],
};
```

Remove any `provideZoneChangeDetection(...)` call from your bootstrap — having it there while `zone.js` is absent is exactly what triggers NG0908.

### Angular v21+

In Angular v21 and later, zoneless is the **default**, so you do not need `provideZonelessChangeDetection()` at all. The fix here is simply to remove anything that opts back into zones:

```ts
// Remove this if zone.js is no longer in your polyfills:
provideZoneChangeDetection({ eventCoalescing: true }),
```

Once zone-based change detection is gone and zone.js is removed, the configuration is consistent and the error disappears.

> Going zoneless is a real architectural change, not just a config tweak. If you take this path, read our [Angular v21 Zoneless Guide](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals) first — it covers what can break and how to migrate safely.

---

## Special case: libraries, Storybook, and tests

If the error only shows up in Storybook, a test runner, or a published library, the root cause is usually that the tool bootstraps Angular separately from your app config. In these setups:

- Make sure the **test** target in `angular.json` still includes `zone.js` in its polyfills, even if your app is going zoneless.
- For Storybook, ensure its Angular preset has `zone.js` available in its own polyfills, or configure its bootstrap for zoneless explicitly.
- Remember that libraries do not control the host app's change detection — the consuming app decides zones vs zoneless, so a library should not assume one or the other.

This category of NG0908 is a known regression area in newer Angular and CLI versions, so check your tool's issue tracker if the standard fixes do not resolve it.

---

## Which fix should you choose?

A simple rule:

- **Just want the app running again?** Add `zone.js` back to your polyfills (Fix 1). Lowest risk, takes a minute.
- **Deliberately modernizing?** Go fully zoneless (Fix 2), but treat it as a migration and test your change-detection-sensitive flows.

Do not leave the app in the in-between state. NG0908 exists precisely to stop that half-configured setup from shipping.

---

## Frequently asked questions

### What does "NG0908: In this configuration Angular requires Zone.js" mean?

It means your Angular app is configured for zone-based change detection, but `zone.js` is not loaded at runtime. The configuration and the polyfills disagree, so Angular refuses to start.

### How do I fix the Angular requires Zone.js error quickly?

Add `zone.js` back to the `polyfills` array in `angular.json` for both the build and test targets (or `import 'zone.js'` in your polyfills file), then restart the dev server.

### How do I fix NG0908 if I want a zoneless app?

Remove any `provideZoneChangeDetection()` call and add `provideZonelessChangeDetection()` (Angular v20.2+). In Angular v21 zoneless is the default, so just ensure nothing is opting back into zones and that `zone.js` is removed from polyfills.

### Why does NG0908 only appear in my tests or Storybook?

Those tools bootstrap Angular separately from your app config and often expect Zone.js. Ensure the test target's polyfills include `zone.js`, or configure the tool's bootstrap for zoneless explicitly.

## Final thoughts

NG0908 is not a bug in your code — it is Angular catching an inconsistent configuration before it causes silent rendering problems. Decide whether you want zones or zoneless, make the whole configuration agree with that choice, and the error goes away.

To go deeper:

- [Angular v21 Zoneless Guide: Remove ZoneJS, Use Signals](/blog/angular-v21-zoneless-guide-remove-zonejs-use-signals)
- [Angular zoneless guide (official)](https://angular.dev/guide/zoneless)
- [Angular error reference](https://angular.dev/errors)
