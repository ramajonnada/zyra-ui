import type { ZyraIconData } from 'zyra-ng-ui';
import { cubes, message, palette, bolt, code, swatchbook, boxOpen, waveSquare, check, circleInfo, triangleExclamation, alignLeft, caretRight, handPointer, certificate, square, circleUser, keyboard, spinner, scaleBalanced, menu, copy, star, panelLeft, calendarIcon } from 'zyra-ng-ui';

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

/**
 * A Tier 2 (semantic) or Tier 3 (component) CSS custom property this
 * component reads at runtime — never a raw per-theme token (see Rule D-1 /
 * T-1 in CLAUDE.md). `variable` is the token name; `defaultValue` is what it
 * points to today, read directly from _tokens-components.scss so it stays
 * accurate as the token's alias changes.
 */
export interface TokenEntry {
    name: string;
    variable: string;
    defaultValue: string;
    description: string;
}

// Shared by Select, Multi Select, and Autocomplete — all three read the same
// --zyra-color-select-* Tier 3 tokens (see _tokens-components.scss).
const SELECT_TOKENS: readonly TokenEntry[] = [
    {
        name: 'Text',
        variable: '--zyra-color-select-text',
        defaultValue: 'var(--zyra-color-foreground)',
        description: 'Color of the selected value / chip text in the trigger.',
    },
    {
        name: 'Placeholder',
        variable: '--zyra-color-select-placeholder',
        defaultValue: 'var(--zyra-color-foreground-subtle)',
        description: 'Color of the placeholder text when nothing is selected.',
    },
    {
        name: 'Icon',
        variable: '--zyra-color-select-icon',
        defaultValue: 'var(--zyra-color-foreground-subtle)',
        description: 'Color of the chevron/caret icon.',
    },
    {
        name: 'Background',
        variable: '--zyra-color-select-bg',
        defaultValue: 'var(--zyra-color-input-bg)',
        description: 'Fill color of the trigger in the outline/filled appearances.',
    },
    {
        name: 'Border',
        variable: '--zyra-color-select-border',
        defaultValue: 'var(--zyra-color-input-border)',
        description: 'Border color of the trigger in its resting state.',
    },
    {
        name: 'Filled background',
        variable: '--zyra-color-select-filled-bg',
        defaultValue: 'var(--zyra-color-surface-inset)',
        description: 'Fill color specific to the filled appearance.',
    },
    {
        name: 'Focus border',
        variable: '--zyra-color-select-focus-border',
        defaultValue: 'var(--zyra-color-primary)',
        description: 'Border/underline color of the trigger when focused or open.',
    },
    {
        name: 'Panel background',
        variable: '--zyra-color-select-panel-bg',
        defaultValue: 'var(--zyra-color-surface-dropdown)',
        description: 'Fill color of the options panel.',
    },
    {
        name: 'Panel border',
        variable: '--zyra-color-select-panel-border',
        defaultValue: 'var(--zyra-color-border-color)',
        description: 'Border color of the options panel.',
    },
];

export interface UiComponentShowcaseCard {
    slug: string;
    title: string;
    selector: string;
    importName: string;
    category: string;
    description?: string;
    icon: ZyraIconData;
    accent: UiComponentAccent;
    /** Flags the component card with a "New" or "Updated" badge. Remove once it's no longer recent. */
    status?: 'new' | 'updated';
    highlights: string[];
    exampleCode?: string;
    variants?: readonly ComponentVariant[];
    apiProps?: readonly ApiProp[];
    a11yNotes?: readonly string[];
    relatedSlugs?: readonly string[];
    tokens?: readonly TokenEntry[];
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

const BUTTON_GROUP_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraButton, ZyraButtonGroup } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-button-group',
  standalone: true,
  imports: [ZyraButton, ZyraButtonGroup],
  template: \`
    <zyra-button-group
      selectionMode="single"
      variant="outline"
      [(value)]="align"
      aria-label="Text alignment"
    >
      <zyra-button value="left">Left</zyra-button>
      <zyra-button value="center">Center</zyra-button>
      <zyra-button value="right">Right</zyra-button>
    </zyra-button-group>
  \`,
})
export class DemoButtonGroupComponent {
  align = signal('left');
}
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

const SLIDER_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraSlider } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-slider',
  standalone: true,
  imports: [FormsModule, ZyraSlider],
  template: \`
    <zyra-slider [(ngModel)]="volume" [showValue]="true" />
  \`,
})
export class DemoSliderComponent {
  volume = 40;
}
`;

const FILE_UPLOAD_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraFileUpload } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-file-upload',
  standalone: true,
  imports: [ZyraFileUpload],
  template: \`
    <zyra-file-upload
      multiple
      accept="image/*"
      [maxSizeMb]="5"
      (filesChange)="onFiles($event)"
    />
  \`,
})
export class DemoFileUploadComponent {
  onFiles(files: File[]): void {
    // upload the files
  }
}
`;

const CAROUSEL_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraCarousel, ZyraCarouselSlide } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-carousel',
  standalone: true,
  imports: [ZyraCarousel, ZyraCarouselSlide],
  template: \`
    <zyra-carousel loop autoplay>
      <zyra-carousel-slide>Slide 1</zyra-carousel-slide>
      <zyra-carousel-slide>Slide 2</zyra-carousel-slide>
      <zyra-carousel-slide>Slide 3</zyra-carousel-slide>
    </zyra-carousel>
  \`,
})
export class DemoCarouselComponent {}
`;

const CALENDAR_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraCalendar } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-calendar',
  standalone: true,
  imports: [FormsModule, ZyraCalendar],
  template: \`
    <zyra-calendar [(ngModel)]="selectedDate" />
  \`,
})
export class DemoCalendarComponent {
  selectedDate: Date | null = null;
}
`;

const DATE_PICKER_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraDatePicker } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-date-picker',
  standalone: true,
  imports: [FormsModule, ZyraDatePicker],
  template: \`
    <zyra-date-picker [(ngModel)]="selectedDate" placeholder="Select date" />
  \`,
})
export class DemoDatePickerComponent {
  selectedDate: Date | null = null;
}
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

const CONFIRM_DIALOG_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraConfirmDialog, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-confirm-dialog',
  standalone: true,
  imports: [ZyraConfirmDialog, ZyraButton],
  template: \`
    <zyra-button variant="danger" (clicked)="open.set(true)">Delete item</zyra-button>

    <zyra-confirm-dialog
      [(open)]="open"
      title="Delete item?"
      message="This action cannot be undone."
      tone="danger"
      (confirmed)="onDelete()"
    />
  \`,
})
export class DemoConfirmDialogComponent {
  open = signal(false);

  onDelete(): void {
    // perform the delete, then close
    this.open.set(false);
  }
}
`;

const THEME_SWITCH_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { ZyraThemeSwitch } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-theme-switch',
  standalone: true,
  imports: [ZyraThemeSwitch],
  template: \`
    <zyra-theme-switch />
  \`,
})
export class DemoThemeSwitchComponent {}
`;

const DRAWER_EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { ZyraDrawer, ZyraButton } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-drawer',
  standalone: true,
  imports: [ZyraDrawer, ZyraButton],
  template: \`
    <zyra-button (clicked)="open.set(true)">Open filters</zyra-button>

    <zyra-drawer [(open)]="open" title="Filters" side="right">
      <p>Filter controls go here.</p>

      <div slot="footer">
        <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>
        <zyra-button variant="primary" (clicked)="open.set(false)">Apply</zyra-button>
      </div>
    </zyra-drawer>
  \`,
})
export class DemoDrawerComponent {
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

const MULTI_SELECT_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraMultiSelect, ZyraOption } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-multi-select',
  standalone: true,
  imports: [FormsModule, ZyraMultiSelect, ZyraOption],
  template: \`
    <zyra-multi-select [(ngModel)]="frameworks" placeholder="Choose frameworks">
      <zyra-option value="angular">Angular</zyra-option>
      <zyra-option value="react">React</zyra-option>
      <zyra-option value="vue">Vue</zyra-option>
    </zyra-multi-select>
  \`,
})
export class DemoMultiSelectComponent {
  frameworks: (string | number)[] = [];
}
`;

