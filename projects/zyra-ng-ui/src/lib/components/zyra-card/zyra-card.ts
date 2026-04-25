import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-card',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-card.html',
    styleUrl: './zyra-card.scss',
})
export class ZyraCard {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<CardVariant>('default');
    padding = input<CardPadding>('md');
    clickable = input<boolean>(false);
    hasHeader = input<boolean>(false);
    hasFooter = input<boolean>(false);

    // ── Outputs ───────────────────────────────────────────────
    cardClick = output<void>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = ['zyr-card', `zyr-card--${this.variant()}`];
        if (this.clickable()) classes.push('zyr-card--clickable');
        return classes.join(' ');
    });

    bodyClass = computed(() => `zyr-card__body zyr-card__body--${this.padding()}`);

    // ── Methods ───────────────────────────────────────────────
    handleClick(): void {
        if (this.clickable()) this.cardClick.emit();
    }
}
