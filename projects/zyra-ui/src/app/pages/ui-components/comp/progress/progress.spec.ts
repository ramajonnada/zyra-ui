import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Progress } from './progress';

describe('Progress demo', () => {
    let fixture: ComponentFixture<Progress>;
    let component: Progress;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Progress] }).compileComponents();
        fixture = TestBed.createComponent(Progress);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.value()).toBe(65);
        expect(component.variant()).toBe('default');
        expect(component.size()).toBe('md');
        expect(component.indeterminate()).toBeFalse();
        expect(component.showLabel()).toBeTrue();
    });

    it('updates value signal', () => {
        component.value.set(80);
        expect(component.value()).toBe(80);
    });

    it('updates variant signal', () => {
        component.variant.set('success');
        expect(component.variant()).toBe('success');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates indeterminate signal', () => {
        component.indeterminate.set(true);
        expect(component.indeterminate()).toBeTrue();
    });

    it('updates showLabel signal', () => {
        component.showLabel.set(false);
        expect(component.showLabel()).toBeFalse();
    });

    it('generatedCode contains zyra-progress', () => {
        expect(component.generatedCode()).toContain('zyra-progress');
    });

    it('generatedCode includes [value] when not indeterminate', () => {
        component.indeterminate.set(false);
        expect(component.generatedCode()).toContain('[value]="65"');
    });

    it('generatedCode includes [indeterminate]="true" when set', () => {
        component.indeterminate.set(true);
        expect(component.generatedCode()).toContain('[indeterminate]="true"');
    });

    it('generatedCode omits [value] when indeterminate', () => {
        component.indeterminate.set(true);
        expect(component.generatedCode()).not.toContain('[value]=');
    });

    it('generatedCode includes [showLabel]="true" when showLabel', () => {
        expect(component.generatedCode()).toContain('[showLabel]="true"');
    });

    it('generatedCode omits variant when default', () => {
        expect(component.generatedCode()).not.toContain('variant=');
    });

    it('generatedCode includes variant when not default', () => {
        component.variant.set('danger');
        expect(component.generatedCode()).toContain('variant="danger"');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('reset() restores all defaults', () => {
        component.value.set(20);
        component.variant.set('success');
        component.size.set('sm');
        component.indeterminate.set(true);
        component.showLabel.set(false);
        component.reset();
        expect(component.value()).toBe(65);
        expect(component.variant()).toBe('default');
        expect(component.size()).toBe('md');
        expect(component.indeterminate()).toBeFalse();
        expect(component.showLabel()).toBeTrue();
    });

    it('has expected variants list', () => {
        expect(component.variants).toContain('default');
        expect(component.variants).toContain('success');
        expect(component.variants).toContain('danger');
        expect(component.variants.length).toBe(5);
    });
});
