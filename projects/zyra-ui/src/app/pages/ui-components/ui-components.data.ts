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
] satisfies readonly UiComponentShowcaseCard[];

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
