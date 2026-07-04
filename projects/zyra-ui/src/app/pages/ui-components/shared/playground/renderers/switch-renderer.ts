import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraSwitch } from 'zyra-ng-ui';

@Component({
    selector: 'pg-switch-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSwitch],
    template: `
        <zyra-switch
            [size]="$any(size())"
            [label]="label()"
            [labelPosition]="$any(labelPosition())"
            [disabled]="disabled()"
        />
    `,
})
export class SwitchRenderer {
    size = input<string>('md');
    label = input<string>('Enable notifications');
    labelPosition = input<string>('right');
    disabled = input<boolean>(false);
}
