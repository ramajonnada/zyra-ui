// Shared spacing/radius/background/shadow token maps and style-builders reused by
// every Layout primitive (Box, Flex, Grid, Container) so they present one consistent
// spacing/tone API instead of each redefining its own scale.

export type BoxSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type BoxRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type BoxBackground =
    | 'none'
    | 'surface'
    | 'surface-subtle'
    | 'surface-inset'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';
export type BoxShadow = 'none' | 'sm' | 'md' | 'lg';

export const SPACING: Record<BoxSpacing, string> = {
    none: '0',
    xs: 'var(--zyra-space-1)',
    sm: 'var(--zyra-space-2)',
    md: 'var(--zyra-space-4)',
    lg: 'var(--zyra-space-6)',
    xl: 'var(--zyra-space-8)',
    '2xl': 'var(--zyra-space-12)',
};

export const RADIUS: Record<BoxRadius, string> = {
    none: '0',
    xs: 'var(--zyra-radius-xs)',
    sm: 'var(--zyra-radius-sm)',
    md: 'var(--zyra-radius-md)',
    lg: 'var(--zyra-radius-lg)',
    xl: 'var(--zyra-radius-xl)',
    '2xl': 'var(--zyra-radius-2xl)',
    full: 'var(--zyra-radius-full)',
};

export const BACKGROUND: Record<BoxBackground, string> = {
    none: 'transparent',
    surface: 'var(--zyra-color-surface)',
    'surface-subtle': 'var(--zyra-color-surface-subtle)',
    'surface-inset': 'var(--zyra-color-surface-inset)',
    accent: 'var(--zyra-color-accent-muted)',
    success: 'var(--zyra-color-success-muted)',
    warning: 'var(--zyra-color-warning-muted)',
    danger: 'var(--zyra-color-danger-muted)',
    info: 'var(--zyra-color-info-muted)',
};

// Border color used when `border` is enabled — tone variants get a matching
// tinted border instead of the neutral default.
export const BORDER_COLOR: Record<BoxBackground, string> = {
    none: 'var(--zyra-color-border-color)',
    surface: 'var(--zyra-color-border-color)',
    'surface-subtle': 'var(--zyra-color-border-color)',
    'surface-inset': 'var(--zyra-color-border-color)',
    accent: 'var(--zyra-color-accent-border)',
    success: 'var(--zyra-color-success-border)',
    warning: 'var(--zyra-color-warning-border)',
    danger: 'var(--zyra-color-danger-border)',
    info: 'var(--zyra-color-info-border)',
};

export const SHADOW: Record<BoxShadow, string> = {
    none: 'none',
    sm: 'var(--zyra-shadow-sm)',
    md: 'var(--zyra-shadow-md)',
    lg: 'var(--zyra-card-elevated-shadow)',
};

export interface SpacingInputs {
    padding: BoxSpacing;
    paddingX: BoxSpacing | undefined;
    paddingY: BoxSpacing | undefined;
    margin: BoxSpacing;
    marginX: BoxSpacing | undefined;
    marginY: BoxSpacing | undefined;
    rounded: BoxRadius;
    background: BoxBackground;
}

export function spacingStyle(inputs: SpacingInputs): Record<string, string> {
    const padding = SPACING[inputs.padding];
    const margin = SPACING[inputs.margin];
    const paddingX = inputs.paddingX !== undefined ? SPACING[inputs.paddingX] : padding;
    const paddingY = inputs.paddingY !== undefined ? SPACING[inputs.paddingY] : padding;
    const marginX = inputs.marginX !== undefined ? SPACING[inputs.marginX] : margin;
    const marginY = inputs.marginY !== undefined ? SPACING[inputs.marginY] : margin;

    return {
        'padding-top': paddingY,
        'padding-bottom': paddingY,
        'padding-left': paddingX,
        'padding-right': paddingX,
        'margin-top': marginY,
        'margin-bottom': marginY,
        'margin-left': marginX,
        'margin-right': marginX,
        'border-radius': RADIUS[inputs.rounded],
        background: BACKGROUND[inputs.background],
    };
}

/** Normalizes a dimension input: numbers become px, strings pass through untouched. */
export function toDimension(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}
