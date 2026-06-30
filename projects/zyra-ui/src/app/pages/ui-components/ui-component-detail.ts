import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZyraBadge } from 'zyra-ng-ui';
import { getUiComponentShowcaseCard, UI_COMPONENT_SHOWCASE } from './ui-components.data';
import { map } from 'rxjs';
import { SeoService } from '../../../seo/seo.service';
import { Playground } from './shared/playground/playground';
import { PLAYGROUND_REGISTRY } from './shared/playground/playground-registry';

@Component({
    selector: 'app-ui-component-detail',
    imports: [RouterLink, ZyraBadge, Playground],
    templateUrl: './ui-component-detail.html',
    styleUrl: './ui-component-detail.scss',
})
export class UiComponentDetail implements OnInit {
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

    ngOnInit(): void {
        const componentName = this.component()?.title || 'Component';
        const slug = this.component()?.slug || '';

        this.seo.setSEO({
            title: `${componentName} Component - Zyra UI`,
            description: `Interactive playground, copy-paste examples, and full API reference for the Angular ${componentName} component from Zyra UI.`,
            url: `https://www.zyraui.dev/components/${slug}`,
        });
    }
}
