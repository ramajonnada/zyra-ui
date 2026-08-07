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
import type { ZyraSize } from '../../../shared/zyra-size';

export type SwitchSize = ZyraSize;

@Component({
    selector: 'zyra-switch',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraSwitch),
            multi: true,
        },
    ],
    templateUrl: './zyra-switch.html',
    styleUrl: './zyra-switch.scss',
})
export class ZyraSwitch implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    checked = model<boolean>(false);
    size = input<SwitchSize>('md');
    disabled = input(false, { transform: booleanAttribute });
    label = input<string>('');
    labelPosition = input<'left' | 'right'>('right');

    // ── Outputs ───────────────────────────────────────────────
    changed = output<boolean>();

    // ── ID for label association ──────────────────────────────
    readonly switchId = `zyr-switch-${Math.random().toString(36).slice(2, 9)}`;

    // ── CVA state ─────────────────────────────────────────────
    private _cvaDisabled = signal(false);

    // ── Computed ──────────────────────────────────────────────
    isDisabled = computed(() => this.disabled() || this._cvaDisabled());

    hostClass = computed(
        () =>
            `zyr-switch zyr-switch--${this.size()}${this.isDisabled() ? ' zyr-switch--disabled' : ''}`,
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
