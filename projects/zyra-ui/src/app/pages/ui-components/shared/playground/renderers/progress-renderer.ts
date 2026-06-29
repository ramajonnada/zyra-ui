import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraProgress } from 'zyra-ng-ui';

@Component({
    selector: 'pg-progress-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraProgress],
    styles: [':host { display: block; width: 100%; max-width: 400px; }'],
    template: `
        <zyra-progress
            [size]="$any(size())"
            [variant]="$any(variant())"
            [value]="valueNum()"
            [indeterminate]="indeterminate()"
            [showLabel]="showLabel()"
        />
    `,
})
export class ProgressRenderer {
    size          = input<string>('md');
    variant       = input<string>('default');
    value         = input<string>('65');
    indeterminate = input<boolean>(false);
    showLabel     = input<boolean>(true);

    readonly valueNum = computed(() => +this.value());
}
