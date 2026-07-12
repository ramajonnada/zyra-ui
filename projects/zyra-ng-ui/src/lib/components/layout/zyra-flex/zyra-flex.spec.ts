import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    ZyraFlex,
    FlexAlign,
    FlexDirection,
    FlexJustify,
    FlexResponsiveDirection,
    FlexResponsiveGap,
} from './zyra-flex';
import { BoxSpacing } from '../../../internal/box-style/box-style';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraFlex],
    template: `
        <zyra-flex
            [direction]="direction()"
            [align]="align()"
            [justify]="justify()"
            [gap]="gap()"
            [wrap]="wrap()"
            [wrapReverse]="wrapReverse()"
            [inline]="inline()"
            [border]="border()"
        >
            content
        </zyra-flex>
    `,
})
class FlexHostComponent {
    direction = signal<FlexDirection | FlexResponsiveDirection>('row');
    align = signal<FlexAlign>('stretch');
    justify = signal<FlexJustify>('start');
    gap = signal<BoxSpacing | FlexResponsiveGap>('none');
    wrap = signal(false);
    wrapReverse = signal(false);
    inline = signal(false);
    border = signal(false);
}

@Component({
    standalone: true,
    imports: [ZyraFlex],
    template: `<zyra-flex />`,
})
class FlexHostEmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraFlex', () => {
    let fixture: ComponentFixture<FlexHostComponent>;
    let host: FlexHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlexHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlexHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-flex');
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-flex')).not.toBeNull();
    });

    it('projects slotted content inside the host', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    // ── Defaults ──────────────────────────────────────────────────────────

    it('defaults to row direction, stretch align, start justify, no wrap, no gap', () => {
        expect(el.style.display).toBe('flex');
        expect(el.style.flexDirection).toBe('row');
        expect(el.style.alignItems).toBe('stretch');
        expect(el.style.justifyContent).toBe('flex-start');
        expect(el.style.flexWrap).toBe('nowrap');
        expect(el.style.gap).toBe('0px');
    });

    // ── direction ─────────────────────────────────────────────────────────

    it('reflects a custom direction', () => {
        host.direction.set('column');
        fixture.detectChanges();
        expect(el.style.flexDirection).toBe('column');
    });

    // ── align / justify ───────────────────────────────────────────────────

    it('maps align="center" to align-items: center', () => {
        host.align.set('center');
        fixture.detectChanges();
        expect(el.style.alignItems).toBe('center');
    });

    it('maps justify="between" to justify-content: space-between', () => {
        host.justify.set('between');
        fixture.detectChanges();
        expect(el.style.justifyContent).toBe('space-between');
    });

    // ── gap ───────────────────────────────────────────────────────────────

    it('applies a gap from the spacing scale', () => {
        host.gap.set('md');
        fixture.detectChanges();
        expect(el.style.gap).toBe('var(--zyra-space-4)');
    });

    // ── wrap ──────────────────────────────────────────────────────────────

    it('applies flex-wrap: wrap when wrap is true', () => {
        host.wrap.set(true);
        fixture.detectChanges();
        expect(el.style.flexWrap).toBe('wrap');
    });

    it('applies flex-wrap: wrap-reverse when wrapReverse is true', () => {
        host.wrapReverse.set(true);
        fixture.detectChanges();
        expect(el.style.flexWrap).toBe('wrap-reverse');
    });

    it('prioritizes wrapReverse over wrap when both are true', () => {
        host.wrap.set(true);
        host.wrapReverse.set(true);
        fixture.detectChanges();
        expect(el.style.flexWrap).toBe('wrap-reverse');
    });

    // ── responsive direction / gap ────────────────────────────────────────

    it('emits custom properties for a responsive direction object and hands the property to the stylesheet', () => {
        host.direction.set({ base: 'column', md: 'row' });
        fixture.detectChanges();
        expect(el.style.getPropertyValue('--zyr-flex-direction-base')).toBe('column');
        expect(el.style.getPropertyValue('--zyr-flex-direction-md')).toBe('row');
        // The inline style must NOT set flex-direction directly — an inline value
        // would permanently beat every @media rule regardless of viewport.
        expect(el.style.flexDirection).toBe('');
        expect(el.classList.contains('zyr-flex--responsive-direction')).toBeTrue();
        // Whichever breakpoint the test browser's window width matches, it must
        // resolve to one of the two values we configured (base or md).
        expect(['column', 'row']).toContain(getComputedStyle(el).flexDirection);
    });

    it('emits custom properties for a responsive gap object and hands the property to the stylesheet', () => {
        host.gap.set({ base: 'sm', lg: 'xl' });
        fixture.detectChanges();
        expect(el.style.getPropertyValue('--zyr-flex-gap-base')).toBe('var(--zyra-space-2)');
        expect(el.style.getPropertyValue('--zyr-flex-gap-lg')).toBe('var(--zyra-space-8)');
        expect(el.style.gap).toBe('');
        expect(el.classList.contains('zyr-flex--responsive-gap')).toBeTrue();
    });

    // ── inline ────────────────────────────────────────────────────────────

    it('uses inline-flex when inline is true', () => {
        host.inline.set(true);
        fixture.detectChanges();
        expect(el.style.display).toBe('inline-flex');
    });

    // ── border ────────────────────────────────────────────────────────────

    it('applies the border class when border is true', () => {
        host.border.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-flex--border')).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-flex').isConnected).toBeTrue();
    });
});

describe('ZyraFlex — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [FlexHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(FlexHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});
