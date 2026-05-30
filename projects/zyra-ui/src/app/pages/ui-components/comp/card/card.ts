import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-card',
    imports: [
        ZyraCard,
        ZyraButton,
        ZyraBadge,
        ZyraAvatar,
        ZyraToastContainer,
        TitleCasePipe,
        Controls,
    ],
    templateUrl: './card.html',
    styleUrl: './card.scss',
})
export class Card {
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

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'variant',
            label: 'variant',
            options: ['default', 'outlined', 'elevated', 'ghost'],
            signal: this.variant as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'padding',
            label: 'padding',
            options: ['none', 'sm', 'md', 'lg'],
            signal: this.padding as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'preset',
            label: 'content preset',
            options: ['Simple text', 'With image', 'With stats', 'Empty (no padding)'],
            signal: this.preset,
        },
        {
            type: 'toggle',
            key: 'hasHeader',
            label: 'boolean inputs',
            toggleLabel: 'hasHeader',
            signal: this.hasHeader,
        },
        {
            type: 'toggle',
            key: 'hasFooter',
            label: '',
            toggleLabel: 'hasFooter',
            signal: this.hasFooter,
        },
        {
            type: 'toggle',
            key: 'clickable',
            label: '',
            toggleLabel: 'clickable',
            signal: this.clickable,
        },
    ];

    generatedCode = computed(() => this.buildGeneratedCode());

    private buildGeneratedCode(): string {
        const attrs: string[] = [];

        if (this.variant() !== 'default') attrs.push(`  variant="${this.variant()}"`);
        if (this.padding() !== 'md') attrs.push(`  padding="${this.padding()}"`);
        if (this.hasHeader()) attrs.push(`  [hasHeader]="true"`);
        if (this.hasFooter()) attrs.push(`  [hasFooter]="true"`);
        if (this.clickable()) attrs.push(`  [clickable]="true"`);
        if (this.clickable()) attrs.push(`  (cardClick)="onCardClick()"`);

        const lines: string[] = [];
        if (attrs.length === 0) {
            lines.push(`<zyra-card>`);
        } else {
            lines.push(`<zyra-card`, ...attrs, `>`)
        }

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

        lines.push(`</zyra-card>`);
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
