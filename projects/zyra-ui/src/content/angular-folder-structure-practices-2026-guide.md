---
title: 'Angular Folder Structure Best Practices (2026 Guide)'
description: 'Learn the best Angular folder structure for scalable, maintainable applications in 2026 with real-world examples.'
category: ['Angular']
tags:
    - 'angular'
    - 'angular best practices'
    - 'angular folder structure'
    - 'frontend architecture'
    - 'scalable angular apps'
keywords:
    - 'angular folder structure'
    - 'angular project structure 2026'
    - 'angular app architecture'
    - 'angular feature module structure'
    - 'angular standalone components folder structure'
    - 'angular core shared features pattern'
    - 'scalable angular app'
    - 'angular lazy loading folder structure'
    - 'angular monorepo structure'
    - 'angular best practices 2026'
date: '2026-01-03'
slug: 'angular-folder-structure-practices-2026-guide'
---

# Angular Folder Structure Best Practices (2026 Guide)

> **TL;DR:** A scalable Angular folder structure in 2026 is feature-based: a `core/` folder for app-wide singletons (services, interceptors, guards), a `shared/` folder for reusable UI, pipes, and directives, and a `features/` folder where each feature is self-contained with its own pages, components, routes, and services. Combined with standalone components and consistent naming, this keeps large apps easy to navigate, refactor, and onboard into.

Every Angular project starts the same way — a clean `app/` folder, a handful of components, everything easy to find. Six months later, you have sixty components, a dozen services, and new developers asking where anything lives. How you structure the project at the start determines how painful that six-month mark becomes.

The good news: the feature-based pattern has converged as the standard across the Angular ecosystem, and Angular's move to [standalone components](/blog/angular-input-output-signal-api-replace-decorators) makes it cleaner to implement than ever. No `NgModule` wiring. No shared module import chains. Just folders that match how your team thinks about the product. The [Angular style guide](https://angular.dev/style-guide) is the official reference — this post adds the practical decisions the style guide leaves to you.

---

## The three-folder model

Most production Angular apps land on some version of this:

```
src/
  app/
    core/           ← singletons: services, interceptors, guards
    shared/         ← reusable UI, pipes, directives
    features/
      auth/
      dashboard/
      settings/
```

Each folder has a distinct job:

**`core/`** is for things that exist once in the app. `AuthService`, `ThemeService`, HTTP interceptors, global error handlers, and route guards live here. The rule: if you'd be confused finding it in two different features, it belongs in `core/`.

**`shared/`** is for things that multiple features import. Reusable UI components, pipes, directives. If you're using a component library like ZyraUI, this folder is where you configure and re-export the components your app customizes — a `ZyraButtonComponent` wrapper that enforces your app's default variant, for instance.

**`features/`** is where the product actually lives. Each feature is a self-contained vertical slice — its own pages, components, routes, and feature-specific services. `auth/` knows nothing about `dashboard/`. `dashboard/` doesn't reach into `settings/`.

---

## What a feature folder looks like

```
features/
  auth/
    pages/
      login/
        login.component.ts
        login.component.html
        login.component.scss
      register/
        register.component.ts
    components/
      password-strength/        ← used only inside auth
        password-strength.component.ts
    services/
      auth.service.ts
    guards/
      auth.guard.ts
    auth.routes.ts
```

The `auth.routes.ts` file defines the routes for this feature and is lazy-loaded from the app routes. The feature folder is the unit of deployment — everything needed to ship the auth feature is in one place.

```ts
// app.routes.ts
export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
];
```

This is what makes the pattern work with Angular's tree-shaking. When a user hasn't navigated to `/auth`, none of that bundle is loaded. For more on lazy loading strategies and `@defer` blocks, see the post on [Angular defer blocks and lazy loading](/blog/angular-defer-blocks-lazy-loading-2026).

---

## Standalone components change the equation

In Angular v20+, standalone is the default — you no longer write `standalone: true`, it's implied. This matters for folder structure because the old `SharedModule` pattern (create a module, declare everything in it, export everything from it, import it in every feature module) is gone.

Instead, each component declares its own `imports`. A login page imports exactly what it needs:

```ts
@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, ZyraButton, ZyraInput],
    templateUrl: './login.component.html',
})
export class LoginComponent {}
```

This makes the feature folder genuinely self-contained. You can move `auth/` to a different project and it either compiles or it doesn't — there's no hidden `SharedModule` it depends on that lives elsewhere.

---

## The `shared/` folder without SharedModule

