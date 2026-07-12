import {
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    HostListener,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { caretLeft, caretRight } from '../../../shared/zyra-icons';

export interface CalendarDay {
    date: Date;
    inCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
    isDisabled: boolean;
}

export interface CalendarMonthOption {
    month: number;
    label: string;
    isCurrent: boolean;
}

export type CalendarViewMode = 'days' | 'months';
export type CalendarSelectionMode = 'single' | 'multiple' | 'range';

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export type CalendarValue = Date | Date[] | DateRange | null;

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isDateRange(val: CalendarValue): val is DateRange {
    return !!val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date);
}

@Component({
    selector: 'zyra-calendar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraCalendar),
            multi: true,
        },
    ],
    templateUrl: './zyra-calendar.html',
    styleUrl: './zyra-calendar.scss',
})
export class ZyraCalendar implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    min = input<Date | null>(null);
    max = input<Date | null>(null);
    disabled = input(false);
    /** 0 = Sunday (default), 1 = Monday, ... 6 = Saturday. */
    firstDayOfWeek = input<number>(0);
    locale = input<string>('en-US');
    /** 'single' (default) = one Date; 'multiple' = Date[]; 'range' = { start, end }. */
    selectionMode = input<CalendarSelectionMode>('single');

    // ── Two-way state ─────────────────────────────────────────
    /** Shape depends on selectionMode: Date | null, Date[], or DateRange. */
    value = model<CalendarValue>(null);

    // ── Outputs ───────────────────────────────────────────────
    dateSelected = output<Date>();
    monthChange = output<{ year: number; month: number }>();

    // ── Internal state ────────────────────────────────────────
    private readonly _today = startOfDay(new Date());
    readonly viewYear = signal(this._today.getFullYear());
    readonly viewMonth = signal(this._today.getMonth());
    readonly focusedDate = signal<Date>(this._today);
    readonly viewMode = signal<CalendarViewMode>('days');
    private readonly _cvaDisabled = signal(false);
    /** Anchor date for an in-progress range selection (start picked, end not yet). */
    private readonly _rangeAnchor = signal<Date | null>(null);

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: CalendarValue) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    // ── Computed ──────────────────────────────────────────────
    readonly isDisabledCalendar = computed(() => this.disabled() || this._cvaDisabled());

    readonly monthLabel = computed(() =>
        new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }).format(
            new Date(this.viewYear(), this.viewMonth(), 1),
        ),
    );

    readonly yearLabel = computed(() => `${this.viewYear()}`);

    readonly monthOptions = computed<CalendarMonthOption[]>(() => {
        const fmt = new Intl.DateTimeFormat(this.locale(), { month: 'short' });
        const year = this.viewYear();
        return Array.from({ length: 12 }, (_, month) => ({
            month,
            label: fmt.format(new Date(year, month, 1)),
            isCurrent: month === this.viewMonth(),
        }));
    });

    readonly weekdayLabels = computed(() => {
        const first = this.firstDayOfWeek();
        const fmt = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
        // 2024-01-07 is a Sunday — a stable reference to rotate from.
        return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + ((first + i) % 7))));
    });

    /** Normalized range read from `value` when selectionMode is 'range'. */
    private readonly _range = computed<DateRange>(() => {
        const val = this.value();
        return isDateRange(val) ? val : { start: null, end: null };
    });

    /** Normalized list read from `value` when selectionMode is 'multiple'. */
    private readonly _multiValues = computed<Date[]>(() => {
        const val = this.value();
        return Array.isArray(val) ? val : [];
    });

    readonly weeks = computed<CalendarDay[][]>(() => {
        const year = this.viewYear();
        const month = this.viewMonth();
        const first = this.firstDayOfWeek();
        const mode = this.selectionMode();

        const firstOfMonth = new Date(year, month, 1);
        const leadingCount = (firstOfMonth.getDay() - first + 7) % 7;
        const gridStart = new Date(year, month, 1 - leadingCount);

        const singleValue = mode === 'single' && this.value() instanceof Date ? (this.value() as Date) : null;
        const multiValues = mode === 'multiple' ? this._multiValues() : [];
        const range = mode === 'range' ? this._range() : { start: null, end: null };

        const days: CalendarDay[] = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);

            const isRangeStart = !!range.start && sameDay(date, range.start);
            const isRangeEnd = !!range.end && sameDay(date, range.end);
            const isInRange =
                !!range.start && !!range.end && date > startOfDay(range.start) && date < startOfDay(range.end);

            const isSelected =
                mode === 'single'
                    ? !!singleValue && sameDay(date, singleValue)
                    : mode === 'multiple'
                      ? multiValues.some((d) => sameDay(date, d))
                      : isRangeStart || isRangeEnd;

            days.push({
                date,
                inCurrentMonth: date.getMonth() === month,
                isToday: sameDay(date, this._today),
                isSelected,
                isRangeStart,
                isRangeEnd,
                isInRange,
                isDisabled: this._isDateDisabled(date),
            });
        }

        const weeks: CalendarDay[][] = [];
        for (let i = 0; i < 42; i += 7) weeks.push(days.slice(i, i + 7));
        return weeks;
    });

    readonly icons = { caretLeft, caretRight };

    // ── CVA ───────────────────────────────────────────────────
    writeValue(val: CalendarValue): void {
        this.value.set(val);
        this._rangeAnchor.set(null);

        const focusTarget = this._firstFocusableDate(val);
        if (focusTarget) {
            this.viewYear.set(focusTarget.getFullYear());
            this.viewMonth.set(focusTarget.getMonth());
            this.focusedDate.set(startOfDay(focusTarget));
        }
    }

    private _firstFocusableDate(val: CalendarValue): Date | null {
        if (val instanceof Date) return val;
        if (Array.isArray(val)) return val[0] ?? null;
        if (isDateRange(val)) return val.start ?? val.end ?? null;
        return null;
    }

    registerOnChange(fn: (val: CalendarValue) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._cvaDisabled.set(isDisabled);
    }

    // ── Navigation ────────────────────────────────────────────
    prevMonth(): void {
        this._shiftMonth(-1);
    }

    nextMonth(): void {
        this._shiftMonth(1);
    }

    private _shiftMonth(delta: number): void {
        const date = new Date(this.viewYear(), this.viewMonth() + delta, 1);
        this.viewYear.set(date.getFullYear());
        this.viewMonth.set(date.getMonth());
        this.monthChange.emit({ year: date.getFullYear(), month: date.getMonth() });
    }

    // ── Month-picker view ─────────────────────────────────────
    openMonthPicker(): void {
        if (this.isDisabledCalendar()) return;
        this.viewMode.set('months');
    }

    closeMonthPicker(): void {
        this.viewMode.set('days');
    }

    prevYear(): void {
        this.viewYear.update((y) => y - 1);
    }

    nextYear(): void {
        this.viewYear.update((y) => y + 1);
    }

    pickMonth(option: CalendarMonthOption): void {
        this.viewMonth.set(option.month);
        this.viewMode.set('days');
        this.monthChange.emit({ year: this.viewYear(), month: option.month });
    }

    // ── Selection ─────────────────────────────────────────────
    selectDate(day: CalendarDay): void {
        if (this.isDisabledCalendar() || day.isDisabled) return;

        switch (this.selectionMode()) {
            case 'single':
                this._commit(day.date);
                break;
            case 'multiple':
                this._toggleMultiple(day.date);
                break;
            case 'range':
                this._pickRange(day.date);
                break;
        }

        this.focusedDate.set(day.date);
        if (!day.inCurrentMonth) {
            this.viewYear.set(day.date.getFullYear());
            this.viewMonth.set(day.date.getMonth());
        }
        this._onTouched();
        this.dateSelected.emit(day.date);
    }

    private _toggleMultiple(date: Date): void {
        const current = this._multiValues();
        const exists = current.some((d) => sameDay(d, date));
        const next = exists ? current.filter((d) => !sameDay(d, date)) : [...current, date];
        this._commit(next);
    }

    private _pickRange(date: Date): void {
        const anchor = this._rangeAnchor();

        if (!anchor) {
            // Starting a new range.
            this._rangeAnchor.set(date);
            this._commit({ start: date, end: null });
            return;
        }

        // Completing the range — normalize so start <= end regardless of click order.
        const start = date < anchor ? date : anchor;
        const end = date < anchor ? anchor : date;
        this._rangeAnchor.set(null);
        this._commit({ start, end });
    }

    private _commit(val: CalendarValue): void {
        this.value.set(val);
        this._onChange(val);
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (this.isDisabledCalendar() || this.viewMode() !== 'days') return;
        const deltas: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7,
        };

        if (event.key in deltas) {
            event.preventDefault();
            const next = new Date(this.focusedDate());
            next.setDate(next.getDate() + deltas[event.key]);
            this._moveFocus(next);
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const focused = this.focusedDate();
            this.selectDate({
                date: focused,
                inCurrentMonth: focused.getMonth() === this.viewMonth(),
                isToday: sameDay(focused, this._today),
                isSelected: false,
                isRangeStart: false,
                isRangeEnd: false,
                isInRange: false,
                isDisabled: this._isDateDisabled(focused),
            });
        }
    }

    private _moveFocus(date: Date): void {
        this.focusedDate.set(date);
        if (date.getMonth() !== this.viewMonth() || date.getFullYear() !== this.viewYear()) {
            this.viewYear.set(date.getFullYear());
            this.viewMonth.set(date.getMonth());
        }
    }

    private _isDateDisabled(date: Date): boolean {
        const min = this.min();
        const max = this.max();
        if (min && date < startOfDay(min)) return true;
        if (max && date > startOfDay(max)) return true;
        return false;
    }
}
