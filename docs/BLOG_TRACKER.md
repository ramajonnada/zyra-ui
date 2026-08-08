# Blog Topics Tracker

This file is the single source of truth for all published blog concepts.
The daily blog task reads this file before picking a topic and appends to it after publishing.
**Never duplicate a concept listed here — find a different angle or a related but distinct topic.**

---

## Published Posts

| Date | Slug | Core Concepts Covered |
|------|------|-----------------------|
| 2026-08-06 | angular-design-tokens-theming-component-library-2026 | Design tokens, 3-tier token architecture (primitive/semantic/component), CSS custom properties vs SCSS variables, theming a component library, on-* contrast tokens |
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
| 2026-07-23 | angular-effect-cleanup-destroyref-memory-leaks-2026 | effect() onCleanup, DestroyRef, DestroyRef.onDestroy(), memory leak prevention, setInterval/ResizeObserver cleanup |
| 2026-07-23 | angular-let-template-syntax-2026 | @let template syntax, replacing *ngIf as workaround, template variable scoping, combining @let with @if/@for |
| 2026-07-23 | angular-tosignal-toobservable-rxjs-interop-2026 | toSignal(), toObservable(), RxJS/signals interop, initialValue, requireSync, injection context rules |
| 2026-07-24 | angular-afterrendereffect-dom-safe-side-effects-2026 | afterRenderEffect(), DOM-safe side effects, afterRenderEffect vs effect(), afterRenderEffect vs ngAfterViewInit, afterNextRender(), SSR-safe DOM access, ngxtension |
| 2026-07-25 | whats-new-in-angular-22 | Angular 22 release, Signal Forms stable, resource() stable, httpResource() stable, OnPush default, @Service decorator, injectAsync, debounced(), WebMCP, incremental hydration default, FetchBackend default, TypeScript 6, Webpack deprecation |
| 2026-07-26 | angular-withcomponentinputbinding-route-params-signals-2026 | withComponentInputBinding(), route params as signal inputs, ActivatedRoute replacement, query params as signals, resolver data as inputs, Biome linter/formatter |
| 2026-07-27 | angular-inject-functional-guards-interceptors-2026 | inject() in functional guards, functional HTTP interceptors, CanActivateFn, HttpInterceptorFn, withInterceptors(), InjectionToken factory, inject() in useFactory, Mock Service Worker (MSW) |
| 2026-07-27 | openai-structured-outputs-angular-services-2026 | OpenAI Structured Outputs, zodResponseFormat, Zod schema, type-safe AI responses, angular AI service, signals + async AI, openai npm SDK, Angular proxy config |
| 2026-07-28 | css-anchor-positioning-angular-tooltips-2026 | CSS Anchor Positioning API, anchor-name, position-anchor, anchor() function, @position-try, position-try-fallbacks, Popover API top-layer, Angular tooltip directive, Floating UI |
| 2026-07-29 | vercel-ai-sdk-angular-2026 | Vercel AI SDK, ai npm package, readDataStream, streamText, generateObject, toDataStreamResponse, provider-agnostic LLM, streaming AI with signals, structured object generation, Angular AI integration |
| 2026-07-31 | vitest-angular-faster-unit-tests-2026 | Vitest, @angular/build:vitest builder, replacing Jest with Vitest in Angular, native ESM testing, vitest --ui, fixture.componentRef.setInput(), provideHttpClientTesting, @vitest/coverage-v8 |
| 2026-07-31 | playwright-component-testing-angular-2026 | Playwright CT, @playwright/experimental-ct-angular, mount() API, component testing in real browser, signal inputs in tests, output() assertion, playwright-ct.config.ts, Playwright vs Vitest vs TestBed |
| 2026-08-01 | angular-web-workers-comlink-signals-2026 | Web Workers, Comlink proxy library, ng generate web-worker, postMessage alternatives, TypedArray transfer, signals + async worker results, worker reuse pattern, structured clone |
| 2026-08-02 | css-layer-angular-component-library-2026 | CSS @layer, cascade layers, specificity control, Angular style override, library style isolation, Lightning CSS, ViewEncapsulation + @layer, @layer in component SCSS |
| 2026-08-03 | storybook-9-angular-standalone-components-2026 | Storybook 9, @storybook/angular renderer, standalone component stories, signal inputs in stories, moduleMetadata removal, interaction tests, play() function, @storybook/test, @storybook/addon-a11y, axe-core accessibility testing, composeStories, Storybook CT vs Playwright CT |
| 2026-08-04 | ngrx-signal-store-angular-2026 | @ngrx/signals, signalStore(), withState(), withComputed(), withMethods(), patchState(), rxMethod(), withEntities(), @ngrx/signals/entities, NgRx Signal Store vs classic NgRx, signal-based state management |
| 2026-08-05 | container-queries-angular-component-library-2026 | CSS Container Queries, container-type inline-size, @container rule, named containers, cqi/cqw container query units, :host containment in Angular, ViewEncapsulation with container queries, replacing BreakpointObserver for layout, fluid component typography with clamp()+cqi |
| 2026-08-05 | analog-js-angular-meta-framework-2026 | Analog.js, Angular meta-framework, file-based routing in Angular, Nitro API routes, Angular Vite SSR, injectLoad(), @analogjs/platform, @analogjs/content, Analog.js deployment targets |
| 2026-08-05 | angular-for-track-expression-performance-2026 | @for track expression, track $index vs track item.id, Angular list rendering performance, DOM diffing with @for, track expression OnPush interaction, Angular DevTools profiler for list perf, stable identity keys |
| 2026-08-06 | angular-lazy-routes-loadcomponent-code-splitting-2026 | loadComponent, loadChildren, route-level code splitting, lazy loading routes, provideRouter, PreloadAllModules, QuicklinkStrategy, source-map-explorer, bundle size optimization, feature-scoped providers |
| 2026-08-06 | angular-model-signal-two-way-binding-2026 | model(), ModelSignal, two-way binding with signals, model.required(), model vs input(), @Input/@Output replacement, ngxtension syncSignal, component library two-way binding |
| 2026-08-07 | ngxtension-angular-utility-library-signals-2026 | ngxtension library, computedAsync, injectParams, injectQueryParams, explicitEffect, syncSignal, createInjectable, async signal derivation, selective effect dependencies, route param signals |
| 2026-08-07 | build-custom-mcp-server-angular-dev-workflows-2026 | Model Context Protocol (MCP), @modelcontextprotocol/sdk, building custom MCP server, MCP tools/resources/prompts, Angular CLI via MCP, design system resource, VS Code MCP config, McpServer, StdioServerTransport |
| 2026-08-07 | nx-monorepo-angular-libraries-2026 | Nx monorepo, @nx/angular, shared Angular libraries, Nx project graph, nx affected commands, nx generate library, tsconfig path aliases, Nx Cloud remote caching, nx release, module boundary rules, Nx workspace setup |
| 2026-08-06 | angular-computed-signal-advanced-patterns-2026 | computed() chaining, Angular signal memoization, derived state trees, lazy evaluation, conditional dependency tracking, reference stability, computedAsync, ngxtension computedAsync, replacing RxJS selector chains with computed() |
| 2026-08-08 | angular-cdk-virtual-scroll-large-lists-2026 | Angular CDK Virtual Scroll, CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, AutoSizeVirtualScrollStrategy, itemSize attribute, VirtualScrollStrategy interface, virtual scrolling with signals, @angular/cdk/scrolling, @angular/cdk-experimental/scrolling, DOM recycling, large list performance |
| 2026-08-08 | angular-pwa-service-worker-offline-2026 | Angular PWA, @angular/service-worker, ngsw-config.json, provideServiceWorker(), SwUpdate, VersionReadyEvent, prefetch/lazy asset groups, freshness/performance data group strategies, offline-first Angular app, PWA update banner with signals |

