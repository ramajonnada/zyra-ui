import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    forwardRef,
    HostListener,
    input,
    model,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonColor, ButtonRadius, ButtonSize, ButtonVariant, ZyraButton } from './zyra-button';
import { ButtonGroupSelectionMode, ZYRA_BUTTON_GROUP, ZyraButtonGroupRef } from './zyra-button-group-token';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupJoin = 'attached' | 'separated';
export type ButtonGroupGap = 'none' | 'sm' | 'md' | 'lg';
export type ButtonGroupValue = string | number | (string | number)[] | null;

@Component({
    selector: 'zyra-button-group',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraButtonGroup),
            multi: true,
        },
        {
            provide: ZYRA_BUTTON_GROUP,
            useExisting: forwardRef(() => ZyraButtonGroup),
        },
    ],
    templateUrl: './zyra-button-group.html',
    styleUrl: './zyra-button-group.scss',
})
export class ZyraButtonGroup implements ControlValueAccessor, ZyraButtonGroupRef {
    // ── Layout ────────────────────────────────────────────────
    orientation = input<ButtonGroupOrientation>('horizontal');
    join = input<ButtonGroupJoin>('separated');
    gap = input<ButtonGroupGap>('md');
    fullWidth = input(false, { transform: booleanAttribute });
    /** Every button matches the widest button's width, without stretching the group itself. */
    equalWidth = input(false, { transform: booleanAttribute });
    wrap = input(false, { transform: booleanAttribute });

    // ── Shared button config (undefined = no override) ──────────
    size = input<ButtonSize | undefined>(undefined);
    variant = input<ButtonVariant | undefined>(undefined);
    color = input<ButtonColor | undefined>(undefined);
    radius = input<ButtonRadius | undefined>(undefined);
    disabled = input(false, { transform: booleanAttribute });

    // ── Selection ─────────────────────────────────────────────
    selectionMode = input<ButtonGroupSelectionMode>('none');
    /** Single-select only: allow clicking the selected button again to clear the selection. */
    allowEmptySelection = input(false, { transform: booleanAttribute });
    value = model<ButtonGroupValue>(null);

    ariaLabel = input<string | null>(null, { alias: 'aria-label' });

    // ── Content children ──────────────────────────────────────
    private readonly _buttons = contentChildren(ZyraButton);
    private readonly _focusedButton = signal<ZyraButton | null>(null);

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: ButtonGroupValue) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    // ── Computed ──────────────────────────────────────────────
    readonly hostClass = computed(() => {
        const classes = [
            'zyr-btn-group',
            `zyr-btn-group--${this.orientation()}`,
            `zyr-btn-group--${this.join()}`,
            `zyr-btn-group--gap-${this.gap()}`,
        ];
        if (this.fullWidth()) classes.push('zyr-btn-group--full');
        if (this.equalWidth()) classes.push('zyr-btn-group--equal');
        if (this.wrap()) classes.push('zyr-btn-group--wrap');
        if (this.disabled()) classes.push('zyr-btn-group--disabled');
        return classes.join(' ');
    });

    readonly role = computed(() => (this.selectionMode() === 'single' ? 'radiogroup' : 'group'));

    private readonly _activeButton = computed<ZyraButton | null>(() => {
        const buttons = this._buttons();
        const focused = this._focusedButton();
        if (focused && buttons.includes(focused)) return focused;

        if (this.selectionMode() === 'single') {
            const v = this.value();
            const match = buttons.find((b) => b.value() === v);
            if (match) return match;
        }
        if (this.selectionMode() === 'multiple') {
            const arr = (this.value() as (string | number)[]) ?? [];
            const match = buttons.find((b) => b.value() !== undefined && arr.includes(b.value()!));
            if (match) return match;
        }
        return buttons.find((b) => !b.effectiveDisabled()) ?? null;
    });

    // ── ZyraButtonGroupRef ────────────────────────────────────
    isSelected(value: string | number): boolean {
        const mode = this.selectionMode();
        if (mode === 'single') return this.value() === value;
        if (mode === 'multiple') return ((this.value() as (string | number)[]) ?? []).includes(value);
        return false;
    }

    toggle(value: string | number): void {
        if (this.disabled() || this.selectionMode() === 'none') return;

        if (this.selectionMode() === 'single') {
            const current = this.value();
            const next = current === value ? (this.allowEmptySelection() ? null : current) : value;
            this._setValue(next);
        } else {
            const current = (this.value() as (string | number)[]) ?? [];
            const next = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            this._setValue(next);
        }
    }

    isActive(button: ZyraButton): boolean {
        return this._activeButton() === button;
    }

    registerFocus(button: ZyraButton): void {
        this._focusedButton.set(button);
    }

    // ── CVA ───────────────────────────────────────────────────
    writeValue(val: ButtonGroupValue): void {
        this.value.set(val ?? (this.selectionMode() === 'multiple' ? [] : null));
    }
    registerOnChange(fn: (v: ButtonGroupValue) => void): void {
        this._onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }
    setDisabledState(): void {
        // Group disabled state is driven by the `disabled` input to match ZyraButtonGroupRef;
        // reactive-forms-driven disabling is intentionally not layered on top of it.
    }

    private _setValue(next: ButtonGroupValue): void {
        this.value.set(next);
        this._onChange(next);
        this._onTouched();
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const buttons = this._buttons().filter((b) => !b.effectiveDisabled());
        if (buttons.length === 0) return;

        const isVertical = this.orientation() === 'vertical';
        const fwd = isVertical ? 'ArrowDown' : 'ArrowRight';
        const back = isVertical ? 'ArrowUp' : 'ArrowLeft';
        const currentIdx = buttons.findIndex((b) => b === this._activeButton());

        let next: ZyraButton | undefined;
        if (event.key === fwd) {
            next = buttons[(currentIdx + 1 + buttons.length) % buttons.length];
        } else if (event.key === back) {
            next = buttons[(currentIdx - 1 + buttons.length) % buttons.length];
        } else if (event.key === 'Home') {
            next = buttons[0];
        } else if (event.key === 'End') {
            next = buttons[buttons.length - 1];
        } else {
            return;
        }

        event.preventDefault();
        this._focusedButton.set(next);
        if (this.selectionMode() === 'single' && next.value() !== undefined) {
            this.toggle(next.value()!);
        }
        document.getElementById(next.buttonId)?.focus();
    }
}
