import { Component, OnInit, inject } from '@angular/core';
import {
    ZyraAlert,
    ZyraBadge,
    ZyraButton,
    ZyraCard,
    ZyraFormField,
    ZyraInput,
    ZyraSwitch,
    ZyraTheme,
    ZyraThemeService,
} from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

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

interface TokenGroup {
    label: string;
    tokens: readonly string[];
}

@Component({
    selector: 'app-theming',
    imports: [ZyraAlert, ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput, ZyraSwitch],
    templateUrl: './theming.html',
    styleUrl: './theming.scss',
})
export class Theming implements OnInit {
    private readonly seo = inject(SeoService);
    private readonly themeService = inject(ZyraThemeService);

    readonly currentTheme = this.themeService.theme;

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

    readonly overridableTokens: readonly TokenGroup[] = [
        {
            label: 'Semantic color (recommended)',
            tokens: [
                '--zyra-color-bg-app',
                '--zyra-color-surface',
                '--zyra-color-text',
                '--zyra-color-fg-muted',
                '--zyra-color-border',
                '--zyra-color-accent',
                '--zyra-color-success',
                '--zyra-color-warning',
                '--zyra-color-danger',
                '--zyra-color-info',
            ],
        },
        {
            label: 'Dimension (shape, type, motion)',
            tokens: [
                '--zyra-radius-sm / md / lg',
                '--zyra-space-1 … space-20',
                '--zyra-font-body / display / mono',
                '--zyra-transition-fast / base / slow',
            ],
        },
    ];

    readonly internalTokens: readonly TokenGroup[] = [
        {
            label: 'Primitives (raw palette)',
            tokens: ['--zyra-color-cyan-50 … cyan-950'],
        },
        {
            label: 'Component tokens (derived, per-component)',
            tokens: [
                '--zyra-color-btn-primary-bg',
                '--zyra-color-checkbox-checked-bg',
                '--zyra-color-tabs-badge-bg',
                '--zyra-color-field-* / select-* / progress-*',
            ],
        },
    ];

    selectTheme(theme: ZyraTheme): void {
        this.themeService.setTheme(theme);
    }

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Theming - Zyra UI',
            description:
                'Preview and switch between the dark, light, ocean, amber, and rose themes shipped with Zyra UI, and see the design tokens each one drives.',
            url: 'https://www.zyraui.dev/theming',
        });
    }
}
