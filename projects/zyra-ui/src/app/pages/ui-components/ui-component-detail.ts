import { toSignal } from '@angular/core/rxjs-interop';
import { Component, OnDestroy, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZyraBadge } from 'zyra-ng-ui';
import { getUiComponentShowcaseCard, UI_COMPONENT_SHOWCASE } from './ui-components.data';
import { map } from 'rxjs';
import { SeoService } from '../../../seo/seo.service';
import { Playground } from './shared/playground/playground';
import { PLAYGROUND_REGISTRY } from './shared/playground/playground-registry';
import { Breadcrumb, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';

@Component({
    selector: 'app-ui-component-detail',
    imports: [RouterLink, ZyraBadge, Playground, Breadcrumb],
    templateUrl: './ui-component-detail.html',
    styleUrl: './ui-component-detail.scss',
})
export class UiComponentDetail implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly seo = inject(SeoService);

    private readonly componentSlug = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('component'))),
        { initialValue: this.route.snapshot.paramMap.get('component') },
    );

    readonly component = computed(() => getUiComponentShowcaseCard(this.componentSlug()));

    readonly playgroundConfig = computed(
        () => PLAYGROUND_REGISTRY[this.componentSlug() ?? ''] ?? null,
    );

    readonly relatedComponents = computed(() => {
        const slugs = this.component()?.relatedSlugs ?? [];
        return slugs.map((s) => UI_COMPONENT_SHOWCASE.find((c) => c.slug === s)).filter(Boolean);
    });

    readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Components', url: 'https://www.zyraui.dev/components' },
        { label: this.component()?.title ?? 'Component', url: `https://www.zyraui.dev/components/${this.component()?.slug ?? ''}` },
    ]);

    ngOnInit(): void {
        const component = this.component();
        const componentName = component?.title || 'Component';
        const slug = component?.slug || '';
        const url = `https://www.zyraui.dev/components/${slug}`;
        const description = component?.description
            ? `${component.description} Interactive playground and full API reference for the Angular ${componentName} component from Zyra UI.`
            : `Interactive playground and full API reference for the Angular ${componentName} component from Zyra UI.`;

        this.seo.setSEO({
            title: `${componentName} Component - Zyra UI`,
            description,
            url,
        });

        this.seo.injectJsonLd('component-page-jsonld', {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${componentName} Component - Zyra UI`,
            description: component?.description,
            url,
            isPartOf: { '@type': 'WebSite', url: 'https://www.zyraui.dev/' },
        });
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('component-page-jsonld');
    }
}
