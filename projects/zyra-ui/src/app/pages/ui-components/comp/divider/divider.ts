import { Component, computed, signal } from '@angular/core';
import { DividerAlign, DividerOrientation, DividerVariant, ZyraButton, ZyraCard, ZyraDivider } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-divider',
    standalone: true,
    imports: [ZyraDivider, ZyraButton, ZyraCard, Controls],
    templateUrl: './divider.html',
    styleUrl: './divider.scss',
})
export class Divider {
    orientation = signal<DividerOrientation>('horizontal');
    variant = signal<DividerVariant>('solid');
    align = signal<DividerAlign>('center');
    label = signal('or');
    width = signal('1px');
    copied = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'orientation',
            label: 'orientation',
            options: ['horizontal', 'vertical'],
            signal: this.orientation as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'variant',
            label: 'variant',
            options: ['solid', 'dashed', 'dotted'],
            signal: this.variant as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'align',
            label: 'align',
            options: ['start', 'center', 'end'],
            signal: this.align as ReturnType<typeof signal<string>>,
        },
        {
            type: 'text',
            key: 'label',
            label: 'label',
            placeholder: 'Divider label...',
            signal: this.label,
        },
        {
            type: 'text',
            key: 'width',
            label: 'width',
            placeholder: '1px, 2px...',
            signal: this.width,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.orientation() !== 'horizontal') attrs.push(`  orientation="${this.orientation()}"`);
        if (this.variant() !== 'solid') attrs.push(`  variant="${this.variant()}"`);
        if (this.align() !== 'center') attrs.push(`  align="${this.align()}"`);
        if (this.label()) attrs.push(`  label="${this.label()}"`);
        if (this.width() !== '1px') attrs.push(`  width="${this.width()}"`);

        return attrs.length === 0
            ? `<zyra-divider />`
            : [`<zyra-divider`, ...attrs, `/>`].join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.orientation.set('horizontal');
        this.variant.set('solid');
        this.align.set('center');
        this.label.set('or');
        this.width.set('1px');
    }
}
