import { PlaygroundConfig } from './playground-config';
import { AccordionRenderer } from './renderers/accordion-renderer';
import { AlertRenderer } from './renderers/alert-renderer';
import { AvatarRenderer } from './renderers/avatar-renderer';
import { BadgeRenderer } from './renderers/badge-renderer';
import { BreadcrumbRenderer } from './renderers/breadcrumb-renderer';
import { ButtonRenderer } from './renderers/button-renderer';
import { ButtonGroupRenderer } from './renderers/button-group-renderer';
import { CardRenderer } from './renderers/card-renderer';
import { CheckboxRenderer } from './renderers/checkbox-renderer';
import { ChipRenderer } from './renderers/chip-renderer';
import { CodeBlockRenderer } from './renderers/code-block-renderer';
import { DividerRenderer } from './renderers/divider-renderer';
import { DropdownMenuRenderer } from './renderers/dropdown-menu-renderer';
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
import { SwitchRenderer } from './renderers/switch-renderer';
import { TooltipRenderer } from './renderers/tooltip-renderer';
import { TypographyRenderer } from './renderers/typography-renderer';
import { EmptyStateRenderer } from './renderers/empty-state-renderer';
import { ClipboardRenderer } from './renderers/clipboard-renderer';
import { RatingRenderer } from './renderers/rating-renderer';
import { StackRenderer } from './renderers/stack-renderer';
import { PaginationRenderer } from './renderers/pagination-renderer';
import { StepperRenderer } from './renderers/stepper-renderer';
import { PopoverRenderer } from './renderers/popover-renderer';
import { TimelineRenderer } from './renderers/timeline-renderer';
import { HeaderRenderer } from './renderers/header-renderer';
import { SidebarRenderer } from './renderers/sidebar-renderer';
import { BoxRenderer } from './renderers/box-renderer';
import { FlexRenderer } from './renderers/flex-renderer';
import { GridRenderer } from './renderers/grid-renderer';
import { ContainerRenderer } from './renderers/container-renderer';
import { AspectRatioRenderer } from './renderers/aspect-ratio-renderer';
import { ScrollAreaRenderer } from './renderers/scroll-area-renderer';
import { ConfirmDialogRenderer } from './renderers/confirm-dialog-renderer';
import { ThemeSwitchRenderer } from './renderers/theme-switch-renderer';
import { DrawerRenderer } from './renderers/drawer-renderer';
import { MultiSelectRenderer } from './renderers/multi-select-renderer';
import { AutocompleteRenderer } from './renderers/autocomplete-renderer';
import { SliderRenderer } from './renderers/slider-renderer';
import { FileUploadRenderer } from './renderers/file-upload-renderer';
import { CarouselRenderer } from './renderers/carousel-renderer';
import { CalendarRenderer } from './renderers/calendar-renderer';
import { DatePickerRenderer } from './renderers/date-picker-renderer';
import { TableRenderer } from './renderers/table-renderer';
import { TreeViewRenderer } from './renderers/tree-view-renderer';

