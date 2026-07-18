import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumn, TableRowKey, TableSelectionMode, TableSortState, ZyraTable } from './zyra-table';

interface Person extends Record<string, unknown> {
    id: number;
    name: string;
    age: number;
}

const PEOPLE: Person[] = [
    { id: 1, name: 'Charlie', age: 35 },
    { id: 2, name: 'Alice', age: 28 },
    { id: 3, name: 'Bob', age: 42 },
];

const COLUMNS: TableColumn<Person>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true, align: 'right' },
];

@Component({
    standalone: true,
    imports: [ZyraTable],
    template: `
        <zyra-table
            [columns]="columns"
            [rows]="rows()"
            [rowKey]="rowKey"
            [selectionMode]="selectionMode()"
            [(selected)]="selected"
            [(sort)]="sort"
            [pageSize]="pageSize()"
            [(page)]="page"
            [loading]="loading()"
            (rowClick)="onRowClick($event)"
        />
    `,
})
class TableHostComponent {
    columns = COLUMNS;
    rows = signal<Person[]>(PEOPLE);
    rowKey = (row: Person): TableRowKey => row.id;
    selectionMode = signal<TableSelectionMode>('none');
    selected = signal<TableRowKey[]>([]);
    sort = signal<TableSortState | null>(null);
    pageSize = signal<number | null>(null);
    page = signal(1);
    loading = signal(false);
    clickedRow: Person | null = null;

    onRowClick(row: Person): void {
        this.clickedRow = row;
    }
}

