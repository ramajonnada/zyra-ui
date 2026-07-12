import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { BoxBackground, BoxRadius, BoxSpacing, RADIUS, SPACING, BACKGROUND } from '../../../internal/box-style/box-style';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'responsive';
export type ContainerBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerResponsivePadding = Partial<Record<ContainerBreakpoint, BoxSpacing>>;
export type { BoxBackground, BoxRadius, BoxSpacing };

const MAX_WIDTH: Record<Exclude<ContainerMaxWidth, 'responsive'>, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
};

// Bootstrap-style breakpoint container widths used when maxWidth="responsive" —
// the container is fluid below `sm` and snaps to a fixed width at each breakpoint.
const RESPONSIVE_MAX_WIDTH: Record<ContainerBreakpoint, string> = {
    base: '100%',
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
};

const BREAKPOINTS: ContainerBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

@Component({
    selector: 'zyra-container',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-container.html',
    styleUrl: './zyra-container.scss',
})
export class ZyraContainer {
    // ── Inputs ────────────────────────────────────────────────
    maxWidth = input<ContainerMaxWidth>('xl');
    centered = input(true, { transform: booleanAttribute });
    /** Removes the max-width constraint entirely (edge-to-edge, always 100%). */
    fluid = input(false, { transform: booleanAttribute });
    /** Removes horizontal gutter padding regardless of `paddingX`. */
    noGutters = input(false, { transform: booleanAttribute });

    paddingX = input<BoxSpacing | ContainerResponsivePadding>('md');
    paddingY = input<BoxSpacing>('none');

    rounded = input<BoxRadius>('none');
    background = input<BoxBackground>('none');
    border = input(false, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const parts = ['zyr-container'];
        if (this.border()) parts.push('zyr-container--border');
        if (this.maxWidth() === 'responsive' && !this.fluid()) parts.push('zyr-container--responsive-mw');
        if (typeof (this.noGutters() ? 'none' : this.paddingX()) === 'object') {
            parts.push('zyr-container--responsive-px');
        }
        return parts.join(' ');
    });

    hostStyle = computed(() => {
        const paddingX = this.noGutters() ? 'none' : this.paddingX();
        const isResponsivePadding = typeof paddingX === 'object';
        const paddingY = SPACING[this.paddingY()];
        const maxWidth = this.maxWidth();
        const isResponsiveMaxWidth = maxWidth === 'responsive';
        const responsiveVars: Record<string, string> = {};

        if (isResponsivePadding) {
            const responsive = paddingX as ContainerResponsivePadding;
            BREAKPOINTS.forEach((bp) => {
                const value = responsive[bp];
                if (value !== undefined) responsiveVars[`--zyr-container-px-${bp}`] = SPACING[value];
            });
        }
        if (isResponsiveMaxWidth) {
            BREAKPOINTS.forEach((bp) => {
                responsiveVars[`--zyr-container-mw-${bp}`] = RESPONSIVE_MAX_WIDTH[bp];
            });
        }

        return {
            width: '100%',
            'box-sizing': 'border-box',
            // When responsive/fluid, the resolved property is left to the
            // stylesheet (base + @media rules under the --responsive-* modifier
            // classes) instead of being set inline — an inline value would
            // permanently win over every @media override regardless of viewport.
            'max-width': this.fluid()
                ? 'none'
                : isResponsiveMaxWidth
                  ? ''
                  : MAX_WIDTH[maxWidth as Exclude<ContainerMaxWidth, 'responsive'>],
            'margin-left': this.centered() ? 'auto' : '0',
            'margin-right': this.centered() ? 'auto' : '0',
            'padding-left': isResponsivePadding ? '' : SPACING[paddingX as BoxSpacing],
            'padding-right': isResponsivePadding ? '' : SPACING[paddingX as BoxSpacing],
            'padding-top': paddingY,
            'padding-bottom': paddingY,
            'border-radius': RADIUS[this.rounded()],
            background: BACKGROUND[this.background()],
            ...responsiveVars,
        };
    });
}
