import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ZyraTooltip,
    ZyraButton,
    ZyraBadge,
    ZyraToastService,
    ZyraToastContainer,
    ZyraThemeService,
    TooltipPosition,
} from 'zyra-ng-ui';

@Component({
    selector: 'app-tooltip-playground',
    standalone: true,
    imports: [FormsModule, ZyraTooltip, ZyraButton, ZyraBadge, ZyraToastContainer],
    templateUrl: './tooltip.html',
    styleUrl: './tooltip.scss',
})
export class Tooltip {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    // ── Controls ──────────────────────────────────────────────
    position = signal<TooltipPosition>('top');
    maxWidth = signal('200px');
    triggerType = signal('Button');
    tooltipText = 'This is a tooltip!';

    // ── UI state ──────────────────────────────────────────────
    copied = signal(false);

    // ── Options ───────────────────────────────────────────────
    positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
    maxWidths = ['120px', '160px', '200px', '240px', '300px'];
    triggerTypes = ['Button', 'Icon', 'Text', 'Badge', 'Avatar'];

    // ── Generated code ────────────────────────────────────────
    generatedCode = computed(() => {
        const lines: string[] = ['<zyra-tooltip'];
        lines.push(`  text="${this.tooltipText}"`);
        if (this.position() !== 'top') lines.push(`  position="${this.position()}"`);
        if (this.maxWidth() !== '200px') lines.push(`  maxWidth="${this.maxWidth()}"`);
        lines.push(`>`);
        lines.push(`  <!-- your trigger element -->`);
        lines.push(`  <zyra-button variant="primary">Hover me</zyra-button>`);
        lines.push(`</zyra-tooltip>`);
        return lines.join('\n');
    });

    // ── Methods ───────────────────────────────────────────────
    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.position.set('top');
        // this.maxWidth.set('200px');
        this.triggerType.set('Button');
        this.tooltipText = 'This is a tooltip!';
    }
}
