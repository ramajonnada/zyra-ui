import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraAccordion } from './zyra-accordion';
import { ZyraAccordionItem } from './zyra-accordion-item';

@Component({
    standalone: true,
    imports: [ZyraAccordion, ZyraAccordionItem],
    template: `
        <zyra-accordion>
            <zyra-accordion-item title="Section 1">Content 1</zyra-accordion-item>
            <zyra-accordion-item title="Section 2">Content 2</zyra-accordion-item>
            <zyra-accordion-item title="Section 3" [disabled]="true">Content 3</zyra-accordion-item>
        </zyra-accordion>
    `,
})
class AccordionHostComponent {}

@Component({
    standalone: true,
    imports: [ZyraAccordion, ZyraAccordionItem],
    template: `
        <zyra-accordion [allowMultiple]="true">
            <zyra-accordion-item title="A">Content A</zyra-accordion-item>
            <zyra-accordion-item title="B">Content B</zyra-accordion-item>
        </zyra-accordion>
    `,
})
class AccordionMultiHostComponent {}

describe('ZyraAccordionItem', () => {
    let fixture: ComponentFixture<AccordionHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionHostComponent);
        fixture.detectChanges();
    });

    it('renders item titles', () => {
        const titles: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__title',
        );
        expect(titles[0].textContent?.trim()).toBe('Section 1');
        expect(titles[1].textContent?.trim()).toBe('Section 2');
    });

    it('items are closed by default', () => {
        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        items.forEach((item) => expect(item.classList).not.toContain('zyr-accordion-item--open'));
    });

    it('opens an item on trigger click', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[0].click();
        fixture.detectChanges();

        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        expect(items[0].classList).toContain('zyr-accordion-item--open');
    });

    it('closes an open item on second trigger click', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[0].click();
        fixture.detectChanges();
        triggers[0].click();
        fixture.detectChanges();

        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        expect(items[0].classList).not.toContain('zyr-accordion-item--open');
    });

    it('does not open a disabled item on click', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[2].click();
        fixture.detectChanges();

        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        expect(items[2].classList).not.toContain('zyr-accordion-item--open');
    });

    it('applies --disabled class to disabled item trigger', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        expect(triggers[2].classList).toContain('zyr-accordion-item__trigger--disabled');
    });

    it('sets aria-expanded on the trigger', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        expect(triggers[0].getAttribute('aria-expanded')).toBe('false');

        triggers[0].click();
        fixture.detectChanges();

        expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    });

    it('panel has role="region"', () => {
        const panels: NodeList = fixture.nativeElement.querySelectorAll('[role="region"]');
        expect(panels.length).toBe(3);
    });
});

describe('ZyraAccordion — single open (default)', () => {
    let fixture: ComponentFixture<AccordionHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionHostComponent);
        fixture.detectChanges();
    });

    it('closes other items when one is opened', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[0].click();
        fixture.detectChanges();
        triggers[1].click();
        fixture.detectChanges();

        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        expect(items[0].classList).not.toContain('zyr-accordion-item--open');
        expect(items[1].classList).toContain('zyr-accordion-item--open');
    });
});

describe('ZyraAccordion — allowMultiple', () => {
    let fixture: ComponentFixture<AccordionMultiHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionMultiHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionMultiHostComponent);
        fixture.detectChanges();
    });

    it('keeps multiple items open simultaneously', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[0].click();
        fixture.detectChanges();
        triggers[1].click();
        fixture.detectChanges();

        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-accordion-item');
        expect(items[0].classList).toContain('zyr-accordion-item--open');
        expect(items[1].classList).toContain('zyr-accordion-item--open');
    });
});

describe('ZyraAccordion — keyboard navigation', () => {
    let fixture: ComponentFixture<AccordionHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionHostComponent);
        fixture.detectChanges();
    });

    it('moves focus to the next item on ArrowDown', () => {
        const accordionEl: HTMLElement = fixture.nativeElement.querySelector('zyra-accordion');
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[0].focus();

        accordionEl.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();

        expect(document.activeElement).toBe(triggers[1]);
    });

    it('moves focus to the previous item on ArrowUp', () => {
        const accordionEl: HTMLElement = fixture.nativeElement.querySelector('zyra-accordion');
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            '.zyr-accordion-item__trigger',
        );
        triggers[1].focus();

        accordionEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();

        expect(document.activeElement).toBe(triggers[0]);
    });
});
