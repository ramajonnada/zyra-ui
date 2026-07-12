import {
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    Directive,
    effect,
    HostListener,
    inject,
    input,
    output,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { menu, xmark } from '../../../shared/zyra-icons';

export type HeaderPosition = 'static' | 'sticky' | 'fixed';
export type HeaderVariant = 'contained' | 'full-width';
export type HeaderAlign = 'split' | 'center';
export type HeaderSize = 'sm' | 'md' | 'lg';

@Directive({ selector: '[zyraHeaderStart]', standalone: true })
export class ZyraHeaderStart {}

@Directive({ selector: '[zyraHeaderNav]', standalone: true })
export class ZyraHeaderNav {}

@Directive({ selector: '[zyraHeaderEnd]', standalone: true })
export class ZyraHeaderEnd {}

@Directive({ selector: '[zyraHeaderMobileEnd]', standalone: true })
export class ZyraHeaderMobileEnd {}

@Component({
    selector: 'zyra-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    templateUrl: './zyra-header.html',
    styleUrl: './zyra-header.scss',
    host: {
        '[class]': 'hostClass()',
        '[attr.aria-label]': 'ariaLabel()',
    },
})
export class ZyraHeader implements AfterViewInit {
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

    // ── State ─────────────────────────────────────────────────
    readonly isScrolled = signal(false);
    readonly mobileOpen = signal(false);
    readonly isCompact = signal(false);

    readonly icons = { menu, xmark };

    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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
        }
    }

    ngAfterViewInit(): void {
        this.updateScrolledState();
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.updateScrolledState();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.closeMobile();
    }

    toggleMobile(): void {
        this.mobileOpen() ? this.closeMobile() : this.openMobile();
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
}