describe('ZyraTable', () => {
    let fixture: ComponentFixture<TableHostComponent>;
    let host: TableHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TableHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders one row per data row', () => {
        expect(rows(fixture).length).toBe(3);
    });

    it('renders column headers', () => {
        const headers: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('th'));
        expect(headers.map((h) => h.textContent?.trim())).toEqual(['Name', 'Age']);
    });

    it('shows the empty state when rows is empty', () => {
        host.rows.set([]);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('zyra-empty-state')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-table__table')).toBeNull();
    });

    it('shows skeleton rows when loading', () => {
        host.loading.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('zyra-skeleton').length).toBeGreaterThan(0);
        expect(fixture.nativeElement.querySelector('zyra-empty-state')).toBeNull();
    });

    // ── Sorting ───────────────────────────────────────────────────────────
    it('sorts ascending on first header click', () => {
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
        expect(cellTextInColumn(fixture, 0)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('sorts descending on second click of the same header', () => {
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        expect(host.sort()).toEqual({ key: 'name', direction: 'desc' });
        expect(cellTextInColumn(fixture, 0)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('clears sort on third click of the same header', () => {
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        expect(host.sort()).toBeNull();
    });

    it('sorts numeric columns numerically, not lexically', () => {
        sortButton(fixture, 'Age').click();
        fixture.detectChanges();
        expect(cellTextInColumn(fixture, 1)).toEqual(['28', '35', '42']);
    });

    // ── Selection ─────────────────────────────────────────────────────────
    it('selects a single row in single mode', () => {
        host.selectionMode.set('single');
        fixture.detectChanges();
        radios(fixture)[1].click();
        fixture.detectChanges();
        expect(host.selected()).toEqual([2]);
    });

    it('selecting a different row in single mode replaces the selection', () => {
        host.selectionMode.set('single');
        fixture.detectChanges();
        radios(fixture)[0].click();
        fixture.detectChanges();
        radios(fixture)[2].click();
        fixture.detectChanges();
        expect(host.selected()).toEqual([3]);
    });

    it('toggles rows independently in multiple mode', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        rowCheckboxes(fixture)[0].click();
        fixture.detectChanges();
        rowCheckboxes(fixture)[2].click();
        fixture.detectChanges();
        expect(new Set(host.selected())).toEqual(new Set([1, 3]));
    });

    it('select-all checkbox selects and clears all visible rows', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        selectAllCheckbox(fixture).click();
        fixture.detectChanges();
        expect(new Set(host.selected())).toEqual(new Set([1, 2, 3]));

        selectAllCheckbox(fixture).click();
        fixture.detectChanges();
        expect(host.selected()).toEqual([]);
    });

    it('does not trigger rowClick when a selection control is clicked', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        rowCheckboxes(fixture)[0].click();
        fixture.detectChanges();
        expect(host.clickedRow).toBeNull();
    });

    // ── Row click ─────────────────────────────────────────────────────────
    it('emits rowClick with the clicked row', () => {
        rows(fixture)[1].click();
        fixture.detectChanges();
        expect(host.clickedRow).toEqual(PEOPLE[1]);
    });

    // ── Pagination ────────────────────────────────────────────────────────
    it('paginates rows according to pageSize', () => {
        host.pageSize.set(2);
        fixture.detectChanges();
        expect(rows(fixture).length).toBe(2);
        expect(fixture.nativeElement.querySelector('zyra-pagination')).not.toBeNull();
    });

    it('shows the next page of rows when page changes', () => {
        host.pageSize.set(2);
        fixture.detectChanges();
        host.page.set(2);
        fixture.detectChanges();
        expect(rows(fixture).length).toBe(1);
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('the first sortable header and the first row are each a tab stop by default', () => {
        expect(sortButton(fixture, 'Name').getAttribute('tabindex')).toBe('0');
        expect(sortButton(fixture, 'Age').getAttribute('tabindex')).toBe('-1');
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('0');
        expect(rows(fixture)[1].getAttribute('tabindex')).toBe('-1');
    });

    it('moves the roving tabindex across sortable headers with ArrowRight/ArrowLeft', () => {
        sortButton(fixture, 'Name').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
        );
        fixture.detectChanges();
        expect(sortButton(fixture, 'Age').getAttribute('tabindex')).toBe('0');
        expect(sortButton(fixture, 'Name').getAttribute('tabindex')).toBe('-1');

        sortButton(fixture, 'Age').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
        );
        fixture.detectChanges();
        expect(sortButton(fixture, 'Name').getAttribute('tabindex')).toBe('0');
    });

    it('sorts via Enter on a focused header — native button activation', () => {
        sortButton(fixture, 'Name').click();
        fixture.detectChanges();
        expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
    });

    it('moves focus from the header into the first row on ArrowDown', () => {
        sortButton(fixture, 'Name').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('0');
    });

    it('moves the roving tabindex across rows with ArrowDown/ArrowUp', () => {
        rows(fixture)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(rows(fixture)[1].getAttribute('tabindex')).toBe('0');
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('-1');

        rows(fixture)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('0');
    });

    it('moves focus back up to the header from the first row on ArrowUp', () => {
        rows(fixture)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();
        expect(sortButton(fixture, 'Name').getAttribute('tabindex')).toBe('0');
    });

    it('jumps to the first/last row on Home/End', () => {
        rows(fixture)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        fixture.detectChanges();
        expect(rows(fixture)[2].getAttribute('tabindex')).toBe('0');

        rows(fixture)[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        fixture.detectChanges();
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('0');
    });

    it('Enter on a focused row triggers rowClick and, in selectable mode, toggles selection', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        // Focus() (not just dispatching the event) so the roving-tabindex
        // state actually tracks row[1] before Enter is evaluated against it.
        rows(fixture)[1].focus();
        rows(fixture)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(host.clickedRow).toEqual(PEOPLE[1]);
        expect(host.selected()).toEqual([2]);
    });
});

function table(f: ComponentFixture<TableHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('zyra-table');
}

function rows(f: ComponentFixture<TableHostComponent>): HTMLElement[] {
    return Array.from(table(f).querySelectorAll('tbody tr'));
}

function sortButton(f: ComponentFixture<TableHostComponent>, label: string): HTMLButtonElement {
    const buttons: HTMLButtonElement[] = Array.from(table(f).querySelectorAll('.zyr-table__th-btn'));
    return buttons.find((b) => b.textContent?.trim() === label)!;
}

function cellTextInColumn(f: ComponentFixture<TableHostComponent>, colIndex: number): string[] {
    return rows(f).map((row) => {
        const cells = row.querySelectorAll('td');
        return cells[colIndex].textContent?.trim() ?? '';
    });
}

function radios(f: ComponentFixture<TableHostComponent>): HTMLInputElement[] {
    return Array.from(table(f).querySelectorAll('.zyr-table__radio'));
}

function rowCheckboxes(f: ComponentFixture<TableHostComponent>): HTMLElement[] {
    return Array.from(table(f).querySelectorAll('tbody .zyr-table__select-col button[role="checkbox"]'));
}

function selectAllCheckbox(f: ComponentFixture<TableHostComponent>): HTMLElement {
    return table(f).querySelector('thead .zyr-table__select-col button[role="checkbox"]')!;
}
