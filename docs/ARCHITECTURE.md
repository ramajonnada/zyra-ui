# Zyra UI — Architecture

> **Tip:** Install the [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) VS Code extension to render these diagrams inline.

---

## 1. Monorepo Overview

```mermaid
graph TD
    ROOT["zyra-workspace (Angular monorepo)"]
    ROOT --> LIB["📦 zyra-ng-ui\nNPM library\nprojects/zyra-ng-ui"]
    ROOT --> APP["🌐 zyra-ui\nDocs/marketing site\nprojects/zyra-ui"]
    LIB -->|"ng build zyra-ng-ui\n(ng-packagr)"| DIST["dist/zyra-ng-ui"]
    DIST -->|"imported as npm package"| APP
    APP -->|"npm run build:ssr"| SSR["dist/zyra-ui/\nserver/server.mjs"]
    SSR -->|"deployed"| VERCEL["☁️ Vercel\nzyraui.dev"]
```

---

## 2. Library — `zyra-ng-ui`

```mermaid
graph TD
    LIB["zyra-ng-ui"]

    LIB --> THEME["🎨 Theme System"]
    THEME --> TS["ZyraThemeService\ntheme-service.ts"]
    THEME --> TT["ZyraTheme type\ntheme-type.ts"]
    THEME --> PZ["provideZyra()\nprovide-zyra.ts"]

    LIB --> SCSS["🖌️ SCSS Tokens\n(--zyr-* CSS custom properties)"]
    SCSS --> SH["_shared-theme.scss\n(palette, radius, spacing, motion)"]
    SCSS --> LT["_light-theme.scss"]
    SCSS --> DT["_dark-theme.scss"]
    SCSS --> AN["_animations.scss"]
    SCSS --> MX["_mixins.scss"]
    SCSS --> B["_base.scss"]

    LIB --> COMP["🧩 Components (60 — Phase 1 free tier complete)"]

    COMP --> FORM["Forms"]
    FORM --> c1["ZyraInput"]
    FORM --> c2["ZyraFormField\n+ ZyrPrefix / ZyrSuffix"]
    FORM --> c3["ZyraSelect + ZyraOption\n+ ZyraMultiSelect + ZyraAutocomplete"]
    FORM --> c4["ZyraTextarea"]
    FORM --> c5["ZyraCheckbox"]
    FORM --> c6["ZyraRadio + ZyraRadioGroup"]
    FORM --> c7["ZyraToggle + ZyraSwitch"]
    FORM --> c8["ZyraSlider, ZyraRating,\nZyraOtpInput, ZyraPasswordInput,\nZyraFileUpload, ZyraDatePicker"]

    COMP --> DISPLAY["Data Display"]
    DISPLAY --> d1["ZyraCard"]
    DISPLAY --> d2["ZyraAvatar"]
    DISPLAY --> d3["ZyraBadge"]
    DISPLAY --> d4["ZyraChip"]
    DISPLAY --> d5["ZyraDivider"]
    DISPLAY --> d6["ZyraSkeleton"]
    DISPLAY --> d7["ZyraProgress"]
    DISPLAY --> d8["ZyraTable, ZyraTreeView,\nZyraCalendar, ZyraCarousel,\nZyraTimeline, ZyraEmptyState,\nZyraCodeBlock"]
    DISPLAY --> d9["🆕 ZyraImage, ZyraJsonViewer,\nZyraMarkdownViewer\n(Sprint 7)"]

    COMP --> OVERLAY["Overlays / Feedback"]
    OVERLAY --> o1["ZyraModal, ZyraDrawer,\nZyraConfirmDialog, ZyraPopover"]
    OVERLAY --> o2["ZyraToast\n+ ZyraToastContainer\n+ ZyraToastService"]
    OVERLAY --> o3["ZyraTooltip, ZyraThemeSwitch"]
    OVERLAY --> o4["ZyraAlert"]
    OVERLAY --> o5["ZyraSpinner"]
    OVERLAY --> o6["🆕 ZyraCommandPalette\n(Sprint 7 — Ctrl/Cmd+K)"]

    COMP --> NAV["Navigation"]
    NAV --> n1["ZyraTabs + ZyraTab"]
    NAV --> n2["ZyraAccordion\n+ ZyraAccordionItem"]
    NAV --> n3["ZyraButton + ZyraButtonGroup"]
    NAV --> n4["ZyraHeader, ZyraSidebar,\nZyraBreadcrumb, ZyraPagination,\nZyraStepper, ZyraDropdownMenu"]

    COMP --> LAYOUTP["Layout"]
    LAYOUTP --> l1["ZyraBox, ZyraFlex, ZyraGrid,\nZyraContainer, ZyraAspectRatio,\nZyraScrollArea, ZyraStack,\nZyraTypography"]

    COMP --> UTIL["Utilities / Actions"]
    UTIL --> u1["ZyraClipboard"]
```

