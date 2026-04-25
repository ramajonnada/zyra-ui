import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    imports: [CommonModule, ZyraSpinner, FaIconComponent],
    templateUrl: './zyra-button.html',
    styleUrl: './zyra-button.scss',
})
export class ZyraButton {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<ButtonVariant>('primary');
    size = input<ButtonSize>('md');
    type = input<ButtonType>('button');
    ariaLabel = input<string | null>(null, { alias: 'aria-label' });
    loading = input<boolean>(false);
    disabled = input<boolean>(false);
    fullWidth = input<boolean>(false);
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

// import { booleanAttribute, Component, Input } from '@angular/core';

// @Component({
//     selector: 'zyra-button',
//     imports: [],
//     standalone: true,
//     templateUrl: './zyra-button.html',
//     styleUrl: './zyra-button.css',
// })
// export class ZyraButton {
//     @Input() variant: 'gradient' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' =
//         'primary';
//     @Input() size: 'sm' | 'md' | 'lg' = 'md';
//     @Input() type: 'button' | 'submit' | 'reset' = 'button';
//     @Input({ transform: booleanAttribute }) disabled = false;
//     @Input({ transform: booleanAttribute }) loading = false;
//     @Input({ transform: booleanAttribute }) fullWidth = false;
// }
