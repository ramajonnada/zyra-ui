---
title: "Storybook 9 with Angular Standalone Components: Setup, Stories, and Tests"
description: "Learn how to set up Storybook 9 with Angular standalone components, write signal-aware stories, and run component tests inside a real browser."
category:
    - "Angular 21"
tags:
    - "Storybook"
    - "Angular"
    - "standalone components"
    - "component testing"
    - "signals"
keywords:
    - "Storybook 9 Angular"
    - "Storybook Angular standalone components"
    - "Angular component testing Storybook"
    - "Storybook signals Angular"
    - "Storybook 9 setup Angular 2026"
date: "2026-08-03T10:00:00.000Z"
slug: "storybook-9-angular-standalone-components-2026"
---

# Storybook 9 with Angular Standalone Components: Setup, Stories, and Tests

> **TL;DR:** Storybook 9 ships a rewritten `@storybook/angular` renderer that supports standalone components out of the box, removes the need for `moduleMetadata` in stories where the component's own `imports` array can supply every dependency, and pairs with the Storybook Vitest addon to run component tests in a real browser. This post walks through the full setup, writing stories for signal-based components, and running component tests — all in under 20 minutes.

If you build Angular components — whether for an internal library or an open-source UI kit — Storybook is the standard tool for isolating, documenting, and testing them. But the Angular integration lagged behind for years: NgModule boilerplate in every story file, a slow JSDOM-based test runner, and incomplete support for modern APIs like `input()` and `output()`.

Storybook 9, released in 2025, fixed all of that. The rewritten `@storybook/angular` renderer is standalone-first and ships with a browser-native test runner built on Playwright. Here is how to use it.

---

## The problem: old Storybook Angular stories are a mess

Before Storybook 9, a basic story for a button component looked like this:

```typescript
// Old — Storybook 7/8 style (do not write new stories like this)
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'UI/Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [ButtonComponent],
    }),
  ],
};
```

Every story needed `moduleMetadata` to simulate an NgModule. If your component had dependencies, you had to list them all manually. Standalone components partially helped, but `@storybook/angular` still had rough edges and the test story runner ran in JSDOM, which does not support CSS custom properties, `ResizeObserver`, or real layout.

Storybook 9 removes all of this friction.

---

## Setting up Storybook 9 in an Angular project

