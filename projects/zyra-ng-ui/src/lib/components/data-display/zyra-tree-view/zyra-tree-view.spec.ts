import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeNode, TreeNodeId, TreeSelectionMode, ZyraTreeView } from './zyra-tree-view';

const NODES: TreeNode[] = [
    {
        id: 'fruits',
        label: 'Fruits',
        children: [
            { id: 'apple', label: 'Apple' },
            { id: 'banana', label: 'Banana' },
        ],
    },
    { id: 'veggies', label: 'Vegetables', children: [{ id: 'carrot', label: 'Carrot' }] },
    { id: 'grains', label: 'Grains' },
];

@Component({
    standalone: true,
    imports: [ZyraTreeView],
    template: `
        <zyra-tree-view
            [nodes]="nodes"
            [selectionMode]="selectionMode()"
            [(selected)]="selected"
            [(expanded)]="expanded"
            (nodeClick)="onNodeClick($event)"
        />
    `,
})
class TreeHostComponent {
    nodes = NODES;
    selectionMode = signal<TreeSelectionMode>('none');
    selected = signal<TreeNodeId[]>([]);
    expanded = signal<TreeNodeId[]>([]);
    clicked: TreeNode | null = null;

    onNodeClick(node: TreeNode): void {
        this.clicked = node;
    }
}

describe('ZyraTreeView', () => {
    let fixture: ComponentFixture<TreeHostComponent>;
    let host: TreeHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TreeHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders only top-level nodes when nothing is expanded', () => {
        expect(rowLabels(fixture)).toEqual(['Fruits', 'Vegetables', 'Grains']);
    });

    it('reveals children once a node is expanded', () => {
        toggleButtons(fixture)[0].click();
        fixture.detectChanges();
        expect(rowLabels(fixture)).toEqual(['Fruits', 'Apple', 'Banana', 'Vegetables', 'Grains']);
    });

    it('collapses children again on a second toggle click', () => {
        toggleButtons(fixture)[0].click();
        fixture.detectChanges();
        toggleButtons(fixture)[0].click();
        fixture.detectChanges();
        expect(rowLabels(fixture)).toEqual(['Fruits', 'Vegetables', 'Grains']);
    });

    it('renders no toggle button for leaf nodes', () => {
        expect(toggleButtons(fixture).length).toBe(2); // Fruits, Vegetables — Grains has no children
    });

    // ── Selection ─────────────────────────────────────────────────────────
    it('selects a node on row click in single mode', () => {
        host.selectionMode.set('single');
        fixture.detectChanges();
        rows(fixture)[2].click(); // Grains
        fixture.detectChanges();
        expect(host.selected()).toEqual(['grains']);
    });

    it('replaces the selection when a different row is clicked in single mode', () => {
        host.selectionMode.set('single');
        fixture.detectChanges();
        rows(fixture)[0].click();
        fixture.detectChanges();
        rows(fixture)[2].click();
        fixture.detectChanges();
        expect(host.selected()).toEqual(['grains']);
    });

    it('toggles independently in multiple mode', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        rows(fixture)[0].click();
        fixture.detectChanges();
        rows(fixture)[2].click();
        fixture.detectChanges();
        expect(new Set(host.selected())).toEqual(new Set(['fruits', 'grains']));
    });

    it('does not select when selectionMode is none', () => {
        rows(fixture)[0].click();
        fixture.detectChanges();
        expect(host.selected()).toEqual([]);
    });

    it('emits nodeClick regardless of selection mode', () => {
        rows(fixture)[1].click();
        fixture.detectChanges();
        expect(host.clicked?.id).toBe('veggies');
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('moves roving tabindex to the next row on ArrowDown', () => {
        treeEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(rows(fixture)[1].getAttribute('tabindex')).toBe('0');
        expect(rows(fixture)[0].getAttribute('tabindex')).toBe('-1');
    });

    it('expands the focused node on ArrowRight', () => {
        treeEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        expect(rowLabels(fixture)).toContain('Apple');
    });

    it('collapses the focused expanded node on ArrowLeft', () => {
        treeEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        treeEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        expect(rowLabels(fixture)).not.toContain('Apple');
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('root has role="tree" and rows have role="treeitem"', () => {
        expect(treeEl(fixture).getAttribute('role')).toBe('tree');
        expect(rows(fixture)[0].getAttribute('role')).toBe('treeitem');
    });

    it('expandable rows reflect aria-expanded', () => {
        expect(rows(fixture)[0].getAttribute('aria-expanded')).toBe('false');
        toggleButtons(fixture)[0].click();
        fixture.detectChanges();
        expect(rows(fixture)[0].getAttribute('aria-expanded')).toBe('true');
    });
});

function treeEl(f: ComponentFixture<TreeHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('.zyr-tree');
}

function rows(f: ComponentFixture<TreeHostComponent>): HTMLElement[] {
    return Array.from(treeEl(f).querySelectorAll('.zyr-tree__row'));
}

function rowLabels(f: ComponentFixture<TreeHostComponent>): string[] {
    return rows(f).map((r) => r.querySelector('.zyr-tree__label')?.textContent?.trim() ?? '');
}

function toggleButtons(f: ComponentFixture<TreeHostComponent>): HTMLButtonElement[] {
    return Array.from(treeEl(f).querySelectorAll('.zyr-tree__toggle'));
}