Without `NgModule`, `shared/` becomes simpler. It's just a collection of standalone components, directives, and pipes that any feature can import directly:

```
shared/
  components/
    page-header/
      page-header.component.ts
    empty-state/
      empty-state.component.ts
  pipes/
    relative-date.pipe.ts
  directives/
    auto-focus.directive.ts
```

If you're using ZyraUI, most of your `shared/components/` won't be wrapper components — they'll be the ZyraUI imports directly. But when you do need app-specific wrappers (a `PageHeaderComponent` that always includes your app's breadcrumb pattern, for instance), this is where they live.

---

## Naming conventions that scale

Consistent names are more important than perfect names. Pick a convention and enforce it across the whole team.

| File type | Convention | Example |
|---|---|---|
| Page component | `<name>.component.ts` | `login.component.ts` |
| Sub-component | `<name>.component.ts` | `password-strength.component.ts` |
| Service | `<name>.service.ts` | `auth.service.ts` |
| Guard | `<name>.guard.ts` | `auth.guard.ts` |
| Pipe | `<name>.pipe.ts` | `relative-date.pipe.ts` |
| Routes file | `<feature>.routes.ts` | `auth.routes.ts` |
| Model/interface | `<name>.model.ts` | `user.model.ts` |

The selector prefix should match your project. For a library it's `zyra-`. For an app it's usually `app-`, enforced by ESLint's `@angular-eslint/component-selector` rule.

---

## What not to do

**Don't put everything in `app/` directly.** A flat structure with 40 components at the top level is navigable in week one and painful in month six. Files become hard to find, feature boundaries disappear, and refactoring one thing risks breaking another.

**Don't make `shared/` a dumping ground.** If something is used by exactly one feature, it belongs inside that feature. Shared should mean genuinely shared — used in two or more features, or expected to be. Moving something from a feature to shared is easy once it's actually needed in two places; premature promotion creates invisible coupling.

**Don't put components in `core/`.** Core is for singletons — services and functional utilities that have one instance for the whole app. A component can't be a singleton in the Angular sense. If you find yourself putting a component in `core/`, it belongs in `shared/`.

**Don't couple feature services to other features.** If `dashboard/` needs data that `auth/` owns, that data should come through a `core/` service that both features inject — not through `auth/auth.service.ts` imported directly into `dashboard/`. Cross-feature imports turn your feature folders into a dependency graph, which is exactly what the pattern is designed to avoid.

---

## The ZyraUI monorepo layout

For reference, ZyraUI uses an Nx-style monorepo with two projects:

```
projects/
  zyra-ng-ui/       ← the component library (what gets published to npm)
    src/
      lib/
        components/
          zyra-button/
          zyra-input/
          ...
  zyra-ui/          ← the documentation site (zyraui.dev)
    src/
      app/
        core/
        shared/
        pages/
          home/
          docs/
          theming/
```

The docs site uses the same feature-based pattern internally. The component library uses a flat components/ structure because each component is its own publishable unit — there are no "features" in a component library, only components.

---

## Frequently asked questions

### What is the best Angular folder structure in 2026?

A feature-based structure: `core/` for app-wide singletons used once, `shared/` for reusable UI and utilities, and `features/` where each feature is self-contained with its own pages, components, routes, and services. This is the pattern used by most large Angular teams and is the closest thing to an official recommendation from the Angular team.

### What goes in the core folder in Angular?

Things used once across the entire app: global services like `AuthService` and `ThemeService`, HTTP interceptors, and route guards. Avoid putting components in `core/` — components can't be singletons in the Angular sense.

### What is the difference between core and shared folders?

`core/` holds app-wide singletons instantiated once. `shared/` holds reusable building blocks — UI components, pipes, directives — imported by many features. If something is used in two or more places but isn't a singleton service, it's `shared/`.

### Do I still need NgModules for folder structure in modern Angular?

No. With standalone components as the default in Angular v20+, feature folders are genuinely self-contained without any module wiring. Each component declares its own imports, and features are lazy-loaded via `loadChildren` pointing directly at a routes file.

**Related reading:**
- [Angular @defer blocks and lazy loading](/blog/angular-defer-blocks-lazy-loading-2026)
- [Angular input() and output() — signals-first component APIs](/blog/angular-input-output-signal-api-replace-decorators)
- [Angular signals explained](/blog/angular-21-signals-explained-signals-signal-forms)
- [Official Angular style guide](https://angular.dev/style-guide)
- [Angular standalone components documentation](https://angular.dev/guide/components/importing)