Install Storybook 9 into an existing Angular project (check the [Storybook Angular framework docs](https://storybook.js.org/docs/angular/get-started/introduction) for the exact minimum Angular version at the time you're reading this — framework version requirements shift with every major Storybook release):

```bash
npx storybook@latest init
```

The init script detects Angular, installs `@storybook/angular`, and creates `.storybook/main.ts` configured for Vite. If you already have an older Storybook, upgrade instead:

```bash
npx storybook@latest upgrade
```

Your `.storybook/main.ts` will look like this:

```typescript
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.ts'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
```

No `moduleMetadata`. No NgModule. The Angular renderer now bootstraps each story as a standalone component automatically. Also note the empty `addons` array — Storybook 9 folded most of what used to be `@storybook/addon-essentials` and `@storybook/addon-interactions` into core, so a fresh Storybook 9 project generally doesn't need to install or list them separately anymore. Verify against the current docs before assuming any specific addon is still a separate install, since this consolidation is an area that's kept changing across recent major versions.

---

## Writing stories for standalone, signal-based components

Here is a realistic component using the modern Angular API — `input()`, `output()`, `OnPush`, standalone:

```typescript
// badge.component.ts
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="'badge--' + variant()">
      {{ label() }}
      @if (dismissible()) {
        <button (click)="dismissed.emit()" aria-label="Dismiss">x</button>
      }
    </span>
  `,
})
export class BadgeComponent {
  label = input.required<string>();
  variant = input<'success' | 'warning' | 'danger' | 'info'>('info');
  dismissible = input<boolean>(false);
  dismissed = output<void>();
}
```

The story file for this component:

```typescript
// badge.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test'; // confirm current import path for your version
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'UI/Badge',
  component: BadgeComponent,
  args: {
    label: 'New',
    variant: 'info',
    dismissible: false,
    dismissed: fn(), // callable spy — required so play functions can assert on it
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {};

export const Success: Story = {
  args: { label: 'Active', variant: 'success' },
};

export const Dismissible: Story = {
  args: { label: 'Remove me', dismissible: true },
};
```

Storybook 9 maps `args` to `input()` signals automatically — no adapter, no `moduleMetadata`. See [Angular input() and output()](/blog/angular-input-output-signal-api-replace-decorators) for full coverage of the signal input API that Storybook 9 integrates with. The Controls panel lets you live-edit every `input()` and the Actions panel logs every `output()` emission. `@if` and `@for` in templates render correctly because the renderer uses a real browser (Vite-served).

---

## New concept: Storybook interaction tests

Storybook introduced interaction tests — assertions written directly inside story files that run in the browser via Playwright — replacing the older `@storybook/testing-library` approach, and they work natively without any extra runner configuration. As of Storybook 9's package consolidation, check the current docs for whether the test utilities import from `@storybook/test` or the unscoped `storybook/test` entry point in your installed version — this moved during the 8-to-9 transition and is worth confirming rather than assuming.

```typescript
import { expect, userEvent, within } from '@storybook/test'; // confirm current import path for your version

export const DismissFlow: Story = {
  args: { label: 'Close me', dismissible: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const btn = canvas.getByRole('button', { name: 'Dismiss' });
    await userEvent.click(btn);

    expect(args.dismissed).toHaveBeenCalledTimes(1);
  },
};
```

The `play` function runs after the story renders in the real browser. You get actual CSS rendering, real DOM layout, and genuine browser event dispatch — none of which JSDOM can replicate.

Run all interaction tests from the CLI once the [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) is set up (`npx storybook@latest init` offers to add it, or install `@storybook/addon-vitest` directly):

```bash
npx vitest --project=storybook
```

This runs every story that has a `play` function as a Vitest test, using Playwright's browser provider under the hood, and reports pass/fail with a normal Vitest exit code. Your CI pipeline can run this command in place of — or alongside — unit tests. (The Storybook 9 init/upgrade flow can also add this as a `test-storybook` script in `package.json` — don't confuse that script name with the older, now-deprecated `@storybook/test-runner` package's CLI binary of the same name.)

---

## The tool: `@storybook/addon-a11y` for automated accessibility checks

Every story automatically gets accessibility checked when you add the a11y addon:

```bash
npm install --save-dev @storybook/addon-a11y
```

Register it in `.storybook/main.ts`:

```typescript
addons: [
  '@storybook/addon-a11y',
],
```

The Accessibility panel now shows axe-core violations for the rendered story in real time. As you switch between stories, the panel updates immediately — no test run required. Each violation includes the rule name, impact level (critical, serious, moderate, minor), and the affected DOM node.

To enforce accessibility in CI, don't reach for the older `@storybook/test-runner` package (a separate Jest+Playwright tool) — it's deprecated as of Storybook 9 in favor of running a11y checks through the same Vitest-powered pipeline already covered above. The `npx vitest --project=storybook` command shown earlier already visits every story in a real browser; with `@storybook/addon-a11y` installed, it reports violations in that same run. That alone does not fail your build, though — by default violations are reported, not enforced. You have to opt in by setting `parameters.a11y.test` to `'error'`:

```typescript
// .storybook/preview.ts
const preview = {
  parameters: {
    a11y: {
      test: 'error', // fail the story's test on any a11y violation; 'todo' (the default) only reports
    },
  },
};

export default preview;
```

Check the [addon-a11y documentation](https://storybook.js.org/docs/writing-tests/accessibility-testing) for the current configuration options, since this shape has continued to evolve. With `parameters.a11y.test` set to `'error'`, a WCAG contrast failure — white text on amber is a common issue in component libraries — fails the test the same way any other assertion would.

---

## Sharing play functions between Storybook and Vitest

You do not have to choose between Storybook stories and your Vitest unit tests. Storybook's portable-stories API — `composeStories` from `@storybook/angular` — lets Vitest import a story file and reuse its `args`, `decorators`, and `play` function directly, so the interaction logic is written once and executed by both Storybook and Vitest.

The Angular implementation of portable stories is newer than React's and Vue's and the exact rendering call is renderer-specific, so don't assume you can call the composed story as a plain function and hand the result to a generic testing-library `render()` the way React/Vue examples do — Angular components mount through the Angular test bed, not JSX. Before wiring this up, check the current [portable stories guide](https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest) for the Angular-specific render signature, and add a `setProjectAnnotations(...)` call in your Vitest setup file so decorators and parameters from `.storybook/preview.ts` apply to composed stories the same way they do inside Storybook itself.

---

## Wrapping up

Storybook 9 makes Angular a first-class citizen: standalone components work without boilerplate, `input()` signals map to args automatically, and the browser-native test runner closes the gap between visual stories and CI tests. If you maintain an Angular component library and have not upgraded yet, `npx storybook@latest upgrade` is worth the 15 minutes.

Start with a single component, add a `play` function to one story, and install `@storybook/addon-a11y`. The [official Storybook for Angular documentation](https://storybook.js.org/docs/angular/get-started/introduction) covers all addon configurations. That combination catches visual, behavioral, and accessibility regressions in one pass.

---

## Frequently asked questions

### Does Storybook 9 support Angular's `input()` and `output()` signals?

Yes. The rewritten `@storybook/angular` renderer maps Storybook `args` to signal inputs automatically. You do not need any adapter or wrapper. `output()` emitters are surfaced as action args in the Actions panel, so every emission is logged without additional configuration.

### Do I still need `moduleMetadata` in my stories?

Usually not, but it still has a job. Storybook 9's Angular renderer bootstraps each story as a standalone component, and if your component only depends on other standalone components or directives, Angular resolves them through the component's own `imports` array — exactly as in production, no `moduleMetadata` required. You still need `moduleMetadata` when a story has to supply something the component's `imports` array can't, such as a non-standalone NgModule-based dependency, a route/HTTP testing provider, or a mock injection token. Drop it only where the component is fully self-contained; keep it for those edge cases.

### Can I run Storybook interaction tests in CI?

Yes. Run `npx vitest --project=storybook` in your CI pipeline once the Vitest addon is set up. The command launches Playwright's browser provider, executes every `play` function, and exits with a non-zero code on any failure. The tests run in a real browser, so they catch CSS rendering issues and layout-dependent behavior that JSDOM misses.

### What is the difference between Storybook interaction tests and Playwright CT?

Both run in a real browser and use Playwright under the hood. The distinction is what the primary artifact is. [Playwright CT](/blog/playwright-component-testing-angular-2026) (`@playwright/experimental-ct-angular`) makes the test file the primary artifact. Storybook makes the story file the primary artifact — the same file drives the visual sandbox, controls panel, autodocs, and tests. Use Storybook when the visual catalog and the test suite should share one source of truth; use Playwright CT when you want a lean test suite without the Storybook dev server overhead.

---

**Related reading:**
- [Faster Angular Tests with Vitest: Drop Jest and Never Look Back](/blog/vitest-angular-faster-unit-tests-2026)
- [Playwright CT for Angular: Component Testing in a Real Browser](/blog/playwright-component-testing-angular-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Fix NG0908: In This Configuration Angular Requires Zone.js](/blog/fix-ng0908-in-this-configuration-angular-requires-zonejs)
- [Official Storybook for Angular documentation](https://storybook.js.org/docs/angular/get-started/introduction)
