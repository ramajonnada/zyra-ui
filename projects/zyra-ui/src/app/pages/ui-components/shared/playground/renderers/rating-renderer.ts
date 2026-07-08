import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ZyraRating } from 'zyra-ng-ui';

@Component({
    selector: 'pg-rating-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraRating],
    template: `
        <zyra-rating
            [value]="value()"
            [max]="maxNum()"
            [size]="$any(size())"
            [readonly]="readonly()"
            [disabled]="disabled()"
            (valueChange)="value.set($event)"
        />
    `,
})
export class RatingRenderer {
    max = input<string>('5');
    size = input<string>('md');
    readonly = input<boolean>(false);
    disabled = input<boolean>(false);

    readonly maxNum = computed(() => +this.max());
    value = signal(3);
}
