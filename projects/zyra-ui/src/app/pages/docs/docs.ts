import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

interface DocsStep {
    step: string;
    title: string;
    description: string;
    code: string;
}

@Component({
    selector: 'app-docs',
    imports: [RouterLink, ZyraBadge, ZyraButton, ZyraCard],
    templateUrl: './docs.html',
    styleUrl: './docs.scss',
})
export class Docs implements OnInit {
    private readonly seo = inject(SeoService);

    readonly installSteps: readonly DocsStep[] = [
        {
            step: '01',
            title: 'Install the package',
            description: 'Add Zyra NG UI to your Angular workspace.',
            code: 'npm install zyra-ng-ui',
        },
        {
            step: '02',
            title: 'Register the provider',
            description: 'Enable the token-driven theme service once during app bootstrap.',
            code: "provideZyra({ theme: 'light' })",
        },
        {
            step: '03',
            title: 'Import components',
            description: 'Use standalone imports wherever you need a component primitive.',
            code: 'imports: [ZyraButton, ZyraCard]',
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Zyra UI Docs - Angular component setup and design tokens',
            description:
                'Learn how to install Zyra UI, configure the Angular provider, and use token-driven standalone components.',
            url: 'https://www.zyraui.dev/docs',
        });
    }
}
