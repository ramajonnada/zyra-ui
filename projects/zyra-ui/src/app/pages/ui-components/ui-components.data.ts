import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { appIcons } from '../../shared/fontawesome-icons';

export type UiComponentAccent = 'teal' | 'blue' | 'purple' | 'amber' | 'green';

export interface UiComponentShowcaseCard {
    slug: string;
    title: string;
    selector: string;
    importName: string;
    category: string;
    description?: string;
    icon: IconDefinition;
    accent: UiComponentAccent;
    highlights: string[];
    exampleCode?: string;
}

const BUTTON_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-button',
  standalone: true,
  imports: [ZyraButton],
  template: \`
    <zyra-button variant="primary" size="md">
      Save changes
    </zyra-button>
  \`,
})
export class DemoButtonComponent {}
`;

const BADGE_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraBadge } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-badge',
  standalone: true,
  imports: [ZyraBadge],
  template: \`
    <zyra-badge variant="success" size="md" [dot]="true">
      Active
    </zyra-badge>
  \`,
})
export class DemoBadgeComponent {}
`;

const CARD_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraButton, ZyraCard } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [ZyraButton, ZyraCard],
  template: \`
    <zyra-card [hasHeader]="true" [hasFooter]="true" padding="lg">
      <div slot="header">Project summary</div>

      <p>Track progress, approvals, and quick actions inside a clean card layout.</p>

      <div slot="footer">
        <zyra-button variant="ghost" size="sm">Cancel</zyra-button>
        <zyra-button variant="primary" size="sm">Open</zyra-button>
      </div>
    </zyra-card>
  \`,
})
export class DemoCardComponent {}
`;

const AVATAR_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraAvatar } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-avatar',
  standalone: true,
  imports: [ZyraAvatar],
  template: \`
    <zyra-avatar
      name="Ava Patel"
      size="lg"
      variant="purple"
      [online]="true"
    />
  \`,
})
export class DemoAvatarComponent {}
`;

const INPUT_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraInput } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-input',
  standalone: true,
  imports: [ZyraInput],
  template: \`
    <zyra-input
      type="email"
      size="md"
      placeholder="name@company.com"
    />
  \`,
})
export class DemoInputComponent {}
`;

const FORM_FIELD_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraFormField, ZyraInput } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-form-field',
  standalone: true,
  imports: [ZyraFormField, ZyraInput],
  template: \`
    <zyra-form-field
      label="Email"
      hint="We'll only use this for account updates."
    >
      <zyra-input
        type="email"
        placeholder="name@company.com"
      />
    </zyra-form-field>
  \`,
})
export class DemoFormFieldComponent {}
`;

const SPINNER_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraSpinner } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-spinner',
  standalone: true,
  imports: [ZyraSpinner],
  template: \`
    <zyra-spinner
      size="md"
      color="accent"
      label="Loading dashboard"
    />
  \`,
})
export class DemoSpinnerComponent {}
`;

const TOAST_EXAMPLE_CODE = `import { Component, inject } from '@angular/core';
import {
  ZyraButton,
  ZyraToastContainer,
  ZyraToastService,
} from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-toast',
  standalone: true,
  imports: [ZyraButton, ZyraToastContainer],
  template: \`
    <zyra-button variant="primary" (clicked)="showSavedToast()">
      Show success toast
    </zyra-button>

    <zyra-toast-container />
  \`,
})
export class DemoToastComponent {
  private readonly toast = inject(ZyraToastService);

  showSavedToast(): void {
    this.toast.success('Saved successfully', {
      description: 'Your profile changes are now live.',
    });
  }
}
`;

const TOOLTIP_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraButton, ZyraTooltip } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-tooltip',
  standalone: true,
  imports: [ZyraButton, ZyraTooltip],
  template: \`
    <zyra-tooltip text="Copy component code" position="top">
      <zyra-button variant="secondary" size="sm">
        Hover me
      </zyra-button>
    </zyra-tooltip>
  \`,
})
export class DemoTooltipComponent {}
`;

