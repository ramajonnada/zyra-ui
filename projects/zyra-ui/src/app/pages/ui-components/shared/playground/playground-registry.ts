import { PlaygroundConfig } from './playground-config';
import { AccordionRenderer } from './renderers/accordion-renderer';
import { AlertRenderer } from './renderers/alert-renderer';
import { AvatarRenderer } from './renderers/avatar-renderer';
import { BadgeRenderer } from './renderers/badge-renderer';
import { ButtonRenderer } from './renderers/button-renderer';
import { CardRenderer } from './renderers/card-renderer';
import { CheckboxRenderer } from './renderers/checkbox-renderer';
import { ChipRenderer } from './renderers/chip-renderer';
import { DividerRenderer } from './renderers/divider-renderer';
import { FormFieldRenderer } from './renderers/form-field-renderer';
import { InputRenderer } from './renderers/input-renderer';
import { ModalRenderer } from './renderers/modal-renderer';
import { ProgressRenderer } from './renderers/progress-renderer';
import { RadioRenderer } from './renderers/radio-renderer';
import { SelectRenderer } from './renderers/select-renderer';
import { SkeletonRenderer } from './renderers/skeleton-renderer';
import { SpinnerRenderer } from './renderers/spinner-renderer';
import { TabsRenderer } from './renderers/tabs-renderer';
import { TextareaRenderer } from './renderers/textarea-renderer';
import { ToastRenderer } from './renderers/toast-renderer';
import { ToggleRenderer } from './renderers/toggle-renderer';
import { TooltipRenderer } from './renderers/tooltip-renderer';

