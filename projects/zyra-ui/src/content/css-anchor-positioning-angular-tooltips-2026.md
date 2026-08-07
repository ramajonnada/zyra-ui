---
title: "CSS Anchor Positioning for Angular Tooltips"
description: "Learn how to use the CSS Anchor Positioning API in Angular to build tooltips and popovers that auto-position without any JavaScript positioning library."
category:
    - "Angular 21"
tags:
    - "css"
    - "angular"
    - "tooltips"
    - "popovers"
    - "web apis"
keywords:
    - "CSS anchor positioning Angular"
    - "Angular tooltip without JavaScript"
    - "CSS anchor() function Angular"
    - "popover API Angular component"
    - "position-anchor CSS Angular"
date: "2026-07-28T10:00:00.000Z"
slug: "css-anchor-positioning-angular-tooltips-2026"
---

# CSS Anchor Positioning for Angular Tooltips

> **TL;DR:** The CSS Anchor Positioning API is a browser-native way to tether a floating element (tooltip, dropdown, popover) to any anchor element purely in CSS — no JavaScript positioning libraries, no scroll listeners, no `getBoundingClientRect()`. As of 2026-08-06, the MDN browser-compat data for `position-anchor`, `anchor()`, and `@position-try` shows support only in recent browser releases, so a feature-detected fallback remains important. This post shows you how to wire it up in an Angular standalone component with the Popover API, including a fallback path for browsers without both Popover and anchor-positioning support, and how the `@position-try` rule gives you automatic flip/fallback behavior where it is supported.

If you have ever built a tooltip component in Angular, you know the routine: import a positioning library (Floating UI, Popper.js, CDK Overlay), measure the anchor element in `afterRenderEffect()`, calculate offsets, listen to scroll and resize events, and keep everything in sync with signals. It works, but it is a lot of moving parts for what is conceptually a simple layout problem.

The CSS Anchor Positioning API changes this. It is a browser-native way to say "position this element relative to that element" — and it handles scroll, overflow, and flip fallbacks on its own.

---

## The Problem: JavaScript Positioning Is Surprisingly Hard

The classic approach to a tooltip in Angular looks roughly like this: create a signal for position, read the anchor's `getBoundingClientRect()` inside [`afterRenderEffect()`](/blog/angular-afterrendereffect-dom-safe-side-effects-2026), compute `top` and `left`, apply them via host bindings, and add a `ResizeObserver` so the tooltip stays in place when the page reflows.

```typescript
// The old way — a lot of ceremony for a tooltip
@Component({
  selector: 'app-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tooltip" [style.top.px]="top()" [style.left.px]="left()">
      {{ text() }}
    </div>
  `,
})
export class TooltipComponent {
  text = input.required<string>();
  anchorEl = input.required<HTMLElement>();

  private top = signal(0);
  private left = signal(0);

  constructor() {
    afterRenderEffect(() => {
      const rect = this.anchorEl().getBoundingClientRect();
      this.top.set(rect.bottom + window.scrollY + 8);
      this.left.set(rect.left + window.scrollX);
    });
  }
}
```

This works, but it misses scroll updates, requires cleanup, and breaks if the anchor moves. The CSS Anchor Positioning API replaces all of this with a few lines of CSS.

---

## The New Concept: CSS Anchor Positioning

The API has three core pieces:

**`anchor-name`** — assigned to the trigger element, gives it a name the browser can reference.

**`position-anchor`** — assigned to the floating element, links it to a named anchor.

**`anchor()` function** — used in `top`, `left`, `right`, `bottom`, and `inset` properties to position the floating element relative to the anchor's edges.

```css
/* The trigger */
.tooltip-trigger {
  anchor-name: --my-tooltip;
}

