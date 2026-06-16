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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { zyraIcons } from '../../shared/fontawesome-icons';

export type CheckboxSize = 'sm' | 'md' | 'lg';

let checkboxIdCounter = 0;

@Component({
    selector: 'zyra-checkbox',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraCheckbox),
            multi: true,
        },
    ],
    templateUrl: './zyra-checkbox.html',
    styleUrl:    './zyra-checkbox.scss',
})
export class ZyraCheckbox implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    checked       = model<boolean>(false);
    disabled      = input(false, { transform: booleanAttribute });
    indeterminate = input(false, { transform: booleanAttribute });
    label         = input<string>('');
    labelPosition = input<'left' | 'right'>('right');
    size          = input<CheckboxSize>('md');

    // ── Outputs ───────────────────────────────────────────────
    changed = output<boolean>();

    // ── Unique ID ─────────────────────────────────────────────
    readonly checkboxId = `zyr-checkbox-${++checkboxIdCounter}`;

    // ── CVA disabled state ────────────────────────────────────
    private _cvaDisabled = signal(false);
    readonly isDisabled  = computed(() => this.disabled() || this._cvaDisabled());

    readonly icons = zyraIcons;

    readonly hostClass = computed(() => {
        const parts = ['zyr-checkbox', `zyr-checkbox--${this.size()}`];
        if (this.isDisabled())   parts.push('zyr-checkbox--disabled');
        if (this.checked())      parts.push('zyr-checkbox--checked');
        if (this.indeterminate()) parts.push('zyr-checkbox--indeterminate');
        return parts.join(' ');
    });

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: boolean) => void = () => undefined;
    private _onTouched: () => void            = () => undefined;

    writeValue(val: boolean): void              { this.checked.set(!!val); }
    registerOnChange(fn: (v: boolean) => void): void { this._onChange = fn; }
    registerOnTouched(fn: () => void): void          { this._onTouched = fn; }
    setDisabledState(disabled: boolean): void        { this._cvaDisabled.set(disabled); }

    // ── Toggle ────────────────────────────────────────────────
    toggle(): void {
        if (this.isDisabled()) return;
        const next = !this.checked();
        this.checked.set(next);
        this._onChange(next);
        this._onTouched();
        this.changed.emit(next);
    }
}
