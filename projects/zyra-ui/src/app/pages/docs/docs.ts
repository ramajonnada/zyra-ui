import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraAccordion, ZyraAccordionItem, ZyraBadge, ZyraButton, ZyraCard } from 'zyra-ng-ui';
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
    imports: [RouterLink, ZyraBadge, ZyraButton, ZyraCard, ZyraAccordion, ZyraAccordionItem],
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
            step: '03',
            title: 'Import and use',
            description: 'Drop any component directly into your standalone imports array.',
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
  --zyr-accent:        #7c3aed;
  --zyr-accent-muted:  #ede9fe;
  --zyr-radius-md:     6px;
  --zyr-font-body:     'Inter', sans-serif;
}`;

    readonly themeSwitchCode = `import { inject } from '@angular/core';
import { ZyraThemeService } from 'zyra-ng-ui';

const theme = inject(ZyraThemeService);

theme.setTheme('dark');   // force dark
theme.setTheme('light');  // force light
theme.toggle();           // switch between both`;

    readonly tokenGroups = [
        {
            label: 'Color',
            tokens: ['--zyr-accent', '--zyr-bg', '--zyr-bg-2', '--zyr-bg-3', '--zyr-text', '--zyr-text-muted', '--zyr-border'],
        },
        {
            label: 'Semantic',
            tokens: ['--zyr-success', '--zyr-warning', '--zyr-danger', '--zyr-info'],
        },
        {
            label: 'Typography',
            tokens: ['--zyr-font-body', '--zyr-font-display', '--zyr-font-mono'],
        },
        {
            label: 'Shape & Motion',
            tokens: ['--zyr-radius-sm', '--zyr-radius-md', '--zyr-radius-lg', '--zyr-transition-base', '--zyr-transition-fast'],
        },
    ];

    readonly componentList: readonly ComponentRef[] = [
        { name: 'Button',       slug: 'button',     selector: 'zyra-button',         importName: 'ZyraButton',       category: 'Actions'  },
        { name: 'Chip',         slug: 'chip',       selector: 'zyra-chip',           importName: 'ZyraChip',         category: 'Actions'  },
        { name: 'Badge',        slug: 'badge',      selector: 'zyra-badge',          importName: 'ZyraBadge',        category: 'Status'   },
        { name: 'Avatar',       slug: 'avatar',     selector: 'zyra-avatar',         importName: 'ZyraAvatar',       category: 'Identity' },
        { name: 'Card',         slug: 'card',       selector: 'zyra-card',           importName: 'ZyraCard',         category: 'Layout'   },
        { name: 'Accordion',    slug: 'accordion',  selector: 'zyra-accordion',      importName: 'ZyraAccordion',    category: 'Layout'   },
        { name: 'Divider',      slug: 'divider',    selector: 'zyra-divider',        importName: 'ZyraDivider',      category: 'Layout'   },
        { name: 'Input',        slug: 'input',      selector: 'zyra-input',          importName: 'ZyraInput',        category: 'Forms'    },
        { name: 'Form Field',   slug: 'form-field', selector: 'zyra-form-field',     importName: 'ZyraFormField',    category: 'Forms'    },
        { name: 'Toggle',       slug: 'toggle',     selector: 'zyra-toggle',         importName: 'ZyraToggle',       category: 'Forms'    },
        { name: 'Spinner',      slug: 'spinner',    selector: 'zyra-spinner',        importName: 'ZyraSpinner',      category: 'Feedback' },
        { name: 'Progress',     slug: 'progress',   selector: 'zyra-progress',       importName: 'ZyraProgress',     category: 'Feedback' },
        { name: 'Alert',        slug: 'alert',      selector: 'zyra-alert',          importName: 'ZyraAlert',        category: 'Feedback' },
        { name: 'Toast',        slug: 'toast',      selector: 'zyra-toast-container',importName: 'ZyraToastContainer',category: 'Feedback'},
        { name: 'Tooltip',      slug: 'tooltip',    selector: 'zyra-tooltip',        importName: 'ZyraTooltip',      category: 'Overlays' },
        { name: 'Modal',        slug: 'modal',      selector: 'zyra-modal',          importName: 'ZyraModal',        category: 'Overlays' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Zyra UI Docs - Angular component setup and design tokens',
            description:
                'Learn how to install Zyra UI, configure the Angular provider, use token-driven components, and customize the theme system.',
            url: 'https://www.zyraui.dev/docs',
        });
    }
}
