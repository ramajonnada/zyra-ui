import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ZyraPagination } from 'zyra-ng-ui';

@Component({
    selector: 'pg-pagination-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraPagination],
    template: `
        <zyra-pagination
            [totalPages]="totalPagesNum()"
            [currentPage]="currentPage()"
            [siblingCount]="siblingCountNum()"
            [size]="$any(size())"
            [disabled]="disabled()"
            (pageChange)="currentPage.set($event)"
        />
    `,
})
export class PaginationRenderer {
    totalPages = input<string>('10');
    siblingCount = input<string>('1');
    size = input<string>('md');
    disabled = input<boolean>(false);

    readonly totalPagesNum = computed(() => +this.totalPages());
    readonly siblingCountNum = computed(() => +this.siblingCount());
    currentPage = signal(1);
}
