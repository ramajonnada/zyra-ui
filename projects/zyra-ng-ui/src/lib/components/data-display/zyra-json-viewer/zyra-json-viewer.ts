import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { check, chevronDown, copy } from '../../../shared/zyra-icons';

export type JsonViewerValueType =
    | 'object'
    | 'array'
    | 'string'
    | 'number'
    | 'boolean'
    | 'null';

export interface JsonViewerRow {
    id: string;
    depth: number;
    key: string | number | null;
    valueType: JsonViewerValueType;
    preview: string;
    isContainer: boolean;
    itemCount: number;
    expanded: boolean;
}

function classify(value: unknown): JsonViewerValueType {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    const t = typeof value;
    if (t === 'object') return 'object';
    if (t === 'string') return 'string';
    if (t === 'number') return 'number';
    if (t === 'boolean') return 'boolean';
    return 'null';
}

function formatPrimitive(value: unknown, type: JsonViewerValueType): string {
    if (type === 'string') return JSON.stringify(value);
    if (type === 'null') return 'null';
    return String(value);
}

@Component({
    selector: 'zyra-json-viewer',
    standalone: true,
    imports: [ZyraIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-json-viewer.html',
    styleUrl: './zyra-json-viewer.scss',
})
export class ZyraJsonViewer {
    // ── Inputs ────────────────────────────────────────────────
    /** Already-parsed JSON data, or a raw JSON string to parse. */
    data = input<unknown>(null);
    /** Depth (0 = root) below which nodes start out collapsed. */
    expandDepth = input<number>(1);
    /** Hard cap on render depth — deeper nodes render as a "…" leaf rather than recursing further, protecting against runaway/huge objects. */
    maxDepth = input<number>(20);
    copyable = input<boolean>(true);

    // ── Icons ─────────────────────────────────────────────────
    readonly chevronIcon = chevronDown;
    readonly copyIcon = copy;
    readonly checkIcon = check;

    // ── State ─────────────────────────────────────────────────
    private readonly toggledPaths = signal<ReadonlySet<string>>(new Set());
    copied = signal(false);

    // ── Parsing ───────────────────────────────────────────────
    parseError = computed<string | null>(() => {
        const raw = this.data();
        if (typeof raw !== 'string') return null;
        try {
            JSON.parse(raw);
            return null;
        } catch (e) {
            return e instanceof Error ? e.message : 'Invalid JSON';
        }
    });

    private readonly parsedValue = computed<unknown>(() => {
        const raw = this.data();
        if (typeof raw !== 'string') return raw;
        try {
            return JSON.parse(raw);
        } catch {
            return undefined;
        }
    });

    // ── Flatten to a linear row list ─────────────────────────────
    rows = computed<JsonViewerRow[]>(() => {
        if (this.parseError() !== null) return [];
        const rows: JsonViewerRow[] = [];
        this._flatten(this.parsedValue(), null, 0, '$', rows);
        return rows;
    });

    private _isExpanded(path: string, depth: number): boolean {
        const defaultOpen = depth < this.expandDepth();
        return this.toggledPaths().has(path) ? !defaultOpen : defaultOpen;
    }

    private _flatten(
        value: unknown,
        key: string | number | null,
        depth: number,
        path: string,
        out: JsonViewerRow[],
    ): void {
        const valueType = classify(value);
        const isContainer = valueType === 'object' || valueType === 'array';
        const atMaxDepth = depth >= this.maxDepth();
        const entries =
            isContainer && !atMaxDepth
                ? valueType === 'array'
                    ? (value as unknown[]).map((v, i): [number, unknown] => [i, v])
                    : (Object.entries(value as Record<string, unknown>) as [string, unknown][])
                : [];
        const realCount = isContainer
            ? valueType === 'array'
                ? (value as unknown[]).length
                : Object.keys(value as Record<string, unknown>).length
            : 0;
        // Toggle only renders (and expansion only proceeds) below maxDepth —
        // beyond it a container still shows its real item count but reads as
        // a leaf, so deeply nested/huge objects can't runaway-render.
        const itemCount = atMaxDepth ? 0 : realCount;
        const expanded = isContainer && entries.length > 0 && this._isExpanded(path, depth);

        out.push({
            id: path,
            depth,
            key,
            valueType,
            preview: isContainer
                ? `${valueType === 'array' ? '[' : '{'}${realCount}${valueType === 'array' ? ']' : '}'}`
                : formatPrimitive(value, valueType),
            isContainer,
            itemCount,
            expanded,
        });

        if (expanded) {
            for (const [k, v] of entries) {
                this._flatten(v, k, depth + 1, `${path}.${k}`, out);
            }
        }
    }

    // ── Methods ───────────────────────────────────────────────
    toggle(path: string): void {
        const next = new Set(this.toggledPaths());
        if (next.has(path)) next.delete(path);
        else next.add(path);
        this.toggledPaths.set(next);
    }

    async copyToClipboard(): Promise<void> {
        if (this.copied()) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(this.parsedValue(), null, 2));
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        } catch {
            // Clipboard API unavailable — silently ignore.
        }
    }
}
