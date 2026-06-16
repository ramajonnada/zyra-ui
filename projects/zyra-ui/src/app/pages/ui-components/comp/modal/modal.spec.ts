import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';

describe('Modal demo', () => {
    let fixture: ComponentFixture<Modal>;
    let component: Modal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Modal] }).compileComponents();
        fixture = TestBed.createComponent(Modal);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.open()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.title()).toBe('Confirm action');
        expect(component.dismissible()).toBeTrue();
        expect(component.deleteModal()).toBeFalse();
        expect(component.infoModal()).toBeFalse();
        expect(component.forcedModal()).toBeFalse();
    });

    it('updates open signal', () => {
        component.open.set(true);
        expect(component.open()).toBeTrue();
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates title signal', () => {
        component.title.set('Delete item?');
        expect(component.title()).toBe('Delete item?');
    });

    it('updates dismissible signal', () => {
        component.dismissible.set(false);
        expect(component.dismissible()).toBeFalse();
    });

    it('updates deleteModal signal', () => {
        component.deleteModal.set(true);
        expect(component.deleteModal()).toBeTrue();
    });

    it('updates infoModal signal', () => {
        component.infoModal.set(true);
        expect(component.infoModal()).toBeTrue();
    });

    it('updates forcedModal signal', () => {
        component.forcedModal.set(true);
        expect(component.forcedModal()).toBeTrue();
    });

    it('generatedCode contains zyra-modal', () => {
        expect(component.generatedCode()).toContain('zyra-modal');
    });

    it('generatedCode includes [(open)]="isOpen"', () => {
        expect(component.generatedCode()).toContain('[(open)]="isOpen"');
    });

    it('generatedCode omits size when md (default)', () => {
        expect(component.generatedCode()).not.toContain('size=');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('xl');
        expect(component.generatedCode()).toContain('size="xl"');
    });

    it('generatedCode includes title', () => {
        expect(component.generatedCode()).toContain('title="Confirm action"');
    });

    it('generatedCode includes [dismissible]="false" when not dismissible', () => {
        component.dismissible.set(false);
        expect(component.generatedCode()).toContain('[dismissible]="false"');
    });

    it('generatedCode omits dismissible when true (default)', () => {
        expect(component.generatedCode()).not.toContain('[dismissible]');
    });

    it('generatedCode includes footer slot', () => {
        expect(component.generatedCode()).toContain('slot="footer"');
    });

    it('reset() restores all defaults', () => {
        component.open.set(true);
        component.size.set('xl');
        component.title.set('Other');
        component.dismissible.set(false);
        component.reset();
        expect(component.open()).toBeFalse();
        expect(component.size()).toBe('md');
        expect(component.title()).toBe('Confirm action');
        expect(component.dismissible()).toBeTrue();
    });

    it('has controlDefs with size, title, and dismissible', () => {
        const keys = component.controlDefs.map(d => d.key);
        expect(keys).toContain('size');
        expect(keys).toContain('title');
        expect(keys).toContain('dismissible');
    });
});
