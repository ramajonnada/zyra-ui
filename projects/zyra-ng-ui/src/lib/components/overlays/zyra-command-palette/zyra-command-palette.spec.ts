import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandPaletteItem, ZyraCommandPalette } from './zyra-command-palette';

const ITEMS: CommandPaletteItem[] = [
    { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H' },
    { id: 'settings', label: 'Go to Settings', group: 'Navigation' },
    { id: 'new-file', label: 'Create new file', group: 'Actions' },
    { id: 'delete', label: 'Delete item', group: 'Actions', disabled: true },
];

@Component({
    standalone: true,
    imports: [ZyraCommandPalette],
    template: `
        <zyra-command-palette
            [items]="items()"
            [(open)]="open"
            [globalShortcut]="globalShortcut()"
            (selected)="onSelected($event)"
        />
    `,
})
class HostComponent {
    items = signal(ITEMS);
    open = signal(false);
    globalShortcut = signal(true);
    lastSelected: CommandPaletteItem | null = null;

    onSelected(item: CommandPaletteItem): void {
        this.lastSelected = item;
    }
}

describe('ZyraCommandPalette', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    function panel(): HTMLElement | null {
        return fixture.nativeElement.querySelector('.zyr-cmdk__panel');
    }

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('.zyr-cmdk__input');
    }

    function items(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('.zyr-cmdk__item'));
    }

    // ── Open / close ──────────────────────────────────────────────────────
    it('renders nothing when closed', () => {
        expect(panel()).toBeNull();
    });

    it('renders the panel when open is true', () => {
        host.open.set(true);
        fixture.detectChanges();
        expect(panel()).not.toBeNull();
    });

    it('opens on Ctrl+K when closed', () => {
        const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
        document.dispatchEvent(event);
        fixture.detectChanges();
        expect(host.open()).toBeTrue();
    });

    it('closes on Ctrl+K when open', () => {
        host.open.set(true);
        fixture.detectChanges();
        const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
        document.dispatchEvent(event);
        fixture.detectChanges();
        expect(host.open()).toBeFalse();
    });

    it('ignores the global shortcut when globalShortcut is false', () => {
        host.globalShortcut.set(false);
        fixture.detectChanges();
        const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
        document.dispatchEvent(event);
        fixture.detectChanges();
        expect(host.open()).toBeFalse();
    });

    it('closes on Escape', () => {
        host.open.set(true);
        fixture.detectChanges();
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();
        expect(host.open()).toBeFalse();
    });

    it('closes on backdrop click', () => {
        host.open.set(true);
        fixture.detectChanges();
        const backdrop: HTMLElement = fixture.nativeElement.querySelector('.zyr-cmdk');
        // A genuine backdrop click has target === currentTarget; a click that
        // bubbled up from the panel does not, and must NOT close the palette.
        backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(host.open()).toBeFalse();
    });

    it('does not close when a click inside the panel bubbles to the backdrop', () => {
        host.open.set(true);
        fixture.detectChanges();
        const panelEl: HTMLElement = fixture.nativeElement.querySelector('.zyr-cmdk__panel');
        panelEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(host.open()).toBeTrue();
    });

    // ── Rendering / groups ────────────────────────────────────────────────
    it('renders all items grouped by group name', () => {
        host.open.set(true);
        fixture.detectChanges();
        expect(items().length).toBe(4);
        const labels: string[] = Array.from(
            fixture.nativeElement.querySelectorAll('.zyr-cmdk__group-label'),
        ).map((el) => (el as HTMLElement).textContent);
        expect(labels).toEqual(['Navigation', 'Actions']);
    });

    it('shows the empty state when no items are provided', () => {
        host.items.set([]);
        host.open.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-cmdk__empty')).not.toBeNull();
    });

    // ── Hover activation (regression: mouseenter under a stationary cursor) ─
    it('does not change the active item on a bare mouseenter (no real pointer motion)', () => {
        host.open.set(true);
        fixture.detectChanges();
        // Simulates the cursor already resting over a later row the instant
        // the palette opens (e.g. opened via Ctrl/Cmd+K with the mouse idle
        // over the page) — mouseenter fires without the user moving the
        // mouse, and must not steal the active index from row 0.
        items()[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        fixture.detectChanges();
        expect(items()[0].classList).toContain('zyr-cmdk__item--active');
    });

    it('moves the active item on real mousemove', () => {
        host.open.set(true);
        fixture.detectChanges();
        items()[2].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        fixture.detectChanges();
        expect(items()[2].classList).toContain('zyr-cmdk__item--active');
    });

    // ── Filtering ─────────────────────────────────────────────────────────
    it('fuzzy-filters items as the query changes', () => {
        host.open.set(true);
        fixture.detectChanges();
        const inp = input();
        inp.value = 'stng';
        inp.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        const labels = items().map((el) => el.textContent?.trim());
        expect(labels?.some((l) => l?.includes('Go to Settings'))).toBeTrue();
        expect(labels?.some((l) => l?.includes('Go to Home'))).toBeFalse();
    });

    it('shows the empty state when the query matches nothing', () => {
        host.open.set(true);
        fixture.detectChanges();
        const inp = input();
        inp.value = 'zzzzz';
        inp.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-cmdk__empty')).not.toBeNull();
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('moves the active item with ArrowDown/ArrowUp', () => {
        host.open.set(true);
        fixture.detectChanges();
        const inp = input();
        inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        fixture.detectChanges();
        expect(items()[1].classList).toContain('zyr-cmdk__item--active');
        inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        fixture.detectChanges();
        expect(items()[0].classList).toContain('zyr-cmdk__item--active');
    });

    it('selects the active item on Enter and emits selected', () => {
        host.open.set(true);
        fixture.detectChanges();
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();
        expect(host.lastSelected?.id).toBe('home');
        expect(host.open()).toBeFalse();
    });

    it('selects an item on click', () => {
        host.open.set(true);
        fixture.detectChanges();
        items()[2].dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(host.lastSelected?.id).toBe('new-file');
    });

    it('does not select a disabled item', () => {
        host.open.set(true);
        fixture.detectChanges();
        const deleteItem = items().find((el) => el.textContent?.includes('Delete item'))!;
        deleteItem.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(host.lastSelected).toBeNull();
        expect(host.open()).toBeTrue();
    });

    it('renders the shortcut hint when provided', () => {
        host.open.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-cmdk__item-shortcut')?.textContent?.trim()).toBe('G H');
    });
});