const AUTOCOMPLETE_EXAMPLE_CODE = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraAutocomplete, ZyraOption } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-autocomplete',
  standalone: true,
  imports: [FormsModule, ZyraAutocomplete, ZyraOption],
  template: \`
    <zyra-autocomplete [(ngModel)]="framework" placeholder="Search frameworks">
      <zyra-option value="angular">Angular</zyra-option>
      <zyra-option value="react">React</zyra-option>
      <zyra-option value="vue">Vue</zyra-option>
    </zyra-autocomplete>
  \`,
})
export class DemoAutocompleteComponent {
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
        tokens: [
            {
                name: 'Primary background',
                variable: '--zyra-color-btn-primary-bg',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Fill color of the primary variant.',
            },
            {
                name: 'Primary border',
                variable: '--zyra-color-btn-primary-border',
                defaultValue: 'var(--zyra-color-primary-border)',
                description: 'Border color of the primary variant.',
            },
            {
                name: 'Primary hover background',
                variable: '--zyra-color-btn-primary-hover-bg',
                defaultValue: 'var(--zyra-color-primary-hover)',
                description: 'Fill color of the primary variant on hover.',
            },
            {
                name: 'Secondary background',
                variable: '--zyra-color-btn-secondary-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the secondary variant.',
            },
            {
                name: 'Secondary text',
                variable: '--zyra-color-btn-secondary-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Label color of the secondary variant.',
            },
            {
                name: 'Secondary border',
                variable: '--zyra-color-btn-secondary-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the secondary variant.',
            },
            {
                name: 'Secondary hover background',
                variable: '--zyra-color-btn-secondary-hover-bg',
                defaultValue: 'var(--zyra-color-surface-raised)',
                description: 'Fill color of the secondary variant on hover.',
            },
            {
                name: 'Secondary hover border',
                variable: '--zyra-color-btn-secondary-hover-border',
                defaultValue: 'var(--zyra-color-border-hover)',
                description: 'Border color of the secondary variant on hover.',
            },
            {
                name: 'Ghost text',
                variable: '--zyra-color-btn-ghost-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Label color of the ghost variant.',
            },
            {
                name: 'Ghost hover text',
                variable: '--zyra-color-btn-ghost-hover-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Label color of the ghost variant on hover.',
            },
            {
                name: 'Danger background',
                variable: '--zyra-color-btn-danger-bg',
                defaultValue: 'var(--zyra-color-danger-subtle)',
                description: 'Fill color of the danger variant.',
            },
            {
                name: 'Danger text',
                variable: '--zyra-color-btn-danger-text',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Label color of the danger variant.',
            },
            {
                name: 'Danger border',
                variable: '--zyra-color-btn-danger-border',
                defaultValue: 'var(--zyra-color-danger-border-color)',
                description: 'Border color of the danger variant.',
            },
            {
                name: 'Danger hover background',
                variable: '--zyra-color-btn-danger-hover-bg',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Fill color of the danger variant on hover — inverts with its resting text color.',
            },
            {
                name: 'Danger hover text',
                variable: '--zyra-color-btn-danger-hover-text',
                defaultValue: 'var(--zyra-color-foreground-inverse)',
                description: 'Label color of the danger variant on hover, kept readable against the inverted fill.',
            },
            {
                name: 'Outline hover background',
                variable: '--zyra-color-btn-outline-hover-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color of the outline variant on hover.',
            },
            {
                name: 'Outline hover border',
                variable: '--zyra-color-btn-outline-hover-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border color of the outline variant on hover.',
            },
            {
                name: 'Disabled opacity',
                variable: '--zyra-btn-disabled-opacity',
                defaultValue: '0.42',
                description: 'Opacity applied to any variant when disabled.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-btn-focus-ring',
                defaultValue: 'var(--zyra-ring)',
                description: 'Focus-visible ring shadow shown on keyboard focus.',
            },
        ],
        relatedSlugs: ['badge', 'chip', 'switch', 'button-group'],
    },
    {
        slug: 'button-group',
        title: 'Button Group',
        selector: 'zyra-button-group',
        importName: 'ZyraButtonGroup',
        category: 'Actions',
        description:
            'Coordinates a set of ZyraButton children — shared size/variant/color/radius, layout, and optional single/multiple selection — without duplicating Button behavior.',
        icon: square,
        accent: 'blue',
        highlights: [
            'Buttons stay the single source of truth',
            'Attached (segmented) or separated layout',
            'Single/multiple selection, controlled or uncontrolled',
        ],
        exampleCode: BUTTON_GROUP_EXAMPLE_CODE,
        variants: [
            { name: 'separated', description: 'Default spacing, each button keeps its own radius' },
            { name: 'attached', description: 'Segmented control — joined borders, no gap' },
            { name: 'selectionMode="single"', description: 'Radiogroup semantics, one value selected' },
            { name: 'selectionMode="multiple"', description: 'Toolbar of toggle buttons, aria-pressed' },
            { name: 'selectionMode="none"', description: 'Plain cluster of independent actions' },
        ],
        apiProps: [
            {
                name: 'orientation',
                type: "'horizontal' | 'vertical'",
                default: "'horizontal'",
                description: 'Layout direction',
            },
            {
                name: 'join',
                type: "'attached' | 'separated'",
                default: "'separated'",
                description: 'Segmented (joined) vs spaced layout',
            },
            {
                name: 'gap',
                type: "'none' | 'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Spacing between buttons when separated',
            },
            {
                name: 'fullWidth',
                type: 'boolean',
                default: 'false',
                description: 'Stretches buttons to evenly fill the container',
            },
            {
                name: 'wrap',
                type: 'boolean',
                default: 'false',
                description: 'Allows buttons to wrap onto multiple lines',
            },
            {
                name: 'size, variant, color, radius',
                type: 'ButtonSize | ButtonVariant | ButtonColor | ButtonRadius',
                default: 'undefined',
                description: 'Shared config pushed to children; a child’s own input always wins',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables every button in the group',
            },
            {
                name: 'selectionMode',
                type: "'none' | 'single' | 'multiple'",
                default: "'none'",
                description: 'Whether the group tracks a selected value',
            },
            {
                name: 'allowEmptySelection',
                type: 'boolean',
                default: 'false',
                description: 'Single-select only: clicking the selected button again clears it',
            },
            {
                name: 'value',
                type: 'string | number | (string | number)[] | null',
                default: 'null',
                description: 'Two-way bindable selection; also works with ngModel/reactive forms',
            },
        ],
        a11yNotes: [
            'role="radiogroup" + role="radio"/aria-checked in single-select mode',
            'role="group" + aria-pressed on each button in multiple-select mode',
            'Arrow keys move focus (and select, in single mode); Home/End jump to first/last enabled button',
            'Roving tabindex keeps exactly one button in the Tab order at a time',
            'Disabled buttons are skipped during keyboard navigation',
        ],
        relatedSlugs: ['button', 'radio', 'chip'],
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
        tokens: [
            {
                name: 'Default background',
                variable: '--zyra-color-badge-default-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the default (neutral) variant.',
            },
            {
                name: 'Default text',
                variable: '--zyra-color-badge-default-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Label color of the default variant.',
            },
            {
                name: 'Default border',
                variable: '--zyra-color-badge-default-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the default variant.',
            },
            {
                name: 'Success background',
                variable: '--zyra-color-badge-success-bg',
                defaultValue: 'var(--zyra-color-success-subtle)',
                description: 'Fill color of the success variant.',
            },
            {
                name: 'Success text',
                variable: '--zyra-color-badge-success-text',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Label and dot color of the success variant.',
            },
            {
                name: 'Success border',
                variable: '--zyra-color-badge-success-border',
                defaultValue: 'var(--zyra-color-success-border-color)',
                description: 'Border color of the success variant.',
            },
            {
                name: 'Warning background',
                variable: '--zyra-color-badge-warning-bg',
                defaultValue: 'var(--zyra-color-warning-subtle)',
                description: 'Fill color of the warning variant.',
            },
            {
                name: 'Warning text',
                variable: '--zyra-color-badge-warning-text',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Label and dot color of the warning variant.',
            },
            {
                name: 'Warning border',
                variable: '--zyra-color-badge-warning-border',
                defaultValue: 'var(--zyra-color-warning-border-color)',
                description: 'Border color of the warning variant.',
            },
            {
                name: 'Danger background',
                variable: '--zyra-color-badge-danger-bg',
                defaultValue: 'var(--zyra-color-danger-subtle)',
                description: 'Fill color of the danger variant.',
            },
            {
                name: 'Danger text',
                variable: '--zyra-color-badge-danger-text',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Label and dot color of the danger variant.',
            },
            {
                name: 'Danger border',
                variable: '--zyra-color-badge-danger-border',
                defaultValue: 'var(--zyra-color-danger-border-color)',
                description: 'Border color of the danger variant.',
            },
            {
                name: 'Info background',
                variable: '--zyra-color-badge-info-bg',
                defaultValue: 'var(--zyra-color-info-subtle)',
                description: 'Fill color of the info variant.',
            },
            {
                name: 'Info text',
                variable: '--zyra-color-badge-info-text',
                defaultValue: 'var(--zyra-color-info-foreground)',
                description: 'Label and dot color of the info variant.',
            },
            {
                name: 'Info border',
                variable: '--zyra-color-badge-info-border',
                defaultValue: 'var(--zyra-color-info-border-color)',
                description: 'Border color of the info variant.',
            },
            {
                name: 'Purple background',
                variable: '--zyra-color-badge-purple-bg',
                defaultValue: 'var(--zyra-color-purple-subtle)',
                description: 'Fill color of the purple variant.',
            },
            {
                name: 'Purple text',
                variable: '--zyra-color-badge-purple-text',
                defaultValue: 'var(--zyra-color-purple-foreground)',
                description: 'Label and dot color of the purple variant.',
            },
            {
                name: 'Purple border',
                variable: '--zyra-color-badge-purple-border',
                defaultValue: 'var(--zyra-color-purple-border-color)',
                description: 'Border color of the purple variant.',
            },
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
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-card-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description:
                    'Border color for the default, outlined, and elevated variants. Falls back to this Tier 2 token, but every theme redeclares it with a tuned value that wins in practice — your own override still applies normally since it loads after the theme.',
            },
            {
                name: 'Radius',
                variable: '--zyra-card-radius',
                defaultValue: '20px',
                description: 'Corner radius of the card surface. Same across all themes.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-card-focus-ring',
                defaultValue: 'var(--zyra-ring)',
                description: 'Focus-visible ring shadow shown when a clickable card is keyboard-focused.',
            },
            {
                name: 'Inset highlight',
                variable: '--zyra-card-inset-highlight',
                defaultValue: 'color-mix(in srgb, var(--zyra-color-foreground-inverse) 5%, transparent)',
                description: 'Subtle 1px top-edge highlight line in the resting state.',
            },
            {
                name: 'Inset highlight (hover)',
                variable: '--zyra-card-inset-highlight-hover',
                defaultValue: 'color-mix(in srgb, var(--zyra-color-foreground-inverse) 8%, transparent)',
                description: 'Top-edge highlight line on hover and keyboard focus — slightly brighter.',
            },
            {
                name: 'Inset highlight (active)',
                variable: '--zyra-card-inset-highlight-active',
                defaultValue: 'color-mix(in srgb, var(--zyra-color-foreground-inverse) 4%, transparent)',
                description: 'Top-edge highlight line while a clickable card is being pressed — slightly dimmer.',
            },
            {
                name: 'Shadow',
                variable: '--zyra-card-shadow',
                defaultValue: 'var(--zyra-shadow-sm)',
                description: 'Resting drop shadow. Tuned per theme; falls back to the generic small shadow if unset.',
            },
            {
                name: 'Elevated shadow',
                variable: '--zyra-card-elevated-shadow',
                defaultValue: 'var(--zyra-shadow-md)',
                description: 'Drop shadow on hover, keyboard focus, and the elevated variant. Tuned per theme.',
            },
            {
                name: 'Glow border',
                variable: '--zyra-color-glow-border',
                defaultValue: 'rgba(var(--zyra-color-glow), 0.46)',
                description: 'Border color on hover and keyboard focus.',
            },
            {
                name: 'Glow shadow',
                variable: '--zyra-color-glow-shadow',
                defaultValue: '0 24px 70px rgba(var(--zyra-color-glow), 0.18)',
                description: 'Extra ambient glow shadow shown on keyboard focus.',
            },
            {
                name: 'Glow surface',
                variable: '--zyra-color-glow-surface',
                defaultValue: 'rgba(var(--zyra-color-glow), 0.1)',
                description: 'Radial gradient tint that fades in behind the card on hover/focus.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-code-block-bg',
                defaultValue: 'var(--zyra-color-surface-code)',
                description: 'Fill color of the code area. Tuned per theme, deliberately darker than the default surface.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-code-block-border',
                defaultValue: 'var(--zyra-color-primary-border)',
                description: 'Border color of the whole block.',
            },
            {
                name: 'Header background',
                variable: '--zyra-color-code-block-header-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the filename/language/copy-button header row.',
            },
            {
                name: 'Keyword',
                variable: '--zyra-color-code-keyword',
                defaultValue: 'var(--zyra-color-accent-secondary)',
                description: 'Syntax color for language keywords.',
            },
            {
                name: 'Tag',
                variable: '--zyra-color-code-tag',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Syntax color for markup tags.',
            },
            {
                name: 'Attribute',
                variable: '--zyra-color-code-attr',
                defaultValue: 'var(--zyra-color-accent-tertiary)',
                description: 'Syntax color for HTML/JSX attributes.',
            },
            {
                name: 'String',
                variable: '--zyra-color-code-string',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Syntax color for string literals.',
            },
            {
                name: 'Number',
                variable: '--zyra-color-code-number',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Syntax color for numeric literals.',
            },
            {
                name: 'Comment',
                variable: '--zyra-color-code-comment',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Syntax color for comments.',
            },
            {
                name: 'Punctuation',
                variable: '--zyra-color-code-punct',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Syntax color for brackets, semicolons, and other punctuation.',
            },
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
        tokens: [
            {
                name: 'Link text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of non-current, non-hovered link items.',
            },
            {
                name: 'Link text (hover)',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Color of a link item on hover.',
            },
            {
                name: 'Current item text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Color of the current-page item, and of a link item while focused.',
            },
            {
                name: 'Separator',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Color of the decorative separator between items.',
            },
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
        tokens: [
            {
                name: 'Panel background',
                variable: '--zyra-color-background-elevated',
                defaultValue: 'var(--zyra-color-bg-panel)',
                description: 'Fill color of the dropdown panel.',
            },
            {
                name: 'Panel border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of the dropdown panel.',
            },
            {
                name: 'Item text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Text color of a default menu item.',
            },
            {
                name: 'Item hover background',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Used at 8% opacity as the hover background for a default item.',
            },
            {
                name: 'Item disabled text',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Text color of a disabled menu item.',
            },
            {
                name: 'Danger item text',
                variable: '--zyra-color-danger-foreground',
                defaultValue: 'var(--zyra-color-danger)',
                description: 'Text color of a danger-variant item, and (at 10% opacity) its hover background.',
            },
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
        tokens: [
            {
                name: 'Teal gradient end',
                variable: '--zyra-color-avatar-primary-end',
                defaultValue: 'var(--zyra-color-accent-secondary)',
                description: 'End color of the diagonal gradient for the teal (default) variant.',
            },
            {
                name: 'Blue gradient end',
                variable: '--zyra-color-avatar-blue-end',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'End color of the diagonal gradient for the blue variant.',
            },
            {
                name: 'Purple gradient end',
                variable: '--zyra-color-avatar-purple-end',
                defaultValue: 'var(--zyra-color-accent-secondary)',
                description: 'End color of the diagonal gradient for the purple variant.',
            },
            {
                name: 'Warm gradient end',
                variable: '--zyra-color-avatar-warm-end',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'End color of the diagonal gradient for the warm variant.',
            },
            {
                name: 'Initials contrast',
                variable: '--zyra-color-avatar-contrast',
                defaultValue: 'var(--zyra-color-on-brand)',
                description: 'Text color of the initials fallback on any gradient variant.',
            },
            {
                name: 'Neutral background',
                variable: '--zyra-color-surface-inset',
                defaultValue: 'var(--zyra-color-bg-surface)',
                description: 'Fill color of the neutral variant (flat, not a gradient).',
            },
            {
                name: 'Neutral text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Initials color of the neutral variant.',
            },
            {
                name: 'Presence ring',
                variable: '--zyra-color-background-elevated',
                defaultValue: 'var(--zyra-color-bg-panel)',
                description: 'Border color around the presence dot, matching the surface the avatar sits on.',
            },
            {
                name: 'Online dot',
                variable: '--zyra-color-success-foreground',
                defaultValue: 'var(--zyra-color-success)',
                description: 'Fill color of the presence dot when online is true.',
            },
            {
                name: 'Offline dot',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Fill color of the presence dot when online is explicitly false.',
            },
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
            {
                name: 'debounced search',
                description: 'type="search" with [debounce] to emit (searched) after the user pauses typing',
            },
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
                name: 'debounce',
                type: 'number',
                default: '0',
                description:
                    'Milliseconds to wait after the last keystroke before emitting `search`. 0 disables debouncing',
            },
            {
                name: 'valueChange (output)',
                type: 'string',
                default: '-',
                description: 'Emits the current string value on every keystroke',
            },
            {
                name: 'searched (output)',
                type: 'string',
                default: '-',
                description:
                    'Emits the value once `debounce` ms have elapsed since the last keystroke (only when debounce > 0)',
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
            'type="search" fields clear on Escape, matching native browser search inputs',
        ],
        tokens: [
            {
                name: 'Text',
                variable: '--zyra-color-input-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Color of the typed value, including autofilled text.',
            },
            {
                name: 'Placeholder',
                variable: '--zyra-color-input-placeholder',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Color of the placeholder text shown when empty.',
            },
            {
                name: 'OTP box background',
                variable: '--zyra-color-field-bg',
                defaultValue: 'var(--zyra-color-input-bg)',
                description: 'Fill color of each OTP box. Shared with ZyraFormField — see its Tokens section.',
            },
            {
                name: 'OTP box border',
                variable: '--zyra-color-field-border',
                defaultValue: 'var(--zyra-color-input-border)',
                description: 'Border color of each OTP box in its resting state.',
            },
            {
                name: 'OTP box focus border',
                variable: '--zyra-color-field-focus-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border color of an OTP box on focus, or once filled.',
            },
            {
                name: 'OTP box focus shadow',
                variable: '--zyra-field-focus-shadow',
                defaultValue: 'var(--zyra-input-shadow-focus)',
                description: 'Ring shadow shown on a focused OTP box.',
            },
        ],
        relatedSlugs: ['form-field', 'switch', 'button'],
    },
    {
        slug: 'slider',
        title: 'Slider',
        selector: 'zyra-slider',
        importName: 'ZyraSlider',
        category: 'Forms',
        description:
            'Range input for numeric selection — a fully styled native <input type="range"> that keeps native keyboard, drag, and touch support for free.',
        icon: keyboard,
        accent: 'amber',
        status: 'new',
        highlights: [
            'Styled native range input — no reimplemented drag/keyboard handling',
            'Optional live value label',
            'Works with Angular forms (CVA) like any other control',
        ],
        exampleCode: SLIDER_EXAMPLE_CODE,
        variants: [
            { name: 'sm / md / lg', description: 'Track thickness and thumb size scale with the size input' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'number',
                default: '0',
                description: 'Two-way bound current value via [(value)] or ngModel',
            },
            {
                name: 'min',
                type: 'number',
                default: '0',
                description: 'Minimum value',
            },
            {
                name: 'max',
                type: 'number',
                default: '100',
                description: 'Maximum value',
            },
            {
                name: 'step',
                type: 'number',
                default: '1',
                description: 'Increment size',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Track thickness and thumb size',
            },
            {
                name: 'showValue',
                type: 'boolean',
                default: 'false',
                description: 'Shows the current value as a label next to the track',
            },
            {
                name: 'valueLabel',
                type: '(value: number) => string',
                default: '(v) => `${v}`',
                description: 'Formats the displayed value, e.g. as a percentage',
            },
            {
                name: 'changed (output)',
                type: 'number',
                default: '-',
                description: 'Emits the new value on every input event',
            },
        ],
        a11yNotes: [
            'Native <input type="range"> under the hood — Arrow keys, Home/End, and Page Up/Down all work out of the box',
            'aria-valuetext reflects the formatted (valueLabel) display value for screen readers',
        ],
        tokens: [
            {
                name: 'Track',
                variable: '--zyra-color-slider-track',
                defaultValue: 'var(--zyra-color-border-strong-color)',
                description: 'Color of the unfilled portion of the track.',
            },
            {
                name: 'Fill',
                variable: '--zyra-color-slider-fill',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Color of the filled portion of the track, and the thumb’s outer ring.',
            },
            {
                name: 'Thumb',
                variable: '--zyra-color-slider-thumb',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Fill color of the draggable thumb.',
            },
            {
                name: 'Thumb ring',
                variable: '--zyra-color-slider-thumb-ring',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Ring shadow shown on hover/focus.',
            },
            {
                name: 'Value text',
                variable: '--zyra-color-slider-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Color of the formatted value label.',
            },
        ],
        relatedSlugs: ['input', 'rating', 'switch'],
    },
    {
        slug: 'file-upload',
        title: 'File Upload',
        selector: 'zyra-file-upload',
        importName: 'ZyraFileUpload',
        category: 'Forms',
        description:
            'Click-to-browse and drag-and-drop file picker with type/size/count validation and a removable file list.',
        icon: keyboard,
        accent: 'amber',
        status: 'new',
        highlights: [
            'Click or drag-and-drop to select files',
            'Validates type (accept), size (maxSizeMb), and count (maxFiles), reporting rejects separately',
            'Selected files render as a removable list with formatted sizes',
        ],
        exampleCode: FILE_UPLOAD_EXAMPLE_CODE,
        variants: [
            { name: 'single', description: 'Default — selecting a new file replaces the current one' },
            { name: 'multiple', description: 'Accumulates files across selections up to maxFiles' },
        ],
        apiProps: [
            {
                name: 'multiple',
                type: 'boolean',
                default: 'false',
                description: 'Allows selecting/accumulating more than one file',
            },
            {
                name: 'accept',
                type: 'string',
                default: "''",
                description: 'Comma-separated extensions/MIME patterns, e.g. ".pdf,image/*"',
            },
            {
                name: 'maxSizeMb',
                type: 'number | null',
                default: 'null',
                description: 'Rejects files larger than this size',
            },
            {
                name: 'maxFiles',
                type: 'number | null',
                default: 'null',
                description: 'Rejects files beyond this count',
            },
            {
                name: 'filesChange (output)',
                type: 'File[]',
                default: '-',
                description: 'Emits the current accepted file list whenever it changes',
            },
            {
                name: 'rejected (output)',
                type: "{ file: File; reason: 'size' | 'type' | 'count' }[]",
                default: '-',
                description: 'Emits files that failed validation, with the reason for each',
            },
        ],
        a11yNotes: [
            'Dropzone is a role="button" with tabindex="0" — Enter/Space opens the file picker',
            'Each file in the list has a labeled, keyboard-accessible remove button',
        ],
        tokens: [
            {
                name: 'Dropzone background',
                variable: '--zyra-color-file-upload-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the dropzone and each listed file row.',
            },
            {
                name: 'Dropzone border',
                variable: '--zyra-color-file-upload-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Dashed border color of the dropzone, and the border of each file row.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-file-upload-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Primary text color for dropzone copy and file names.',
            },
        ],
        relatedSlugs: ['input', 'button', 'form-field'],
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
        tokens: [
            {
                name: 'Label',
                variable: '--zyra-color-field-label-color',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Color of the field label.',
            },
            {
                name: 'Required mark',
                variable: '--zyra-color-field-required-mark',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Color of the required-field asterisk.',
            },
            {
                name: 'Icon',
                variable: '--zyra-color-field-icon-color',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Color of the prefix/suffix icon, clear button, and loading spinner.',
            },
            {
                name: 'Background',
                variable: '--zyra-color-field-bg',
                defaultValue: 'var(--zyra-color-input-bg)',
                description: 'Fill color of the field in the outline/filled appearances.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-field-border',
                defaultValue: 'var(--zyra-color-input-border)',
                description: 'Border color of the field in its resting state.',
            },
            {
                name: 'Filled background',
                variable: '--zyra-color-field-filled-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color specific to the filled appearance.',
            },
            {
                name: 'Focus border',
                variable: '--zyra-color-field-focus-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border/underline color and label color when the field is focused.',
            },
            {
                name: 'Hint',
                variable: '--zyra-color-field-hint-color',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Color of the helper text below the field.',
            },
            {
                name: 'Counter',
                variable: '--zyra-color-field-counter-color',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Color of the character counter.',
            },
            {
                name: 'Counter (warn)',
                variable: '--zyra-color-field-counter-warn',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Counter color when approaching the character limit.',
            },
            {
                name: 'Counter (error)',
                variable: '--zyra-color-field-counter-error',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Counter color when over the character limit.',
            },
            {
                name: 'Success color',
                variable: '--zyra-color-field-success-color',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Border, label, and hint color in the success state.',
            },
            {
                name: 'Success shadow',
                variable: '--zyra-field-success-shadow',
                defaultValue: '0 0 0 3px var(--zyra-color-success-subtle)',
                description: 'Focus ring shadow in the success state.',
            },
            {
                name: 'Error color',
                variable: '--zyra-color-field-error-color',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Border, label, and hint color in the error state.',
            },
            {
                name: 'Error shadow',
                variable: '--zyra-field-error-shadow',
                defaultValue: '0 0 0 3px var(--zyra-color-danger-subtle)',
                description: 'Focus ring shadow in the error state.',
            },
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
        tokens: [
            {
                name: 'Accent track',
                variable: '--zyra-color-primary-subtle',
                defaultValue: 'var(--zyra-color-accent-muted)',
                description: 'Ring color of the accent variant.',
            },
            {
                name: 'Accent head',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Spinning-tip color of the accent variant.',
            },
            {
                name: 'Inverse track',
                variable: '--zyra-color-spinner-inverse-track',
                defaultValue: 'tuned per theme',
                description: 'Ring color of the white variant. Always light regardless of app theme, not tied to text color.',
            },
            {
                name: 'Inverse head',
                variable: '--zyra-color-spinner-inverse-head',
                defaultValue: 'tuned per theme',
                description: 'Spinning-tip color of the white variant.',
            },
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-toast-bg',
                defaultValue: 'tuned per theme',
                description: 'Fill color of every toast, regardless of variant.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-toast-border',
                defaultValue: 'tuned per theme',
                description: 'Border color of the default variant (non-status toasts).',
            },
            {
                name: 'Default icon background',
                variable: '--zyra-color-toast-default-icon-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Icon fill color for the default (non-status) variant.',
            },
            {
                name: 'Default icon text',
                variable: '--zyra-color-toast-default-icon-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Icon glyph color for the default variant.',
            },
            {
                name: 'Success border',
                variable: '--zyra-color-success-border-color',
                defaultValue: 'var(--zyra-color-success-border)',
                description: 'Border color of a success toast.',
            },
            {
                name: 'Success icon',
                variable: '--zyra-color-toast-success-icon-bg',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Icon fill color for a success toast — paired with --zyra-color-toast-success-icon-text (var(--zyra-color-on-success)).',
            },
            {
                name: 'Danger border',
                variable: '--zyra-color-danger-border-color',
                defaultValue: 'var(--zyra-color-danger-border)',
                description: 'Border color of an error toast.',
            },
            {
                name: 'Danger icon',
                variable: '--zyra-color-toast-danger-icon-bg',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Icon fill color for an error toast — paired with --zyra-color-toast-danger-icon-text (var(--zyra-color-on-danger)).',
            },
            {
                name: 'Warning border',
                variable: '--zyra-color-warning-border-color',
                defaultValue: 'var(--zyra-color-warning-border)',
                description: 'Border color of a warning toast.',
            },
            {
                name: 'Warning icon',
                variable: '--zyra-color-toast-warning-icon-bg',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Icon fill color for a warning toast — paired with --zyra-color-toast-warning-icon-text (var(--zyra-color-on-warning)).',
            },
            {
                name: 'Info border',
                variable: '--zyra-color-info-border-color',
                defaultValue: 'var(--zyra-color-info-border)',
                description: 'Border color of an info toast.',
            },
            {
                name: 'Info icon',
                variable: '--zyra-color-toast-info-icon-bg',
                defaultValue: 'var(--zyra-color-info-foreground)',
                description: 'Icon fill color for an info toast — paired with --zyra-color-toast-info-icon-text (var(--zyra-color-on-info)).',
            },
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-tooltip-bg',
                defaultValue: 'tuned per theme',
                description: 'Fill color of the tooltip bubble and its directional arrow.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-tooltip-text',
                defaultValue: 'tuned per theme',
                description: 'Text color inside the tooltip.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-tooltip-border',
                defaultValue: 'tuned per theme',
                description: 'Border color of the tooltip bubble.',
            },
            {
                name: 'Shadow',
                variable: '--zyra-tooltip-shadow',
                defaultValue: 'tuned per theme',
                description: 'Drop shadow behind the tooltip bubble.',
            },
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
        tokens: [
            {
                name: 'Backdrop',
                variable: '--zyra-color-overlay-scrim',
                defaultValue: 'var(--zyra-color-overlay-bg)',
                description: 'Fill color of the scrim behind the dialog.',
            },
            {
                name: 'Panel background',
                variable: '--zyra-color-surface',
                defaultValue: 'var(--zyra-color-card-bg)',
                description: 'Fill color of the dialog panel.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of the panel, header divider, and footer divider.',
            },
            {
                name: 'Title text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Color of the dialog title, and of the close button on hover.',
            },
            {
                name: 'Close button',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the close × button in its resting state.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-ring',
                defaultValue: 'var(--zyra-focus-ring)',
                description: 'Outline color when the close button is keyboard-focused.',
            },
            {
                name: 'Panel shadow',
                variable: '--zyra-modal-shadow',
                defaultValue: 'var(--zyra-shadow-md)',
                description: 'Drop shadow behind the dialog panel — its own token, not borrowed from Card.',
            },
        ],
        relatedSlugs: ['button', 'tooltip', 'accordion'],
    },
    {
        slug: 'confirm-dialog',
        title: 'Confirm Dialog',
        selector: 'zyra-confirm-dialog',
        importName: 'ZyraConfirmDialog',
        category: 'Overlays',
        description:
            'Purpose-built modal for confirm/cancel prompts — title, message, and Cancel/Confirm actions wired up on top of zyra-modal.',
        icon: check,
        accent: 'purple',
        status: 'new',
        highlights: [
            'Wraps zyra-modal — same focus trap, ESC, and backdrop dismiss',
            'Danger tone for destructive actions',
            'Loading state disables actions during an async confirm',
        ],
        exampleCode: CONFIRM_DIALOG_EXAMPLE_CODE,
        variants: [
            { name: 'default', description: 'Neutral confirm action (primary button)' },
            { name: 'danger', description: 'Destructive confirm action (danger button)' },
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
                default: "'Are you sure?'",
                description: 'Dialog heading',
            },
            {
                name: 'message',
                type: 'string',
                default: "''",
                description: 'Body text shown when no content is projected',
            },
            {
                name: 'tone',
                type: "'default' | 'danger'",
                default: "'default'",
                description: 'Controls the Confirm button color',
            },
            {
                name: 'confirmLabel',
                type: 'string',
                default: "'Confirm'",
                description: 'Text for the confirm button',
            },
            {
                name: 'cancelLabel',
                type: 'string',
                default: "'Cancel'",
                description: 'Text for the cancel button',
            },
            {
                name: 'loading',
                type: 'boolean',
                default: 'false',
                description: 'Shows a loading state on the confirm button and disables both actions',
            },
            {
                name: 'confirmed (output)',
                type: 'void',
                default: '-',
                description: 'Emits when Confirm is clicked (dialog does not auto-close)',
            },
            {
                name: 'cancelled (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the dialog is dismissed via Cancel, ESC, or backdrop click',
            },
        ],
        a11yNotes: [
            'Inherits role="dialog" and aria-modal="true" from zyra-modal',
            'Focus is trapped inside the dialog while open, and ESC dismisses it',
            'Cancel and Confirm buttons are disabled while loading to prevent double submission',
        ],
        tokens: [
            {
                name: 'Message text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the body message text. Everything else (panel, backdrop, title) comes from zyra-modal — see its Tokens section.',
            },
        ],
        relatedSlugs: ['modal', 'button', 'drawer'],
    },
    {
        slug: 'theme-switch',
        title: 'Theme Switch',
        selector: 'zyra-theme-switch',
        importName: 'ZyraThemeSwitch',
        category: 'Overlays',
        description:
            'Drop-in theme picker button wired directly to ZyraThemeService — a compact toggle or a full 5-theme menu.',
        icon: palette,
        accent: 'teal',
        status: 'new',
        highlights: [
            'Reads/writes theme through the existing ZyraThemeService — no wiring required',
            '"toggle" mode flips dark/light; "menu" mode picks from all 5 themes',
            'Sun/moon trigger icon reflects the active color scheme',
        ],
        exampleCode: THEME_SWITCH_EXAMPLE_CODE,
        variants: [
            { name: 'menu', description: 'Dropdown listing all 5 themes with a check on the active one' },
            { name: 'toggle', description: 'Single click flips between dark and light only' },
        ],
        apiProps: [
            {
                name: 'mode',
                type: "'menu' | 'toggle'",
                default: "'menu'",
                description: 'Whether the trigger opens a theme menu or toggles dark/light directly',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the trigger button',
            },
            {
                name: 'aria-label',
                type: 'string',
                default: "'Toggle theme'",
                description: 'Accessible name for the trigger button',
            },
        ],
        a11yNotes: [
            'Trigger has a 44×44px hit-slop for touch targets (WCAG 2.5.5) despite a 36px visual size',
            'Menu options use role="menuitemradio" with aria-checked reflecting the active theme',
            'Dropdown panel repositions to stay inside the viewport on any screen size',
        ],
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-theme-switch-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the trigger button.',
            },
            {
                name: 'Background (hover)',
                variable: '--zyra-color-theme-switch-bg-hover',
                defaultValue: 'var(--zyra-color-surface-raised)',
                description: 'Fill color of the trigger button, and of a menu option, on hover.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-theme-switch-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Text/icon color of the trigger and menu options.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-theme-switch-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the trigger button.',
            },
            {
                name: 'Panel background',
                variable: '--zyra-color-theme-switch-panel-bg',
                defaultValue: 'var(--zyra-color-surface)',
                description: 'Fill color of the menu panel (menu mode).',
            },
            {
                name: 'Panel shadow',
                variable: '--zyra-color-theme-switch-panel-shadow',
                defaultValue: 'var(--zyra-card-elevated-shadow)',
                description: 'Drop shadow behind the menu panel.',
            },
            {
                name: 'Active check',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Color of the checkmark on the active theme, and the focus outline.',
            },
        ],
        relatedSlugs: ['dropdown-menu', 'switch'],
    },
    {
        slug: 'drawer',
        title: 'Drawer',
        selector: 'zyra-drawer',
        importName: 'ZyraDrawer',
        category: 'Overlays',
        description:
            'Slide-in panel anchored to any edge of the screen, sharing zyra-modal\'s focus trap and dismiss behavior.',
        icon: panelLeft,
        accent: 'blue',
        status: 'new',
        highlights: [
            'Slides in from the left, right, top, or bottom',
            'Same focus trap, ESC, and backdrop dismiss as zyra-modal',
            'Width/height cap adapts to full-width on narrow viewports',
        ],
        exampleCode: DRAWER_EXAMPLE_CODE,
        variants: [
            { name: 'left / right', description: 'Vertical panel, capped to sm/md/lg widths' },
            { name: 'top / bottom', description: 'Horizontal panel spanning the viewport width' },
        ],
        apiProps: [
            {
                name: 'open',
                type: 'boolean',
                default: 'false',
                description: 'Two-way bound visibility state via [(open)]',
            },
            {
                name: 'side',
                type: "'left' | 'right' | 'top' | 'bottom'",
                default: "'right'",
                description: 'Edge of the viewport the panel slides in from',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Maximum width for left/right panels',
            },
            {
                name: 'title',
                type: 'string',
                default: "''",
                description: 'Panel heading displayed in the header',
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
                description: 'Emits after the drawer finishes closing',
            },
        ],
        a11yNotes: [
            'Renders with role="dialog" and aria-modal="true"',
            'Focus is trapped inside the panel while open; ESC closes it',
            'Panel width is capped with max-width and falls back to 100% on narrow viewports',
        ],
        tokens: [
            {
                name: 'Backdrop',
                variable: '--zyra-color-overlay-scrim',
                defaultValue: 'var(--zyra-color-overlay-bg)',
                description: 'Fill color of the scrim behind the panel.',
            },
            {
                name: 'Panel background',
                variable: '--zyra-color-drawer-bg',
                defaultValue: 'var(--zyra-color-surface)',
                description: 'Fill color of the slide-in panel.',
            },
            {
                name: 'Panel text',
                variable: '--zyra-color-drawer-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Base text color inside the panel.',
            },
            {
                name: 'Panel border',
                variable: '--zyra-color-drawer-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the panel edge, header divider, and footer divider.',
            },
            {
                name: 'Panel shadow',
                variable: '--zyra-drawer-shadow',
                defaultValue: 'var(--zyra-shadow-md)',
                description: 'Drop shadow behind the slide-in panel — its own token, not borrowed from Card.',
            },
            {
                name: 'Close button',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the close × button in its resting state.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-ring',
                defaultValue: 'var(--zyra-focus-ring)',
                description: 'Outline color when the close button is keyboard-focused.',
            },
        ],
        relatedSlugs: ['modal', 'sidebar', 'confirm-dialog'],
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
        tokens: [
            {
                name: 'Success background',
                variable: '--zyra-color-alert-success-bg',
                defaultValue: 'var(--zyra-color-success-subtle)',
                description: 'Fill color of the success variant.',
            },
            {
                name: 'Success border',
                variable: '--zyra-color-alert-success-border',
                defaultValue: 'var(--zyra-color-success-border-color)',
                description: 'Border color of the success variant.',
            },
            {
                name: 'Success color',
                variable: '--zyra-color-alert-success-color',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Title, body, and dismiss-button color for the success variant; also the icon’s fill background.',
            },
            {
                name: 'Warning background',
                variable: '--zyra-color-alert-warning-bg',
                defaultValue: 'var(--zyra-color-warning-subtle)',
                description: 'Fill color of the warning variant.',
            },
            {
                name: 'Warning border',
                variable: '--zyra-color-alert-warning-border',
                defaultValue: 'var(--zyra-color-warning-border-color)',
                description: 'Border color of the warning variant.',
            },
            {
                name: 'Warning color',
                variable: '--zyra-color-alert-warning-color',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Title, body, and dismiss-button color for the warning variant; also the icon’s fill background.',
            },
            {
                name: 'Danger background',
                variable: '--zyra-color-alert-danger-bg',
                defaultValue: 'var(--zyra-color-danger-subtle)',
                description: 'Fill color of the danger variant.',
            },
            {
                name: 'Danger border',
                variable: '--zyra-color-alert-danger-border',
                defaultValue: 'var(--zyra-color-danger-border-color)',
                description: 'Border color of the danger variant.',
            },
            {
                name: 'Danger color',
                variable: '--zyra-color-alert-danger-color',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Title, body, and dismiss-button color for the danger variant; also the icon’s fill background.',
            },
            {
                name: 'Info background',
                variable: '--zyra-color-alert-info-bg',
                defaultValue: 'var(--zyra-color-info-subtle)',
                description: 'Fill color of the info variant.',
            },
            {
                name: 'Info border',
                variable: '--zyra-color-alert-info-border',
                defaultValue: 'var(--zyra-color-info-border-color)',
                description: 'Border color of the info variant.',
            },
            {
                name: 'Info color',
                variable: '--zyra-color-alert-info-color',
                defaultValue: 'var(--zyra-color-info-foreground)',
                description: 'Title, body, and dismiss-button color for the info variant; also the icon’s fill background.',
            },
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
        tokens: [
            {
                name: 'Default background',
                variable: '--zyra-color-chip-default-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the default (neutral) variant.',
            },
            {
                name: 'Default text',
                variable: '--zyra-color-chip-default-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Label color of the default variant.',
            },
            {
                name: 'Default border',
                variable: '--zyra-color-chip-default-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the default variant.',
            },
            {
                name: 'Success background',
                variable: '--zyra-color-chip-success-bg',
                defaultValue: 'var(--zyra-color-success-subtle)',
                description: 'Fill color of the success variant.',
            },
            {
                name: 'Success text',
                variable: '--zyra-color-chip-success-text',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Label color of the success variant.',
            },
            {
                name: 'Success border',
                variable: '--zyra-color-chip-success-border',
                defaultValue: 'var(--zyra-color-success-border-color)',
                description: 'Border color of the success variant.',
            },
            {
                name: 'Warning background',
                variable: '--zyra-color-chip-warning-bg',
                defaultValue: 'var(--zyra-color-warning-subtle)',
                description: 'Fill color of the warning variant.',
            },
            {
                name: 'Warning text',
                variable: '--zyra-color-chip-warning-text',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Label color of the warning variant.',
            },
            {
                name: 'Warning border',
                variable: '--zyra-color-chip-warning-border',
                defaultValue: 'var(--zyra-color-warning-border-color)',
                description: 'Border color of the warning variant.',
            },
            {
                name: 'Danger background',
                variable: '--zyra-color-chip-danger-bg',
                defaultValue: 'var(--zyra-color-danger-subtle)',
                description: 'Fill color of the danger variant.',
            },
            {
                name: 'Danger text',
                variable: '--zyra-color-chip-danger-text',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Label color of the danger variant.',
            },
            {
                name: 'Danger border',
                variable: '--zyra-color-chip-danger-border',
                defaultValue: 'var(--zyra-color-danger-border-color)',
                description: 'Border color of the danger variant.',
            },
            {
                name: 'Info background',
                variable: '--zyra-color-chip-info-bg',
                defaultValue: 'var(--zyra-color-info-subtle)',
                description: 'Fill color of the info variant.',
            },
            {
                name: 'Info text',
                variable: '--zyra-color-chip-info-text',
                defaultValue: 'var(--zyra-color-info-foreground)',
                description: 'Label color of the info variant.',
            },
            {
                name: 'Info border',
                variable: '--zyra-color-chip-info-border',
                defaultValue: 'var(--zyra-color-info-border-color)',
                description: 'Border color of the info variant.',
            },
            {
                name: 'Purple background',
                variable: '--zyra-color-chip-purple-bg',
                defaultValue: 'var(--zyra-color-purple-subtle)',
                description: 'Fill color of the purple variant.',
            },
            {
                name: 'Purple text',
                variable: '--zyra-color-chip-purple-text',
                defaultValue: 'var(--zyra-color-purple-foreground)',
                description: 'Label color of the purple variant.',
            },
            {
                name: 'Purple border',
                variable: '--zyra-color-chip-purple-border',
                defaultValue: 'var(--zyra-color-purple-border-color)',
                description: 'Border color of the purple variant.',
            },
            {
                name: 'Selected background',
                variable: '--zyra-color-chip-selected-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color when selectable and selected.',
            },
            {
                name: 'Selected text',
                variable: '--zyra-color-chip-selected-text',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Label color when selectable and selected.',
            },
            {
                name: 'Selected border',
                variable: '--zyra-color-chip-selected-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border color when selectable and selected.',
            },
            {
                name: 'Selectable ring',
                variable: '--zyra-color-chip-selectable-ring',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Ring shadow shown on hover/focus when selectable.',
            },
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
        tokens: [
            {
                name: 'Track (off)',
                variable: '--zyra-color-switch-track-off',
                defaultValue: 'var(--zyra-color-border-strong-color)',
                description: 'Background color of the track when unchecked.',
            },
            {
                name: 'Track (on)',
                variable: '--zyra-color-switch-track-on',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Background color of the track when checked.',
            },
            {
                name: 'Focus/checked ring',
                variable: '--zyra-switch-ring',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Ring shadow shown when checked and on keyboard focus.',
            },
            {
                name: 'Thumb',
                variable: '--zyra-color-switch-thumb',
                defaultValue: 'var(--zyra-color-foreground-inverse)',
                description: 'Fill color of the sliding knob.',
            },
            {
                name: 'Thumb shadow',
                variable: '--zyra-switch-thumb-shadow',
                defaultValue: 'var(--zyra-shadow-sm)',
                description: 'Drop shadow that lifts the knob off the track.',
            },
            {
                name: 'Focus glow',
                variable: '--zyra-color-glow-shadow-strong',
                defaultValue: '0 18px 46px rgba(var(--zyra-color-glow), 0.26)',
                description: 'Extra ambient glow shadow shown on keyboard focus, alongside the ring.',
            },
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
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-toggle-border',
                defaultValue: 'var(--zyra-color-border-strong-color)',
                description: 'Border color when unpressed.',
            },
            {
                name: 'Background (pressed)',
                variable: '--zyra-color-toggle-bg-on',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color when pressed.',
            },
            {
                name: 'Foreground (pressed)',
                variable: '--zyra-color-toggle-fg-on',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Text/border color when pressed, and border color on hover while unpressed.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-toggle-ring',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Ring shadow shown on keyboard focus.',
            },
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
        tokens: [
            {
                name: 'Track background',
                variable: '--zyra-color-progress-track-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Background color of the unfilled track.',
            },
            {
                name: 'Track border',
                variable: '--zyra-color-progress-track-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the track.',
            },
            {
                name: 'Label color',
                variable: '--zyra-color-progress-label-color',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Color of the percentage/custom label above the bar.',
            },
            {
                name: 'Default fill',
                variable: '--zyra-color-progress-default',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Bar fill color for the default variant.',
            },
            {
                name: 'Success fill',
                variable: '--zyra-color-progress-success',
                defaultValue: 'var(--zyra-color-success-foreground)',
                description: 'Bar fill color for the success variant.',
            },
            {
                name: 'Warning fill',
                variable: '--zyra-color-progress-warning',
                defaultValue: 'var(--zyra-color-warning-foreground)',
                description: 'Bar fill color for the warning variant.',
            },
            {
                name: 'Danger fill',
                variable: '--zyra-color-progress-danger',
                defaultValue: 'var(--zyra-color-danger-foreground)',
                description: 'Bar fill color for the danger variant.',
            },
            {
                name: 'Info fill',
                variable: '--zyra-color-progress-info',
                defaultValue: 'var(--zyra-color-info-foreground)',
                description: 'Bar fill color for the info variant.',
            },
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
        tokens: [
            {
                name: 'Line & label color',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the line itself and the optional centered label.',
            },
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
        tokens: SELECT_TOKENS,
        relatedSlugs: ['input', 'form-field', 'switch'],
    },
    {
        slug: 'multi-select',
        title: 'Multi Select',
        selector: 'zyra-multi-select',
        importName: 'ZyraMultiSelect',
        category: 'Forms',
        description:
            'Select multiple options from a dropdown list, shown as dismissible chips in the trigger — extends the same option/keyboard model as ZyraSelect.',
        icon: alignLeft,
        accent: 'teal',
        status: 'new',
        highlights: [
            'Selected values render as dismissible chips in the trigger',
            'Panel stays open after each selection so users can pick several',
            'Same keyboard navigation and ZyraOption markup as ZyraSelect',
        ],
        exampleCode: MULTI_SELECT_EXAMPLE_CODE,
        variants: [
            { name: 'outline', description: 'Default bordered appearance matching ZyraInput outline' },
            { name: 'filled', description: 'Filled background with bottom border only' },
            { name: 'underline', description: 'Minimal underline-only border' },
        ],
        apiProps: [
            {
                name: 'placeholder',
                type: 'string',
                default: "'Select options'",
                description: 'Text shown when nothing is selected',
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
                name: 'maxChips',
                type: 'number',
                default: '3',
                description: 'Maximum chips shown before collapsing into "+N more"',
            },
        ],
        a11yNotes: [
            'Panel uses role="listbox" with aria-multiselectable="true"',
            'Trigger is a div with role="button" (not <button>) since chip dismiss buttons nest inside it',
            'Arrow keys navigate options; Enter/Space toggles; Escape closes; Tab dismisses',
            'Each chip\'s dismiss button is independently focusable and keyboard-operable',
        ],
        tokens: SELECT_TOKENS,
        relatedSlugs: ['select', 'autocomplete', 'chip'],
    },
    {
        slug: 'autocomplete',
        title: 'Autocomplete',
        selector: 'zyra-autocomplete',
        importName: 'ZyraAutocomplete',
        category: 'Forms',
        description:
            'Type-to-filter combobox built on the same ZyraOption/token foundation as ZyraSelect, with a text input trigger instead of a button.',
        icon: alignLeft,
        accent: 'blue',
        status: 'new',
        highlights: [
            'Filters projected zyra-option children as you type',
            'Arrow keys + Enter select the highlighted match',
            'Reverts to the committed selection\'s label if the query no longer matches on blur',
        ],
        exampleCode: AUTOCOMPLETE_EXAMPLE_CODE,
        variants: [
            { name: 'outline', description: 'Default bordered appearance matching ZyraInput outline' },
            { name: 'filled', description: 'Filled background with bottom border only' },
            { name: 'underline', description: 'Minimal underline-only border' },
        ],
        apiProps: [
            {
                name: 'placeholder',
                type: 'string',
                default: "'Search…'",
                description: 'Placeholder text for the input',
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
                description: 'Visual style of the input',
            },
            {
                name: 'noResultsLabel',
                type: 'string',
                default: "'No results'",
                description: 'Message shown in the panel when the query matches nothing',
            },
        ],
        a11yNotes: [
            'Input uses role="combobox" with aria-autocomplete="list" and aria-expanded',
            'Panel uses role="listbox"; aria-activedescendant tracks the highlighted match',
            'Arrow keys move the highlight; Enter selects; Escape closes; Tab dismisses',
        ],
        tokens: SELECT_TOKENS,
        relatedSlugs: ['select', 'multi-select', 'input'],
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
        tokens: [
            {
                name: 'Text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Color of the typed value, including autofilled text.',
            },
            {
                name: 'Placeholder',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Color of the placeholder text shown when empty.',
            },
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-checkbox-bg',
                defaultValue: 'var(--zyra-color-input-bg)',
                description: 'Fill color of the box when unchecked.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-checkbox-border',
                defaultValue: 'var(--zyra-color-input-border)',
                description: 'Border color of the box when unchecked.',
            },
            {
                name: 'Focus shadow',
                variable: '--zyra-checkbox-focus-shadow',
                defaultValue: 'var(--zyra-input-shadow-focus)',
                description: 'Ring shadow shown on keyboard focus.',
            },
            {
                name: 'Checked background',
                variable: '--zyra-color-checkbox-checked-bg',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Fill color of the box when checked or indeterminate.',
            },
            {
                name: 'Checked border',
                variable: '--zyra-color-checkbox-checked-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border color of the box when checked, indeterminate, or hovered.',
            },
            {
                name: 'Mark',
                variable: '--zyra-color-checkbox-mark',
                defaultValue: 'var(--zyra-color-foreground-inverse)',
                description: 'Color of the check/dash icon drawn inside the box.',
            },
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-radio-bg',
                defaultValue: 'var(--zyra-color-input-bg)',
                description: 'Fill color of each radio circle when unselected.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-radio-border',
                defaultValue: 'var(--zyra-color-input-border)',
                description: 'Border color of each radio circle when unselected.',
            },
            {
                name: 'Focus shadow',
                variable: '--zyra-radio-focus-shadow',
                defaultValue: 'var(--zyra-input-shadow-focus)',
                description: 'Ring shadow shown on keyboard focus.',
            },
            {
                name: 'Checked border',
                variable: '--zyra-color-radio-checked-border',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Border color when selected, or hovered while unselected.',
            },
            {
                name: 'Checked background',
                variable: '--zyra-color-radio-checked-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color of the circle when selected.',
            },
            {
                name: 'Dot',
                variable: '--zyra-color-radio-dot',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Color of the inner dot shown when selected.',
            },
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
        tokens: [
            {
                name: 'Text',
                variable: '--zyra-color-tabs-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Label color of an inactive, enabled trigger.',
            },
            {
                name: 'Text (hover)',
                variable: '--zyra-color-tabs-text-hover',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Label color of a trigger on hover.',
            },
            {
                name: 'Text (active)',
                variable: '--zyra-color-tabs-text-active',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Label color of the active trigger.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-tabs-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color used by the list, panels, and (in outlined/filled/pill variants) each trigger.',
            },
            {
                name: 'Indicator',
                variable: '--zyra-color-tabs-indicator',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Color of the underline (underline variant) or fill (filled variant) marking the active tab.',
            },
            {
                name: 'Badge background',
                variable: '--zyra-color-tabs-badge-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color of the count badge on an inactive tab.',
            },
            {
                name: 'Badge text',
                variable: '--zyra-color-tabs-badge-text',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Text color of the count badge on an inactive tab.',
            },
            {
                name: 'Badge background (active)',
                variable: '--zyra-color-tabs-badge-active-bg',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Fill color of the count badge on the active tab.',
            },
            {
                name: 'Badge text (active)',
                variable: '--zyra-color-tabs-badge-active-text',
                defaultValue: 'var(--zyra-color-on-brand)',
                description: 'Text color of the count badge on the active tab, and of the active trigger in the filled variant.',
            },
            {
                name: 'Pill active background',
                variable: '--zyra-color-tabs-pill-active-bg',
                defaultValue: 'var(--zyra-color-pill-active-bg)',
                description: 'Fill color of the active trigger in the pill variant. Tuned per theme.',
            },
            {
                name: 'Pill active shadow',
                variable: '--zyra-tabs-pill-active-shadow',
                defaultValue: 'var(--zyra-pill-active-shadow)',
                description: 'Drop shadow lifting the active trigger in the pill variant. Tuned per theme.',
            },
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
        tokens: [
            {
                name: 'Base fill',
                variable: '--zyra-color-surface-inset',
                defaultValue: 'var(--zyra-color-bg-surface)',
                description: 'Base fill color of every shape, and the shimmer gradient\'s start/end stop.',
            },
            {
                name: 'Shimmer highlight',
                variable: '--zyra-color-surface-raised',
                defaultValue: 'var(--zyra-color-bg-raised)',
                description: 'Bright midpoint of the animated shimmer sweep.',
            },
            {
                name: 'Icon watermark',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Color of the subtle icon watermark in the image variant.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color used by frame-style variants (video, chart, calendar, product, etc).',
            },
            {
                name: 'Strong border',
                variable: '--zyra-color-border-strong-color',
                defaultValue: 'var(--zyra-color-border-strong)',
                description: 'Heavier border/divider color used inside compound layouts (e.g. table headers).',
            },
            {
                name: 'Frame background',
                variable: '--zyra-color-background-elevated',
                defaultValue: 'var(--zyra-color-bg-panel)',
                description: 'Background of card-style frames in compound layouts.',
            },
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
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Outer border of the accordion, and the divider between items.',
            },
            {
                name: 'Background',
                variable: '--zyra-color-background-elevated',
                defaultValue: 'var(--zyra-color-bg-panel)',
                description: 'Fill color of the accordion container.',
            },
            {
                name: 'Header text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Text color of an item header, resting and expanded.',
            },
            {
                name: 'Header icon (expanded)',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Chevron color when the item is expanded, and the focus outline color.',
            },
            {
                name: 'Body text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Text color of the collapsible content and the header subtitle.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Default text color for all variants.',
            },
            {
                name: 'Muted text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Text color when the muted input is true.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Icon',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Color of the icon slot content.',
            },
            {
                name: 'Title',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Color of the title text.',
            },
            {
                name: 'Description',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the supporting description text.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-btn-secondary-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Resting fill color. Shared with zyra-button\'s secondary variant — see its Tokens section.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-btn-secondary-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Resting text/icon color.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-btn-secondary-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Resting border color.',
            },
            {
                name: 'Hover background',
                variable: '--zyra-color-btn-secondary-hover-bg',
                defaultValue: 'var(--zyra-color-surface-raised)',
                description: 'Fill color on hover.',
            },
            {
                name: 'Hover border',
                variable: '--zyra-color-btn-secondary-hover-border',
                defaultValue: 'var(--zyra-color-border-hover)',
                description: 'Border color on hover.',
            },
            {
                name: 'Copied text',
                variable: '--zyra-color-success-foreground',
                defaultValue: 'var(--zyra-color-success)',
                description: 'Text/icon and border/background color (foreground/border-color/subtle) while showing the copied confirmation.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Unfilled star',
                variable: '--zyra-color-border-strong-color',
                defaultValue: 'var(--zyra-color-border-strong)',
                description: 'Color of an unfilled star.',
            },
            {
                name: 'Filled star',
                variable: '--zyra-color-warning-foreground',
                defaultValue: 'var(--zyra-color-warning)',
                description: 'Color of a filled/hovered star.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Outline color when a star is keyboard-focused.',
            },
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
        status: 'new',
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
        status: 'new',
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
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of each page button in its resting state.',
            },
            {
                name: 'Background',
                variable: '--zyra-color-surface-inset',
                defaultValue: 'var(--zyra-color-bg-surface)',
                description: 'Fill color of each page button in its resting state.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Label color of a resting page button.',
            },
            {
                name: 'Hover background',
                variable: '--zyra-color-surface-raised',
                defaultValue: 'var(--zyra-color-bg-raised)',
                description: 'Fill color of a page button on hover.',
            },
            {
                name: 'Hover border',
                variable: '--zyra-color-border-hover',
                defaultValue: 'tuned per theme',
                description: 'Border color of a page button on hover.',
            },
            {
                name: 'Active background',
                variable: '--zyra-color-primary-subtle',
                defaultValue: 'var(--zyra-color-accent-muted)',
                description: 'Fill color of the current page button.',
            },
            {
                name: 'Active text/border',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Text, border, and focus-outline color of the current page button.',
            },
            {
                name: 'Active border',
                variable: '--zyra-color-primary-border',
                defaultValue: 'var(--zyra-color-accent-border)',
                description: 'Border color of the current page button.',
            },
            {
                name: 'Ellipsis',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the collapsed-range ellipsis.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of an upcoming step\'s indicator.',
            },
            {
                name: 'Background',
                variable: '--zyra-color-surface-inset',
                defaultValue: 'var(--zyra-color-bg-surface)',
                description: 'Fill color of an upcoming step\'s indicator.',
            },
            {
                name: 'Upcoming text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Label/description color of an upcoming or completed step.',
            },
            {
                name: 'Active fill',
                variable: '--zyra-color-primary-subtle',
                defaultValue: 'var(--zyra-color-accent-muted)',
                description: 'Indicator fill color of the active step.',
            },
            {
                name: 'Active accent',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Indicator text/border color of the active step, and focus-outline color.',
            },
            {
                name: 'Completed fill',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Indicator background/border color of a completed step.',
            },
            {
                name: 'Completed check',
                variable: '--zyra-color-foreground-inverse',
                defaultValue: 'var(--zyra-color-text-inverse)',
                description: 'Checkmark color inside a completed step\'s indicator.',
            },
            {
                name: 'Active label',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Label color of the active step.',
            },
            {
                name: 'Connector line',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Color of the line connecting steps.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-surface-dropdown',
                defaultValue: 'var(--zyra-color-card-bg)',
                description: 'Fill color of the panel and its directional arrow.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Base text color inside the panel.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of the panel.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Default marker',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Marker dot color for the default variant, and the ring around every marker.',
            },
            {
                name: 'Success marker',
                variable: '--zyra-color-success-foreground',
                defaultValue: 'var(--zyra-color-success)',
                description: 'Marker dot color for the success variant.',
            },
            {
                name: 'Warning marker',
                variable: '--zyra-color-warning-foreground',
                defaultValue: 'var(--zyra-color-warning)',
                description: 'Marker dot color for the warning variant.',
            },
            {
                name: 'Danger marker',
                variable: '--zyra-color-danger-foreground',
                defaultValue: 'var(--zyra-color-danger)',
                description: 'Marker dot color for the danger variant.',
            },
            {
                name: 'Info marker',
                variable: '--zyra-color-info-foreground',
                defaultValue: 'var(--zyra-color-info)',
                description: 'Marker dot color for the info variant.',
            },
            {
                name: 'Connecting line',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Color of the vertical line connecting entries.',
            },
            {
                name: 'Title',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Color of each entry\'s title.',
            },
            {
                name: 'Date / body text',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Color of the date label and projected body content.',
            },
        ],
        relatedSlugs: ['card', 'accordion', 'skeleton'],
    },
    {
        slug: 'table',
        title: 'Table',
        selector: 'zyra-table',
        importName: 'ZyraTable',
        category: 'Data Display',
        description:
            'A data table with sortable columns, single/multiple row selection, and built-in pagination, loading, and empty states — reuses Checkbox, Pagination, Skeleton, and Empty State under the hood.',
        icon: waveSquare,
        accent: 'green',
        status: 'new',
        highlights: [
            'Click a sortable column header to cycle ascending → descending → unsorted',
            'Full keyboard navigation — arrow keys move between sortable headers and rows',
            'Single (radio) or multiple (checkbox + select-all) row selection',
            'Built-in pagination via [pageSize] — reuses the Pagination component',
            'Loading skeleton rows and an Empty State for zero rows, no extra markup needed',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { TableColumn, ZyraTable } from 'zyra-ng-ui';

interface Person extends Record<string, unknown> {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [ZyraTable],
  template: \`
    <zyra-table [columns]="columns" [rows]="rows" />
  \`,
})
export class DemoTableComponent {
  columns: TableColumn<Person>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  rows: Person[] = [
    { id: 1, name: 'Ava Patel', role: 'Frontend Engineer' },
    { id: 2, name: 'Marcus Lee', role: 'Backend Engineer' },
  ];
}
`,
        variants: [
            { name: 'default', description: 'No selection column, click-to-sort headers' },
            { name: 'single', description: 'One radio-selectable row at a time' },
            { name: 'multiple', description: 'Checkbox selection per row plus a header select-all' },
            { name: 'paginated', description: '[pageSize] slices rows and renders a Pagination footer' },
            { name: 'loading', description: 'Skeleton rows in place of data while fetching' },
        ],
        apiProps: [
            {
                name: 'columns',
                type: 'TableColumn<T>[]',
                default: 'required',
                description: '{ key, label, sortable?, align?, width?, format? } per column',
            },
            {
                name: 'rows',
                type: 'T[]',
                default: 'required',
                description: 'The data to display, one object per row',
            },
            {
                name: 'rowKey',
                type: '(row: T, index: number) => string | number',
                default: '(row, index) => index',
                description: 'Derives a stable identity per row, used for selection and tracking',
            },
            {
                name: 'selectionMode',
                type: "'none' | 'single' | 'multiple'",
                default: "'none'",
                description: 'Adds a radio or checkbox selection column',
            },
            {
                name: 'selected',
                type: '(string | number)[]',
                default: '[]',
                description: 'Two-way bound via [(selected)] — the row keys currently selected',
            },
            {
                name: 'sort',
                type: '{ key: string; direction: \'asc\' | \'desc\' } | null',
                default: 'null',
                description: 'Two-way bound via [(sort)] — the active sort column and direction',
            },
            {
                name: 'manualSort',
                type: 'boolean',
                default: 'false',
                description: 'Disables internal sorting so a server can sort instead — sort still updates on header click',
            },
            {
                name: 'pageSize',
                type: 'number | null',
                default: 'null',
                description: 'When set, slices rows into pages and renders a Pagination footer',
            },
            {
                name: 'page',
                type: 'number',
                default: '1',
                description: 'Two-way bound via [(page)] — the current page when pageSize is set',
            },
            {
                name: 'loading',
                type: 'boolean',
                default: 'false',
                description: 'Shows skeleton rows instead of data',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Row height and font scale',
            },
            {
                name: 'rowClick (output)',
                type: 'T',
                default: '-',
                description: 'Emits the clicked row (not emitted when a selection control is clicked)',
            },
        ],
        a11yNotes: [
            'Renders a native <table>/<thead>/<tbody> — no ARIA table roles needed',
            'Sortable headers are real <button> elements with aria-sort reflected on the parent <th>',
            'Two independent roving-tabindex zones — sortable headers and body rows — each with a single tab stop',
            'Left/Right move between sortable headers; Up/Down move between rows; Down from a header enters the first row, Up from the first row returns to the header',
            'Home/End jump to the first/last row; Enter/Space on a focused row fires rowClick and toggles selection',
            'Select-all and per-row checkboxes reuse the accessible Checkbox component',
            'Single-selection mode uses native radio inputs grouped per table instance',
        ],
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Outer border, and the divider under each header/row.',
            },
            {
                name: 'Header background',
                variable: '--zyra-color-surface',
                defaultValue: 'var(--zyra-color-card-bg)',
                description: 'Fill color of the header row.',
            },
            {
                name: 'Header text',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Label color of column headers, and the sort icon.',
            },
            {
                name: 'Cell text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Text color of a data cell.',
            },
            {
                name: 'Row hover / selected',
                variable: '--zyra-color-table-row-hover-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Background of a hovered or selected row.',
            },
            {
                name: 'Focus ring',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Outline color when a header or row is keyboard-focused, and the radio accent-color.',
            },
        ],
        relatedSlugs: ['pagination', 'checkbox', 'empty-state', 'skeleton'],
    },
    {
        slug: 'tree-view',
        title: 'Tree View',
        selector: 'zyra-tree-view',
        importName: 'ZyraTreeView',
        category: 'Data Display',
        description:
            'A hierarchical, expandable list for file trees, org charts, and nested categories — keyboard navigable with the same roving-tabindex pattern as Sidebar and Calendar, single/multiple selection, and unlimited nesting depth.',
        icon: waveSquare,
        accent: 'green',
        status: 'new',
        highlights: [
            'Unlimited nesting via a node.children array — no depth limit',
            'Arrow Right/Left expand, collapse, or move to parent/child; Up/Down move focus',
            'Single (click) or multiple (checkbox) selection, or none',
            'Only the focused row is in the tab order (roving tabindex)',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { TreeNode, ZyraTreeView } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-tree-view',
  standalone: true,
  imports: [ZyraTreeView],
  template: \`
    <zyra-tree-view [nodes]="nodes" />
  \`,
})
export class DemoTreeViewComponent {
  nodes: TreeNode[] = [
    {
      id: 'src',
      label: 'src',
      children: [
        { id: 'app', label: 'app.ts' },
        { id: 'main', label: 'main.ts' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];
}
`,
        variants: [
            { name: 'none', description: 'No selection — click a node with children to expand/collapse it' },
            { name: 'single', description: 'Clicking a row selects it, replacing any previous selection' },
            { name: 'multiple', description: 'A checkbox per row, independently toggled' },
        ],
        apiProps: [
            {
                name: 'nodes',
                type: 'TreeNode[]',
                default: 'required',
                description: '{ id, label, icon?, disabled?, children? } — children nest recursively',
            },
            {
                name: 'selectionMode',
                type: "'none' | 'single' | 'multiple'",
                default: "'none'",
                description: 'Adds row-click (single) or checkbox (multiple) selection',
            },
            {
                name: 'selected',
                type: '(string | number)[]',
                default: '[]',
                description: 'Two-way bound via [(selected)] — the ids currently selected',
            },
            {
                name: 'expanded',
                type: '(string | number)[]',
                default: '[]',
                description: 'Two-way bound via [(expanded)] — the ids of currently expanded nodes',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Row height and font scale',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the entire tree',
            },
            {
                name: 'nodeClick (output)',
                type: 'TreeNode',
                default: '-',
                description: 'Emits on every row click, regardless of selectionMode',
            },
            {
                name: 'nodeToggle (output)',
                type: '{ node: TreeNode; expanded: boolean }',
                default: '-',
                description: 'Emits when a node is expanded or collapsed',
            },
        ],
        a11yNotes: [
            'Root has role="tree"; each row has role="treeitem" with aria-level and aria-expanded',
            'Only the focused row is in the tab order — Arrow Up/Down move focus, Arrow Right/Left expand/collapse or move to parent/child',
            'Home/End jump to the first/last visible row',
            'Enter/Space toggles selection (if enabled) or expansion',
        ],
        tokens: [
            {
                name: 'Text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Label color of a row.',
            },
            {
                name: 'Hover / selected background',
                variable: '--zyra-color-tree-view-hover-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Background of a hovered row.',
            },
            {
                name: 'Selected background',
                variable: '--zyra-color-primary-subtle',
                defaultValue: 'var(--zyra-color-accent-muted)',
                description: 'Background of a selected row.',
            },
            {
                name: 'Selected text',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Label color of a selected row, and the focus-outline color.',
            },
            {
                name: 'Muted text',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Color of the expand/collapse chevron and disabled-row label.',
            },
        ],
        relatedSlugs: ['sidebar', 'accordion', 'calendar'],
    },
    {
        slug: 'carousel',
        title: 'Carousel',
        selector: 'zyra-carousel',
        importName: 'ZyraCarousel',
        category: 'Data Display',
        description:
            'Slideshow for images, testimonials, or promo cards — arrow and dot navigation, keyboard support, looping, and optional autoplay.',
        icon: swatchbook,
        accent: 'green',
        status: 'new',
        highlights: [
            'Arrow keys, prev/next buttons, and dot navigation all stay in sync',
            'Autoplay pauses on hover/focus and resumes automatically',
            'Slides are plain projected content — any markup works inside zyra-carousel-slide',
        ],
        exampleCode: CAROUSEL_EXAMPLE_CODE,
        variants: [
            { name: 'loop', description: 'Wraps from the last slide back to the first (default)' },
            { name: 'autoplay', description: 'Advances automatically on a timer; pauses on hover' },
        ],
        apiProps: [
            {
                name: 'loop',
                type: 'boolean',
                default: 'true',
                description: 'Whether prev/next wrap around at the ends',
            },
            {
                name: 'autoplay',
                type: 'boolean',
                default: 'false',
                description: 'Automatically advances to the next slide on a timer',
            },
            {
                name: 'autoplayInterval',
                type: 'number',
                default: '5000',
                description: 'Milliseconds between automatic slide advances',
            },
            {
                name: 'showArrows',
                type: 'boolean',
                default: 'true',
                description: 'Shows the prev/next arrow buttons',
            },
            {
                name: 'showDots',
                type: 'boolean',
                default: 'true',
                description: 'Shows the dot navigation',
            },
            {
                name: 'indexChange (output)',
                type: 'number',
                default: '-',
                description: 'Emits the active slide index whenever it changes',
            },
        ],
        a11yNotes: [
            'Root has role="region" with aria-roledescription="carousel"',
            'Each slide has role="group" with aria-roledescription="slide"',
            'Arrow Left/Right keys navigate; dots use role="tab" with aria-selected reflecting the active slide',
            'Autoplay pauses on mouseenter and resumes on mouseleave so it never fights a reading user',
        ],
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-carousel-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the carousel viewport.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-carousel-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Base text color inside the viewport.',
            },
            {
                name: 'Dots track',
                variable: '--zyra-color-carousel-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Fill color of an inactive dot.',
            },
            {
                name: 'Arrow background',
                variable: '--zyra-color-surface',
                defaultValue: 'var(--zyra-color-card-bg)',
                description: 'Fill color of the previous/next arrow buttons.',
            },
            {
                name: 'Arrow text',
                variable: '--zyra-color-foreground',
                defaultValue: 'var(--zyra-color-text)',
                description: 'Icon color of the arrow buttons.',
            },
            {
                name: 'Arrow border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color of the arrow buttons.',
            },
            {
                name: 'Active accent',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Fill color of the active dot, arrow hover state, and focus outlines.',
            },
        ],
        relatedSlugs: ['card', 'timeline', 'empty-state'],
    },
    {
        slug: 'calendar',
        title: 'Calendar',
        selector: 'zyra-calendar',
        importName: 'ZyraCalendar',
        category: 'Data Display',
        description:
            'Month-grid date picker with single/multiple/range selection, a quick month/year picker, keyboard navigation, min/max constraints, and full Angular Forms (CVA) integration — the foundation Date Picker will build on.',
        icon: waveSquare,
        accent: 'green',
        status: 'new',
        highlights: [
            'Three selection modes: single date, multiple dates, or a start/end range',
            'Click the month label to jump straight to any month/year instead of paging one at a time',
            'Arrow keys move focus by day; Enter/Space selects the focused date',
            'min/max inputs disable out-of-range dates',
            'Works with Angular forms (CVA) like any other control',
        ],
        exampleCode: CALENDAR_EXAMPLE_CODE,
        variants: [
            { name: 'single', description: 'Default — one selected date, value is Date | null' },
            { name: 'multiple', description: 'Several non-contiguous dates, value is Date[]' },
            { name: 'range', description: 'A start/end range, value is { start, end }; first click sets start, second sets end' },
            { name: 'constrained', description: 'min/max inputs disable dates outside the allowed range' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'Date | Date[] | { start: Date | null; end: Date | null } | null',
                default: 'null',
                description: 'Two-way bound selection via [(value)] or ngModel — shape depends on selectionMode',
            },
            {
                name: 'selectionMode',
                type: "'single' | 'multiple' | 'range'",
                default: "'single'",
                description: 'Controls the selection behavior and the shape of value',
            },
            {
                name: 'min',
                type: 'Date | null',
                default: 'null',
                description: 'Dates before this are disabled',
            },
            {
                name: 'max',
                type: 'Date | null',
                default: 'null',
                description: 'Dates after this are disabled',
            },
            {
                name: 'firstDayOfWeek',
                type: 'number',
                default: '0',
                description: '0 = Sunday, 1 = Monday, etc. — controls the weekday column order',
            },
            {
                name: 'locale',
                type: 'string',
                default: "'en-US'",
                description: 'Locale used to format the month label and weekday names',
            },
            {
                name: 'dateSelected (output)',
                type: 'Date',
                default: '-',
                description: 'Emits the clicked/confirmed date on every selection, regardless of mode',
            },
            {
                name: 'monthChange (output)',
                type: '{ year: number; month: number }',
                default: '-',
                description: 'Emits whenever the visible month changes',
            },
        ],
        a11yNotes: [
            'Grid uses role="grid"/role="row"/role="gridcell" on the day buttons',
            'Only the focused day is in the tab order (roving tabindex) — Arrow keys move focus between days',
            'Today\'s date is marked with aria-current="date"',
            'The month label is a button with aria-haspopup for the month/year picker view',
        ],
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-calendar-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of the calendar panel.',
            },
            {
                name: 'Text',
                variable: '--zyra-color-calendar-text',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Base text color: month/year label, weekday header, and in-month day numbers.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-calendar-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the panel.',
            },
            {
                name: 'Hover background',
                variable: '--zyra-color-surface-raised',
                defaultValue: 'var(--zyra-color-bg-raised)',
                description: 'Fill color of a day cell, or the prev/next month buttons, on hover.',
            },
            {
                name: 'Outside-month text',
                variable: '--zyra-color-foreground-subtle',
                defaultValue: 'var(--zyra-color-text-dim)',
                description: 'Text color for days outside the current month.',
            },
            {
                name: 'Today ring',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Inset ring around today\'s date, and focus-outline color.',
            },
            {
                name: 'Selected background',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Fill color of a selected date (or range endpoint).',
            },
            {
                name: 'Selected text',
                variable: '--zyra-color-on-brand',
                defaultValue: 'var(--zyra-color-btn-primary-text)',
                description: 'Text color of a selected date, kept readable against the accent fill.',
            },
            {
                name: 'Range background',
                variable: '--zyra-color-primary-subtle',
                defaultValue: 'var(--zyra-color-accent-muted)',
                description: 'Fill color of days between a selected range\'s two endpoints.',
            },
        ],
        relatedSlugs: ['date-picker', 'carousel', 'input', 'form-field'],
    },
    {
        slug: 'date-picker',
        title: 'Date Picker',
        selector: 'zyra-date-picker',
        importName: 'ZyraDatePicker',
        category: 'Forms',
        description:
            'A dropdown date field that wraps Calendar in a select-style trigger — single date or start/end range, with a formatted display label and full Angular Forms (CVA) integration.',
        icon: calendarIcon,
        accent: 'amber',
        status: 'new',
        highlights: [
            'Wraps the existing Calendar component — no date logic duplicated',
            'Single date or start/end range selection',
            'Closes automatically once a full selection is made',
            'Today / Clear quick actions in single mode',
            'Same outline/filled/underline appearance and sm/md/lg sizes as Select',
        ],
        exampleCode: DATE_PICKER_EXAMPLE_CODE,
        variants: [
            { name: 'single', description: 'Default — one selected date, value is Date | null' },
            { name: 'range', description: 'A start/end range, value is { start, end } | null' },
            { name: 'outline / filled / underline', description: 'Same trigger appearances as Select' },
        ],
        apiProps: [
            {
                name: 'value',
                type: 'Date | { start: Date | null; end: Date | null } | null',
                default: 'null',
                description: 'Two-way bound selection via [(value)] or ngModel — shape depends on selectionMode',
            },
            {
                name: 'selectionMode',
                type: "'single' | 'range'",
                default: "'single'",
                description: 'Controls the selection behavior and the shape of value',
            },
            {
                name: 'appearance',
                type: "'outline' | 'filled' | 'underline'",
                default: "'outline'",
                description: 'Trigger chrome style',
            },
            {
                name: 'size',
                type: "'sm' | 'md' | 'lg'",
                default: "'md'",
                description: 'Trigger height and font scale',
            },
            {
                name: 'placeholder',
                type: 'string',
                default: "'Select date'",
                description: 'Shown in the trigger when no value is selected',
            },
            {
                name: 'min',
                type: 'Date | null',
                default: 'null',
                description: 'Dates before this are disabled (passed through to Calendar)',
            },
            {
                name: 'max',
                type: 'Date | null',
                default: 'null',
                description: 'Dates after this are disabled (passed through to Calendar)',
            },
            {
                name: 'closeOnSelect',
                type: 'boolean',
                default: 'true',
                description: 'Closes the panel once a full selection is made',
            },
            {
                name: 'clearable',
                type: 'boolean',
                default: 'true',
                description: 'Shows an inline clear (×) button in the trigger once a value is set',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the trigger and panel',
            },
            {
                name: 'opened (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the panel opens',
            },
            {
                name: 'closed (output)',
                type: 'void',
                default: '-',
                description: 'Emits when the panel closes',
            },
        ],
        a11yNotes: [
            'Trigger has aria-haspopup="dialog" and reflects aria-expanded',
            'Panel is role="dialog" and inert while closed',
            'ArrowDown/Enter/Space opens the panel, Escape closes it, Tab closes and moves on',
            'Clicking outside the trigger and panel closes it',
            'Calendar\'s own keyboard grid navigation (arrow keys, roving tabindex) applies inside the panel',
        ],
        // Trigger reuses the same --zyra-color-select-* tokens as Select/Multi
        // Select/Autocomplete (see SELECT_TOKENS) — the calendar panel itself
        // is styled by ZyraCalendar's own tokens, documented on its own page.
        tokens: SELECT_TOKENS,
        relatedSlugs: ['calendar', 'select', 'form-field'],
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
        status: 'new',
        highlights: [
            'Content-projection slots for brand, nav, and actions',
            'Built-in mobile menu toggle — no manual drawer wiring needed',
            'Independent mobile navigation: project entirely different nav/content/footer into the drawer than desktop shows, or omit them to keep today\'s behavior — zero breaking changes either way',
            'Scroll-elevation and transparent-until-scrolled styling out of the box',
            'Sticky, fixed, or static positioning',
            'Split or centered nav alignment; contained or full-width layout',
        ],
        exampleCode: `import { Component } from '@angular/core';
import {
  ZyraHeader,
  ZyraHeaderStart,
  ZyraHeaderNav,
  ZyraHeaderEnd,
  ZyraHeaderMobileNav,
  ZyraHeaderMobileEnd,
  ZyraHeaderMobileFooter,
  ZyraButton,
} from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  imports: [
    ZyraHeader,
    ZyraHeaderStart,
    ZyraHeaderNav,
    ZyraHeaderEnd,
    ZyraHeaderMobileNav,
    ZyraHeaderMobileEnd,
    ZyraHeaderMobileFooter,
    ZyraButton,
  ],
  template: \`
    <zyra-header position="sticky">
      <a zyraHeaderStart href="#">Brand</a>

      <!-- Desktop nav — a handful of top-level links -->
      <nav zyraHeaderNav>
        <a href="#">Docs</a>
        <a href="#">Blog</a>
        <a href="#">Pricing</a>
      </nav>
      <div zyraHeaderEnd>
        <zyra-button size="sm">Get started</zyra-button>
      </div>

      <!--
        Independent mobile drawer content. Once zyraHeaderMobileNav is
        present, the drawer never falls back to the desktop nav above —
        project whatever fits a mobile menu: more links, secondary
        actions, footer metadata. Omit these three and the header behaves
        exactly as before (desktop nav becomes the drawer, unchanged).
      -->
      <nav zyraHeaderMobileNav>
        <a href="#">Docs</a>
        <a href="#">Blog</a>
        <a href="#">Pricing</a>
        <a href="#">Changelog</a>
        <a href="#">Community</a>
      </nav>
      <div zyraHeaderMobileEnd>
        <zyra-button size="sm" variant="outline" fullWidth>Sign in</zyra-button>
        <zyra-button size="sm" fullWidth>Get started</zyra-button>
      </div>
      <div zyraHeaderMobileFooter>v1.0.0 — © Zyra UI</div>
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
                description:
                    'Optional extra content shown only inside the open mobile panel. Legacy: appended below the desktop nav in the drawer. Independent mode (see below): becomes the drawer\'s Content section',
            },
            {
                name: 'zyraHeaderMobileNav (directive)',
                type: 'attribute',
                default: '-',
                description:
                    'Independent mobile drawer navigation. Once projected, the drawer never falls back to zyraHeaderNav\'s content — desktop and mobile navigation become completely independent',
            },
            {
                name: 'zyraHeaderMobileFooter (directive)',
                type: 'attribute',
                default: '-',
                description: 'Optional drawer footer content (version info, links, branding) — only used in independent mode',
            },
        ],
        a11yNotes: [
            'Rendered as a header element with role="banner"',
            'The mobile toggle button exposes aria-expanded and an aria-label that updates between "Open" and "Close navigation menu"',
            'Escape closes the open mobile panel',
            'Focus moves into the drawer on open and returns to the toggle button on close',
            'Desktop and mobile nav landmarks are mutually exclusive in the accessibility tree — only the currently relevant one is ever exposed to assistive tech',
        ],
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-header-bg',
                defaultValue: 'var(--zyra-color-background)',
                description: 'Fill color once opaque (scrolled past the threshold, or transparent is false).',
            },
            {
                name: 'Border',
                variable: '--zyra-header-border',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Bottom border color, tinted with the primary color on hover regions.',
            },
            {
                name: 'Glass background',
                variable: '--zyra-header-glass-bg',
                defaultValue: 'var(--zyra-color-header-glass-bg)',
                description: 'Translucent fill used with the backdrop blur while transparent and not yet scrolled.',
            },
            {
                name: 'Backdrop blur',
                variable: '--zyra-header-backdrop',
                defaultValue: 'var(--zyra-header-backdrop-base)',
                description: 'backdrop-filter value for the glass effect.',
            },
            {
                name: 'Elevation shadow',
                variable: '--zyra-header-shadow',
                defaultValue: 'var(--zyra-header-shadow-base)',
                description: 'Drop shadow applied once elevateOnScroll triggers.',
            },
            {
                name: 'Divider',
                variable: '--zyra-header-divider-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Color of the section dividers inside the mobile drawer.',
            },
            {
                name: 'Burger background',
                variable: '--zyra-color-background-elevated',
                defaultValue: 'var(--zyra-color-bg-panel)',
                description: 'Fill color of the mobile menu toggle button.',
            },
            {
                name: 'Burger icon',
                variable: '--zyra-color-foreground-muted',
                defaultValue: 'var(--zyra-color-text-muted)',
                description: 'Icon/border color of the toggle button, resting state.',
            },
            {
                name: 'Drawer background',
                variable: '--zyra-color-drawer-bg',
                defaultValue: 'var(--zyra-color-surface)',
                description: 'Fill color of the mobile nav drawer panel.',
            },
            {
                name: 'Focus / active accent',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Border-tint on scroll, and the toggle button\'s focus outline.',
            },
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
        status: 'new',
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
        tokens: [
            {
                name: 'Background',
                variable: '--zyra-color-sidebar-bg',
                defaultValue: 'var(--zyra-color-background-elevated)',
                description: 'Fill color of the sidebar panel.',
            },
            {
                name: 'Border',
                variable: '--zyra-color-sidebar-border',
                defaultValue: 'var(--zyra-color-border-color)',
                description: 'Border color of the panel edge, and the header/footer dividers.',
            },
            {
                name: 'Section heading',
                variable: '--zyra-color-sidebar-heading',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Color of a section label above a group of items.',
            },
            {
                name: 'Item text',
                variable: '--zyra-color-sidebar-text',
                defaultValue: 'var(--zyra-color-foreground-muted)',
                description: 'Text color of a resting, inactive item.',
            },
            {
                name: 'Item text (hover)',
                variable: '--zyra-color-sidebar-text-hover',
                defaultValue: 'var(--zyra-color-foreground)',
                description: 'Text color of an item on hover.',
            },
            {
                name: 'Item background (hover)',
                variable: '--zyra-color-sidebar-hover-bg',
                defaultValue: 'var(--zyra-color-surface-inset)',
                description: 'Fill color of an item on hover.',
            },
            {
                name: 'Item text (active)',
                variable: '--zyra-color-sidebar-text-active',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Text color of the active (current-page) item.',
            },
            {
                name: 'Item background (active)',
                variable: '--zyra-color-sidebar-active-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color of the active item.',
            },
            {
                name: 'Badge background',
                variable: '--zyra-color-sidebar-badge-bg',
                defaultValue: 'var(--zyra-color-primary-subtle)',
                description: 'Fill color of a count badge next to an item.',
            },
            {
                name: 'Badge text',
                variable: '--zyra-color-sidebar-badge-text',
                defaultValue: 'var(--zyra-color-primary)',
                description: 'Text color of a count badge.',
            },
        ],
        relatedSlugs: ['header', 'tabs', 'breadcrumb'],
    },
    {
        slug: 'box',
        title: 'Box',
        selector: 'zyra-box',
        importName: 'ZyraBox',
        category: 'Layout',
        description:
            'The foundational layout primitive — spacing, radius, background, shadow, border and dimensions driven entirely by design tokens.',
        icon: boxOpen,
        accent: 'teal',
        highlights: [
            'Token-based padding, margin, radius and shadow scales',
            'Width/height and min/max dimension props',
            'Tone variants (accent/success/warning/danger/info) for quick status boxes',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraBox } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-box',
  standalone: true,
  imports: [ZyraBox],
  template: \`
    <zyra-box padding="md" background="surface" rounded="lg">
      content
    </zyra-box>
  \`,
})
export class DemoBoxComponent {}
`,
        variants: [
            { name: 'background', description: 'none / surface / surface-subtle / surface-inset / tone (accent, success, warning, danger, info)' },
            { name: 'shadow', description: 'none / sm / md / lg' },
        ],
        apiProps: [
            { name: 'padding', type: 'BoxSpacing', default: "'none'", description: 'Uniform padding from the spacing scale' },
            { name: 'paddingX / paddingY', type: 'BoxSpacing', default: 'undefined', description: 'Per-axis padding override' },
            { name: 'margin', type: 'BoxSpacing', default: "'none'", description: 'Uniform margin from the spacing scale' },
            { name: 'rounded', type: 'BoxRadius', default: "'none'", description: 'Border radius token' },
            { name: 'background', type: 'BoxBackground', default: "'none'", description: 'Semantic background or tone variant' },
            { name: 'border', type: 'boolean', default: 'false', description: 'Shows a 1px border, tinted to match a tone background' },
            { name: 'width / height', type: 'string | number', default: 'undefined', description: 'Numbers are treated as pixels' },
            { name: 'minWidth / maxWidth / minHeight / maxHeight', type: 'string | number', default: 'undefined', description: 'Dimension constraints' },
            { name: 'overflow', type: "'visible' | 'hidden' | 'auto' | 'scroll' | 'clip'", default: "'visible'", description: 'Uniform overflow, with overflowX/overflowY overrides' },
            { name: 'shadow', type: "'none' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Elevation shadow token' },
            { name: 'position', type: "'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'", default: "'static'", description: 'With optional top/right/bottom/left offsets' },
            { name: 'cursor', type: 'BoxCursor', default: "'auto'", description: 'Mouse cursor style' },
            { name: 'userSelect', type: "'auto' | 'none' | 'text' | 'all'", default: "'auto'", description: 'Text selection behavior' },
        ],
        a11yNotes: [
            'Box is a plain, non-semantic wrapper — use it for visual grouping, not in place of semantic HTML',
        ],
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color shown when the border input is enabled.',
            },
        ],
        relatedSlugs: ['flex', 'grid', 'container'],
    },
    {
        slug: 'flex',
        title: 'Flex',
        selector: 'zyra-flex',
        importName: 'ZyraFlex',
        category: 'Layout',
        description:
            'A flexbox layout primitive with direction, alignment, gap and wrap — plus a companion ZyraFlexItem for per-child grow/shrink/basis/order control.',
        icon: scaleBalanced,
        accent: 'blue',
        highlights: [
            'Responsive direction and gap via breakpoint objects',
            'wrap / wrap-reverse',
            'ZyraFlexItem for grow, shrink, basis, order and align-self',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraFlex } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-flex',
  standalone: true,
  imports: [ZyraFlex],
  template: \`
    <zyra-flex justify="between" align="center" gap="md">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </zyra-flex>
  \`,
})
export class DemoFlexComponent {}
`,
        variants: [
            { name: 'direction', description: 'row / row-reverse / column / column-reverse, or a responsive object' },
            { name: 'wrap', description: 'wrap / wrap-reverse via `wrap` and `wrapReverse`' },
        ],
        apiProps: [
            { name: 'direction', type: 'FlexDirection | FlexResponsiveDirection', default: "'row'", description: 'Flex direction, or a { base, sm, md, lg, xl } breakpoint map' },
            { name: 'align', type: 'FlexAlign', default: "'stretch'", description: 'align-items' },
            { name: 'justify', type: 'FlexJustify', default: "'start'", description: 'justify-content' },
            { name: 'gap', type: 'BoxSpacing | FlexResponsiveGap', default: "'none'", description: 'Gap, or a responsive breakpoint map' },
            { name: 'wrap / wrapReverse', type: 'boolean', default: 'false', description: 'flex-wrap: wrap / wrap-reverse' },
            { name: 'inline', type: 'boolean', default: 'false', description: 'Uses inline-flex instead of flex' },
        ],
        a11yNotes: [
            'Purely visual layout — doesn’t change the tab order of projected content',
        ],
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color shown when the border input is enabled.',
            },
        ],
        relatedSlugs: ['box', 'grid', 'stack'],
    },
    {
        slug: 'grid',
        title: 'Grid',
        selector: 'zyra-grid',
        importName: 'ZyraGrid',
        category: 'Layout',
        description:
            'A CSS Grid layout primitive with responsive columns/rows, auto-fit/auto-fill tracks, named areas, and a companion ZyraGridItem for column/row span.',
        icon: cubes,
        accent: 'purple',
        highlights: [
            'Responsive columns and rows via breakpoint objects',
            'auto-fit / auto-fill with a configurable minimum track size',
            'ZyraGridItem for column/row span and named-area placement',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraGrid } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-grid',
  standalone: true,
  imports: [ZyraGrid],
  template: \`
    <zyra-grid [columns]="3" gap="sm">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </zyra-grid>
  \`,
})
export class DemoGridComponent {}
`,
        variants: [
            { name: 'columns', description: 'A number, "auto-fit" / "auto-fill", a raw track string, or a responsive breakpoint object' },
            { name: 'areas', description: 'Named grid-template-areas rows, consumed by ZyraGridItem’s `area` input' },
        ],
        apiProps: [
            { name: 'columns / rows', type: 'GridColumnsValue | GridResponsiveColumns', default: '1', description: 'Track sizing, responsive-capable' },
            { name: 'minTrackSize', type: 'string | number', default: "'180px'", description: 'Minimum track size for auto-fit/auto-fill' },
            { name: 'areas', type: 'string[]', default: 'undefined', description: 'Rows of named grid-template-areas' },
            { name: 'autoFlow', type: 'GridAutoFlow', default: "'row'", description: 'grid-auto-flow' },
            { name: 'justifyItems / alignItems', type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", description: 'Default alignment of grid items' },
            { name: 'gap / columnGap / rowGap', type: 'BoxSpacing', default: "'none'", description: 'Gap between tracks' },
        ],
        a11yNotes: [
            'Visual reflow via grid-auto-flow doesn’t change DOM/tab order — keep source order meaningful',
        ],
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color shown when the border input is enabled.',
            },
        ],
        relatedSlugs: ['box', 'flex', 'container'],
    },
    {
        slug: 'container',
        title: 'Container',
        selector: 'zyra-container',
        importName: 'ZyraContainer',
        category: 'Layout',
        description:
            'Max-width plus centering with a horizontal gutter — the wrapper every page-level layout starts from, with a Bootstrap-style responsive breakpoint mode.',
        icon: square,
        accent: 'green',
        highlights: [
            'sm / md / lg / xl / 2xl / full max-width presets',
            'maxWidth="responsive" snaps to breakpoint widths as the viewport grows',
            'fluid and noGutters escape hatches',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraContainer } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-container',
  standalone: true,
  imports: [ZyraContainer],
  template: \`
    <zyra-container maxWidth="lg">
      content
    </zyra-container>
  \`,
})
export class DemoContainerComponent {}
`,
        variants: [
            { name: 'maxWidth', description: 'sm / md / lg / xl / 2xl / full / responsive' },
        ],
        apiProps: [
            { name: 'maxWidth', type: 'ContainerMaxWidth', default: "'xl'", description: 'Preset width, or "responsive" for breakpoint-driven widths' },
            { name: 'centered', type: 'boolean', default: 'true', description: 'Auto left/right margins' },
            { name: 'fluid', type: 'boolean', default: 'false', description: 'Removes the max-width constraint entirely' },
            { name: 'noGutters', type: 'boolean', default: 'false', description: 'Removes horizontal gutter padding' },
            { name: 'paddingX', type: 'BoxSpacing | ContainerResponsivePadding', default: "'md'", description: 'Horizontal gutter, responsive-capable' },
        ],
        a11yNotes: [
            'Purely visual layout — has no semantic role of its own',
        ],
        tokens: [
            {
                name: 'Border',
                variable: '--zyra-color-border-color',
                defaultValue: 'var(--zyra-color-border)',
                description: 'Border color shown when the border input is enabled.',
            },
        ],
        relatedSlugs: ['box', 'grid', 'flex'],
    },
    {
        slug: 'aspect-ratio',
        title: 'Aspect Ratio',
        selector: 'zyra-aspect-ratio',
        importName: 'ZyraAspectRatio',
        category: 'Layout',
        description:
            'Locks a box’s width-to-height proportions using the padding-bottom technique, so it degrades correctly even without native aspect-ratio support.',
        icon: waveSquare,
        accent: 'amber',
        highlights: [
            'Accepts a number, "16/9", or "4:3" style ratio',
            'object-fit control for projected images/video',
            'Optional [zyraPlaceholder] slot for blur-up placeholders',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraAspectRatio } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-aspect-ratio',
  standalone: true,
  imports: [ZyraAspectRatio],
  template: \`
    <zyra-aspect-ratio ratio="16/9">
      <img src="photo.jpg" alt="" />
    </zyra-aspect-ratio>
  \`,
})
export class DemoAspectRatioComponent {}
`,
        variants: [
            { name: 'ratio', description: '16/9, 1/1, 4/3, 21/9, or any custom w/h ratio' },
        ],
        apiProps: [
            { name: 'ratio', type: 'AspectRatioValue', default: "'16/9'", description: 'Number or "w/h" / "w:h" string' },
            { name: 'objectFit', type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'", default: "'cover'", description: 'Applied to a directly-projected img/video' },
            { name: 'overflowHidden', type: 'boolean', default: 'true', description: 'Clips content to the ratio box' },
        ],
        a11yNotes: [
            'Projected images still need their own meaningful `alt` text',
        ],
        relatedSlugs: ['box', 'container'],
    },
    {
        slug: 'scroll-area',
        title: 'Scroll Area',
        selector: 'zyra-scroll-area',
        importName: 'ZyraScrollArea',
        category: 'Layout',
        description:
            'A styled, keyboard-navigable scroll container with custom scrollbars, optional auto-hide, scroll shadows, smooth scrolling and a programmatic scroll API.',
        icon: panelLeft,
        accent: 'blue',
        highlights: [
            'Arrow keys, Home/End, Page Up/Down when focused',
            'Auto-hide scrollbar and pure-CSS scroll shadows',
            'scrollToTop / scrollToBottom / scrollToElement methods, plus a (scrolled) event',
        ],
        exampleCode: `import { Component } from '@angular/core';
import { ZyraScrollArea } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo-scroll-area',
  standalone: true,
  imports: [ZyraScrollArea],
  template: \`
    <zyra-scroll-area maxHeight="220px">
      ...
    </zyra-scroll-area>
  \`,
})
export class DemoScrollAreaComponent {}
`,
        variants: [
            { name: 'orientation', description: 'vertical / horizontal / both' },
        ],
        apiProps: [
            { name: 'maxHeight', type: 'string', default: "'300px'", description: 'CSS max-height of the viewport' },
            { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Which axes scroll' },
            { name: 'smoothScroll', type: 'boolean', default: 'false', description: 'scroll-behavior: smooth' },
            { name: 'autoHideScrollbar', type: 'boolean', default: 'false', description: 'Scrollbar only visible on hover/focus' },
            { name: 'showScrollShadows', type: 'boolean', default: 'false', description: 'Pure-CSS edge shadows indicating more scrollable content' },
            { name: 'scrolled', type: 'output<ScrollAreaScrollEvent>', default: '—', description: 'Emits scroll metrics on every native scroll event' },
        ],
        a11yNotes: [
            'Focusable via tabindex="0" with role="region" and an aria-label',
            'Arrow/Home/End/PageUp/PageDown keys move the scroll position when focused',
        ],
        tokens: [
            {
                name: 'Focus ring',
                variable: '--zyra-color-primary',
                defaultValue: 'var(--zyra-color-accent)',
                description: 'Inset focus ring shown when the scroll region itself is keyboard-focused.',
            },
            {
                name: 'Scrollbar thumb',
                variable: '--zyra-color-scrollbar-thumb',
                defaultValue: 'var(--zyra-color-scrollbar-thumb-base)',
                description: 'Color of the draggable scrollbar thumb.',
            },
            {
                name: 'Scrollbar thumb (hover)',
                variable: '--zyra-color-scrollbar-thumb-hover',
                defaultValue: 'var(--zyra-color-foreground-subtle)',
                description: 'Thumb color on hover.',
            },
            {
                name: 'Scrollbar track',
                variable: '--zyra-color-scrollbar-track',
                defaultValue: 'var(--zyra-color-scrollbar-track-base)',
                description: 'Color of the scrollbar track/gutter.',
            },
            {
                name: 'Edge fade',
                variable: '--zyra-scroll-area-fade-color',
                defaultValue: 'var(--zyra-color-surface)',
                description: 'Color the shadow-fade indicators blend into — should match the surface the scroll area sits on.',
            },
        ],
        relatedSlugs: ['box', 'sidebar'],
    },
] satisfies readonly UiComponentShowcaseCard[];

export const COMPONENT_COUNT = UI_COMPONENT_SHOWCASE.length;

export function getUiComponentShowcaseCard(
    slug: string | null | undefined,
): UiComponentShowcaseCard | undefined {
    return UI_COMPONENT_SHOWCASE.find((card) => card.slug === slug);
}
