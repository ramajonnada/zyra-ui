import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type FlexAlignSelf = 'auto' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustifySelf = 'auto' | 'start' | 'center' | 'end' | 'stretch';

const ALIGN_SELF_MAP: Record<FlexAlignSelf, string> = {
    auto: 'auto',
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
};

const JUSTIFY_SELF_MAP: Record<FlexJustifySelf, string> = {
    auto: 'auto',
    start: 'start',
    center: 'center',
    end: 'end',
    stretch: 'stretch',
};

/**
 * Optional per-child wrapper for use inside `zyra-flex` — flex-item properties
 * (grow/shrink/basis/order/align-self) only have meaning on a flex item, not
 * the flex container itself, so they live on this sibling component instead.
 *
 * Note: `justify-self` has no visual effect in a flex layout per the CSS spec
 * (it only applies to grid/block items) — it's exposed here anyway so the API
 * stays forward-compatible if this item ever sits inside a grid instead.
 */
@Component({
    selector: 'zyra-flex-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [style]="hostStyle()">
            <ng-content />
        </div>
    `,
})
export class ZyraFlexItem {
    // ── Inputs ────────────────────────────────────────────────
    grow = input<number | undefined>(undefined);
    shrink = input<number | undefined>(undefined);
    basis = input<string | number | undefined>(undefined);
    order = input<number | undefined>(undefined);
    alignSelf = input<FlexAlignSelf>('auto');
    justifySelf = input<FlexJustifySelf>('auto');

    // ── Computed ──────────────────────────────────────────────
    hostStyle = computed(() => {
        const basis = this.basis();
        return {
            'flex-grow': this.grow() !== undefined ? String(this.grow()) : '',
            'flex-shrink': this.shrink() !== undefined ? String(this.shrink()) : '',
            'flex-basis': basis !== undefined ? (typeof basis === 'number' ? `${basis}px` : basis) : '',
            order: this.order() !== undefined ? String(this.order()) : '',
            'align-self': ALIGN_SELF_MAP[this.alignSelf()],
            'justify-self': JUSTIFY_SELF_MAP[this.justifySelf()],
        };
    });
}
