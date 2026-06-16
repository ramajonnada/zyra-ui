import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Select } from './select';

describe('Select demo', () => {
    let fixture: ComponentFixture<Select>;
    let component: Select;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Select] }).compileComponents();
        fixture = TestBed.createComponent(Select);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.size()).toBe('md');
        expect(component.appearance()).toBe('outline');
        expect(component.disabled()).toBeFalse();
        expect(component.playgroundValue()).toBeNull();
        expect(component.profileSubmitted()).toBeFalse();
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates appearance signal', () => {
        component.appearance.set('filled');
        expect(component.appearance()).toBe('filled');
    });

    it('updates disabled signal', () => {
        component.disabled.set(true);
        expect(component.disabled()).toBeTrue();
    });

    it('updates playgroundValue signal', () => {
        component.playgroundValue.set('angular');
        expect(component.playgroundValue()).toBe('angular');
    });

    it('generatedCode contains zyra-select', () => {
        expect(component.generatedCode()).toContain('zyra-select');
    });

    it('generatedCode omits size when md (default)', () => {
        expect(component.generatedCode()).not.toContain('size=');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('generatedCode omits appearance when outline (default)', () => {
        expect(component.generatedCode()).not.toContain('appearance=');
    });

    it('generatedCode includes appearance when not outline', () => {
        component.appearance.set('filled');
        expect(component.generatedCode()).toContain('appearance="filled"');
    });

    it('generatedCode includes [disabled]="true" when disabled', () => {
        component.disabled.set(true);
        expect(component.generatedCode()).toContain('[disabled]="true"');
    });

    it('profileForm has country, timezone, language controls', () => {
        expect(component.profileForm.get('country')).not.toBeNull();
        expect(component.profileForm.get('timezone')).not.toBeNull();
        expect(component.profileForm.get('language')).not.toBeNull();
    });

    it('profileForm is invalid when required fields are empty', () => {
        expect(component.profileForm.invalid).toBeTrue();
    });

    it('submitProfile() does not set profileSubmitted when form invalid', () => {
        component.submitProfile();
        expect(component.profileSubmitted()).toBeFalse();
    });

    it('submitProfile() sets profileSubmitted when form is valid', () => {
        component.profileForm.setValue({ country: 'IN', timezone: 'UTC+5:30', language: 'en' });
        component.submitProfile();
        expect(component.profileSubmitted()).toBeTrue();
        expect(component.formResult()).not.toBeNull();
    });

    it('reset() restores defaults', () => {
        component.size.set('lg');
        component.appearance.set('filled');
        component.disabled.set(true);
        component.playgroundValue.set('vue');
        component.reset();
        expect(component.size()).toBe('md');
        expect(component.appearance()).toBe('outline');
        expect(component.disabled()).toBeFalse();
        expect(component.playgroundValue()).toBeNull();
    });
});
