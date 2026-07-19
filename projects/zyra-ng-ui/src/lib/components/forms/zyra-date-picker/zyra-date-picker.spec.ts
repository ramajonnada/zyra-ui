import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DateRange } from '../../data-display/zyra-calendar/zyra-calendar';
import { DatePickerSelectionMode, ZyraDatePicker } from './zyra-date-picker';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraDatePicker],
    template: `
        <zyra-date-picker
            [(ngModel)]="value"
            [placeholder]="placeholder()"
            [selectionMode]="selectionMode()"
            [max]="max()"
        />
    `,
})
class DatePickerHostComponent {
    value = signal<Date | DateRange | null>(null);
    placeholder = signal('Select date');
    selectionMode = signal<DatePickerSelectionMode>('single');
    max = signal<Date | null>(null);
}

describe('ZyraDatePicker', () => {
    let fixture: ComponentFixture<DatePickerHostComponent>;
    let host: DatePickerHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatePickerHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(DatePickerHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    // ── Placeholder ───────────────────────────────────────────────────────
    it('shows placeholder when no value is selected', () => {
        const value: HTMLElement = fixture.nativeElement.querySelector('.zyr-date-picker__value');
        expect(value.textContent?.trim()).toBe('Select date');
        expect(value.classList).toContain('zyr-date-picker__value--placeholder');
    });

    // ── Panel open/close ──────────────────────────────────────────────────
    it('opens the panel on trigger click', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        expect(openPanel()).not.toBeNull();
    });

    it('closes the panel on a second trigger click', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        trigger(fixture).click();
        fixture.detectChanges();
        expect(openPanel()).toBeNull();
    });

    // ── Portal to <body> ──────────────────────────────────────────────────
    it('renders the panel as a child of document.body, not inside the fixture', () => {
        expect(fixture.nativeElement.querySelector('.zyr-date-picker__panel')).toBeNull();
        expect(panel().parentElement).toBe(document.body);
    });

    it('removes the panel from document.body when the component is destroyed', () => {
        expect(document.body.querySelector('.zyr-date-picker__panel')).not.toBeNull();
        fixture.destroy();
        expect(document.body.querySelector('.zyr-date-picker__panel')).toBeNull();
    });

    // ── Selection (single) ───────────────────────────────────────────────
    it('updates the bound value and closes the panel when a day is picked', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        firstSelectableDay().click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBeInstanceOf(Date);
        expect(openPanel()).toBeNull();
    });

    it('displays the formatted date in the trigger after selection', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        firstSelectableDay().click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const valueEl: HTMLElement = fixture.nativeElement.querySelector('.zyr-date-picker__value');
        expect(valueEl.classList).not.toContain('zyr-date-picker__value--placeholder');
        expect(valueEl.textContent?.trim().length).toBeGreaterThan(0);
    });

    // ── Selection (range) ────────────────────────────────────────────────
    it('keeps the panel open after only the range start is picked', async () => {
        host.selectionMode.set('range');
        fixture.detectChanges();

        trigger(fixture).click();
        fixture.detectChanges();
        firstSelectableDay().click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(openPanel()).not.toBeNull();
    });

    it('closes the panel once a full range is picked', async () => {
        host.selectionMode.set('range');
        fixture.detectChanges();

        trigger(fixture).click();
        fixture.detectChanges();
        const days = selectableDays();
        days[0].click();
        fixture.detectChanges();
        days[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(openPanel()).toBeNull();
        const val = host.value() as DateRange;
        expect(val.start).toBeInstanceOf(Date);
        expect(val.end).toBeInstanceOf(Date);
    });

    // ── Clear / Today ─────────────────────────────────────────────────────
    it('clears the value via the footer Clear button', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        firstSelectableDay().click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        trigger(fixture).click();
        fixture.detectChanges();
        footerButton('Clear').click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBeNull();
    });

    it('sets today via the footer Today button', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        footerButton('Today').click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const today = new Date();
        const val = host.value() as Date;
        expect(val.toDateString()).toBe(today.toDateString());
    });

    it('does not select today via the footer button when it is outside max', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        host.max.set(yesterday);
        fixture.detectChanges();

        trigger(fixture).click();
        fixture.detectChanges();
        footerButton('Today').click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBeNull();
        expect(footerButton('Today').disabled).toBeTrue();
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('opens panel on ArrowDown', () => {
        datePickerEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        expect(openPanel()).not.toBeNull();
    });

    it('opens the panel on Enter when the trigger is focused (role="button" div, not a native button)', () => {
        trigger(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(openPanel()).not.toBeNull();
    });

    it('opens the panel on Space when the trigger is focused', () => {
        trigger(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();
        expect(openPanel()).not.toBeNull();
    });

    it('closes the panel on Escape key', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        datePickerEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        fixture.detectChanges();
        expect(openPanel()).toBeNull();
    });

    it('moves focus into the calendar on Tab instead of closing the panel', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        datePickerEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        fixture.detectChanges();
        expect(openPanel()).not.toBeNull();
        expect(document.activeElement?.closest('.zyr-date-picker__panel')).not.toBeNull();
    });

    it('closes the panel on Shift+Tab', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        datePickerEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }),
        );
        fixture.detectChanges();
        expect(openPanel()).toBeNull();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('trigger has aria-haspopup="dialog" and reflects aria-expanded', () => {
        const btn: HTMLElement = trigger(fixture);
        expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
        expect(btn.getAttribute('aria-expanded')).toBe('false');

        btn.click();
        fixture.detectChanges();
        expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
});

function trigger(f: ComponentFixture<DatePickerHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('.zyr-date-picker__open-btn');
}

function datePickerEl(f: ComponentFixture<DatePickerHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('zyra-date-picker');
}

// The panel is portaled to document.body to escape ancestor clipping, so it
// never appears inside the fixture's own DOM subtree — see ngAfterViewInit().
function panel(): HTMLElement {
    return document.body.querySelector('.zyr-date-picker__panel')!;
}

function openPanel(): HTMLElement | null {
    return document.body.querySelector('.zyr-date-picker__panel--open');
}

function selectableDays(): HTMLButtonElement[] {
    return Array.from(
        document.body.querySelectorAll('.zyr-calendar__day:not(.zyr-calendar__day--outside)'),
    ) as HTMLButtonElement[];
}

function firstSelectableDay(): HTMLButtonElement {
    return selectableDays()[0];
}

function footerButton(label: string): HTMLButtonElement {
    const buttons: HTMLButtonElement[] = Array.from(
        document.body.querySelectorAll('.zyr-date-picker__footer-btn'),
    );
    return buttons.find((b) => b.textContent?.trim() === label)!;
}
