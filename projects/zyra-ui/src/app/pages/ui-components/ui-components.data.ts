import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { appIcons } from '../../shared/fontawesome-icons';

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
    icon: IconDefinition;
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
        variants: [
            { name: 'primary', description: 'High-emphasis CTA — use once per section' },
            { name: 'secondary', description: 'Medium-emphasis supporting action' },
            { name: 'outline', description: 'Bordered variant for neutral actions' },
            { name: 'ghost', description: 'Text-only for low-emphasis or toolbar actions' },
            { name: 'danger', description: 'Destructive or irreversible actions' },
        ],
        apiProps: [
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual style' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding scale' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction; adds muted styling' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner; blocks double-submit' },
            { name: 'leftIcon', type: 'IconDefinition', default: '—', description: 'Icon rendered before the label' },
            { name: 'rightIcon', type: 'IconDefinition', default: '—', description: 'Icon rendered after the label' },
        ],
        a11yNotes: [
            'Renders as a native <button> — keyboard accessible via Tab, Enter, and Space',
            'loading state sets aria-busy="true" to communicate pending status to screen readers',
            'disabled state communicates unavailability without removing focusability',
            'All variants maintain a visible 2px focus ring for keyboard navigation',
        ],
        relatedSlugs: ['badge', 'chip', 'toggle'],
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
        variants: [
            { name: 'default', description: 'Neutral label for metadata and categories' },
            { name: 'info', description: 'Blue tint for informational status' },
            { name: 'success', description: 'Green for live, active, or passing states' },
            { name: 'warning', description: 'Amber for cautionary or degraded states' },
            { name: 'danger', description: 'Red for errors, failures, or critical counts' },
        ],
        apiProps: [
            { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color and semantic meaning' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Physical size of the badge' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a live-indicator dot before the label' },
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
        icon: appIcons.square,
        accent: 'purple',
        highlights: [
            'Header and footer slots',
            'Clickable mode support',
            'Multiple visual variants',
        ],
        exampleCode: CARD_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Standard surface card with optional header and footer slots' },
            { name: 'clickable', description: 'Interactive card with hover state and pointer cursor' },
        ],
        apiProps: [
            { name: 'hasHeader', type: 'boolean', default: 'false', description: 'Enables the named header slot' },
            { name: 'hasFooter', type: 'boolean', default: 'false', description: 'Enables the named footer slot' },
            { name: 'padding', type: "'sm' | 'md' | 'lg' | 'none'", default: "'md'", description: 'Internal padding scale' },
            { name: 'clickable', type: 'boolean', default: 'false', description: 'Adds hover animation and pointer cursor' },
        ],
        a11yNotes: [
            'When clickable, wrap content in a <button> or <a> rather than relying on the card click alone',
            'Use semantic headings inside the header slot for proper document outline',
            'Avoid placing interactive elements inside a clickable card — creates nested interactives',
        ],
        relatedSlugs: ['divider', 'accordion', 'avatar'],
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
        variants: [
            { name: 'teal', description: 'Default accent-teal initials background' },
            { name: 'blue', description: 'Blue initials background' },
            { name: 'purple', description: 'Purple initials background' },
            { name: 'warm', description: 'Warm amber initials background' },
            { name: 'neutral', description: 'Neutral grey initials background' },
        ],
        apiProps: [
            { name: 'name', type: 'string', default: '—', description: 'Full name used to generate initials and aria-label' },
            { name: 'src', type: 'string', default: '—', description: 'Image URL; falls back to initials when not provided or broken' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the avatar' },
            { name: 'variant', type: "'teal' | 'blue' | 'purple' | 'warm' | 'neutral'", default: "'teal'", description: 'Background color for initials fallback' },
            { name: 'online', type: 'boolean', default: 'false', description: 'Shows a green presence indicator dot' },
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
        icon: appIcons.keyboard,
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
            { name: 'with clear button', description: 'Shows × button to clear the value' },
            { name: 'disabled', description: 'Non-interactive state with muted styling' },
            { name: 'error', description: 'Red border and error icon for invalid state' },
        ],
        apiProps: [
            { name: 'type', type: "'text' | 'email' | 'password' | 'search' | 'url' | 'number'", default: "'text'", description: 'Native input type' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font scale' },
            { name: 'placeholder', type: 'string', default: '—', description: 'Placeholder text shown when empty' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
            { name: 'value', type: 'string', default: '—', description: 'Two-way bound value via ngModel' },
        ],
        a11yNotes: [
            'Always associate an input with a visible <label> or use aria-label',
            'Pair with ZyraFormField to get proper label and hint associations automatically',
            'Error state sets aria-invalid="true"; pair with an error message element using aria-describedby',
        ],
        relatedSlugs: ['form-field', 'toggle', 'button'],
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
        variants: [
            { name: 'with label', description: 'Visible label above the field' },
            { name: 'with hint', description: 'Helper text below the field' },
            { name: 'with error', description: 'Error message replacing the hint on invalid state' },
            { name: 'with prefix icon', description: 'Icon decorating the start of the wrapped input' },
        ],
        apiProps: [
            { name: 'label', type: 'string', default: '—', description: 'Visible label text linked to the child input' },
            { name: 'hint', type: 'string', default: '—', description: 'Helper text shown below the input' },
            { name: 'error', type: 'string', default: '—', description: 'Error text; replaces hint when set' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Passes size down to child input' },
            { name: 'prefixIcon', type: 'IconDefinition', default: '—', description: 'Icon shown inside the field leading edge' },
            { name: 'clearButton', type: 'boolean', default: 'false', description: 'Shows a clear × button in the field' },
        ],
        a11yNotes: [
            'label is automatically linked to the child input via htmlFor/id pairing',
            'hint and error text are linked via aria-describedby on the input',
            'When error is set, the child input receives aria-invalid="true"',
        ],
        relatedSlugs: ['input', 'toggle', 'button'],
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
        variants: [
            { name: 'accent', description: 'Teal accent color (default brand color)' },
            { name: 'muted', description: 'Low-contrast grey for subtle loading states' },
            { name: 'white', description: 'White variant for use on dark or colored backgrounds' },
        ],
        apiProps: [
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter of the spinner' },
            { name: 'color', type: "'accent' | 'muted' | 'white'", default: "'accent'", description: 'Spinner track color' },
            { name: 'label', type: 'string', default: 'Loading…', description: 'Screen-reader-only label for accessibility' },
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
        icon: appIcons.message,
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
            { name: 'toast.success()', type: '(title, options?) => void', default: '—', description: 'Show a success toast via ZyraToastService' },
            { name: 'toast.info()', type: '(title, options?) => void', default: '—', description: 'Show an info toast' },
            { name: 'toast.warning()', type: '(title, options?) => void', default: '—', description: 'Show a warning toast' },
            { name: 'toast.error()', type: '(title, options?) => void', default: '—', description: 'Show an error toast' },
            { name: 'options.description', type: 'string', default: '—', description: 'Secondary body text below the title' },
            { name: 'options.duration', type: 'number', default: '4000', description: 'Auto-dismiss delay in milliseconds' },
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
        icon: appIcons.circleInfo,
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
            { name: 'text', type: 'string', default: '—', description: 'Tooltip label text' },
            { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred placement relative to the trigger' },
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
        icon: appIcons.square,
        accent: 'purple',
        highlights: [
            'Focus trap and ESC key support',
            'Backdrop click to dismiss',
            'Four sizes with smooth animation',
        ],
        exampleCode: `import { Component, signal } from '@angular/core';\nimport { ZyraModal, ZyraButton } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraModal, ZyraButton],\n  template: \`\n    <zyra-button (clicked)="open.set(true)">Open</zyra-button>\n    <zyra-modal [(open)]="open" title="Hello">\n      <p>Modal content here.</p>\n      <div slot="footer" class="zyr-modal__footer">\n        <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>\n        <zyra-button variant="primary" (clicked)="open.set(false)">Confirm</zyra-button>\n      </div>\n    </zyra-modal>\n  \`,\n})\nexport class DemoComponent {\n  open = signal(false);\n}`,
        variants: [
            { name: 'sm', description: 'Compact dialog for quick confirmations (400px)' },
            { name: 'md', description: 'Default size for forms and confirmations (560px)' },
            { name: 'lg', description: 'Wider panel for complex content (720px)' },
            { name: 'xl', description: 'Full-featured dialog for rich editing (900px)' },
        ],
        apiProps: [
            { name: 'open', type: 'boolean', default: 'false', description: 'Two-way bound visibility state via [(open)]' },
            { name: 'title', type: 'string', default: '—', description: 'Dialog heading displayed in the header' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Maximum width of the dialog panel' },
            { name: 'closeable', type: 'boolean', default: 'true', description: 'Shows a close × button in the header' },
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
        icon: appIcons.triangleExclamation,
        accent: 'amber',
        highlights: [
            'Four semantic variants',
            'Optional title and dismiss',
            'Accessible role="alert"',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraAlert } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraAlert],\n  template: \`\n    <zyra-alert\n      variant="success"\n      title="Saved"\n      [dismissible]="true"\n    >\n      Your changes have been saved.\n    </zyra-alert>\n  \`,\n})\nexport class DemoComponent {}`,
        variants: [
            { name: 'success', description: 'Confirmation or completed action (green)' },
            { name: 'info', description: 'Informational context or tips (blue)' },
            { name: 'warning', description: 'Cautionary message requiring attention (amber)' },
            { name: 'danger', description: 'Error or destructive state notice (red)' },
        ],
        apiProps: [
            { name: 'variant', type: "'success' | 'info' | 'warning' | 'danger'", default: "'info'", description: 'Semantic color and icon' },
            { name: 'title', type: 'string', default: '—', description: 'Bold heading above the message body' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close × button' },
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
        icon: appIcons.certificate,
        accent: 'purple',
        highlights: [
            'Dismissible with × button',
            'Selectable with toggle state',
            'All semantic variants',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraChip } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraChip],\n  template: \`\n    <zyra-chip variant="info" [dismissible]="true">\n      Angular\n    </zyra-chip>\n  \`,\n})\nexport class DemoComponent {}`,
        variants: [
            { name: 'default', description: 'Neutral chip for categories and plain tags' },
            { name: 'info', description: 'Blue tint for informational labels' },
            { name: 'success', description: 'Green for active or passing filter states' },
            { name: 'warning', description: 'Amber for caution tags' },
            { name: 'danger', description: 'Red for error or blocking tags' },
        ],
        apiProps: [
            { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color and semantic meaning' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a × button to remove the chip' },
            { name: 'selectable', type: 'boolean', default: 'false', description: 'Enables toggle-selection state' },
            { name: 'selected', type: 'boolean', default: 'false', description: 'Current selected state (two-way bindable)' },
        ],
        a11yNotes: [
            'Dismissible chips include a visually-hidden "Remove" label on the × button',
            'Selectable chips use aria-pressed to communicate toggle state',
            'Use a group element with role="group" and an aria-label when listing multiple chips',
        ],
        relatedSlugs: ['badge', 'button', 'alert'],
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
        variants: [
            { name: 'sm', description: 'Small switch for dense settings panels' },
            { name: 'md', description: 'Default size for most form layouts' },
            { name: 'lg', description: 'Large switch for prominent feature toggles' },
        ],
        apiProps: [
            { name: 'checked', type: 'boolean', default: 'false', description: 'Current on/off state; two-way bindable via [(checked)]' },
            { name: 'label', type: 'string', default: '—', description: 'Visible text label associated with the switch' },
            { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Side the label renders relative to the pill' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Physical size of the pill' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
        ],
        a11yNotes: [
            'Renders with role="switch" and aria-checked to communicate on/off state',
            'label is linked via aria-labelledby — always provide a label for screen readers',
            'Keyboard-operable via Space to toggle and Tab to focus',
        ],
        relatedSlugs: ['input', 'form-field', 'button'],
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
        variants: [
            { name: 'default', description: 'Accent-colored bar for general usage' },
            { name: 'success', description: 'Green bar for completed or healthy states' },
            { name: 'warning', description: 'Amber bar for near-limit states' },
            { name: 'danger', description: 'Red bar for critical or over-limit states' },
            { name: 'indeterminate', description: 'Animated bar for unknown duration loading' },
        ],
        apiProps: [
            { name: 'value', type: 'number', default: '0', description: 'Current progress value (0–max)' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
            { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Track fill color' },
            { name: 'showLabel', type: 'boolean', default: 'false', description: 'Shows the percentage above the bar' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Animates the bar for unknown-duration loading' },
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
        icon: appIcons.scaleBalanced,
        accent: 'teal',
        highlights: [
            'Horizontal and vertical modes',
            'Optional centered label',
            'Solid, dashed, and dotted styles',
        ],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraDivider } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraDivider],\n  template: \`\n    <zyra-divider label="or" />\n  \`,\n})\nexport class DemoComponent {}`,
        variants: [
            { name: 'solid', description: 'Default solid 1px line' },
            { name: 'dashed', description: 'Dashed line for softer separation' },
            { name: 'dotted', description: 'Dotted line for subtle dividers' },
            { name: 'vertical', description: 'Vertical orientation for inline layouts' },
        ],
        apiProps: [
            { name: 'label', type: 'string', default: '—', description: 'Optional centered text label (e.g. "or")' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Line direction' },
            { name: 'style', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'Line stroke style' },
        ],
        a11yNotes: [
            'Renders with role="separator" for screen reader context',
            'Vertical dividers should have aria-orientation="vertical"',
            'When used decoratively, add aria-hidden="true"',
        ],
        relatedSlugs: ['card', 'accordion', 'form-field'],
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
        variants: [
            { name: 'single', description: 'Only one item can be open at a time' },
            { name: 'multiple', description: 'Multiple items can be expanded simultaneously' },
        ],
        apiProps: [
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open simultaneously' },
            { name: 'title (on item)', type: 'string', default: '—', description: 'Trigger text for each accordion item' },
            { name: 'expanded (on item)', type: 'boolean', default: 'false', description: 'Initial open state of an item' },
            { name: 'disabled (on item)', type: 'boolean', default: 'false', description: 'Prevents an item from being opened' },
        ],
        a11yNotes: [
            'Accordion headers use role="button" with aria-expanded for open/closed state',
            'Content panels are linked to their headers via aria-controls / aria-labelledby',
            'Keyboard: Enter/Space toggles item; Tab moves to next focusable element',
            'Animation uses CSS grid — respects prefers-reduced-motion',
        ],
        relatedSlugs: ['card', 'divider', 'modal'],
    },
] satisfies readonly UiComponentShowcaseCard[];

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
