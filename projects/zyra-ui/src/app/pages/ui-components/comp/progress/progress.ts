import { Component, computed, signal } from '@angular/core';
import { ProgressSize, ProgressVariant, ZyraButton, ZyraCard, ZyraProgress } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-progress',
    standalone: true,
    imports: [ZyraProgress, ZyraButton, ZyraCard, Controls],
    templateUrl: './progress.html',
    styleUrl: './progress.scss',
})
export class Progress {
    value = signal(65);
    variant = signal<ProgressVariant>('default');
    size = signal<ProgressSize>('md');
    indeterminate = signal(false);
    showLabel = signal(true);
    copied = signal(false);

    variants: ProgressVariant[] = ['default', 'success', 'warning', 'danger', 'info'];

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'toggle',
            key: 'showLabel',
            label: 'boolean inputs',
            toggleLabel: 'showLabel',
            signal: this.showLabel,
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
        if (this.variant() !== 'default') attrs.push(`  variant="${this.variant()}"`);
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (!this.indeterminate()) attrs.push(`  [value]="${this.value()}"`);
        if (this.indeterminate()) attrs.push(`  [indeterminate]="true"`);
        if (this.showLabel()) attrs.push(`  [showLabel]="true"`);

        const lines = attrs.length === 0
            ? [`<zyra-progress />`]
            : [`<zyra-progress`, ...attrs, `/>`];
        return lines.join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.value.set(65);
        this.variant.set('default');
        this.size.set('md');
        this.indeterminate.set(false);
        this.showLabel.set(true);
    }
}
