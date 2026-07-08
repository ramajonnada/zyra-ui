import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    ZyraAlert,
    ZyraBadge,
    ZyraBreadcrumb,
    ZyraBreadcrumbItem,
    ZyraButton,
    ZyraCard,
    ZyraFormField,
    ZyraInput,
    ZyraSwitch,
    ZyraTheme,
    ZyraThemeService,
} from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink } from '../../../shared/breadcrumb-jsonld';

interface ThemeOption {
    value: ZyraTheme;
    label: string;
    accent: string;
    surface: string;
}

interface TokenSwatch {
    name: string;
    variable: string;
}

interface SetupStep {
    step: string;
    title: string;
    description: string;
    code: string;
}

@Component({
    selector: 'app-docs-theming',
    imports: [
        RouterLink,
        ZyraAlert,
        ZyraBadge,
        ZyraButton,
        ZyraCard,
        ZyraFormField,
        ZyraInput,
        ZyraSwitch,
        ZyraBreadcrumb,
        ZyraBreadcrumbItem,
    ],
    templateUrl: './theming.html',
    styleUrl: './theming.scss',
})
export class DocsTheming implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);
    private readonly themeService = inject(ZyraThemeService);

    readonly currentTheme = this.themeService.theme;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Theming', url: 'https://www.zyraui.dev/docs/theming' },
    ];

    readonly themes: readonly ThemeOption[] = [
        { value: 'dark', label: 'Dark', accent: '#007a8a', surface: '#172232' },
        { value: 'light', label: 'Light', accent: '#007a8a', surface: '#ecedf1' },
        { value: 'ocean', label: 'Ocean', accent: '#1a6ec8', surface: '#eaf0f8' },
        { value: 'amber', label: 'Amber', accent: '#b06020', surface: '#f0e8d8' },
        { value: 'rose', label: 'Rose', accent: '#d03050', surface: '#faedf1' },
    ];

    readonly tokenSwatches: readonly TokenSwatch[] = [
        { name: 'Background', variable: '--zyra-color-bg-app' },
        { name: 'Surface', variable: '--zyra-color-surface' },
        { name: 'Text', variable: '--zyra-color-text' },
        { name: 'Text muted', variable: '--zyra-color-fg-muted' },
        { name: 'Border', variable: '--zyra-color-border' },
        { name: 'Primary', variable: '--zyra-color-accent' },
        { name: 'Accent secondary', variable: '--zyra-color-accent-secondary' },
        { name: 'Accent tertiary', variable: '--zyra-color-accent-tertiary' },
        { name: 'Success', variable: '--zyra-color-success' },
        { name: 'Warning', variable: '--zyra-color-warning' },
        { name: 'Danger', variable: '--zyra-color-danger' },
        { name: 'Info', variable: '--zyra-color-info' },
    ];

    readonly setupSteps: readonly SetupStep[] = [
        {
            step: '01',
            title: 'Import global styles',
            description: 'Loads every token tier and all five theme definitions in one line.',
            code: `// styles.scss
@use 'zyra-ng-ui';`,
        },
        {
            step: '02',
            title: 'Register the theme provider',
            description: 'Picks the initial theme and wires up ZyraThemeService before first render.',
            code: `// app.config.ts
import { provideZyra } from 'zyra-ng-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideZyra({ theme: 'dark' })],
};`,
        },
        {
            step: '03',
            title: 'Switch themes at runtime',
            description: 'Inject the service anywhere — every component repaints instantly, no reload.',
            code: `import { inject } from '@angular/core';
import { ZyraThemeService } from 'zyra-ng-ui';

const theme = inject(ZyraThemeService);
theme.setTheme('ocean'); // 'dark' | 'light' | 'ocean' | 'amber' | 'rose'`,
        },
        {
            step: '04',
            title: 'Override tokens (optional)',
            description: 'Set any token after the Zyra import to customize without forking a theme file.',
            code: `// styles.scss — after @use 'zyra-ng-ui'
:root {
  --zyra-color-accent: #7c3aed;
  --zyra-radius-md: 6px;
}`,
        },
    ];

    selectTheme(theme: ZyraTheme): void {
        this.themeService.setTheme(theme);
    }

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Theming - Zyra UI Docs',
            description:
                'Preview and switch between the dark, light, ocean, amber, and rose themes shipped with Zyra UI, and see the design tokens each one drives.',
            url: 'https://www.zyraui.dev/docs/theming',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}
