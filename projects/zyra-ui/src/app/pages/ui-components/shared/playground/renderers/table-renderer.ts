import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TableColumn, TableRowKey, TableSortState, ZyraTable } from 'zyra-ng-ui';

interface DemoPerson extends Record<string, unknown> {
    id: number;
    name: string;
    role: string;
    status: string;
}

const DEMO_ROWS: DemoPerson[] = [
    { id: 1, name: 'Ava Patel', role: 'Frontend Engineer', status: 'Active' },
    { id: 2, name: 'Marcus Lee', role: 'Backend Engineer', status: 'Active' },
    { id: 3, name: 'Sofia Ruiz', role: 'Product Designer', status: 'Invited' },
    { id: 4, name: 'Noah Kim', role: 'DevOps Engineer', status: 'Active' },
    { id: 5, name: 'Elena Novak', role: 'QA Engineer', status: 'Suspended' },
];

const COLUMNS: TableColumn<DemoPerson>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true, align: 'right' },
];

@Component({
    selector: 'pg-table-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTable],
    styles: [
        `
            :host { display: block; width: 100%; }
            .pg-table-demo__feedback {
                margin: 8px 0 0;
                font-size: 12.5px;
                color: var(--zyra-color-text-dim);
            }
        `,
    ],
    template: `
        <zyra-table
            [columns]="columns"
            [rows]="rows()"
            [selectionMode]="$any(selectionMode())"
            [manualSort]="manualSort()"
            [(sort)]="sortState"
            [(selected)]="selectedKeys"
            [pageSize]="pageSize()"
            [loading]="loading()"
            (rowClick)="onRowClick($event)"
        />
        @if (manualSort() && sortState()) {
            <p class="pg-table-demo__feedback">
                manualSort is on — the header shows {{ sortState()!.direction }} on "{{ sortState()!.key }}",
                but the rows stay in their original order until you sort them yourself (e.g. after an API call).
            </p>
        }
        @if (lastClicked()) {
            <p class="pg-table-demo__feedback">Last clicked: {{ lastClicked() }}</p>
        }
        @if (selectionMode() !== 'none' && selectedKeys().length) {
            <p class="pg-table-demo__feedback">Selected ids: {{ selectedKeys().join(', ') }}</p>
        }
    `,
})
export class TableRenderer {
    selectionMode = input<string>('none');
    loading = input<boolean>(false);
    paginated = input<boolean>(false);
    manualSort = input<boolean>(false);
    empty = input<boolean>(false);

    readonly columns = COLUMNS;
    readonly pageSize = computed<number | null>(() => (this.paginated() ? 3 : null));
    readonly rows = computed<DemoPerson[]>(() => (this.empty() ? [] : DEMO_ROWS));

    readonly sortState = signal<TableSortState | null>(null);
    readonly selectedKeys = signal<TableRowKey[]>([]);
    readonly lastClicked = signal<string | null>(null);

    onRowClick(row: DemoPerson): void {
        this.lastClicked.set(row.name);
    }
}
