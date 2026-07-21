import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    ZyraAlert,
    ZyraAvatar,
    ZyraBadge,
    ZyraBreadcrumb,
    ZyraBreadcrumbItem,
    ZyraButton,
    ZyraCard,
    ZyraCheckbox,
    ZyraChip,
    ZyraFormField,
    ZyraInput,
    ZyraProgress,
    ZyraSwitch,
    ZyraTheme,
    ZyraThemeService,
} from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';

interface ThemeOption {
    value: ZyraTheme;
    label: string;
    accent: string;
    surface: string;
}

interface SetupStep {
    step: string;
    title: string;
    description: string;
    code: string;
}

interface ApiMethod {
    signature: string;
    returns: string;
    description: string;
}

interface ConfigOption {
    prop: string;
    type: string;
    default: string;
    description: string;
}

@Component({
    selector: 'app-docs-theming',
    imports: [
        RouterLink,
        ZyraAlert,
        ZyraAvatar,
        ZyraBadge,
        ZyraButton,
        ZyraCard,
        ZyraCheckbox,
        ZyraChip,
        ZyraFormField,
        ZyraInput,
        ZyraProgress,
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

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Theming', url: 'https://www.zyraui.dev/docs/theming' },
    ];

    readonly themes: readonly ThemeOption[] = [
        { value: 'dark', label: 'Dark', accent: '#18d5ea', surface: '#0d1117' },
        { value: 'light', label: 'Light', accent: '#007a8a', surface: '#ecedf1' },
        { value: 'ocean', label: 'Ocean', accent: '#1a6ec8', surface: '#eaf0f8' },
        { value: 'amber', label: 'Amber', accent: '#b06020', surface: '#f0e8d8' },
        { value: 'rose', label: 'Rose', accent: '#d03050', surface: '#faedf1' },
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
  --zyra-color-primary: #7c3aed; /* semantic Tier 2 — propagates everywhere */
  --zyra-radius-md: 6px;         /* dimension Tier 1 — affects all md-radius components */
}`,
        },
    ];

    readonly apiMethods: readonly ApiMethod[] = [
        {
            signature: 'theme',
            returns: 'Signal<ZyraTheme>',
            description: 'Read-only signal with the currently active theme name.',
        },
        {
            signature: 'setTheme(theme: ZyraTheme)',
            returns: 'void',
            description: 'Switch to a named theme. Persists to localStorage automatically.',
        },
        {
            signature: 'toggleTheme()',
            returns: 'void',
            description: 'Cycle through all available themes in order.',
        },
        {
            signature: 'isDark',
            returns: 'Signal<boolean>',
            description: 'True when the active theme uses a dark color scheme.',
        },
    ];

    readonly configOptions: readonly ConfigOption[] = [
        {
            prop: 'theme',
            type: "'dark' | 'light' | 'ocean' | 'amber' | 'rose'",
            default: "'dark'",
            description: 'Initial theme applied before Angular hydrates.',
        },
        {
            prop: 'respectSystemTheme',
            type: 'boolean',
            default: 'false',
            description: "Use OS prefers-color-scheme when no localStorage value is saved.",
        },
        {
            prop: 'storageKey',
            type: 'string',
            default: "'zyra-theme'",
            description: "localStorage key used to persist the user's last choice.",
        },
    ];

    selectTheme(theme: ZyraTheme): void {
        this.themeService.setTheme(theme);
    }

    onThemeSwitcherKeydown(event: KeyboardEvent): void {
        const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
        if (!forward && !backward) {
            return;
        }

        event.preventDefault();
        const themes = this.themes;
        const currentIndex = themes.findIndex((t) => t.value === this.currentTheme());
        const delta = forward ? 1 : -1;
        const nextIndex = (currentIndex + delta + themes.length) % themes.length;
        const nextTheme = themes[nextIndex].value;

        this.selectTheme(nextTheme);

        const button = event.currentTarget as HTMLElement;
        const container = button.closest('.theme-switcher');
        const buttons = container?.querySelectorAll<HTMLButtonElement>('.theme-btn');
        buttons?.[nextIndex]?.focus();
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
