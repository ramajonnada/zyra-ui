import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ZyraSpinner, SpinnerColor } from '../zyra-spinner/zyra-spinner';
import { asIconDefinition, asIconText, type ZyraIcon } from '../../shared/fontawesome-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
    selector: 'zyra-button',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSpinner, FaIconComponent],
    templateUrl: './zyra-button.html',
    styleUrl: './zyra-button.scss',
})
export class ZyraButton {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<ButtonVariant>('primary');
    size = input<ButtonSize>('md');
    type = input<ButtonType>('button');
    ariaLabel = input<string | null>(null, { alias: 'aria-label' });
    loading = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });
    fullWidth = input(false, { transform: booleanAttribute });
    iconLeft = input<ZyraIcon>(null);
    iconRight = input<ZyraIcon>(null);

    // ── Outputs ───────────────────────────────────────────────
    clicked = output<MouseEvent>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = ['zyr-btn', `zyr-btn--${this.variant()}`, `zyr-btn--${this.size()}`];
        if (this.loading()) classes.push('zyr-btn--loading');
        if (this.disabled()) classes.push('zyr-btn--disabled');
        if (this.fullWidth()) classes.push('zyr-btn--full');
        return classes.join(' ');
    });

    spinnerSize = computed(() => {
        const map: Record<ButtonSize, 'xs' | 'sm' | 'md'> = {
            sm: 'xs',
            md: 'sm',
            lg: 'md',
        };
        return map[this.size()];
    });

    spinnerColor = computed((): SpinnerColor => {
        const solidVariants: ButtonVariant[] = ['primary', 'danger'];
        return solidVariants.includes(this.variant()) ? 'white' : 'accent';
    });

    leftIconDefinition = computed(() => asIconDefinition(this.iconLeft()));
    leftIconText = computed(() => asIconText(this.iconLeft()));
    rightIconDefinition = computed(() => asIconDefinition(this.iconRight()));
    rightIconText = computed(() => asIconText(this.iconRight()));

    // ── Methods ───────────────────────────────────────────────
    handleClick(event: MouseEvent): void {
        if (this.disabled() || this.loading()) return;
        this.clicked.emit(event);
    }
}
