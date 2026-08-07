---
title: "Playwright CT for Angular: Component Testing in a Real Browser"
description: "Learn how to use @sand4rt/experimental-ct-angular to test Angular standalone components in a real browser — no full app required."
category:
    - "Angular 21"
tags:
    - "angular"
    - "playwright"
    - "testing"
    - "component testing"
    - "standalone components"
keywords:
    - "playwright component testing angular"
    - "angular component testing real browser"
    - "playwright experimental ct angular"
    - "mount angular component playwright"
    - "angular standalone component testing 2026"
date: "2026-07-31T10:00:00.000Z"
slug: "playwright-component-testing-angular-2026"
---

# Playwright CT for Angular: Component Testing in a Real Browser

> **TL;DR:** `@sand4rt/experimental-ct-angular` lets you mount a single Angular component in a real Chromium browser, interact with it using Playwright's full locator and assertion API, and verify its rendered output — no full app, no TestBed ceremony. It catches bugs that unit tests cannot: real hover states, focus rings, CSS-driven layout, and actual DOM events.

Your TestBed tests pass. Your Vitest tests pass. Then a user opens the component on a 1280-pixel screen and the dropdown clips off the edge, or the focus ring disappears because a global CSS rule overwrote it, or a click lands on the wrong element because `pointer-events: none` is doing something unexpected. None of that shows up in a jsdom environment. It only shows up in a real browser.

Playwright Component Testing (CT) fills exactly that gap. It boots a real Chromium, Vite-serves your component in isolation, and gives you the full Playwright API — locators, screenshots, network interception, accessibility checks — against a single mounted component.

---

## The problem with jsdom-based Angular tests

Angular's `TestBed` and `@angular/cdk/testing` are excellent for testing logic: signal reactivity, service calls, output emissions. Where they run depends on your test runner, though — under Karma (the Angular CLI's traditional default) `TestBed` runs in a real browser with real layout and real pointer events. Pair it with Jest or Vitest configured for a jsdom environment instead, and you lose that: jsdom is a synthetic DOM that does not implement CSS layout, does not paint pixels, and does not fire real pointer events. In that jsdom configuration, a test that does `fixture.detectChanges()` and checks `nativeElement.textContent` tells you nothing about whether the component is actually usable in a browser.

The gap grows as components get more interactive. A drag-and-drop list, a custom date picker, a tooltip that repositions on scroll — these behaviors depend on the browser's layout engine, not on Angular's change detection. You can stub them in jsdom, but you are testing stubs, not behavior.

Playwright CT solves this by making the test environment the browser itself.

---

## Setting up @sand4rt/experimental-ct-angular

Install the package alongside Playwright:

```bash
npm install --save-dev @sand4rt/experimental-ct-angular
npx playwright install chromium
```

Playwright ships official Component Testing packages for React, Vue, and Svelte, but not for Angular. `@sand4rt/experimental-ct-angular` is a community-maintained package built on Playwright's underlying CT primitives (`@playwright/experimental-ct-core`) that brings the same `mount()`-based workflow to Angular standalone components.

Create `playwright-ct.config.ts` in the project root:

```typescript
import { defineConfig, devices } from '@sand4rt/experimental-ct-angular';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.ct.spec.ts',
  use: {
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          '@': '/src',
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

Playwright CT uses Vite under the hood, so you get fast cold starts and native ESM — no webpack config needed.

---

## Writing your first component test

Here is a standalone counter component using modern Angular APIs:

```typescript
// counter.component.ts
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="increment()">
      {{ label() }}: {{ count() }}
    </button>
  `,
})
export class CounterComponent {
  readonly label = input('Clicks');
  readonly counted = output<number>();

  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
    this.counted.emit(this.count());
  }
}
```

And the Playwright CT test that exercises it in a real browser:

```typescript
// counter.ct.spec.ts
import { test, expect } from '@sand4rt/experimental-ct-angular';
import { CounterComponent } from './counter.component';

test('renders with default label', async ({ mount }) => {
  const component = await mount(CounterComponent);
  await expect(component.getByRole('button')).toContainText('Clicks: 0');
});

test('increments count on click', async ({ mount }) => {
  const component = await mount(CounterComponent);
  const btn = component.getByRole('button');

  await btn.click();
  await btn.click();

  await expect(btn).toContainText('Clicks: 2');
});

test('accepts signal input', async ({ mount }) => {
  const component = await mount(CounterComponent, {
    inputs: { label: 'Add to cart' },
  });
  await expect(component.getByRole('button')).toContainText('Add to cart: 0');
});

test('emits output on click', async ({ mount }) => {
  let emitted: number | null = null;
  const component = await mount(CounterComponent, {
    on: {
      counted: (value: number) => { emitted = value; },
    },
  });

  await component.getByRole('button').click();
  expect(emitted).toBe(1);
});
```

