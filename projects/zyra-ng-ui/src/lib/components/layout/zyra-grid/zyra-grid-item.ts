import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Optional per-child wrapper for use inside `zyra-grid` — column/row span and
 * named-area placement only have meaning on a grid item, not the grid
 * container itself, so they live on this sibling component instead.
 */
@Component({
    selector: 'zyra-grid-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [style]="hostStyle()">
            <ng-content />
        </div>
    `,
})
export class ZyraGridItem {
    // ── Inputs ────────────────────────────────────────────────
    colSpan = input<number | undefined>(undefined);
    rowSpan = input<number | undefined>(undefined);
    /** Name of a `zyra-grid` `areas` cell this item should occupy. */
    area = input<string | undefined>(undefined);

    // ── Computed ──────────────────────────────────────────────
    hostStyle = computed(() => {
        const colSpan = this.colSpan();
        const rowSpan = this.rowSpan();
        const area = this.area();

        return {
            'grid-column': area !== undefined ? '' : colSpan !== undefined ? `span ${colSpan} / span ${colSpan}` : '',
            'grid-row': area !== undefined ? '' : rowSpan !== undefined ? `span ${rowSpan} / span ${rowSpan}` : '',
            'grid-area': area ?? '',
        };
    });
}
