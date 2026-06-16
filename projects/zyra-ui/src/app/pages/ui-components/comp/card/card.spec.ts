import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

describe('Card demo', () => {
    let fixture: ComponentFixture<Card>;
    let component: Card;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Card] }).compileComponents();
        fixture = TestBed.createComponent(Card);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.variant()).toBe('default');
        expect(component.padding()).toBe('md');
        expect(component.hasHeader()).toBeFalse();
        expect(component.hasFooter()).toBeFalse();
        expect(component.clickable()).toBeFalse();
        expect(component.preset()).toBe('Simple text');
        expect(component.eventLog()).toEqual([]);
    });

    it('updates variant signal', () => {
        component.variant.set('elevated');
        expect(component.variant()).toBe('elevated');
    });

    it('updates padding signal', () => {
        component.padding.set('lg');
        expect(component.padding()).toBe('lg');
    });

    it('updates hasHeader signal', () => {
        component.hasHeader.set(true);
        expect(component.hasHeader()).toBeTrue();
    });

    it('updates hasFooter signal', () => {
        component.hasFooter.set(true);
        expect(component.hasFooter()).toBeTrue();
    });

    it('updates clickable signal', () => {
        component.clickable.set(true);
        expect(component.clickable()).toBeTrue();
    });

    it('generatedCode omits defaults', () => {
        const code = component.generatedCode();
        expect(code).toContain('<zyra-card>');
        expect(code).not.toContain('variant=');
        expect(code).not.toContain('padding=');
    });

    it('generatedCode includes variant when not default', () => {
        component.variant.set('outlined');
        expect(component.generatedCode()).toContain('variant="outlined"');
    });

    it('generatedCode includes header slot when hasHeader', () => {
        component.hasHeader.set(true);
        expect(component.generatedCode()).toContain('slot="header"');
    });

    it('generatedCode includes footer slot when hasFooter', () => {
        component.hasFooter.set(true);
        expect(component.generatedCode()).toContain('slot="footer"');
    });

    it('generatedCode includes [clickable] and (cardClick) when clickable', () => {
        component.clickable.set(true);
        const code = component.generatedCode();
        expect(code).toContain('[clickable]="true"');
        expect(code).toContain('(cardClick)');
    });

    it('log() appends to eventLog', () => {
        component.log('test event');
        expect(component.eventLog().length).toBe(1);
        expect(component.eventLog()[0].msg).toBe('test event');
    });

    it('log() prepends newest entry', () => {
        component.log('first');
        component.log('second');
        expect(component.eventLog()[0].msg).toBe('second');
    });

    it('reset() restores all defaults', () => {
        component.variant.set('elevated');
        component.padding.set('lg');
        component.hasHeader.set(true);
        component.hasFooter.set(true);
        component.clickable.set(true);
        component.log('test');
        component.reset();
        expect(component.variant()).toBe('default');
        expect(component.padding()).toBe('md');
        expect(component.hasHeader()).toBeFalse();
        expect(component.hasFooter()).toBeFalse();
        expect(component.clickable()).toBeFalse();
        expect(component.eventLog()).toEqual([]);
    });
});
