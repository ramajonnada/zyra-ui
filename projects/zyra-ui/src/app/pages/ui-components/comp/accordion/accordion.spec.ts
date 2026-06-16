import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion } from './accordion';

describe('Accordion demo', () => {
    let fixture: ComponentFixture<Accordion>;
    let component: Accordion;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Accordion] }).compileComponents();
        fixture = TestBed.createComponent(Accordion);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has allowMultiple defaulting to false', () => {
        expect(component.allowMultiple()).toBeFalse();
    });

    it('has copied defaulting to false', () => {
        expect(component.copied()).toBeFalse();
    });

    it('updates allowMultiple signal', () => {
        component.allowMultiple.set(true);
        expect(component.allowMultiple()).toBeTrue();
    });

    it('generatedCode contains zyra-accordion', () => {
        expect(component.generatedCode()).toContain('zyra-accordion');
    });

    it('generatedCode contains zyra-accordion-item', () => {
        expect(component.generatedCode()).toContain('zyra-accordion-item');
    });

    it('generatedCode omits [allowMultiple] by default', () => {
        expect(component.generatedCode()).not.toContain('[allowMultiple]');
    });

    it('generatedCode includes [allowMultiple]="true" when set', () => {
        component.allowMultiple.set(true);
        expect(component.generatedCode()).toContain('[allowMultiple]="true"');
    });

    it('reset() restores allowMultiple to false', () => {
        component.allowMultiple.set(true);
        component.reset();
        expect(component.allowMultiple()).toBeFalse();
    });

    it('has controlDefs with allowMultiple toggle', () => {
        const def = component.controlDefs.find(d => d.key === 'allowMultiple');
        expect(def).toBeTruthy();
        expect(def?.type).toBe('toggle');
    });
});
