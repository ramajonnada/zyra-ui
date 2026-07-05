import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraAccordion, ZyraAccordionItem, ZyraBadge, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

interface DocsStep {
    step: string;
    title: string;
    description: string;
    code: string;
}

interface ComponentRef {
    name: string;
    slug: string;
    selector: string;
    importName: string;
    category: string;
}

@Component({
    selector: 'app-docs',
    imports: [RouterLink, ZyraButton, ZyraAccordion, ZyraAccordionItem],
    templateUrl: './docs.html',
    styleUrl: './docs.scss',
})
export class Docs implements OnInit {
    private readonly seo = inject(SeoService);

    readonly installSteps: readonly DocsStep[] = [
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

    readonly appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZyra } from 'zyra-ng-ui';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZyra({ theme: 'light' }),
  ],
};`;

    readonly themeOverrideCode = `/* global styles.css — override any token */
:root {
  --zyra-color-accent:       #7c3aed;
  --zyra-color-accent-muted: #ede9fe;
  --zyra-radius-md:          6px;
  --zyra-font-body:          'Inter', sans-serif;
}`;

    readonly themeSwitchCode = `import { inject } from '@angular/core';
import { ZyraThemeService } from 'zyra-ng-ui';

const theme = inject(ZyraThemeService);

// theme: 'dark' | 'light' | 'ocean' | 'amber' | 'rose'
theme.setTheme('ocean');
theme.cycle();   // step through all 5 themes
theme.toggle();  // switch dark <-> light only`;

    readonly tokenGroups = [
        {
            label: 'Color — semantic',
            tokens: [
                '--zyra-color-bg-app',
                '--zyra-color-surface',
                '--zyra-color-fg',
                '--zyra-color-fg-muted',
                '--zyra-color-border',
                '--zyra-color-primary',
            ],
        },
        {
            label: 'Color — theme layer',
            tokens: [
                '--zyra-color-text',
                '--zyra-color-accent',
                '--zyra-color-accent-secondary',
                '--zyra-color-accent-tertiary',
            ],
        },
        {
            label: 'Semantic status',
            tokens: [
                '--zyra-color-success',
                '--zyra-color-warning',
                '--zyra-color-danger',
                '--zyra-color-info',
            ],
        },
        {
            label: 'Typography',
            tokens: ['--zyra-font-body', '--zyra-font-display', '--zyra-font-mono'],
        },
        {
            label: 'Shape & Motion',
            tokens: [
                '--zyra-radius-sm',
                '--zyra-radius-md',
                '--zyra-radius-lg',
                '--zyra-transition-base',
                '--zyra-transition-fast',
            ],
        },
    ];

    readonly componentList: readonly ComponentRef[] = [
        {
            name: 'Button',
            slug: 'button',
            selector: 'zyra-button',
            importName: 'ZyraButton',
            category: 'Actions',
        },
        {
            name: 'Chip',
            slug: 'chip',
            selector: 'zyra-chip',
            importName: 'ZyraChip',
            category: 'Actions',
        },
        {
            name: 'Badge',
            slug: 'badge',
            selector: 'zyra-badge',
            importName: 'ZyraBadge',
            category: 'Status',
        },
        {
            name: 'Avatar',
            slug: 'avatar',
            selector: 'zyra-avatar',
            importName: 'ZyraAvatar',
            category: 'Identity',
        },
        {
            name: 'Card',
            slug: 'card',
            selector: 'zyra-card',
            importName: 'ZyraCard',
            category: 'Layout',
        },
        {
            name: 'Accordion',
            slug: 'accordion',
            selector: 'zyra-accordion',
            importName: 'ZyraAccordion',
            category: 'Layout',
        },
        {
            name: 'Divider',
            slug: 'divider',
            selector: 'zyra-divider',
            importName: 'ZyraDivider',
            category: 'Layout',
        },
        {
            name: 'Input',
            slug: 'input',
            selector: 'zyra-input',
            importName: 'ZyraInput',
            category: 'Forms',
        },
        {
            name: 'Form Field',
            slug: 'form-field',
            selector: 'zyra-form-field',
            importName: 'ZyraFormField',
            category: 'Forms',
        },
        {
            name: 'Switch',
            slug: 'switch',
            selector: 'zyra-switch',
            importName: 'ZyraSwitch',
            category: 'Forms',
        },
        {
            name: 'Toggle',
            slug: 'toggle',
            selector: 'zyra-toggle',
            importName: 'ZyraToggle',
            category: 'Forms',
        },
        {
            name: 'Select',
            slug: 'select',
            selector: 'zyra-select',
            importName: 'ZyraSelect',
            category: 'Forms',
        },
        {
            name: 'Textarea',
            slug: 'textarea',
            selector: 'zyra-textarea',
            importName: 'ZyraTextarea',
            category: 'Forms',
        },
        {
            name: 'Checkbox',
            slug: 'checkbox',
            selector: 'zyra-checkbox',
            importName: 'ZyraCheckbox',
            category: 'Forms',
        },
        {
            name: 'Radio',
            slug: 'radio',
            selector: 'zyra-radio-group',
            importName: 'ZyraRadioGroup',
            category: 'Forms',
        },
        {
            name: 'Tabs',
            slug: 'tabs',
            selector: 'zyra-tabs',
            importName: 'ZyraTabs',
            category: 'Navigation',
        },
        {
            name: 'Spinner',
            slug: 'spinner',
            selector: 'zyra-spinner',
            importName: 'ZyraSpinner',
            category: 'Feedback',
        },
        {
            name: 'Progress',
            slug: 'progress',
            selector: 'zyra-progress',
            importName: 'ZyraProgress',
            category: 'Feedback',
        },
        {
            name: 'Alert',
            slug: 'alert',
            selector: 'zyra-alert',
            importName: 'ZyraAlert',
            category: 'Feedback',
        },
        {
            name: 'Skeleton',
            slug: 'skeleton',
            selector: 'zyra-skeleton',
            importName: 'ZyraSkeleton',
            category: 'Feedback',
        },
        {
            name: 'Toast',
            slug: 'toast',
            selector: 'zyra-toast-container',
            importName: 'ZyraToastContainer',
            category: 'Feedback',
        },
        {
            name: 'Tooltip',
            slug: 'tooltip',
            selector: 'zyra-tooltip',
            importName: 'ZyraTooltip',
            category: 'Overlays',
        },
        {
            name: 'Modal',
            slug: 'modal',
            selector: 'zyra-modal',
            importName: 'ZyraModal',
            category: 'Overlays',
        },
    ];

    readonly componentCount = this.componentList.length;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Zyra UI Docs - Angular component setup and design tokens',
            description:
                'Learn how to install Zyra UI, configure the Angular provider, use token-driven components, and customize the theme system.',
            url: 'https://www.zyraui.dev/docs',
        });
    }
}
