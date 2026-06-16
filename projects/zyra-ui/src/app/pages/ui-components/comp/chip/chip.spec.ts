import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chip } from './chip';

describe('Chip demo', () => {
    let fixture: ComponentFixture<Chip>;
    let component: Chip;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Chip] }).compileComponents();
        fixture = TestBed.createComponent(Chip);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.variant()).toBe('default');
        expect(component.size()).toBe('md');
        expect(component.dismissible()).toBeFalse();
        expect(component.selectable()).toBeFalse();
        expect(component.selected()).toBeFalse();
        expect(component.disabled()).toBeFalse();
        expect(component.labelText()).toBe('Frontend');
    });

    it('has chips list with 5 items by default', () => {
        expect(component.chips()).toEqual(['Angular', 'TypeScript', 'SCSS', 'Signals', 'SSR']);
    });

    it('updates variant signal', () => {
        component.variant.set('success');
        expect(component.variant()).toBe('success');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates dismissible signal', () => {
        component.dismissible.set(true);
        expect(component.dismissible()).toBeTrue();
    });

    it('updates selectable signal', () => {
        component.selectable.set(true);
        expect(component.selectable()).toBeTrue();
    });

    it('updates disabled signal', () => {
        component.disabled.set(true);
        expect(component.disabled()).toBeTrue();
    });

    it('dismiss() removes the specified chip from the list', () => {
        component.dismiss('Angular');
        expect(component.chips()).not.toContain('Angular');
        expect(component.chips().length).toBe(4);
    });

    it('dismiss() leaves other chips intact', () => {
        component.dismiss('SCSS');
        expect(component.chips()).toContain('Angular');
        expect(component.chips()).toContain('TypeScript');
    });

    it('generatedCode contains zyra-chip', () => {
        expect(component.generatedCode()).toContain('zyra-chip');
    });

    it('generatedCode omits variant when default', () => {
        expect(component.generatedCode()).not.toContain('variant=');
    });

    it('generatedCode includes variant when not default', () => {
        component.variant.set('info');
        expect(component.generatedCode()).toContain('variant="info"');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('generatedCode includes [dismissible]="true" when set', () => {
        component.dismissible.set(true);
        expect(component.generatedCode()).toContain('[dismissible]="true"');
    });

    it('generatedCode includes [selectable]="true" when set', () => {
        component.selectable.set(true);
        expect(component.generatedCode()).toContain('[selectable]="true"');
    });

    it('generatedCode includes label text', () => {
        expect(component.generatedCode()).toContain('Frontend');
    });

    it('reset() restores all defaults', () => {
        component.variant.set('danger');
        component.size.set('lg');
        component.dismissible.set(true);
        component.selectable.set(true);
        component.selected.set(true);
        component.disabled.set(true);
        component.labelText.set('Other');
        component.dismiss('Angular');
        component.reset();
        expect(component.variant()).toBe('default');
        expect(component.size()).toBe('md');
        expect(component.dismissible()).toBeFalse();
        expect(component.selectable()).toBeFalse();
        expect(component.selected()).toBeFalse();
        expect(component.disabled()).toBeFalse();
        expect(component.labelText()).toBe('Frontend');
        expect(component.chips()).toEqual(['Angular', 'TypeScript', 'SCSS', 'Signals', 'SSR']);
    });

    it('has expected variants list', () => {
        expect(component.variants).toContain('default');
        expect(component.variants).toContain('success');
        expect(component.variants).toContain('purple');
        expect(component.variants.length).toBe(6);
    });
});
