import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalendarValue, ZyraCalendar, type CalendarSelectionMode } from './zyra-calendar';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraCalendar],
    template: `
        <zyra-calendar
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [min]="min()"
            [max]="max()"
            [disabled]="disabled()"
        />
    `,
})
class CalendarHostComponent {
    value = signal<Date | null>(null);
    min = signal<Date | null>(null);
    max = signal<Date | null>(null);
    disabled = signal(false);
}

@Component({
    standalone: true,
    imports: [FormsModule, ZyraCalendar],
    template: `
        <zyra-calendar
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [selectionMode]="selectionMode()"
        />
    `,
})
class CalendarSelectionHostComponent {
    value = signal<CalendarValue>(null);
    selectionMode = signal<CalendarSelectionMode>('single');
}

function calendar(fixture: ComponentFixture<unknown>): ZyraCalendar {
    return fixture.debugElement.children[0].componentInstance as ZyraCalendar;
}

function dayButtons(fixture: ComponentFixture<unknown>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.zyr-calendar__day'));
}

describe('ZyraCalendar', () => {
    let fixture: ComponentFixture<CalendarHostComponent>;
    let host: CalendarHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('opens on the current month by default', () => {
        const now = new Date();
        expect(calendar(fixture).viewMonth()).toBe(now.getMonth());
        expect(calendar(fixture).viewYear()).toBe(now.getFullYear());
    });

    it('renders 6 weeks of 7 days', () => {
        const weeks: HTMLElement[] = fixture.nativeElement.querySelectorAll('.zyr-calendar__week');
        expect(weeks.length).toBe(6);
        expect(dayButtons(fixture).length).toBe(42);
    });

    it('navigates to the next and previous month', () => {
        const cal = calendar(fixture);
        const startMonth = cal.viewMonth();

        cal.nextMonth();
        fixture.detectChanges();
        expect(cal.viewMonth()).toBe((startMonth + 1) % 12);

        cal.prevMonth();
        fixture.detectChanges();
        expect(cal.viewMonth()).toBe(startMonth);
    });

    it('selects a date on click and updates the model', () => {
        const cal = calendar(fixture);
        const inMonthDay = dayButtons(fixture).find(
            (b) => !b.classList.contains('zyr-calendar__day--outside'),
        )!;
        inMonthDay.click();
        fixture.detectChanges();

        expect(host.value()).not.toBeNull();
        expect(inMonthDay.classList).toContain('zyr-calendar__day--selected');
    });

    it('marks today with the --today class', () => {
        const todayCell = fixture.nativeElement.querySelector('.zyr-calendar__day--today');
        expect(todayCell).not.toBeNull();
    });

    it('disables dates before min', () => {
        const now = new Date();
        const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        min.setDate(min.getDate() + 5);
        host.min.set(min);
        fixture.detectChanges();

        const todayCell: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyr-calendar__day--today',
        );
        expect(todayCell.disabled).toBeTrue();
    });

    it('disables dates after max', () => {
        const now = new Date();
        const max = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        max.setDate(max.getDate() - 5);
        host.max.set(max);
        fixture.detectChanges();

        const todayCell: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyr-calendar__day--today',
        );
        expect(todayCell.disabled).toBeTrue();
    });

    it('does not select a disabled date', () => {
        const now = new Date();
        const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        min.setDate(min.getDate() + 5);
        host.min.set(min);
        fixture.detectChanges();

        const todayCell: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyr-calendar__day--today',
        );
        todayCell.click();
        fixture.detectChanges();

        expect(host.value()).toBeNull();
    });

    it('disables all interaction when disabled is true', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        expect(
            fixture.nativeElement.querySelector('.zyr-calendar--disabled'),
        ).not.toBeNull();
    });

    it('navigates focus with arrow keys', () => {
        const cal = calendar(fixture);
        const root: HTMLElement = fixture.nativeElement.querySelector('.zyr-calendar');
        const before = cal.focusedDate().getDate();

        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();

        expect(cal.focusedDate().getDate()).toBe(before + 1);
    });

    it('selects the focused date on Enter', () => {
        const cal = calendar(fixture);
        const root: HTMLElement = fixture.nativeElement.querySelector('.zyr-calendar');

        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();

        expect(host.value()?.getDate()).toBe(cal.focusedDate().getDate());
    });

    it('has role="grid" on the weeks container', () => {
        expect(fixture.nativeElement.querySelector('[role="grid"]')).not.toBeNull();
    });

    // ── Month picker ──────────────────────────────────────────────────────
    describe('month picker', () => {
        it('switches to the month grid when the month label is clicked', () => {
            const label: HTMLButtonElement =
                fixture.nativeElement.querySelector('.zyr-calendar__month-label');
            label.click();
            fixture.detectChanges();

            expect(calendar(fixture).viewMode()).toBe('months');
            expect(fixture.nativeElement.querySelectorAll('.zyr-calendar__month-option').length).toBe(
                12,
            );
        });

        it('jumps to the picked month and returns to day view', () => {
            const cal = calendar(fixture);
            cal.openMonthPicker();
            fixture.detectChanges();

            const options: HTMLButtonElement[] = Array.from(
                fixture.nativeElement.querySelectorAll('.zyr-calendar__month-option'),
            );
            options[0].click();
            fixture.detectChanges();

            expect(cal.viewMode()).toBe('days');
            expect(cal.viewMonth()).toBe(0);
        });

        it('navigates by year while in the month picker', () => {
            const cal = calendar(fixture);
            cal.openMonthPicker();
            fixture.detectChanges();
            const startYear = cal.viewYear();

            cal.nextYear();
            fixture.detectChanges();
            expect(cal.viewYear()).toBe(startYear + 1);

            cal.prevYear();
            fixture.detectChanges();
            expect(cal.viewYear()).toBe(startYear);
        });

        it('ignores arrow-key day navigation while the month picker is open', () => {
            const cal = calendar(fixture);
            cal.openMonthPicker();
            fixture.detectChanges();
            const before = cal.focusedDate().getDate();

            const root: HTMLElement = fixture.nativeElement.querySelector('.zyr-calendar');
            root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            fixture.detectChanges();

            expect(cal.focusedDate().getDate()).toBe(before);
        });
    });
});

