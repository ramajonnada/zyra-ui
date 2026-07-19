import {
    afterNextRender,
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    Directive,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    Injector,
    OnDestroy,
    output,
    PLATFORM_ID,
    signal,
    viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { menu, xmark } from '../../../shared/zyra-icons';
import { lockBodyScroll, unlockBodyScroll } from '../../../internal/body-scroll-lock';

export type HeaderPosition = 'static' | 'sticky' | 'fixed';
export type HeaderVariant = 'contained' | 'full-width';
export type HeaderAlign = 'split' | 'center';
export type HeaderSize = 'sm' | 'md' | 'lg';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

@Directive({ selector: '[zyraHeaderStart]', standalone: true })
export class ZyraHeaderStart {}

@Directive({
    selector: '[zyraHeaderNav]',
    standalone: true,
    host: {
        '[style.display]': "'var(--zyr-header-nav-display, flex)'",
        '[style.align-items]': "'var(--zyr-header-nav-align, center)'",
        '[style.gap]': "'var(--zyr-header-nav-gap, 4px)'",
        '[style.flex-direction]': "'var(--zyr-header-nav-direction, row)'",
        '[style.height]': "'var(--zyr-header-nav-height, auto)'",
    },
})
export class ZyraHeaderNav {}

@Directive({
    selector: '[zyraHeaderEnd]',
    standalone: true,
    host: {
        '[style.display]': "'var(--zyr-header-end-display, flex)'",
        '[style.align-items]': "'var(--zyr-header-end-align, center)'",
        '[style.gap]': "'var(--zyr-header-end-gap, 10px)'",
    },
})
export class ZyraHeaderEnd {}

@Directive({
    selector: '[zyraHeaderMobileEnd]',
    standalone: true,
    host: {
        '[style.display]': "'var(--zyr-header-mobile-end-display, grid)'",
        '[style.gap]': "'var(--zyr-header-mobile-end-gap, 8px)'",
    },
})
export class ZyraHeaderMobileEnd {}

/**
 * Independent mobile-drawer navigation slot. Projects into the drawer's
 * Navigation section — never falls back to `[zyraHeaderNav]`'s content.
 * See `zyra-header`'s content-mode branch for how presence of this
 * directive selects independent drawer content over the legacy behavior.
 */
@Directive({
    selector: '[zyraHeaderMobileNav]',
    standalone: true,
    host: {
        '[style.display]': "'var(--zyui-header-mobile-nav-display, flex)'",
        '[style.flex-direction]': "'var(--zyui-header-mobile-nav-direction, column)'",
        '[style.align-items]': "'var(--zyui-header-mobile-nav-align, stretch)'",
        '[style.gap]': "'var(--zyui-header-mobile-nav-gap, 4px)'",
    },
})
export class ZyraHeaderMobileNav {}

/** Independent mobile-drawer footer slot (version info, links, branding). */
@Directive({
    selector: '[zyraHeaderMobileFooter]',
    standalone: true,
    host: {
        '[style.display]': "'var(--zyui-header-mobile-footer-display, grid)'",
        '[style.gap]': "'var(--zyui-header-mobile-footer-gap, 8px)'",
    },
})
export class ZyraHeaderMobileFooter {}

@Component({
    selector: 'zyra-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent, NgTemplateOutlet],
    templateUrl: './zyra-header.html',
    styleUrl: './zyra-header.scss',
    host: {
        '[class]': 'hostClass()',
        '[attr.aria-label]': 'ariaLabel()',
    },
})
export class ZyraHeader implements AfterViewInit, OnDestroy {
    // ── Inputs ────────────────────────────────────────────────
    position = input<HeaderPosition>('static');
    variant = input<HeaderVariant>('contained');
    align = input<HeaderAlign>('split');
    size = input<HeaderSize>('md');
    transparent = input(false, { transform: booleanAttribute });
    elevateOnScroll = input(true, { transform: booleanAttribute });
    scrollThreshold = input(12);
    mobileBreakpoint = input(768);
    ariaLabel = input<string | null>(null, { alias: 'aria-label' });

    // ── Outputs ───────────────────────────────────────────────
    mobileOpenChange = output<boolean>();
    scrolledChange = output<boolean>();

    // ── Drawer controller (shared, generic — not header-specific;
    //    this is the seam a future reusable sliding-surface primitive
    //    would lift out wholesale) ────────────────────────────────
    readonly mobileOpen = signal(false);
    private readonly _legacySurface = viewChild<ElementRef<HTMLElement>>('legacySurface');
    private readonly _independentSurface = viewChild<ElementRef<HTMLElement>>('independentSurface');
    private readonly _burgerButton = viewChild<ElementRef<HTMLButtonElement>>('burgerButton');
    private _skipInitialFocusEffect = true;
    private _hasScrollLock = false;

    // ── Layout API: independent mobile-content presence (drives the
    //    legacy vs. independent content-mode branch — see zyra-header.html) ──
    readonly mobileNavRef = contentChild(ZyraHeaderMobileNav);
    readonly mobileContentRef = contentChild(ZyraHeaderMobileEnd);
    readonly mobileFooterRef = contentChild(ZyraHeaderMobileFooter);

    // ── State ─────────────────────────────────────────────────
    readonly isScrolled = signal(false);
    readonly isCompact = signal(false);

    readonly icons = { menu, xmark };

    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly _injector = inject(Injector);
    private readonly _document = inject(DOCUMENT);

    readonly hostClass = computed(() => {
        const classes = [
            'zyr-header',
            `zyr-header--${this.position()}`,
            `zyr-header--${this.variant()}`,
            `zyr-header--${this.align()}`,
            `zyr-header--${this.size()}`,
        ];
        if (this.transparent()) classes.push('zyr-header--transparent');
        if (this.isScrolled()) classes.push('zyr-header--scrolled');
        if (this.mobileOpen()) classes.push('zyr-header--mobile-open');
        if (this.isCompact()) classes.push('zyr-header--compact');
        return classes.join(' ');
    });

    readonly menuLabel = computed(() =>
        this.mobileOpen() ? 'Close navigation menu' : 'Open navigation menu',
    );

    constructor() {
        if (this._isBrowser) {
            effect((onCleanup) => {
                const mediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpoint()}px)`);
                this.isCompact.set(mediaQuery.matches);

                const onChange = (e: MediaQueryListEvent) => {
                    this.isCompact.set(e.matches);
                    if (!e.matches) this.closeMobile();
                };
                mediaQuery.addEventListener('change', onChange);
                onCleanup(() => mediaQuery.removeEventListener('change', onChange));
            });

            // Drawer controller: additive focus management (does not alter
            // openMobile()/closeMobile()/toggleMobile() or Escape handling).
            effect(() => {
                const open = this.mobileOpen();
                if (this._skipInitialFocusEffect) {
                    this._skipInitialFocusEffect = false;
                    return;
                }
                if (open) {
                    afterNextRender(() => this.focusFirstInSurface(), { injector: this._injector });
                } else if (this.isCompact()) {
                    // Only restore focus to the burger if it's still visible —
                    // closeMobile() also fires when a resize crosses the
                    // breakpoint (see the effect above), at which point the
                    // burger is hidden and .focus() on it would just strand
                    // focus nowhere useful.
                    this._burgerButton()?.nativeElement.focus();
                }
            });

            // Lock body scroll while the drawer is open — otherwise the page
            // behind it keeps scrolling, which also re-triggers the scroll
            // listener and can shift the fixed backdrop/drawer mid-gesture.
            // Reference-counted via the shared lock so it coexists correctly
            // with zyra-modal/zyra-drawer if one happens to be open too.
            effect(() => {
                if (this.mobileOpen()) {
                    if (!this._hasScrollLock) {
                        lockBodyScroll(this._document);
                        this._hasScrollLock = true;
                    }
                } else if (this._hasScrollLock) {
                    unlockBodyScroll(this._document);
                    this._hasScrollLock = false;
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this.updateScrolledState();
    }

    ngOnDestroy(): void {
        if (this._hasScrollLock) {
            unlockBodyScroll(this._document);
            this._hasScrollLock = false;
        }
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.updateScrolledState();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.closeMobile();
    }

    // ── Focus trap ────────────────────────────────────────────
    // Same pattern as zyra-modal/zyra-drawer: while the drawer is open, Tab
    // cycles only among its own focusable elements instead of escaping into
    // the (visually hidden-behind) page content.
    @HostListener('keydown', ['$event'])
    onDrawerKeydown(event: KeyboardEvent): void {
        if (!this.mobileOpen() || event.key !== 'Tab') return;
        const surface = this.mobileNavRef()
            ? this._independentSurface()?.nativeElement
            : this._legacySurface()?.nativeElement;
        if (!surface) return;

        const focusable = Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = this._document.activeElement as HTMLElement;

        if (event.shiftKey && (active === first || active === surface)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (active === last || active === surface)) {
            event.preventDefault();
            first.focus();
        }
    }

    toggleMobile(): void {
        if (this.mobileOpen()) {
            this.closeMobile();
        } else {
            this.openMobile();
        }
    }

    openMobile(): void {
        if (this.mobileOpen()) return;
        this.mobileOpen.set(true);
        this.mobileOpenChange.emit(true);
    }

    closeMobile(): void {
        if (!this.mobileOpen()) return;
        this.mobileOpen.set(false);
        this.mobileOpenChange.emit(false);
    }

    private updateScrolledState(): void {
        if (!this._isBrowser || !this.elevateOnScroll()) return;
        const scrolled = window.scrollY > this.scrollThreshold();
        if (scrolled !== this.isScrolled()) {
            this.isScrolled.set(scrolled);
            this.scrolledChange.emit(scrolled);
        }
    }

    private focusFirstInSurface(): void {
        const surface = this.mobileNavRef()
            ? this._independentSurface()?.nativeElement
            : this._legacySurface()?.nativeElement;
        surface?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }
}
