import type { ZyraIconData } from 'zyra-ng-ui';
import { github, npm as npmIcon, envelope, folder, cubes, message, palette, bolt, codeBranch, code, universalAccess, rocket, instagram, globe, swatchbook, boxOpen, moon, waveSquare, check, lock, circleInfo, triangleExclamation, alignLeft, puzzlePiece, sun, caretLeft, caretRight, handPointer, certificate, square, circleUser, keyboard, spinner, scaleBalanced, menu, copy, star, panelLeft } from 'zyra-ng-ui';

export type UiComponentAccent = 'teal' | 'blue' | 'purple' | 'amber' | 'green';

export interface ComponentVariant {
    name: string;
    description: string;
}

export interface ApiProp {
    name: string;
    type: string;
    default: string;
    description: string;
}

export interface UiComponentShowcaseCard {
    slug: string;
    title: string;
    selector: string;
    importName: string;
    category: string;
    description?: string;
    icon: ZyraIconData;
    accent: UiComponentAccent;
    highlights: string[];
    exampleCode?: string;
    variants?: readonly ComponentVariant[];
    apiProps?: readonly ApiProp[];
    a11yNotes?: readonly string[];
    relatedSlugs?: readonly string[];
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

const BREADCRUMB_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-breadcrumb',
  standalone: true,
  imports: [ZyraBreadcrumb, ZyraBreadcrumbItem],
  template: \`
    <zyra-breadcrumb>
      <zyra-breadcrumb-item href="/">Home</zyra-breadcrumb-item>
      <zyra-breadcrumb-item href="/components">Components</zyra-breadcrumb-item>
      <zyra-breadcrumb-item [current]="true">Code Block</zyra-breadcrumb-item>
    </zyra-breadcrumb>
  \`,
})
export class DemoBreadcrumbComponent {}
`;

const DROPDOWN_MENU_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraButton, ZyraDropdownMenu, ZyraMenuItem } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-dropdown-menu',
  standalone: true,
  imports: [ZyraButton, ZyraDropdownMenu, ZyraMenuItem],
  template: \`
    <zyra-dropdown-menu>
      <zyra-button slot="trigger" variant="outline">Actions</zyra-button>
      <zyra-menu-item (itemClick)="edit()">Edit</zyra-menu-item>
      <zyra-menu-item (itemClick)="duplicate()">Duplicate</zyra-menu-item>
      <zyra-menu-item variant="danger" (itemClick)="remove()">Delete</zyra-menu-item>
    </zyra-dropdown-menu>
  \`,
})
export class DemoDropdownMenuComponent {
  edit() {}
  duplicate() {}
  remove() {}
}
`;

const CODE_BLOCK_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraCodeBlock } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-code-block',
  standalone: true,
  imports: [ZyraCodeBlock],
  template: \`
    <zyra-code-block
      filename="greet.ts"
      language="typescript"
      [lineNumbers]="true"
      [code]="snippet"
    />
  \`,
})
export class DemoCodeBlockComponent {
  snippet = \`function greet(name: string): string {
  return \\\`Hello, \\\${name}!\\\`;
}\`;
}
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

const MODAL_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraModal, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: [ZyraModal, ZyraButton],
  template: \`
    <zyra-button (clicked)="open.set(true)">Open modal</zyra-button>

    <zyra-modal [(open)]="open" title="Confirm action">
      <p>Are you sure you want to proceed?</p>

      <div slot="footer" class="zyr-modal__footer">
        <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>
        <zyra-button variant="primary" (clicked)="open.set(false)">Confirm</zyra-button>
      </div>
    </zyra-modal>
  \`,
})
export class DemoModalComponent {
  open = signal(false);
}
`;

const ALERT_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraAlert } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-alert',
  standalone: true,
  imports: [ZyraAlert],
  template: \`
    <zyra-alert
      variant="success"
      title="Saved"
      [dismissible]="true"
    >
      Your changes have been saved.
    </zyra-alert>
  \`,
})
export class DemoAlertComponent {}
`;

const CHIP_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraChip } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-chip',
  standalone: true,
  imports: [ZyraChip],
  template: \`
    <zyra-chip variant="info" [dismissible]="true">
      Angular
    </zyra-chip>
  \`,
})
export class DemoChipComponent {}
`;

const SWITCH_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraSwitch } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-switch',
  standalone: true,
  imports: [ZyraSwitch],
  template: \`
    <zyra-switch
      [(checked)]="enabled"
      label="Enable notifications"
    />
  \`,
})
export class DemoSwitchComponent {
  enabled = signal(false);
}
`;

const TOGGLE_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraToggle } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-toggle',
  standalone: true,
  imports: [ZyraToggle],
  template: \`
    <zyra-toggle [(pressed)]="bold" aria-label="Bold">
      B
    </zyra-toggle>
  \`,
})
export class DemoToggleComponent {
  bold = signal(false);
}
`;

const PROGRESS_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraProgress } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-progress',
  standalone: true,
  imports: [ZyraProgress],
  template: \`
    <zyra-progress
      variant="success"
      [value]="72"
      [showLabel]="true"
    />
  \`,
})
export class DemoProgressComponent {}
`;

const DIVIDER_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraDivider } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-divider',
  standalone: true,
  imports: [ZyraDivider],
  template: \`
    <zyra-divider label="or" />
  \`,
})
export class DemoDividerComponent {}
`;

const SELECT_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraSelect, ZyraOption } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-select',
  standalone: true,
  imports: [FormsModule, ZyraSelect, ZyraOption],
  template: \`
    <zyra-select [(ngModel)]="framework" placeholder="Choose a framework">
      <zyra-option value="angular">Angular</zyra-option>
      <zyra-option value="react">React</zyra-option>
      <zyra-option value="vue">Vue</zyra-option>
    </zyra-select>
  \`,
})
export class DemoSelectComponent {
  framework: string | null = null;
}
`;

const TEXTAREA_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraFormField, ZyraTextarea } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-textarea',
  standalone: true,
  imports: [FormsModule, ZyraFormField, ZyraTextarea],
  template: \`
    <zyra-form-field label="Bio" hint="Max 200 characters">
      <zyra-textarea
        [(ngModel)]="bio"
        placeholder="Tell us about yourself..."
        [rows]="4"
        resize="auto"
      />
    </zyra-form-field>
  \`,
})
export class DemoTextareaComponent {
  bio = '';
}
`;

const CHECKBOX_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraCheckbox } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-checkbox',
  standalone: true,
  imports: [ZyraCheckbox],
  template: \`
    <zyra-checkbox
      [(checked)]="agreed"
      label="I agree to the terms and conditions"
    />
  \`,
})
export class DemoCheckboxComponent {
  agreed = signal(false);
}
`;

const RADIO_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraRadioGroup, ZyraRadio } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-radio',
  standalone: true,
  imports: [FormsModule, ZyraRadioGroup, ZyraRadio],
  template: \`
    <zyra-radio-group [(ngModel)]="plan">
      <zyra-radio value="free"  label="Free" />
      <zyra-radio value="pro"   label="Pro" />
      <zyra-radio value="team"  label="Team" />
    </zyra-radio-group>
  \`,
})
export class DemoRadioComponent {
  plan = signal('free');
}
`;

const TABS_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraTabs, ZyraTab } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-tabs',
  standalone: true,
  imports: [ZyraTabs, ZyraTab],
  template: \`
    <zyra-tabs variant="pill">
      <zyra-tab label="Overview">
        <p>Overview content here.</p>
      </zyra-tab>
      <zyra-tab label="Details">
        <p>Details content here.</p>
      </zyra-tab>
    </zyra-tabs>
  \`,
})
export class DemoTabsComponent {}
`;

const SKELETON_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraSkeleton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-skeleton',
  standalone: true,
  imports: [ZyraSkeleton],
  template: \`
    <zyra-skeleton variant="profile" />
    <zyra-skeleton variant="card" />
    <zyra-skeleton variant="list" [rows]="3" />
  \`,
})
export class DemoSkeletonComponent {}
`;