Run the tests with:

```bash
npx playwright test --config=playwright-ct.config.ts
```

Notice that `inputs` maps directly to the component's `input()` signals — see [Angular input() and output()](/blog/angular-input-output-signal-api-replace-decorators) for the full signal input API, and `on` wires up `output()` emitters. The full Playwright locator API — `getByRole`, `getByText`, `getByTestId`, `locator()` — works exactly as it does in end-to-end tests.

---

## What Playwright CT catches that unit tests miss

Because the component renders in real Chromium, you can make assertions that are impossible in jsdom:

**Accessibility tree checks** — Playwright's `toHaveAccessibleName()` and `toHaveRole()` assertions read from the browser's actual accessibility tree, not inferred from HTML structure.

**Visual state assertions** — `toHaveCSS()` reads computed CSS from the layout engine. You can assert that a disabled button has `cursor: not-allowed`, or that an active tab has the right border-bottom color, or that a card's shadow token resolves to the correct value across themes.

**Real pointer events** — `hover()`, `focus()`, `dragTo()` fire genuine browser events. A tooltip that only opens on `:hover` can be tested without any workaround.

**Screenshot diffs** — `expect(component).toHaveScreenshot()` produces a pixel-accurate baseline. Regressions in icon size, spacing, or color surface immediately in CI.

---

## Playwright CT vs Vitest vs TestBed — pick the right tool

These three are not competing — they test different things:

- [**TestBed / Vitest**](/blog/vitest-angular-faster-unit-tests-2026) — fast, runs in Node, great for testing signal reactivity, service logic, computed values, and output emissions in isolation. Run these on every save.
- **Playwright CT** — runs in a real browser, slower (~200 ms per test cold), best for layout, CSS, accessibility, and user interaction. Run these in CI or on changed components.
- **Playwright E2E** — full app, multiple pages, great for flows. Slowest.

A practical setup: Vitest for all unit and logic tests, Playwright CT for interactive component tests where browser behavior matters, Playwright E2E for critical user journeys.

---

## Wrapping up

`@sand4rt/experimental-ct-angular` bridges the gap between fast unit tests and slow end-to-end tests. The [official Playwright Component Testing documentation](https://playwright.dev/docs/test-components) covers the full `mount()` API. If your team has ever shipped a component that looked correct in tests but was broken in the browser — hover state missing, focus ring gone, a click not landing — component testing in a real browser is the fix. Install the package, write one test for your most interactive component, and see what you have been missing.

---

## Frequently asked questions

### Is @sand4rt/experimental-ct-angular production-ready?
It is a community package, not an official Playwright integration, so it tracks upstream changes to Playwright's experimental CT core rather than shipping its own stability guarantee. Many teams still use it in CI. Check the package's release notes before upgrading Playwright to catch any breaking changes to the `mount()` API.

### How does mount() handle Angular providers?
The `mount()` function accepts a `providers` array identical to what you would pass to `TestBed.configureTestingModule`. You can provide mock services, `HttpClientTestingModule`, signal-based stores, or any token your component needs. The component is bootstrapped in isolation with exactly those providers.

### Can I test components that use the Angular router?
Yes. Pass `provideRouter([])` (or a route config) in the `providers` array of `mount()`. The router is available inside the component, and you can assert on outlet rendering or `routerLink` navigation state. Full multi-page navigation requires an E2E test, but single-component router-aware behavior is fully testable in CT.

### How do I test a component that fetches data with httpResource()?
Provide `provideHttpClient()` and `provideHttpClientTesting()` in the `mount()` providers, then use Angular's `HttpTestingController` to flush mock responses. Alternatively, use Mock Service Worker (MSW) at the network level — MSW works inside Playwright's browser context and intercepts real fetch calls, giving you more realistic test conditions.

---

**Related reading:**
- [Faster Angular Tests with Vitest: Drop Jest and Never Look Back](/blog/vitest-angular-faster-unit-tests-2026)
- [Storybook 9 with Angular Standalone Components: Setup, Stories, and Tests](/blog/storybook-9-angular-standalone-components-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Angular inject() in Functional Guards and Interceptors](/blog/angular-inject-functional-guards-interceptors-2026)
- [Official Playwright Component Testing documentation](https://playwright.dev/docs/test-components)
