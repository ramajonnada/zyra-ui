---
title: "Analog.js Angular Meta-Framework: Build Full-Stack Apps in 2026"
description: "Learn how the Analog.js Angular meta-framework brings file-based routing, SSR, and API routes to Angular — with a Vite-powered dev experience."
category:
    - "Angular 21"
tags:
    - "analog.js"
    - "angular"
    - "ssr"
    - "full-stack"
    - "vite"
keywords:
    - "Analog.js Angular meta-framework"
    - "Angular full-stack SSR 2026"
    - "Angular file-based routing Analog"
    - "Analog.js API routes"
    - "Angular Vite SSR"
date: "2026-08-05T10:00:00.000Z"
slug: "analog-js-angular-meta-framework-2026"
---

# Analog.js Angular Meta-Framework: Build Full-Stack Apps in 2026

> **TL;DR:** Analog.js is an Angular meta-framework built on Vite and Nitro that adds file-based routing, server-side rendering, and API routes to Angular — without the configuration overhead of rolling your own SSR setup. If you have used Next.js or Nuxt and wished Angular had something similar, Analog is it.

Angular has always had the raw ingredients for full-stack apps: a powerful HTTP client, SSR via `@angular/ssr`, and a router flexible enough to handle anything you throw at it. But stitching those pieces together from scratch takes time. You configure Vite, wire up Nitro or Express as your server, decide on a folder layout, and hand-write the transfer state logic to avoid double-fetching on the client. By the time your "hello world" SSR app works end-to-end, you have already spent half a sprint on infrastructure.

The **Analog.js Angular meta-framework** solves exactly this problem. It wraps Angular's existing primitives in a batteries-included scaffold that gives you file-based routing, out-of-the-box SSR, typed API routes, and a fast Vite dev server — all configured for you.

---

## The Problem: Angular SSR Setup Friction in Full-Stack Apps

Setting up Angular SSR from scratch in a standalone-first project involves several moving parts that do not compose automatically:

```bash
# Rough manual SSR setup steps
ng new my-app --ssr
# Then: configure Vite manually, add transfer state providers,
# write a server entry point, decide on an API layer...
```

Most Angular developers working on content sites, e-commerce frontends, or internal dashboards need SSR for SEO and initial-load performance. They do not need to become Nitro experts to get there. This is the gap Analog.js fills.

When you scaffold an Analog project, your folder structure immediately reflects the full-stack intent:

```
src/
  app/
    pages/               ← file-based routes
      index.page.ts      ← maps to /
      about.page.ts      ← maps to /about
      blog/
        [slug].page.ts   ← maps to /blog/:slug
    server/
      routes/            ← API routes (Nitro handlers)
        v1/
          posts.get.ts
          posts.[id].get.ts
```

No `app-routing.module.ts`, no manual `provideRouter([...])` call with hundreds of route objects — the framework reads the file tree and generates routes for you.

---

## The New Concept: File-Based Routing and Server Load Functions

**File-based routing** maps file paths directly to URL paths. This pattern, popularised by Next.js and Nuxt, trades explicit route configuration for a convention that is easier to scan and impossible to mis-wire.

Analog brings file-based routing to Angular using a Vite plugin that reads your `pages/` directory at build time and generates the Angular router configuration automatically. Dynamic segments use bracket notation: `[slug].page.ts` produces a route with a `:slug` param, and `[...rest].page.ts` catches all remaining segments.

Each page file exports a default Angular standalone component, optionally alongside a `load` function that runs on the server before the page renders:

```typescript
// src/app/pages/blog/[slug].page.ts
import { Component } from '@angular/core';
import { injectLoad } from '@analogjs/router';

// Runs on the server — data is serialised and transferred to the client
export const load = async ({ params }: { params: { slug: string } }) => {
  const post = await fetch(`/api/v1/posts/${params.slug}`).then(r => r.json());
  return { post };
};

@Component({
  standalone: true,
  template: `
    @if (data(); as d) {
      <article>
        <h1>{{ d.post.title }}</h1>
        <p class="excerpt">{{ d.post.excerpt }}</p>
      </article>
    }
  `,
})
export default class BlogPostPage {
  readonly data = injectLoad<typeof load>();
}
```

