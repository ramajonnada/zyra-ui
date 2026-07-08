import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    ZyraAccordion,
    ZyraAccordionItem,
    ZyraBreadcrumb,
    ZyraBreadcrumbItem,
    ZyraButton,
} from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../shared/breadcrumb-jsonld';

interface DocsNextLink {
    title: string;
    description: string;
    route: string;
}

@Component({
    selector: 'app-docs',
    imports: [
        RouterLink,
        ZyraButton,
        ZyraAccordion,
        ZyraAccordionItem,
        ZyraBreadcrumb,
        ZyraBreadcrumbItem,
    ],
    templateUrl: './docs.html',
    styleUrl: './docs.scss',
})
export class Docs implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    readonly nextLinks: readonly DocsNextLink[] = [
        {
            title: 'Installation',
            description: 'Install the package, import global styles, and register the theme provider.',
            route: '/docs/installation',
        },
        {
            title: 'Components',
            description: 'How components are organized, conventions, and the full catalog by category.',
            route: '/docs/components',
        },
        {
            title: 'Theming',
            description: 'Switch between five built-in themes and preview components live.',
            route: '/docs/theming',
        },
        {
            title: 'Theme tokens',
            description: 'The full design token reference and what is safe to override.',
            route: '/docs/theme-tokens',
        },
    ];

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Zyra UI Docs - Angular component setup and design tokens',
            description:
                'Learn how to install Zyra UI, configure the Angular provider, use token-driven components, and customize the theme system.',
            url: 'https://www.zyraui.dev/docs',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
