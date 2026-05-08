import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { UI_COMPONENT_SHOWCASE } from './ui-components.data';

@Component({
    selector: 'app-ui-components',
    imports: [RouterLink, ZyraBadge, ZyraCard, FaIconComponent],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents implements OnInit {
    private readonly seo = inject(SeoService);

    readonly showcaseCards = UI_COMPONENT_SHOWCASE;
    readonly componentCount = UI_COMPONENT_SHOWCASE.length;
    readonly categoryCount = new Set(UI_COMPONENT_SHOWCASE.map((card) => card.category)).size;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Angular UI Components - Zyra UI',
            description:
                'Explore Zyra UI Angular components including buttons, cards, inputs, badges, avatars, toasts, and tooltips.',
            url: 'https://www.zyraui.dev/components',
        });
    }
}
