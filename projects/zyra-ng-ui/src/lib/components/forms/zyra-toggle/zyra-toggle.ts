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

export type ToggleSize = ZyraSize;

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
    pressed = model<boolean>(false);
    size = input<ToggleSize>('md');
    disabled = input(false, { transform: booleanAttribute });
    ariaLabel = input<string | null>(null, { alias: 'aria-label' });

    // ── Outputs ───────────────────────────────────────────────
    changed = output<boolean>();

    // ── CVA state ─────────────────────────────────────────────
    private _cvaDisabled = signal(false);

    // ── Computed ──────────────────────────────────────────────
    isDisabled = computed(() => this.disabled() || this._cvaDisabled());

    hostClass = computed(() => {
        const classes = ['zyr-toggle', `zyr-toggle--${this.size()}`];
        if (this.pressed()) classes.push('zyr-toggle--pressed');
        if (this.isDisabled()) classes.push('zyr-toggle--disabled');
        return classes.join(' ');
    });

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: boolean) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    writeValue(val: boolean): void {
        this.pressed.set(!!val);
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
        const next = !this.pressed();
        this.pressed.set(next);
        this._onChange(next);
        this._onTouched();
        this.changed.emit(next);
    }
}
