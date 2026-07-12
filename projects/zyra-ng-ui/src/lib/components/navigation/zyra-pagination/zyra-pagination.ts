import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { chevronLeft, chevronRight } from '../../../shared/zyra-icons';

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationItem = number | 'ellipsis';

@Component({
    selector: 'zyra-pagination',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    templateUrl: './zyra-pagination.html',
    styleUrl: './zyra-pagination.scss',
})
export class ZyraPagination {
    // ── Inputs ────────────────────────────────────────────────
    totalPages = input<number>(1);
    currentPage = input<number>(1);
    siblingCount = input<number>(1);
    size = input<PaginationSize>('md');
    disabled = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    pageChange = output<number>();

    readonly icons = { chevronLeft, chevronRight };

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-pagination zyr-pagination--${this.size()}`);

    readonly isFirstPage = computed(() => this.currentPage() <= 1);
    readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());

    pageItems = computed<PaginationItem[]>(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const siblings = this.siblingCount();
        const totalVisible = siblings * 2 + 5;

        if (total <= totalVisible) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const leftSibling = Math.max(current - siblings, 1);
        const rightSibling = Math.min(current + siblings, total);

        const showLeftEllipsis = leftSibling > 2;
        const showRightEllipsis = rightSibling < total - 1;

        const items: PaginationItem[] = [1];

        if (showLeftEllipsis) {
            items.push('ellipsis');
        } else {
            for (let i = 2; i < leftSibling; i++) items.push(i);
        }

        for (let i = leftSibling === 1 ? 2 : leftSibling; i <= (rightSibling === total ? total - 1 : rightSibling); i++) {
            if (i > 1 && i < total) items.push(i);
        }

        if (showRightEllipsis) {
            items.push('ellipsis');
        } else {
            for (let i = rightSibling + 1; i < total; i++) items.push(i);
        }

        items.push(total);

        return items;
    });

    goToPage(page: number): void {
        if (this.disabled() || page < 1 || page > this.totalPages() || page === this.currentPage()) return;
        this.pageChange.emit(page);
    }

    prev(): void {
        if (this.disabled() || this.isFirstPage()) return;
        this.pageChange.emit(this.currentPage() - 1);
    }

    next(): void {
        if (this.disabled() || this.isLastPage()) return;
        this.pageChange.emit(this.currentPage() + 1);
    }
}
