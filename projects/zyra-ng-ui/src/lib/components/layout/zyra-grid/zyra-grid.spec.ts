import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    ZyraGrid,
    GridAlignItems,
    GridAutoFlow,
    GridColumnsValue,
    GridJustifyItems,
    GridResponsiveColumns,
    GridResponsiveRows,
} from './zyra-grid';
import { BoxSpacing } from '../../../internal/box-style/box-style';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraGrid],
    template: `
        <zyra-grid
            [columns]="columns()"
            [rows]="rows()"
            [areas]="areas()"
            [autoFlow]="autoFlow()"
            [justifyItems]="justifyItems()"
            [alignItems]="alignItems()"
            [gap]="gap()"
            [border]="border()"
        >
            content
        </zyra-grid>
    `,
})
class GridHostComponent {
    columns = signal<GridColumnsValue | GridResponsiveColumns>(1);
    rows = signal<GridColumnsValue | GridResponsiveRows | undefined>(undefined);
    areas = signal<string[] | undefined>(undefined);
    autoFlow = signal<GridAutoFlow>('row');
    justifyItems = signal<GridJustifyItems>('stretch');
    alignItems = signal<GridAlignItems>('stretch');
    gap = signal<BoxSpacing>('none');
    border = signal(false);
}

@Component({
    standalone: true,
    imports: [ZyraGrid],
    template: `<zyra-grid />`,
})
class GridHostEmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraGrid', () => {
    let fixture: ComponentFixture<GridHostComponent>;
    let host: GridHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GridHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GridHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-grid');
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-grid')).not.toBeNull();
    });

    it('projects slotted content inside the host', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    // ── Defaults ──────────────────────────────────────────────────────────

    it('defaults to a single column, row auto-flow, no gap', () => {
        expect(el.style.display).toBe('grid');
        expect(el.style.gridTemplateColumns).toBe('repeat(1, minmax(0px, 1fr))');
        expect(el.style.gridAutoFlow).toBe('row');
        expect(el.style.columnGap).toBe('0px');
        expect(el.style.rowGap).toBe('0px');
    });

    // ── columns ───────────────────────────────────────────────────────────

    it('converts a numeric columns value to an equal-fraction template', () => {
        host.columns.set(4);
        fixture.detectChanges();
        expect(el.style.gridTemplateColumns).toBe('repeat(4, minmax(0px, 1fr))');
    });

    it('passes a string columns value through untouched', () => {
        host.columns.set('200px 1fr');
        fixture.detectChanges();
        expect(el.style.gridTemplateColumns).toBe('200px 1fr');
    });

    it('applies responsive column custom properties and hands the resolved property to the stylesheet', () => {
        host.columns.set({ base: 1, md: 3 });
        fixture.detectChanges();
        expect(el.style.getPropertyValue('--zyr-grid-cols-base')).toBe('repeat(1, minmax(0, 1fr))');
        expect(el.style.getPropertyValue('--zyr-grid-cols-md')).toBe('repeat(3, minmax(0, 1fr))');
        // The inline style must NOT set grid-template-columns directly — an inline
        // value would permanently beat every @media rule regardless of viewport.
        expect(el.style.gridTemplateColumns).toBe('');
        expect(el.classList.contains('zyr-grid--responsive-cols')).toBeTrue();
        // Whichever breakpoint the test browser's window width matches, the
        // stylesheet must be the one resolving it — never the browser default.
        expect(getComputedStyle(el).gridTemplateColumns).not.toBe('none');
    });

    // ── rows ──────────────────────────────────────────────────────────────

    it('sets grid-template-rows when rows is provided', () => {
        host.rows.set(2);
        fixture.detectChanges();
        expect(el.style.gridTemplateRows).toBe('repeat(2, minmax(0px, 1fr))');
    });

    // ── auto-fit / auto-fill ────────────────────────────────────────────────

    it('expands "auto-fit" columns using the default minTrackSize', () => {
        host.columns.set('auto-fit');
        fixture.detectChanges();
        expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(180px, 1fr))');
    });

    it('expands "auto-fill" columns', () => {
        host.columns.set('auto-fill');
        fixture.detectChanges();
        expect(el.style.gridTemplateColumns).toBe('repeat(auto-fill, minmax(180px, 1fr))');
    });

    // ── responsive rows ─────────────────────────────────────────────────────

    it('applies responsive row custom properties and hands the resolved property to the stylesheet', () => {
        host.rows.set({ base: 1, lg: 2 });
        fixture.detectChanges();
        expect(el.style.getPropertyValue('--zyr-grid-rows-base')).toBe('repeat(1, minmax(0, 1fr))');
        expect(el.style.getPropertyValue('--zyr-grid-rows-lg')).toBe('repeat(2, minmax(0, 1fr))');
        expect(el.style.gridTemplateRows).toBe('');
        expect(el.classList.contains('zyr-grid--responsive-rows')).toBeTrue();
        // Whichever breakpoint the test browser's window width matches, the
        // stylesheet must be the one resolving it — never the browser default.
        expect(getComputedStyle(el).gridTemplateRows).not.toBe('none');
    });

    // ── areas ────────────────────────────────────────────────────────────────

    it('converts an areas array into a quoted grid-template-areas string', () => {
        host.areas.set(['header header', 'sidebar content']);
        fixture.detectChanges();
        expect(el.style.gridTemplateAreas).toBe('"header header" "sidebar content"');
    });

    // ── justifyItems / alignItems ────────────────────────────────────────────

    it('applies justifyItems and alignItems', () => {
        host.justifyItems.set('center');
        host.alignItems.set('end');
        fixture.detectChanges();
        expect(el.style.justifyItems).toBe('center');
        expect(el.style.alignItems).toBe('end');
    });

    // ── gap ───────────────────────────────────────────────────────────────

    it('applies a gap from the spacing scale to both axes', () => {
        host.gap.set('md');
        fixture.detectChanges();
        expect(el.style.columnGap).toBe('var(--zyra-space-4)');
        expect(el.style.rowGap).toBe('var(--zyra-space-4)');
    });

    // ── autoFlow ──────────────────────────────────────────────────────────

    it('reflects a custom autoFlow value', () => {
        host.autoFlow.set('column');
        fixture.detectChanges();
        expect(el.style.gridAutoFlow).toBe('column');
    });

    // ── border ────────────────────────────────────────────────────────────

    it('applies the border class when border is true', () => {
        host.border.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-grid--border')).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-grid').isConnected).toBeTrue();
    });
});

describe('ZyraGrid — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [GridHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(GridHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});
