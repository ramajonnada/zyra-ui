import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ZyraSize } from '../../../shared/zyra-size';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default';
export type BadgeSize = ZyraSize;

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
    dot = input(false, { transform: booleanAttribute });
    ariaLabel = input<string>('');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-badge zyr-badge--${this.variant()} zyr-badge--${this.size()}`);
}
