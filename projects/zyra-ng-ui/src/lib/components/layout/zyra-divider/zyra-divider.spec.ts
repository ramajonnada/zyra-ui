import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraDivider } from './zyra-divider';

@Component({
    standalone: true,
    imports: [ZyraDivider],
    template: `
        <zyra-divider
            [orientation]="orientation()"
            [variant]="variant()"
            [align]="align()"
            [label]="label()"
        />
    `,
})
class DividerHostComponent {
    orientation = signal<'horizontal' | 'vertical'>('horizontal');
    variant = signal<'solid' | 'dashed' | 'dotted'>('solid');
    align = signal<'start' | 'center' | 'end'>('center');
    label = signal('');
}

describe('ZyraDivider', () => {
    let fixture: ComponentFixture<DividerHostComponent>;
    let host: DividerHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DividerHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DividerHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('has role="separator"', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('[role="separator"]');
        expect(el).not.toBeNull();
    });

    it('sets aria-orientation attribute', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('[role="separator"]');
        expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('applies orientation class', () => {
        host.orientation.set('vertical');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-divider--vertical')).not.toBeNull();
        expect(el(fixture).getAttribute('aria-orientation')).toBe('vertical');
    });

    it('applies variant class', () => {
        host.variant.set('dashed');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-divider--dashed')).not.toBeNull();
    });

    it('applies align class', () => {
        host.align.set('start');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-divider--start')).not.toBeNull();
    });

    it('renders label when provided with horizontal orientation', () => {
        host.label.set('OR');
        fixture.detectChanges();

        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-divider__label');
        expect(label).not.toBeNull();
        expect(label.textContent?.trim()).toBe('OR');
    });

    it('does not render label when orientation is vertical', () => {
        host.label.set('OR');
        host.orientation.set('vertical');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-divider__label')).toBeNull();
    });

    it('does not render label element when label is empty', () => {
        expect(fixture.nativeElement.querySelector('.zyr-divider__label')).toBeNull();
    });
});

function el(fixture: ComponentFixture<DividerHostComponent>): HTMLElement {
    return fixture.nativeElement.querySelector('[role="separator"]');
}
