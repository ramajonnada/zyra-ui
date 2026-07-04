import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraToggle } from 'zyra-ng-ui';

@Component({
    selector: 'pg-toggle-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraToggle],
    template: `
        <zyra-toggle [size]="$any(size())" [disabled]="disabled()" aria-label="Bold"> B </zyra-toggle>
    `,
})
export class ToggleRenderer {
    size = input<string>('md');
    disabled = input<boolean>(false);
}