/* The floating tooltip */
.tooltip {
  position: absolute;
  position-anchor: --my-tooltip;

  /* Place the tooltip's top edge at the anchor's bottom edge */
  top: anchor(bottom);
  /* Center the tooltip horizontally over the anchor */
  left: anchor(center);
  translate: -50% 0;
  margin-top: 8px;
}
```

That is it. The browser handles all the math. The tooltip tracks the anchor through scrolls, resizes, and layout shifts without a single line of JavaScript.

The `@position-try` rule adds automatic flip fallbacks — if the tooltip overflows the viewport below the anchor, the browser tries an alternative placement:

```css
@position-try --flip-above {
  top: auto;
  bottom: anchor(top);
  margin-top: 0;
  margin-bottom: 8px;
}

.tooltip {
  position: absolute;
  position-anchor: --my-tooltip;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0;
  margin-top: 8px;

  /* Try flipping above if there is no room below */
  position-try-fallbacks: --flip-above;
}
```

---

## Building a Reusable Angular Tooltip Component

Here is a complete, production-ready tooltip directive that pairs CSS Anchor Positioning with the Popover API. The Popover API ensures the tooltip renders in the top layer (above all z-index stacking contexts) without any portal or CDK Overlay setup.

```typescript
// tooltip.directive.ts
import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '[attr.aria-describedby]': 'tooltipId',
  },
})
export class TooltipDirective implements OnInit, OnDestroy {
  appTooltip = input.required<string>();

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  tooltipId = '';
  private anchorName = '';
  private tooltipEl: HTMLElement | null = null;
  private supportsPopover = false;
  private supportsAnchorPositioning = false;

  constructor() {
    // React to appTooltip() changing after the initial render — without
    // this, the tooltip element's text is set once in createTooltip() and
    // then never updates if the host rebinds the input to a new string.
    effect(() => {
      const text = this.appTooltip();
      if (this.tooltipEl) {
        this.tooltipEl.textContent = text;
      }
    });

    // Building the tooltip touches document.body directly, so it has to
    // happen after the app has finished rendering and hydrating on the
    // client — running it any earlier (e.g. straight out of ngOnInit) can
    // execute before hydration completes and produce a mismatch.
    // afterNextRender() only ever fires in the browser, once, after that
    // point, so the isBrowser guard below is just defense in depth.
    afterNextRender(() => {
      if (!this.isBrowser) return;
      this.createTooltip();
    });
  }

  ngOnInit(): void {
    // Tooltips are a browser-only progressive enhancement — document.body,
    // the Popover API, and the random ID below have no meaningful
    // server-side equivalent, so skip all of this during SSR.
    if (!this.isBrowser) return;
  }

