import { Component, computed, signal } from '@angular/core';
import { ToggleSize, ZyraButton, ZyraCard, ZyraToggle } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-toggle',
    standalone: true,
    imports: [ZyraToggle, ZyraButton, ZyraCard, Controls],
    templateUrl: './toggle.html',
    styleUrl: './toggle.scss',
})
export class Toggle {
    checked = signal(false);
    size = signal<ToggleSize>('md');
    disabled = signal(false);
    label = signal('Enable notifications');
    labelPosition = signal<'left' | 'right'>('right');
    copied = signal(false);

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
            placeholder: 'Toggle label...',
            signal: this.label,
        },
        {
            type: 'toggle',
            key: 'disabled',
            label: 'boolean inputs',
            toggleLabel: 'disabled',
            signal: this.disabled,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.label()) attrs.push(`  label="${this.label()}"`);
        if (this.labelPosition() !== 'right') attrs.push(`  labelPosition="${this.labelPosition()}"`);
        if (this.checked()) attrs.push(`  [checked]="true"`);
        if (this.disabled()) attrs.push(`  [disabled]="true"`);

        return attrs.length === 0
            ? `<zyra-toggle />`
            : [`<zyra-toggle`, ...attrs, `/>`].join('\n');
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
        this.label.set('Enable notifications');
        this.labelPosition.set('right');
    }
}
