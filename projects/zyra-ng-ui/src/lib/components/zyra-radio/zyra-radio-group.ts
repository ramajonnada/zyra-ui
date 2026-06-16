import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    forwardRef,
    HostListener,
    input,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZyraRadio } from './zyra-radio';
import { ZYRA_RADIO_GROUP, ZyraRadioGroupRef } from './zyra-radio-group-token';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

@Component({
    selector: 'zyra-radio-group',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraRadioGroup),
            multi: true,
        },
        {
            provide: ZYRA_RADIO_GROUP,
            useExisting: forwardRef(() => ZyraRadioGroup),
        },
    ],
    templateUrl: './zyra-radio-group.html',
    styleUrl:    './zyra-radio-group.scss',
})
export class ZyraRadioGroup implements ControlValueAccessor, ZyraRadioGroupRef {
    // ── Inputs ────────────────────────────────────────────────
    label       = input<string>('');
    orientation = input<RadioGroupOrientation>('vertical');
    disabled    = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<string | number | null>();

    // ── Internal state ────────────────────────────────────────
    readonly value = signal<string | number | null>(null);

    private _cvaDisabled = signal(false);

    readonly _radios = contentChildren(ZyraRadio);

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: string | number | null) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    writeValue(val: string | number | null): void { this.value.set(val ?? null); }
    registerOnChange(fn: (v: string | number | null) => void): void { this._onChange = fn; }
    registerOnTouched(fn: () => void): void { this._onTouched = fn; }
    setDisabledState(d: boolean): void { this._cvaDisabled.set(d); }

    // ── ZyraRadioGroupRef ─────────────────────────────────────
    selectRadio(radio: ZyraRadio): void {
        this.value.set(radio.value());
        this._onChange(radio.value());
        this._onTouched();
        this.valueChange.emit(radio.value());
    }

    // ── Arrow key navigation ──────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const isVertical = this.orientation() === 'vertical';
        const fwd  = isVertical ? 'ArrowDown'  : 'ArrowRight';
        const back = isVertical ? 'ArrowUp'    : 'ArrowLeft';
        if (event.key !== fwd && event.key !== back) return;

        event.preventDefault();
        const radios = this._radios().filter(r => !r.isDisabled());
        if (radios.length === 0) return;

        const currentIdx = radios.findIndex(r => r.checked());
        const delta = event.key === fwd ? 1 : -1;
        const next  = (currentIdx + delta + radios.length) % radios.length;
        this.selectRadio(radios[next]);
        document.getElementById(radios[next].radioId)?.focus();
    }
}
