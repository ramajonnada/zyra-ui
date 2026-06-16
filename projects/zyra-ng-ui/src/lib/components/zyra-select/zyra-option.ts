import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    signal,
} from '@angular/core';
import { ZYRA_SELECT } from './zyra-select-token';

export type SelectValue = string | number | null;

let optionCounter = 0;

@Component({
    selector: 'zyra-option',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-option.html',
    styleUrl: './zyra-option.scss',
})
export class ZyraOption {
    // ── Inputs ────────────────────────────────────────────────
    value = input.required<SelectValue>();
    disabled = input(false, { transform: booleanAttribute });
    label = input<string>('');

    // ── Unique ID for aria-activedescendant ───────────────────
    readonly optionId = `zyr-option-${++optionCounter}`;

    // ── State set by parent ZyraSelect ────────────────────────
    readonly selected = signal(false);
    readonly active = signal(false);

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _select = inject(ZYRA_SELECT, { optional: true });

    // ── Returns display label; label input takes priority ─────
    getLabel(): string {
        return this.label() || this._el.nativeElement.textContent?.trim() || '';
    }

    handleClick(): void {
        if (this.disabled()) return;
        this._select?.selectOption(this);
    }
}
