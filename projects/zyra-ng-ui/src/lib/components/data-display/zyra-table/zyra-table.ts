import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { chevronDown } from '../../../shared/zyra-icons';
import { ZyraCheckbox } from '../../forms/zyra-checkbox/zyra-checkbox';
import { ZyraPagination } from '../../navigation/zyra-pagination/zyra-pagination';
import { ZyraEmptyState } from '../zyra-empty-state/zyra-empty-state';
import { ZyraSkeleton } from '../../feedback/zyra-skeleton/zyra-skeleton';

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc';
export type TableSelectionMode = 'none' | 'single' | 'multiple';
export type TableSize = 'sm' | 'md' | 'lg';
export type TableRowKey = string | number;

export interface TableColumn<T = Record<string, unknown>> {
    key: string;
    label: string;
    sortable?: boolean;
    align?: TableAlign;
    width?: string;
    /** Custom cell formatter — defaults to String(value), with Date rendered via toLocaleDateString(). */
    format?: (value: unknown, row: T) => string;
}

export interface TableSortState {
    key: string;
    direction: TableSortDirection;
}

interface RowPair<T> {
    row: T;
    index: number;
}

let tableIdCounter = 0;

@Component({
    selector: 'zyra-table',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent, ZyraCheckbox, ZyraPagination, ZyraEmptyState, ZyraSkeleton],
    templateUrl: './zyra-table.html',
    styleUrl: './zyra-table.scss',
})
export class ZyraTable<T extends Record<string, unknown> = Record<string, unknown>> {
    private readonly _el = inject(ElementRef<HTMLElement>);

    // ── Inputs ────────────────────────────────────────────────
    columns = input.required<TableColumn<T>[]>();
    rows = input.required<T[]>();
    /** Derives a stable identity for each row; defaults to its position in `rows`. */
    rowKey = input<(row: T, index: number) => TableRowKey>((_row, index) => index);
    selectionMode = input<TableSelectionMode>('none');
    /** Disables internal sorting — the component still tracks/emits `sort`, but displays `rows` as given (for server-side sorting). */
    manualSort = input(false, { transform: booleanAttribute });
    pageSize = input<number | null>(null);
    loading = input(false, { transform: booleanAttribute });
    size = input<TableSize>('md');
    stickyHeader = input(false, { transform: booleanAttribute });
    emptyTitle = input<string>('No data');
    emptyDescription = input<string>("There's nothing to show here yet.");

    // ── Two-way state ─────────────────────────────────────────
    selected = model<TableRowKey[]>([]);
    sort = model<TableSortState | null>(null);
    page = model<number>(1);

    // ── Outputs ───────────────────────────────────────────────
    rowClick = output<T>();

    readonly tableId = `zyr-table-${++tableIdCounter}`;
    readonly icons = { chevronDown };

    // ── Computed ──────────────────────────────────────────────
    readonly hostClass = computed(() => `zyr-table zyr-table--${this.size()}`);

    readonly skeletonRows = computed(() => Array.from({ length: this.pageSize() ?? 5 }, (_, i) => i));

    private readonly _pairs = computed<RowPair<T>[]>(() => this.rows().map((row, index) => ({ row, index })));

    private readonly _sortedPairs = computed<RowPair<T>[]>(() => {
        const sortState = this.sort();
        const pairs = this._pairs();
        if (this.manualSort() || !sortState) return pairs;

        const dir = sortState.direction === 'asc' ? 1 : -1;
        return [...pairs].sort(
            (a, b) => this._compare(a.row[sortState.key], b.row[sortState.key]) * dir,
        );
    });

    readonly totalPages = computed(() => {
        const size = this.pageSize();
        if (!size) return 1;
        return Math.max(1, Math.ceil(this._sortedPairs().length / size));
    });

    readonly pagedPairs = computed<RowPair<T>[]>(() => {
        const size = this.pageSize();
        const pairs = this._sortedPairs();
        if (!size) return pairs;
        const start = (this.page() - 1) * size;
        return pairs.slice(start, start + size);
    });

    readonly isAllSelected = computed(() => {
        const visible = this.pagedPairs();
        return visible.length > 0 && visible.every((pair) => this.isSelected(pair));
    });

    readonly isSomeSelected = computed(
        () => !this.isAllSelected() && this.pagedPairs().some((pair) => this.isSelected(pair)),
    );

    constructor() {
        // Clamp `page` whenever the available range shrinks — e.g. `rows`
        // updates to fewer entries, or `pageSize` changes — so it never
        // points past the last page and silently renders zero rows.
        effect(() => {
            const total = this.totalPages();
            if (this.page() > total) this.page.set(total);
        });
    }

    // ── Keyboard navigation (roving tabindex) ──────────────────
    // Two independent zones — sortable headers and body rows — each with
    // their own single tab stop; Arrow Down/Up bridge between the tracked
    // position in one zone and the other, matching the WAI-ARIA pattern for
    // a sortable table combined with row navigation.
    private readonly _focusedHeaderKey = signal<string | null>(null);
    private readonly _focusedRowKey = signal<TableRowKey | null>(null);

    readonly sortableColumns = computed(() => this.columns().filter((c) => c.sortable));

    readonly focusedHeaderKey = computed(() => this._focusedHeaderKey() ?? this.sortableColumns()[0]?.key ?? null);
    readonly focusedRowKey = computed(() => {
        const tracked = this._focusedRowKey();
        if (tracked !== null) return tracked;
        const first = this.pagedPairs()[0];
        return first ? this.keyOf(first) : null;
    });

    isHeaderFocused(colKey: string): boolean {
        return this.focusedHeaderKey() === colKey;
    }

