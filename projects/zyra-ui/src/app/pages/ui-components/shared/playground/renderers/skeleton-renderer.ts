import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraSkeleton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-skeleton-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSkeleton],
    styles: [':host { display: block; width: 100%; max-width: 480px; }'],
    template: `
        <zyra-skeleton
            [variant]="$any(variant())"
            [lines]="linesNum()"
            [rows]="rowsNum()"
            [animated]="animated()"
            [width]="circleSize()"
            [height]="circleSize()"
        />
    `,
})
export class SkeletonRenderer {
    variant  = input<string>('card');
    lines    = input<string>('3');
    rows     = input<string>('5');
    animated = input<boolean>(true);

    readonly linesNum  = computed(() => +this.lines());
    readonly rowsNum   = computed(() => +this.rows());
    readonly circleSize = computed(() => this.variant() === 'circle' ? '56px' : '');
}
