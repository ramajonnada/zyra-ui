import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import type { ZyraIconData } from '../../../internal/zyra-icon/zyra-icon';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { chevronDown } from '../../../shared/zyra-icons';
import { ZyraCheckbox } from '../../forms/zyra-checkbox/zyra-checkbox';
import type { ZyraSize } from '../../../shared/zyra-size';

export type TreeSelectionMode = 'none' | 'single' | 'multiple';
export type TreeSize = ZyraSize;
export type TreeNodeId = string | number;

export interface TreeNode {
    id: TreeNodeId;
    label: string;
    icon?: ZyraIconData;
    disabled?: boolean;
    children?: TreeNode[];
}

interface FlatNode {
    node: TreeNode;
    depth: number;
    parentId: TreeNodeId | null;
    hasChildren: boolean;
}

let treeIdCounter = 0;

@Component({
    selector: 'zyra-tree-view',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent, ZyraCheckbox],
    templateUrl: './zyra-tree-view.html',
    styleUrl: './zyra-tree-view.scss',
})
export class ZyraTreeView {
    private readonly _el = inject(ElementRef<HTMLElement>);

    // ── Inputs ────────────────────────────────────────────────
    nodes = input.required<TreeNode[]>();
    selectionMode = input<TreeSelectionMode>('none');
    size = input<TreeSize>('md');
    disabled = input(false, { transform: booleanAttribute });

    // ── Two-way state ─────────────────────────────────────────
    selected = model<TreeNodeId[]>([]);
    expanded = model<TreeNodeId[]>([]);

    // ── Outputs ───────────────────────────────────────────────
    nodeClick = output<TreeNode>();
    nodeToggle = output<{ node: TreeNode; expanded: boolean }>();

    readonly treeId = `zyr-tree-${++treeIdCounter}`;
    readonly icons = { chevronDown };
    readonly hostClass = computed(() => `zyr-tree zyr-tree--${this.size()}`);

    // ── Focus (roving tabindex) ─────────────────────────────────
    private readonly _focusedId = signal<TreeNodeId | null>(null);

    // ── Flattening ────────────────────────────────────────────
    readonly visibleNodes = computed<FlatNode[]>(() => {
        const expandedSet = new Set(this.expanded());
        const result: FlatNode[] = [];
        const walk = (list: TreeNode[], depth: number, parentId: TreeNodeId | null) => {
            for (const node of list) {
                const hasChildren = !!node.children?.length;
                result.push({ node, depth, parentId, hasChildren });
                if (hasChildren && expandedSet.has(node.id)) {
                    walk(node.children!, depth + 1, node.id);
                }
            }
        };
        walk(this.nodes(), 0, null);
        return result;
    });

    // Falls back to the first visible node not just when nothing is tracked
    // yet, but also when the tracked node has been hidden (e.g. its parent
    // collapsed) — otherwise no row would carry tabindex="0" and the whole
    // tree would drop out of the Tab order.
    readonly focusedId = computed(() => {
        const tracked = this._focusedId();
        const visible = this.visibleNodes();
        if (tracked !== null && visible.some((f) => f.node.id === tracked)) return tracked;
        return visible[0]?.node.id ?? null;
    });

    // ── State helpers ─────────────────────────────────────────
    isExpanded(id: TreeNodeId): boolean {
        return this.expanded().includes(id);
    }

    isSelected(id: TreeNodeId): boolean {
        return this.selected().includes(id);
    }

    isFocused(id: TreeNodeId): boolean {
        return this.focusedId() === id;
    }

    onRowFocus(id: TreeNodeId): void {
        if (!this.isFocused(id)) this._focusedId.set(id);
    }

    rowDomId(id: TreeNodeId): string {
        return `${this.treeId}-${id}`;
    }

    // ── Expand / collapse ─────────────────────────────────────
    toggleExpand(node: TreeNode): void {
        if (this.disabled() || node.disabled || !node.children?.length) return;
        const isOpen = this.expanded().includes(node.id);
        this.expanded.set(isOpen ? this.expanded().filter((id) => id !== node.id) : [...this.expanded(), node.id]);
        this.nodeToggle.emit({ node, expanded: !isOpen });
    }

    // ── Selection ─────────────────────────────────────────────
    toggleSelect(node: TreeNode): void {
        if (this.disabled() || node.disabled || this.selectionMode() === 'none') return;
        if (this.selectionMode() === 'single') {
            this.selected.set(this.isSelected(node.id) ? [] : [node.id]);
        } else {
            const current = this.selected();
            this.selected.set(
                current.includes(node.id) ? current.filter((id) => id !== node.id) : [...current, node.id],
            );
        }
    }

    onRowClick(flat: FlatNode): void {
        if (this.disabled() || flat.node.disabled) return;
        this._focusedId.set(flat.node.id);
        this.toggleSelect(flat.node);
        this.nodeClick.emit(flat.node);
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (this.disabled()) return;
        const visible = this.visibleNodes();
        if (visible.length === 0) return;
        const currentIdx = visible.findIndex((f) => f.node.id === this.focusedId());
        const current = currentIdx >= 0 ? visible[currentIdx] : visible[0];

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const next = visible[Math.min(currentIdx + 1, visible.length - 1)];
                this._focus(next);
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const prev = visible[Math.max(currentIdx - 1, 0)];
                this._focus(prev);
                break;
            }
            case 'ArrowRight': {
                event.preventDefault();
                if (!current.hasChildren) break;
                if (!this.isExpanded(current.node.id)) {
                    this.toggleExpand(current.node);
                } else {
                    const child = visible[currentIdx + 1];
                    if (child && child.parentId === current.node.id) this._focus(child);
                }
                break;
            }
            case 'ArrowLeft': {
                event.preventDefault();
                if (current.hasChildren && this.isExpanded(current.node.id)) {
                    this.toggleExpand(current.node);
                } else if (current.parentId !== null) {
                    const parent = visible.find((f) => f.node.id === current.parentId);
                    if (parent) this._focus(parent);
                }
                break;
            }
            case 'Home': {
                event.preventDefault();
                this._focus(visible[0]);
                break;
            }
            case 'End': {
                event.preventDefault();
                this._focus(visible[visible.length - 1]);
                break;
            }
            case 'Enter':
            case ' ': {
                event.preventDefault();
                // In 'none' mode, a parent node's primary action is expand;
                // otherwise fire the same nodeClick a mouse click would —
                // including leaf nodes in 'none' mode, which previously did
                // nothing on Enter/Space despite always emitting on click.
                if (this.selectionMode() === 'none' && current.hasChildren) {
                    this.toggleExpand(current.node);
                } else {
                    this.onRowClick(current);
                }
                break;
            }
        }
    }

    private _focus(flat: FlatNode): void {
        this._focusedId.set(flat.node.id);
        const el = this._el.nativeElement.querySelector(
            `#${CSS.escape(this.rowDomId(flat.node.id))}`,
        ) as HTMLElement | null;
        el?.focus();
    }
}