  private createTooltip(): void {
    if (!this.tooltipId) {
      this.tooltipId = `tooltip-${Math.random().toString(36).slice(2)}`;
      this.anchorName = `--anchor-${this.tooltipId}`;
    }

    // Assign anchor name to the host element. 'anchor-name' is a dash-cased
    // CSS property, so it must go through Renderer2's DashCase flag —
    // without it, Angular sets `style['anchor-name']` directly, which the
    // CSSOM silently ignores instead of writing the custom property.
    this.renderer.setStyle(
      this.el.nativeElement,
      'anchor-name',
      this.anchorName,
      RendererStyleFlags2.DashCase
    );

    // Create the tooltip element
    const tip = this.renderer.createElement('div') as HTMLElement;
    // Feature-detect both the Popover API and CSS Anchor Positioning before
    // relying on them — without anchor positioning support we fall back to
    // the simple show/hide path instead of opening an unpositioned tooltip.
    this.supportsPopover = 'showPopover' in tip;
    this.supportsAnchorPositioning = typeof CSS !== 'undefined' && 'supports' in CSS
      ? CSS.supports('anchor-name: --x') && CSS.supports('position-anchor: --x')
      : false;
    this.renderer.setAttribute(tip, 'id', this.tooltipId);
    this.renderer.setAttribute(tip, 'role', 'tooltip');
    if (this.supportsPopover && this.supportsAnchorPositioning) {
      this.renderer.setAttribute(tip, 'popover', 'manual');
    } else {
      // Non-anchor fallback: the element has no built-in hidden state to
      // rely on, so start it hidden explicitly. show()/hide() below toggle
      // both `display` and `opacity` in response to hover/focus.
      this.renderer.setStyle(tip, 'display', 'none');
      this.renderer.setStyle(tip, 'opacity', '0');
    }
    this.renderer.addClass(tip, 'zyr-tooltip');
    if (this.supportsPopover && this.supportsAnchorPositioning) {
      // 'position-anchor' is also dash-cased — same DashCase requirement as
      // 'anchor-name' above.
      this.renderer.setStyle(
        tip,
        'position-anchor',
        this.anchorName,
        RendererStyleFlags2.DashCase
      );
    }
    tip.textContent = this.appTooltip();

    this.renderer.appendChild(document.body, tip);
    this.tooltipEl = tip;
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  show(): void {
    if (!this.tooltipEl) return;
    if (this.supportsPopover && this.supportsAnchorPositioning) {
      // showPopover() throws InvalidStateError if the popover is already
      // showing, so guard on its actual state first.
      if (!this.tooltipEl.matches(':popover-open')) {
        this.tooltipEl.showPopover();
      }
    } else {
      this.renderer.setStyle(this.tooltipEl, 'display', 'block');
      this.renderer.setStyle(this.tooltipEl, 'opacity', '1');
    }
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide(): void {
    if (!this.tooltipEl) return;
    if (this.supportsPopover && this.supportsAnchorPositioning) {
      // hidePopover() throws InvalidStateError if the popover is already
      // hidden, so guard on its actual state first.
      if (this.tooltipEl.matches(':popover-open')) {
        this.tooltipEl.hidePopover();
      }
    } else {
      this.renderer.setStyle(this.tooltipEl, 'display', 'none');
      this.renderer.setStyle(this.tooltipEl, 'opacity', '0');
    }
  }

  // popover="manual" opts out of the browser's built-in light-dismiss
  // behavior, so Escape and outside clicks have to be wired up by hand —
  // unlike popover="auto", nothing dismisses a manual popover for you.
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.hide();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const host = this.el.nativeElement;
    if (this.tooltipEl && !this.tooltipEl.contains(target) && !host.contains(target)) {
      this.hide();
    }
  }

  ngOnDestroy(): void {
    this.tooltipEl?.remove();
  }
}
```

The corresponding styles go in your global stylesheet or component host styles:

```scss
.zyr-tooltip {
  /* Popover reset */
  margin: 0;
  padding: 6px 10px;
  border: none;

  /* Positioning — position-anchor is set as an inline style per instance by the directive */
  position: absolute;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0;
  margin-top: 8px;

  /* Flip above if clipped */
  position-try-fallbacks: --tooltip-above;

  /* Appearance */
  background: var(--zyra-color-foreground);
  color: var(--zyra-color-background);
  border-radius: var(--zyra-radius-sm);
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;

  /* Popover animation */
  opacity: 0;
  transition: opacity 0.15s ease;

  &:popover-open {
    opacity: 1;
  }
}

@position-try --tooltip-above {
  top: auto;
  bottom: anchor(top);
  margin-top: 0;
  margin-bottom: 8px;
}
```

Using the directive in a template is clean:

```html
<button [appTooltip]="'Copy to clipboard'" (click)="copy()">
  Copy
</button>
```

No wrapper components, no z-index wars, no scroll listeners. The browser positions the tooltip, keeps it in the top layer via the Popover API, and flips it above the trigger automatically when it would overflow the bottom of the viewport.

---

## The New Tool: Floating UI (Still Worth Knowing)

Even with native anchor positioning, **Floating UI** (`@floating-ui/dom`) remains the go-to library when you need to support environments where the CSS API is not available yet, or when you need fine-grained control over middleware (arrow positioning, virtual elements, shift/prevent-overflow). It is worth knowing both approaches.

```bash
npm install @floating-ui/dom
```

Floating UI works well as a signal-driven Angular service for cases the CSS API does not cover:

```typescript
// floating.service.ts
import { Injectable, signal } from '@angular/core';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

@Injectable({ providedIn: 'root' })
export class FloatingService {
  async position(anchor: HTMLElement, floating: HTMLElement) {
    const { x, y } = await computePosition(anchor, floating, {
      placement: 'bottom',
      middleware: [offset(8), flip(), shift({ padding: 8 })],
    });
    return { x, y };
  }
}
```

For modern projects targeting evergreen browsers, though, CSS Anchor Positioning is the better default — zero runtime cost, native performance, and no library to keep updated.

---

## Browser Support in 2026

The [MDN CSS Anchor Positioning documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) covers the full specification including `@position-try`. As of 2026-08-06, the MDN browser-compat data for `position-anchor`, `anchor()`, and `@position-try` is the most reliable dated reference for real support across current browser releases. The `@position-try` rule and `position-try-fallbacks` are part of the same spec and share the same support matrix.

If you still need IE or older Safari support, feature-detect with `@supports (anchor-name: --x)` and fall back to Floating UI. For most Angular applications targeting modern browsers, you can use the API unconditionally.

---

## Wrapping up

CSS Anchor Positioning removes the biggest source of complexity in floating UI components — the JavaScript layer that ties a positioned element to its trigger. Paired with the Popover API, you get top-layer rendering, keyboard dismissal, and automatic flip fallbacks with almost no code. Try dropping the directive above into your next Angular project and removing whatever positioning library you are currently using — the diff will be satisfying. Pair it with [CSS @layer](/blog/css-layer-angular-component-library-2026) and [Container Queries](/blog/container-queries-angular-component-library-2026) for a fully modern CSS stack in your Angular library.

---

## Frequently asked questions

### Does CSS Anchor Positioning work with Angular's OnPush change detection?
Yes, because anchor positioning is entirely in CSS — the browser positions the floating element without triggering Angular's change detection at all. The directive only calls `showPopover()` and `hidePopover()` on the native DOM element, which are not change-detection events. OnPush components that host the directive work without any manual `markForCheck()` calls.

### Can I use CSS Anchor Positioning with Angular CDK Overlay?
You can use one or the other, but not both for the same element — CDK Overlay manages `position: fixed` and top/left offsets through JavaScript, which would conflict with anchor positioning's own layout. If you migrate to anchor positioning, you can remove the CDK Overlay dependency for tooltip and simple popover use cases. For complex cases like virtual scrolling or modals, CDK Overlay still makes sense.

### What happens in browsers that do not support `anchor-name` yet?
Wrap your anchor-positioning styles in `@supports (anchor-name: --x) { ... }`. In the fallback branch you can apply a basic `position: fixed` style or import Floating UI only when the feature is absent. Because support still varies by browser release, keep the fallback path for production work even if the latest desktop browser versions support the API.

### Is the Popover API required for anchor positioning?
No. The `popover` attribute and anchor positioning are independent browser features that pair well together but do not depend on each other. You can use anchor positioning on any `position: absolute` or `position: fixed` element without using `popover`. The Popover API is recommended for tooltips because it renders in the top layer, avoiding z-index issues, but the positioning itself works regardless.

---

**Related reading:**
- [afterRenderEffect() in Angular 21: DOM-Safe Reactive Side Effects](/blog/angular-afterrendereffect-dom-safe-side-effects-2026)
- [CSS @layer in Angular Component Libraries: Take Control of the Cascade](/blog/css-layer-angular-component-library-2026)
- [Container Queries in Angular: Build Truly Responsive Components](/blog/container-queries-angular-component-library-2026)
- [Angular Signals Explained: Signals, computed(), and Signal Forms](/blog/angular-21-signals-explained-signals-signal-forms)
- [MDN CSS Anchor Positioning documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
