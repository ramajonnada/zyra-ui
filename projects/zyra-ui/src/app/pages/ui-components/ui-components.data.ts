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
            { name: 'primary', description: 'High-emphasis CTA - use once per section' },
            { name: 'secondary', description: 'Medium-emphasis supporting action' },
            { name: 'outline', description: 'Bordered variant for neutral actions' },
            { name: 'ghost', description: 'Text-only for low-emphasis or toolbar actions' },
            { name: 'danger', description: 'Destructive or irreversible actions' },
        ],
        apiProps: [
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual style' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding scale' },
            { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type attribute' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction; adds muted styling' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner; blocks double-submit' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the button to fill its container' },
            { name: 'iconLeft', type: 'ZyraIcon', default: 'null', description: 'Icon rendered before the label' },
            { name: 'iconRight', type: 'ZyraIcon', default: 'null', description: 'Icon rendered after the label' },
            { name: 'aria-label', type: 'string | null', default: 'null', description: 'Accessible label for icon-only buttons' },
            { name: 'clicked (output)', type: 'MouseEvent', default: '-', description: 'Emits on click when not disabled or loading' },
        ],
        a11yNotes: [
            'Renders as a native <button> - keyboard accessible via Tab, Enter, and Space',
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
            { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'purple'", default: "'default'", description: 'Color and semantic meaning' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Physical size of the badge' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a live-indicator dot before the label' },
            { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label for screen readers when badge has no visible context' },
        ],
        a11yNotes: [
            'Presentational by default - no role is needed unless used as a live indicator',
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
            { name: 'default', description: 'Standard flat surface card' },
            { name: 'outlined', description: 'Bordered card with no background shadow' },
            { name: 'elevated', description: 'Card with drop shadow for depth' },
            { name: 'ghost', description: 'Transparent background, subtle hover fill' },
            { name: 'clickable', description: 'Any variant with [clickable]="true" â€” emits cardClick on press' },
        ],
        apiProps: [
            { name: 'variant', type: "'default' | 'outlined' | 'elevated' | 'ghost'", default: "'default'", description: 'Visual style of the card surface' },
            { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Internal padding scale' },
            { name: 'clickable', type: 'boolean', default: 'false', description: 'Adds hover animation and pointer cursor' },
            { name: 'hasHeader', type: 'boolean', default: 'false', description: 'Enables the named header slot' },
            { name: 'hasFooter', type: 'boolean', default: 'false', description: 'Enables the named footer slot' },
            { name: 'cardClick (output)', type: 'void', default: '-', description: 'Emits when a clickable card is pressed' },
        ],
        a11yNotes: [
            'When clickable, wrap content in a <button> or <a> rather than relying on the card click alone',
            'Use semantic headings inside the header slot for proper document outline',
            'Avoid placing interactive elements inside a clickable card - creates nested interactives',
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
            { name: 'name', type: 'string', default: "''", description: 'Full name used to generate initials and aria-label' },
            { name: 'src', type: 'string', default: "''", description: 'Image URL; falls back to initials when not provided or broken' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the avatar' },
            { name: 'variant', type: "'teal' | 'blue' | 'purple' | 'warm' | 'neutral'", default: "'teal'", description: 'Background color for initials fallback' },
            { name: 'square', type: 'boolean', default: 'false', description: 'Renders as a rounded-corner square instead of a circle' },
            { name: 'online', type: 'boolean | null', default: 'null', description: 'Shows a green presence dot (true) or hides it (null/false)' },
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
            { name: 'with clear button', description: 'Shows x button to clear the value' },
            { name: 'disabled', description: 'Non-interactive state with muted styling' },
            { name: 'error', description: 'Red border and error icon for invalid state' },
        ],
        apiProps: [
            { name: 'type', type: "'text' | 'email' | 'password' | 'search' | 'url' | 'number'", default: "'text'", description: 'Native input type' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font scale' },
            { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown when empty' },
            { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the field non-editable but still focusable' },
            { name: 'id', type: 'string', default: "''", description: 'Override the auto-generated id on the native input' },
            { name: 'maxlength', type: 'number | null', default: 'null', description: 'Native maxlength constraint' },
            { name: 'min', type: 'number | null', default: 'null', description: 'Minimum value (number inputs)' },
            { name: 'max', type: 'number | null', default: 'null', description: 'Maximum value (number inputs)' },
            { name: 'valueChange (output)', type: 'string', default: '-', description: 'Emits the current string value on every keystroke' },
            { name: 'focused (output)', type: 'void', default: '-', description: 'Emits when the input gains focus' },
            { name: 'blurred (output)', type: 'void', default: '-', description: 'Emits when the input loses focus' },
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
            { name: 'label', type: 'string', default: "''", description: 'Visible label text linked to the child input' },
            { name: 'hint', type: 'string', default: "''", description: 'Helper text shown below the input' },
            { name: 'successHint', type: 'string', default: "''", description: 'Success message shown below the field (green)' },
            { name: 'appearance', type: "'outline' | 'filled' | 'underline'", default: "'outline'", description: 'Visual style of the field border' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Passes size down to child input' },
            { name: 'prefixIcon', type: 'ZyraIcon', default: "''", description: 'Icon shown inside the leading edge of the field' },
            { name: 'suffixIcon', type: 'ZyraIcon', default: "''", description: 'Icon shown inside the trailing edge of the field' },
            { name: 'maxLength', type: 'number | null', default: 'null', description: 'Shows a character counter below the field' },
            { name: 'clearButton', type: 'boolean', default: 'false', description: 'Adds a clear Ã— button inside the trailing edge' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner in the trailing edge' },
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
            { name: 'accent-2', description: 'Secondary accent color' },
            { name: 'white', description: 'White variant for use on dark or colored backgrounds' },
            { name: 'current', description: 'Inherits the current text color â€” works on any background' },
        ],
        apiProps: [
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter of the spinner' },
            { name: 'color', type: "'accent' | 'accent-2' | 'white' | 'current'", default: "'accent'", description: 'Spinner track color' },
            { name: 'label', type: 'string', default: "'Loadingâ€¦'", description: 'Screen-reader-only label for accessibility' },
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
            { name: 'toast.success()', type: '(title, options?) => void', default: '-', description: 'Show a success toast via ZyraToastService' },
            { name: 'toast.info()', type: '(title, options?) => void', default: '-', description: 'Show an info toast' },
            { name: 'toast.warning()', type: '(title, options?) => void', default: '-', description: 'Show a warning toast' },
            { name: 'toast.error()', type: '(title, options?) => void', default: '-', description: 'Show an error toast' },
            { name: 'options.description', type: 'string', default: '-', description: 'Secondary body text below the title' },
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
            { name: 'text', type: 'string', default: "''", description: 'Tooltip label text' },
            { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred placement relative to the trigger' },
            { name: 'maxWidth', type: 'string', default: "'200px'", description: 'CSS max-width of the tooltip bubble' },
        ],
        a11yNotes: [
            'Tooltip is linked to its trigger via aria-describedby for screen reader announcement',
            'Tooltip renders with role="tooltip" - the trigger element must be focusable',
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
            { name: 'title', type: 'string', default: "''", description: 'Dialog heading displayed in the header' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Maximum width of the dialog panel' },
            { name: 'dismissible', type: 'boolean', default: 'true', description: 'Shows a close Ã— button and allows ESC / backdrop click to close' },
            { name: 'closed (output)', type: 'void', default: '-', description: 'Emits after the modal finishes closing' },
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
            { name: 'title', type: 'string', default: '-', description: 'Bold heading above the message body' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close x button' },
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
            'Compact interactive labels for filters, tags, and selections - supports dismissible and selectable modes.',
        icon: appIcons.certificate,
        accent: 'purple',
        highlights: [
            'Dismissible with x button',
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
            { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'purple'", default: "'default'", description: 'Color and semantic meaning' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Physical size of the chip' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a Ã— button to remove the chip' },
            { name: 'selectable', type: 'boolean', default: 'false', description: 'Enables toggle-selection state' },
            { name: 'selected', type: 'boolean', default: 'false', description: 'Current selected state (two-way bindable)' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
            { name: 'dismissed (output)', type: 'void', default: '-', description: 'Emits when the Ã— button is clicked' },
            { name: 'selectedChange (output)', type: 'boolean', default: '-', description: 'Emits the new selected state when toggled' },
        ],
        a11yNotes: [
            'Dismissible chips include a visually-hidden "Remove" label on the x button',
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
            { name: 'label', type: 'string', default: "''", description: 'Visible text label associated with the switch' },
            { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Side the label renders relative to the pill' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Physical size of the pill' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
            { name: 'changed (output)', type: 'boolean', default: '-', description: 'Emits the new checked value whenever the toggle changes' },
        ],
        a11yNotes: [
            'Renders with role="switch" and aria-checked to communicate on/off state',
            'label is linked via aria-labelledby - always provide a label for screen readers',
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
            { name: 'info', description: 'Blue bar for informational progress' },
            { name: 'success', description: 'Green bar for completed or healthy states' },
            { name: 'warning', description: 'Amber bar for near-limit states' },
            { name: 'danger', description: 'Red bar for critical or over-limit states' },
            { name: 'indeterminate', description: 'Animated bar for unknown duration loading' },
        ],
        apiProps: [
            { name: 'value', type: 'number', default: '0', description: 'Current progress value (0â€“max)' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
            { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Track fill color' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress bar' },
            { name: 'showLabel', type: 'boolean', default: 'false', description: 'Shows the percentage above the bar' },
            { name: 'label', type: 'string', default: "''", description: 'Custom label text shown instead of the auto percentage' },
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
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Line direction' },
            { name: 'variant', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'Line stroke style' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment of the optional label along the line' },
            { name: 'label', type: 'string', default: "''", description: 'Optional text label centered on the divider (e.g. "or")' },
            { name: 'width', type: 'string', default: "'1px'", description: 'CSS thickness of the divider line (e.g. "2px")' },
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
            'Custom dropdown select for choosing from a list of options â€” fully keyboard accessible with smooth open/close animation.',
        icon: appIcons.alignLeft,
        accent: 'teal',
        highlights: [
            'Works with Angular forms (CVA)',
            'Keyboard navigation built in',
            'Three appearances and sizes',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraSelect, ZyraOption } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo',
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
export class DemoComponent {
  framework: string | null = null;
}`,
        variants: [
            { name: 'outline', description: 'Default bordered appearance matching ZyraInput outline' },
            { name: 'filled', description: 'Filled background with bottom border only' },
            { name: 'underline', description: 'Minimal underline-only border' },
        ],
        apiProps: [
            { name: 'placeholder', type: 'string', default: "'Select an option'", description: 'Text shown when no value is selected' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font scale' },
            { name: 'appearance', type: "'outline' | 'filled' | 'underline'", default: "'outline'", description: 'Visual style of the trigger' },
            { name: 'value (on option)', type: 'string | number | null', default: '-', description: 'The value emitted when the option is selected' },
            { name: 'disabled (on option)', type: 'boolean', default: 'false', description: 'Prevents an option from being selected' },
        ],
        a11yNotes: [
            'Trigger uses aria-haspopup="listbox" and aria-expanded to communicate state',
            'Panel uses role="listbox"; options use role="option" with aria-selected',
            'aria-activedescendant on the trigger tracks the keyboard-highlighted option',
            'Arrow keys navigate options; Enter/Space selects; Escape closes; Tab dismisses',
            'Disabled options are marked aria-disabled and skipped by keyboard navigation',
        ],
        relatedSlugs: ['input', 'form-field', 'toggle'],
    },
    {
        slug: 'textarea',
        title: 'Textarea',
        selector: 'zyra-textarea',
        importName: 'ZyraTextarea',
        category: 'Forms',
        description: 'Multi-line text input with auto-resize, size variants, and full ZyraFormField integration for labels and validation.',
        icon: appIcons.alignLeft,
        accent: 'amber',
        highlights: ['Auto-resize mode', 'Works inside ZyraFormField', 'Character counter support'],
        exampleCode: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { ZyraFormField, ZyraTextarea } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [FormsModule, ZyraFormField, ZyraTextarea],\n  template: \`\n    <zyra-form-field label="Bio" hint="Max 200 characters">\n      <zyra-textarea\n        [(ngModel)]="bio"\n        placeholder="Tell us about yourself..."\n        [rows]="4"\n        resize="auto"\n      />\n    </zyra-form-field>\n  \`,\n})\nexport class DemoComponent {\n  bio = '';\n}`,
        variants: [
            { name: 'vertical resize', description: 'User can drag to resize vertically (default)' },
            { name: 'auto resize', description: 'Expands automatically as content grows' },
            { name: 'no resize', description: 'Fixed height, no resize handle' },
        ],
        apiProps: [
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Font and spacing scale' },
            { name: 'rows', type: 'number', default: '3', description: 'Initial visible rows' },
            { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text' },
            { name: 'resize', type: "'none' | 'vertical' | 'auto'", default: "'vertical'", description: 'Resize behaviour' },
            { name: 'maxlength', type: 'number', default: 'null', description: 'Native maxlength attribute' },
            { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the textarea read-only' },
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
        description: 'Accessible checkbox with indeterminate state, label positioning, three sizes, and full Angular forms support.',
        icon: appIcons.check,
        accent: 'teal',
        highlights: ['Indeterminate state', 'Works with reactive forms', 'Three sizes'],
        exampleCode: `import { Component, signal } from '@angular/core';\nimport { ZyraCheckbox } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraCheckbox],\n  template: \`\n    <zyra-checkbox\n      [(checked)]="agreed"\n      label="I agree to the terms and conditions"\n    />\n  \`,\n})\nexport class DemoComponent {\n  agreed = signal(false);\n}`,
        variants: [
            { name: 'unchecked', description: 'Default empty state' },
            { name: 'checked', description: 'Selected state with accent fill' },
            { name: 'indeterminate', description: 'Partial selection â€” dash icon in accent fill' },
            { name: 'disabled', description: 'Non-interactive at 45% opacity' },
        ],
        apiProps: [
            { name: 'checked', type: 'boolean', default: 'false', description: 'Two-way bindable checked state via [(checked)]' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the checkbox box and label' },
            { name: 'label', type: 'string', default: "''", description: 'Visible label text' },
            { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Side the label renders on' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows dash icon for partial selection' },
        ],
        a11yNotes: [
            'Uses role="checkbox" on the interactive button with aria-checked',
            'Indeterminate state sets aria-checked="mixed"',
            'Keyboard: Space or Enter to toggle; Tab to focus',
        ],
        relatedSlugs: ['toggle', 'radio', 'form-field'],
    },
    {
        slug: 'radio',
        title: 'Radio Group',
        selector: 'zyra-radio-group',
        importName: 'ZyraRadioGroup',
        category: 'Forms',
        description: 'Accessible radio button group for mutually exclusive choices â€” vertical or horizontal layout, arrow key navigation.',
        icon: appIcons.circleInfo,
        accent: 'blue',
        highlights: ['Arrow key navigation', 'Vertical and horizontal', 'Works with reactive forms'],
        exampleCode: `import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { ZyraRadioGroup, ZyraRadio } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [FormsModule, ZyraRadioGroup, ZyraRadio],\n  template: \`\n    <zyra-radio-group [(ngModel)]="plan">\n      <zyra-radio value="free"  label="Free" />\n      <zyra-radio value="pro"   label="Pro" />\n      <zyra-radio value="team"  label="Team" />\n    </zyra-radio-group>\n  \`,\n})\nexport class DemoComponent {\n  plan = signal('free');\n}`,
        variants: [
            { name: 'vertical', description: 'Stacked layout (default)' },
            { name: 'horizontal', description: 'Side-by-side layout' },
            { name: 'disabled group', description: 'Entire group non-interactive' },
            { name: 'disabled option', description: 'Single option non-interactive' },
        ],
        apiProps: [
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction of the radio options' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire group' },
            { name: 'label', type: 'string', default: "''", description: 'aria-label for the radiogroup role' },
            { name: 'value (on radio)', type: 'string | number', default: '-', description: 'Value emitted when this radio is selected' },
            { name: 'disabled (on radio)', type: 'boolean', default: 'false', description: 'Disables a single radio option' },
        ],
        a11yNotes: [
            'Group uses role="radiogroup"; each option uses role="radio" with aria-checked',
            'Arrow keys navigate between options within the group',
            'Tab moves focus to the selected radio (or first if none selected)',
        ],
        relatedSlugs: ['checkbox', 'toggle', 'select'],
    },
    {
        slug: 'tabs',
        title: 'Tabs',
        selector: 'zyra-tabs',
        importName: 'ZyraTabs',
        category: 'Navigation',
        description: 'Tab navigation with 4 style variants, 3 sizes, icons, badges, closeable tabs, vertical orientation, and full keyboard support.',
        icon: appIcons.swatchbook,
        accent: 'purple',
        highlights: ['4 style variants (underline, pill, filled, outlined)', 'Icons, badges, and closeable tabs', 'Vertical orientation support', 'Directional slide panel transition', 'Lazy panel rendering', 'Arrow key + Delete navigation'],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraTabs, ZyraTab } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraTabs, ZyraTab],\n  template: \`\n    <zyra-tabs variant="pill">\n      <zyra-tab label="Overview">\n        <p>Overview content here.</p>\n      </zyra-tab>\n      <zyra-tab label="Details">\n        <p>Details content here.</p>\n      </zyra-tab>\n    </zyra-tabs>\n  \`,\n})\nexport class DemoComponent {}`,
        variants: [
            { name: 'underline', description: 'Active tab shows a 2px accent underline (default)' },
            { name: 'pill', description: 'Active tab gets an elevated pill background' },
            { name: 'filled', description: 'Active trigger fills with accent color' },
            { name: 'outlined', description: 'Active trigger has a border, connects to panel below' },
            { name: 'vertical', description: 'Tabs stacked on the left with a right-edge accent indicator' },
            { name: 'icon', description: 'Optional emoji or glyph rendered before the label' },
            { name: 'badge', description: 'Count pill shown after the label; highlights when tab is active' },
            { name: 'closeable', description: 'Adds an Ã— button; Tab auto-advances when the active one is closed' },
            { name: 'disabled tab', description: 'Non-interactive tab, visually dimmed and skipped by arrow keys' },
        ],
        apiProps: [
            // zyra-tabs inputs
            { name: 'variant', type: "'underline' | 'pill' | 'filled' | 'outlined'", default: "'underline'", description: 'Visual style of the tab list' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger padding and font size' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Stacks tabs vertically on the left when set to vertical' },
            // zyra-tabs outputs
            { name: 'tabChange', type: 'string (output)', default: '-', description: 'Emits the activated tab\'s tabId (or auto-generated uid)' },
            { name: 'tabClose', type: 'string (output)', default: '-', description: 'Emits the closed tab\'s tabId when a closeable tab is dismissed' },
            // zyra-tab inputs
            { name: 'label', type: 'string', default: '-', description: '(on zyra-tab) Text shown in the trigger button â€” required' },
            { name: 'icon', type: 'string', default: "''", description: '(on zyra-tab) Emoji or glyph rendered before the label' },
            { name: 'badge', type: 'string | number', default: "''", description: '(on zyra-tab) Count shown after the label; accent-highlighted when active' },
            { name: 'closeable', type: 'boolean', default: 'false', description: '(on zyra-tab) Shows Ã— button; Delete/Backspace also closes the focused tab' },
            { name: 'tabId', type: 'string', default: 'auto-generated', description: '(on zyra-tab) Optional ID emitted on tabChange / tabClose outputs' },
            { name: 'disabled', type: 'boolean', default: 'false', description: '(on zyra-tab) Prevents activation; skipped by keyboard navigation' },
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
        description: 'Shimmer loading placeholders with 20+ preset layout variants â€” from simple text lines and shapes to full dashboard, product, calendar, and chat skeletons.',
        icon: appIcons.spinner,
        accent: 'green',
        highlights: ['20+ preset layout patterns', 'Primitive shapes: text, circle, rect, rounded', 'Compound layouts: card, list, article, table, chat, dashboard, video, chart, product, profile, calendar', 'Disable animation for static use'],
        exampleCode: `import { Component } from '@angular/core';\nimport { ZyraSkeleton } from 'zyra-ng-ui';\n\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  imports: [ZyraSkeleton],\n  template: \`\n    <zyra-skeleton variant="profile" />\n    <zyra-skeleton variant="card" />\n    <zyra-skeleton variant="list" [rows]="3" />\n  \`,\n})\nexport class DemoComponent {}`,
        variants: [
            { name: 'text', description: 'Single or multi-line text placeholder; last line is shorter' },
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
            { name: 'static', description: 'Any variant with [animated]="false" â€” no shimmer' },
        ],
        apiProps: [
            { name: 'variant', type: "'text' | 'circle' | 'rect' | 'rounded' | 'avatar' | 'image' | 'button' | 'input' | 'card' | 'list' | 'article' | 'table' | 'chat' | 'dashboard' | 'video' | 'chart' | 'product' | 'profile' | 'calendar'", default: "'rect'", description: 'Skeleton shape or preset layout' },
            { name: 'lines', type: 'number', default: '3', description: 'Number of text lines (text and article variants)' },
            { name: 'rows', type: 'number', default: '5', description: 'Number of repeated rows (list and table variants)' },
            { name: 'width', type: 'string', default: "''", description: 'CSS width override (e.g. "120px", "60%")' },
            { name: 'height', type: 'string', default: "''", description: 'CSS height override' },
            { name: 'animated', type: 'boolean', default: 'true', description: 'Enable/disable the shimmer animation' },
        ],
        a11yNotes: [
            'Skeleton is purely decorative â€” wrap in an aria-busy="true" container while loading',
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
            { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allow multiple items open simultaneously' },
            { name: 'title (on item)', type: 'string', default: '-', description: 'Trigger text for each accordion item' },
            { name: 'expanded (on item)', type: 'boolean', default: 'false', description: 'Initial open state of an item' },
            { name: 'disabled (on item)', type: 'boolean', default: 'false', description: 'Prevents an item from being opened' },
        ],
        a11yNotes: [
            'Accordion headers use role="button" with aria-expanded for open/closed state',
            'Content panels are linked to their headers via aria-controls / aria-labelledby',
            'Keyboard: Enter/Space toggles item; Tab moves to next focusable element',
            'Animation uses CSS grid - respects prefers-reduced-motion',
        ],
        relatedSlugs: ['card', 'divider', 'modal'],
    },
] satisfies readonly UiComponentShowcaseCard[];

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
