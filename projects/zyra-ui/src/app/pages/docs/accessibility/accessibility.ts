import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';

interface CoverageItem {
    title: string;
    description: string;
}

@Component({
    selector: 'app-docs-accessibility',
    imports: [RouterLink, ZyraButton, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './accessibility.html',
    styleUrl: './accessibility.scss',
})
export class DocsAccessibility implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Accessibility', url: 'https://www.zyraui.dev/docs/accessibility' },
    ];

    readonly coverage: readonly CoverageItem[] = [
        {
            title: 'Keyboard support',
            description:
                'Every interactive component is fully operable from the keyboard — Tab/Shift+Tab for focus order, Escape to close overlays (zyra-modal, zyra-tooltip, zyra-command-palette), and arrow-key navigation where a native pattern expects it (zyra-tabs, zyra-radio-group, zyra-tree-view).',
        },
        {
            title: 'Focus management',
            description:
                'Visible focus rings are never suppressed. Every component uses the shared --zyra-ring / --zyra-color-*-focus-shadow tokens rather than outline: none. Overlay components (zyra-modal, zyra-drawer, zyra-command-palette) trap focus while open and restore it to the triggering element on close.',
        },
        {
            title: 'ARIA roles and semantics',
            description:
                'Components use the correct native or ARIA role for their pattern (role="switch", role="alert", role="status", role="tab"/"tabpanel", etc.) rather than a generic div. Reference implementations — zyra-modal, zyra-tabs, zyra-radio — are used as the pattern source for every new interactive component.',
        },
        {
            title: 'Color contrast',
            description:
                'Text on filled semantic backgrounds uses the matching on-* token (--zyra-color-on-warning, --zyra-color-on-danger, etc.) instead of an assumed white, because amber and other bright semantic colors fail WCAG AA with plain white text. Contrast is targeted at WCAG AA (4.5:1 normal text, 3:1 large text/UI components) across all 5 themes.',
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Accessibility - Zyra UI Docs',
            description:
                'How Zyra UI approaches accessibility: keyboard support, focus management, ARIA roles, and WCAG AA color contrast across all five themes.',
            url: 'https://www.zyraui.dev/docs/accessibility',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
