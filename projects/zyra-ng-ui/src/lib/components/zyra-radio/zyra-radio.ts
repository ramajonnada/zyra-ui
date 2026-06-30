import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from '@angular/core';
import { ZYRA_RADIO_GROUP } from './zyra-radio-group-token';

export type RadioSize = 'sm' | 'md' | 'lg';

let radioIdCounter = 0;

@Component({
    selector: 'zyra-radio',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-radio.html',
    styleUrl: './zyra-radio.scss',
})
export class ZyraRadio {
    // ── Inputs ────────────────────────────────────────────────
    value = input.required<string | number>();
    label = input<string>('');
    disabled = input(false, { transform: booleanAttribute });
    size = input<RadioSize>('md');

    // ── Unique ID ─────────────────────────────────────────────
    readonly radioId = `zyr-radio-${++radioIdCounter}`;

    private readonly _group = inject(ZYRA_RADIO_GROUP, { optional: true });

    // ── Computed from group state ─────────────────────────────
    readonly checked = computed(() => this._group?.value() === this.value());
    readonly isDisabled = computed(() => this.disabled() || (this._group?.disabled() ?? false));

    readonly hostClass = computed(() => {
        const parts = ['zyr-radio', `zyr-radio--${this.size()}`];
        if (this.checked()) parts.push('zyr-radio--checked');
        if (this.isDisabled()) parts.push('zyr-radio--disabled');
        return parts.join(' ');
    });

    select(): void {
        if (this.isDisabled()) return;
        this._group?.selectRadio(this);
    }
}
