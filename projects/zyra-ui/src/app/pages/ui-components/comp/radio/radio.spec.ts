import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Radio } from './radio';

describe('Radio demo', () => {
    let fixture: ComponentFixture<Radio>;
    let component: Radio;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Radio] }).compileComponents();
        fixture = TestBed.createComponent(Radio);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.playValue()).toBeNull();
        expect(component.orientation()).toBe('vertical');
        expect(component.disabled()).toBeFalse();
    });

    it('updates playValue signal', () => {
        component.playValue.set('angular');
        expect(component.playValue()).toBe('angular');
    });

    it('updates orientation signal', () => {
        component.orientation.set('horizontal');
        expect(component.orientation()).toBe('horizontal');
    });

    it('updates disabled signal', () => {
        component.disabled.set(true);
        expect(component.disabled()).toBeTrue();
    });

    it('generatedCode contains zyra-radio-group', () => {
        expect(component.generatedCode()).toContain('zyra-radio-group');
    });

    it('generatedCode omits orientation when vertical (default)', () => {
        expect(component.generatedCode()).not.toContain('orientation=');
    });

    it('generatedCode includes orientation when horizontal', () => {
        component.orientation.set('horizontal');
        expect(component.generatedCode()).toContain('orientation="horizontal"');
    });

    it('generatedCode includes [disabled]="true" when disabled', () => {
        component.disabled.set(true);
        expect(component.generatedCode()).toContain('[disabled]="true"');
    });

    it('planCtrl has starter as default value', () => {
        expect(component.planCtrl.value).toBe('starter');
    });

    it('planCtrl is invalid when empty', () => {
        component.planCtrl.setValue('');
        expect(component.planCtrl.invalid).toBeTrue();
    });

    it('reset() restores all defaults', () => {
        component.playValue.set('react');
        component.orientation.set('horizontal');
        component.disabled.set(true);
        component.reset();
        expect(component.playValue()).toBeNull();
        expect(component.orientation()).toBe('vertical');
        expect(component.disabled()).toBeFalse();
    });
});
