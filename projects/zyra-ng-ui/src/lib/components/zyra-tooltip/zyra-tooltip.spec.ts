import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTooltip } from './zyra-tooltip';

@Component({
    standalone: true,
    imports: [ZyraTooltip],
    template: `
        <zyra-tooltip [text]="text()" [position]="position()">
            <button type="button">Trigger</button>
        </zyra-tooltip>
    `,
})
class TooltipHostComponent {
    text = signal('Helpful tip');
    position = signal<'top' | 'bottom' | 'left' | 'right'>('top');
}

describe('ZyraTooltip', () => {
    let fixture: ComponentFixture<TooltipHostComponent>;
    let host: TooltipHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TooltipHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TooltipHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Visibility ────────────────────────────────────────────────────────
    it('is hidden by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).toBeNull();
    });

    it('shows tooltip on mouseenter', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).not.toBeNull();
    });

    it('hides tooltip on mouseleave', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).toBeNull();
    });

    it('shows tooltip on focusin for keyboard users', () => {
        wrap(fixture).dispatchEvent(new Event('focusin'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).not.toBeNull();
    });

    it('hides tooltip on focusout', () => {
        wrap(fixture).dispatchEvent(new Event('focusin'));
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('focusout'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).toBeNull();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders the tooltip text', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        const tooltip: HTMLElement = fixture.nativeElement.querySelector('.zyr-tooltip');
        expect(tooltip.textContent).toContain('Helpful tip');
    });

    // ── Position ──────────────────────────────────────────────────────────
    it('applies top position class by default', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip--top')).not.toBeNull();
    });

    it('applies right position class', () => {
        host.position.set('right');
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip--right')).not.toBeNull();
    });

    it('applies bottom position class', () => {
        host.position.set('bottom');
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip--bottom')).not.toBeNull();
    });

    it('applies left position class', () => {
        host.position.set('left');
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip--left')).not.toBeNull();
    });

    // ── No text ───────────────────────────────────────────────────────────
    it('does not show when text is empty', () => {
        host.text.set('');
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip')).toBeNull();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('has role="tooltip"', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="tooltip"]')).not.toBeNull();
    });

    it('tooltip span has an id when visible', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        const tooltip: HTMLElement = fixture.nativeElement.querySelector('[role="tooltip"]');
        expect(tooltip.id).toBeTruthy();
    });

    it('wrapper sets aria-describedby pointing to the tooltip id when visible', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        const tooltip: HTMLElement = fixture.nativeElement.querySelector('[role="tooltip"]');
        const w = wrap(fixture);
        expect(w.getAttribute('aria-describedby')).toBe(tooltip.id);
    });

    it('wrapper clears aria-describedby when tooltip is hidden', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        wrap(fixture).dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        expect(wrap(fixture).getAttribute('aria-describedby')).toBeNull();
    });

    it('renders the arrow element inside tooltip', () => {
        wrap(fixture).dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-tooltip__arrow')).not.toBeNull();
    });

    // ── Projected content ─────────────────────────────────────────────────
    it('renders projected trigger content', () => {
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(btn).not.toBeNull();
        expect(btn.textContent?.trim()).toBe('Trigger');
    });
});

function wrap(f: ComponentFixture<TooltipHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('.zyr-tooltip-wrap');
}