---

## Concept Index (quick duplicate check)

Before writing a new post, scan this list. If your concept appears here, **pick a different angle**.

**Routing & Code Splitting**
- loadComponent, route-level code splitting — covered (2026-08-06)
- loadChildren, feature route subtree lazy loading — covered (2026-08-06)
- provideRouter, PreloadAllModules, custom PreloadingStrategy — covered (2026-08-06)
- source-map-explorer bundle analysis for Angular — covered (2026-08-06)
- QuicklinkStrategy, ngx-quicklink viewport preloading — covered (2026-08-06)
- Feature-scoped providers on lazy route — covered (2026-08-06)
- Angular bundle size optimization via dynamic import() — covered (2026-08-06)

**Angular PWA & Service Workers**
- Angular PWA, @angular/pwa schematic, ng add @angular/pwa — covered (2026-08-08)
- @angular/service-worker, ngsw-worker.js, provideServiceWorker() — covered (2026-08-08)
- ngsw-config.json, assetGroups prefetch/lazy, dataGroups freshness/performance — covered (2026-08-08)
- SwUpdate, VersionReadyEvent, activateUpdate(), VERSION_READY event — covered (2026-08-08)
- Offline-first Angular app, service worker caching strategy — covered (2026-08-08)
- Signal-based service worker update state with toSignal() — covered (2026-08-08)
- PWA install prompt and update banner with Angular signals — covered (2026-08-08)

