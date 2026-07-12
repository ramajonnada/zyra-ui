import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

export type SkeletonVariant =
    | 'text'
    | 'circle'
    | 'rect'
    | 'rounded'
    | 'avatar'
    | 'image'
    | 'button'
    | 'input'
    | 'card'
    | 'list'
    | 'article'
    | 'table'
    | 'chat'
    | 'dashboard'
    | 'video'
    | 'chart'
    | 'product'
    | 'profile'
    | 'calendar';

@Component({
    selector: 'zyra-skeleton',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-skeleton.html',
    styleUrl: './zyra-skeleton.scss',
    host: { '[class.zyr-sk-no-anim]': '!animated()', 'aria-hidden': 'true' },
})
export class ZyraSkeleton {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<SkeletonVariant>('rect');
    width = input<string>('');
    height = input<string>('');
    lines = input<number>(3);
    rows = input<number>(5);
    animated = input(true, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    readonly _lineIndices = computed(() =>
        Array.from({ length: Math.max(1, this.lines()) }, (_, i) => i),
    );

    readonly _rowIndices = computed(() =>
        Array.from({ length: Math.max(1, this.rows()) }, (_, i) => i),
    );

    readonly _calendarCells = computed(() => Array.from({ length: 35 }, (_, i) => i));

    readonly _chartHeights = [60, 85, 45, 70, 90, 55, 75, 40, 65, 80];

    isLastLine(idx: number): boolean {
        return idx === this.lines() - 1 && this.lines() > 1;
    }
}
