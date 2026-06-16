import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toggle } from './toggle';

describe('Toggle demo', () => {
    let fixture: ComponentFixture<Toggle>;
    let component: Toggle;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Toggle] }).compileComponents();
        fixture = TestBed.createComponent(Toggle);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.checked()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.disabled()).toBeFalse();
        expect(component.label()).toBe('Enable notifications');
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

    it('updates label signal', () => {
        component.label.set('Dark mode');
        expect(component.label()).toBe('Dark mode');
    });

    it('updates labelPosition signal', () => {
        component.labelPosition.set('left');
        expect(component.labelPosition()).toBe('left');
    });

    it('generatedCode is minimal for defaults', () => {
        const code = component.generatedCode();
        expect(code).toContain('zyra-toggle');
    });

    it('generatedCode omits size when md (default)', () => {
        expect(component.generatedCode()).not.toContain('size=');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('generatedCode includes label', () => {
        expect(component.generatedCode()).toContain('label="Enable notifications"');
    });

    it('generatedCode includes labelPosition when left', () => {
        component.labelPosition.set('left');
        expect(component.generatedCode()).toContain('labelPosition="left"');
    });

    it('generatedCode omits labelPosition when right (default)', () => {
        expect(component.generatedCode()).not.toContain('labelPosition=');
    });

    it('generatedCode includes [checked]="true" when checked', () => {
        component.checked.set(true);
        expect(component.generatedCode()).toContain('[checked]="true"');
    });

    it('generatedCode includes [disabled]="true" when disabled', () => {
        component.disabled.set(true);
        expect(component.generatedCode()).toContain('[disabled]="true"');
    });

    it('reset() restores all defaults', () => {
        component.checked.set(true);
        component.size.set('lg');
        component.disabled.set(true);
        component.label.set('Auto-save');
        component.labelPosition.set('left');
        component.reset();
        expect(component.checked()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.disabled()).toBeFalse();
        expect(component.label()).toBe('Enable notifications');
        expect(component.labelPosition()).toBe('right');
    });

    it('has controlDefs with size, labelPosition, label, disabled', () => {
        const keys = component.controlDefs.map(d => d.key);
        expect(keys).toContain('size');
        expect(keys).toContain('labelPosition');
        expect(keys).toContain('label');
        expect(keys).toContain('disabled');
    });
});