export const PLAYGROUND_REGISTRY: Record<string, PlaygroundConfig> = {
    // â”€â”€ Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    button: {
        renderer: ButtonRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['primary', 'secondary', 'ghost', 'outline', 'danger'],
                defaultValue: 'primary',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'toggle',
                key: 'loading',
                label: 'states',
                toggleLabel: 'loading',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: '',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'fullWidth',
                label: '',
                toggleLabel: 'fullWidth',
                defaultValue: false,
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Button textâ€¦',
                defaultValue: 'Button',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'primary') a.push(`  variant="${s['variant']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['loading']) a.push(`  [loading]="true"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            if (s['fullWidth']) a.push(`  [fullWidth]="true"`);
            return (
                (a.length ? `<zyra-button\n${a.join('\n')}\n>` : `<zyra-button>`) +
                `\n  ${s['label'] || 'Button'}\n</zyra-button>`
            );
        },
    },

    // â”€â”€ Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    badge: {
        renderer: BadgeRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['success', 'warning', 'danger', 'info', 'purple', 'default'],
                defaultValue: 'success',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'toggle',
                key: 'dot',
                label: 'states',
                toggleLabel: 'dot',
                defaultValue: false,
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Badge textâ€¦',
                defaultValue: 'Badge',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'default') a.push(`  variant="${s['variant']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['dot']) a.push(`  [dot]="true"`);
            return (
                (a.length ? `<zyra-badge\n${a.join('\n')}\n>` : `<zyra-badge>`) +
                `\n  ${s['label'] || 'Badge'}\n</zyra-badge>`
            );
        },
    },

    // â”€â”€ Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    card: {
        renderer: CardRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['default', 'outlined', 'elevated', 'ghost'],
                defaultValue: 'default',
            },
            {
                type: 'button-group',
                key: 'padding',
                label: 'padding',
                options: ['none', 'sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'toggle',
                key: 'clickable',
                label: 'states',
                toggleLabel: 'clickable',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'hasHeader',
                label: '',
                toggleLabel: 'hasHeader',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'hasFooter',
                label: '',
                toggleLabel: 'hasFooter',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'default') a.push(`  variant="${s['variant']}"`);
            if (s['padding'] !== 'md') a.push(`  padding="${s['padding']}"`);
            if (s['clickable']) a.push(`  [clickable]="true"`);
            if (s['hasHeader']) a.push(`  [hasHeader]="true"`);
            if (s['hasFooter']) a.push(`  [hasFooter]="true"`);
            const open = a.length ? `<zyra-card\n${a.join('\n')}\n>` : `<zyra-card>`;
            const header = s['hasHeader'] ? `\n  <div slot="header"><!-- header --></div>` : '';
            const footer = s['hasFooter'] ? `\n  <div slot="footer"><!-- footer --></div>` : '';
            return `${open}${header}\n  <!-- body content -->${footer}\n</zyra-card>`;
        },
    },

    // â”€â”€ Avatar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    avatar: {
        renderer: AvatarRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['xs', 'sm', 'md', 'lg', 'xl'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['teal', 'blue', 'purple', 'warm', 'neutral'],
                defaultValue: 'teal',
            },
            {
                type: 'toggle',
                key: 'square',
                label: 'shape',
                toggleLabel: 'square',
                defaultValue: false,
            },
            {
                type: 'text',
                key: 'name',
                label: 'name',
                placeholder: 'Full nameâ€¦',
                defaultValue: 'Dev Zyra',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  name="${s['name']}"`];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['variant'] !== 'teal') a.push(`  variant="${s['variant']}"`);
            if (s['square']) a.push(`  [square]="true"`);
            return `<zyra-avatar\n${a.join('\n')}\n/>`;
        },
    },

    // â”€â”€ Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    input: {
        renderer: InputRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'type',
                label: 'type',
                options: ['text', 'email', 'password', 'number', 'search'],
                defaultValue: 'text',
            },
            {
                type: 'button-group',
                key: 'appearance',
                label: 'appearance',
                options: ['outline', 'filled', 'underline'],
                defaultValue: 'outline',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'text',
                key: 'hint',
                label: 'hint',
                placeholder: 'Hint textâ€¦',
                defaultValue: 'This is a hint',
            },
            {
                type: 'toggle',
                key: 'clearButton',
                label: 'features',
                toggleLabel: 'clearButton',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'loading',
                label: '',
                toggleLabel: 'loading',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const ff: string[] = [];
            if (s['appearance'] !== 'outline') ff.push(`  appearance="${s['appearance']}"`);
            if (s['size'] !== 'md') ff.push(`  size="${s['size']}"`);
            if (s['hint']) ff.push(`  hint="${s['hint']}"`);
            const inp: string[] = [];
            if (s['type'] !== 'text') inp.push(`    type="${s['type']}"`);
            if (s['clearButton']) inp.push(`    [clearButton]="true"`);
            if (s['loading']) inp.push(`    [loading]="true"`);
            const ffOpen = ff.length
                ? `<zyra-form-field label="Label"\n${ff.join('\n')}\n>`
                : `<zyra-form-field label="Label">`;
            const inpTag = inp.length
                ? `  <zyra-input\n${inp.join('\n')}\n  />`
                : `  <zyra-input />`;
            return `${ffOpen}\n${inpTag}\n</zyra-form-field>`;
        },
    },

    // â”€â”€ Chip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    chip: {
        renderer: ChipRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['default', 'success', 'warning', 'danger', 'info', 'purple'],
                defaultValue: 'default',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Chip labelâ€¦',
                defaultValue: 'Frontend',
            },
            {
                type: 'toggle',
                key: 'dismissible',
                label: 'states',
                toggleLabel: 'dismissible',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: '',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'default') a.push(`  variant="${s['variant']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['dismissible']) a.push(`  [dismissible]="true"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return (
                (a.length ? `<zyra-chip\n${a.join('\n')}\n>` : `<zyra-chip>`) +
                `\n  ${s['label'] || 'Chip'}\n</zyra-chip>`
            );
        },
    },

    // â”€â”€ Alert â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    alert: {
        renderer: AlertRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['info', 'success', 'warning', 'danger'],
                defaultValue: 'info',
            },
            {
                type: 'text',
                key: 'title',
                label: 'title',
                placeholder: 'Alert titleâ€¦',
                defaultValue: 'Heads up',
            },
            {
                type: 'toggle',
                key: 'dismissible',
                label: 'states',
                toggleLabel: 'dismissible',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'info') a.push(`  variant="${s['variant']}"`);
            if (s['title']) a.push(`  title="${s['title']}"`);
            if (s['dismissible']) a.push(`  [dismissible]="true"`);
            return (
                (a.length ? `<zyra-alert\n${a.join('\n')}\n>` : `<zyra-alert>`) +
                `\n  Your message here.\n</zyra-alert>`
            );
        },
    },

    // â”€â”€ Progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    progress: {
        renderer: ProgressRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['default', 'success', 'warning', 'danger', 'info'],
                defaultValue: 'default',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'value',
                label: 'value',
                options: ['25', '50', '65', '75', '100'],
                defaultValue: '65',
            },
            {
                type: 'toggle',
                key: 'showLabel',
                label: 'states',
                toggleLabel: 'showLabel',
                defaultValue: true,
            },
            {
                type: 'toggle',
                key: 'indeterminate',
                label: '',
                toggleLabel: 'indeterminate',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'default') a.push(`  variant="${s['variant']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (!s['indeterminate']) a.push(`  [value]="${s['value']}"`);
            if (s['indeterminate']) a.push(`  [indeterminate]="true"`);
            if (s['showLabel']) a.push(`  [showLabel]="true"`);
            return a.length ? `<zyra-progress\n${a.join('\n')}\n/>` : `<zyra-progress />`;
        },
    },

    // â”€â”€ Divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    divider: {
        renderer: DividerRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'orientation',
                label: 'orientation',
                options: ['horizontal', 'vertical'],
                defaultValue: 'horizontal',
            },
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['solid', 'dashed', 'dotted'],
                defaultValue: 'solid',
            },
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['start', 'center', 'end'],
                defaultValue: 'center',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Divider labelâ€¦',
                defaultValue: 'or',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['orientation'] !== 'horizontal') a.push(`  orientation="${s['orientation']}"`);
            if (s['variant'] !== 'solid') a.push(`  variant="${s['variant']}"`);
            if (s['align'] !== 'center') a.push(`  align="${s['align']}"`);
            if (s['label']) a.push(`  label="${s['label']}"`);
            return a.length ? `<zyra-divider\n${a.join('\n')}\n/>` : `<zyra-divider />`;
        },
    },

    // â”€â”€ Accordion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    accordion: {
        renderer: AccordionRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'toggle',
                key: 'allowMultiple',
                label: 'behaviour',
                toggleLabel: 'allowMultiple',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['allowMultiple']) a.push(`  [allowMultiple]="true"`);
            const open = a.length ? `<zyra-accordion\n${a.join('\n')}\n>` : `<zyra-accordion>`;
            return `${open}\n  <zyra-accordion-item title="What is Zyra UI?">\n    Answer content here.\n  </zyra-accordion-item>\n  <zyra-accordion-item title="Is it free?">\n    Yes, MIT licence.\n  </zyra-accordion-item>\n</zyra-accordion>`;
        },
    },

    // â”€â”€ Checkbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    checkbox: {
        renderer: CheckboxRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'labelPosition',
                label: 'label position',
                options: ['left', 'right'],
                defaultValue: 'right',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Label textâ€¦',
                defaultValue: 'Accept terms and conditions',
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: 'states',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'indeterminate',
                label: '',
                toggleLabel: 'indeterminate',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['label']) a.push(`  label="${s['label']}"`);
            if (s['labelPosition'] !== 'right') a.push(`  labelPosition="${s['labelPosition']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            if (s['indeterminate']) a.push(`  [indeterminate]="true"`);
            return a.length ? `<zyra-checkbox\n${a.join('\n')}\n/>` : `<zyra-checkbox />`;
        },
    },

    // â”€â”€ Radio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    radio: {
        renderer: RadioRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'orientation',
                label: 'orientation',
                options: ['vertical', 'horizontal'],
                defaultValue: 'vertical',
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: 'states',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  [(ngModel)]="value"`];
            if (s['orientation'] !== 'vertical') a.push(`  orientation="${s['orientation']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-radio-group\n${a.join('\n')}\n>\n  <zyra-radio value="angular">Angular</zyra-radio>\n  <zyra-radio value="react">React</zyra-radio>\n</zyra-radio-group>`;
        },
    },

    // â”€â”€ Select â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    select: {
        renderer: SelectRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'appearance',
                label: 'appearance',
                options: ['outline', 'filled', 'underline'],
                defaultValue: 'outline',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['appearance'] !== 'outline') a.push(`  appearance="${s['appearance']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            const open = a.length ? `<zyra-select\n${a.join('\n')}\n>` : `<zyra-select>`;
            return `${open}\n  <zyra-option value="angular">Angular</zyra-option>\n  <zyra-option value="react">React</zyra-option>\n  <zyra-option value="vue">Vue</zyra-option>\n</zyra-select>`;
        },
    },

    // â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    skeleton: {
        renderer: SkeletonRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'Type',
                options: [
                    'text',
                    'circle',
                    'rect',
                    'rounded',
                    'avatar',
                    'image',
                    'button',
                    'input',
                    'card',
                    'list',
                    'article',
                    'table',
                    'chat',
                    'dashboard',
                    'video',
                    'chart',
                    'product',
                    'profile',
                    'calendar',
                ],
                defaultValue: 'card',
            },
            {
                type: 'button-group',
                key: 'lines',
                label: 'lines',
                options: ['1', '2', '3', '5'],
                defaultValue: '3',
            },
            {
                type: 'button-group',
                key: 'rows',
                label: 'rows',
                options: ['3', '5', '7'],
                defaultValue: '5',
            },
            {
                type: 'toggle',
                key: 'animated',
                label: 'states',
                toggleLabel: 'animated',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'card') a.push(`  variant="${s['variant']}"`);
            if (s['variant'] === 'text') a.push(`  [lines]="${s['lines']}"`);
            if (s['variant'] === 'circle') a.push(`  width="56px"`, `  height="56px"`);
            if (['list', 'table'].includes(s['variant'] as string))
                a.push(`  [rows]="${s['rows']}"`);
            if (!s['animated']) a.push(`  [animated]="false"`);
            return a.length ? `<zyra-skeleton\n${a.join('\n')}\n/>` : `<zyra-skeleton />`;
        },
    },

    // â”€â”€ Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    tabs: {
        renderer: TabsRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['underline', 'pill', 'filled', 'outlined'],
                defaultValue: 'underline',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'orientation',
                label: 'orientation',
                options: ['horizontal', 'vertical'],
                defaultValue: 'horizontal',
            },
            {
                type: 'toggle',
                key: 'icon',
                label: 'icon',
                toggleLabel: 'show icons',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'badge',
                label: 'badge',
                toggleLabel: 'show badges',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'closeable',
                label: 'closeable',
                toggleLabel: 'enable closeable',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: 'states',
                toggleLabel: 'disabled tab',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'underline') a.push(`  variant="${s['variant']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['orientation'] !== 'horizontal') a.push(`  orientation="${s['orientation']}"`);
            const open = a.length ? `<zyra-tabs\n${a.join('\n')}\n>` : `<zyra-tabs>`;

            const tabAttrs: string[] = [];
            if (s['icon']) tabAttrs.push('icon="ðŸ "');
            if (s['badge']) tabAttrs.push('badge="4"');
            if (s['closeable']) tabAttrs.push('closeable');
            const tabExtra = tabAttrs.length ? ' ' + tabAttrs.join(' ') : '';

            const disabled = s['disabled']
                ? `\n  <zyra-tab label="Disabled" [disabled]="true">...</zyra-tab>`
                : '';
            return `${open}\n  <zyra-tab label="Overview"${tabExtra}>...</zyra-tab>\n  <zyra-tab label="Details"${tabExtra}>...</zyra-tab>\n  <zyra-tab label="Activity"${tabExtra}>...</zyra-tab>${disabled}\n</zyra-tabs>`;
        },
    },

    // â”€â”€ Textarea â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    textarea: {
        renderer: TextareaRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'resize',
                label: 'resize',
                options: ['none', 'vertical', 'auto'],
                defaultValue: 'vertical',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['resize'] !== 'vertical') a.push(`  resize="${s['resize']}"`);
            const inner = a.length
                ? `  <zyra-textarea\n${a.join('\n')}\n  />`
                : `  <zyra-textarea />`;
            return `<zyra-form-field label="Message">\n${inner}\n</zyra-form-field>`;
        },
    },

    // â”€â”€ Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    modal: {
        renderer: ModalRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg', 'xl'],
                defaultValue: 'md',
            },
            {
                type: 'text',
                key: 'title',
                label: 'title',
                placeholder: 'Modal titleâ€¦',
                defaultValue: 'Confirm action',
            },
            {
                type: 'toggle',
                key: 'dismissible',
                label: 'behaviour',
                toggleLabel: 'dismissible',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  [(open)]="isOpen"`];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['title']) a.push(`  title="${s['title']}"`);
            if (!s['dismissible']) a.push(`  [dismissible]="false"`);
            return `<zyra-modal\n${a.join('\n')}\n>\n  <p>Modal body content goes here.</p>\n  <div slot="footer">\n    <zyra-button variant="ghost" (clicked)="isOpen.set(false)">Cancel</zyra-button>\n    <zyra-button variant="primary" (clicked)="confirm()">Confirm</zyra-button>\n  </div>\n</zyra-modal>`;
        },
    },

    // â”€â”€ Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    toggle: {
        renderer: ToggleRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'labelPosition',
                label: 'label position',
                options: ['left', 'right'],
                defaultValue: 'right',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Toggle labelâ€¦',
                defaultValue: 'Enable notifications',
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: 'states',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['label']) a.push(`  label="${s['label']}"`);
            if (s['labelPosition'] !== 'right') a.push(`  labelPosition="${s['labelPosition']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return a.length ? `<zyra-toggle\n${a.join('\n')}\n/>` : `<zyra-toggle />`;
        },
    },

    // â”€â”€ Spinner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    spinner: {
        renderer: SpinnerRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['xs', 'sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'color',
                label: 'color',
                options: ['accent', 'accent-2', 'white', 'current'],
                defaultValue: 'accent',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label (aria)',
                placeholder: 'Loadingâ€¦',
                defaultValue: 'Loadingâ€¦',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['color'] !== 'accent') a.push(`  color="${s['color']}"`);
            if (s['label']) a.push(`  label="${s['label']}"`);
            return a.length ? `<zyra-spinner\n${a.join('\n')}\n/>` : `<zyra-spinner />`;
        },
    },

    // â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    toast: {
        renderer: ToastRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['success', 'error', 'warning', 'info', 'default'],
                defaultValue: 'success',
            },
            {
                type: 'text',
                key: 'title',
                label: 'title',
                placeholder: 'Toast titleâ€¦',
                defaultValue: 'Operation completed',
            },
            {
                type: 'text',
                key: 'description',
                label: 'description',
                placeholder: 'Optional descriptionâ€¦',
                defaultValue: 'Your changes have been saved.',
            },
            {
                type: 'toggle',
                key: 'persistent',
                label: 'behaviour',
                toggleLabel: 'persistent (never auto-dismiss)',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const variant = s['variant'] === 'default' ? 'info' : s['variant'];
            const desc = s['description'] ? `  description: '${s['description']}',\n` : '';
            const dur = s['persistent'] ? `  duration: 0,\n` : '';
            return `import { ZyraToastService } from 'zyra-ng-ui';\n\nconst toast = inject(ZyraToastService);\n\ntoast.${variant}('${s['title']}', {\n${desc}${dur}});\n\n// Once in your app template:\n<zyra-toast-container />`;
        },
    },

    // â”€â”€ Tooltip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    tooltip: {
        renderer: TooltipRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'position',
                label: 'position',
                options: ['top', 'bottom', 'left', 'right'],
                defaultValue: 'top',
            },
            {
                type: 'button-group',
                key: 'maxWidth',
                label: 'maxWidth',
                options: ['120px', '200px', '300px'],
                defaultValue: '200px',
            },
            {
                type: 'text',
                key: 'tooltipText',
                label: 'text',
                placeholder: 'Tooltip contentâ€¦',
                defaultValue: 'This is a tooltip!',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  text="${s['tooltipText']}"`];
            if (s['position'] !== 'top') a.push(`  position="${s['position']}"`);
            if (s['maxWidth'] !== '200px') a.push(`  maxWidth="${s['maxWidth']}"`);
            return `<zyra-tooltip\n${a.join('\n')}\n>\n  <zyra-button variant="outline">Hover me</zyra-button>\n</zyra-tooltip>`;
        },
    },

    // â”€â”€ Form Field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'form-field': {
        renderer: FormFieldRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'appearance',
                label: 'appearance',
                options: ['outline', 'filled', 'underline'],
                defaultValue: 'outline',
            },
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'text',
                key: 'label',
                label: 'label',
                placeholder: 'Field labelâ€¦',
                defaultValue: 'Label',
            },
            {
                type: 'text',
                key: 'hint',
                label: 'hint',
                placeholder: 'Helper textâ€¦',
                defaultValue: '',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['label']) a.push(`  label="${s['label']}"`);
            if (s['hint']) a.push(`  hint="${s['hint']}"`);
            if (s['appearance'] !== 'outline') a.push(`  appearance="${s['appearance']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            const open = a.length ? `<zyra-form-field\n${a.join('\n')}\n>` : `<zyra-form-field>`;
            return `${open}\n  <zyra-input placeholder="Enter textâ€¦" />\n</zyra-form-field>`;
        },
    },
};
