import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { COMPONENT_COUNT, UI_COMPONENT_SHOWCASE } from './ui-components.data';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../shared/breadcrumb-jsonld';

@Component({
    selector: 'app-ui-components',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, ZyraBadge, ZyraCard, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    readonly componentCount = COMPONENT_COUNT;
    readonly categoryCount = new Set(UI_COMPONENT_SHOWCASE.map((c) => c.category)).size;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Components', url: 'https://www.zyraui.dev/docs/components' },
    ];

    readonly searchQuery = signal('');

    private readonly sortedCards = [...UI_COMPONENT_SHOWCASE].sort((a, b) =>
        a.title.localeCompare(b.title),
    );

    readonly filteredCards = computed(() => {
        const q = this.searchQuery().toLowerCase().trim();
        if (!q) return this.sortedCards;
        return this.sortedCards.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.selector.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                (c.description ?? '').toLowerCase().includes(q),
        );
    });

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Angular UI Components - Zyra UI',
            description:
                `Explore all ${COMPONENT_COUNT} Zyra UI Angular components — buttons, cards, inputs, forms, modals, toasts, tooltips, tabs, accordion, skeleton, and more. Interactive playgrounds with copy-paste Angular code.`,
            url: 'https://www.zyraui.dev/docs/components',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
