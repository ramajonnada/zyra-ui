import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { UI_COMPONENT_SHOWCASE } from './ui-components.data';

@Component({
    selector: 'app-ui-components',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, ZyraBadge, ZyraCard, FaIconComponent],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents implements OnInit {
    private readonly seo = inject(SeoService);

    readonly componentCount = UI_COMPONENT_SHOWCASE.length;
    readonly categoryCount = new Set(UI_COMPONENT_SHOWCASE.map((c) => c.category)).size;

    readonly searchQuery = signal('');

    readonly filteredCards = computed(() => {
        const q = this.searchQuery().toLowerCase().trim();
        if (!q) return UI_COMPONENT_SHOWCASE;
        return UI_COMPONENT_SHOWCASE.filter(
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
                'Explore all 22 Zyra UI Angular components — buttons, cards, inputs, forms, modals, toasts, tooltips, tabs, accordion, skeleton, and more. Interactive playgrounds with copy-paste Angular code.',
            url: 'https://www.zyraui.dev/components',
        });
    }
}
