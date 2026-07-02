import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../seo/seo.service';
import { inject } from '@angular/core';

export interface BreadcrumbItem {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink],
    templateUrl: './breadcrumb.html',
    styleUrl: './breadcrumb.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb implements OnInit, OnDestroy {
    readonly items = input.required<BreadcrumbItem[]>();

    private readonly seo = inject(SeoService);

    getPath(url: string): string {
        try {
            return new URL(url).pathname;
        } catch {
            return url;
        }
    }

    ngOnInit(): void {
        const list = this.items();

        this.seo.injectJsonLd('breadcrumb-jsonld', {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: list.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.label,
                item: item.url,
            })),
        });
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
