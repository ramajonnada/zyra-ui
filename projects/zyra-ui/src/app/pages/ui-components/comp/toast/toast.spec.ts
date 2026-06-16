import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast demo', () => {
    let fixture: ComponentFixture<Toast>;
    let component: Toast;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Toast] }).compileComponents();
        fixture = TestBed.createComponent(Toast);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        component.dismissAll();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.variant()).toBe('success');
        expect(component.title()).toBe('Operation completed');
        expect(component.description()).toBe('Your changes have been saved.');
        expect(component.duration()).toBe(4000);
        expect(component.persistent()).toBeFalse();
    });

    it('updates variant signal', () => {
        component.variant.set('error');
        expect(component.variant()).toBe('error');
    });

    it('updates title signal', () => {
        component.title.set('Done!');
        expect(component.title()).toBe('Done!');
    });

    it('updates persistent signal', () => {
        component.persistent.set(true);
        expect(component.persistent()).toBeTrue();
    });

    it('generatedCode includes variant method call', () => {
        const code = component.generatedCode();
        expect(code).toContain('toastService.success(');
    });

    it('generatedCode uses duration 0 when persistent', () => {
        component.persistent.set(true);
        expect(component.generatedCode()).toContain('duration: 0');
    });

    it('generatedCode includes the title string', () => {
        component.title.set('File saved');
        expect(component.generatedCode()).toContain('File saved');
    });

    it('generatedCode uses info method for default variant', () => {
        component.variant.set('default');
        expect(component.generatedCode()).toContain('toastService.info(');
    });

    it('generatedCode uses error method for error variant', () => {
        component.variant.set('error');
        expect(component.generatedCode()).toContain('toastService.error(');
    });

    it('generatedCode uses warning method for warning variant', () => {
        component.variant.set('warning');
        expect(component.generatedCode()).toContain('toastService.warning(');
    });

    it('reset() restores all defaults', () => {
        component.variant.set('error');
        component.title.set('Oops');
        component.duration.set(2000);
        component.persistent.set(true);
        component.reset();
        expect(component.variant()).toBe('success');
        expect(component.title()).toBe('Operation completed');
        expect(component.duration()).toBe(4000);
        expect(component.persistent()).toBeFalse();
    });

    it('has expected variants list', () => {
        expect(component.variants).toContain('success');
        expect(component.variants).toContain('error');
        expect(component.variants).toContain('warning');
        expect(component.variants).toContain('info');
    });
});
