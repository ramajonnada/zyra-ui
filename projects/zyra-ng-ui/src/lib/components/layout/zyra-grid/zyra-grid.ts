import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { BoxBackground, BoxRadius, BoxSpacing, SPACING, spacingStyle, toDimension } from '../../../internal/box-style/box-style';

export type GridColumnsValue = number | 'auto-fit' | 'auto-fill' | string;
export type GridBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type GridResponsiveColumns = Partial<Record<GridBreakpoint, GridColumnsValue>>;
export type GridResponsiveRows = Partial<Record<GridBreakpoint, GridColumnsValue>>;
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
export type GridJustifyItems = 'start' | 'center' | 'end' | 'stretch';
export type GridAlignItems = 'start' | 'center' | 'end' | 'stretch';
export type { BoxBackground, BoxRadius, BoxSpacing };

const BREAKPOINTS: GridBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

function columnsToTemplate(value: GridColumnsValue, minTrackSize: string): string {
    if (value === 'auto-fit' || value === 'auto-fill') {
        return `repeat(${value}, minmax(${minTrackSize}, 1fr))`;
    }
    return typeof value === 'number' ? `repeat(${value}, minmax(0, 1fr))` : value;
}

@Component({
    selector: 'zyra-grid',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-grid.html',
    styleUrl: './zyra-grid.scss',
})
export class ZyraGrid {
    // ── Inputs ────────────────────────────────────────────────
    columns = input<GridColumnsValue | GridResponsiveColumns>(1);
    rows = input<GridColumnsValue | GridResponsiveRows | undefined>(undefined);
    /** Minimum track size used when `columns`/`rows` is `"auto-fit"` or `"auto-fill"`. */
    minTrackSize = input<string | number>('180px');
    areas = input<string[] | undefined>(undefined);
    autoFlow = input<GridAutoFlow>('row');
    justifyItems = input<GridJustifyItems>('stretch');
    alignItems = input<GridAlignItems>('stretch');

    gap = input<BoxSpacing>('none');
    columnGap = input<BoxSpacing | undefined>(undefined);
    rowGap = input<BoxSpacing | undefined>(undefined);

    padding = input<BoxSpacing>('none');
    paddingX = input<BoxSpacing | undefined>(undefined);
    paddingY = input<BoxSpacing | undefined>(undefined);

    margin = input<BoxSpacing>('none');
    marginX = input<BoxSpacing | undefined>(undefined);
    marginY = input<BoxSpacing | undefined>(undefined);

    rounded = input<BoxRadius>('none');
    background = input<BoxBackground>('none');
    border = input(false, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const parts = ['zyr-grid'];
        if (this.border()) parts.push('zyr-grid--border');
        if (typeof this.columns() === 'object') parts.push('zyr-grid--responsive-cols');
        if (typeof this.rows() === 'object') parts.push('zyr-grid--responsive-rows');
        return parts.join(' ');
    });

    hostStyle = computed(() => {
        const columns = this.columns();
        const rows = this.rows();
        const minTrackSize = toDimension(this.minTrackSize()) ?? '180px';
        const isResponsiveCols = typeof columns === 'object';
        const isResponsiveRows = typeof rows === 'object';
        const responsiveVars: Record<string, string> = {};

        if (isResponsiveCols) {
            const responsive = columns as GridResponsiveColumns;
            BREAKPOINTS.forEach((bp) => {
                const value = responsive[bp];
                if (value !== undefined) {
                    responsiveVars[`--zyr-grid-cols-${bp}`] = columnsToTemplate(value, minTrackSize);
                }
            });
        }
        if (isResponsiveRows) {
            const responsive = rows as GridResponsiveRows;
            BREAKPOINTS.forEach((bp) => {
                const value = responsive[bp];
                if (value !== undefined) {
                    responsiveVars[`--zyr-grid-rows-${bp}`] = columnsToTemplate(value, minTrackSize);
                }
            });
        }

        const gap = this.gap();
        const columnGap = this.columnGap();
        const rowGap = this.rowGap();
        const areas = this.areas();

        return {
            display: 'grid',
            // When responsive, the resolved property is left to the stylesheet
            // (base + @media rules under the --responsive-cols modifier class)
            // instead of being set inline — an inline value would permanently
            // win over every @media override regardless of viewport width.
            'grid-template-columns': isResponsiveCols
                ? ''
                : columnsToTemplate(columns as GridColumnsValue, minTrackSize),
            ...(rows !== undefined
                ? {
                      'grid-template-rows': isResponsiveRows
                          ? ''
                          : columnsToTemplate(rows as GridColumnsValue, minTrackSize),
                  }
                : {}),
            ...(areas !== undefined ? { 'grid-template-areas': areas.map((row) => `"${row}"`).join(' ') } : {}),
            'grid-auto-flow': this.autoFlow(),
            'justify-items': this.justifyItems(),
            'align-items': this.alignItems(),
            'column-gap': columnGap !== undefined ? SPACING[columnGap] : SPACING[gap],
            'row-gap': rowGap !== undefined ? SPACING[rowGap] : SPACING[gap],
            ...responsiveVars,
            ...spacingStyle({
                padding: this.padding(),
                paddingX: this.paddingX(),
                paddingY: this.paddingY(),
                margin: this.margin(),
                marginX: this.marginX(),
                marginY: this.marginY(),
                rounded: this.rounded(),
                background: this.background(),
            }),
        };
    });
}
