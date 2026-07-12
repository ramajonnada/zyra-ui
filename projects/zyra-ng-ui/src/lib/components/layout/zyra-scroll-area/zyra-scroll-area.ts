import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    booleanAttribute,
    computed,
    input,
    output,
    viewChild,
} from '@angular/core';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollBehaviorOption = 'auto' | 'smooth';

export interface ScrollAreaScrollEvent {
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
}

const ARROW_STEP = 40;
const PAGE_FRACTION = 0.9;

@Component({
    selector: 'zyra-scroll-area',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-scroll-area.html',
    styleUrl: './zyra-scroll-area.scss',
})
export class ZyraScrollArea {
    // ── Inputs ────────────────────────────────────────────────
    maxHeight = input<string>('300px');
    orientation = input<ScrollAreaOrientation>('vertical');
    smoothScroll = input(false, { transform: booleanAttribute });
    autoHideScrollbar = input(false, { transform: booleanAttribute });
    showScrollShadows = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    scrolled = output<ScrollAreaScrollEvent>();

    // ── View ──────────────────────────────────────────────────
    private viewport = viewChild.required<ElementRef<HTMLDivElement>>('viewport');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const parts = ['zyr-scroll-area', `zyr-scroll-area--${this.orientation()}`];
        if (this.autoHideScrollbar()) parts.push('zyr-scroll-area--auto-hide');
        if (this.showScrollShadows()) parts.push('zyr-scroll-area--shadows');
        return parts.join(' ');
    });

    hostStyle = computed(() => ({
        'max-height': this.maxHeight(),
        'scroll-behavior': this.smoothScroll() ? 'smooth' : 'auto',
    }));

    // ── Scroll events ─────────────────────────────────────────
    onScroll(event: Event): void {
        const el = event.target as HTMLDivElement;
        this.scrolled.emit({
            scrollTop: el.scrollTop,
            scrollLeft: el.scrollLeft,
            scrollHeight: el.scrollHeight,
            scrollWidth: el.scrollWidth,
            clientHeight: el.clientHeight,
            clientWidth: el.clientWidth,
        });
    }

    // ── Public scroll API ─────────────────────────────────────
    /** Scrolls to the top edge of the viewport. */
    scrollToTop(behavior: ScrollBehaviorOption = this.smoothScroll() ? 'smooth' : 'auto'): void {
        this.viewport().nativeElement.scrollTo({ top: 0, behavior });
    }

    /** Scrolls to the bottom edge of the viewport. */
    scrollToBottom(behavior: ScrollBehaviorOption = this.smoothScroll() ? 'smooth' : 'auto'): void {
        const el = this.viewport().nativeElement;
        el.scrollTo({ top: el.scrollHeight, behavior });
    }

    /** Scrolls a descendant element (or CSS selector) into view within this viewport. */
    scrollToElement(target: HTMLElement | string, behavior: ScrollBehaviorOption = this.smoothScroll() ? 'smooth' : 'auto'): void {
        const el = this.viewport().nativeElement;
        const targetEl = typeof target === 'string' ? el.querySelector<HTMLElement>(target) : target;
        targetEl?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });
    }

    // ── Keyboard support ──────────────────────────────────────
    onKeydown(event: KeyboardEvent): void {
        const el = this.viewport().nativeElement;
        const vertical = this.orientation() !== 'horizontal';
        const horizontal = this.orientation() !== 'vertical';

        switch (event.key) {
            case 'ArrowDown':
                if (!vertical) return;
                el.scrollTop += ARROW_STEP;
                break;
            case 'ArrowUp':
                if (!vertical) return;
                el.scrollTop -= ARROW_STEP;
                break;
            case 'ArrowRight':
                if (!horizontal) return;
                el.scrollLeft += ARROW_STEP;
                break;
            case 'ArrowLeft':
                if (!horizontal) return;
                el.scrollLeft -= ARROW_STEP;
                break;
            case 'PageDown':
                if (!vertical) return;
                el.scrollTop += el.clientHeight * PAGE_FRACTION;
                break;
            case 'PageUp':
                if (!vertical) return;
                el.scrollTop -= el.clientHeight * PAGE_FRACTION;
                break;
            case 'Home':
                if (vertical) el.scrollTop = 0;
                if (horizontal) el.scrollLeft = 0;
                break;
            case 'End':
                if (vertical) el.scrollTop = el.scrollHeight;
                if (horizontal) el.scrollLeft = el.scrollWidth;
                break;
            default:
                return;
        }
        event.preventDefault();
    }
}
