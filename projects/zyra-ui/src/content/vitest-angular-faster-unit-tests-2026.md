---
title: "Faster Angular Tests with Vitest: Drop Jest and Never Look Back"
description: "Learn how to replace Jest with Vitest in your Angular project for dramatically faster test runs, native ESM support, and a much simpler config."
category:
    - "Angular 21"
tags:
    - "angular"
    - "vitest"
    - "testing"
    - "jest"
    - "unit tests"
keywords:
    - "vitest angular setup 2026"
    - "replace jest with vitest angular"
    - "angular vitest builder"
    - "faster angular unit tests"
    - "angular testing native esm"
date: "2026-07-31T10:00:00.000Z"
slug: "vitest-angular-faster-unit-tests-2026"
---

# Faster Angular Tests with Vitest: Drop Jest and Never Look Back

> **TL;DR:** Vitest replaces Jest in Angular projects with zero-config native ESM support, a 2-4x speed improvement on large suites, and a built-in UI. Angular's `@angular/build` package ships an official Vitest builder — wire it up in `angular.json`, drop your Jest config, and your existing `describe`/`it`/`expect` tests run unchanged.

If your Angular test suite takes more than 30 seconds to start, you have probably already looked at switching away from Jest. The combination of `jest-preset-angular`, Babel transforms, and module name mappers was never fun to configure, and the situation gets worse as your app grows. Vitest solves every one of those pain points at once.

---

## The Problem with Jest in Modern Angular

Angular has used Karma since its AngularJS days. Karma became the default test runner and, later, many teams replaced it with Jest for its faster watch mode and richer assertion API. That worked well for a while.

The problem is that Angular's compiler emits modern TypeScript and heavily uses ECMAScript decorators, `import.meta`, and dynamic imports. Jest runs in CommonJS by default and transforms everything through Babel or `ts-jest`. Each test file goes through a transform pipeline before Node.js ever sees it, which adds hundreds of milliseconds of overhead per file. On a suite with 300 test files, that overhead alone can add a minute to a cold run.

`jest-preset-angular` exists precisely to paper over this mismatch, but it requires a long configuration file, several Babel plugins, and careful tuning of `moduleNameMapper` entries any time a new Angular API appears that emits ESM-only code.

Vitest is built on top of Vite, which speaks native ESM natively. Angular's `@angular/build` package — the same bundler that powers `ng build` and `ng serve` — already uses Vite internally. Wiring Vitest into that pipeline means your tests run in the same transform context as your production build with no extra plugins needed.

---

## What Vitest Brings to the Table

Vitest is not just Jest with a different name. A few features matter specifically for Angular developers.

**Native ESM by default.** Vitest runs test files as ES modules without a CommonJS transform step. Angular's compiler output lands directly in Vite's dev pipeline, which already handles TypeScript, decorators, and `import.meta`. You remove one entire layer of tooling.

**Parallel test execution with worker threads.** By default Vitest runs each test file in its own V8 isolate inside a worker thread. Isolation is maintained without the overhead of spinning up a new Node process per file.

**`vitest --ui`.** Vitest ships a browser-based test explorer at no extra cost. You get a live list of every test, their status, and their output — similar to what you get in a paid IDE plugin, for free.

**A compatible API surface.** Vitest's `describe`, `it`, `test`, `expect`, `beforeEach`, `afterEach`, and `vi` (the spy/mock API) are a drop-in replacement for Jest's globals. In most projects you can switch the runner without touching a single test file.

---

## Setting Up Vitest in an Angular Project

Angular's `@angular/build` package ships an official Vitest builder. Here is the full setup from scratch.

### Step 1 — Install the dependencies

```bash
npm install --save-dev vitest @vitest/ui jsdom
```

`jsdom` provides the DOM environment Angular's `TestBed` needs to render components — Vitest itself only runs in Node and has no DOM by default. (`happy-dom` is a lighter, faster alternative if you prefer it; either works with the `@angular/build:vitest` builder.)

You do not need `jest-preset-angular`, `babel-jest`, `ts-jest`, or any Jest-related package. If they are in your `devDependencies`, remove them after the migration.

### Step 2 — Update `angular.json`

In your project's `angular.json`, find the `test` target and replace the builder:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular/build:vitest",
          "options": {
            "tsConfig": "tsconfig.spec.json",
            "include": ["src/**/*.spec.ts"]
          }
        }
      }
    }
  }
}
```

The `@angular/build:vitest` builder handles Angular component compilation, decorator transforms, and test environment setup. You do not need a separate `vitest.config.ts` for a standard Angular workspace — the builder generates the config internally from your `tsconfig.spec.json`.

### Step 3 — Verify `tsconfig.spec.json`

Your spec tsconfig should extend the base and include the spec files:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

Adding `"vitest/globals"` to `types` gives you full TypeScript types for `describe`, `it`, `expect`, and `vi` without an import statement in every file.

### Step 4 — Run the tests

```bash
ng test
```

That is it. Your existing spec files run through Vitest with no changes. The `TestBed`, `ComponentFixture`, and `HttpClientTestingModule` APIs all work as before because the Angular testing utilities are framework code, not runner code.

---

## Writing Tests — The Modern Way

If you are also updating your test style alongside the migration, here is what a well-written Angular component test looks like in 2026.

```typescript
import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  function setup(initialCount = 0) {
    TestBed.configureTestingModule({
      imports: [CounterComponent],
    });
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.componentRef.setInput('count', initialCount);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('renders the initial count', () => {
    const { fixture } = setup(5);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="count"]')?.textContent).toContain('5');
  });

  it('increments when the button is clicked', () => {
    const { fixture } = setup(0);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-testid="count"]')?.textContent
    ).toContain('1');
  });
});
```

Note the use of `fixture.componentRef.setInput()` instead of directly assigning to `component.count`. This is the correct way to set signal inputs from a test — it triggers Angular's input coercion and marks the view dirty in the same way a parent component would.

For services that use `inject()`, the pattern is equally clean:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    return {
      service: TestBed.inject(UserService),
      httpMock: TestBed.inject(HttpTestingController),
    };
  }

  it('fetches users from the API', () => {
    const { service, httpMock } = setup();
    let result: unknown;

    service.getUsers().subscribe((users) => (result = users));

    const req = httpMock.expectOne('/api/users');
    req.flush([{ id: 1, name: 'Ada' }]);

    expect(result).toEqual([{ id: 1, name: 'Ada' }]);
    httpMock.verify();
  });
});
```

