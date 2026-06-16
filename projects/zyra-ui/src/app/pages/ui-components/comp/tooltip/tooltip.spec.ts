import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tooltip } from './tooltip';

describe('Tooltip demo', () => {
    let fixture: ComponentFixture<Tooltip>;
    let component: Tooltip;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Tooltip] }).compileComponents();
        fixture = TestBed.createComponent(Tooltip);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.position()).toBe('top');
        expect(component.maxWidth()).toBe('200px');
        expect(component.triggerType()).toBe('Button');
        expect(component.tooltipText()).toBe('This is a tooltip!');
    });

    it('updates position signal', () => {
        component.position.set('bottom');
        expect(component.position()).toBe('bottom');
    });

    it('updates tooltipText signal', () => {
        component.tooltipText.set('Hello world');
        expect(component.tooltipText()).toBe('Hello world');
    });

    it('updates maxWidth signal', () => {
        component.maxWidth.set('300px');
        expect(component.maxWidth()).toBe('300px');
    });

    it('generatedCode includes tooltip text', () => {
        expect(component.generatedCode()).toContain('text="This is a tooltip!"');
    });

    it('generatedCode omits position when top (default)', () => {
        expect(component.generatedCode()).not.toContain('position=');
    });

    it('generatedCode includes position when not top', () => {
        component.position.set('right');
        expect(component.generatedCode()).toContain('position="right"');
    });

    it('generatedCode omits maxWidth when 200px (default)', () => {
        expect(component.generatedCode()).not.toContain('maxWidth=');
    });

    it('generatedCode includes maxWidth when not default', () => {
        component.maxWidth.set('300px');
        expect(component.generatedCode()).toContain('maxWidth="300px"');
    });

    it('reset() restores all defaults', () => {
        component.position.set('left');
        component.tooltipText.set('Other text');
        component.maxWidth.set('120px');
        component.triggerType.set('Icon');
        component.reset();
        expect(component.position()).toBe('top');
        expect(component.tooltipText()).toBe('This is a tooltip!');
        expect(component.maxWidth()).toBe('200px');
        expect(component.triggerType()).toBe('Button');
    });

    it('has expected positions list', () => {
        expect(component.positions).toEqual(['top', 'bottom', 'left', 'right']);
    });
});
