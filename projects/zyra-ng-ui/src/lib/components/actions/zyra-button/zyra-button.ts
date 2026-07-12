import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    output,
} from '@angular/core';
import { ZyraSpinner, SpinnerColor } from '../../feedback/zyra-spinner/zyra-spinner';
import { ZyraIcon as ZyraIconComponent, type ZyraIconData } from '../../../internal/zyra-icon/zyra-icon';
import { isLucideIcon, asIconText, type ZyraIconInput } from '../../../shared/zyra-icons';
import { ZYRA_BUTTON_GROUP } from './zyra-button-group-token';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonColor = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

let buttonIdCounter = 0;

@Component({
    selector: 'zyra-button',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSpinner, ZyraIconComponent],
    templateUrl: './zyra-button.html',
    styleUrl: './zyra-button.scss',
})
export class ZyraButton {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<ButtonVariant | undefined>(undefined);
    size = input<ButtonSize | undefined>(undefined);
    color = input<ButtonColor | undefined>(undefined);
    radius = input<ButtonRadius | undefined>(undefined);
    type = input<ButtonType>('button');
    ariaLabel = input<string | null>(null, { alias: 'aria-label' });
    loading = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });
    fullWidth = input(false, { transform: booleanAttribute });
    iconLeft = input<ZyraIconInput>(null);
    iconRight = input<ZyraIconInput>(null);

    /** Only meaningful inside a `zyra-button-group` with a `selectionMode` other than `none`. */
    value = input<string | number | undefined>(undefined);
    /** Opt in to standalone toggle-button behavior (clicking flips `selected`). Ignored inside a group, which owns selection instead. */
    toggleable = input(false, { transform: booleanAttribute });
    /** Pressed/selected state. Settable directly, driven by `toggleable`, or driven by a parent group. */
    selected = model<boolean>(false);

    // ── Outputs ───────────────────────────────────────────────
    clicked = output<MouseEvent>();

    // ── Unique ID (used for group focus management) ──────────
    readonly buttonId = `zyr-btn-${++buttonIdCounter}`;

    // ── Group coordination ───────────────────────────────────
    private readonly _group = inject(ZYRA_BUTTON_GROUP, { optional: true });

    readonly effectiveVariant = computed<ButtonVariant>(
        () => this.variant() ?? this._group?.variant() ?? 'primary',
    );
    readonly effectiveSize = computed<ButtonSize>(() => this.size() ?? this._group?.size() ?? 'md');
    readonly effectiveColor = computed<ButtonColor | undefined>(
        () => this.color() ?? this._group?.color(),
    );
    readonly effectiveRadius = computed<ButtonRadius | undefined>(
        () => this.radius() ?? this._group?.radius(),
    );
    readonly effectiveDisabled = computed(() => this.disabled() || (this._group?.disabled() ?? false));

    readonly isSelected = computed(() =>
        this._group && this._group.selectionMode() !== 'none'
            ? this._group.isSelected(this.value() ?? '')
            : this.selected(),
    );

    /** Roving tabindex when inside a group; `null` (native default) when standalone. */
    readonly tabIndex = computed<number | null>(() => {
        if (!this._group) return null;
        return this._group.isActive(this) ? 0 : -1;
    });

    readonly role = computed<'radio' | null>(() =>
        this._group?.selectionMode() === 'single' ? 'radio' : null,
    );

    readonly ariaChecked = computed<boolean | null>(() =>
        this._group?.selectionMode() === 'single' ? this.isSelected() : null,
    );

    readonly ariaPressed = computed<boolean | null>(() => {
        if (this._group) return this._group.selectionMode() === 'multiple' ? this.isSelected() : null;
        return this.toggleable() ? this.isSelected() : null;
    });

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = [
            'zyr-btn',
            `zyr-btn--${this.effectiveVariant()}`,
            `zyr-btn--${this.effectiveSize()}`,
        ];
        const color = this.effectiveColor();
        if (color && color !== 'neutral') classes.push(`zyr-btn--color-${color}`);
        const radius = this.effectiveRadius();
        if (radius) classes.push(`zyr-btn--radius-${radius}`);
        if (this.loading()) classes.push('zyr-btn--loading');
        if (this.effectiveDisabled()) classes.push('zyr-btn--disabled');
        if (this.fullWidth()) classes.push('zyr-btn--full');
        if (this.isSelected()) classes.push('zyr-btn--selected');
        return classes.join(' ');
    });

    spinnerSize = computed(() => {
        const map: Record<ButtonSize, 'xs' | 'sm' | 'md'> = {
            sm: 'xs',
            md: 'sm',
            lg: 'md',
        };
        return map[this.effectiveSize()];
    });

    spinnerColor = computed((): SpinnerColor => {
        const solidVariants: ButtonVariant[] = ['primary', 'danger'];
        return solidVariants.includes(this.effectiveVariant()) ? 'white' : 'accent';
    });

    leftIconImg = computed((): ZyraIconData | null => {
        const v = this.iconLeft();
        return isLucideIcon(v) ? (v as ZyraIconData) : null;
    });
    leftIconText = computed(() => asIconText(this.iconLeft()));
    rightIconImg = computed((): ZyraIconData | null => {
        const v = this.iconRight();
        return isLucideIcon(v) ? (v as ZyraIconData) : null;
    });
    rightIconText = computed(() => asIconText(this.iconRight()));

    // ── Methods ───────────────────────────────────────────────
    handleFocus(): void {
        this._group?.registerFocus(this);
    }

    handleClick(event: MouseEvent): void {
        if (this.effectiveDisabled() || this.loading()) return;
        if (this._group && this._group.selectionMode() !== 'none') {
            this._group.toggle(this.value() ?? '');
        } else if (this.toggleable()) {
            this.selected.set(!this.selected());
        }
        this.clicked.emit(event);
    }
}
