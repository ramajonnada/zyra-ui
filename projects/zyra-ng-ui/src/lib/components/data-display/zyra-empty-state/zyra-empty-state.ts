import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ZyraSize } from '../../../shared/zyra-size';

export type EmptyStateSize = ZyraSize;

@Component({
    selector: 'zyra-empty-state',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-empty-state.html',
    styleUrl: './zyra-empty-state.scss',
})
export class ZyraEmptyState {
    // ── Inputs ────────────────────────────────────────────────
    title = input<string>('');
    description = input<string>('');
    size = input<EmptyStateSize>('md');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-empty-state zyr-empty-state--${this.size()}`);
}