`provideHttpClient()` and `provideHttpClientTesting()` are the standalone-era replacements for `HttpClientModule` and `HttpClientTestingModule`. They compose cleanly in `TestBed.configureTestingModule` and require no NgModule.

---

## Watch Mode and the UI

Vitest's watch mode is significantly smarter than Jest's. It tracks which source files changed and re-runs only the test files that import those sources — transitively. In a large project, editing a single service reruns that service's spec and the specs of any component that injects it, while leaving everything else alone.

```bash
# interactive watch mode
ng test --watch

# browser UI at http://localhost:51204/__vitest__/
ng test --ui
```

The `--ui` flag opens a real-time dashboard in your browser. Each test file has a collapsible tree of suites and cases, colour-coded pass/fail status, and the full output of any failed assertion inline. It is the closest thing Angular developers have had to a fully integrated test explorer outside of a paid IDE plugin.

---

## Migrating an Existing Jest Suite

For most projects the migration is mechanical:

1. Remove `jest`, `jest-preset-angular`, `babel-jest`, and related packages from `devDependencies`.
2. Delete `jest.config.js` (or `jest.config.ts`) and any `babel.config.js` used only for tests.
3. Remove the `jest` key from `package.json` if you put config there.
4. Apply the `angular.json` and `tsconfig.spec.json` changes from above.
5. Replace `jest.fn()` with `vi.fn()` and `jest.spyOn()` with `vi.spyOn()` where you used Jest-specific mock APIs. Everything else — `expect`, `describe`, `it`, `beforeEach` — is identical.

A global find-and-replace of `jest\.fn(` to `vi.fn(` and `jest\.spyOn(` to `vi.spyOn(` handles the vast majority of cases in under a minute.

---

## Wrapping Up

Jest did the job for years, but its CommonJS-first architecture is a real mismatch with the direction Angular has taken. Vitest runs in the same native-ESM pipeline as your production build, which removes an entire class of configuration problems and cuts cold-start time significantly. Angular's official `@angular/build:vitest` builder makes the switch as painless as a tool change gets — update two config files, run `ng test`, and you are done. Start a new project today and reach for Vitest from day one.

---

## Frequently asked questions

### Does Vitest support Angular's `TestBed` and component testing utilities?

Yes. Vitest only replaces the test runner — the process that finds, executes, and reports on spec files. Angular's testing utilities (`TestBed`, `ComponentFixture`, `provideHttpClientTesting`, `provideRouter`) are part of the Angular framework and are completely runner-agnostic — they work identically under Vitest, Jest, or Karma. The [official Vitest documentation](https://vitest.dev/guide/) covers all configuration options.

### What test tool should I use for browser-level component tests?

Vitest (with JSDOM or happy-dom) handles unit and logic tests well, but for real-browser component tests use [Playwright CT](/blog/playwright-component-testing-angular-2026). For a visual component catalog that doubles as a test suite, [Storybook 9 for Angular](/blog/storybook-9-angular-standalone-components-2026) is the right choice.

### Can I use Vitest with an Nx monorepo that has multiple Angular libraries?

Yes, but each project needs its own `test` target in `project.json` pointing at `@angular/build:vitest`. Nx also maintains its own `@nx/vite:vitest` executor if you prefer to manage config centrally. Both approaches work; the `@angular/build:vitest` path is closer to the standard Angular CLI workflow and easier to keep in sync with Angular version upgrades.

### What about code coverage?

Vitest's coverage support is a separate install — it is not bundled with `vitest` itself. Install the provider first:

```bash
npm install --save-dev @vitest/coverage-v8
```

(`@vitest/coverage-istanbul` is the alternative provider if you need Istanbul-specific reporters.) Once installed, pass `--coverage` to `ng test` and the `@angular/build:vitest` builder forwards it to Vitest's coverage provider. The output is the same Istanbul-format HTML report that most CI pipelines already know how to consume.

### Do I need to change my CI pipeline?

Your CI command stays `ng test` or `npx ng test --no-watch` for a single run. The only change is removing any Jest-specific environment variables or cache keys you may have set. Vitest respects `--reporter=junit` for JUnit XML output, which is the format most CI systems use to display test results in their dashboards.

---

**Related reading:**
- [Playwright CT for Angular: Component Testing in a Real Browser](/blog/playwright-component-testing-angular-2026)
- [Storybook 9 with Angular Standalone Components: Setup, Stories, and Tests](/blog/storybook-9-angular-standalone-components-2026)
- [Angular inject() in Functional Guards and Interceptors](/blog/angular-inject-functional-guards-interceptors-2026)
- [Angular input() and output(): Replace @Input/@Output with the Signal API](/blog/angular-input-output-signal-api-replace-decorators)
- [Official Vitest documentation](https://vitest.dev/guide/)
