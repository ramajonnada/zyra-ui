import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox demo', () => {
    let fixture: ComponentFixture<Checkbox>;
    let component: Checkbox;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Checkbox] }).compileComponents();
        fixture = TestBed.createComponent(Checkbox);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.checked()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.disabled()).toBeFalse();
        expect(component.indeterminate()).toBeFalse();
        expect(component.label()).toBe('Accept terms and conditions');
        expect(component.labelPosition()).toBe('right');
    });

    it('updates checked signal', () => {
        component.checked.set(true);
        expect(component.checked()).toBeTrue();
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates disabled signal', () => {
        component.disabled.set(true);
        expect(component.disabled()).toBeTrue();
    });

    it('updates indeterminate signal', () => {
        component.indeterminate.set(true);
        expect(component.indeterminate()).toBeTrue();
    });

    it('updates label signal', () => {
        component.label.set('I agree');
        expect(component.label()).toBe('I agree');
    });

    it('updates labelPosition signal', () => {
        component.labelPosition.set('left');
        expect(component.labelPosition()).toBe('left');
    });

    it('generatedCode is minimal for defaults', () => {
        expect(component.generatedCode()).toContain('<zyra-checkbox');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('generatedCode includes label', () => {
        expect(component.generatedCode()).toContain('label="Accept terms and conditions"');
    });

    it('generatedCode includes [checked]="true" when checked', () => {
        component.checked.set(true);
        expect(component.generatedCode()).toContain('[checked]="true"');
    });

    it('generatedCode includes [disabled]="true" when disabled', () => {
        component.disabled.set(true);
        expect(component.generatedCode()).toContain('[disabled]="true"');
    });

    it('generatedCode includes [indeterminate]="true" when indeterminate', () => {
        component.indeterminate.set(true);
        expect(component.generatedCode()).toContain('[indeterminate]="true"');
    });

    it('generatedCode includes labelPosition when left', () => {
        component.labelPosition.set('left');
        expect(component.generatedCode()).toContain('labelPosition="left"');
    });

    it('permissionsForm has expected controls', () => {
        expect(component.permissionsForm.get('read')).not.toBeNull();
        expect(component.permissionsForm.get('write')).not.toBeNull();
        expect(component.permissionsForm.get('execute')).not.toBeNull();
        expect(component.permissionsForm.get('admin')).not.toBeNull();
    });

    it('permissionsForm read is checked by default', () => {
        expect(component.permissionsForm.get('read')?.value).toBeTrue();
    });

    it('reset() restores all defaults', () => {
        component.checked.set(true);
        component.size.set('lg');
        component.disabled.set(true);
        component.indeterminate.set(true);
        component.label.set('Other');
        component.labelPosition.set('left');
        component.reset();
        expect(component.checked()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.disabled()).toBeFalse();
        expect(component.indeterminate()).toBeFalse();
        expect(component.label()).toBe('Accept terms and conditions');
        expect(component.labelPosition()).toBe('right');
    });
});
