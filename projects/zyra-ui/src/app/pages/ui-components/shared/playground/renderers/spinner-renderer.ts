import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraSpinner } from 'zyra-ng-ui';

@Component({
    selector: 'pg-spinner-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSpinner],
    template: ` <zyra-spinner [size]="$any(size())" [color]="$any(color())" [label]="label()" /> `,
})
export class SpinnerRenderer {
    size = input<string>('md');
    color = input<string>('accent');
    label = input<string>('Loading…');
}