**Angular CDK & Virtual Scroll**
- CdkVirtualScrollViewport, virtual scroll viewport container — covered (2026-08-08)
- FixedSizeVirtualScrollStrategy, itemSize attribute — covered (2026-08-08)
- AutoSizeVirtualScrollStrategy, @angular/cdk-experimental/scrolling — covered (2026-08-08)
- VirtualScrollStrategy interface, custom scroll strategy — covered (2026-08-08)
- Angular CDK virtual scroll with signals and computed() — covered (2026-08-08)
- DOM recycling / virtual DOM windowing for large lists — covered (2026-08-08)
- Large list performance in Angular, 100k row rendering — covered (2026-08-08)

**Performance & Rendering**
- @for track expression, track $index vs track item.id — covered (2026-08-05)
- Angular list rendering DOM diffing, identity keys vs positional keys — covered (2026-08-05)
- Angular DevTools profiler flame chart for list performance — covered (2026-08-05)
- track expression interaction with OnPush change detection — covered (2026-08-05)

**Angular APIs & Features**
- @ngrx/signals, signalStore() — covered (2026-08-04)
- withState(), withComputed(), withMethods(), patchState() — covered (2026-08-04)
- rxMethod() RxJS bridge in Signal Store — covered (2026-08-04)
- withEntities(), @ngrx/signals/entities entity adapter — covered (2026-08-04)
- NgRx Signal Store vs classic NgRx Store — covered (2026-08-04)
- withComponentInputBinding(), route params as signal inputs — covered (2026-07-26)
- ActivatedRoute replacement with signal inputs — covered (2026-07-26)
- query params as signal inputs, transform option — covered (2026-07-26)
- resolver data bound to component inputs — covered (2026-07-26)
- Angular 22 release overview — covered (2026-07-25)
- Signal Forms stable — covered (2026-07-25)
- resource(), rxResource(), httpResource() stable — covered (2026-07-25)
- OnPush as default change detection — covered (2026-07-25)
- @Service() decorator — covered (2026-07-25)
- injectAsync(), onIdle prefetch — covered (2026-07-25)
- debounced() signal utility — covered (2026-07-25)
- WebMCP, provideExperimentalWebMcpTools — covered (2026-07-25)
- Incremental hydration as default — covered (2026-07-25)
- FetchBackend as default HttpClient backend — covered (2026-07-25)
- resourceFromSnapshots, resource composition — covered (2026-07-25)
- isActive() router signal — covered (2026-07-25)
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
- effect() onCleanup, DestroyRef — covered (2026-07-23)
- @let template syntax — covered (2026-07-23)
- toSignal(), toObservable(), RxJS interop — covered (2026-07-23)
- afterRenderEffect(), DOM-safe reactive side effects — covered (2026-07-24)
- afterRenderEffect vs effect() vs ngAfterViewInit vs afterNextRender() — covered (2026-07-24)
- ngxtension utility library — covered (2026-07-24)

**computed() Advanced Patterns**
- computed() chaining, derived state trees replacing RxJS selector chains — covered (2026-08-06)
- Angular signal memoization, lazy evaluation semantics — covered (2026-08-06)
- Conditional dependency tracking in computed() — covered (2026-08-06)
- Reference stability in computed() returning arrays/objects — covered (2026-08-06)
- computedAsync from ngxtension, async signal derivation — covered (2026-08-06)
- Shared computed signals in injectable services — covered (2026-08-06)

**Two-Way Binding & model() Signal**
- model(), ModelSignal, Angular signal two-way binding — covered (2026-08-06)
- model.required(), required model signal inputs — covered (2026-08-06)
- model() vs input() vs @Input/@Output — covered (2026-08-06)
- computed() and effect() on ModelSignal — covered (2026-08-06)
- ngxtension syncSignal utility — covered (2026-08-06)
- Component library two-way binding pattern with model() — covered (2026-08-06)