export const UI_COMPONENT_SHOWCASE = [
    {
        slug: 'button',
        title: 'Button',
        selector: 'zyra-button',
        importName: 'ZyraButton',
        category: 'Actions',
        description:
            'Token-aware action buttons for primary flows, secondary actions, and compact utility triggers.',
        icon: appIcons.handPointer,
        accent: 'blue',
        highlights: [
            'Clear action hierarchy',
            'Works in forms and toolbars',
            'Easy variant switching',
        ],
        exampleCode: BUTTON_EXAMPLE_CODE,
    },
    {
        slug: 'badge',
        title: 'Badge',
        selector: 'zyra-badge',
        importName: 'ZyraBadge',
        category: 'Status',
        description:
            'Small status labels for updates, counts, state pills, and quick metadata throughout the interface.',
        icon: appIcons.certificate,
        accent: 'teal',
        highlights: [
            'Compact semantic states',
            'Dot support for live signals',
            'Fits dense UI surfaces',
        ],
        exampleCode: BADGE_EXAMPLE_CODE,
    },
    {
        slug: 'card',
        title: 'Card',
        selector: 'zyra-card',
        importName: 'ZyraCard',
        category: 'Layout',
        description:
            'Flexible content containers for dashboards, previews, settings panels, and modular content blocks.',
        icon: appIcons.square,
        accent: 'purple',
        highlights: [
            'Header and footer slots',
            'Clickable mode support',
            'Multiple visual variants',
        ],
        exampleCode: CARD_EXAMPLE_CODE,
    },
    {
        slug: 'avatar',
        title: 'Avatar',
        selector: 'zyra-avatar',
        importName: 'ZyraAvatar',
        category: 'Identity',
        description:
            'Profile and team visuals that make lists, comments, and user surfaces feel more human and scannable.',
        icon: appIcons.circleUser,
        accent: 'green',
        highlights: ['Great for team UIs', 'Pairs well with badges', 'Readable at smaller sizes'],
        exampleCode: AVATAR_EXAMPLE_CODE,
    },
    {
        slug: 'input',
        title: 'Input',
        selector: 'zyra-input',
        importName: 'ZyraInput',
        category: 'Forms',
        description:
            'Foundation text inputs for login forms, filters, search flows, and structured data entry experiences.',
        icon: appIcons.keyboard,
        accent: 'amber',
        highlights: [
            'Built for normal form flows',
            'Works with standalone imports',
            'Clean token styling',
        ],
        exampleCode: INPUT_EXAMPLE_CODE,
    },
    {
        slug: 'form-field',
        title: 'Form Field',
        selector: 'zyra-form-field',
        importName: 'ZyraFormField',
        category: 'Forms',
        description:
            'Field wrappers that align labels, hints, and validation copy into a more polished form system.',
        icon: appIcons.alignLeft,
        accent: 'blue',
        highlights: [
            'Helps compose accessible forms',
            'Supports helper and error text',
            'Keeps spacing consistent',
        ],
        exampleCode: FORM_FIELD_EXAMPLE_CODE,
    },
    {
        slug: 'spinner',
        title: 'Spinner',
        selector: 'zyra-spinner',
        importName: 'ZyraSpinner',
        category: 'Feedback',
        description:
            'Loading indicators for async states, background fetches, and actions that need a clear pending signal.',
        icon: appIcons.spinner,
        accent: 'purple',
        highlights: [
            'Useful for async states',
            'Easy to drop into buttons',
            'Keeps loading feedback visible',
        ],
        exampleCode: SPINNER_EXAMPLE_CODE,
    },
    {
        slug: 'toast',
        title: 'Toast',
        selector: 'zyra-toast-container',
        importName: 'ZyraToastContainer',
        category: 'Feedback',
        description:
            'Transient notifications for confirmations, warnings, and system messages without interrupting the flow.',
        icon: appIcons.message,
        accent: 'teal',
        highlights: [
            'Success, info, warning, error flows',
            'Great for action confirmation',
            'Fits app-wide feedback',
        ],
        exampleCode: TOAST_EXAMPLE_CODE,
    },
    {
        slug: 'tooltip',
        title: 'Tooltip',
        selector: 'zyra-tooltip',
        importName: 'ZyraTooltip',
        category: 'Overlays',
        description:
            'Helpful hover and focus details for dense controls, icon actions, and space-constrained interfaces.',
        icon: appIcons.circleInfo,
        accent: 'green',
        highlights: [
            'Adds context without clutter',
            'Works well on icon-only actions',
            'Supports compact UIs',
        ],
        exampleCode: TOOLTIP_EXAMPLE_CODE,
    },
    {
        slug: 'modal',
        title: 'Modal',
        selector: 'zyra-modal',
        importName: 'ZyraModal',
        category: 'Overlays',
        description:
            'Accessible dialog overlay with focus trap, ESC to close, backdrop dismiss, and flexible header/footer slots.',
        icon: appIcons.square,
        accent: 'purple',
        highlights: [
            'Focus trap and ESC key support',
            'Backdrop click to dismiss',
            'Four sizes with smooth animation',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';\nimport { ZyraModal, ZyraButton } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraModal, ZyraButton],\n  template: \`\n    <zyra-button (clicked)="open.set(true)">Open</zyra-button>\n    <zyra-modal [(open)]="open" title="Hello">\n      <p>Modal content here.</p>\n      <div slot="footer" class="zyr-modal__footer">\n        <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>\n        <zyra-button variant="primary" (clicked)="open.set(false)">Confirm</zyra-button>\n      </div>\n    </zyra-modal>\n  \`,\n})\nexport class DemoComponent {\n  open = signal(false);\n}`,
    },
    {
        slug: 'alert',
        title: 'Alert',
        selector: 'zyra-alert',
        importName: 'ZyraAlert',
        category: 'Feedback',
        description:
            'Inline status messages for success, warning, danger, and info states with optional title and dismiss support.',
        icon: appIcons.triangleExclamation,
        accent: 'amber',
        highlights: [
            'Four semantic variants',
            'Optional title and dismiss',
            'Accessible role="alert"',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraAlert } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraAlert],\n  template: \`\n    <zyra-alert\n      variant="success"\n      title="Saved"\n      [dismissible]="true"\n    >\n      Your changes have been saved.\n    </zyra-alert>\n  \`,\n})\nexport class DemoComponent {}`,
    },
    {
        slug: 'chip',
        title: 'Chip',
        selector: 'zyra-chip',
        importName: 'ZyraChip',
        category: 'Actions',
        description:
            'Compact interactive labels for filters, tags, and selections — supports dismissible and selectable modes.',
        icon: appIcons.certificate,
        accent: 'purple',
        highlights: [
            'Dismissible with × button',
            'Selectable with toggle state',
            'All semantic variants',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraChip } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraChip],\n  template: \`\n    <zyra-chip variant="info" [dismissible]="true">\n      Angular\n    </zyra-chip>\n  \`,\n})\nexport class DemoComponent {}`,
    },
    {
        slug: 'toggle',
        title: 'Toggle',
        selector: 'zyra-toggle',
        importName: 'ZyraToggle',
        category: 'Forms',
        description:
            'On/off switch control for settings, preferences, and feature flags with full keyboard and accessibility support.',
        icon: appIcons.bolt,
        accent: 'teal',
        highlights: [
            'Three sizes with smooth animation',
            'Label on left or right',
            'Accessible role="switch"',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';\nimport { ZyraToggle } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraToggle],\n  template: \`\n    <zyra-toggle\n      [(checked)]="enabled"\n      label="Enable notifications"\n    />\n  \`,\n})\nexport class DemoComponent {\n  enabled = signal(false);\n}`,
    },
    {
        slug: 'progress',
        title: 'Progress',
        selector: 'zyra-progress',
        importName: 'ZyraProgress',
        category: 'Feedback',
        description:
            'Linear progress bars for uploads, task completion, storage usage, and any measurable loading state.',
        icon: appIcons.waveSquare,
        accent: 'blue',
        highlights: [
            'Indeterminate loading mode',
            'Built-in label support',
            'All semantic variants',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraProgress } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraProgress],\n  template: \`\n    <zyra-progress\n      variant="success"\n      [value]="72"\n      [showLabel]="true"\n    />\n  \`,\n})\nexport class DemoComponent {}`,
    },
    {
        slug: 'divider',
        title: 'Divider',
        selector: 'zyra-divider',
        importName: 'ZyraDivider',
        category: 'Layout',
        description:
            'Horizontal and vertical separators for organizing content sections, form layouts, and navigation groups.',
        icon: appIcons.scaleBalanced,
        accent: 'teal',
        highlights: [
            'Horizontal and vertical modes',
            'Optional centered label',
            'Solid, dashed, and dotted styles',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraDivider } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraDivider],\n  template: \`\n    <zyra-divider label="or" />\n  \`,\n})\nexport class DemoComponent {}`,
    },
    {
        slug: 'accordion',
        title: 'Accordion',
        selector: 'zyra-accordion',
        importName: 'ZyraAccordion',
        category: 'Layout',
        description:
            'Collapsible content sections for FAQs, settings panels, and any grouped information that benefits from progressive disclosure.',
        icon: appIcons.alignLeft,
        accent: 'amber',
        highlights: [
            'Single or multi-open modes',
            'Smooth CSS grid animation',
            'Keyboard accessible',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraAccordion, ZyraAccordionItem } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraAccordion, ZyraAccordionItem],\n  template: \`\n    <zyra-accordion>\n      <zyra-accordion-item title="What is Zyra UI?">\n        A modern Angular component library built with signals.\n      </zyra-accordion-item>\n      <zyra-accordion-item title="Is it free?">\n        Yes, fully open source under MIT.\n      </zyra-accordion-item>\n    </zyra-accordion>\n  \`,\n})\nexport class DemoComponent {}`,
    },
] satisfies readonly UiComponentShowcaseCard[];

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
