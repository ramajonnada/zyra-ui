import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from './alert';

describe('Alert demo', () => {
    let fixture: ComponentFixture<Alert>;
    let component: Alert;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Alert] }).compileComponents();
        fixture = TestBed.createComponent(Alert);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.variant()).toBe('info');
        expect(component.title()).toBe('Heads up');
        expect(component.dismissible()).toBeFalse();
        expect(component.visible()).toBeTrue();
    });

    it('updates variant signal', () => {
        component.variant.set('success');
        expect(component.variant()).toBe('success');
    });

    it('updates title signal', () => {
        component.title.set('Warning!');
        expect(component.title()).toBe('Warning!');
    });

    it('updates dismissible signal', () => {
        component.dismissible.set(true);
        expect(component.dismissible()).toBeTrue();
    });

    it('updates visible signal', () => {
        component.visible.set(false);
        expect(component.visible()).toBeFalse();
    });

    it('generatedCode contains zyra-alert', () => {
        expect(component.generatedCode()).toContain('zyra-alert');
    });

    it('generatedCode omits variant when info (default)', () => {
        expect(component.generatedCode()).not.toContain('variant=');
    });

    it('generatedCode includes variant when not info', () => {
        component.variant.set('danger');
        expect(component.generatedCode()).toContain('variant="danger"');
    });

    it('generatedCode includes title', () => {
        expect(component.generatedCode()).toContain('title="Heads up"');
    });

    it('generatedCode includes [dismissible]="true" when set', () => {
        component.dismissible.set(true);
        expect(component.generatedCode()).toContain('[dismissible]="true"');
    });

    it('reset() restores all defaults', () => {
        component.variant.set('danger');
        component.title.set('Error!');
        component.dismissible.set(true);
        component.visible.set(false);
        component.reset();
        expect(component.variant()).toBe('info');
        expect(component.title()).toBe('Heads up');
        expect(component.dismissible()).toBeFalse();
        expect(component.visible()).toBeTrue();
    });

    it('has expected variants list', () => {
        expect(component.variants).toContain('success');
        expect(component.variants).toContain('warning');
        expect(component.variants).toContain('danger');
        expect(component.variants).toContain('info');
        expect(component.variants.length).toBe(4);
    });
});
