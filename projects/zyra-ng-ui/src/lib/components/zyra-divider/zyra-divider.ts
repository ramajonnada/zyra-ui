import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerAlign = 'start' | 'center' | 'end';

@Component({
    selector: 'zyra-divider',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-divider.html',
    styleUrl: './zyra-divider.scss',
})
export class ZyraDivider {
    // ── Inputs ────────────────────────────────────────────────
    orientation = input<DividerOrientation>('horizontal');
    variant = input<DividerVariant>('solid');
    align = input<DividerAlign>('center');
    label = input<string>('');
    width = input<string>('1px');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(
        () =>
            `zyr-divider zyr-divider--${this.orientation()} zyr-divider--${this.variant()} zyr-divider--${this.align()}`,
    );

    hostStyle = computed(() => ({ '--zyr-divider-width': this.width() }));

    hasLabel = computed(() => !!this.label() && this.orientation() === 'horizontal');
}
