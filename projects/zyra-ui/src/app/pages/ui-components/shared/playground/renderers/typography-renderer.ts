import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraTypography } from 'zyra-ng-ui';

@Component({
    selector: 'pg-typography-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTypography],
    template: `
        <zyra-typography
            [variant]="$any(variant())"
            [as]="tagOverride()"
            [weight]="$any(weight())"
            [align]="$any(align())"
            [muted]="muted()"
            [truncate]="truncate()"
        >
            {{ text() }}
        </zyra-typography>
    `,
})
export class TypographyRenderer {
    variant = input<string>('h3');
    tagOverride = input<string>('', { alias: 'as' });
    weight = input<string>('');
    align = input<string>('left');
    muted = input<boolean>(false);
    truncate = input<boolean>(false);
    text = input<string>('The quick brown fox jumps over the lazy dog');
}
