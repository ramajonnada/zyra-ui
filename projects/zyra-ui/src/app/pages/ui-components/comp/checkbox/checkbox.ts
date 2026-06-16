import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ZyraCheckbox, ZyraButton, ZyraCard, CheckboxSize } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, ZyraCheckbox, ZyraButton, ZyraCard, Controls],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
})
export class Checkbox {
    checked       = signal(false);
    size          = signal<CheckboxSize>('md');
    disabled      = signal(false);
    indeterminate = signal(false);
    label         = signal('Accept terms and conditions');
    labelPosition = signal<'left' | 'right'>('right');
    copied        = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'labelPosition',
            label: 'label position',
            options: ['left', 'right'],
            signal: this.labelPosition as ReturnType<typeof signal<string>>,
        },
        {
            type: 'text',
            key: 'label',
            label: 'label',
            placeholder: 'Label text...',
            signal: this.label,
        },
        {
            type: 'toggle',
            key: 'disabled',
            label: 'boolean inputs',
            toggleLabel: 'disabled',
            signal: this.disabled,
        },
        {
            type: 'toggle',
            key: 'indeterminate',
            label: '',
            toggleLabel: 'indeterminate',
            signal: this.indeterminate,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.label()) attrs.push(`  label="${this.label()}"`);
        if (this.labelPosition() !== 'right') attrs.push(`  labelPosition="${this.labelPosition()}"`);
        if (this.checked()) attrs.push(`  [checked]="true"`);
        if (this.disabled()) attrs.push(`  [disabled]="true"`);
        if (this.indeterminate()) attrs.push(`  [indeterminate]="true"`);
        return attrs.length === 0
            ? `<zyra-checkbox />`
            : [`<zyra-checkbox`, ...attrs, `/>`].join('\n');
    });

    // Real-world permissions form
    permissionsForm = new FormGroup({
        read:    new FormControl(true),
        write:   new FormControl(false),
        execute: new FormControl(false),
        admin:   new FormControl(false),
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.checked.set(false);
        this.size.set('md');
        this.disabled.set(false);
        this.indeterminate.set(false);
        this.label.set('Accept terms and conditions');
        this.labelPosition.set('right');
    }
}