describe('ZyraCalendar — multiple selection', () => {
    let fixture: ComponentFixture<CalendarSelectionHostComponent>;
    let host: CalendarSelectionHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarSelectionHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarSelectionHostComponent);
        host = fixture.componentInstance;
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('accumulates dates as an array', () => {
        const days: HTMLButtonElement[] = Array.from(
            fixture.nativeElement.querySelectorAll(
                '.zyr-calendar__day:not(.zyr-calendar__day--outside)',
            ),
        );
        days[0].click();
        fixture.detectChanges();
        days[1].click();
        fixture.detectChanges();

        expect(Array.isArray(host.value())).toBeTrue();
        expect((host.value() as Date[]).length).toBe(2);
    });

    it('toggles a date off when clicked again', () => {
        const days: HTMLButtonElement[] = Array.from(
            fixture.nativeElement.querySelectorAll(
                '.zyr-calendar__day:not(.zyr-calendar__day--outside)',
            ),
        );
        days[0].click();
        fixture.detectChanges();
        days[0].click();
        fixture.detectChanges();

        expect((host.value() as Date[]).length).toBe(0);
    });

    it('marks every selected day with --selected', () => {
        const days: HTMLButtonElement[] = Array.from(
            fixture.nativeElement.querySelectorAll(
                '.zyr-calendar__day:not(.zyr-calendar__day--outside)',
            ),
        );
        days[0].click();
        days[2].click();
        fixture.detectChanges();

        expect(days[0].classList).toContain('zyr-calendar__day--selected');
        expect(days[2].classList).toContain('zyr-calendar__day--selected');
        expect(days[1].classList).not.toContain('zyr-calendar__day--selected');
    });
});

describe('ZyraCalendar — range selection', () => {
    let fixture: ComponentFixture<CalendarSelectionHostComponent>;
    let host: CalendarSelectionHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarSelectionHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarSelectionHostComponent);
        host = fixture.componentInstance;
        host.selectionMode.set('range');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    function inMonthDays(fixture: ComponentFixture<unknown>): HTMLButtonElement[] {
        return Array.from(
            fixture.nativeElement.querySelectorAll(
                '.zyr-calendar__day:not(.zyr-calendar__day--outside)',
            ),
        );
    }

    it('sets the start of the range on the first click', () => {
        const days = inMonthDays(fixture);
        days[2].click();
        fixture.detectChanges();

        const range = host.value() as { start: Date | null; end: Date | null };
        expect(range.start).not.toBeNull();
        expect(range.end).toBeNull();
        expect(days[2].classList).toContain('zyr-calendar__day--range-start');
    });

    it('completes the range on the second click', () => {
        const days = inMonthDays(fixture);
        days[2].click();
        fixture.detectChanges();
        days[6].click();
        fixture.detectChanges();

        const range = host.value() as { start: Date | null; end: Date | null };
        expect(range.start).not.toBeNull();
        expect(range.end).not.toBeNull();
        expect(days[6].classList).toContain('zyr-calendar__day--range-end');
    });

    it('marks days between start and end as in-range', () => {
        const days = inMonthDays(fixture);
        days[2].click();
        fixture.detectChanges();
        days[6].click();
        fixture.detectChanges();

        expect(days[4].classList).toContain('zyr-calendar__day--in-range');
    });

    it('normalizes the range when the second click is before the first', () => {
        const days = inMonthDays(fixture);
        days[6].click();
        fixture.detectChanges();
        days[2].click();
        fixture.detectChanges();

        const range = host.value() as { start: Date; end: Date };
        expect(range.start.getTime()).toBeLessThan(range.end.getTime());
    });

    it('starts a new range after completing one', () => {
        const days = inMonthDays(fixture);
        days[2].click();
        fixture.detectChanges();
        days[6].click();
        fixture.detectChanges();
        days[10].click();
        fixture.detectChanges();

        const range = host.value() as { start: Date | null; end: Date | null };
        expect(range.end).toBeNull();
    });
});