**Angular APIs & Features**
- inject() in functional guards (CanActivateFn) — covered (2026-07-27)
- inject() in functional HTTP interceptors (HttpInterceptorFn) — covered (2026-07-27)
- withInterceptors(), provideHttpClient — covered (2026-07-27)
- inject() in InjectionToken factory and useFactory — covered (2026-07-27)
- composable guard patterns with plain functions — covered (2026-07-27)

**Testing & DX (continued)**
- Storybook 9 Angular renderer, standalone-first story setup — covered (2026-08-03)
- signal inputs/outputs in Storybook args (no moduleMetadata) — covered (2026-08-03)
- Storybook interaction tests, play() function, @storybook/test — covered (2026-08-03)
- @storybook/addon-a11y, axe-core accessibility in stories — covered (2026-08-03)
- composeStories, sharing play functions with Vitest — covered (2026-08-03)
- Storybook interaction tests vs Playwright CT comparison — covered (2026-08-03)

**Angular Meta-Frameworks & Deployment**
- Analog.js Angular meta-framework, @analogjs/platform — covered (2026-08-05)
- File-based routing in Angular (Analog pages/ convention) — covered (2026-08-05)
- Nitro API routes in Angular, h3 event handlers — covered (2026-08-05)
- injectLoad(), server load functions, SSR transfer state in Analog — covered (2026-08-05)
- @analogjs/content, Markdown content support in Analog — covered (2026-08-05)
- Analog.js deployment presets (Cloudflare Workers, Vercel Edge) — covered (2026-08-05)

**CSS & Browser APIs**
- CSS Container Queries, container-type inline-size, @container rule — covered (2026-08-05)
- Named containers, container-name — covered (2026-08-05)
- Container query units: cqi, cqw, cqh, cqb, cqmin, cqmax — covered (2026-08-05)
- :host containment in Angular standalone components — covered (2026-08-05)
- ViewEncapsulation.None with container queries — covered (2026-08-05)
- Replacing BreakpointObserver for component layout responsiveness — covered (2026-08-05)
- Fluid typography with clamp() + cqi units — covered (2026-08-05)
- CSS @layer, cascade layers, @layer priority order — covered (2026-08-02)
- Angular style override with @layer, specificity-free overrides — covered (2026-08-02)
- @layer inside Angular component SCSS files — covered (2026-08-02)
- Lightning CSS for Angular build-time layer processing — covered (2026-08-02)
- Angular directive to inject layer order declaration — covered (2026-08-02)
- CSS Anchor Positioning API, anchor-name, position-anchor, anchor() function — covered (2026-07-28)
- @position-try, position-try-fallbacks, auto flip fallbacks — covered (2026-07-28)
- Popover API top-layer rendering in Angular — covered (2026-07-28)
- Angular tooltip directive with CSS Anchor Positioning — covered (2026-07-28)
- Floating UI (@floating-ui/dom) Angular service — covered (2026-07-28)

**Monorepo & Workspace Tooling**
- Nx monorepo setup, create-nx-workspace, @nx/angular — covered (2026-08-07)
- Nx shared Angular libraries, nx generate library, --buildable/--publishable — covered (2026-08-07)
- Nx project graph, nx graph visualization — covered (2026-08-07)
- nx affected commands, affected test/build/lint — covered (2026-08-07)
- TypeScript path aliases in Nx (tsconfig.base.json) — covered (2026-08-07)
- Nx Cloud remote caching, nx connect — covered (2026-08-07)
- Nx module boundary rules, @nx/eslint-plugin enforceModuleBoundaries — covered (2026-08-07)
- nx release, version bumping, changelog in Nx — covered (2026-08-07)
- Library type organization: ui/data-access/util/feature — covered (2026-08-07)

**ngxtension Utility Library**
- ngxtension library, community Angular utilities — covered (2026-08-07)
- computedAsync, async signal derivation with cancellation — covered (2026-08-07)
- injectParams(), injectQueryParams(), router params as signals — covered (2026-08-07)
- explicitEffect(), selective signal dependency tracking — covered (2026-08-07)
- syncSignal(), bidirectional signal sync — covered (2026-08-07)
- createInjectable(), class-free injectable factory pattern — covered (2026-08-07)
- computedAsync .isLoading() / .error() / .value() sub-signals — covered (2026-08-07)

