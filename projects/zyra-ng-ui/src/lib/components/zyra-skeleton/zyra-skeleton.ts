import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

@Component({
    selector: 'zyra-skeleton',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-skeleton.html',
    styleUrl: './zyra-skeleton.scss',
})
export class ZyraSkeleton {
    // ── Inputs ────────────────────────────────────────────────
    variant  = input<SkeletonVariant>('rect');
    width    = input<string>('');
    height   = input<string>('');
    lines    = input<number>(1);
    animated = input(true, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    readonly _lineIndices = computed(() =>
        Array.from({ length: Math.max(1, this.lines()) }, (_, i) => i)
    );

    readonly baseClass = computed(() => {
        const parts = ['zyr-skeleton', `zyr-skeleton--${this.variant()}`];
        if (!this.animated()) parts.push('zyr-skeleton--static');
        return parts.join(' ');
    });

    isLastLine(idx: number): boolean {
        return this.variant() === 'text' && idx === this.lines() - 1 && this.lines() > 1;
    }
}
