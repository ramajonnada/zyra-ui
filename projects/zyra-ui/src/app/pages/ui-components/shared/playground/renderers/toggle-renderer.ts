import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraToggle } from 'zyra-ng-ui';

@Component({
    selector: 'pg-toggle-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraToggle],
    template: `
        <zyra-toggle
            [size]="$any(size())"
            [label]="label()"
            [labelPosition]="$any(labelPosition())"
            [disabled]="disabled()"
        />
    `,
})
export class ToggleRenderer {
    size          = input<string>('md');
    label         = input<string>('Enable notifications');
    labelPosition = input<string>('right');
    disabled      = input<boolean>(false);
}
