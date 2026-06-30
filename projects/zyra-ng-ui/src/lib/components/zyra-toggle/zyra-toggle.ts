import {
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

export type ToggleSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-toggle',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraToggle),
            multi: true,
        },
    ],
    templateUrl: './zyra-toggle.html',
    styleUrl: './zyra-toggle.scss',
})
export class ZyraToggle implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    checked = model<boolean>(false);
    size = input<ToggleSize>('md');
    disabled = input<boolean>(false);
    label = input<string>('');
    labelPosition = input<'left' | 'right'>('right');

    // ── Outputs ───────────────────────────────────────────────
    changed = output<boolean>();

    // ── ID for label association ──────────────────────────────
    readonly toggleId = `zyr-toggle-${Math.random().toString(36).slice(2, 9)}`;

    // ── CVA state ─────────────────────────────────────────────
    private _cvaDisabled = signal(false);

    // ── Computed ──────────────────────────────────────────────
    isDisabled = computed(() => this.disabled() || this._cvaDisabled());

    hostClass = computed(
        () =>
            `zyr-toggle zyr-toggle--${this.size()}${this.isDisabled() ? ' zyr-toggle--disabled' : ''}`,
    );

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: boolean) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    writeValue(val: boolean): void {
        this.checked.set(!!val);
    }

    registerOnChange(fn: (val: boolean) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._cvaDisabled.set(isDisabled);
    }

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        if (this.isDisabled()) return;
        const next = !this.checked();
        this.checked.set(next);
        this._onChange(next);
        this._onTouched();
        this.changed.emit(next);
    }
}
