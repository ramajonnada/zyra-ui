import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';

interface TierInfo {
    tier: number;
    name: string;
    purpose: string;
    example: string;
    action: string;
}

interface ColorSwatch {
    name: string;
    variable: string;
}

interface TokenGroup {
    label: string;
    tokens: readonly string[];
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

    // ── 0. Tier explainer ────────────────────────────────────────
    readonly tiers: readonly TierInfo[] = [
        {
            tier: 0,
            name: 'Primitives',
            purpose: 'Raw color palette — every shade in the design system.',
            example: '--zyra-color-violet-600',
            action: 'Never override. Internal building blocks only.',
        },
        {
            tier: 1,
            name: 'Dimension',
            purpose: 'Spacing, radius, fonts, motion. Identical across all themes.',
            example: '--zyra-radius-md',
            action: 'Override to change corner radius, font, or spacing globally.',
        },
        {
            tier: 2,
            name: 'Semantic',
            purpose: 'Named by role, not color. These are the public theming API.',
            example: '--zyra-color-primary',
            action: 'Override to rebrand the whole app in one place.',
        },
        {
            tier: 3,
            name: 'Component',
            purpose: 'Per-component slots that point to Tier 2. Scoped to one component.',
            example: '--zyra-color-btn-primary-bg',
            action: 'Override to restyle one component without touching anything else.',
        },
    ];

    // ── 1. How to override ────────────────────────────────────────
    readonly overrideCode = `/* styles.scss — paste after @use 'zyra-ng-ui' */
:root {
  --zyra-color-primary:        #7c3aed;
  --zyra-color-primary-hover:  #6d28d9;
  --zyra-color-primary-subtle: #ede9fe;
  --zyra-radius-md:            6px;
  --zyra-font-body:            'Inter', sans-serif;
}`;

    // ── 2. Color swatches ─────────────────────────────────────────
    // Individual token names (no abbreviations) so they work as CSS var() refs.
    readonly colorSwatches: readonly ColorSwatch[] = [
        { name: 'Background', variable: '--zyra-color-background' },
        { name: 'Background elevated', variable: '--zyra-color-background-elevated' },
        { name: 'Surface', variable: '--zyra-color-surface' },
        { name: 'Surface subtle', variable: '--zyra-color-surface-subtle' },
        { name: 'Surface inset', variable: '--zyra-color-surface-inset' },
        { name: 'Foreground', variable: '--zyra-color-foreground' },
        { name: 'Foreground muted', variable: '--zyra-color-foreground-muted' },
        { name: 'Foreground subtle', variable: '--zyra-color-foreground-subtle' },
        { name: 'Primary', variable: '--zyra-color-primary' },
        { name: 'Primary hover', variable: '--zyra-color-primary-hover' },
        { name: 'Primary subtle', variable: '--zyra-color-primary-subtle' },
        { name: 'Border', variable: '--zyra-color-border-color' },
        { name: 'Border strong', variable: '--zyra-color-border-strong-color' },
        { name: 'Success', variable: '--zyra-color-success-foreground' },
        { name: 'Success subtle', variable: '--zyra-color-success-subtle' },
        { name: 'Warning', variable: '--zyra-color-warning-foreground' },
        { name: 'Warning subtle', variable: '--zyra-color-warning-subtle' },
        { name: 'Danger', variable: '--zyra-color-danger-foreground' },
        { name: 'Danger subtle', variable: '--zyra-color-danger-subtle' },
        { name: 'Info', variable: '--zyra-color-info-foreground' },
        { name: 'Info subtle', variable: '--zyra-color-info-subtle' },
        { name: 'On brand', variable: '--zyra-color-on-brand' },
        { name: 'On warning', variable: '--zyra-color-on-warning' },
        { name: 'Focus ring', variable: '--zyra-ring' },
    ];

    // ── 3. Shape + font tokens ────────────────────────────────────
    readonly shapeTokens: readonly TokenGroup[] = [
        {
            label: 'Border radius',
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
            label: 'Font families',
            tokens: [
                '--zyra-font-body',
                '--zyra-font-display',
                '--zyra-font-mono',
            ],
        },
        {
            label: 'Spacing scale',
            tokens: [
                '--zyra-space-1',
                '--zyra-space-2',
                '--zyra-space-3',
                '--zyra-space-4',
                '--zyra-space-5',
                '--zyra-space-6',
                '--zyra-space-8',
                '--zyra-space-10',
                '--zyra-space-12',
                '--zyra-space-16',
            ],
        },
        {
            label: 'Motion',
            tokens: [
                '--zyra-transition-fast',
                '--zyra-transition-base',
                '--zyra-transition-slow',
                '--zyra-transition-spring',
            ],
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Theme tokens - Zyra UI Docs',
            description:
                'The Zyra UI token reference: semantic color tokens with live swatches, shape and font tokens, and how to override them in your global stylesheet.',
            url: 'https://www.zyraui.dev/docs/theme-tokens',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
