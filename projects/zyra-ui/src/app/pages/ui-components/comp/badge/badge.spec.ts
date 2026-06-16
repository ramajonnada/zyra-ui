import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge demo', () => {
    let fixture: ComponentFixture<Badge>;
    let component: Badge;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Badge] }).compileComponents();
        fixture = TestBed.createComponent(Badge);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.variant()).toBe('success');
        expect(component.size()).toBe('md');
        expect(component.dot()).toBeFalse();
        expect(component.labelText()).toBe('Badge');
    });

    it('updates variant signal', () => {
        component.variant.set('danger');
        expect(component.variant()).toBe('danger');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates dot signal', () => {
        component.dot.set(true);
        expect(component.dot()).toBeTrue();
    });

    it('updates labelText signal', () => {
        component.labelText.set('New');
        expect(component.labelText()).toBe('New');
    });

    it('generatedCode includes label text', () => {
        expect(component.generatedCode()).toContain('Badge');
    });

    it('generatedCode includes variant="success" (non-library-default variant)', () => {
        expect(component.generatedCode()).toContain('variant="success"');
    });

    it('generatedCode omits variant only when set to library default (default)', () => {
        component.variant.set('default');
        expect(component.generatedCode()).not.toContain('variant=');
    });

    it('generatedCode includes variant when warning', () => {
        component.variant.set('warning');
        expect(component.generatedCode()).toContain('variant="warning"');
    });

    it('generatedCode includes [dot]="true" when dot is true', () => {
        component.dot.set(true);
        expect(component.generatedCode()).toContain('[dot]="true"');
    });

    it('generatedCode omits size when md (default)', () => {
        expect(component.generatedCode()).not.toContain('size=');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('reset() restores all default values', () => {
        component.variant.set('danger');
        component.size.set('lg');
        component.dot.set(true);
        component.labelText.set('Custom');
        component.reset();
        expect(component.variant()).toBe('success');
        expect(component.size()).toBe('md');
        expect(component.dot()).toBeFalse();
        expect(component.labelText()).toBe('Badge');
    });

    it('has expected variants list', () => {
        expect(component.variants).toContain('success');
        expect(component.variants).toContain('danger');
        expect(component.variants.length).toBe(6);
    });
});
