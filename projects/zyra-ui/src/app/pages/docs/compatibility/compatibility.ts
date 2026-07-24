import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';

interface CompatRow {
    label: string;
    value: string;
    note: string;
}

@Component({
    selector: 'app-docs-compatibility',
    imports: [RouterLink, ZyraButton, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './compatibility.html',
    styleUrl: './compatibility.scss',
})
export class DocsCompatibility implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Compatibility', url: 'https://www.zyraui.dev/docs/compatibility' },
    ];

    readonly rows: readonly CompatRow[] = [
        {
            label: 'Angular version',
            value: '21.0.0+',
            note: 'Peer dependency on @angular/core, @angular/common, and @angular/forms, all ^21.0.0. Earlier versions are not supported — the library relies on Angular 21\'s signal APIs (input(), output(), model()) throughout.',
        },
        {
            label: 'Standalone components',
            value: 'Required — and the only mode',
            note: 'Every component is standalone. There is no NgModule to import as a fallback for pre-standalone apps.',
        },
        {
            label: 'Zoneless change detection',
            value: 'Supported',
            note: 'No component depends on Zone.js-driven change detection. This site (zyraui.dev) itself runs with provideZonelessChangeDetection() and zero Zone.js in its dependency tree.',
        },
        {
            label: 'Server-side rendering (SSR)',
            value: 'Supported',
            note: 'Components avoid direct window/document access outside lifecycle hooks that are safe for SSR. This site is itself server-rendered with client hydration (provideClientHydration).',
        },
        {
            label: 'RxJS',
            value: 'Not required to use components',
            note: 'Component inputs, outputs, and internal state are signal-based. Your app can use RxJS elsewhere (HttpClient, routing, etc.) — ZyraUI just never forces a subscription to use a component.',
        },
        {
            label: 'TypeScript',
            value: 'Fully typed',
            note: 'Every input, output, and public token is typed — no any in the public API surface.',
        },
        {
            label: 'Browsers',
            value: 'Evergreen (Chrome, Firefox, Safari, Edge)',
            note: 'Same browser support baseline as Angular 21 itself. No IE11 or legacy-browser support.',
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Compatibility - Zyra UI Docs',
            description:
                'Angular version support, SSR, zoneless change detection, RxJS, and browser compatibility for Zyra UI.',
            url: 'https://www.zyraui.dev/docs/compatibility',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
