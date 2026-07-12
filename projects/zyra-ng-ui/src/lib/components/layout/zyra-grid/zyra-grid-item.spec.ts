import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraGridItem } from './zyra-grid-item';

// ── Host fixture ────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraGridItem],
    template: `
        <zyra-grid-item [colSpan]="colSpan()" [rowSpan]="rowSpan()" [area]="area()"> content </zyra-grid-item>
    `,
})
class GridItemHostComponent {
    colSpan = signal<number | undefined>(undefined);
    rowSpan = signal<number | undefined>(undefined);
    area = signal<string | undefined>(undefined);
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraGridItem', () => {
    let fixture: ComponentFixture<GridItemHostComponent>;
    let host: GridItemHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GridItemHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GridItemHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('zyra-grid-item div');
    });

    it('projects slotted content', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    it('leaves grid-column/row/area unset by default', () => {
        expect(el.style.gridColumn).toBe('');
        expect(el.style.gridRow).toBe('');
        expect(el.style.gridArea).toBe('');
    });

    it('applies a column span', () => {
        host.colSpan.set(2);
        fixture.detectChanges();
        expect(el.style.gridColumn).toBe('span 2 / span 2');
    });

    it('applies a row span', () => {
        host.rowSpan.set(3);
        fixture.detectChanges();
        expect(el.style.gridRow).toBe('span 3 / span 3');
    });

    it('applies a named area and ignores span in favor of it', () => {
        host.colSpan.set(2);
        host.area.set('sidebar');
        fixture.detectChanges();
        expect(el.style.gridArea).toBe('sidebar');
        expect(el.style.gridColumn).not.toBe('span 2 / span 2');
    });
});
