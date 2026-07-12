import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { BoxBackground, BoxRadius, BoxSpacing, SPACING, spacingStyle } from '../../../internal/box-style/box-style';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type FlexResponsiveDirection = Partial<Record<FlexBreakpoint, FlexDirection>>;
export type FlexResponsiveGap = Partial<Record<FlexBreakpoint, BoxSpacing>>;
export type { BoxBackground, BoxRadius, BoxSpacing };

const JUSTIFY_MAP: Record<FlexJustify, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
};

const ALIGN_MAP: Record<FlexAlign, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
};

const BREAKPOINTS: FlexBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

@Component({
    selector: 'zyra-flex',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-flex.html',
    styleUrl: './zyra-flex.scss',
})
export class ZyraFlex {
    // ── Inputs ────────────────────────────────────────────────
    direction = input<FlexDirection | FlexResponsiveDirection>('row');
    align = input<FlexAlign>('stretch');
    justify = input<FlexJustify>('start');
    gap = input<BoxSpacing | FlexResponsiveGap>('none');
    wrap = input(false, { transform: booleanAttribute });
    wrapReverse = input(false, { transform: booleanAttribute });
    inline = input(false, { transform: booleanAttribute });

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
        const parts = ['zyr-flex'];
        if (this.border()) parts.push('zyr-flex--border');
        if (typeof this.direction() === 'object') parts.push('zyr-flex--responsive-direction');
        if (typeof this.gap() === 'object') parts.push('zyr-flex--responsive-gap');
        return parts.join(' ');
    });

    hostStyle = computed(() => {
        const direction = this.direction();
        const gap = this.gap();
        const isResponsiveDirection = typeof direction === 'object';
        const isResponsiveGap = typeof gap === 'object';
        const responsiveVars: Record<string, string> = {};

        if (isResponsiveDirection) {
            BREAKPOINTS.forEach((bp) => {
                const value = (direction as FlexResponsiveDirection)[bp];
                if (value !== undefined) responsiveVars[`--zyr-flex-direction-${bp}`] = value;
            });
        }
        if (isResponsiveGap) {
            BREAKPOINTS.forEach((bp) => {
                const value = (gap as FlexResponsiveGap)[bp];
                if (value !== undefined) responsiveVars[`--zyr-flex-gap-${bp}`] = SPACING[value];
            });
        }

        return {
            display: this.inline() ? 'inline-flex' : 'flex',
            // When responsive, the resolved property is left to the stylesheet
            // (base + @media rules under the --responsive-* modifier classes)
            // instead of being set inline — an inline value would permanently
            // win over every @media override regardless of viewport width.
            'flex-direction': isResponsiveDirection ? '' : (direction as FlexDirection),
            'flex-wrap': this.wrapReverse() ? 'wrap-reverse' : this.wrap() ? 'wrap' : 'nowrap',
            'align-items': ALIGN_MAP[this.align()],
            'justify-content': JUSTIFY_MAP[this.justify()],
            gap: isResponsiveGap ? '' : SPACING[gap as BoxSpacing],
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
