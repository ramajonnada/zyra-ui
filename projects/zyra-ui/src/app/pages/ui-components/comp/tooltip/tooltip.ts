import { Component, inject, signal, computed } from '@angular/core';
import { ZyraTooltip, ZyraButton, ZyraBadge, ZyraCard, ZyraAvatar, ZyraToastService, ZyraToastContainer, ZyraThemeService, TooltipPosition } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-tooltip-playground',
    standalone: true,
    imports: [ZyraTooltip, ZyraButton, ZyraBadge, ZyraCard, ZyraAvatar, ZyraToastContainer, Controls],
    templateUrl: './tooltip.html',
    styleUrl: './tooltip.scss',
})
export class Tooltip {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    position = signal<TooltipPosition>('top');
    maxWidth = signal('200px');
    triggerType = signal('Button');
    tooltipText = signal('This is a tooltip!');
    copied = signal(false);

    readonly positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'position',
            label: 'position',
            options: ['top', 'bottom', 'left', 'right'],
            signal: this.position as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'maxWidth',
            label: 'maxWidth',
            options: ['120px', '160px', '200px', '240px', '300px'],
            signal: this.maxWidth,
        },
        {
            type: 'button-group',
            key: 'triggerType',
            label: 'trigger',
            options: ['Button', 'Icon', 'Text', 'Badge', 'Avatar'],
            signal: this.triggerType,
        },
        {
            type: 'text',
            key: 'tooltipText',
            label: 'tooltip text',
            placeholder: 'Tooltip content...',
            signal: this.tooltipText,
        },
    ];

    generatedCode = computed(() => {
        const lines: string[] = ['<zyra-tooltip'];
        lines.push(`  text="${this.tooltipText()}"`);
        if (this.position() !== 'top') lines.push(`  position="${this.position()}"`);
        if (this.maxWidth() !== '200px') lines.push(`  maxWidth="${this.maxWidth()}"`);
        lines.push(`>`);
        lines.push(`  <!-- your trigger element -->`);
        lines.push(`  <zyra-button variant="primary">Hover me</zyra-button>`);
        lines.push(`</zyra-tooltip>`);
        return lines.join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.position.set('top');
        this.maxWidth.set('200px');
        this.triggerType.set('Button');
        this.tooltipText.set('This is a tooltip!');
    }
}