const ACCORDION_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraAccordion, ZyraAccordionItem } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-accordion',
  standalone: true,
  imports: [ZyraAccordion, ZyraAccordionItem],
  template: \`
    <zyra-accordion>
      <zyra-accordion-item title="What is Zyra UI?">
        A modern Angular component library built with signals.
      </zyra-accordion-item>
      <zyra-accordion-item title="Is it free?">
        Yes, fully open source under MIT.
      </zyra-accordion-item>
    </zyra-accordion>
  \`,
})
export class DemoAccordionComponent {}
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
        icon: handPointer,
        accent: 'blue',
        highlights: [
            'Clear action hierarchy',
            'Works in forms and toolbars',
            'Easy variant switching',
        ],
        exampleCode: BUTTON_EXAMPLE_CODE,
        variants: [
            { name: 'primary', description: 'High-emphasis CTA — use once per section' },
            { name: 'secondary', description: 'Medium-emphasis supporting action' },
            { name: 'outline', description: 'Bordered variant for neutral actions' },
            { name: 'ghost', description: 'Text-only for low-emphasis or toolbar actions' },
            { name: 'danger', description: 'Destructive or irreversible actions' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
                default: "'primary'",
                description: 'Visual style',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Height and padding scale',
            },
            {
                name: 'type',
                type: "'button' | 'submit' | 'reset'",
                default: "'button'",
                description: 'Native button type attribute',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Prevents interaction; adds muted styling',
            },
            {
                name: 'loading',
                type: 'boolean',
                default: 'false',
                description: 'Shows spinner; blocks double-submit',
            },
            {
                name: 'fullWidth',
                type: 'boolean',
                default: 'false',
                description: 'Stretches the button to fill its container',
            },
            {
                name: 'iconLeft',
                type: 'ZyraIcon',
                default: 'null',
                description: 'Icon rendered before the label',
            },
            {
                name: 'iconRight',
                type: 'ZyraIcon',
                default: 'null',
                description: 'Icon rendered after the label',
            },
            {
                name: 'aria-label',
                type: 'string | null',
                default: 'null',
                description: 'Accessible label for icon-only buttons',
            },
            {
                name: 'clicked (output)',
                type: 'MouseEvent',
                default: '-',
                description: 'Emits on click when not disabled or loading',
            },
        ],
        a11yNotes: [
            'Renders as a native <button> — keyboard accessible via Tab, Enter, and Space',
            'loading state sets aria-busy="true" to communicate pending status to screen readers',
            'disabled state communicates unavailability without removing focusability',
            'All variants maintain a visible 2px focus ring for keyboard navigation',
        ],
        relatedSlugs: ['badge', 'chip', 'switch'],
    },
    {
        slug: 'badge',
        title: 'Badge',
        selector: 'zyra-badge',
        importName: 'ZyraBadge',
        category: 'Status',
        description:
            'Small status labels for updates, counts, state pills, and quick metadata throughout the interface.',
        icon: certificate,
        accent: 'teal',
        highlights: [
            'Compact semantic states',
            'Dot support for live signals',
            'Fits dense UI surfaces',
        ],
        exampleCode: BADGE_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Neutral label for metadata and categories' },
            { name: 'info', description: 'Blue tint for informational status' },
            { name: 'success', description: 'Green for live, active, or passing states' },
            { name: 'warning', description: 'Amber for cautionary or degraded states' },
            { name: 'danger', description: 'Red for errors, failures, or critical counts' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'purple'",
                default: "'default'",
                description: 'Color and semantic meaning',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the badge',
            },
            {
                name: 'dot',
                type: 'boolean',
                default: 'false',
                description: 'Shows a live-indicator dot before the label',
            },
            {
                name: 'ariaLabel',
                type: 'string',
                default: "''",
                description:
                    'Accessible label for screen readers when badge has no visible context',
            },
        ],
        a11yNotes: [
            'Presentational by default — no role is needed unless used as a live indicator',
            'When used for live counts (e.g. notifications), add aria-live="polite" to the parent',
            'Dot mode does not convey meaning through color alone; pair with visible text',
        ],
        relatedSlugs: ['chip', 'alert', 'button'],
    },
    {
        slug: 'card',
        title: 'Card',
        selector: 'zyra-card',
        importName: 'ZyraCard',
        category: 'Layout',
        description:
            'Flexible content containers for dashboards, previews, settings panels, and modular content blocks.',
        icon: square,
        accent: 'purple',
        highlights: [
            'Header and footer slots',
            'Clickable mode support',
            'Multiple visual variants',
        ],
        exampleCode: CARD_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Standard flat surface card' },
            { name: 'outlined', description: 'Bordered card with no background shadow' },
            { name: 'elevated', description: 'Card with drop shadow for depth' },
            { name: 'ghost', description: 'Transparent background, subtle hover fill' },
            {
                name: 'clickable',
                description: 'Any variant with [clickable]="true" — emits clicked on press',
            },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'default' | 'outlined' | 'elevated' | 'ghost'",
                default: "'default'",
                description: 'Visual style of the card surface',
            },
            {
                name: 'padding',
                type: "'none' | 'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Internal padding scale',
            },
            {
                name: 'clickable',
                type: 'boolean',
                default: 'false',
                description: 'Adds hover animation and pointer cursor',
            },
            {
                name: 'hasHeader',
                type: 'boolean',
                default: 'false',
                description: 'Enables the named header slot',
            },
            {
                name: 'hasFooter',
                type: 'boolean',
                default: 'false',
                description: 'Enables the named footer slot',
            },
            {
                name: 'clicked (output)',
                type: 'void',
                default: '-',
                description: 'Emits when a clickable card is pressed',
            },
        ],
        a11yNotes: [
            'When clickable, wrap content in a <button> or <a> rather than relying on the card click alone',
            'Use semantic headings inside the header slot for proper document outline',
            'Avoid placing interactive elements inside a clickable card — creates nested interactives',
        ],
        relatedSlugs: ['divider', 'accordion', 'avatar'],
    },
    {
        slug: 'code-block',
        title: 'Code Block',
        selector: 'zyra-code-block',
        importName: 'ZyraCodeBlock',
        category: 'Data Display',
        description:
            'Monospace code snippets with an optional filename/language header, line numbers, and a one-click copy button.',
        icon: code,
        accent: 'blue',
        highlights: [
            'One-click copy to clipboard',
            'Optional line numbers',
            'Filename and language header',
        ],
        exampleCode: CODE_BLOCK_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Header with copy button, no line numbers' },
            { name: 'with line numbers', description: 'Numbered gutter for longer snippets' },
            { name: 'headerless', description: 'copyable, filename, and language all empty — no header row' },
        ],
        apiProps: [
            {
                name: 'code',
                type: 'string',
                default: "''",
                description: 'The source text to display',
            },
            {
                name: 'language',
                type: 'string',
                default: "''",
                description: 'Label shown in the header (display only, no syntax coloring)',
            },
            {
                name: 'filename',
                type: 'string',
                default: "''",
                description: 'Filename shown in the header',
            },
            {
                name: 'lineNumbers',
                type: 'boolean',
                default: 'false',
                description: 'Shows a numbered gutter beside each line',
            },
            {
                name: 'copyable',
                type: 'boolean',
                default: 'true',
                description: 'Shows the copy-to-clipboard button in the header',
            },
        ],
        a11yNotes: [
            'The copy button updates its aria-label between "Copy code" and "Copied" as state changes',
            'Code is rendered in a <pre><code> block so screen readers announce it as preformatted text',
        ],
        relatedSlugs: ['card', 'badge'],
    },
    {
        slug: 'breadcrumb',
        title: 'Breadcrumb',
        selector: 'zyra-breadcrumb',
        importName: 'ZyraBreadcrumb',
        category: 'Navigation',
        description:
            'A trail of ancestor links showing the user’s current location within a hierarchy of pages.',
        icon: caretRight,
        accent: 'blue',
        highlights: [
            'Composable item-based API',
            'Automatic separators between items',
            'Current page marked with aria-current',
        ],
        exampleCode: BREADCRUMB_EXAMPLE_CODE,
        variants: [
            { name: 'link item', description: 'Item with an href — renders as a clickable anchor' },
            { name: 'current item', description: '[current]="true" — renders without href, marked aria-current="page"' },
        ],
        apiProps: [
            {
                name: 'ariaLabel (zyra-breadcrumb)',
                type: 'string',
                default: "'Breadcrumb'",
                description: 'Accessible label for the nav landmark',
            },
            {
                name: 'href (zyra-breadcrumb-item)',
                type: 'string',
                default: "''",
                description: 'Destination URL; ignored when current is true',
            },
            {
                name: 'current (zyra-breadcrumb-item)',
                type: 'boolean',
                default: 'false',
                description: 'Marks the item as the current page — renders without a clickable href',
            },
        ],
        a11yNotes: [
            'Rendered as a <nav> landmark with an ol/li list structure',
            'The current item gets aria-current="page" and no href, so it is not focusable',
            'Separator icons are aria-hidden and purely decorative',
        ],
        relatedSlugs: ['card', 'divider'],
    },
    {
        slug: 'dropdown-menu',
        title: 'Dropdown Menu',
        selector: 'zyra-dropdown-menu',
        importName: 'ZyraDropdownMenu',
        category: 'Navigation',
        description:
            'A trigger-activated menu panel for grouping secondary actions like edit, duplicate, or delete.',
        icon: menu,
        accent: 'purple',
        highlights: [
            'Closes on outside click, Escape, or item select',
            'Start/end alignment relative to the trigger',
            'Danger variant for destructive actions',
        ],
        exampleCode: DROPDOWN_MENU_EXAMPLE_CODE,
        variants: [
            { name: 'default item', description: 'Standard menu action' },
            { name: 'danger item', description: 'variant="danger" — red-tinted for destructive actions' },
            { name: 'disabled item', description: '[disabled]="true" — non-interactive, skipped on click' },
        ],
        apiProps: [
            {
                name: 'align (zyra-dropdown-menu)',
                type: "'start' | 'end'",
                default: "'start'",
                description: 'Horizontal alignment of the panel relative to the trigger',
            },
            {
                name: 'variant (zyra-menu-item)',
                type: "'default' | 'danger'",
                default: "'default'",
                description: 'Visual style of the menu item',
            },
            {
                name: 'disabled (zyra-menu-item)',
                type: 'boolean',
                default: 'false',
                description: 'Disables the item — clicks are ignored',
            },
            {
                name: 'itemClick (zyra-menu-item, output)',
                type: 'void',
                default: '-',
                description: 'Emits when an enabled item is clicked; the menu also auto-closes',
            },
        ],
        a11yNotes: [
            'Panel is rendered with role="menu" and items with role="menuitem"',
            'Closes on outside click and on Escape',
            'The trigger slot accepts any focusable element, typically a button',
        ],
        relatedSlugs: ['button', 'tooltip'],
    },
    {
        slug: 'avatar',
        title: 'Avatar',
        selector: 'zyra-avatar',
        importName: 'ZyraAvatar',
        category: 'Identity',
        description:
            'Profile and team visuals that make lists, comments, and user surfaces feel more human and scannable.',
        icon: circleUser,
        accent: 'green',
        highlights: ['Great for team UIs', 'Pairs well with badges', 'Readable at smaller sizes'],
        exampleCode: AVATAR_EXAMPLE_CODE,
        variants: [
            { name: 'teal', description: 'Default accent-teal initials background' },
            { name: 'blue', description: 'Blue initials background' },
            { name: 'purple', description: 'Purple initials background' },
            { name: 'warm', description: 'Warm amber initials background' },
            { name: 'neutral', description: 'Neutral grey initials background' },
        ],
        apiProps: [
            {
                name: 'name',
                type: 'string',
                default: "''",
                description: 'Full name used to generate initials and aria-label',
            },
            {
                name: 'src',
                type: 'string',
                default: "''",
                description: 'Image URL; falls back to initials when not provided or broken',
            },
            {
                name: 'size',
                type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
                default: "'md'",
                description: 'Diameter of the avatar',
            },
            {
                name: 'variant',
                type: "'teal' | 'blue' | 'purple' | 'warm' | 'neutral'",
                default: "'teal'",
                description: 'Background color for initials fallback',
            },
            {
                name: 'square',
                type: 'boolean',
                default: 'false',
                description: 'Renders as a rounded-corner square instead of a circle',
            },
            {
                name: 'online',
                type: 'boolean | null',
                default: 'null',
                description: 'Shows a green presence dot (true) or hides it (null/false)',
            },
        ],
        a11yNotes: [
            'The name prop is used as the accessible aria-label for screen readers',
            'Image avatars include a meaningful alt attribute derived from name',
            'Presence indicator dot is decorative; status should be conveyed in text elsewhere',
        ],
        relatedSlugs: ['badge', 'card', 'tooltip'],
    },
    {
        slug: 'input',
        title: 'Input',
        selector: 'zyra-input',
        importName: 'ZyraInput',
        category: 'Forms',
        description:
            'Foundation text inputs for login forms, filters, search flows, and structured data entry experiences.',
        icon: keyboard,
        accent: 'amber',
        highlights: [
            'Built for normal form flows',
            'Works with standalone imports',
            'Clean token styling',
        ],
        exampleCode: INPUT_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Standard text/email/password field' },
            { name: 'with prefix icon', description: 'Icon inside the leading edge of the field' },
            { name: 'with clear button', description: 'Shows x button to clear the value' },
            { name: 'disabled', description: 'Non-interactive state with muted styling' },
            { name: 'error', description: 'Red border and error icon for invalid state' },
        ],
        apiProps: [
            {
                name: 'type',
                type: "'text' | 'email' | 'password' | 'search' | 'url' | 'number'",
                default: "'text'",
                description: 'Native input type',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Height and font scale',
            },
            {
                name: 'placeholder',
                type: 'string',
                default: "''",
                description: 'Placeholder text shown when empty',
            },
            {
                name: 'readonly',
                type: 'boolean',
                default: 'false',
                description: 'Makes the field non-editable but still focusable',
            },
            {
                name: 'disabled',
                type: 'boolean (Angular Forms)',
                default: 'false',
                description:
                    'Disabled state via CVA — use formControl.disable() or [disabled]="true" on template-driven ngModel',
            },
            {
                name: 'id',
                type: 'string',
                default: "''",
                description: 'Override the auto-generated id on the native input',
            },
            {
                name: 'maxlength',
                type: 'number | null',
                default: 'null',
                description: 'Native maxlength constraint',
            },
            {
                name: 'min',
                type: 'number | null',
                default: 'null',
                description: 'Minimum value (number inputs)',
            },
            {
                name: 'max',
                type: 'number | null',
                default: 'null',
                description: 'Maximum value (number inputs)',
            },
            {
                name: 'valueChange (output)',
                type: 'string',
                default: '-',
                description: 'Emits the current string value on every keystroke',
            },
            {
                name: 'focused (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the input gains focus',
            },
            {
                name: 'blurred (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the input loses focus',
            },
        ],
        a11yNotes: [
            'Always associate an input with a visible <label> or use aria-label',
            'Pair with ZyraFormField to get proper label and hint associations automatically',
            'Error state sets aria-invalid="true"; pair with an error message element using aria-describedby',
        ],
        relatedSlugs: ['form-field', 'switch', 'button'],
    },
    {
        slug: 'form-field',
        title: 'Form Field',
        selector: 'zyra-form-field',
        importName: 'ZyraFormField',
        category: 'Forms',
        description:
            'Field wrappers that align labels, hints, and validation copy into a more polished form system.',
        icon: alignLeft,
        accent: 'blue',
        highlights: [
            'Helps compose accessible forms',
            'Supports helper and error text',
            'Keeps spacing consistent',
        ],
        exampleCode: FORM_FIELD_EXAMPLE_CODE,
        variants: [
            { name: 'with label', description: 'Visible label above the field' },
            { name: 'with hint', description: 'Helper text below the field' },
            {
                name: 'with error',
                description: 'Error message replacing the hint on invalid state',
            },
            {
                name: 'with prefix icon',
                description: 'Icon decorating the start of the wrapped input',
            },
        ],
        apiProps: [
            {
                name: 'label',
                type: 'string',
                default: "''",
                description: 'Visible label text linked to the child input',
            },
            {
                name: 'hint',
                type: 'string',
                default: "''",
                description: 'Helper text shown below the input',
            },
            {
                name: 'successHint',
                type: 'string',
                default: "''",
                description: 'Success message shown below the field (green)',
            },
            {
                name: 'error (auto)',
                type: 'ValidationErrors | null',
                default: 'null',
                description:
                    'Error message is derived automatically from the child control — required, email, minlength, maxlength, min, max, and pattern validators are all handled; no error prop needed',
            },
            {
                name: 'appearance',
                type: "'outline' | 'filled' | 'underline'",
                default: "'outline'",
                description: 'Visual style of the field border',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Passes size down to child input',
            },
            {
                name: 'prefixIcon',
                type: 'ZyraIcon',
                default: "''",
                description: 'Icon shown inside the leading edge of the field',
            },
            {
                name: 'suffixIcon',
                type: 'ZyraIcon',
                default: "''",
                description: 'Icon shown inside the trailing edge of the field',
            },
            {
                name: 'maxLength',
                type: 'number | null',
                default: 'null',
                description: 'Shows a character counter below the field',
            },
            {
                name: 'clearButton',
                type: 'boolean',
                default: 'false',
                description: 'Adds a clear × button inside the trailing edge',
            },
            {
                name: 'loading',
                type: 'boolean',
                default: 'false',
                description: 'Shows a spinner in the trailing edge',
            },
        ],
        a11yNotes: [
            'label is automatically linked to the child input via htmlFor/id pairing',
            'hint and error text are linked via aria-describedby on the input',
            'When error is set, the child input receives aria-invalid="true"',
        ],
        relatedSlugs: ['input', 'switch', 'button'],
    },
    {
        slug: 'spinner',
        title: 'Spinner',
        selector: 'zyra-spinner',
        importName: 'ZyraSpinner',
        category: 'Feedback',
        description:
            'Loading indicators for async states, background fetches, and actions that need a clear pending signal.',
        icon: spinner,
        accent: 'purple',
        highlights: [
            'Useful for async states',
            'Easy to drop into buttons',
            'Keeps loading feedback visible',
        ],
        exampleCode: SPINNER_EXAMPLE_CODE,
        variants: [
            { name: 'accent', description: 'Teal accent color (default brand color)' },
            { name: 'accent-2', description: 'Secondary accent color' },
            { name: 'white', description: 'White variant for use on dark or colored backgrounds' },
            {
                name: 'current',
                description: 'Inherits the current text color — works on any background',
            },
        ],
        apiProps: [
            {
                name: 'size',
                type: "'xs' | 'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Diameter of the spinner',
            },
            {
                name: 'color',
                type: "'accent' | 'accent-2' | 'white' | 'current'",
                default: "'accent'",
                description: 'Spinner track color',
            },
            {
                name: 'label',
                type: 'string',
                default: "'Loading…'",
                description: 'Screen-reader-only label for accessibility',
            },
        ],
        a11yNotes: [
            'Renders with role="status" so screen readers announce the loading state',
            'label is visually hidden but announced to screen readers',
            'When embedding in a button, set button aria-busy="true" alongside the spinner',
        ],
        relatedSlugs: ['button', 'progress', 'toast'],
    },
    {
        slug: 'toast',
        title: 'Toast',
        selector: 'zyra-toast-container',
        importName: 'ZyraToastContainer',
        category: 'Feedback',
        description:
            'Transient notifications for confirmations, warnings, and system messages without interrupting the flow.',
        icon: message,
        accent: 'teal',
        highlights: [
            'Success, info, warning, error flows',
            'Great for action confirmation',
            'Fits app-wide feedback',
        ],
        exampleCode: TOAST_EXAMPLE_CODE,
        variants: [
            { name: 'success', description: 'Confirms a completed action (green)' },
            { name: 'info', description: 'Neutral informational message (blue)' },
            { name: 'warning', description: 'Cautionary notice that may need attention (amber)' },
            { name: 'error', description: 'Failed action or critical issue (red)' },
        ],
        apiProps: [
            {
                name: 'toast.success()',
                type: '(title, options?) => void',
                default: '-',
                description: 'Show a success toast via ZyraToastService',
            },
            {
                name: 'toast.info()',
                type: '(title, options?) => void',
                default: '-',
                description: 'Show an info toast',
            },
            {
                name: 'toast.warning()',
                type: '(title, options?) => void',
                default: '-',
                description: 'Show a warning toast',
            },
            {
                name: 'toast.error()',
                type: '(title, options?) => void',
                default: '-',
                description: 'Show an error toast',
            },
            {
                name: 'options.description',
                type: 'string',
                default: '-',
                description: 'Secondary body text below the title',
            },
            {
                name: 'options.duration',
                type: 'number',
                default: '4000',
                description: 'Auto-dismiss delay in milliseconds',
            },
        ],
        a11yNotes: [
            'Toast container uses role="region" with an aria-label for screen reader announcement',
            'Success/info toasts use aria-live="polite"; error toasts use aria-live="assertive"',
            'Each toast includes a visible dismiss button with an accessible label',
            'Toasts do not auto-dismiss during keyboard navigation to prevent losing context',
        ],
        relatedSlugs: ['alert', 'spinner', 'button'],
    },
    {
        slug: 'tooltip',
        title: 'Tooltip',
        selector: 'zyra-tooltip',
        importName: 'ZyraTooltip',
        category: 'Overlays',
        description:
            'Helpful hover and focus details for dense controls, icon actions, and space-constrained interfaces.',
        icon: circleInfo,
        accent: 'green',
        highlights: [
            'Adds context without clutter',
            'Works well on icon-only actions',
            'Supports compact UIs',
        ],
        exampleCode: TOOLTIP_EXAMPLE_CODE,
        variants: [
            { name: 'top', description: 'Tooltip appears above the trigger element' },
            { name: 'bottom', description: 'Tooltip appears below the trigger element' },
            { name: 'left', description: 'Tooltip appears to the left' },
            { name: 'right', description: 'Tooltip appears to the right' },
        ],
        apiProps: [
            { name: 'text', type: 'string', default: "''", description: 'Tooltip label text' },
            {
                name: 'position',
                type: "'top' | 'bottom' | 'left' | 'right'",
                default: "'top'",
                description: 'Preferred placement relative to the trigger',
            },
            {
                name: 'maxWidth',
                type: 'string',
                default: "'200px'",
                description: 'CSS max-width of the tooltip bubble',
            },
        ],
        a11yNotes: [
            'Tooltip is linked to its trigger via aria-describedby for screen reader announcement',
            'Tooltip renders with role="tooltip" — the trigger element must be focusable',
            'Tooltip is shown on both hover and focus so keyboard users get the same information',
            'Never put interactive content inside a tooltip',
        ],
        relatedSlugs: ['button', 'avatar', 'modal'],
    },
    {
        slug: 'modal',
        title: 'Modal',
        selector: 'zyra-modal',
        importName: 'ZyraModal',
        category: 'Overlays',
        description:
            'Accessible dialog overlay with focus trap, ESC to close, backdrop dismiss, and flexible header/footer slots.',
        icon: square,
        accent: 'purple',
        highlights: [
            'Focus trap and ESC key support',
            'Backdrop click to dismiss',
            'Four sizes with smooth animation',
        ],
        exampleCode: MODAL_EXAMPLE_CODE,
        variants: [
            { name: 'sm', description: 'Compact dialog for quick confirmations (400px)' },
            { name: 'md', description: 'Default size for forms and confirmations (560px)' },
            { name: 'lg', description: 'Wider panel for complex content (720px)' },
            { name: 'xl', description: 'Full-featured dialog for rich editing (900px)' },
        ],
        apiProps: [
            {
                name: 'open',
                type: 'boolean',
                default: 'false',
                description: 'Two-way bound visibility state via [(open)]',
            },
            {
                name: 'title',
                type: 'string',
                default: "''",
                description: 'Dialog heading displayed in the header',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg' | 'xl'",
                default: "'md'",
                description: 'Maximum width of the dialog panel',
            },
            {
                name: 'dismissible',
                type: 'boolean',
                default: 'true',
                description: 'Shows a close × button and allows ESC / backdrop click to close',
            },
            {
                name: 'closed (output)',
                type: 'void',
                default: '-',
                description: 'Emits after the modal finishes closing',
            },
        ],
        a11yNotes: [
            'Renders with role="dialog" and aria-modal="true" to isolate screen-reader focus',
            'Focus is trapped inside the modal while it is open',
            'ESC key closes the modal; focus returns to the trigger element on close',
            'aria-labelledby links the title to the dialog for screen reader announcement',
        ],
        relatedSlugs: ['button', 'tooltip', 'accordion'],
    },
    {
        slug: 'alert',
        title: 'Alert',
        selector: 'zyra-alert',
        importName: 'ZyraAlert',
        category: 'Feedback',
        description:
            'Inline status messages for success, warning, danger, and info states with optional title and dismiss support.',
        icon: triangleExclamation,
        accent: 'amber',
        highlights: [
            'Four semantic variants',
            'Optional title and dismiss',
            'Accessible role="alert"',
        ],
        exampleCode: ALERT_EXAMPLE_CODE,
        variants: [
            { name: 'success', description: 'Confirmation or completed action (green)' },
            { name: 'info', description: 'Informational context or tips (blue)' },
            { name: 'warning', description: 'Cautionary message requiring attention (amber)' },
            { name: 'danger', description: 'Error or destructive state notice (red)' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'success' | 'info' | 'warning' | 'danger'",
                default: "'info'",
                description: 'Semantic color and icon',
            },
            {
                name: 'title',
                type: 'string',
                default: '-',
                description: 'Bold heading above the message body',
            },
            {
                name: 'dismissible',
                type: 'boolean',
                default: 'false',
                description: 'Shows a close × button',
            },
        ],
        a11yNotes: [
            'Renders with role="alert" so the message is announced immediately by screen readers',
            'For non-urgent messages, use role="status" via a custom wrapper instead',
            'Dismiss button has an accessible aria-label="Dismiss alert"',
        ],
        relatedSlugs: ['toast', 'badge', 'chip'],
    },
    {
        slug: 'chip',
        title: 'Chip',
        selector: 'zyra-chip',
        importName: 'ZyraChip',
        category: 'Actions',
        description:
            'Compact interactive labels for filters, tags, and selections — supports dismissible and selectable modes.',
        icon: certificate,
        accent: 'purple',
        highlights: [
            'Dismissible with × button',
            'Selectable with toggle state',
            'All semantic variants',
        ],
        exampleCode: CHIP_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Neutral chip for categories and plain tags' },
            { name: 'info', description: 'Blue tint for informational labels' },
            { name: 'success', description: 'Green for active or passing filter states' },
            { name: 'warning', description: 'Amber for caution tags' },
            { name: 'danger', description: 'Red for error or blocking tags' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'purple'",
                default: "'default'",
                description: 'Color and semantic meaning',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the chip',
            },
            {
                name: 'dismissible',
                type: 'boolean',
                default: 'false',
                description: 'Shows a × button to remove the chip',
            },
            {
                name: 'selectable',
                type: 'boolean',
                default: 'false',
                description: 'Enables toggle-selection state',
            },
            {
                name: 'selected',
                type: 'boolean',
                default: 'false',
                description: 'Current selected state (two-way bindable)',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Prevents interaction',
            },
            {
                name: 'dismissed (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the × button is clicked',
            },
            {
                name: 'selectedChange (output)',
                type: 'boolean',
                default: '-',
                description: 'Emits the new selected state when toggled',
            },
        ],
        a11yNotes: [
            'Dismissible chips include a visually-hidden "Remove" label on the × button',
            'Selectable chips use aria-pressed to communicate toggle state',
            'Use a group element with role="group" and an aria-label when listing multiple chips',
        ],
        relatedSlugs: ['badge', 'button', 'alert'],
    },
    {
        slug: 'switch',
        title: 'Switch',
        selector: 'zyra-switch',
        importName: 'ZyraSwitch',
        category: 'Forms',
        description:
            'On/off switch control for settings, preferences, and feature flags with full keyboard and accessibility support.',
        icon: bolt,
        accent: 'teal',
        highlights: [
            'Three sizes with smooth animation',
            'Label on left or right',
            'Accessible role="switch"',
        ],
        exampleCode: SWITCH_EXAMPLE_CODE,
        variants: [
            { name: 'sm', description: 'Small switch for dense settings panels' },
            { name: 'md', description: 'Default size for most form layouts' },
            { name: 'lg', description: 'Large switch for prominent feature toggles' },
        ],
        apiProps: [
            {
                name: 'checked',
                type: 'boolean',
                default: 'false',
                description: 'Current on/off state; two-way bindable via [(checked)]',
            },
            {
                name: 'label',
                type: 'string',
                default: "''",
                description: 'Visible text label associated with the switch',
            },
            {
                name: 'labelPosition',
                type: "'left' | 'right'",
                default: "'right'",
                description: 'Side the label renders relative to the pill',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the pill',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables interaction',
            },
            {
                name: 'changed (output)',
                type: 'boolean',
                default: '-',
                description: 'Emits the new checked value whenever the switch changes',
            },
        ],
        a11yNotes: [
            'Renders with role="switch" and aria-checked to communicate on/off state',
            'label is linked via aria-labelledby — always provide a label for screen readers',
            'Keyboard-operable via Space to toggle and Tab to focus',
        ],
        relatedSlugs: ['toggle', 'input', 'form-field', 'button'],
    },
    {
        slug: 'toggle',
        title: 'Toggle',
        selector: 'zyra-toggle',
        importName: 'ZyraToggle',
        category: 'Forms',
        description:
            'Pressable button that holds a boolean pressed/unpressed state — for toolbar actions, formatting controls, and filter pills.',
        icon: waveSquare,
        accent: 'purple',
        highlights: [
            'Button-press visual, not a track/thumb switch',
            'Content-projected — pair with icons or short labels',
            'Accessible aria-pressed state',
        ],
        exampleCode: TOGGLE_EXAMPLE_CODE,
        variants: [
            { name: 'sm', description: 'Compact toggle for dense toolbars' },
            { name: 'md', description: 'Default size for most layouts' },
            { name: 'lg', description: 'Large toggle for prominent standalone actions' },
        ],
        apiProps: [
            {
                name: 'pressed',
                type: 'boolean',
                default: 'false',
                description: 'Current pressed state; two-way bindable via [(pressed)]',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the button',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables interaction',
            },
            {
                name: 'aria-label',
                type: 'string | null',
                default: 'null',
                description: 'Accessible name when the projected content is icon-only',
            },
            {
                name: 'changed (output)',
                type: 'boolean',
                default: '-',
                description: 'Emits the new pressed value whenever the toggle changes',
            },
        ],
        a11yNotes: [
            'Renders as a native <button> with aria-pressed to communicate state',
            'Provide aria-label when the projected content is icon-only',
            'Keyboard-operable via Space/Enter and Tab to focus',
        ],
        relatedSlugs: ['switch', 'button', 'chip'],
    },
    {
        slug: 'progress',
        title: 'Progress',
        selector: 'zyra-progress',
        importName: 'ZyraProgress',
        category: 'Feedback',
        description:
            'Linear progress bars for uploads, task completion, storage usage, and any measurable loading state.',
        icon: waveSquare,
        accent: 'blue',
        highlights: [
            'Indeterminate loading mode',
            'Built-in label support',
            'All semantic variants',
        ],
        exampleCode: PROGRESS_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Accent-colored bar for general usage' },
            { name: 'info', description: 'Blue bar for informational progress' },
            { name: 'success', description: 'Green bar for completed or healthy states' },
            { name: 'warning', description: 'Amber bar for near-limit states' },
            { name: 'danger', description: 'Red bar for critical or over-limit states' },
            { name: 'indeterminate', description: 'Animated bar for unknown duration loading' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'number',
                default: '0',
                description: 'Current progress value (0–max)',
            },
            { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
            {
                name: 'variant',
                type: "'default' | 'info' | 'success' | 'warning' | 'danger'",
                default: "'default'",
                description: 'Track fill color',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Height of the progress bar',
            },
            {
                name: 'showLabel',
                type: 'boolean',
                default: 'false',
                description: 'Shows the percentage above the bar',
            },
            {
                name: 'label',
                type: 'string',
                default: "''",
                description: 'Custom label text shown instead of the auto percentage',
            },
            {
                name: 'indeterminate',
                type: 'boolean',
                default: 'false',
                description: 'Animates the bar for unknown-duration loading',
            },
        ],
        a11yNotes: [
            'Renders with role="progressbar", aria-valuenow, aria-valuemin, and aria-valuemax',
            'Indeterminate mode omits aria-valuenow to signal unknown progress',
            'Pair with a visible or visually-hidden label describing what is loading',
        ],
        relatedSlugs: ['spinner', 'toast', 'badge'],
    },
    {
        slug: 'divider',
        title: 'Divider',
        selector: 'zyra-divider',
        importName: 'ZyraDivider',
        category: 'Layout',
        description:
            'Horizontal and vertical separators for organizing content sections, form layouts, and navigation groups.',
        icon: scaleBalanced,
        accent: 'teal',
        highlights: [
            'Horizontal and vertical modes',
            'Optional centered label',
            'Solid, dashed, and dotted styles',
        ],
        exampleCode: DIVIDER_EXAMPLE_CODE,
        variants: [
            { name: 'solid', description: 'Default solid 1px line' },
            { name: 'dashed', description: 'Dashed line for softer separation' },
            { name: 'dotted', description: 'Dotted line for subtle dividers' },
            { name: 'vertical', description: 'Vertical orientation for inline layouts' },
        ],
        apiProps: [
            {
                name: 'orientation',
                type: "'horizontal' | 'vertical'",
                default: "'horizontal'",
                description: 'Line direction',
            },
            {
                name: 'variant',
                type: "'solid' | 'dashed' | 'dotted'",
                default: "'solid'",
                description: 'Line stroke style',
            },
            {
                name: 'align',
                type: "'start' | 'center' | 'end'",
                default: "'center'",
                description: 'Alignment of the optional label along the line',
            },
            {
                name: 'label',
                type: 'string',
                default: "''",
                description: 'Optional text label centered on the divider (e.g. "or")',
            },
            {
                name: 'width',
                type: 'string',
                default: "'1px'",
                description: 'CSS thickness of the divider line (e.g. "2px")',
            },
        ],
        a11yNotes: [
            'Renders with role="separator" for screen reader context',
            'Vertical dividers should have aria-orientation="vertical"',
            'When used decoratively, add aria-hidden="true"',
        ],
        relatedSlugs: ['card', 'accordion', 'form-field'],
    },
    {
        slug: 'select',
        title: 'Select',
        selector: 'zyra-select',
        importName: 'ZyraSelect',
        category: 'Forms',
        description:
            'Custom dropdown select for choosing from a list of options — fully keyboard accessible with smooth open/close animation.',
        icon: alignLeft,
        accent: 'teal',
        highlights: [
            'Works with Angular forms (CVA)',
            'Keyboard navigation built in',
            'Three appearances and sizes',
        ],
        exampleCode: SELECT_EXAMPLE_CODE,
        variants: [
            {
                name: 'outline',
                description: 'Default bordered appearance matching ZyraInput outline',
            },
            { name: 'filled', description: 'Filled background with bottom border only' },
            { name: 'underline', description: 'Minimal underline-only border' },
        ],
        apiProps: [
            {
                name: 'placeholder',
                type: 'string',
                default: "'Select an option'",
                description: 'Text shown when no value is selected',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Height and font scale',
            },
            {
                name: 'appearance',
                type: "'outline' | 'filled' | 'underline'",
                default: "'outline'",
                description: 'Visual style of the trigger',
            },
            {
                name: 'value (on option)',
                type: 'string | number | null',
                default: '-',
                description: 'The value emitted when the option is selected',
            },
            {
                name: 'disabled (on option)',
                type: 'boolean',
                default: 'false',
                description: 'Prevents an option from being selected',
            },
        ],
        a11yNotes: [
            'Trigger uses aria-haspopup="listbox" and aria-expanded to communicate state',
            'Panel uses role="listbox"; options use role="option" with aria-selected',
            'aria-activedescendant on the trigger tracks the keyboard-highlighted option',
            'Arrow keys navigate options; Enter/Space selects; Escape closes; Tab dismisses',
            'Disabled options are marked aria-disabled and skipped by keyboard navigation',
        ],
        relatedSlugs: ['input', 'form-field', 'switch'],
    },
    {
        slug: 'textarea',
        title: 'Textarea',
        selector: 'zyra-textarea',
        importName: 'ZyraTextarea',
        category: 'Forms',
        description:
            'Multi-line text input with auto-resize, size variants, and full ZyraFormField integration for labels and validation.',
        icon: alignLeft,
        accent: 'amber',
        highlights: ['Auto-resize mode', 'Works inside ZyraFormField', 'Character counter support'],
        exampleCode: TEXTAREA_EXAMPLE_CODE,
        variants: [
            {
                name: 'vertical resize',
                description: 'User can drag to resize vertically (default)',
            },
            { name: 'auto resize', description: 'Expands automatically as content grows' },
            { name: 'no resize', description: 'Fixed height, no resize handle' },
        ],
        apiProps: [
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Font and spacing scale',
            },
            { name: 'rows', type: 'number', default: '3', description: 'Initial visible rows' },
            { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text' },
            {
                name: 'resize',
                type: "'none' | 'vertical' | 'auto'",
                default: "'vertical'",
                description: 'Resize behaviour',
            },
            {
                name: 'maxlength',
                type: 'number',
                default: 'null',
                description: 'Native maxlength attribute',
            },
            {
                name: 'readonly',
                type: 'boolean',
                default: 'false',
                description: 'Makes the textarea read-only',
            },
            {
                name: 'disabled',
                type: 'boolean (Angular Forms)',
                default: 'false',
                description:
                    'Disabled state via CVA — use formControl.disable() or [disabled]="true" on template-driven ngModel',
            },
        ],
        a11yNotes: [
            'Always pair with ZyraFormField or a native <label> for accessible labelling',
            'Character counter in ZyraFormField is linked via aria-describedby',
        ],
        relatedSlugs: ['input', 'form-field', 'checkbox'],
    },
    {
        slug: 'checkbox',
        title: 'Checkbox',
        selector: 'zyra-checkbox',
        importName: 'ZyraCheckbox',
        category: 'Forms',
        description:
            'Accessible checkbox with indeterminate state, label positioning, three sizes, and full Angular forms support.',
        icon: check,
        accent: 'teal',
        highlights: ['Indeterminate state', 'Works with reactive forms', 'Three sizes'],
        exampleCode: CHECKBOX_EXAMPLE_CODE,
        variants: [
            { name: 'unchecked', description: 'Default empty state' },
            { name: 'checked', description: 'Selected state with accent fill' },
            {
                name: 'indeterminate',
                description: 'Partial selection — dash icon in accent fill',
            },
            { name: 'disabled', description: 'Non-interactive at 45% opacity' },
        ],
        apiProps: [
            {
                name: 'checked',
                type: 'boolean',
                default: 'false',
                description: 'Two-way bindable checked state via [(checked)]',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Size of the checkbox box and label',
            },
            { name: 'label', type: 'string', default: "''", description: 'Visible label text' },
            {
                name: 'labelPosition',
                type: "'left' | 'right'",
                default: "'right'",
                description: 'Side the label renders on',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Prevents interaction',
            },
            {
                name: 'indeterminate',
                type: 'boolean',
                default: 'false',
                description: 'Shows dash icon for partial selection',
            },
        ],
        a11yNotes: [
            'Uses role="checkbox" on the interactive button with aria-checked',
            'Indeterminate state sets aria-checked="mixed"',
            'Keyboard: Space or Enter to toggle; Tab to focus',
        ],
        relatedSlugs: ['switch', 'radio', 'form-field'],
    },
    {
        slug: 'radio',
        title: 'Radio Group',
        selector: 'zyra-radio-group',
        importName: 'ZyraRadioGroup',
        category: 'Forms',
        description:
            'Accessible radio button group for mutually exclusive choices — vertical or horizontal layout, arrow key navigation.',
        icon: circleInfo,
        accent: 'blue',
        highlights: [
            'Arrow key navigation',
            'Vertical and horizontal',
            'Works with reactive forms',
        ],
        exampleCode: RADIO_EXAMPLE_CODE,
        variants: [
            { name: 'vertical', description: 'Stacked layout (default)' },
            { name: 'horizontal', description: 'Side-by-side layout' },
            { name: 'disabled group', description: 'Entire group non-interactive' },
            { name: 'disabled option', description: 'Single option non-interactive' },
        ],
        apiProps: [
            {
                name: 'orientation',
                type: "'vertical' | 'horizontal'",
                default: "'vertical'",
                description: 'Layout direction of the radio options',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the entire group',
            },
            {
                name: 'label',
                type: 'string',
                default: "''",
                description: 'aria-label for the radiogroup role',
            },
            {
                name: 'value (on radio)',
                type: 'string | number',
                default: '-',
                description: 'Value emitted when this radio is selected',
            },
            {
                name: 'disabled (on radio)',
                type: 'boolean',
                default: 'false',
                description: 'Disables a single radio option',
            },
        ],
        a11yNotes: [
            'Group uses role="radiogroup"; each option uses role="radio" with aria-checked',
            'Arrow keys navigate between options within the group',
            'Tab moves focus to the selected radio (or first if none selected)',
        ],
        relatedSlugs: ['checkbox', 'switch', 'select'],
    },
    {
        slug: 'tabs',
        title: 'Tabs',
        selector: 'zyra-tabs',
        importName: 'ZyraTabs',
        category: 'Navigation',
        description:
            'Tab navigation with 4 style variants, 3 sizes, icons, badges, closeable tabs, vertical orientation, and full keyboard support.',
        icon: swatchbook,
        accent: 'purple',
        highlights: [
            '4 style variants (underline, pill, filled, outlined)',
            'Icons, badges, and closeable tabs',
            'Vertical orientation support',
            'Directional slide panel transition',
            'Lazy panel rendering',
            'Arrow key + Delete navigation',
        ],
        exampleCode: TABS_EXAMPLE_CODE,
        variants: [
            { name: 'underline', description: 'Active tab shows a 2px accent underline (default)' },
            { name: 'pill', description: 'Active tab gets an elevated pill background' },
            { name: 'filled', description: 'Active trigger fills with accent color' },
            {
                name: 'outlined',
                description: 'Active trigger has a border, connects to panel below',
            },
            {
                name: 'vertical',
                description: 'Tabs stacked on the left with a right-edge accent indicator',
            },
            { name: 'icon', description: 'Optional emoji or glyph rendered before the label' },
            {
                name: 'badge',
                description: 'Count pill shown after the label; highlights when tab is active',
            },
            {
                name: 'closeable',
                description: 'Adds a × button; Tab auto-advances when the active one is closed',
            },
            {
                name: 'disabled tab',
                description: 'Non-interactive tab, visually dimmed and skipped by arrow keys',
            },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'underline' | 'pill' | 'filled' | 'outlined'",
                default: "'underline'",
                description: 'Visual style of the tab list',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Trigger padding and font size',
            },
            {
                name: 'orientation',
                type: "'horizontal' | 'vertical'",
                default: "'horizontal'",
                description: 'Stacks tabs vertically on the left when set to vertical',
            },
            {
                name: 'tabChange (output)',
                type: 'string',
                default: '-',
                description: "Emits the activated tab's tabId (or auto-generated uid)",
            },
            {
                name: 'tabClose (output)',
                type: 'string',
                default: '-',
                description: "Emits the closed tab's tabId when a closeable tab is dismissed",
            },
            {
                name: 'label',
                type: 'string',
                default: '-',
                description: '(on zyra-tab) Text shown in the trigger button — required',
            },
            {
                name: 'icon',
                type: 'string',
                default: "''",
                description: '(on zyra-tab) Emoji or glyph rendered before the label',
            },
            {
                name: 'badge',
                type: 'string | number',
                default: "''",
                description:
                    '(on zyra-tab) Count shown after the label; accent-highlighted when active',
            },
            {
                name: 'closeable',
                type: 'boolean',
                default: 'false',
                description:
                    '(on zyra-tab) Shows × button; Delete/Backspace also closes the focused tab',
            },
            {
                name: 'tabId',
                type: 'string',
                default: 'auto-generated',
                description: '(on zyra-tab) Optional ID emitted on tabChange / tabClose outputs',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: '(on zyra-tab) Prevents activation; skipped by keyboard navigation',
            },
        ],
        a11yNotes: [
            'Triggers use role="tab" with aria-selected and aria-controls',
            'Panels use role="tabpanel" with aria-labelledby linking to trigger',
            'Horizontal: Arrow Left/Right navigate triggers; Vertical: Arrow Up/Down',
            'Tab key moves focus into the active panel',
            'Disabled tabs have aria-disabled and are skipped by arrow key navigation',
            'Delete or Backspace closes the focused tab when it has closeable set',
            'Close button has aria-label="Close <label>" for screen reader support',
        ],
        relatedSlugs: ['accordion', 'card', 'button'],
    },
    {
        slug: 'skeleton',
        title: 'Skeleton',
        selector: 'zyra-skeleton',
        importName: 'ZyraSkeleton',
        category: 'Feedback',
        description:
            'Shimmer loading placeholders with 20+ preset layout variants — from simple text lines and shapes to full dashboard, product, calendar, and chat skeletons.',
        icon: spinner,
        accent: 'green',
        highlights: [
            '20+ preset layout patterns',
            'Primitive shapes: text, circle, rect, rounded',
            'Compound layouts: card, list, article, table, chat, dashboard, video, chart, product, profile, calendar',
            'Disable animation for static use',
        ],
        exampleCode: SKELETON_EXAMPLE_CODE,
        variants: [
            {
                name: 'text',
                description: 'Single or multi-line text placeholder; last line is shorter',
            },
            { name: 'circle', description: 'Circular placeholder for avatars and icons' },
            { name: 'rect', description: 'Rectangle placeholder for images and banners' },
            { name: 'rounded', description: 'Rounded-corner rectangle for pills and badges' },
            { name: 'avatar', description: 'Compound: circle + two text lines side by side' },
            { name: 'image', description: 'Image frame with a subtle icon watermark' },
            { name: 'button', description: 'Inline pill matching a typical button width' },
            { name: 'input', description: 'Label + input-box stacked' },
            { name: 'card', description: 'Image header + body text lines' },
            { name: 'list', description: 'Repeating avatar rows (controlled by rows input)' },
            { name: 'article', description: 'Title, author meta, hero image, and body paragraphs' },
            { name: 'table', description: 'Header row + data rows (controlled by rows input)' },
            { name: 'chat', description: 'Left/right conversation bubbles' },
            { name: 'dashboard', description: 'Stat cards row + bar chart' },
            { name: 'video', description: 'Video frame + playback controls + title lines' },
            { name: 'chart', description: 'Bar chart with axis labels' },
            { name: 'product', description: 'Product image + name, price, and CTA button' },
            { name: 'profile', description: 'Avatar + name/bio + stat strip' },
            { name: 'calendar', description: 'Month header + 35-cell day grid' },
            { name: 'static', description: 'Any variant with [animated]="false" — no shimmer' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'text' | 'circle' | 'rect' | 'rounded' | 'avatar' | 'image' | 'button' | 'input' | 'card' | 'list' | 'article' | 'table' | 'chat' | 'dashboard' | 'video' | 'chart' | 'product' | 'profile' | 'calendar'",
                default: "'rect'",
                description: 'Skeleton shape or preset layout',
            },
            {
                name: 'lines',
                type: 'number',
                default: '3',
                description: 'Number of text lines (text and article variants)',
            },
            {
                name: 'rows',
                type: 'number',
                default: '5',
                description: 'Number of repeated rows (list and table variants)',
            },
            {
                name: 'width',
                type: 'string',
                default: "''",
                description: 'CSS width override (e.g. "120px", "60%")',
            },
            { name: 'height', type: 'string', default: "''", description: 'CSS height override' },
            {
                name: 'animated',
                type: 'boolean',
                default: 'true',
                description: 'Enable/disable the shimmer animation',
            },
        ],
        a11yNotes: [
            'Skeleton is purely decorative — wrap in an aria-busy="true" container while loading',
            'Remove skeletons and announce content arrival with aria-live="polite"',
        ],
        relatedSlugs: ['spinner', 'card', 'progress'],
    },
    {
        slug: 'accordion',
        title: 'Accordion',
        selector: 'zyra-accordion',
        importName: 'ZyraAccordion',
        category: 'Layout',
        description:
            'Collapsible content sections for FAQs, settings panels, and any grouped information that benefits from progressive disclosure.',
        icon: alignLeft,
        accent: 'amber',
        highlights: [
            'Single or multi-open modes',
            'Smooth CSS grid animation',
            'Keyboard accessible',
        ],
        exampleCode: ACCORDION_EXAMPLE_CODE,
        variants: [
            { name: 'single', description: 'Only one item can be open at a time' },
            { name: 'multiple', description: 'Multiple items can be expanded simultaneously' },
        ],
        apiProps: [
            {
                name: 'allowMultiple',
                type: 'boolean',
                default: 'false',
                description: 'Allow multiple items open simultaneously',
            },
            {
                name: 'title (on item)',
                type: 'string',
                default: '-',
                description: 'Trigger text for each accordion item',
            },
            {
                name: 'expanded (on item)',
                type: 'boolean',
                default: 'false',
                description: 'Initial open state of an item',
            },
            {
                name: 'disabled (on item)',
                type: 'boolean',
                default: 'false',
                description: 'Prevents an item from being opened',
            },
        ],
        a11yNotes: [
            'Accordion headers use role="button" with aria-expanded for open/closed state',
            'Content panels are linked to their headers via aria-controls / aria-labelledby',
            'Keyboard: Enter/Space toggles item; Tab moves to next focusable element',
            'Animation uses CSS grid — respects prefers-reduced-motion',
        ],
        relatedSlugs: ['card', 'divider', 'modal'],
    },
    {
        slug: 'typography',
        title: 'Typography',
        selector: 'zyra-typography',
        importName: 'ZyraTypography',
        category: 'Layout',
        description:
            'Consistent text styles for headings, body copy, and captions — renders the correct semantic HTML tag automatically.',
        icon: alignLeft,
        accent: 'blue',
        highlights: [
            'Real heading tags for SEO and a11y',
            'Consistent type scale across the app',
            'Truncation and muted-color helpers',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraTypography } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-typography',
  standalone: true,
  imports: [ZyraTypography],
  template: \`
    <zyra-typography variant="h3">
      Ship consistent UI, faster
    </zyra-typography>
  \`,
})
export class DemoTypographyComponent {}
`,
        variants: [
            { name: 'h1-h6', description: 'Semantic heading tags with matching type scale' },
            { name: 'body-lg / body / body-sm', description: 'Paragraph text at three sizes' },
            { name: 'caption / overline', description: 'Small supporting text, overline is uppercase' },
        ],
        apiProps: [
            {
                name: 'variant',
                type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'overline'",
                default: "'body'",
                description: 'Type scale step and default semantic tag',
            },
            {
                name: 'as',
                type: 'string',
                default: "''",
                description: 'Override the rendered HTML tag while keeping the variant styling',
            },
            {
                name: 'weight',
                type: "'regular' | 'medium' | 'semibold' | 'bold' | ''",
                default: "''",
                description: "Override the variant's default font weight",
            },
            {
                name: 'align',
                type: "'left' | 'center' | 'right'",
                default: "'left'",
                description: 'Text alignment',
            },
            {
                name: 'muted',
                type: 'boolean',
                default: 'false',
                description: 'Uses the muted foreground color token',
            },
            {
                name: 'truncate',
                type: 'boolean',
                default: 'false',
                description: 'Single-line ellipsis overflow',
            },
        ],
        a11yNotes: [
            'Headings render as real h1-h6 elements — do not skip levels in a page outline',
            'Use `as` to restyle a heading visually without breaking the document outline',
        ],
        relatedSlugs: ['card', 'divider', 'accordion'],
    },
    {
        slug: 'empty-state',
        title: 'Empty State',
        selector: 'zyra-empty-state',
        importName: 'ZyraEmptyState',
        category: 'Data Display',
        description:
            'A friendly placeholder for empty lists, no search results, or first-run screens, with room for an icon and actions.',
        icon: boxOpen,
        accent: 'purple',
        highlights: [
            'Icon, title, and description slots',
            'Optional actions row',
            'Scales with sm / md / lg sizing',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraEmptyState, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-empty-state',
  standalone: true,
  imports: [ZyraEmptyState, ZyraButton],
  template: \`
    <zyra-empty-state
      title="No results found"
      description="Try adjusting your filters or search terms."
    >
      <div slot="actions">
        <zyra-button variant="primary" size="sm">Reset filters</zyra-button>
      </div>
    </zyra-empty-state>
  \`,
})
export class DemoEmptyStateComponent {}
`,
        variants: [
            { name: 'sm', description: 'Compact spacing for inline panels' },
            { name: 'md', description: 'Default size for most empty views' },
            { name: 'lg', description: 'Generous spacing for full-page states' },
        ],
        apiProps: [
            {
                name: 'title',
                type: 'string',
                default: "''",
                description: 'Primary heading text',
            },
            {
                name: 'description',
                type: 'string',
                default: "''",
                description: 'Supporting explanation text',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Overall padding and spacing scale',
            },
        ],
        a11yNotes: [
            'Presentational — pair with an aria-live region if it appears after an async search',
            'Action buttons inside the actions slot remain fully keyboard accessible',
        ],
        relatedSlugs: ['skeleton', 'card', 'button'],
    },
    {
        slug: 'clipboard',
        title: 'Clipboard',
        selector: 'zyra-clipboard',
        importName: 'ZyraClipboard',
        category: 'Actions',
        description:
            'A one-click copy-to-clipboard trigger with a built-in "copied" confirmation state, for API keys, code snippets, and share links.',
        icon: copy,
        accent: 'teal',
        highlights: [
            'Button or icon-only variants',
            'Automatic copied confirmation with icon swap',
            'Emits a copied event for analytics/toasts',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraClipboard } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-clipboard',
  standalone: true,
  imports: [ZyraClipboard],
  template: \`
    <zyra-clipboard value="npm install zyra-ng-ui" />
  \`,
})
export class DemoClipboardComponent {}
`,
        variants: [
            { name: 'button', description: 'Icon plus visible label text' },
            { name: 'icon', description: 'Icon-only, uses an aria-label' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'string',
                default: "''",
                description: 'The text copied to the clipboard',
            },
            {
                name: 'label',
                type: 'string',
                default: "'Copy'",
                description: 'Label shown before copying',
            },
            {
                name: 'copiedLabel',
                type: 'string',
                default: "'Copied!'",
                description: 'Label shown briefly after a successful copy',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the trigger',
            },
            {
                name: 'variant',
                type: "'button' | 'icon'",
                default: "'button'",
                description: 'Icon-and-label button, or icon-only',
            },
        ],
        a11yNotes: [
            'Icon-only variant sets aria-label to the current label so the action is announced',
            'The copied confirmation is visual + textual, not color-only',
        ],
        relatedSlugs: ['code-block', 'input', 'toast'],
    },
    {
        slug: 'rating',
        title: 'Rating',
        selector: 'zyra-rating',
        importName: 'ZyraRating',
        category: 'Forms',
        description:
            'A star-rating input for reviews and feedback forms, with hover preview and keyboard support.',
        icon: star,
        accent: 'amber',
        highlights: [
            'Configurable max stars',
            'Keyboard arrow-key adjustable',
            'Read-only display mode',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';
import { ZyraRating } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-rating',
  standalone: true,
  imports: [ZyraRating],
  template: \`
    <zyra-rating [(value)]="rating" />
  \`,
})
export class DemoRatingComponent {
  rating = signal(3);
}
`,
        variants: [
            { name: 'interactive', description: 'Default clickable rating input' },
            { name: 'readonly', description: 'Display-only, for showing an existing rating' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'number',
                default: '0',
                description: 'Current rating value',
            },
            {
                name: 'max',
                type: 'number',
                default: '5',
                description: 'Number of stars to render',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the stars',
            },
            {
                name: 'readonly',
                type: 'boolean',
                default: 'false',
                description: 'Disables interaction, for display only',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables interaction and dims the control',
            },
        ],
        a11yNotes: [
            'Container uses role="radiogroup"; each star is role="radio" with aria-checked',
            'Arrow Left/Down and Right/Up adjust the value by one star',
        ],
        relatedSlugs: ['input', 'chip', 'progress'],
    },
    {
        slug: 'stack',
        title: 'Stack',
        selector: 'zyra-stack',
        importName: 'ZyraStack',
        category: 'Layout',
        description:
            'A flex layout primitive that arranges children in a row or column with consistent gap spacing, alignment, and wrapping.',
        icon: square,
        accent: 'green',
        highlights: [
            'Row or column direction',
            'Token-based gap scale',
            'Alignment and justify shortcuts',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraStack } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-stack',
  standalone: true,
  imports: [ZyraStack],
  template: \`
    <zyra-stack direction="row" gap="md" align="center">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </zyra-stack>
  \`,
})
export class DemoStackComponent {}
`,
        variants: [
            { name: 'row', description: 'Horizontal layout' },
            { name: 'column', description: 'Vertical layout (default)' },
        ],
        apiProps: [
            {
                name: 'direction',
                type: "'row' | 'column'",
                default: "'column'",
                description: 'Flex direction of the children',
            },
            {
                name: 'gap',
                type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
                default: "'md'",
                description: 'Spacing between children',
            },
            {
                name: 'align',
                type: "'start' | 'center' | 'end' | 'stretch'",
                default: "'stretch'",
                description: 'Cross-axis alignment (align-items)',
            },
            {
                name: 'justify',
                type: "'start' | 'center' | 'end' | 'between' | 'around'",
                default: "'start'",
                description: 'Main-axis alignment (justify-content)',
            },
            {
                name: 'wrap',
                type: 'boolean',
                default: 'false',
                description: 'Allows children to wrap onto new lines',
            },
        ],
        a11yNotes: ['Purely presentational — no additional ARIA semantics are introduced'],
        relatedSlugs: ['card', 'divider', 'accordion'],
    },
    {
        slug: 'pagination',
        title: 'Pagination',
        selector: 'zyra-pagination',
        importName: 'ZyraPagination',
        category: 'Navigation',
        description:
            'Page-number navigation for tables and lists, with smart ellipsis collapsing for large page counts.',
        icon: caretRight,
        accent: 'blue',
        highlights: [
            'Collapses long page ranges with an ellipsis',
            'Configurable sibling count',
            'Keyboard and screen-reader friendly',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';
import { ZyraPagination } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-pagination',
  standalone: true,
  imports: [ZyraPagination],
  template: \`
    <zyra-pagination
      [totalPages]="10"
      [currentPage]="page()"
      (pageChange)="page.set($event)"
    />
  \`,
})
export class DemoPaginationComponent {
  page = signal(1);
}
`,
        variants: [
            { name: 'sm / md / lg', description: 'Three physical sizes for the page buttons' },
        ],
        apiProps: [
            {
                name: 'totalPages',
                type: 'number',
                default: '1',
                description: 'Total number of pages',
            },
            {
                name: 'currentPage',
                type: 'number',
                default: '1',
                description: 'The currently active page',
            },
            {
                name: 'siblingCount',
                type: 'number',
                default: '1',
                description: 'Page numbers shown on each side of the current page before collapsing',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Physical size of the pagination controls',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables all navigation controls',
            },
        ],
        a11yNotes: [
            'Rendered inside a nav element with aria-label="Pagination"',
            'The active page button has aria-current="page"',
        ],
        relatedSlugs: ['tabs', 'breadcrumb', 'button'],
    },
    {
        slug: 'stepper',
        title: 'Stepper',
        selector: 'zyra-stepper',
        importName: 'ZyraStepper',
        category: 'Navigation',
        description:
            'A numbered step indicator for multi-step forms and wizards, with horizontal and vertical layouts.',
        icon: check,
        accent: 'purple',
        highlights: [
            'Horizontal or vertical orientation',
            'Completed / active / upcoming step states',
            'Click a step to jump directly to it',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';
import { ZyraStepper, ZyraStep } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-stepper',
  standalone: true,
  imports: [ZyraStepper, ZyraStep],
  template: \`
    <zyra-stepper [activeIndex]="activeIndex()" (activeIndexChange)="activeIndex.set($event)">
      <zyra-step label="Account" description="Create your account">...</zyra-step>
      <zyra-step label="Profile" description="Tell us about yourself">...</zyra-step>
      <zyra-step label="Review" description="Confirm and finish">...</zyra-step>
    </zyra-stepper>
  \`,
})
export class DemoStepperComponent {
  activeIndex = signal(0);
}
`,
        variants: [
            { name: 'horizontal', description: 'Steps laid out left to right (default)' },
            { name: 'vertical', description: 'Steps laid out top to bottom' },
        ],
        apiProps: [
            {
                name: 'activeIndex',
                type: 'number',
                default: '0',
                description: 'Index of the currently active step',
            },
            {
                name: 'orientation',
                type: "'horizontal' | 'vertical'",
                default: "'horizontal'",
                description: 'Layout direction of the step indicator',
            },
            {
                name: 'label (on step)',
                type: 'string',
                default: "''",
                description: 'Title shown next to the step indicator',
            },
            {
                name: 'description (on step)',
                type: 'string',
                default: "''",
                description: 'Supporting text shown under the label',
            },
            {
                name: 'completed (on step)',
                type: 'boolean',
                default: 'false',
                description: 'Shows a checkmark instead of the step number',
            },
            {
                name: 'disabled (on step)',
                type: 'boolean',
                default: 'false',
                description: 'Prevents the step from being clicked to navigate to',
            },
        ],
        a11yNotes: [
            'Step indicators are focusable buttons so keyboard users can jump between steps',
            'Completed steps expose a checkmark icon, not color alone',
        ],
        relatedSlugs: ['tabs', 'accordion', 'progress'],
    },
    {
        slug: 'popover',
        title: 'Popover',
        selector: 'zyra-popover',
        importName: 'ZyraPopover',
        category: 'Overlays',
        description:
            'A click- or hover-triggered floating panel for rich contextual content, menus, or previews — richer than a tooltip.',
        icon: message,
        accent: 'teal',
        highlights: [
            'Click or hover trigger modes',
            'Projected trigger and content slots',
            'Closes on outside click by default',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraPopover, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-popover',
  standalone: true,
  imports: [ZyraPopover, ZyraButton],
  template: \`
    <zyra-popover position="bottom">
      <zyra-button slot="trigger" variant="outline">Open popover</zyra-button>
      <div slot="content">
        <strong>Notifications</strong>
        <p>You have 3 unread messages.</p>
      </div>
    </zyra-popover>
  \`,
})
export class DemoPopoverComponent {}
`,
        variants: [
            { name: 'click trigger', description: 'Opens and closes on click (default)' },
            { name: 'hover trigger', description: 'Opens on mouse enter, closes on mouse leave' },
        ],
        apiProps: [
            {
                name: 'position',
                type: "'top' | 'bottom' | 'left' | 'right'",
                default: "'bottom'",
                description: 'Placement of the panel relative to the trigger',
            },
            {
                name: 'trigger',
                type: "'click' | 'hover'",
                default: "'click'",
                description: 'Interaction that opens the panel',
            },
            {
                name: 'closeOnOutsideClick',
                type: 'boolean',
                default: 'true',
                description: 'Closes the panel when clicking outside of it',
            },
        ],
        a11yNotes: [
            'Panel is rendered with role="dialog" and a unique id',
            'Escape and outside-click both dismiss the panel when using the click trigger',
        ],
        relatedSlugs: ['tooltip', 'dropdown-menu', 'modal'],
    },
    {
        slug: 'timeline',
        title: 'Timeline',
        selector: 'zyra-timeline',
        importName: 'ZyraTimeline',
        category: 'Data Display',
        description:
            'A vertical timeline for order history, activity feeds, and audit logs, with color-coded status markers.',
        icon: waveSquare,
        accent: 'green',
        highlights: [
            'Color-coded status dots',
            'Connecting line drawn automatically',
            'Any rich content projected per entry',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraTimeline, ZyraTimelineItem } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-timeline',
  standalone: true,
  imports: [ZyraTimeline, ZyraTimelineItem],
  template: \`
    <zyra-timeline>
      <zyra-timeline-item title="Order placed" date="Jan 1, 2026" variant="success">
        Your order has been placed successfully.
      </zyra-timeline-item>
      <zyra-timeline-item title="Payment confirmed" date="Jan 2, 2026" variant="info">
        Payment was received and confirmed.
      </zyra-timeline-item>
      <zyra-timeline-item title="Delivered" date="Jan 6, 2026" variant="default">
        Package delivered to the recipient.
      </zyra-timeline-item>
    </zyra-timeline>
  \`,
})
export class DemoTimelineComponent {}
`,
        variants: [
            { name: 'default', description: 'Neutral marker for general events' },
            { name: 'success / info / warning / danger', description: 'Color-coded status markers' },
        ],
        apiProps: [
            {
                name: 'title (on item)',
                type: 'string',
                default: "''",
                description: 'Heading text for the entry',
            },
            {
                name: 'date (on item)',
                type: 'string',
                default: "''",
                description: 'Date or time label shown next to the title',
            },
            {
                name: 'variant (on item)',
                type: "'default' | 'success' | 'warning' | 'danger' | 'info'",
                default: "'default'",
                description: 'Color of the entry marker dot',
            },
        ],
        a11yNotes: ['Rendered as a plain list of entries — wrap in an ordered list context if sequence matters for assistive tech'],
        relatedSlugs: ['card', 'accordion', 'skeleton'],
    },
    {
        slug: 'header',
        title: 'Header',
        selector: 'zyra-header',
        importName: 'ZyraHeader',
        category: 'Navigation',
        description:
            'An app-shell header with brand, nav and action slots — built-in mobile drawer, scroll elevation, and sticky/fixed positioning.',
        icon: menu,
        accent: 'blue',
        highlights: [
            'Content-projection slots for brand, nav, and actions',
            'Built-in mobile menu toggle — no manual drawer wiring needed',
            'Scroll-elevation and transparent-until-scrolled styling out of the box',
            'Sticky, fixed, or static positioning',
            'Split or centered nav alignment; contained or full-width layout',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraHeader, ZyraHeaderStart, ZyraHeaderNav, ZyraHeaderEnd, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  imports: [ZyraHeader, ZyraHeaderStart, ZyraHeaderNav, ZyraHeaderEnd, ZyraButton],
  template: \`
    <zyra-header position="sticky">
      <a zyraHeaderStart href="#">Brand</a>
      <nav zyraHeaderNav>
        <a href="#">Docs</a>
        <a href="#">Blog</a>
      </nav>
      <div zyraHeaderEnd>
        <zyra-button size="sm">Get started</zyra-button>
      </div>
    </zyra-header>
  \`,
})
export class DemoHeaderComponent {}
`,
        variants: [
            { name: 'split', description: 'Brand left, nav center, actions right (default)' },
            { name: 'center', description: 'Nav visually centered between brand and actions' },
            { name: 'contained', description: 'Content constrained to a max-width, centered (default)' },
            { name: 'full-width', description: 'Content stretches edge-to-edge' },
            { name: 'sticky / fixed / static', description: 'Positioning behavior on scroll' },
            { name: 'transparent', description: 'Transparent until scrolled, then becomes opaque with elevation' },
        ],
        apiProps: [
            {
                name: 'position',
                type: "'static' | 'sticky' | 'fixed'",
                default: "'static'",
                description: 'Positioning behavior of the header',
            },
            {
                name: 'variant',
                type: "'contained' | 'full-width'",
                default: "'contained'",
                description: 'Whether the bar content is max-width constrained or edge-to-edge',
            },
            {
                name: 'align',
                type: "'split' | 'center'",
                default: "'split'",
                description: 'Layout of the start/nav/end zones',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Header height and padding density',
            },
            {
                name: 'transparent',
                type: 'boolean',
                default: 'false',
                description: 'Renders transparent until scrolled past the threshold',
            },
            {
                name: 'elevateOnScroll',
                type: 'boolean',
                default: 'true',
                description: 'Applies a shadow/border once scrollY passes scrollThreshold',
            },
            {
                name: 'scrollThreshold',
                type: 'number',
                default: '12',
                description: 'Scroll distance in pixels before elevation is applied',
            },
            {
                name: 'mobileBreakpoint',
                type: 'number',
                default: '768',
                description: 'Viewport width in pixels below which the nav collapses behind the burger menu',
            },
            {
                name: 'mobileOpenChange (output)',
                type: 'boolean',
                default: '-',
                description: 'Emits when the mobile menu is opened or closed',
            },
            {
                name: 'scrolledChange (output)',
                type: 'boolean',
                default: '-',
                description: 'Emits when the scroll-elevated state changes',
            },
            {
                name: 'zyraHeaderStart (directive)',
                type: 'attribute',
                default: '-',
                description: 'Marks projected content as the brand/logo slot',
            },
            {
                name: 'zyraHeaderNav (directive)',
                type: 'attribute',
                default: '-',
                description: 'Marks projected content as the primary nav; automatically collapses into the mobile menu',
            },
            {
                name: 'zyraHeaderEnd (directive)',
                type: 'attribute',
                default: '-',
                description: 'Marks projected content as the actions/CTA slot',
            },
            {
                name: 'zyraHeaderMobileEnd (directive)',
                type: 'attribute',
                default: '-',
                description: 'Optional extra content shown only inside the open mobile panel',
            },
        ],
        a11yNotes: [
            'Rendered as a header element with role="banner"',
            'The mobile toggle button exposes aria-expanded and an aria-label that updates between "Open" and "Close navigation menu"',
            'Escape closes the open mobile panel',
        ],
        relatedSlugs: ['sidebar', 'tabs', 'breadcrumb'],
    },
    {
        slug: 'sidebar',
        title: 'Sidebar',
        selector: 'zyra-sidebar',
        importName: 'ZyraSidebar',
        category: 'Navigation',
        description:
            'A collapsible app-shell navigation rail with header/footer slots, grouped sections, and active/disabled item states.',
        icon: panelLeft,
        accent: 'blue',
        highlights: [
            'Collapsible with a two-way collapsed model',
            'Header and footer content-projection slots',
            'Grouped sections with icons, badges, and active/disabled states',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';
import { ZyraSidebar, ZyraSidebarSection, ZyraSidebarItem } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-sidebar',
  standalone: true,
  imports: [ZyraSidebar, ZyraSidebarSection, ZyraSidebarItem],
  template: \`
    <zyra-sidebar [(collapsed)]="collapsed">
      <div sidebar-header>Zyra UI</div>
      <zyra-sidebar-section heading="General">
        <a zyra-sidebar-item [active]="true">Overview</a>
        <a zyra-sidebar-item>Projects</a>
      </zyra-sidebar-section>
    </zyra-sidebar>
  \`,
})
export class DemoSidebarComponent {
  collapsed = signal(false);
}
`,
        variants: [
            { name: 'expanded', description: 'Full width with labels visible (default)' },
            { name: 'collapsed', description: 'Icon-only rail at a reduced width' },
        ],
        apiProps: [
            {
                name: 'width',
                type: 'string',
                default: "'260px'",
                description: 'Width of the sidebar when expanded',
            },
            {
                name: 'collapsedWidth',
                type: 'string',
                default: "'72px'",
                description: 'Width of the sidebar when collapsed',
            },
            {
                name: 'collapsed (model)',
                type: 'boolean',
                default: 'false',
                description: 'Two-way collapsed state',
            },
            {
                name: 'heading (on section)',
                type: 'string',
                default: "''",
                description: 'Optional heading label for a group of items',
            },
            {
                name: 'active (on item)',
                type: 'boolean',
                default: 'false',
                description: 'Marks the item as the current page',
            },
            {
                name: 'disabled (on item)',
                type: 'boolean',
                default: 'false',
                description: 'Prevents interaction with the item',
            },
            {
                name: 'icon (on item)',
                type: 'ZyraIconData | null',
                default: 'null',
                description: 'Leading icon shown before the label',
            },
            {
                name: 'badge (on item)',
                type: 'string | number',
                default: "''",
                description: 'Trailing badge, e.g. an unread count',
            },
        ],
        a11yNotes: [
            'Sidebar items render as anchor elements with aria-current="page" when active',
            'Disabled items get aria-disabled and are removed from tab order',
            'Header and footer slots collapse to nothing in the DOM when left empty',
        ],
        relatedSlugs: ['header', 'tabs', 'breadcrumb'],
    },
] satisfies readonly UiComponentShowcaseCard[];

export const COMPONENT_COUNT = UI_COMPONENT_SHOWCASE.length;

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
