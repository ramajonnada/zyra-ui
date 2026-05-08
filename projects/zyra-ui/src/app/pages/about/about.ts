import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ZyraBadge, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { appIcons } from '../../shared/fontawesome-icons';

interface AboutValue {
    title: string;
    description: string;
    icon: IconDefinition;
}

@Component({
    selector: 'app-about',
    imports: [RouterLink, FaIconComponent, ZyraBadge, ZyraButton, ZyraCard],
    templateUrl: './about.html',
    styleUrl: './about.scss',
})
export class About implements OnInit {
    private readonly seo = inject(SeoService);
    readonly icons = appIcons;

    readonly values: readonly AboutValue[] = [
        {
            title: 'Token-first design',
            description:
                'Colors, type, spacing, radius, elevation, and motion come from the Zyra token layer.',
            icon: appIcons.palette,
        },
        {
            title: 'Angular-native DX',
            description:
                'Standalone components, typed APIs, and modern Angular patterns guide every public example.',
            icon: appIcons.codeBranch,
        },
        {
            title: 'Public-site polish',
            description:
                'Documentation, blog content, and landing pages are built to be readable, crawlable, and fast.',
            icon: appIcons.rocket,
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'About Zyra UI - Angular components built with design tokens',
            description:
                'Learn about Zyra UI, a token-driven Angular component library focused on polished public websites and product interfaces.',
            url: 'https://www.zyraui.dev/about',
        });
    }
}