    isRowFocused(pair: RowPair<T>): boolean {
        return this.focusedRowKey() === this.keyOf(pair);
    }

    headerDomId(colKey: string): string {
        return `${this.tableId}-th-${colKey}`;
    }

    rowDomId(key: TableRowKey): string {
        return `${this.tableId}-row-${key}`;
    }

    onHeaderFocus(colKey: string): void {
        if (!this.isHeaderFocused(colKey)) this._focusedHeaderKey.set(colKey);
    }

    onRowFocus(pair: RowPair<T>): void {
        if (!this.isRowFocused(pair)) this._focusedRowKey.set(this.keyOf(pair));
    }

    rowAriaLabel(pair: RowPair<T>): string {
        const first = this.columns()[0];
        const descriptor = first ? this.formatCell(first, pair.row) : '';
        return `Select row: ${descriptor || String(this.keyOf(pair))}`;
    }

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        if (target.closest('.zyr-table__th-btn')) {
            this._onHeaderKeydown(event);
        } else if (target.closest('.zyr-table__row')) {
            this._onRowKeydown(event);
        }
    }

    private _onHeaderKeydown(event: KeyboardEvent): void {
        const sortable = this.sortableColumns();
        if (sortable.length === 0) return;
        const idx = sortable.findIndex((c) => c.key === this.focusedHeaderKey());

        switch (event.key) {
            case 'ArrowRight': {
                event.preventDefault();
                this._focusHeader(sortable[Math.min(idx + 1, sortable.length - 1)].key);
                break;
            }
            case 'ArrowLeft': {
                event.preventDefault();
                this._focusHeader(sortable[Math.max(idx - 1, 0)].key);
                break;
            }
            case 'ArrowDown': {
                event.preventDefault();
                const first = this.pagedPairs()[0];
                if (first) this._focusRow(first);
                break;
            }
            // Enter/Space fall through to the native <button> click, which
            // already calls toggleSort() — nothing extra needed here.
        }
    }

    private _onRowKeydown(event: KeyboardEvent): void {
        const pairs = this.pagedPairs();
        if (pairs.length === 0) return;
        const idx = pairs.findIndex((p) => this.keyOf(p) === this.focusedRowKey());
        const current = idx >= 0 ? pairs[idx] : pairs[0];

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                this._focusRow(pairs[Math.min(idx + 1, pairs.length - 1)]);
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                if (idx <= 0) {
                    const col = this.sortableColumns()[0];
                    if (col) this._focusHeader(col.key);
                } else {
                    this._focusRow(pairs[idx - 1]);
                }
                break;
            }
            case 'Home': {
                event.preventDefault();
                this._focusRow(pairs[0]);
                break;
            }
            case 'End': {
                event.preventDefault();
                this._focusRow(pairs[pairs.length - 1]);
                break;
            }
            case 'Enter':
            case ' ': {
                event.preventDefault();
                if (this.selectionMode() !== 'none') this.toggleRow(current);
                this.onRowClick(current.row);
                break;
            }
        }
    }

    private _focusHeader(colKey: string): void {
        this._focusedHeaderKey.set(colKey);
        this._focusDom(this.headerDomId(colKey));
    }

    private _focusRow(pair: RowPair<T>): void {
        this._focusedRowKey.set(this.keyOf(pair));
        this._focusDom(this.rowDomId(this.keyOf(pair)));
    }

    private _focusDom(id: string): void {
        const el = this._el.nativeElement.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null;
        el?.focus();
    }

    // ── Sorting ───────────────────────────────────────────────
    toggleSort(col: TableColumn<T>): void {
        if (!col.sortable) return;
        const current = this.sort();
        if (!current || current.key !== col.key) {
            this.sort.set({ key: col.key, direction: 'asc' });
        } else if (current.direction === 'asc') {
            this.sort.set({ key: col.key, direction: 'desc' });
        } else {
            this.sort.set(null);
        }
    }

    ariaSortFor(col: TableColumn<T>): 'ascending' | 'descending' | 'none' {
        const current = this.sort();
        if (!col.sortable || !current || current.key !== col.key) return 'none';
        return current.direction === 'asc' ? 'ascending' : 'descending';
    }

    // ── Selection ─────────────────────────────────────────────
    keyOf(pair: RowPair<T>): TableRowKey {
        return this.rowKey()(pair.row, pair.index);
    }

    isSelected(pair: RowPair<T>): boolean {
        return this.selected().includes(this.keyOf(pair));
    }

    toggleRow(pair: RowPair<T>): void {
        const key = this.keyOf(pair);
        if (this.selectionMode() === 'single') {
            this.selected.set(this.isSelected(pair) ? [] : [key]);
        } else if (this.selectionMode() === 'multiple') {
            const current = this.selected();
            this.selected.set(current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
        }
    }

    toggleSelectAll(): void {
        const visibleKeys = this.pagedPairs().map((pair) => this.keyOf(pair));
        if (this.isAllSelected()) {
            this.selected.set(this.selected().filter((k) => !visibleKeys.includes(k)));
        } else {
            this.selected.set([...new Set([...this.selected(), ...visibleKeys])]);
        }
    }

    // ── Cells ─────────────────────────────────────────────────
    onRowClick(row: T): void {
        this.rowClick.emit(row);
    }

    formatCell(col: TableColumn<T>, row: T): string {
        const value = row[col.key];
        if (col.format) return col.format(value, row);
        if (value instanceof Date) return value.toLocaleDateString();
        if (value === null || value === undefined) return '';
        return String(value);
    }

    private _compare(a: unknown, b: unknown): number {
        if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? 1 : -1;
        return String(a ?? '').localeCompare(String(b ?? ''));
    }
}
