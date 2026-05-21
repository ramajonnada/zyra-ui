import { Component, computed, signal } from '@angular/core';
import { ChipSize, ChipVariant, ZyraButton, ZyraCard, ZyraChip } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-chip',
    standalone: true,
    imports: [ZyraChip, ZyraButton, ZyraCard, Controls],
    templateUrl: './chip.html',
    styleUrl: './chip.scss',
})
export class Chip {
    variant = signal<ChipVariant>('default');
    size = signal<ChipSize>('md');
    dismissible = signal(false);
    selectable = signal(false);
    selected = signal(false);
    disabled = signal(false);
    labelText = signal('Frontend');
    copied = signal(false);

    variants: ChipVariant[] = ['default', 'success', 'warning', 'danger', 'info', 'purple'];
    chips = signal(['Angular', 'TypeScript', 'SCSS', 'Signals', 'SSR']);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'text',
            key: 'label',
            label: 'label',
            placeholder: 'Chip label...',
            signal: this.labelText,
        },
        {
            type: 'toggle',
            key: 'dismissible',
            label: 'boolean inputs',
            toggleLabel: 'dismissible',
            signal: this.dismissible,
        },
        {
            type: 'toggle',
            key: 'selectable',
            label: '',
            toggleLabel: 'selectable',
            signal: this.selectable,
        },
        {
            type: 'toggle',
            key: 'disabled',
            label: '',
            toggleLabel: 'disabled',
            signal: this.disabled,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.variant() !== 'default') attrs.push(`  variant="${this.variant()}"`);
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.dismissible()) attrs.push(`  [dismissible]="true"`);
        if (this.selectable()) attrs.push(`  [selectable]="true"`);
        if (this.disabled()) attrs.push(`  [disabled]="true"`);

        const tag = attrs.length === 0 ? `<zyra-chip>` : [`<zyra-chip`, ...attrs, `>`].join('\n');
        return `${tag}\n  ${this.labelText()}\n</zyra-chip>`;
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    dismiss(chip: string): void {
        this.chips.update(list => list.filter(c => c !== chip));
    }

    reset(): void {
        this.variant.set('default');
        this.size.set('md');
        this.dismissible.set(false);
        this.selectable.set(false);
        this.selected.set(false);
        this.disabled.set(false);
        this.labelText.set('Frontend');
        this.chips.set(['Angular', 'TypeScript', 'SCSS', 'Signals', 'SSR']);
    }
}
