# ZyraUI Engineering Guide

This is the permanent engineering handbook for ZyraUI. It defines how the
library is designed, built, tested, documented, and released — for every
contributor, human or AI, on every future component, directive, service,
utility, theme, token, doc page, and playground example.

It is not scoped to any single piece of work (the Header rework, the token
architecture) — it is the standard those efforts were built to conform to,
and the standard every future effort must conform to as well.

If a change conflicts with this guide, the guide wins, or the guide gets
amended on purpose (see [§15 ADRs](#15-architecture-decision-records-adrs)) —
it never silently drifts.

---

## 1. Project Philosophy

ZyraUI is building toward 60+ free components, a premium tier, templates,
and AI-assisted authoring — the kind of surface area that only survives if
every principle below is non-negotiable from day one, not retrofitted at
component #40.

| Principle | Why it exists |
|---|---|
| **Reusable** | A component built for one screen and reused nowhere is a cost, not an asset. If it can't be dropped into an unrelated app with only token overrides, it isn't done. |
| **Framework quality** | Users adopting ZyraUI are choosing it over Angular Material / PrimeNG. "Good enough for our app" is not the bar — "good enough to depend on" is. |
| **Accessible by default** | Retrofitting accessibility onto 60+ components is a multi-year project nobody survives. It's built in at component #1 or it's a permanent liability. |
| **SSR-safe** | The marketing/docs site (`zyra-ui`) renders on Vercel with SSR. A component that touches `window`/`document` unguarded breaks the site it's documented on. |
| **Tree-shakeable** | Consumers importing `ZyraButton` should not pay for `ZyraCalendar`'s bundle weight. Standalone components + no barrel-import side effects keep this true. |
| **Responsive** | "Desktop-only, mobile later" is how the Header ended up with hardcoded, un-tokenized mobile behavior in the first place. Responsive is part of the initial spec, not a follow-up ticket. |
| **Composable** | Prefer slots/content-projection/directives over a config object with 40 boolean inputs. Composition scales to unforeseen use cases; configuration objects don't. |
| **Themeable** | Every visual property a consumer might reasonably want to change must be reachable through the token system — never only through a forked stylesheet. |
| **Design-token driven** | The 4-tier token system (see [§4](#4-design-token-architecture)) is how theming, brand customization, and a future theme builder all become "override a token," not "fork a component." |
| **Backward compatible** | A public API (Inputs, Outputs, tokens, selectors) is a promise. Breaking it costs every consumer who upgraded in good faith — avoid it; version and deprecate when unavoidable. |
| **Performance focused** | OnPush + signals + minimal DOM churn isn't an optimization pass — it's the default posture, because retrofitting performance across 60+ components later is the same trap as retrofitting accessibility. |
| **Maintainable** | Small, well-named public APIs and consistent internal patterns are what let a contributor who's never touched a component still safely modify it. |
| **Future-proof** | Every architecture decision here is evaluated against "does this still make sense at 100 components, 3 more themes, and a theme builder?" — not just against today's needs. |

---

## 2. Development Workflow

Every new feature — component, directive, token group, service, or utility —
follows this sequence. **No implementation begins before architecture is
approved.** Steps can be fast for small work, but none are skipped.

```
Requirements Analysis
        ↓
Architecture Review
        ↓
Public API Design
        ↓
Accessibility Review
        ↓
Responsive Review
        ↓
Token Review
        ↓
Implementation
        ↓
Testing
        ↓
Documentation
        ↓
Playground
        ↓
Release
```

- **Requirements Analysis** — what problem does this solve, for whom, and
  does an existing component already solve it (see [§14](#14-future-component-checklist))?
- **Architecture Review** — how does this fit the existing component/token/
  API patterns; what's the blast radius if it's wrong?
- **Public API Design** — Inputs/Outputs/selectors/slots decided and written
  down *before* code, per [§7](#7-public-api-guidelines).
- **Accessibility Review** — keyboard model, ARIA roles, focus behavior
  decided before code, per [§8](#8-accessibility-standards).
- **Responsive Review** — desktop/tablet/mobile behavior decided before
  code, per [§9](#9-responsive-standards).
- **Token Review** — which visual properties become component tokens, and
  what semantic tokens they map to, per [§5](#5-component-token-workflow) —
  decided before implementation, not retrofitted after.
- **Implementation** — only now does code get written.
- **Testing, Documentation, Playground, Release** — per [§10](#10-testing-standards)–[§12](#12-release-checklist).

For an AI agent: this means a plan (or equivalent design writeup) is expected
before touching component/token files for anything beyond a trivial fix —
mirroring exactly how the Header/Token Architecture work in this repo went
through review and revision *before* any `.scss` file changed.

---

## 3. Component Architecture Rules

| Rule | Explanation |
|---|---|
| **Standalone component** | No NgModules. Every component, directive, and pipe declares its own imports. Keeps tree-shaking honest and avoids the NgModule coordination tax at 60+ components. |
| **OnPush change detection** | Default for every component. Combined with signals, this makes performance the default rather than something to opt into. |
| **Signals where appropriate** | `input()`, `output()`, `model()`, `signal()`, `computed()` are the default state primitives — not `@Input()`/`@Output()` decorators, not manual `BehaviorSubject` plumbing for local state. |
| **SSR-safe** | No direct `window`/`document`/`localStorage` access — inject `DOCUMENT` (and `PLATFORM_ID` / `isPlatformBrowser` where behavior must differ) so the component doesn't crash the SSR render used by the docs site. |
| **Tree-shakeable** | No side-effecting module-level code; no component importing sibling components it doesn't render. |
| **Minimal public API** | Every `input()`/`output()` is a permanent commitment. If it can be computed internally or derived from a slot, it doesn't need to be an Input. |
| **Composition over configuration** | Prefer `<zyra-card><div slot="header">...</div></zyra-card>` over `<zyra-card [headerConfig]="{...}">`. Config objects don't scale to unforeseen consumer needs; slots do. |
| **Accessibility first** | Keyboard support and ARIA roles are part of the component's spec, decided during Architecture Review — not a post-hoc audit pass. |
| **Responsive by default** | A component's mobile behavior is designed alongside its desktop behavior, not bolted on later (see the Header retrofit that motivated this guide). |

---

## 4. Design Token Architecture

The official, permanent token hierarchy:

```
Tier 0 — Primitive Tokens   (raw values: color ramps, spacing, radius, motion, z-index — theme-invariant)
              ↓
Tier 1 — Theme Tokens       (per-theme palette instance: dark/light/ocean/amber/rose)
              ↓
Tier 2 — Semantic Tokens    (role-based aliases over Tier 1: background, surface, foreground, primary, danger…)
              ↓
Tier 3 — Component Tokens   (per-component, namespaced: --zyra-<component>-<property>)
              ↓
        Component Styles    (consume Tier 3 only)
```

**Tier responsibilities:**
- **Tier 0 (Primitives)** — context-free raw values. Never named after a
  component or role. Never references another tier.
- **Tier 1 (Theme)** — the palette instance for one theme. Every theme
  defines the *complete* contract (same token names across all themes) —
  no partial themes.
- **Tier 2 (Semantic)** — role-based aliases only, every value a `var()`
  reference to Tier 1, never a raw value. This is the layer a theme
  builder or brand-customization tool targets.
- **Tier 3 (Component)** — the actual public API surface for styling.
  Namespaced per component, values resolve to Tier 2 (or Tier 0 for
  structural, non-thematic values like spacing/motion).

**The rule, stated plainly: components consume only their own Component
(Tier 3) tokens. A component `.scss` file never references a Tier 1 or
Tier 2 token directly, and never a raw hex/px/ms value for a visual
property.** If a component needs a new visual knob, it gets a Tier 3 token
first — it does not reach past that layer as a shortcut.

This rule exists because skipping it is exactly how a component ends up
impossible to re-skin without a fork: if `zyra-header.scss` reads
`var(--zyra-color-background)` directly, there is no way to give the header
a different background than the page canvas without changing the page
canvas too. Tier 3 exists to give every component its own override point.

Two token namespaces, deliberately distinct:
- **`--zyra-*`** — the public, documented, stable API. Anything under this
  prefix in a component's token table is safe to override indefinitely.
- **`--zyui-*`** — internal host↔slot wiring (e.g. layout props passed to
  projected content). Never documented as public API, free to change
  without notice. Never let an internal prop collide with or shadow a
  `--zyra-*` name — that collision class of bug (same name reused at two
  tiers) has already caused real regressions in this codebase and must not
  recur.

---

## 5. Component Token Workflow

Mandatory for every new component, and for every retrofit of an existing one:

1. **Identify all public visual properties** — colors, sizes, spacing,
   radius, shadow, motion — anything a reasonable consumer might want to
   customize without forking the component.
2. **Create Component Tokens** for each, named `--zyra-<component>-<property>`.
3. **Map each Component Token to a Semantic Token** (Tier 2) — never
   straight to a theme or primitive value. (Structural, non-thematic values
   with no semantic concept — e.g. an internal spacing scale value — may
   resolve to a Tier 0 dimension token instead; see [§4](#4-design-token-architecture).)
4. **The component consumes only its own Component Tokens** — never
   semantic tokens, never raw values, for any visual property.
5. **Document all public Component Tokens** — a token table on the
   component's doc page (see [§11](#11-documentation-standards)).
6. **Add tests** covering token-driven behavior where applicable.
7. **Release.**

Properties classified as purely internal implementation detail (a flex-gap
hack, a grid-template value with no independent meaning to a consumer) skip
step 2 — but that classification must be an explicit decision made during
Token Review (see [§2](#2-development-workflow)), not a default from
silence.

---

## 6. Styling Rules

| Rule | Why |
|---|---|
| **No hardcoded public colors** | Every color a consumer could reasonably want to theme goes through a Component Token. A hardcoded hex is invisible to theming and to a future brand-customization tool. |
| **No hardcoded spacing** | Same reasoning — spacing hardcoded in a component can't be adjusted without a fork, and can't stay consistent with the rest of the system. |
| **No hardcoded shadows** | Shadows are theme-dependent (dark themes need different shadow strategy than light). A hardcoded shadow is wrong in at least one theme by construction. |
| **No hardcoded motion** | Durations/easings hardcoded per-component fragment the motion language across the library and can't be tuned globally (e.g. a "reduce motion globally" toggle). |
| **No hardcoded typography** | Font family/size/weight goes through tokens so a brand swap doesn't require touching component files. |
| **No `::ng-deep`** | Deprecated, breaks style encapsulation in a way that isn't reversible by the consumer, and signals a component/CSS architecture problem that should be fixed at the source instead. |
| **No `!important`** | If a style needs `!important` to win, the specificity architecture is broken — fix the specificity, don't patch over it. |
| **Keep CSS specificity low** | Low-specificity selectors (single class, `:host`, attribute selectors) keep consumer overrides possible without them needing `!important` either. |
| **Use CSS variables for customization** | The only sanctioned customization surface is Tier 3 CSS custom properties — not Sass variables (compile-time, can't be themed at runtime) and not inline styles from the consumer. |
| **Keep implementation details private** | Internal layout mechanics (grid-template columns, flex hacks) stay unexposed — exposing them as if they were public API creates a false customization surface that breaks on the next refactor. |

---

## 7. Public API Guidelines

- **Keep APIs small.** Every `input()`, `output()`, exported directive, and
  injectable service is a permanent commitment — removing or renaming any
  of them is a breaking change. Prefer deriving behavior internally over
  adding a new Input to control it.
- **Prefer composition.** Content-projection slots and marker directives
  (this repo's existing pattern: `ZyrPrefix`, `ZyrSuffix` for
  `ZyraFormField`) scale to consumer needs that weren't anticipated at
  design time. A growing config-object API does not.
- **Avoid breaking changes.** A published Input/Output/selector/token name
  is a contract. If it must change, deprecate first (keep the old API
  working, mark it deprecated in docs and JSDoc, remove on a major version)
  rather than renaming in place.
- **Generic naming.** Name Inputs/Outputs/directives after their role
  (`variant`, `size`, `disabled`) not after their current implementation
  detail — implementation changes shouldn't force an API rename.
- **Framework-quality APIs.** Every public symbol should read as if it
  belongs next to Angular Material's or Angular CDK's own API — consistent
  casing, consistent naming across components (`size` means the same shape
  of value everywhere it appears), and no leaking of internal types into
  public signatures.
- **Services and injection tokens** follow the same minimalism: a service's
  public methods are the API surface, not its internal state; injection
  tokens are named and scoped deliberately (see `DOCUMENT`/`PLATFORM_ID`
  usage patterns already established in this repo for SSR safety).

---

## 8. Accessibility Standards

Every component, before implementation is considered complete, must address:

- **Keyboard support** — every interactive element reachable and operable
  without a mouse; arrow-key/tab semantics matching the component's ARIA
  pattern (e.g. `ZyraRadioGroup`'s arrow-key navigation, `ZyraSelect`'s
  keyboard nav — both already established patterns in this codebase).
- **Focus management** — focus trapping where required (e.g. `ZyraModal`),
  focus restoration on close, visible focus indicators using the shared
  `--zyra-ring` / `*-focus-ring` component tokens — never a suppressed
  outline with no replacement.
- **ARIA** — correct roles, states, and properties for the component's
  actual interaction pattern (`role="status"`, `role="alert"`,
  `role="switch"` — again, already-established patterns here) — not
  decorative ARIA that doesn't match real behavior.
- **Screen readers** — dynamic content changes announced appropriately
  (`aria-live` for toasts/alerts), meaningful accessible names for
  icon-only controls.
- **Contrast** — text/background combinations meet WCAG AA at minimum,
  verified per-theme (a combination that passes in the light theme is not
  guaranteed to pass in the dark, ocean, amber, or rose themes — check all
  five).
- **Reduced motion** — every animation/transition has a
  `@media (prefers-reduced-motion: reduce)` fallback (established pattern:
  the Header's mobile panel/backdrop animations already do this — every
  new animated component follows the same shape).
- **Touch targets** — interactive elements meet a minimum touch target size
  on mobile/tablet layouts, not just desktop mouse-pointer sizing.

---

## 9. Responsive Standards

ZyraUI components must have an explicit, designed answer for each layout
tier — not an assumed desktop-only default with mobile handled as an
afterthought (the exact gap the Header token rework exists to close):

- **Desktop** — the primary, full-featured layout.
- **Tablet** — verify components at intermediate widths, not just the two
  extremes.
- **Mobile** — a deliberate, designed mobile behavior, not a squeezed
  desktop layout.
- **Drawer / Sidebar / Navigation collapse** — components that switch to an
  overlay/drawer pattern on small viewports use the shared, generic
  Drawer + Overlay component-token groups (see [§4](#4-design-token-architecture))
  — never a component-specific reimplementation of "a panel that slides
  over a scrim."
- **Breakpoints** — use the library's shared breakpoint scale consistently;
  a component inventing its own breakpoint value fragments the responsive
  system.
- **Responsive slots** — where desktop and mobile need meaningfully
  different content (not just different layout of the same content),
  prefer separate named slots (e.g. Header's `end` vs `mobile-end`) over
  one slot with CSS tricks to hide/show pieces per breakpoint.
- **Independent desktop/mobile layouts** — a component is allowed to render
  structurally different markup for its mobile state (as the Header does
  with its compact/drawer mode) — the constraint is that both states share
  the same token system, not that they share the same DOM structure.

---

## 10. Testing Standards

Every component ships with:

- **Unit tests** — behavior, Inputs/Outputs, edge cases.
- **Accessibility tests** — keyboard interaction, ARIA attributes present
  and correct, focus behavior.
- **Theme verification** — rendered correctly (no invisible text, no
  broken contrast) across all shipped themes, not just the default.
- **Responsive verification** — behavior checked at desktop, tablet, and
  mobile viewport widths, including any drawer/collapse transition.
- **SSR verification** — component renders without error under
  server-side rendering (critical given the docs site itself is SSR).
- **Regression tests** — for any bug fix, a test that would have caught the
  bug before it shipped (the scrollbar-token collision and the header
  height typo found during the Token Architecture work are exactly the
  class of bug a token-resolution test would catch automatically going
  forward).

---

## 11. Documentation Standards

Every component's doc page requires:

- **API documentation** — every Input/Output/selector, with type and
  default.
- **Token table** — every public Component Token (Tier 3) for that
  component: name, default value, what it controls. Internal (`--zyui-*`)
  props are never listed here.
- **Playground** — a live, interactive example a consumer can manipulate.
- **Examples** — common real-world usage patterns, not just the minimal
  API demo.
- **Accessibility notes** — keyboard shortcuts, ARIA roles used, anything a
  consumer building on top of the component needs to preserve.
- **Theming examples** — at least one concrete token-override snippet.
- **Migration notes** — required whenever a release changes a public API,
  even non-breaking additions worth calling out.

---

## 12. Release Checklist

Before every release:

- [ ] Architecture reviewed (per [§2](#2-development-workflow))
- [ ] Public API reviewed (no unreviewed Input/Output/token additions)
- [ ] Tests passing (unit, accessibility, SSR)
- [ ] All five themes visually verified
- [ ] Responsive behavior verified (desktop/tablet/mobile)
- [ ] Docs updated (API, token table, examples)
- [ ] Playground updated
- [ ] Version bumped per semver (breaking → major, additive → minor, fix → patch)
- [ ] `CHANGELOG.md` updated (per existing `CONTRIBUTING.md` convention)

---

## 13. Code Review Checklist

For reviewers (human or AI) evaluating any PR against this guide:

- [ ] Is the public API minimal — no Input/Output/token that could have
      been avoided?
- [ ] Are all new visual properties backed by Component Tokens, mapped to
      Semantic Tokens (never raw values, never Tier 1/2 tokens consumed
      directly in component styles)?
- [ ] Does any new token name risk colliding with an existing Tier 1/2/3
      name? (The exact bug class found and fixed during the Token
      Architecture work — check for it explicitly.)
- [ ] Is accessibility complete (keyboard, ARIA, focus, contrast, reduced
      motion, touch targets)?
- [ ] Is it SSR-safe (no unguarded `window`/`document`/`localStorage`)?
- [ ] Is responsive behavior designed, not assumed (desktop/tablet/mobile,
      and drawer/overlay reuse where applicable)?
- [ ] Are tests included (unit, accessibility, theme, SSR as applicable)?
- [ ] Are docs (API, token table, playground) updated?
- [ ] Does it follow [§3](#3-component-architecture-rules) and
      [§6](#6-styling-rules) (standalone, OnPush, signals, no `::ng-deep`,
      no `!important`, no hardcoded visual values)?
- [ ] If this changes an existing public API — is it additive/deprecated
      rather than a silent break?

---

## 14. Future Component Checklist

Before implementing any new component, answer every question below —
during Requirements Analysis and Architecture Review (see [§2](#2-development-workflow)),
not retroactively:

- What problem does it solve?
- Does another existing component already solve it (check `CONTRIBUTING.md`'s
  component table before proposing something new)?
- Is the proposed public API minimal?
- Which of its visual properties should become public Component Tokens
  (per [§5](#5-component-token-workflow))?
- Is it reusable outside the specific screen that motivated it?
- Is it composable (slots/directives) rather than configuration-heavy?
- Is its responsive behavior designed for desktop, tablet, and mobile?
- Is it accessible (keyboard, ARIA, focus, contrast) by design, not by
  later audit?
- Is it SSR-safe?
- **Will this architecture still make sense in five years** — at 100+
  components, a theme builder, and brand-customization tooling built on
  top of it? If a shortcut is taken today (e.g. a component-specific token
  where a generic, reusable group would serve better — the exact
  Drawer/Overlay distinction made during the Header rework), that shortcut
  must be named and justified, not silent.

---

## 15. Architecture Decision Records (ADRs)

Major, hard-to-reverse architecture decisions get a written ADR — a short,
permanent record of what was decided and why, so a future contributor
doesn't have to reverse-engineer the reasoning from a diff or reopen a
settled debate.

**When to write one:** any decision that would be expensive to reverse, or
that future contributors are likely to question without the original
context — for example:

- The Token Architecture itself (the 4-tier hierarchy, the public/internal
  namespace split, the Drawer/Overlay reusable-group decision).
- The Header's responsive/drawer architecture.
- A future Sidebar architecture (persistent rail vs. collapsing drawer).
- The theme system (how a new theme is authored, the Tier 1 contract).
- The animation/motion system (the duration/easing scale and when to
  extend it, as happened when `--zyra-duration-moderate` was added rather
  than forcing an existing bucket to fit).

**Format:** short and factual — context (what problem prompted this),
decision (what was chosen), and consequences (what this makes easier,
what it forecloses). Store ADRs alongside the codebase (e.g.
`docs/adr/NNNN-title.md`) so they version with the code they describe.

An ADR is not a full design doc — it's the *why*, preserved, so this guide
and the codebase don't drift apart as the library grows past any one
person's memory of every decision.
