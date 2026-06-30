import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-progress',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-progress.html',
    styleUrl: './zyra-progress.scss',
})
export class ZyraProgress {
    // ── Inputs ────────────────────────────────────────────────
    value = input<number>(0);
    max = input<number>(100);
    variant = input<ProgressVariant>('default');
    size = input<ProgressSize>('md');
    indeterminate = input(false, { transform: booleanAttribute });
    showLabel = input(false, { transform: booleanAttribute });
    label = input<string>('');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(
        () =>
            `zyr-progress zyr-progress--${this.variant()} zyr-progress--${this.size()}${this.indeterminate() ? ' zyr-progress--indeterminate' : ''}`,
    );

    clampedValue = computed(() => Math.min(Math.max(this.value(), 0), this.max()));

    percent = computed(() => Math.round((this.clampedValue() / this.max()) * 100));

    displayLabel = computed(() => this.label() || `${this.percent()}%`);
}
