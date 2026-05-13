import { Component, inject, signal, computed } from '@angular/core';
import { BadgeSize, BadgeVariant, ZyraBadge, ZyraButton, ZyraCard, ZyraThemeService, ZyraToastContainer, ZyraToastService } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [ZyraBadge, ZyraButton, ZyraCard, ZyraToastContainer, Controls],
    templateUrl: './badge.html',
    styleUrl: './badge.scss',
})
export class Badge {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    variant = signal<BadgeVariant>('success');
    size = signal<BadgeSize>('md');
    dot = signal(false);
    labelText = signal('Badge');
    copied = signal(false);

    variants: BadgeVariant[] = ['success', 'warning', 'danger', 'info', 'purple', 'default'];

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
            label: 'label text',
            placeholder: 'Badge label...',
            signal: this.labelText,
        },
        {
            type: 'toggle',
            key: 'dot',
            label: 'boolean inputs',
            toggleLabel: 'dot',
            signal: this.dot,
        },
    ];

    generatedCode = computed(() => {
        const lines: string[] = ['<zyra-badge'];
        if (this.variant() !== 'default') lines.push(`  variant="${this.variant()}"`);
        if (this.size() !== 'md') lines.push(`  size="${this.size()}"`);
        if (this.dot()) lines.push(`  [dot]="true"`);
        lines.push(`>`);
        lines.push(`  ${this.labelText()}`);
        lines.push(`</zyra-badge>`);
        return lines.join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.variant.set('success');
        this.size.set('md');
        this.dot.set(false);
        this.labelText.set('Badge');
    }
}