**Custom MCP Servers & AI Tooling**
- Model Context Protocol (MCP), MCP server primitives (tools/resources/prompts) — covered (2026-08-07)
- @modelcontextprotocol/sdk TypeScript SDK, McpServer, StdioServerTransport — covered (2026-08-07)
- Building a custom MCP server for Angular dev workflows — covered (2026-08-07)
- Angular CLI commands via MCP tool (generate_component, list_components) — covered (2026-08-07)
- MCP resource for design system tokens — covered (2026-08-07)
- Wiring MCP server into Claude Desktop and VS Code Copilot — covered (2026-08-07)

**AI & Tooling**
- Vercel AI SDK (ai npm package), readDataStream, streamText, toDataStreamResponse — covered (2026-07-29)
- generateObject, structured object generation with Zod schema via AI SDK — covered (2026-07-29)
- Provider-agnostic LLM integration with Angular signals — covered (2026-07-29)
- OpenAI Structured Outputs, zodResponseFormat, type-safe AI responses — covered (2026-07-27)
- Angular service pattern for OpenAI with signals — covered (2026-07-27)
- Mock Service Worker (MSW) for Angular HTTP testing — covered (2026-07-27)
- Biome linter/formatter for Angular — covered (2026-07-26)
- Angular CLI MCP server, ng mcp — covered (2026-05-21)
- llms.txt for Angular codegen — covered (2026-05-19)
- Web Codegen Scorer — covered (2026-05-19)
- LLM streaming UI with Angular — covered (2026-05-15)

**Performance & Architecture**
- Web Workers in Angular, ng generate web-worker — covered (2026-08-01)
- Comlink proxy library, type-safe worker API — covered (2026-08-01)
- postMessage/onmessage vs Comlink proxy pattern — covered (2026-08-01)
- Worker reuse pattern, worker pool, ngOnDestroy terminate — covered (2026-08-01)
- Transferable objects, ArrayBuffer zero-copy transfer — covered (2026-08-01)
- Feeding worker results into Angular signals — covered (2026-08-01)

**Testing & DX**
- Vitest with Angular, @angular/build:vitest builder — covered (2026-07-31)
- Replacing Jest with Vitest, native ESM Angular testing — covered (2026-07-31)
- fixture.componentRef.setInput() for signal inputs in tests — covered (2026-07-31)
- @vitest/coverage-v8, Vitest UI, Vitest watch mode — covered (2026-07-31)
- Playwright CT, @playwright/experimental-ct-angular — covered (2026-07-31)
- mount() API, signal inputs and outputs in Playwright CT tests — covered (2026-07-31)
- Component testing in real browser vs jsdom — covered (2026-07-31)
- Playwright CT vs Vitest vs TestBed comparison — covered (2026-07-31)

**Performance**
- Core Web Vitals with Angular SSR — covered (2026-05-08)
- Zoneless performance in streaming apps — covered (2026-05-15)

---

## Next Scheduled Topic (pinned — write this next)

_(No pinned topic. Choose from Available Topic Ideas below.)_

## Available Topic Ideas (not yet written)

Use these as inspiration — they are NOT reserved, first run wins:

- ~~`computed()` advanced patterns — chaining, lazy evaluation~~ — covered (2026-08-06)
- Angular `@let` template variable syntax
- ~~`provideRouter` tree-shakeable routing patterns~~ — covered via loadComponent post (2026-08-06)
- Angular control flow `@switch` real-world usage
- Angular typed forms with signal state
- Angular `inject()` in factory functions and guards
- ~~Angular lazy routes with `loadComponent`~~ — covered (2026-08-06)
- `HttpClient` with interceptors in standalone apps
- Angular DevTools profiler walkthrough
- ~~Nx monorepo with Angular libraries~~ — covered (2026-08-07)
- Angular + Cloudflare Workers deployment
- ~~`ngxtension` utility library overview~~ — covered (2026-08-07)
- GitHub Copilot workspace for Angular projects
- AI code review tools (CodeRabbit, Graphite, etc.)
- ~~Model Context Protocol (MCP) — building custom tools~~ — covered (2026-08-07)
- OpenAI Structured Outputs in Angular services

---

*Last updated: 2026-08-08*





