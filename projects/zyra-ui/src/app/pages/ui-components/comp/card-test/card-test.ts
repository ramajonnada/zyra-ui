import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CardPadding,
    CardVariant,
    ZyraAvatar,
    ZyraBadge,
    ZyraButton,
    ZyraCard,
    ZyraThemeService,
    ZyraToastContainer,
    ZyraToastService,
} from 'zyra-ng-ui';

@Component({
    selector: 'app-card-test',
    imports: [
        FormsModule,
        ZyraCard,
        ZyraButton,
        ZyraBadge,
        ZyraAvatar,
        ZyraToastContainer,
        TitleCasePipe,
    ],
    templateUrl: './card-test.html',
    styleUrl: './card-test.scss',
})
export class CardTest {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    variant = signal<CardVariant>('default');
    padding = signal<CardPadding>('md');
    hasHeader = signal(false);
    hasFooter = signal(false);
    clickable = signal(false);
    preset = signal('Simple text');

    copied = signal(false);
    eventLog = signal<{ time: string; msg: string }[]>([]);

    variants: CardVariant[] = ['default', 'outlined', 'elevated', 'ghost'];
    paddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];
    presets = ['Simple text', 'With image', 'With stats', 'Empty (no padding)'];

    generatedCode = computed(() => this.buildGeneratedCode());

    private buildGeneratedCode(): string {
        const lines: string[] = ['<zyr-card'];

        if (this.variant() !== 'default') lines.push(`  variant="${this.variant()}"`);
        if (this.padding() !== 'md') lines.push(`  padding="${this.padding()}"`);
        if (this.hasHeader()) lines.push(`  [hasHeader]="true"`);
        if (this.hasFooter()) lines.push(`  [hasFooter]="true"`);
        if (this.clickable()) lines.push(`  [clickable]="true"`);
        if (this.clickable()) lines.push(`  (cardClick)="onCardClick()"`);

        lines.push(`>`);

        if (this.hasHeader()) {
            lines.push(`  <div slot="header">`);
            lines.push(`    <!-- header content -->`);
            lines.push(`  </div>`);
        }

        lines.push(`  <!-- body content -->`);

        if (this.hasFooter()) {
            lines.push(`  <div slot="footer">`);
            lines.push(`    <!-- footer content -->`);
            lines.push(`  </div>`);
        }

        lines.push(`</zyr-card>`);
        return lines.join('\n');
    }

    onCardClick(): void {
        this.log('(cardClick) output fired!');
        this.toastService.info('Card clicked!');
    }

    log(msg: string): void {
        const time = new Date().toLocaleTimeString();
        this.eventLog.update((log) => [{ time, msg }, ...log].slice(0, 10));
    }

    copy(): void {
        navigator.clipboard.writeText(this.buildGeneratedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.variant.set('default');
        this.padding.set('md');
        this.hasHeader.set(false);
        this.hasFooter.set(false);
        this.clickable.set(false);
        this.preset.set('Simple text');
        this.eventLog.set([]);
    }
}