The `load` function runs on the server before the component renders. Analog serialises the result and transfers it to the client, eliminating the need for a separate client-side fetch. This is the same contract as [Angular's `resolve` guards](https://angular.dev/guide/routing/common-router-tasks#resolving-data-before-navigating) but tied to the file-based route and executed server-side automatically.

**Nitro API routes** live in `src/app/server/routes/`. Each file exports a typed event handler using the [h3](https://h3.unjs.io/) micro-framework that Nitro ships with:

```typescript
// src/app/server/routes/v1/posts.[id].get.ts
import { defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  // Fetch from your DB, CMS, or upstream API
  const post = await getPostById(id);
  return post; // Automatically JSON-serialised
});
```

The filename convention (`posts.[id].get.ts`) encodes both the URL shape and the HTTP method. Analog uses [Nitro](https://nitro.build/) under the hood, which means your API routes can be deployed to Node.js, Cloudflare Workers, Vercel Edge Functions, or any other Nitro-compatible target without changing application code.

---

## The New Tool: Analog.js (`@analogjs/platform`)

**Analog.js** is an open-source Angular meta-framework maintained by Brandon Roberts and a growing community. As of mid-2026 it is production-ready and actively used by teams building Angular apps that need SSR without the configuration burden.

Scaffold a new project:

```bash
npm create analog@latest my-analog-app
cd my-analog-app
npm install
npm run dev
```

The CLI prompts you for a template (basic, blog, or full-stack), then generates the project. The dev server starts in seconds — Vite's module graph means you get instant HMR on both component changes and API route changes.

Key packages:

```bash
@analogjs/platform   # core Vite plugin + file-based routing
@analogjs/router     # injectLoad, injectRouteData, injectContent helpers
@analogjs/content    # Markdown/MDX support (optional, great for blogs)
```

The `@analogjs/content` package is especially useful for documentation sites and blogs: place `.md` files in a `content/` folder and Analog parses their frontmatter and body at build time, making them available via a typed `injectContent()` call. This is how several Angular community docs sites are now built.

Analog also ships [official docs](https://analogjs.org/docs) and deployment guides for the most common hosting targets. For teams evaluating Angular SSR options, it sits squarely between "raw `@angular/ssr`" (maximum control, maximum setup) and a hosted platform — giving you the ergonomics of a meta-framework while keeping full control of the deployment target.

---

## Using ZyraUI for Analog.js Angular Pages

One of the first things you want in a new Analog project is a polished component library. [ZyraUI](https://www.zyraui.dev) integrates cleanly because all its components are standalone — no NgModule registration required, which matches Analog's standalone-first architecture perfectly.

Here is a blog listing page that uses ZyraUI's card and spinner components to display posts fetched from an Analog API route:

```typescript
// src/app/pages/blog/index.page.ts
import { Component } from '@angular/core';
import { injectLoad } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import { ZyraCardComponent, ZyraSpinnerComponent } from '@zyra-ui/angular';

export const load = async () => {
  const posts = await fetch('/api/v1/posts').then(r => r.json());
  return { posts };
};

@Component({
  standalone: true,
  imports: [RouterLink, ZyraCardComponent, ZyraSpinnerComponent],
  template: `
    @if (data(); as d) {
      <div class="post-grid">
        @for (post of d.posts; track post.id) {
          <zyra-card [title]="post.title" [subtitle]="post.date">
            <p>{{ post.excerpt }}</p>
            <a [routerLink]="['/blog', post.slug]">Read more</a>
          </zyra-card>
        }
      </div>
    } @else {
      <zyra-spinner />
    }
  `,
})
export default class BlogIndexPage {
  readonly data = injectLoad<typeof load>();
}
```

The `load` function runs on the server, so on the first request posts are already embedded in the HTML — no client-side spinner flash. On subsequent client-side navigations Analog re-runs the load function in the browser directly against your API routes. ZyraUI's `zyra-card` and `zyra-spinner` slot in without any module registration, keeping the component file lean.

Explore all 60+ free components at [zyraui.dev](https://www.zyraui.dev) — including [tables, modals, forms, and data display components](https://www.zyraui.dev/docs/components) that pair well with Analog's server-loaded data pattern. The [ZyraUI docs](https://www.zyraui.dev/docs) also cover theming, so you can match your brand across the full-stack app without custom CSS overrides.

---

## Wrapping up

The Analog.js Angular meta-framework removes the biggest friction point in Angular SSR: the setup. File-based routing, Nitro API routes, and the `load` function pattern give Angular developers the productivity shortcuts that Next.js and Nuxt users have had for years. If your team is building a content-heavy site, a blog, or a full-stack Angular dashboard and wants SSR without a bespoke server configuration, Analog is worth a serious look. Start at [analogjs.org](https://analogjs.org) and check the [ZyraUI components page](https://www.zyraui.dev/docs/components) for ready-made UI building blocks to drop into your pages.

---

## Frequently asked questions

### What is the Analog.js Angular meta-framework and how does it differ from plain Angular SSR?
Analog.js is a framework that sits on top of Angular and adds file-based routing, a Vite-native dev experience, and Nitro-based API routes. Plain `@angular/ssr` gives you server rendering but leaves routing, server entry configuration, and API handling entirely to you. Analog wires all of that up by convention, so you can start building features rather than infrastructure from day one.

### Does Analog.js work with Angular 22 standalone components and signals?
Yes. Analog is fully standalone-first and integrates with Angular 22's signal APIs out of the box. Page components use standard Angular standalone syntax, and you can use `signal()`, `computed()`, `effect()`, `input()`, and `output()` exactly as you would in any Angular 22 project. The `injectLoad()` helper returns a signal, so you can derive further reactive state from server-loaded data without any adapter code.

### Can I deploy an Analog.js app to Cloudflare Workers or Vercel Edge?
Yes. Analog uses Nitro as its server engine, and Nitro supports a wide range of deployment targets including Node.js, Vercel, Netlify, Cloudflare Workers, and AWS Lambda. You switch targets by changing the `preset` option in your `vite.config.ts` — no application code changes required.

### How does Analog.js handle data fetching differently from Angular's resolve guards?
Angular's `resolve` guards run before navigation and can block the route change until data is ready — under `@angular/ssr` they do run on the server for the initial render, but making that data available to the client after hydration (avoiding a redundant fetch) means wiring `TransferState` yourself. Analog's `load` functions run on the server during SSR too, but serialising the result and transferring it to the client happens automatically, by convention, with no manual `TransferState` code. On subsequent client-side navigations Analog calls the load function in the browser directly against your Nitro API routes. The core difference isn't where the code runs — both can run server-side — it's that Analog gives you one data-fetching contract with the SSR-to-client handoff built in, instead of resolvers plus manual `TransferState` wiring.
