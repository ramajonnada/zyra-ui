# Blog Topics Tracker

This file is the single source of truth for all published blog concepts.
The daily blog task reads this file before picking a topic and appends to it after publishing.
**Never duplicate a concept listed here — find a different angle or a related but distinct topic.**

---

## Published Posts

| Date | Slug | Core Concepts Covered |
|------|------|-----------------------|
| 2026-01-03 | angular-21-signals-explained-signals-signal-forms | Angular signals, signal forms, zoneless change detection, RxJS interop, Angular reactivity |
| 2026-03-06 | angular-folder-structure-practices-2026-guide | Angular folder structure, frontend architecture, scalable Angular app structure |
| 2026-04-27 | angular-v21-zoneless-guide-remove-zonejs-use-signals | Zoneless Angular, removing ZoneJS, signals-based change detection, Angular migration |
| 2026-05-08 | angular-ssr-seo-2026-core-web-vitals-component-library | Angular SSR, SEO, Core Web Vitals, Angular hydration, structured data, meta tags |
| 2026-05-12 | modern-angular-ui-animations-2026 | Angular animations, CSS animations, micro-interactions, View Transitions API, scroll animations |
| 2026-05-15 | angular-ui-library-zoneless-ai-streaming-rerenders | Angular zoneless UI performance, LLM streaming UI, signal-based change detection in streaming apps |
| 2026-05-19 | better-ai-generated-angular-code-llms-txt-web-codegen-scorer | llms.txt, Web Codegen Scorer, AI-generated Angular code quality, Angular AI prompts |
| 2026-05-21 | angular-cli-mcp-server-generate-components-with-ai | Angular CLI MCP server, ng mcp, AI component generation, find_examples, get_best_practices |
| 2026-05-23 | fix-ng0908-in-this-configuration-angular-requires-zonejs | NG0908 error fix, Angular requires Zone.js, zoneless polyfills, Angular error debugging |
| 2026-06-29 | angular-defer-blocks-lazy-loading-2026 | @defer blocks, lazy loading, on viewport / on interaction / on idle triggers, @placeholder, @loading |
| 2026-06-29 | angular-resource-api-httpresouce-signals-2026 | resource() API, httpResource(), reactive HTTP with signals, optimistic updates, SSR with resource |
| 2026-07-23 | angular-input-output-signal-api-replace-decorators | input(), output(), InputSignal, input.required(), signal inputs, OutputEmitterRef, replacing @Input/@Output, transform option, ngOnChanges replacement |
| 2026-07-23 | angular-linked-signal-derived-writable-signals-2026 | linkedSignal(), derived writable signals, linkedSignal vs computed(), source/computation form, resetting state on input change |

---

## Concept Index (quick duplicate check)

Before writing a new post, scan this list. If your concept appears here, **pick a different angle**.

**Angular APIs & Features**
- signals (basic), signal() — covered (2026-01-03)
- signal forms — covered (2026-01-03)
- zoneless change detection (overview) — covered (2026-04-27)
- removing ZoneJS — covered (2026-04-27)
- @defer blocks, lazy loading triggers — covered (2026-06-29)
- resource(), httpResource() — covered (2026-06-29)
- Angular SSR / hydration — covered (2026-05-08)
- Angular animations, View Transitions — covered (2026-05-12)
- Angular folder structure — covered (2026-03-06)
- NG0908 error fix — covered (2026-05-23)
- input(), InputSignal, signal inputs — covered (2026-07-23)
- output(), OutputEmitterRef — covered (2026-07-23)
- input.required(), required signal inputs — covered (2026-07-23)
- replacing @Input/@Output with function API — covered (2026-07-23)
- ngOnChanges replacement with computed()/effect() — covered (2026-07-23)
- linkedSignal(), derived writable signals — covered (2026-07-23)

**AI & Tooling**
- Angular CLI MCP server, ng mcp — covered (2026-05-21)
- llms.txt for Angular codegen — covered (2026-05-19)
- Web Codegen Scorer — covered (2026-05-19)
- LLM streaming UI with Angular — covered (2026-05-15)

**Performance**
- Core Web Vitals with Angular SSR — covered (2026-05-08)
- Zoneless performance in streaming apps — covered (2026-05-15)

---

## Available Topic Ideas (not yet written)

Use these as inspiration — they are NOT reserved, first run wins:

- `effect()` cleanup and `DestroyRef` — memory leak prevention
- `computed()` advanced patterns — chaining, lazy evaluation
- `toSignal()` / `toObservable()` — RxJS ↔ signals interop deep dive
- `afterRenderEffect()` — DOM-safe side effects
- Angular `@let` template variable syntax
- `withComponentInputBinding()` — route params as signal inputs
- `provideRouter` tree-shakeable routing patterns
- Angular control flow `@switch` real-world usage
- Angular typed forms with signal state
- `@for` track expression performance tips
- Angular `inject()` in factory functions and guards
- Angular lazy routes with `loadComponent`
- `HttpClient` with interceptors in standalone apps
- Angular DevTools profiler walkthrough
- CSS `@layer` in Angular component styles
- Angular + Web Workers for CPU-heavy tasks
- Container queries in Angular component libraries
- CSS anchor positioning — practical use in tooltips/popovers
- Biome as Angular linter/formatter replacement for ESLint
- Nx monorepo with Angular libraries
- Analog.js — Angular meta-framework
- Angular + Cloudflare Workers deployment
- `ngxtension` utility library overview
- Storybook 9 with Angular standalone components
- Playwright component testing for Angular
- Vitest with Angular (experimental)
- GitHub Copilot workspace for Angular projects
- AI code review tools (CodeRabbit, Graphite, etc.)
- Model Context Protocol (MCP) — building custom tools
- OpenAI Structured Outputs in Angular services
- Vercel AI SDK with Angular frontend

---

*Last updated: 2026-07-23*
