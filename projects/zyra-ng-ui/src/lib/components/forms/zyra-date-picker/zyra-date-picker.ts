import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    input,
    model,
    OnDestroy,
    output,
    PLATFORM_ID,
    Renderer2,
    signal,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { calendarIcon } from '../../../shared/zyra-icons';
import { CalendarValue, DateRange, ZyraCalendar } from '../../data-display/zyra-calendar/zyra-calendar';

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerAppearance = 'outline' | 'filled' | 'underline';
export type DatePickerSelectionMode = 'single' | 'range';
export type DatePickerValue = Date | DateRange | null;

function isDateRange(val: DatePickerValue): val is DateRange {
    return !!val && typeof val === 'object' && !(val instanceof Date);
}

let datePickerIdCounter = 0;
const PANEL_GAP = 4;

@Component({
    selector: 'zyra-date-picker',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent, ZyraCalendar],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraDatePicker),
            multi: true,
        },
    ],
    templateUrl: './zyra-date-picker.html',
    styleUrl: './zyra-date-picker.scss',
})
export class ZyraDatePicker implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _renderer = inject(Renderer2);
    private readonly _document = inject(DOCUMENT);
    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    private readonly _trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
    private readonly _panel = viewChild.required<ElementRef<HTMLElement>>('panel');
    private readonly _reposition = (): void => this._updatePosition();

    // ── Inputs ────────────────────────────────────────────────
    placeholder = input<string>('Select date');
    size = input<DatePickerSize>('md');
    appearance = input<DatePickerAppearance>('outline');
    id = input<string>('');
    min = input<Date | null>(null);
    max = input<Date | null>(null);
    firstDayOfWeek = input<number>(0);
    locale = input<string>('en-US');
    selectionMode = input<DatePickerSelectionMode>('single');
    /** Closes the panel once a full selection is made. Ignored while a range is half-picked. */
    closeOnSelect = input(true, { transform: booleanAttribute });
    clearable = input(true, { transform: booleanAttribute });

    // ── Two-way state ─────────────────────────────────────────
    value = model<DatePickerValue>(null);

    // ── Outputs ───────────────────────────────────────────────
    // `valueChange` for the `value` model is emitted automatically by
    // `model()` — do not redeclare it, Angular treats that as a collision.
    opened = output<void>();
    closed = output<void>();

    // ── Internal state ────────────────────────────────────────
    readonly isOpen = signal(false);
    readonly isFocused = signal(false);
    private readonly _cvaDisabled = signal(false);
    disabled = input(false, { transform: booleanAttribute });

    readonly datePickerId = `zyr-date-picker-${++datePickerIdCounter}`;
    readonly panelId = `zyr-date-picker-panel-${datePickerIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.datePickerId);

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: DatePickerValue) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    // ── Computed ──────────────────────────────────────────────
    readonly isDisabledPicker = computed(() => this.disabled() || this._cvaDisabled());

    private readonly _formatter = computed(
        () => new Intl.DateTimeFormat(this.locale(), { year: 'numeric', month: 'short', day: 'numeric' }),
    );

    readonly displayLabel = computed(() => {
        const val = this.value();
        const fmt = this._formatter();
        if (!val) return '';
        if (val instanceof Date) return fmt.format(val);
        if (isDateRange(val)) {
            if (val.start && val.end) return `${fmt.format(val.start)} – ${fmt.format(val.end)}`;
            if (val.start) return `${fmt.format(val.start)} – …`;
            return '';
        }
        return '';
    });

    readonly hasValue = computed(() => {
        const val = this.value();
        if (!val) return false;
        return val instanceof Date ? true : !!(val.start || val.end);
    });

    readonly wrapClass = computed(() => {
        const parts = [
            'zyr-date-picker',
            `zyr-date-picker--${this.appearance()}`,
            `zyr-date-picker--${this.size()}`,
        ];
        if (this.isOpen()) parts.push('zyr-date-picker--open');
        if (this.isFocused()) parts.push('zyr-date-picker--focused');
        if (this.isDisabledPicker()) parts.push('zyr-date-picker--disabled');
        return parts.join(' ');
    });

    readonly icons = { calendarIcon };

    // ── CVA ───────────────────────────────────────────────────
    writeValue(val: DatePickerValue): void {
        this.value.set(val ?? null);
    }

    registerOnChange(fn: (val: DatePickerValue) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._cvaDisabled.set(isDisabled);
    }

    // ── Lifecycle ─────────────────────────────────────────────
    ngAfterViewInit(): void {
        // Move the panel out of any clipping ancestor (scroll containers,
        // overflow:hidden stages) by attaching it directly to <body>,
        // positioned via getBoundingClientRect() instead of CSS containment —
        // same technique as zyra-popover. Calendar's panel is tall enough
        // that it clips inside typical constrained containers otherwise.
        if (!this._isBrowser) return;
        this._renderer.appendChild(this._document.body, this._panel().nativeElement);
    }

    ngOnDestroy(): void {
        if (!this._isBrowser) return;
        this._removeListeners();
        this._panel().nativeElement.remove();
    }

    // ── Open / close ────────────────────────────────────────────
    toggle(): void {
        if (this.isDisabledPicker()) return;
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    open(): void {
        if (this.isDisabledPicker() || this.isOpen()) return;
        this.isOpen.set(true);
        this.opened.emit();
        if (!this._isBrowser) return;
        this._updatePosition();
        window.addEventListener('scroll', this._reposition, true);
        window.addEventListener('resize', this._reposition);
    }

    close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this._onTouched();
        this.closed.emit();
        if (!this._isBrowser) return;
        this._removeListeners();
    }

    private _removeListeners(): void {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
    }

    private _updatePosition(): void {
        const trigger = this._trigger().nativeElement;
        const panel = this._panel().nativeElement;
        const rect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top = rect.bottom + PANEL_GAP;
        let left = rect.left;

        // Flip above the trigger if there isn't room below.
        if (top + panelRect.height > vh - PANEL_GAP && rect.top - panelRect.height - PANEL_GAP > 0) {
            top = rect.top - panelRect.height - PANEL_GAP;
        }

        left = Math.min(Math.max(left, PANEL_GAP), vw - panelRect.width - PANEL_GAP);

        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
        panel.style.minWidth = `${rect.width}px`;
    }

    // ── Selection ─────────────────────────────────────────────
    // Calendar's own value type (CalendarValue) is a superset of ours
    // (it also allows Date[] for its 'multiple' mode); Date Picker only ever
    // uses 'single' | 'range', so this narrowing is always safe in practice.
    onCalendarValueChange(val: CalendarValue): void {
        this.value.set(val as DatePickerValue);
        this._onChange(this.value());
    }

    onCalendarDateSelected(): void {
        const val = this.value();
        const complete = this.selectionMode() === 'single' || (isDateRange(val) && !!val.start && !!val.end);
        if (complete && this.closeOnSelect()) this.close();
    }

    selectToday(): void {
        if (this.isDisabledPicker() || this.selectionMode() !== 'single') return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.value.set(today);
        this._onChange(today);
        if (this.closeOnSelect()) this.close();
    }

    clear(event?: Event): void {
        event?.stopPropagation();
        if (this.isDisabledPicker()) return;
        this.value.set(null);
        this._onChange(null);
    }

    // ── Focus / blur ──────────────────────────────────────────
    onFocus(): void {
        this.isFocused.set(true);
    }

    onBlur(): void {
        this.isFocused.set(false);
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowDown':
            case 'Enter':
            case ' ':
                if (!this.isOpen()) {
                    event.preventDefault();
                    this.open();
                }
                break;
            case 'Escape':
                if (this.isOpen()) {
                    event.preventDefault();
                    this.close();
                }
                break;
            case 'Tab':
                if (this.isOpen()) this.close();
                break;
        }
    }

    // ── Click outside ─────────────────────────────────────────
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.isOpen()) return;
        const target = event.target as Node;
        // The panel is portaled to <body>, so it's no longer a descendant of
        // the host — check both, same as zyra-popover's own outside-click guard.
        const insideTrigger = this._el.nativeElement.contains(target);
        const insidePanel = this._panel().nativeElement.contains(target);
        if (!insideTrigger && !insidePanel) {
            this.close();
        }
    }
}