*This diagram groups components by category with representative examples, not an exhaustive per-component list — see `projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts` (`UI_COMPONENT_SHOWCASE` / `COMPONENT_COUNT`) for the authoritative, always-current full list and count.*

---

## 3. App — `zyra-ui`

```mermaid
graph TD
    APP["zyra-ui (Angular 21 SSR)"]

    APP --> CONFIG["app.config.ts\n• provideZyra()\n• provideRouter()\n• provideClientHydration()\n• provideHttpClient()"]

    APP --> LAYOUT["Layout (always rendered)"]
    LAYOUT --> H["Header\n• Theme toggle\n• Nav links\n• Sidebar toggle"]
    LAYOUT --> S["Sidebar\n• 260px / 84px (signal-based)\n• Component nav links"]
    LAYOUT --> F["Footer"]

    APP --> ROUTES["Lazy-loaded Routes"]
    ROUTES --> R1["/ → Home\n(hero, features, install guide)"]
    ROUTES --> R2["/components → UiComponents\n(component gallery)"]
    ROUTES --> R3["/components/:component → UiComponentDetail\n(playground per component)"]
    ROUTES --> R4["/blog → BlogList"]
    ROUTES --> R5["/blog/:slug → BlogDetails\n(markdown rendered)"]
    ROUTES --> R6["/docs → Docs"]
    ROUTES --> R7["/about → About"]
    ROUTES --> R8["/contact → Contact"]
    ROUTES --> R9["/privacy → PrivacyPolicy"]
    ROUTES --> R10["/terms → TermsOfServices"]

    APP --> SVC["Services"]
    SVC --> BS["BlogService\n• fetches /content/index.json\n• fetches /content/{slug}.md"]
    SVC --> SEO["SeoService\n• title, meta, OG tags\n• canonical URL"]
    SVC --> GH["GithubService"]
```

---

## 4. Component Playground Structure

Each component under `/components/:component` has its own playground page:

```mermaid
graph LR
    DETAIL["UiComponentDetail\n(router outlet)"]
    DETAIL --> PG["comp/\n(playground pages)"]
    PG --> accordion & alert & avatar & badge & button
    PG --> card & checkbox & chip & divider & "form-field"
    PG --> input & modal & progress & radio & select
    PG --> skeleton & spinner & tabs & textarea & toast
    PG --> toggle & tooltip
```

---

## 5. Theme Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant ZyraThemeService
    participant HTML as "html[data-theme]"
    participant CSS as "CSS Custom Properties"

    App->>ZyraThemeService: provideZyra() at bootstrap
    ZyraThemeService->>ZyraThemeService: read localStorage / OS preference
    ZyraThemeService->>HTML: set data-theme="light|dark"
    HTML->>CSS: activate --zyr-* token overrides
    User->>App: toggle theme
    App->>ZyraThemeService: setTheme('dark')
    ZyraThemeService->>HTML: update data-theme
    ZyraThemeService->>ZyraThemeService: persist to localStorage
```

---

## 6. Build & Deploy Pipeline

```mermaid
flowchart LR
    DEV["Local Dev\nnpm start"]
    BUILD_LIB["ng build zyra-ng-ui\n(ng-packagr)"]
    BUILD_SSR["npm run build:ssr\n(@angular/ssr + Express)"]
    VERCEL["Vercel\n• routes all requests → server.mjs\n• static assets served directly"]

    DEV --> BUILD_LIB
    BUILD_LIB --> BUILD_SSR
    BUILD_SSR --> VERCEL
```

---

## 7. Key Technology Decisions

| Concern           | Choice                           | Why                                    |
| ----------------- | -------------------------------- | -------------------------------------- |
| Framework         | Angular 21                       | Signals-first, zoneless, SSR-native    |
| Change detection  | OnPush + signals                 | No zone.js, explicit reactivity        |
| Styling           | SCSS + CSS custom properties     | Runtime theme switching without JS     |
| SSR               | `@angular/ssr` + Express         | SEO, fast initial paint                |
| Deployment        | Vercel                           | Zero-config SSR, edge CDN              |
| Library packaging | `ng-packagr`                     | Produces proper Angular Package Format |
| Blog              | Markdown + `ngx-markdown`        | Content editable without rebuilds      |
| Fonts             | Outfit / IBM Plex Sans / JetBrains Mono | Display / body / mono roles         |
