import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../../shared/breadcrumb-jsonld';

interface InstallStep {
    step: string;
    title: string;
    description: string;
    code: string;
}

@Component({
    selector: 'app-docs-installation',
    imports: [RouterLink, ZyraButton, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './installation.html',
    styleUrl: './installation.scss',
})
export class DocsInstallation implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    readonly installSteps: readonly InstallStep[] = [
        {
            step: '01',
            title: 'Install the package',
            description:
                'Add zyra-ng-ui and its peer dependencies to your Angular workspace. Requires Angular 21+ and @angular/forms.',
            code: `npm install zyra-ng-ui`,
        },
        {
            step: '02',
            title: 'Import global styles',
            description:
                'Add one line to your global stylesheet. This loads all design tokens, theme variables, animations, and base resets.',
            code: `// styles.scss (or styles.css)
@use 'zyra-ng-ui';`,
        },
        {
            step: '03',
            title: 'Register the provider',
            description: 'Enable the token-driven theme service once during app bootstrap.',
            code: `// app.config.ts
import { provideZyra } from 'zyra-ng-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZyra({ theme: 'light' }),
  ],
};`,
        },
        {
            step: '04',
            title: 'Import and use',
            description: 'Drop any component directly into your standalone imports array — tree-shake the rest.',
            code: `import { ZyraButton, ZyraCard } from 'zyra-ng-ui';

@Component({
  standalone: true,
  imports: [ZyraButton, ZyraCard],
  template: \`
    <zyra-card padding="lg">
      <zyra-button variant="primary">Get started</zyra-button>
    </zyra-card>
  \`,
})
export class MyComponent {}`,
        },
    ];

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Installation', url: 'https://www.zyraui.dev/docs/installation' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Installation - Zyra UI Docs',
            description:
                'Install zyra-ng-ui, import the global styles, register the theme provider, and start using components in your Angular app.',
            url: 'https://www.zyraui.dev/docs/installation',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
