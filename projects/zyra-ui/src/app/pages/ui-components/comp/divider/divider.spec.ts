import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Divider } from './divider';

describe('Divider demo', () => {
    let fixture: ComponentFixture<Divider>;
    let component: Divider;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Divider] }).compileComponents();
        fixture = TestBed.createComponent(Divider);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.orientation()).toBe('horizontal');
        expect(component.variant()).toBe('solid');
        expect(component.align()).toBe('center');
        expect(component.label()).toBe('or');
        expect(component.width()).toBe('1px');
    });

    it('updates orientation signal', () => {
        component.orientation.set('vertical');
        expect(component.orientation()).toBe('vertical');
    });

    it('updates variant signal', () => {
        component.variant.set('dashed');
        expect(component.variant()).toBe('dashed');
    });

    it('updates align signal', () => {
        component.align.set('start');
        expect(component.align()).toBe('start');
    });

    it('updates label signal', () => {
        component.label.set('AND');
        expect(component.label()).toBe('AND');
    });

    it('updates width signal', () => {
        component.width.set('2px');
        expect(component.width()).toBe('2px');
    });

    it('generatedCode is minimal for defaults', () => {
        const code = component.generatedCode();
        expect(code).toContain('zyra-divider');
    });

    it('generatedCode omits orientation when horizontal (default)', () => {
        expect(component.generatedCode()).not.toContain('orientation=');
    });

    it('generatedCode includes orientation when vertical', () => {
        component.orientation.set('vertical');
        expect(component.generatedCode()).toContain('orientation="vertical"');
    });

    it('generatedCode omits variant when solid (default)', () => {
        expect(component.generatedCode()).not.toContain('variant=');
    });

    it('generatedCode includes variant when not solid', () => {
        component.variant.set('dotted');
        expect(component.generatedCode()).toContain('variant="dotted"');
    });

    it('generatedCode omits align when center (default)', () => {
        expect(component.generatedCode()).not.toContain('align=');
    });

    it('generatedCode includes align when not center', () => {
        component.align.set('end');
        expect(component.generatedCode()).toContain('align="end"');
    });

    it('generatedCode includes label', () => {
        expect(component.generatedCode()).toContain('label="or"');
    });

    it('generatedCode omits width when 1px (default)', () => {
        expect(component.generatedCode()).not.toContain('width=');
    });

    it('generatedCode includes width when not 1px', () => {
        component.width.set('2px');
        expect(component.generatedCode()).toContain('width="2px"');
    });

    it('reset() restores all defaults', () => {
        component.orientation.set('vertical');
        component.variant.set('dashed');
        component.align.set('start');
        component.label.set('AND');
        component.width.set('3px');
        component.reset();
        expect(component.orientation()).toBe('horizontal');
        expect(component.variant()).toBe('solid');
        expect(component.align()).toBe('center');
        expect(component.label()).toBe('or');
        expect(component.width()).toBe('1px');
    });
});
