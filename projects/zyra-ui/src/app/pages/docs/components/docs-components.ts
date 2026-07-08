import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../../shared/breadcrumb-jsonld';
import { UI_COMPONENT_SHOWCASE } from '../../ui-components/ui-components.data';

interface ComponentCategoryGroup {
    label: string;
    items: readonly { title: string; slug: string; selector: string }[];
}

@Component({
    selector: 'app-docs-components',
    imports: [RouterLink, ZyraButton, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './docs-components.html',
    styleUrl: './docs-components.scss',
})
export class DocsComponents implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    readonly totalCount = UI_COMPONENT_SHOWCASE.length;

    readonly categoryGroups = computed<readonly ComponentCategoryGroup[]>(() => {
        const byCategory = new Map<string, { title: string; slug: string; selector: string }[]>();

        for (const component of UI_COMPONENT_SHOWCASE) {
            const items = byCategory.get(component.category) ?? [];
            items.push({
                title: component.title,
                slug: component.slug,
                selector: component.selector,
            });
            byCategory.set(component.category, items);
        }

        return [...byCategory.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, items]) => ({
                label,
                items: items.sort((a, b) => a.title.localeCompare(b.title)),
            }));
    });

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Components', url: 'https://www.zyraui.dev/docs/components' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Components - Zyra UI Docs',
            description:
                'How Zyra UI components are organized and built: standalone by default, signal-based inputs and outputs, zyra-* selectors, and tree-shakeable imports.',
            url: 'https://www.zyraui.dev/docs/components',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
