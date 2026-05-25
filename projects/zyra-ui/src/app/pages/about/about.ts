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

interface AboutStat {
    value: string;
    label: string;
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

    readonly stats: readonly AboutStat[] = [
        { value: '16', label: 'Components' },
        { value: 'MIT', label: 'License' },
        { value: 'v17+', label: 'Angular' },
        { value: '100%', label: 'Signals-first' },
    ];

    readonly values: readonly AboutValue[] = [
        {
            title: 'Token-first design',
            description:
                'Colors, spacing, radius, elevation, and motion all live in the Zyra token layer — override one variable, update the entire system.',
            icon: appIcons.palette,
        },
        {
            title: 'Signals-first DX',
            description:
                'Built for Angular 17+ with model(), input(), and output() — reactive by default, no RxJS required for component inputs.',
            icon: appIcons.bolt,
        },
        {
            title: 'Angular-native',
            description:
                'Standalone components, typed APIs, OnPush change detection, and modern Angular patterns guide every public example.',
            icon: appIcons.codeBranch,
        },
        {
            title: 'Accessibility built in',
            description:
                'ARIA roles, keyboard navigation, focus management, and visible focus rings — every component ships accessible out of the box.',
            icon: appIcons.universalAccess,
        },
        {
            title: 'Public-site ready',
            description:
                'SSR-compatible, SEO-considered, and fast. Zyra UI powers the docs, blog, and landing pages it documents.',
            icon: appIcons.rocket,
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'About Zyra UI - Angular components built with design tokens',
            description:
                'Learn about Zyra UI — a signals-first Angular component library with 16 accessible, token-driven components for real apps and public websites.',
            url: 'https://www.zyraui.dev/about',
        });
    }
}
