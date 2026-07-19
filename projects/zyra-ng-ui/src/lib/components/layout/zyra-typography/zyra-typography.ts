import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body-lg'
    | 'body'
    | 'body-sm'
    | 'caption'
    | 'overline';
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold' | '';
export type TypographyAlign = 'left' | 'center' | 'right';

const TAG_MAP: Record<TypographyVariant, string> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    'body-lg': 'p',
    body: 'p',
    'body-sm': 'p',
    caption: 'span',
    overline: 'span',
};

@Component({
    selector: 'zyra-typography',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    templateUrl: './zyra-typography.html',
    styleUrl: './zyra-typography.scss',
})
export class ZyraTypography {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<TypographyVariant>('body');
    as = input<string>('');
    weight = input<TypographyWeight>('');
    align = input<TypographyAlign>('left');
    muted = input(false, { transform: booleanAttribute });
    truncate = input(false, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    tagName = computed(() => this.as() || TAG_MAP[this.variant()]);

    hostClass = computed(() => {
        const classes = [
            'zyr-typography',
            `zyr-typography--${this.variant()}`,
            `zyr-typography--align-${this.align()}`,
        ];
        if (this.weight()) classes.push(`zyr-typography--weight-${this.weight()}`);
        if (this.muted()) classes.push('zyr-typography--muted');
        if (this.truncate()) classes.push('zyr-typography--truncate');
        return classes.join(' ');
    });
}