export const PLAYGROUND_REGISTRY: Record<string, PlaygroundConfig> = {
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
                placeholder: 'Button text',
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
    'button-group': {
        renderer: ButtonGroupRenderer,
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
                key: 'join',
                label: 'join',
                options: ['separated', 'attached'],
                defaultValue: 'separated',
            },
            {
                type: 'button-group',
                key: 'selectionMode',
                label: 'selectionMode',
                options: ['none', 'single', 'multiple'],
                defaultValue: 'single',
            },
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['primary', 'secondary', 'ghost', 'outline'],
                defaultValue: 'outline',
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
            if (s['orientation'] !== 'horizontal') a.push(`  orientation="${s['orientation']}"`);
            if (s['join'] !== 'separated') a.push(`  join="${s['join']}"`);
            if (s['selectionMode'] !== 'none') a.push(`  selectionMode="${s['selectionMode']}"`);
            if (s['variant'] !== 'primary') a.push(`  variant="${s['variant']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return (
                `<zyra-button-group\n${a.join('\n')}\n>\n` +
                `  <zyra-button value="left">Left</zyra-button>\n` +
                `  <zyra-button value="center">Center</zyra-button>\n` +
                `  <zyra-button value="right">Right</zyra-button>\n` +
                `</zyra-button-group>`
            );
        },
    },

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
                placeholder: 'Badge text',
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

    'code-block': {
        renderer: CodeBlockRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'text',
                key: 'filename',
                label: 'filename',
                placeholder: 'greet.ts',
                defaultValue: 'greet.ts',
            },
            {
                type: 'text',
                key: 'language',
                label: 'language',
                placeholder: 'typescript',
                defaultValue: 'typescript',
            },
            {
                type: 'toggle',
                key: 'lineNumbers',
                label: 'states',
                toggleLabel: 'lineNumbers',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'copyable',
                label: '',
                toggleLabel: 'copyable',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['filename']) a.push(`  filename="${s['filename']}"`);
            if (s['language']) a.push(`  language="${s['language']}"`);
            if (s['lineNumbers']) a.push(`  [lineNumbers]="true"`);
            if (!s['copyable']) a.push(`  [copyable]="false"`);
            return `<zyra-code-block\n${a.join('\n')}\n  [code]="snippet"\n/>`;
        },
    },

    breadcrumb: {
        renderer: BreadcrumbRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'depth',
                label: 'items',
                options: ['2', '3', '4'],
                defaultValue: '3',
            },
        ],
        codeTemplate: (s) => {
            const depth = Number(s['depth']);
            const crumbs = [
                { label: 'Home', href: '/' },
                { label: 'Components', href: '/components' },
                { label: 'Code Block', href: '/components/code-block' },
                { label: 'Playground', href: '' },
            ].slice(0, depth);
            const items = crumbs
                .map((c, i) => {
                    const last = i === crumbs.length - 1;
                    const attrs = [`href="${c.href}"`];
                    if (last) attrs.push(`[current]="true"`);
                    return `  <zyra-breadcrumb-item ${attrs.join(' ')}>${c.label}</zyra-breadcrumb-item>`;
                })
                .join('\n');
            return `<zyra-breadcrumb>\n${items}\n</zyra-breadcrumb>`;
        },
    },

    'dropdown-menu': {
        renderer: DropdownMenuRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['start', 'end'],
                defaultValue: 'start',
            },
            {
                type: 'toggle',
                key: 'danger',
                label: 'states',
                toggleLabel: 'danger item',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['align'] !== 'start') a.push(` align="${s['align']}"`);
            const dangerItem = s['danger'] ? `\n  <zyra-menu-item variant="danger">Delete</zyra-menu-item>` : '';
            return `<zyra-dropdown-menu${a.join('')}>\n  <zyra-button slot="trigger" variant="outline">Actions</zyra-button>\n  <zyra-menu-item>Edit</zyra-menu-item>\n  <zyra-menu-item>Duplicate</zyra-menu-item>${dangerItem}\n</zyra-dropdown-menu>`;
        },
    },

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
                placeholder: 'Full name',
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
                placeholder: 'Hint text',
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
            {
                type: 'toggle',
                key: 'debounce',
                label: '',
                toggleLabel: 'debounced search (300ms)',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const ff: string[] = [];
            if (s['appearance'] !== 'outline') ff.push(`  appearance="${s['appearance']}"`);
            if (s['size'] !== 'md') ff.push(`  size="${s['size']}"`);
            if (s['hint']) ff.push(`  hint="${s['hint']}"`);
            if (s['clearButton']) ff.push(`  [clearButton]="true"`);
            if (s['loading']) ff.push(`  [loading]="true"`);
            if (s['type'] === 'search') ff.push(`  [prefixIcon]="icons.search"`);
            const inp: string[] = [];
            if (s['type'] !== 'text') inp.push(`    type="${s['type']}"`);
            if (s['debounce']) {
                inp.push(`    [debounce]="300"`, `    (searched)="onSearch($event)"`);
            }
            const ffOpen = ff.length
                ? `<zyra-form-field label="Label"\n${ff.join('\n')}\n>`
                : `<zyra-form-field label="Label">`;
            const inpTag = inp.length
                ? `  <zyra-input\n${inp.join('\n')}\n  />`
                : `  <zyra-input />`;
            return `${ffOpen}\n${inpTag}\n</zyra-form-field>`;
        },
    },

    slider: {
        renderer: SliderRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'size',
                label: 'size',
                options: ['sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'toggle',
                key: 'showValue',
                label: 'features',
                toggleLabel: 'showValue',
                defaultValue: true,
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
            const a: string[] = [`  [(ngModel)]="value"`];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['showValue']) a.push(`  [showValue]="true"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-slider\n${a.join('\n')}\n/>`;
        },
    },

    'file-upload': {
        renderer: FileUploadRenderer,
        controls: [
            {
                type: 'toggle',
                key: 'multiple',
                label: 'features',
                toggleLabel: 'multiple',
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
            if (s['multiple']) a.push(` multiple`);
            if (s['disabled']) a.push(` disabled`);
            return `<zyra-file-upload${a.join('')} />`;
        },
    },

    carousel: {
        renderer: CarouselRenderer,
        controls: [
            {
                type: 'toggle',
                key: 'loop',
                label: 'behaviour',
                toggleLabel: 'loop',
                defaultValue: true,
            },
            {
                type: 'toggle',
                key: 'autoplay',
                label: '',
                toggleLabel: 'autoplay',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'showDots',
                label: '',
                toggleLabel: 'showDots',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (!s['loop']) a.push(`  [loop]="false"`);
            if (s['autoplay']) a.push(`  autoplay`);
            if (!s['showDots']) a.push(`  [showDots]="false"`);
            const open = a.length ? `<zyra-carousel\n${a.join('\n')}\n>` : `<zyra-carousel>`;
            return `${open}\n  <zyra-carousel-slide>Slide 1</zyra-carousel-slide>\n  <zyra-carousel-slide>Slide 2</zyra-carousel-slide>\n  <zyra-carousel-slide>Slide 3</zyra-carousel-slide>\n</zyra-carousel>`;
        },
    },

    calendar: {
        renderer: CalendarRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'selectionMode',
                label: 'selectionMode',
                options: ['single', 'multiple', 'range'],
                defaultValue: 'single',
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
            const a: string[] = [`  [(ngModel)]="selectedDate"`];
            if (s['selectionMode'] !== 'single') a.push(`  selectionMode="${s['selectionMode']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-calendar\n${a.join('\n')}\n/>`;
        },
    },

    'date-picker': {
        renderer: DatePickerRenderer,
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
                type: 'button-group',
                key: 'selectionMode',
                label: 'selectionMode',
                options: ['single', 'range'],
                defaultValue: 'single',
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
            const a: string[] = [`  [(ngModel)]="selectedDate"`];
            if (s['appearance'] !== 'outline') a.push(`  appearance="${s['appearance']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['selectionMode'] !== 'single') a.push(`  selectionMode="${s['selectionMode']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-date-picker\n${a.join('\n')}\n/>`;
        },
    },

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
                placeholder: 'Chip label',
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
                placeholder: 'Alert title',
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
                placeholder: 'Divider label',
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
                placeholder: 'Label text',
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

    'multi-select': {
        renderer: MultiSelectRenderer,
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
            const open = a.length
                ? `<zyra-multi-select\n${a.join('\n')}\n>`
                : `<zyra-multi-select>`;
            return `${open}\n  <zyra-option value="angular">Angular</zyra-option>\n  <zyra-option value="react">React</zyra-option>\n  <zyra-option value="vue">Vue</zyra-option>\n</zyra-multi-select>`;
        },
    },

    autocomplete: {
        renderer: AutocompleteRenderer,
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
            const open = a.length
                ? `<zyra-autocomplete\n${a.join('\n')}\n>`
                : `<zyra-autocomplete>`;
            return `${open}\n  <zyra-option value="angular">Angular</zyra-option>\n  <zyra-option value="react">React</zyra-option>\n  <zyra-option value="vue">Vue</zyra-option>\n</zyra-autocomplete>`;
        },
    },

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
            if (s['icon']) tabAttrs.push('icon="🏠"');
            if (s['badge']) tabAttrs.push('badge="4"');
            if (s['closeable']) tabAttrs.push('closeable');
            const tabExtra = tabAttrs.length ? ' ' + tabAttrs.join(' ') : '';

            const disabled = s['disabled']
                ? `\n  <zyra-tab label="Disabled" [disabled]="true">...</zyra-tab>`
                : '';
            return `${open}\n  <zyra-tab label="Overview"${tabExtra}>...</zyra-tab>\n  <zyra-tab label="Details"${tabExtra}>...</zyra-tab>\n  <zyra-tab label="Activity"${tabExtra}>...</zyra-tab>${disabled}\n</zyra-tabs>`;
        },
    },

    table: {
        renderer: TableRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'selectionMode',
                label: 'selectionMode',
                options: ['none', 'single', 'multiple'],
                defaultValue: 'none',
            },
            {
                type: 'toggle',
                key: 'paginated',
                label: 'features',
                toggleLabel: 'paginated (3 per page)',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'manualSort',
                label: '',
                toggleLabel: 'manualSort (server-side)',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'loading',
                label: '',
                toggleLabel: 'loading',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'empty',
                label: '',
                toggleLabel: 'empty',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  [columns]="columns"`, `  [rows]="rows"`, `  [(sort)]="sort"`];
            if (s['selectionMode'] !== 'none') {
                a.push(`  selectionMode="${s['selectionMode']}"`, `  [(selected)]="selected"`);
            }
            if (s['paginated']) a.push(`  [pageSize]="3"`);
            if (s['manualSort']) a.push(`  [manualSort]="true"`);
            if (s['loading']) a.push(`  [loading]="true"`);
            a.push(`  (rowClick)="onRowClick($event)"`);
            return `<zyra-table\n${a.join('\n')}\n/>`;
        },
    },

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
                placeholder: 'Modal title',
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

    'confirm-dialog': {
        renderer: ConfirmDialogRenderer,
        controls: [
            {
                type: 'text',
                key: 'title',
                label: 'title',
                placeholder: 'Dialog title',
                defaultValue: 'Delete item?',
            },
            {
                type: 'text',
                key: 'message',
                label: 'message',
                placeholder: 'Dialog message',
                defaultValue: 'This action cannot be undone.',
            },
            {
                type: 'button-group',
                key: 'tone',
                label: 'tone',
                options: ['default', 'danger'],
                defaultValue: 'danger',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  [(open)]="isOpen"`];
            if (s['title']) a.push(`  title="${s['title']}"`);
            if (s['message']) a.push(`  message="${s['message']}"`);
            if (s['tone'] !== 'default') a.push(`  tone="${s['tone']}"`);
            return `<zyra-confirm-dialog\n${a.join('\n')}\n  (confirmed)="onConfirm()"\n/>`;
        },
    },

    'theme-switch': {
        renderer: ThemeSwitchRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'mode',
                label: 'mode',
                options: ['menu', 'toggle'],
                defaultValue: 'menu',
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
            if (s['mode'] !== 'menu') a.push(` mode="${s['mode']}"`);
            if (s['disabled']) a.push(` disabled`);
            return `<zyra-theme-switch${a.join('')} />`;
        },
    },

    drawer: {
        renderer: DrawerRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'side',
                label: 'side',
                options: ['left', 'right', 'top', 'bottom'],
                defaultValue: 'right',
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
                key: 'title',
                label: 'title',
                placeholder: 'Drawer title',
                defaultValue: 'Filters',
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
            if (s['side'] !== 'right') a.push(`  side="${s['side']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['title']) a.push(`  title="${s['title']}"`);
            if (!s['dismissible']) a.push(`  [dismissible]="false"`);
            return `<zyra-drawer\n${a.join('\n')}\n>\n  <p>Drawer body content goes here.</p>\n  <div slot="footer">\n    <zyra-button variant="ghost" (clicked)="isOpen.set(false)">Cancel</zyra-button>\n    <zyra-button variant="primary" (clicked)="save()">Save</zyra-button>\n  </div>\n</zyra-drawer>`;
        },
    },

    switch: {
        renderer: SwitchRenderer,
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
                placeholder: 'Switch label',
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
            return a.length ? `<zyra-switch\n${a.join('\n')}\n/>` : `<zyra-switch />`;
        },
    },

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
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return a.length
                ? `<zyra-toggle\n${a.join('\n')}\n  aria-label="Bold"\n>\n  B\n</zyra-toggle>`
                : `<zyra-toggle aria-label="Bold">B</zyra-toggle>`;
        },
    },

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
                placeholder: 'Loading',
                defaultValue: 'Loading',
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
                placeholder: 'Toast title',
                defaultValue: 'Operation completed',
            },
            {
                type: 'text',
                key: 'description',
                label: 'description',
                placeholder: 'Optional description',
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
                placeholder: 'Tooltip content',
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
                placeholder: 'Field label',
                defaultValue: 'Label',
            },
            {
                type: 'text',
                key: 'hint',
                label: 'hint',
                placeholder: 'Helper text',
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
            return `${open}\n  <zyra-input placeholder="Enter text" />\n</zyra-form-field>`;
        },
    },

    'tree-view': {
        renderer: TreeViewRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'selectionMode',
                label: 'selectionMode',
                options: ['none', 'single', 'multiple'],
                defaultValue: 'none',
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
            const a: string[] = [`  [nodes]="nodes"`];
            if (s['selectionMode'] !== 'none') a.push(`  selectionMode="${s['selectionMode']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            return `<zyra-tree-view\n${a.join('\n')}\n/>`;
        },
    },

    typography: {
        renderer: TypographyRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-lg', 'body', 'body-sm', 'caption', 'overline'],
                defaultValue: 'h3',
            },
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['left', 'center', 'right'],
                defaultValue: 'left',
            },
            {
                type: 'toggle',
                key: 'muted',
                label: 'states',
                toggleLabel: 'muted',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'truncate',
                label: '',
                toggleLabel: 'truncate',
                defaultValue: false,
            },
            {
                type: 'text',
                key: 'text',
                label: 'text',
                placeholder: 'Heading text',
                defaultValue: 'The quick brown fox jumps over the lazy dog',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['variant'] !== 'body') a.push(`  variant="${s['variant']}"`);
            if (s['align'] !== 'left') a.push(`  align="${s['align']}"`);
            if (s['muted']) a.push(`  [muted]="true"`);
            if (s['truncate']) a.push(`  [truncate]="true"`);
            return (
                (a.length ? `<zyra-typography\n${a.join('\n')}\n>` : `<zyra-typography>`) +
                `\n  ${s['text'] || 'Text'}\n</zyra-typography>`
            );
        },
    },

    'empty-state': {
        renderer: EmptyStateRenderer,
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
                type: 'text',
                key: 'title',
                label: 'title',
                placeholder: 'Empty state title',
                defaultValue: 'No results found',
            },
            {
                type: 'text',
                key: 'description',
                label: 'description',
                placeholder: 'Empty state description',
                defaultValue: 'Try adjusting your filters or search terms.',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['title']) a.push(`  title="${s['title']}"`);
            if (s['description']) a.push(`  description="${s['description']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            const open = a.length ? `<zyra-empty-state\n${a.join('\n')}\n>` : `<zyra-empty-state>`;
            return `${open}\n  <div slot="actions">\n    <zyra-button variant="primary" size="sm">Reset filters</zyra-button>\n  </div>\n</zyra-empty-state>`;
        },
    },

    clipboard: {
        renderer: ClipboardRenderer,
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
                key: 'variant',
                label: 'variant',
                options: ['button', 'icon'],
                defaultValue: 'button',
            },
            {
                type: 'text',
                key: 'value',
                label: 'value',
                placeholder: 'Text to copy',
                defaultValue: 'npm install zyra-ng-ui',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  value="${s['value']}"`];
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['variant'] !== 'button') a.push(`  variant="${s['variant']}"`);
            return `<zyra-clipboard\n${a.join('\n')}\n/>`;
        },
    },

    rating: {
        renderer: RatingRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'max',
                label: 'max',
                options: ['5', '10'],
                defaultValue: '5',
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
                key: 'readonly',
                label: 'states',
                toggleLabel: 'readonly',
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
            const a: string[] = [`  [(value)]="rating"`];
            if (s['max'] !== '5') a.push(`  [max]="${s['max']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['readonly']) a.push(`  [readonly]="true"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-rating\n${a.join('\n')}\n/>`;
        },
    },

    stack: {
        renderer: StackRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'direction',
                label: 'direction',
                options: ['row', 'column'],
                defaultValue: 'row',
            },
            {
                type: 'button-group',
                key: 'gap',
                label: 'gap',
                options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['start', 'center', 'end', 'stretch'],
                defaultValue: 'center',
            },
            {
                type: 'button-group',
                key: 'justify',
                label: 'justify',
                options: ['start', 'center', 'end', 'between', 'around'],
                defaultValue: 'start',
            },
            {
                type: 'toggle',
                key: 'wrap',
                label: 'states',
                toggleLabel: 'wrap',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['direction'] !== 'column') a.push(`  direction="${s['direction']}"`);
            if (s['gap'] !== 'md') a.push(`  gap="${s['gap']}"`);
            if (s['align'] !== 'stretch') a.push(`  align="${s['align']}"`);
            if (s['justify'] !== 'start') a.push(`  justify="${s['justify']}"`);
            if (s['wrap']) a.push(`  [wrap]="true"`);
            const open = a.length ? `<zyra-stack\n${a.join('\n')}\n>` : `<zyra-stack>`;
            return `${open}\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</zyra-stack>`;
        },
    },

    pagination: {
        renderer: PaginationRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'totalPages',
                label: 'totalPages',
                options: ['5', '10', '20'],
                defaultValue: '10',
            },
            {
                type: 'button-group',
                key: 'siblingCount',
                label: 'siblingCount',
                options: ['1', '2'],
                defaultValue: '1',
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
                key: 'disabled',
                label: 'states',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [
                `  [totalPages]="${s['totalPages']}"`,
                `  [currentPage]="page"`,
                `  (pageChange)="page = $event"`,
            ];
            if (s['siblingCount'] !== '1') a.push(`  [siblingCount]="${s['siblingCount']}"`);
            if (s['size'] !== 'md') a.push(`  size="${s['size']}"`);
            if (s['disabled']) a.push(`  [disabled]="true"`);
            return `<zyra-pagination\n${a.join('\n')}\n/>`;
        },
    },

    stepper: {
        renderer: StepperRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'orientation',
                label: 'orientation',
                options: ['horizontal', 'vertical'],
                defaultValue: 'horizontal',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  [activeIndex]="activeIndex"`];
            if (s['orientation'] !== 'horizontal') a.push(`  orientation="${s['orientation']}"`);
            const open = a.length ? `<zyra-stepper\n${a.join('\n')}\n>` : `<zyra-stepper>`;
            return `${open}\n  <zyra-step label="Account" description="Create your account">...</zyra-step>\n  <zyra-step label="Profile" description="Tell us about yourself">...</zyra-step>\n  <zyra-step label="Review" description="Confirm and finish">...</zyra-step>\n</zyra-stepper>`;
        },
    },

    popover: {
        renderer: PopoverRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'button-group',
                key: 'position',
                label: 'position',
                options: ['top', 'bottom', 'left', 'right'],
                defaultValue: 'bottom',
            },
            {
                type: 'button-group',
                key: 'trigger',
                label: 'trigger',
                options: ['click', 'hover'],
                defaultValue: 'click',
            },
            {
                type: 'toggle',
                key: 'closeOnOutsideClick',
                label: 'behaviour',
                toggleLabel: 'closeOnOutsideClick',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['position'] !== 'bottom') a.push(`  position="${s['position']}"`);
            if (s['trigger'] !== 'click') a.push(`  trigger="${s['trigger']}"`);
            if (!s['closeOnOutsideClick']) a.push(`  [closeOnOutsideClick]="false"`);
            const open = a.length ? `<zyra-popover\n${a.join('\n')}\n>` : `<zyra-popover>`;
            return `${open}\n  <zyra-button slot="trigger" variant="outline">Open popover</zyra-button>\n  <div slot="content">\n    <strong>Notifications</strong>\n    <p>You have 3 unread messages.</p>\n  </div>\n</zyra-popover>`;
        },
    },

    timeline: {
        renderer: TimelineRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'toggle',
                key: 'showWarning',
                label: 'states',
                toggleLabel: 'show delay step',
                defaultValue: true,
            },
        ],
        codeTemplate: (s) => {
            const warning = s['showWarning']
                ? `\n  <zyra-timeline-item title="Delivery delayed" date="Jan 4, 2026" variant="warning">\n    Shipment is delayed due to weather conditions.\n  </zyra-timeline-item>`
                : '';
            return `<zyra-timeline>\n  <zyra-timeline-item title="Order placed" date="Jan 1, 2026" variant="success">\n    Your order has been placed successfully.\n  </zyra-timeline-item>\n  <zyra-timeline-item title="Payment confirmed" date="Jan 2, 2026" variant="info">\n    Payment was received and confirmed.\n  </zyra-timeline-item>${warning}\n  <zyra-timeline-item title="Delivered" date="Jan 6, 2026" variant="default">\n    Package delivered to the recipient.\n  </zyra-timeline-item>\n</zyra-timeline>`;
        },
    },

    header: {
        renderer: HeaderRenderer,
        stageClass: 'column',
        layout: 'stacked',
        controls: [
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['split', 'center'],
                defaultValue: 'split',
            },
            {
                type: 'button-group',
                key: 'variant',
                label: 'variant',
                options: ['contained', 'full-width'],
                defaultValue: 'contained',
            },
            {
                type: 'toggle',
                key: 'transparent',
                label: 'states',
                toggleLabel: 'transparent',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'mobileView',
                label: '',
                toggleLabel: 'mobile view',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'independentNav',
                label: '',
                toggleLabel: 'independent mobile nav',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['align'] !== 'split') a.push(`  align="${s['align']}"`);
            if (s['variant'] !== 'contained') a.push(`  variant="${s['variant']}"`);
            if (s['transparent']) a.push(`  [transparent]="true"`);
            const open = a.length ? `<zyra-header\n${a.join('\n')}\n>` : `<zyra-header>`;
            const desktop = `\n  <a zyraHeaderStart>Brand</a>\n  <nav zyraHeaderNav aria-label="Primary">\n    <a>Docs</a>\n    <a>Blog</a>\n    <a>Pricing</a>\n  </nav>\n  <div zyraHeaderEnd>\n    <zyra-button size="sm">Get started</zyra-button>\n  </div>`;
            const independentMobile = s['independentNav']
                ? `\n\n  <!-- Independent mobile drawer content — never falls back to the desktop nav above -->\n  <nav zyraHeaderMobileNav aria-label="Mobile">\n    <a>Docs</a>\n    <a>Blog</a>\n    <a>Pricing</a>\n    <a>Changelog</a>\n    <a>Community</a>\n  </nav>\n  <div zyraHeaderMobileEnd>\n    <zyra-button size="sm" variant="outline" fullWidth>Sign in</zyra-button>\n    <zyra-button size="sm" fullWidth>Get started</zyra-button>\n  </div>\n  <div zyraHeaderMobileFooter>v1.0.0 — © Zyra UI</div>`
                : '';
            return `${open}${desktop}${independentMobile}\n</zyra-header>`;
        },
    },

    sidebar: {
        renderer: SidebarRenderer,
        stageClass: 'column',
        controls: [
            {
                type: 'toggle',
                key: 'collapsed',
                label: 'states',
                toggleLabel: 'collapsed',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'badge',
                label: '',
                toggleLabel: 'show badge',
                defaultValue: true,
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: '',
                toggleLabel: 'disabled item',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['collapsed']) a.push(`  [collapsed]="collapsed"`);
            const open = a.length ? `<zyra-sidebar\n${a.join('\n')}\n>` : `<zyra-sidebar>`;
            const badge = s['badge'] ? ` badge="3"` : '';
            const disabled = s['disabled'] ? ` [disabled]="true"` : '';
            return `${open}\n  <div sidebar-header>Zyra UI</div>\n  <zyra-sidebar-section heading="General">\n    <a zyra-sidebar-item [active]="true">Overview</a>\n    <a zyra-sidebar-item>Projects</a>\n  </zyra-sidebar-section>\n  <zyra-sidebar-section heading="Account">\n    <a zyra-sidebar-item${badge}>Profile</a>\n    <a zyra-sidebar-item${disabled}>Billing</a>\n  </zyra-sidebar-section>\n</zyra-sidebar>`;
        },
    },

    box: {
        renderer: BoxRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'padding',
                label: 'padding',
                options: ['none', 'sm', 'md', 'lg', 'xl'],
                defaultValue: 'md',
            },
            {
                type: 'button-group',
                key: 'rounded',
                label: 'rounded',
                options: ['none', 'sm', 'lg', 'full'],
                defaultValue: 'lg',
            },
            {
                type: 'button-group',
                key: 'background',
                label: 'background',
                options: ['none', 'surface', 'surface-inset', 'accent', 'danger'],
                defaultValue: 'surface',
            },
            {
                type: 'button-group',
                key: 'shadow',
                label: 'shadow',
                options: ['none', 'sm', 'md', 'lg'],
                defaultValue: 'none',
            },
            {
                type: 'toggle',
                key: 'border',
                label: 'states',
                toggleLabel: 'border',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['padding'] !== 'md') a.push(`  padding="${s['padding']}"`);
            if (s['rounded'] !== 'lg') a.push(`  rounded="${s['rounded']}"`);
            if (s['background'] !== 'surface') a.push(`  background="${s['background']}"`);
            if (s['shadow'] !== 'none') a.push(`  shadow="${s['shadow']}"`);
            if (s['border']) a.push(`  [border]="true"`);
            const open = a.length ? `<zyra-box\n${a.join('\n')}\n>` : `<zyra-box>`;
            return `${open}\n  content\n</zyra-box>`;
        },
    },

    flex: {
        renderer: FlexRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'direction',
                label: 'direction',
                options: ['row', 'column'],
                defaultValue: 'row',
            },
            {
                type: 'button-group',
                key: 'justify',
                label: 'justify',
                options: ['start', 'center', 'between', 'end'],
                defaultValue: 'start',
            },
            {
                type: 'button-group',
                key: 'align',
                label: 'align',
                options: ['start', 'center', 'end', 'stretch'],
                defaultValue: 'stretch',
            },
            {
                type: 'button-group',
                key: 'gap',
                label: 'gap',
                options: ['none', 'sm', 'md', 'lg'],
                defaultValue: 'md',
            },
            {
                type: 'toggle',
                key: 'wrap',
                label: 'states',
                toggleLabel: 'wrap',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['direction'] !== 'row') a.push(`  direction="${s['direction']}"`);
            if (s['justify'] !== 'start') a.push(`  justify="${s['justify']}"`);
            if (s['align'] !== 'stretch') a.push(`  align="${s['align']}"`);
            if (s['gap'] !== 'md') a.push(`  gap="${s['gap']}"`);
            if (s['wrap']) a.push(`  [wrap]="true"`);
            const open = a.length ? `<zyra-flex\n${a.join('\n')}\n>` : `<zyra-flex>`;
            return `${open}\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</zyra-flex>`;
        },
    },

    grid: {
        renderer: GridRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'columns',
                label: 'columns',
                options: ['1', '2', '3', '4', 'auto-fit'],
                defaultValue: '3',
            },
            {
                type: 'button-group',
                key: 'gap',
                label: 'gap',
                options: ['none', 'xs', 'sm', 'lg'],
                defaultValue: 'sm',
            },
            {
                type: 'button-group',
                key: 'autoFlow',
                label: 'autoFlow',
                options: ['row', 'column', 'dense'],
                defaultValue: 'row',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['columns'] !== '3') {
                const cols = s['columns'] === 'auto-fit' ? `"auto-fit"` : s['columns'];
                a.push(`  [columns]="${cols}"`);
            }
            if (s['gap'] !== 'sm') a.push(`  gap="${s['gap']}"`);
            if (s['autoFlow'] !== 'row') a.push(`  autoFlow="${s['autoFlow']}"`);
            const open = a.length ? `<zyra-grid\n${a.join('\n')}\n>` : `<zyra-grid>`;
            return `${open}\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n  <div>5</div>\n  <div>6</div>\n</zyra-grid>`;
        },
    },

    container: {
        renderer: ContainerRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'maxWidth',
                label: 'maxWidth',
                options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'responsive'],
                defaultValue: 'xl',
            },
            {
                type: 'toggle',
                key: 'centered',
                label: 'states',
                toggleLabel: 'centered',
                defaultValue: true,
            },
            {
                type: 'toggle',
                key: 'fluid',
                label: '',
                toggleLabel: 'fluid',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [];
            if (s['maxWidth'] !== 'xl') a.push(`  maxWidth="${s['maxWidth']}"`);
            if (!s['centered']) a.push(`  [centered]="false"`);
            if (s['fluid']) a.push(`  [fluid]="true"`);
            const open = a.length ? `<zyra-container\n${a.join('\n')}\n>` : `<zyra-container>`;
            return `${open}\n  content\n</zyra-container>`;
        },
    },

    'aspect-ratio': {
        renderer: AspectRatioRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'ratio',
                label: 'ratio',
                options: ['16/9', '1/1', '4/3', '21/9'],
                defaultValue: '16/9',
            },
            {
                type: 'button-group',
                key: 'objectFit',
                label: 'objectFit',
                options: ['cover', 'contain', 'fill'],
                defaultValue: 'cover',
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  ratio="${s['ratio']}"`];
            if (s['objectFit'] !== 'cover') a.push(`  objectFit="${s['objectFit']}"`);
            return `<zyra-aspect-ratio\n${a.join('\n')}\n>\n  <img src="photo.jpg" alt="" />\n</zyra-aspect-ratio>`;
        },
    },

    'scroll-area': {
        renderer: ScrollAreaRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'orientation',
                label: 'orientation',
                options: ['vertical', 'horizontal', 'both'],
                defaultValue: 'vertical',
            },
            {
                type: 'toggle',
                key: 'autoHideScrollbar',
                label: 'states',
                toggleLabel: 'auto-hide scrollbar',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'showScrollShadows',
                label: '',
                toggleLabel: 'scroll shadows',
                defaultValue: false,
            },
            {
                type: 'toggle',
                key: 'smoothScroll',
                label: '',
                toggleLabel: 'smooth scroll',
                defaultValue: false,
            },
        ],
        codeTemplate: (s) => {
            const a: string[] = [`  maxHeight="220px"`];
            if (s['orientation'] !== 'vertical') a.push(`  orientation="${s['orientation']}"`);
            if (s['autoHideScrollbar']) a.push(`  [autoHideScrollbar]="true"`);
            if (s['showScrollShadows']) a.push(`  [showScrollShadows]="true"`);
            if (s['smoothScroll']) a.push(`  [smoothScroll]="true"`);
            return `<zyra-scroll-area\n${a.join('\n')}\n>\n  ...\n</zyra-scroll-area>`;
        },
    },
};
