import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioSize, ZyraRadio } from './zyra-radio';

@Component({
    standalone: true,
    imports: [ZyraRadio],
    template: `
        <zyra-radio [value]="value()" [label]="label()" [size]="size()" [disabled]="disabled()" />
    `,
})
class StandaloneRadioHostComponent {
    value = signal('angular');
    label = signal('Angular');
    size = signal<RadioSize>('md');
    disabled = signal(false);
}

// zyra-radio-group.spec.ts already covers group-driven selection, keyboard
// nav, and disabled-group propagation. This spec covers ZyraRadio's own
// rendering and its behavior with no ZYRA_RADIO_GROUP in context at all —
// the group injection is `optional: true`, so a bare <zyra-radio> must not
// throw and must simply never appear checked.
describe('ZyraRadio (standalone, no group)', () => {
    let fixture: ComponentFixture<StandaloneRadioHostComponent>;
    let host: StandaloneRadioHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StandaloneRadioHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(StandaloneRadioHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders the provided label text', () => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-radio__label');
        expect(label.textContent?.trim()).toBe('Angular');
    });

    it('renders no label element when label is empty', () => {
        host.label.set('');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-radio__label')).toBeNull();
    });

    it('applies the size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-radio--lg')).not.toBeNull();
    });

    it('gives each instance a unique id', () => {
        const second = TestBed.createComponent(StandaloneRadioHostComponent);
        second.detectChanges();
        const firstId = fixture.nativeElement.querySelector('.zyr-radio__circle').id;
        const secondId = second.nativeElement.querySelector('.zyr-radio__circle').id;
        expect(firstId).not.toBe(secondId);
    });

    // ── No group in context ───────────────────────────────────────────────
    it('is never checked without a group', () => {
        expect(circle(fixture).getAttribute('aria-checked')).toBe('false');
        expect(fixture.nativeElement.querySelector('.zyr-radio--checked')).toBeNull();
    });

    it('does not throw when clicked without a group', () => {
        expect(() => circle(fixture).click()).not.toThrow();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-radio--checked')).toBeNull();
    });

    // ── Disabled ──────────────────────────────────────────────────────────
    it('applies --disabled class and the native disabled attribute when [disabled]', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-radio--disabled')).not.toBeNull();
        expect(circle(fixture).disabled).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('has role="radio"', () => {
        expect(circle(fixture).getAttribute('role')).toBe('radio');
    });

    it('uses the label as aria-label', () => {
        expect(circle(fixture).getAttribute('aria-label')).toBe('Angular');
    });

    it('falls back to the value as aria-label when there is no label', () => {
        host.label.set('');
        fixture.detectChanges();
        expect(circle(fixture).getAttribute('aria-label')).toBe('angular');
    });

    it('the outer label element points at the circle button via for/id', () => {
        const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
        expect(label.htmlFor).toBe(circle(fixture).id);
    });
});

function circle(f: ComponentFixture<StandaloneRadioHostComponent>): HTMLButtonElement {
    return f.nativeElement.querySelector('.zyr-radio__circle');
}
