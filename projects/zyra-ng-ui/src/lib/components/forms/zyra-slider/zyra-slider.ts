import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SliderSize = 'sm' | 'md' | 'lg';

let sliderIdCounter = 0;

@Component({
    selector: 'zyra-slider',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraSlider),
            multi: true,
        },
    ],
    templateUrl: './zyra-slider.html',
    styleUrl: './zyra-slider.scss',
})
export class ZyraSlider implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    min = input<number>(0);
    max = input<number>(100);
    step = input<number>(1);
    size = input<SliderSize>('md');
    disabled = input(false, { transform: booleanAttribute });
    showValue = input(false, { transform: booleanAttribute });
    /** Formats the displayed value, e.g. (v) => `${v}%`. */
    valueLabel = input<(value: number) => string>((v) => `${v}`);
    id = input<string>('');

    // ── Two-way state ─────────────────────────────────────────
    value = model<number>(0);

    // ── Outputs ───────────────────────────────────────────────
    changed = output<number>();

    // ── Internal state ────────────────────────────────────────
    private readonly _cvaDisabled = signal(false);

    // ── Unique ID ─────────────────────────────────────────────
    readonly sliderId = `zyr-slider-${++sliderIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.sliderId);

    // ── Computed ──────────────────────────────────────────────
    readonly isDisabled = computed(() => this.disabled() || this._cvaDisabled());

    readonly fillPercent = computed(() => {
        const range = this.max() - this.min();
        if (range <= 0) return 0;
        return ((this.value() - this.min()) / range) * 100;
    });

    readonly hostClass = computed(() => {
        const parts = ['zyr-slider', `zyr-slider--${this.size()}`];
        if (this.isDisabled()) parts.push('zyr-slider--disabled');
        return parts.join(' ');
    });

    readonly displayValue = computed(() => this.valueLabel()(this.value()));

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: number) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    writeValue(val: number): void {
        this.value.set(val ?? this.min());
    }

    registerOnChange(fn: (val: number) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._cvaDisabled.set(isDisabled);
    }

    // ── Methods ───────────────────────────────────────────────
    onInput(raw: string): void {
        const next = Number(raw);
        this.value.set(next);
        this._onChange(next);
        this.changed.emit(next);
    }

    onBlur(): void {
        this._onTouched();
    }
}
