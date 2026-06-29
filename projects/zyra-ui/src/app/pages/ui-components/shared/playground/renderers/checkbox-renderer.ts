import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraCheckbox } from 'zyra-ng-ui';

@Component({
    selector: 'pg-checkbox-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraCheckbox],
    template: `
        <zyra-checkbox
            [size]="$any(size())"
            [label]="label()"
            [labelPosition]="$any(labelPosition())"
            [disabled]="disabled()"
            [indeterminate]="indeterminate()"
        />
    `,
})
export class CheckboxRenderer {
    size          = input<string>('md');
    label         = input<string>('Accept terms and conditions');
    labelPosition = input<string>('right');
    disabled      = input<boolean>(false);
    indeterminate = input<boolean>(false);
}
