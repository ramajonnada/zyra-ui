import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../../shared/breadcrumb-jsonld';

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

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Theme tokens', url: 'https://www.zyraui.dev/docs/theme-tokens' },
    ];

    readonly tokenGroups: readonly TokenGroup[] = [
        {
            label: 'Color — semantic',
            tokens: [
                '--zyra-color-bg-app',
                '--zyra-color-surface',
                '--zyra-color-fg',
                '--zyra-color-fg-muted',
                '--zyra-color-border',
                '--zyra-color-primary',
            ],
        },
        {
            label: 'Color — theme layer',
            tokens: [
                '--zyra-color-text',
                '--zyra-color-accent',
                '--zyra-color-accent-secondary',
                '--zyra-color-accent-tertiary',
            ],
        },
        {
            label: 'Semantic status',
            tokens: [
                '--zyra-color-success',
                '--zyra-color-warning',
                '--zyra-color-danger',
                '--zyra-color-info',
            ],
        },
        {
            label: 'Typography',
            tokens: ['--zyra-font-body', '--zyra-font-display', '--zyra-font-mono'],
        },
        {
            label: 'Shape & Motion',
            tokens: [
                '--zyra-radius-sm',
                '--zyra-radius-md',
                '--zyra-radius-lg',
                '--zyra-transition-base',
                '--zyra-transition-fast',
            ],
        },
    ];

    readonly overridableTokens: readonly TokenGroup[] = [
        {
            label: 'Semantic color (recommended)',
            tokens: [
                '--zyra-color-bg-app',
                '--zyra-color-surface',
                '--zyra-color-text',
                '--zyra-color-fg-muted',
                '--zyra-color-border',
                '--zyra-color-accent',
                '--zyra-color-success',
                '--zyra-color-warning',
                '--zyra-color-danger',
                '--zyra-color-info',
            ],
        },
        {
            label: 'Dimension (shape, type, motion)',
            tokens: [
                '--zyra-radius-sm / md / lg',
                '--zyra-space-1 … space-20',
                '--zyra-font-body / display / mono',
                '--zyra-transition-fast / base / slow',
            ],
        },
    ];

    readonly internalTokens: readonly TokenGroup[] = [
        {
            label: 'Primitives (raw palette)',
            tokens: ['--zyra-color-cyan-50 … cyan-950'],
        },
        {
            label: 'Component tokens (derived, per-component)',
            tokens: [
                '--zyra-color-btn-primary-bg',
                '--zyra-color-checkbox-checked-bg',
                '--zyra-color-tabs-badge-bg',
                '--zyra-color-field-* / select-* / progress-*',
            ],
        },
    ];

    readonly themeOverrideCode = `/* global styles.css — override any token */
:root {
  --zyra-color-accent:       #7c3aed;
  --zyra-color-accent-muted: #ede9fe;
  --zyra-radius-md:          6px;
  --zyra-font-body:          'Inter', sans-serif;
}`;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Theme tokens - Zyra UI Docs',
            description:
                'The full Zyra UI design token reference: semantic colors, typography, shape and motion tokens, and which layer is safe to override.',
            url: 'https://www.zyraui.dev/docs/theme-tokens',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
