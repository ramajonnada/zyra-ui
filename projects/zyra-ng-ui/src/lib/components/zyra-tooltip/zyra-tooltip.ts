import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
    selector: 'zyra-tooltip',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-tooltip.html',
    styleUrl: './zyra-tooltip.scss',
})
export class ZyraTooltip {
    // ── Inputs ────────────────────────────────────────────────
    text = input<string>('');
    position = input<TooltipPosition>('top');
    maxWidth = input<string>('200px');

    // ── State ─────────────────────────────────────────────────
    visible = signal(false);

    // ── Computed ──────────────────────────────────────────────
    tooltipClass = computed(() => `zyr-tooltip zyr-tooltip--${this.position()}`);
}
