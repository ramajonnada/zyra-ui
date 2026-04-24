import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-badge',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-badge.html',
    styleUrl: './zyra-badge.scss',
})
export class ZyraBadge {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<BadgeVariant>('default');
    size = input<BadgeSize>('md');
    dot = input<boolean>(false);
    ariaLabel = input<string>('');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-badge zyr-badge--${this.variant()} zyr-badge--${this.size()}`);
}
