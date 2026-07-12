import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ZyraButton, ZyraButtonGroup } from 'zyra-ng-ui';

@Component({
    selector: 'pg-button-group-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraButton, ZyraButtonGroup],
    template: `
        <zyra-button-group
            [orientation]="$any(orientation())"
            [join]="$any(join())"
            [variant]="$any(variant())"
            [selectionMode]="$any(selectionMode())"
            [disabled]="disabled()"
            [(value)]="value"
            aria-label="Text alignment"
        >
            <zyra-button value="left">Left</zyra-button>
            <zyra-button value="center">Center</zyra-button>
            <zyra-button value="right">Right</zyra-button>
        </zyra-button-group>
    `,
})
export class ButtonGroupRenderer {
    orientation = input<string>('horizontal');
    join = input<string>('separated');
    variant = input<string>('outline');
    selectionMode = input<string>('single');
    disabled = input<boolean>(false);

    value = signal<string | number | (string | number)[] | null>('left');
}
