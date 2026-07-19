import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';

interface TokenGroup {
    label: string;
    tokens: readonly string[];
}

interface TokenTier {
    id: string;
    title: string;
    description: string;
    groups: readonly TokenGroup[];
}

@Component({
    selector: 'app-docs-theme-tokens',
    imports: [RouterLink, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './theme-tokens.html',
    styleUrl: './theme-tokens.scss',
})
export class DocsThemeTokens implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Theme tokens', url: 'https://www.zyraui.dev/docs/theme-tokens' },
    ];

    // ── Tier 0 — Primitives ─────────────────────────────────────
    // Raw palette, theme-invariant. Never consumed by components directly.
    private readonly primitivesTier: TokenTier = {
        id: 'primitives',
        title: 'Tier 0 — Primitives',
        description:
            'Raw palette values. Identical across all five themes and never read by components directly — every other tier derives from (or replaces) these.',
        groups: [
            {
                label: 'Cyan scale',
                tokens: [
                    '--zyra-color-cyan-50',
                    '--zyra-color-cyan-100',
                    '--zyra-color-cyan-200',
                    '--zyra-color-cyan-300',
                    '--zyra-color-cyan-400',
                    '--zyra-color-cyan-500',
                    '--zyra-color-cyan-600',
                    '--zyra-color-cyan-700',
                    '--zyra-color-cyan-800',
                    '--zyra-color-cyan-900',
                    '--zyra-color-cyan-950',
                ],
            },
        ],
    };

    // ── Per-theme raw tokens ──────────────────────────────────────
    // Same names, different values in each of the 5 themes (dark, light,
    // ocean, amber, rose). The semantic tier below aliases these.
    private readonly perThemeTier: TokenTier = {
        id: 'per-theme',
        title: 'Tier 1 — Theme (raw, per-theme)',
        description:
            'Defined once per theme file with identical names and different values — this is what actually changes when you switch between dark, light, ocean, amber, and rose. See it live on the theming page.',
        groups: [
            {
                label: 'Surfaces',
                tokens: [
                    '--zyra-color-bg-app',
                    '--zyra-color-bg-panel',
                    '--zyra-color-bg-surface',
                    '--zyra-color-bg-raised',
                ],
            },
            {
                label: 'Borders',
                tokens: ['--zyra-color-border', '--zyra-color-border-hover', '--zyra-color-border-strong'],
            },
            {
                label: 'Text',
                tokens: [
                    '--zyra-color-text',
                    '--zyra-color-text-muted',
                    '--zyra-color-text-dim',
                    '--zyra-color-text-inverse',
                    '--zyra-color-surface-inverse',
                ],
            },
            {
                label: 'Glow (RGB channels)',
                tokens: ['--zyra-color-glow'],
            },
            {
                label: 'Accent',
                tokens: [
                    '--zyra-color-accent',
                    '--zyra-color-accent-hover',
                    '--zyra-color-accent-muted',
                    '--zyra-color-accent-border',
                    '--zyra-focus-ring',
                ],
            },
            {
                label: 'Secondary / tertiary accents',
                tokens: [
                    '--zyra-color-accent-secondary',
                    '--zyra-color-accent-secondary-muted',
                    '--zyra-color-accent-secondary-border',
                    '--zyra-color-accent-tertiary',
                    '--zyra-color-accent-tertiary-muted',
                    '--zyra-color-accent-tertiary-border',
                ],
            },
            {
                label: 'Status (raw)',
                tokens: [
                    '--zyra-color-success / -muted / -border',
                    '--zyra-color-warning / -muted / -border',
                    '--zyra-color-danger / -muted / -border / -text',
                    '--zyra-color-info / -muted / -border',
                ],
            },
            {
                label: 'Shadows',
                tokens: ['--zyra-shadow-sm', '--zyra-shadow-md', '--zyra-shadow-accent', '--zyra-shadow-glow'],
            },
            {
                label: 'Buttons (raw)',
                tokens: ['--zyra-color-btn-primary-text', '--zyra-color-btn-ghost-hover-bg'],
            },
            {
                label: 'Inputs (raw)',
                tokens: ['--zyra-color-input-bg', '--zyra-color-input-border', '--zyra-input-shadow-focus'],
            },
            {
                label: 'Cards (raw)',
                tokens: [
                    '--zyra-color-card-bg',
                    '--zyra-color-card-border',
                    '--zyra-color-card-section-bg',
                    '--zyra-card-shadow',
                    '--zyra-card-elevated-shadow',
                    '--zyra-card-focus-ring',
                ],
            },
            {
                label: 'Misc',
                tokens: [
                    '--zyra-color-code-bg',
                    '--zyra-color-overlay-bg',
                    '--zyra-color-scrollbar-thumb-base / -track-base',
                    '--zyra-color-tooltip-bg / -text / -border',
                    '--zyra-tooltip-shadow',
                    '--zyra-color-toast-bg / -border',
                    '--zyra-color-spinner-inverse-track / -head',
                    '--zyra-color-pill-active-bg',
                    '--zyra-pill-active-shadow',
                    '--zyra-color-preview-stage-bg',
                    '--zyra-color-glass-bg',
                    '--zyra-color-header-glass-bg',
                    '--zyra-header-backdrop-base',
                    '--zyra-header-shadow-base',
                ],
            },
        ],
    };

    // ── Tier 1 — Semantic ─────────────────────────────────────────
    private readonly semanticTier: TokenTier = {
        id: 'semantic',
        title: 'Tier 2 — Semantic',
        description:
            'Role-based aliases over the per-theme raw tokens above. This is the layer components read from and the layer you should override — everything downstream follows automatically.',
        groups: [
            {
                label: 'Canvas / background',
                tokens: ['--zyra-color-background', '--zyra-color-background-elevated'],
            },
            {
                label: 'Surface',
                tokens: [
                    '--zyra-color-surface',
                    '--zyra-color-surface-subtle',
                    '--zyra-color-surface-inset',
                    '--zyra-color-surface-dropdown',
                    '--zyra-color-overlay-scrim',
                ],
            },
            {
                label: 'Foreground / text',
                tokens: [
                    '--zyra-color-foreground',
                    '--zyra-color-foreground-muted',
                    '--zyra-color-foreground-subtle',
                ],
            },
            {
                label: 'Brand / primary',
                tokens: [
                    '--zyra-color-primary',
                    '--zyra-color-primary-hover',
                    '--zyra-color-primary-subtle',
                    '--zyra-color-primary-border',
                ],
            },
            {
                label: 'Border',
                tokens: ['--zyra-color-border-color', '--zyra-color-border-strong-color'],
            },
            {
                label: 'Status',
                tokens: [
                    '--zyra-color-success-foreground / -subtle / -border-color',
                    '--zyra-color-warning-foreground / -subtle / -border-color',
                    '--zyra-color-danger-foreground / -subtle / -border-color',
                    '--zyra-color-info-foreground / -subtle / -border-color',
                ],
            },
            {
                label: '"On" roles (content over a filled bg)',
                tokens: [
                    '--zyra-color-on-brand',
                    '--zyra-color-on-success',
                    '--zyra-color-on-warning',
                    '--zyra-color-on-danger',
                    '--zyra-color-on-info',
                ],
            },
            {
                label: 'Focus',
                tokens: ['--zyra-ring'],
            },
        ],
    };

    // ── Tier 2 — Dimension ────────────────────────────────────────
    private readonly dimensionTier: TokenTier = {
        id: 'dimension',
        title: 'Tier 0 — Primitives (Dimension)',
        description:
            'Typography, shape, motion, spacing, and z-index — theme-invariant raw values, same tier as the color primitives above (per the engineering guide, structural values like these are Tier 0, not a separate numbered tier).',
        groups: [
            {
                label: 'Typography',
                tokens: ['--zyra-font-display', '--zyra-font-body', '--zyra-font-mono'],
            },
            {
                label: 'Radius',
                tokens: [
                    '--zyra-radius-xs',
                    '--zyra-radius-sm',
                    '--zyra-radius-md',
                    '--zyra-radius-lg',
                    '--zyra-radius-xl',
                    '--zyra-radius-2xl',
                    '--zyra-radius-full',
                ],
            },
            {
                label: 'Motion — easing',
                tokens: ['--zyra-ease-standard', '--zyra-ease-spring'],
            },
            {
                label: 'Motion — duration',
                tokens: [
                    '--zyra-duration-fast',
                    '--zyra-duration-moderate',
                    '--zyra-duration-base',
                    '--zyra-duration-slow',
                ],
            },
            {
                label: 'Motion — transition (duration + easing)',
                tokens: [
                    '--zyra-transition-fast',
                    '--zyra-transition-moderate',
                    '--zyra-transition-base',
                    '--zyra-transition-slow',
                    '--zyra-transition-spring',
                ],
            },
            {
                label: 'Spacing',
                tokens: [
                    '--zyra-space-1 … --zyra-space-6',
                    '--zyra-space-8',
                    '--zyra-space-10',
                    '--zyra-space-12',
                    '--zyra-space-16',
                    '--zyra-space-20',
                ],
            },
            {
                label: 'Z-index',
                tokens: [
                    '--zyra-z-base',
                    '--zyra-z-raised',
                    '--zyra-z-dropdown',
                    '--zyra-z-sticky',
                    '--zyra-z-overlay',
                    '--zyra-z-modal',
                    '--zyra-z-tooltip',
                    '--zyra-z-toast',
                ],
            },
        ],
    };

    // ── Tier 3 — Component ────────────────────────────────────────
    private readonly componentTier: TokenTier = {
        id: 'component',
        title: 'Tier 3 — Component',
        description:
            'Per-component namespaced aliases over the semantic and dimension tiers, grouped the same way the component library itself is organized. This is the public, documented styling API — safe to override indefinitely. Override the semantic tier instead when you want a broad theme-wide change; override these directly to restyle one component without touching anything else.',
        groups: [
            {
                label: 'Actions — Button',
                tokens: [
                    '--zyra-color-btn-primary-bg / -border / -hover-bg',
                    '--zyra-color-btn-secondary-bg / -text / -border / -hover-bg / -hover-border',
                    '--zyra-color-btn-ghost-text / -hover-bg / -hover-text',
                    '--zyra-color-btn-danger-bg / -text / -border / -hover-bg / -hover-text / -hover-border',
                    '--zyra-color-btn-outline-hover-bg / -hover-border',
                    '--zyra-btn-disabled-opacity',
                    '--zyra-btn-focus-ring',
                ],
            },
            {
                label: 'Navigation — Header',
                tokens: [
                    '--zyra-header-bg / -border / -border-width',
                    '--zyra-header-padding-x / -gap',
                    '--zyra-header-height / -height-sm / -height-lg',
                    '--zyra-header-burger-size / -burger-radius',
                    '--zyra-header-z-index',
                    '--zyra-header-glass-bg / -backdrop / -shadow',
                    '--zyra-header-divider-color / -divider-width',
                ],
            },
            {
                label: 'Navigation — Sidebar',
                tokens: [
                    '--zyra-color-sidebar-bg / -border',
                    '--zyra-color-sidebar-heading / -text / -text-hover / -text-active',
                    '--zyra-color-sidebar-hover-bg / -active-bg',
                    '--zyra-color-sidebar-badge-bg / -badge-text',
                ],
            },
            {
                label: 'Navigation — Drawer',
                tokens: [
                    '--zyra-color-drawer-bg / -text / -border',
                    '--zyra-drawer-width / -max-width / -padding',
                    '--zyra-drawer-nav-item-gap / -section-gap / -footer-gap',
                    '--zyra-drawer-shadow',
                ],
            },
            {
                label: 'Navigation — Tabs',
                tokens: [
                    '--zyra-color-tabs-text / -text-hover / -text-active',
                    '--zyra-color-tabs-border / -indicator',
                    '--zyra-color-tabs-badge-bg / -badge-text / -badge-active-bg / -badge-active-text',
                    '--zyra-color-tabs-pill-active-bg',
                    '--zyra-tabs-pill-active-shadow',
                ],
            },
            {
                label: 'Forms — Checkbox / Radio',
                tokens: [
                    '--zyra-color-checkbox-bg / -border / -checked-bg / -checked-border / -mark',
                    '--zyra-checkbox-focus-shadow',
                    '--zyra-color-radio-bg / -border / -checked-border / -checked-bg / -dot',
                    '--zyra-radio-focus-shadow',
                ],
            },
            {
                label: 'Forms — Switch / Toggle',
                tokens: [
                    '--zyra-color-switch-track-off / -track-on',
                    '--zyra-switch-ring',
                    '--zyra-color-toggle-border / -bg-on / -fg-on',
                    '--zyra-toggle-ring',
                ],
            },
            {
                label: 'Forms — Form-field',
                tokens: [
                    '--zyra-field-label-font',
                    '--zyra-color-field-label-color / -required-mark / -icon-color',
                    '--zyra-color-field-bg / -border / -filled-bg / -focus-border',
                    '--zyra-field-focus-shadow',
                    '--zyra-color-field-hint-color / -counter-color / -counter-warn / -counter-error',
                    '--zyra-color-field-success-color / -error-color',
                    '--zyra-field-success-shadow / -error-shadow',
                ],
            },
            {
                label: 'Forms — Select',
                tokens: [
                    '--zyra-color-select-text / -placeholder / -icon',
                    '--zyra-color-select-bg / -border / -filled-bg / -focus-border',
                    '--zyra-select-focus-shadow',
                    '--zyra-color-select-panel-bg / -panel-border',
                    '--zyra-select-panel-shadow',
                ],
            },
            {
                label: 'Forms — Slider / File upload',
                tokens: [
                    '--zyra-color-slider-track / -fill / -thumb / -thumb-ring / -text',
                    '--zyra-color-file-upload-bg / -text / -border',
                ],
            },
            {
                label: 'Data display — Card & glow',
                tokens: [
                    '--zyra-color-card-border / -hover-border',
                    '--zyra-card-radius',
                    '--zyra-card-focus-ring',
                    '--zyra-color-glow-border / -glow-shadow / -glow-shadow-strong / -glow-surface',
                ],
            },
            {
                label: 'Data display — Avatar / Code block',
                tokens: [
                    '--zyra-color-avatar-primary-end / -blue-end / -purple-end / -warm-end / -contrast',
                    '--zyra-color-code-keyword / -tag / -attr / -string / -number / -comment / -punct',
                ],
            },
            {
                label: 'Data display — Carousel / Calendar',
                tokens: [
                    '--zyra-color-carousel-bg / -text / -border',
                    '--zyra-color-calendar-bg / -text / -border',
                ],
            },
            {
                label: 'Feedback — Progress',
                tokens: [
                    '--zyra-color-progress-track-bg / -track-border / -label-color',
                    '--zyra-color-progress-default / -success / -warning / -danger / -info',
                ],
            },
            {
                label: 'Overlay (generic — Drawer, Modal, Command Palette)',
                tokens: ['--zyra-overlay-bg', '--zyra-overlay-z-index', '--zyra-overlay-fade-duration'],
            },
            {
                label: 'Utilities — Scroll area / Theme switch',
                tokens: [
                    '--zyra-color-scrollbar-thumb / -thumb-hover / -track',
                    '--zyra-color-theme-switch-bg / -bg-hover / -text / -border',
                    '--zyra-color-theme-switch-panel-bg / -panel-shadow',
                ],
            },
        ],
    };

    readonly tiers: readonly TokenTier[] = [
        this.primitivesTier,
        this.perThemeTier,
        this.semanticTier,
        this.dimensionTier,
        this.componentTier,
    ];

    readonly overridableTokens: readonly TokenGroup[] = [
        {
            label: 'Semantic color (recommended)',
            tokens: [
                '--zyra-color-background / -background-elevated',
                '--zyra-color-surface / -surface-subtle / -surface-inset',
                '--zyra-color-foreground / -foreground-muted / -foreground-subtle',
                '--zyra-color-primary / -primary-hover / -primary-subtle / -primary-border',
                '--zyra-color-border-color / -border-strong-color',
                '--zyra-color-success / warning / danger / info -foreground / -subtle / -border-color',
                '--zyra-ring',
            ],
        },
        {
            label: 'Dimension (shape, type, motion, space)',
            tokens: [
                '--zyra-radius-xs … radius-2xl / radius-full',
                '--zyra-space-1 … space-20',
                '--zyra-font-body / display / mono',
                '--zyra-ease-standard / ease-spring',
                '--zyra-transition-fast / moderate / base / slow / spring',
            ],
        },
        {
            label: 'Component (most targeted — restyle one component)',
            tokens: [
                '--zyra-color-btn-primary-bg',
                '--zyra-color-checkbox-checked-bg',
                '--zyra-color-tabs-badge-bg',
                '--zyra-color-field-bg / -border, --zyra-field-focus-shadow',
                '--zyra-color-select-text / -bg, --zyra-select-focus-shadow',
                '--zyra-color-progress-default / -success / -warning / -danger',
                '--zyra-header-bg / -height / -padding-x (no "color-" infix)',
                '--zyra-color-sidebar-bg / -text / -active-bg',
            ],
        },
    ];

    readonly internalTokens: readonly TokenGroup[] = [
        {
            label: 'Primitives (raw palette)',
            tokens: ['--zyra-color-cyan-50 … cyan-950'],
        },
        {
            label: 'Per-theme raw tokens',
            tokens: ['--zyra-color-bg-app / -accent / -text — swap themes instead of these directly'],
        },
    ];

    readonly themeOverrideCode = `/* global styles.css — override any token */
:root {
  --zyra-color-primary:       #7c3aed;
  --zyra-color-primary-subtle: #ede9fe;
  --zyra-radius-md:           6px;
  --zyra-font-body:           'Inter', sans-serif;
}`;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Theme tokens - Zyra UI Docs',
            description:
                'The full Zyra UI design token reference: primitives, per-theme raw tokens, semantic colors, typography, shape and motion tokens, and per-component tokens — plus which layer is safe to override.',
            url: 'https://www.zyraui.dev/docs/theme-tokens',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
