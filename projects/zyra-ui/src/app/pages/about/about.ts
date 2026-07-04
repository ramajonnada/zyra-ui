import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraIcon, type ZyraIconData } from 'zyra-ng-ui';
import { ZyraBadge, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { COMPONENT_COUNT } from '../ui-components/ui-components.data';
import { github, npm as npmIcon, envelope, folder, cubes, message, palette, bolt, codeBranch, universalAccess, rocket, instagram, globe, swatchbook, boxOpen, moon, waveSquare, check, lock, circleInfo, triangleExclamation, alignLeft, puzzlePiece, sun, caretLeft, caretRight, handPointer, certificate, square, circleUser, keyboard, spinner } from 'zyra-ng-ui';

interface AboutValue {
    title: string;
    description: string;
    icon: ZyraIconData;
}

interface AboutStat {
    value: string;
    label: string;
}

@Component({
    selector: 'app-about',
    imports: [RouterLink, ZyraIcon, ZyraBadge, ZyraButton, ZyraCard],
    templateUrl: './about.html',
    styleUrl: './about.scss',
})
export class About implements OnInit {
    private readonly seo = inject(SeoService);
    readonly icons = { github, sun, moon, check, lock, circleInfo, triangleExclamation, alignLeft, puzzlePiece, caretLeft, caretRight };
    readonly componentCount = COMPONENT_COUNT;

    readonly stats: readonly AboutStat[] = [
        { value: String(COMPONENT_COUNT), label: 'Components' },
        { value: 'MIT', label: 'License' },
        { value: 'v21', label: 'Angular' },
        { value: '100%', label: 'Signals-first' },
    ];

    readonly values: readonly AboutValue[] = [
        {
            title: 'Token-first design',
            description:
                'Colors, spacing, radius, elevation, and motion all live in the Zyra token layer — override one variable, update the entire system.',
            icon: palette,
        },
        {
            title: 'Signals-first DX',
            description:
                'Built for Angular 17+ with model(), input(), and output() — reactive by default, no RxJS required for component inputs.',
            icon: bolt,
        },
        {
            title: 'Angular-native',
            description:
                'Standalone components, typed APIs, OnPush change detection, and modern Angular patterns guide every public example.',
            icon: codeBranch,
        },
        {
            title: 'Accessibility built in',
            description:
                'ARIA roles, keyboard navigation, focus management, and visible focus rings — every component ships accessible out of the box.',
            icon: universalAccess,
        },
        {
            title: 'Public-site ready',
            description:
                'SSR-compatible, SEO-considered, and fast. Zyra UI powers the docs, blog, and landing pages it documents.',
            icon: rocket,
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'About Zyra UI - Angular components built with design tokens',
            description:
                `Learn about Zyra UI — a signals-first Angular component library with ${COMPONENT_COUNT} accessible, token-driven components for real apps and public websites.`,
            url: 'https://www.zyraui.dev/about',
        });
    }
}
