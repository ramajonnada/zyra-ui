import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraChip } from 'zyra-ng-ui';

@Component({
    selector: 'pg-chip-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraChip],
    template: `
        <zyra-chip
            [size]="$any(size())"
            [variant]="$any(variant())"
            [dismissible]="dismissible()"
            [disabled]="disabled()"
            >{{ label() }}</zyra-chip
        >
    `,
})
export class ChipRenderer {
    size = input<string>('md');
    variant = input<string>('default');
    label = input<string>('Frontend');
    dismissible = input<boolean>(false);
    disabled = input<boolean>(false);
}
