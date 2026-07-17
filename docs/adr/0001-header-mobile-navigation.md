# ADR 0001: Independent mobile navigation content for `zyra-header`

## Status

Accepted.

## Context

`zyra-header` originally exposed a single content-projection slot for
navigation (`zyraHeaderNav`), rendered inside `<nav class="zyr-header__nav">`.
In compact/mobile mode, CSS repurposed that same element into the sliding
drawer — so the mobile drawer's navigation content was always, structurally,
whatever was projected as the desktop nav, plus one extra slot
(`zyraHeaderMobileEnd`) for mobile-only additions.

In most real applications, desktop navigation (a handful of top-level links)
and mobile navigation (fuller nav + secondary links + account/CTA actions +
footer metadata) are legitimately different content. The prior single-slot
design couldn't express that — consumers had no way to give the drawer
different navigation than desktop, and no dedicated footer section.

## Alternatives considered

1. **A single slot with app-provided responsive logic inside the projected
   content** (e.g. consumers use `*ngIf`/CSS to show/hide different links
   within one projected block). Rejected: pushes complexity onto every
   consumer instead of solving it once in the library, and doesn't compose
   with the header's own `isCompact`/`mobileOpen` state without consumers
   reaching into the component's internals.
2. **A fully separate `ZyraMobileHeader` component.** Rejected: duplicates
   the header's existing cross-cutting behavior (toggle state, Escape
   handling, scroll elevation, overlay, focus management) in a second
   component, and is a heavier migration path for existing consumers than
   an additive slot.

## Decision

Add two new marker directives — `zyraHeaderMobileNav` and
`zyraHeaderMobileFooter` — and reuse the existing `zyraHeaderMobileEnd` for
a generic "Content" section, giving the mobile drawer three independent,
optional sections: Navigation, Content, Footer.

The component branches its rendering on a single condition — whether
`zyraHeaderMobileNav` was projected at all:

- **Legacy content mode** (no `zyraHeaderMobileNav` projected): renders
  exactly the original markup, unchanged. The desktop nav element continues
  to double as the drawer in compact mode. Zero risk, zero migration, for
  every existing consumer.
- **Independent content mode** (`zyraHeaderMobileNav` projected): renders a
  separate, dedicated drawer (internally `.zyr-drawer`) with its own three
  sections, while the desktop nav becomes desktop-only (hidden, not
  repurposed, in compact mode).

No compound conditions combine content-mode detection with responsive state
— responsiveness stays purely CSS-driven in both modes; only *which content
set the drawer renders* is decided by the presence check.

The drawer's sliding-panel mechanics (`position: fixed`, transform,
transition, background/border/shadow) are extracted into one shared
internal class (`.zyr-drawer-surface`) applied to both the legacy-mode
nav-as-drawer and the new dedicated drawer element — a single source of
truth for that behavior rather than two parallel implementations.

The drawer's internal class names (`.zyr-drawer`, `.zyr-drawer-surface`,
`.zyr-drawer__nav`, `.zyr-drawer__content`, `.zyr-drawer__footer`) are
deliberately **not** `.zyr-header__drawer-*` — chosen so that if a future
reusable sliding-surface primitive is built (for a Sidebar-as-drawer,
Filter Drawer, Settings Drawer, or Command Palette), the existing,
already-generic `zyra-drawer` component (`components/overlays/zyra-drawer`)
or a new primitive could adopt a compatible shape without a header-specific
rename. This implementation does **not** create or modify that component —
`zyra-drawer`'s current shape (backdrop-mounted, title bar, focus-trapping
dialog) doesn't fit a persistent navigation drawer's mount/animation model,
and adopting it here would have meant redesigning the header's existing
slide animation and SSR/hydration behavior, which was out of scope.

Two internal implementation issues were found and fixed during
implementation, not part of the original design:

- Angular resolves `<ng-content select="...">` distribution once per
  compiled template, not per active structural branch — so an early draft
  with the same selector's `<ng-content>` appearing in both the legacy and
  independent branches silently lost content (the first, inactive
  occurrence claimed it). Fixed by using exactly one `<ng-content>` per
  selector, sharing `zyraHeaderMobileEnd`'s slot between modes via
  `ngTemplateOutlet`.
- Wiring the new `--zyra-overlay-z-index` token onto both the drawer nav
  and the backdrop would have equalized their stacking order (breaking
  "drawer above scrim"); resolved by giving the drawer `var(--zyra-z-modal)`,
  the next step up in the existing Tier 0 z-index scale.

## Consequences

- Existing consumers require zero code changes — the marketing site's own
  header and the component playground's default example both continue to
  render identically.
- `.zyr-drawer*` class names become the informal convention any future
  sliding-surface UI in the library should either reuse or deliberately
  diverge from with a documented reason — they are internal implementation
  detail, not a public contract, and may change without notice.
- A future Navigation Rail, Sidebar-as-drawer, or Command Palette can adopt
  the same "shared generic surface + independent content sections" shape
  demonstrated here without redesigning it from scratch.
- The three-section (Navigation / Content / Footer) drawer shape, and the
  "one marker directive + one content query + one `<ng-content>`" recipe for
  adding a section, is the template for extending this or any similarly
  structured component later (e.g. a future `zyraHeaderMobileSearch` slot).
