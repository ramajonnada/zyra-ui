import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    effect,
    HostListener,
    inject,
    input,
    OnDestroy,
    output,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { caretLeft, caretRight } from '../../../shared/zyra-icons';
import { ZyraCarouselSlide } from './zyra-carousel-slide';

@Component({
    selector: 'zyra-carousel',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    templateUrl: './zyra-carousel.html',
    styleUrl: './zyra-carousel.scss',
})
export class ZyraCarousel implements OnDestroy {
    // ── Inputs ────────────────────────────────────────────────
    loop = input(true, { transform: booleanAttribute });
    autoplay = input(false, { transform: booleanAttribute });
    autoplayInterval = input<number>(5000);
    showArrows = input(true, { transform: booleanAttribute });
    showDots = input(true, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    indexChange = output<number>();

    // ── State ─────────────────────────────────────────────────
    readonly activeIndex = signal(0);
    readonly _slides = contentChildren(ZyraCarouselSlide);
    readonly slideIndexes = computed(() => this._slides().map((_, i) => i));

    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private _autoplayTimer: ReturnType<typeof setInterval> | null = null;

    // ── Computed ──────────────────────────────────────────────
    readonly trackTransform = computed(() => `translateX(-${this.activeIndex() * 100}%)`);
    readonly canGoPrev = computed(() => this.loop() || this.activeIndex() > 0);
    readonly canGoNext = computed(
        () => this.loop() || this.activeIndex() < this._slides().length - 1,
    );

    readonly icons = { caretLeft, caretRight };

    constructor() {
        effect(() => {
            // Track autoplay/autoplayInterval so the timer restarts when either changes.
            this.autoplay();
            this.autoplayInterval();
            this._syncAutoplay();
        });
    }

    ngOnDestroy(): void {
        this._stopAutoplay();
    }

    // ── Navigation ────────────────────────────────────────────
    next(): void {
        const count = this._slides().length;
        if (count === 0) return;
        const idx = this.activeIndex();
        if (idx >= count - 1) {
            if (this.loop()) this.goTo(0);
            return;
        }
        this.goTo(idx + 1);
    }

    prev(): void {
        const count = this._slides().length;
        if (count === 0) return;
        const idx = this.activeIndex();
        if (idx <= 0) {
            if (this.loop()) this.goTo(count - 1);
            return;
        }
        this.goTo(idx - 1);
    }

    goTo(index: number): void {
        const count = this._slides().length;
        if (count === 0 || index < 0 || index >= count) return;
        this.activeIndex.set(index);
        this.indexChange.emit(index);
    }

    // ── Autoplay ──────────────────────────────────────────────
    private _syncAutoplay(): void {
        if (!this._isBrowser) return;
        this._stopAutoplay();
        if (!this.autoplay()) return;
        this._autoplayTimer = setInterval(() => this.next(), this.autoplayInterval());
    }

    private _stopAutoplay(): void {
        if (this._autoplayTimer !== null) {
            clearInterval(this._autoplayTimer);
            this._autoplayTimer = null;
        }
    }

    pauseAutoplay(): void {
        this._stopAutoplay();
    }

    resumeAutoplay(): void {
        this._syncAutoplay();
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.prev();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.next();
        }
    }
}
