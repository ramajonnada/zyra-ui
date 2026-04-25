import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { UI_COMPONENT_SHOWCASE } from './ui-components.data';

@Component({
    selector: 'app-ui-components',
    imports: [RouterLink, ZyraBadge, ZyraCard, FaIconComponent],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents {
    readonly showcaseCards = UI_COMPONENT_SHOWCASE;
    readonly componentCount = UI_COMPONENT_SHOWCASE.length;
    readonly categoryCount = new Set(UI_COMPONENT_SHOWCASE.map((card) => card.category)).size;
}
