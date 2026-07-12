import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type AspectRatioValue = number | `${number}/${number}` | `${number}:${number}` | string;
export type AspectRatioObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

function parseRatio(value: AspectRatioValue): number {
    if (typeof value === 'number') return value;
    const [w, h] = value.split(/[/:]/).map(Number);
    return w / h;
}

@Component({
    selector: 'zyra-aspect-ratio',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-aspect-ratio.html',
    styleUrl: './zyra-aspect-ratio.scss',
})
export class ZyraAspectRatio {
    // ── Inputs ────────────────────────────────────────────────
    ratio = input<AspectRatioValue>('16/9');
    /** Applied to a directly-projected `<img>`/`<video>` via `object-fit`. */
    objectFit = input<AspectRatioObjectFit>('cover');
    overflowHidden = input(true, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => 'zyr-aspect-ratio');

    // Uses the padding-bottom percentage trick rather than the CSS
    // aspect-ratio property so it degrades correctly on older rendering engines.
    hostStyle = computed(() => ({
        'padding-bottom': `${(1 / parseRatio(this.ratio())) * 100}%`,
        overflow: this.overflowHidden() ? 'hidden' : 'visible',
        '--zyr-ratio-object-fit': this.objectFit(),
    }));
}
