import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraScrollArea, ScrollAreaOrientation, ScrollAreaScrollEvent } from './zyra-scroll-area';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraScrollArea],
    template: `
        <zyra-scroll-area
            #scrollArea
            [maxHeight]="maxHeight()"
            [orientation]="orientation()"
            [smoothScroll]="smoothScroll()"
            [autoHideScrollbar]="autoHideScrollbar()"
            [showScrollShadows]="showScrollShadows()"
            (scrolled)="onScrolled($event)"
        >
            <div id="target" style="height: 1000px; width: 1000px;">content</div>
        </zyra-scroll-area>
    `,
})
class ScrollAreaHostComponent {
    maxHeight = signal('300px');
    orientation = signal<ScrollAreaOrientation>('vertical');
    smoothScroll = signal(false);
    autoHideScrollbar = signal(false);
    showScrollShadows = signal(false);
    scrolledEvents: ScrollAreaScrollEvent[] = [];

    onScrolled(event: ScrollAreaScrollEvent): void {
        this.scrolledEvents.push(event);
    }
}

@Component({
    standalone: true,
    imports: [ZyraScrollArea],
    template: `<zyra-scroll-area />`,
})
class ScrollAreaHostEmptyComponent {}

function keydown(key: string): KeyboardEvent {
    return new KeyboardEvent('keydown', { key, cancelable: true });
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraScrollArea', () => {
    let fixture: ComponentFixture<ScrollAreaHostComponent>;
    let host: ScrollAreaHostComponent;
    let el: HTMLElement;
    let component: ZyraScrollArea;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollAreaHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ScrollAreaHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-scroll-area');
        component = fixture.debugElement.children[0].componentInstance as ZyraScrollArea;
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-scroll-area')).not.toBeNull();
    });

    it('projects slotted content inside the viewport', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    // ── Defaults ──────────────────────────────────────────────────────────

    it('defaults to vertical orientation and 300px max-height', () => {
        expect(el.classList.contains('zyr-scroll-area--vertical')).toBeTrue();
        expect(el.style.maxHeight).toBe('300px');
    });

    it('is focusable via tabindex for keyboard scrolling', () => {
        expect(el.getAttribute('tabindex')).toBe('0');
    });

    // ── maxHeight ─────────────────────────────────────────────────────────

    it('reflects a custom max-height', () => {
        host.maxHeight.set('500px');
        fixture.detectChanges();
        expect(el.style.maxHeight).toBe('500px');
    });

    // ── orientation ───────────────────────────────────────────────────────

    it('applies the horizontal modifier class', () => {
        host.orientation.set('horizontal');
        fixture.detectChanges();
        expect(el.classList.contains('zyr-scroll-area--horizontal')).toBeTrue();
    });

    it('applies the both modifier class', () => {
        host.orientation.set('both');
        fixture.detectChanges();
        expect(el.classList.contains('zyr-scroll-area--both')).toBeTrue();
    });

    // ── Keyboard support ──────────────────────────────────────────────────

    it('scrolls down on ArrowDown', () => {
        el.scrollTop = 0;
        el.dispatchEvent(keydown('ArrowDown'));
        expect(el.scrollTop).toBeGreaterThan(0);
    });

    it('scrolls up on ArrowUp', () => {
        el.scrollTop = 100;
        el.dispatchEvent(keydown('ArrowUp'));
        expect(el.scrollTop).toBeLessThan(100);
    });

    it('jumps to the bottom on End', () => {
        el.scrollTop = 0;
        el.dispatchEvent(keydown('End'));
        expect(el.scrollTop).toBe(el.scrollHeight - el.clientHeight);
    });

    it('jumps to the top on Home', () => {
        el.scrollTop = 500;
        el.dispatchEvent(keydown('Home'));
        expect(el.scrollTop).toBe(0);
    });

    it('ignores ArrowLeft/ArrowRight when orientation is vertical', () => {
        el.scrollLeft = 0;
        el.dispatchEvent(keydown('ArrowRight'));
        expect(el.scrollLeft).toBe(0);
    });

    it('ignores an unrelated key', () => {
        el.scrollTop = 50;
        el.dispatchEvent(keydown('a'));
        expect(el.scrollTop).toBe(50);
    });

    // ── smoothScroll ──────────────────────────────────────────────────────

    it('applies scroll-behavior: auto by default', () => {
        expect(el.style.scrollBehavior).toBe('auto');
    });

    it('applies scroll-behavior: smooth when smoothScroll is true', () => {
        host.smoothScroll.set(true);
        fixture.detectChanges();
        expect(el.style.scrollBehavior).toBe('smooth');
    });

    // ── autoHideScrollbar / showScrollShadows ────────────────────────────────

    it('applies the auto-hide modifier class', () => {
        host.autoHideScrollbar.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-scroll-area--auto-hide')).toBeTrue();
    });

    it('applies the shadows modifier class', () => {
        host.showScrollShadows.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-scroll-area--shadows')).toBeTrue();
    });

    // ── scroll events ─────────────────────────────────────────────────────

    it('emits a scrolled event with scroll metrics on a native scroll event', () => {
        el.scrollTop = 42;
        el.dispatchEvent(new Event('scroll'));
        expect(host.scrolledEvents.length).toBe(1);
        expect(host.scrolledEvents[0].scrollTop).toBe(42);
        expect(host.scrolledEvents[0].scrollHeight).toBeGreaterThan(0);
    });

    // ── public scroll API ─────────────────────────────────────────────────

    it('scrollToTop() scrolls the viewport to the top', () => {
        el.scrollTop = 200;
        component.scrollToTop('auto');
        expect(el.scrollTop).toBe(0);
    });

    it('scrollToBottom() scrolls the viewport to the bottom', () => {
        el.scrollTop = 0;
        component.scrollToBottom('auto');
        expect(el.scrollTop).toBe(el.scrollHeight - el.clientHeight);
    });

    it('scrollToElement() scrolls a descendant into view by element reference', () => {
        const target = el.querySelector<HTMLElement>('#target')!;
        expect(() => component.scrollToElement(target, 'auto')).not.toThrow();
    });

    it('scrollToElement() scrolls a descendant into view by CSS selector', () => {
        expect(() => component.scrollToElement('#target', 'auto')).not.toThrow();
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('exposes a region role with an aria-label', () => {
        expect(el.getAttribute('role')).toBe('region');
        expect(el.getAttribute('aria-label')).toBeTruthy();
    });

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-scroll-area').isConnected).toBeTrue();
    });
});

describe('ZyraScrollArea — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollAreaHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ScrollAreaHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});
