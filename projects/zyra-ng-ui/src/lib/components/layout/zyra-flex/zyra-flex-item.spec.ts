import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraFlexItem, FlexAlignSelf, FlexJustifySelf } from './zyra-flex-item';

// ── Host fixture ────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraFlexItem],
    template: `
        <zyra-flex-item
            [grow]="grow()"
            [shrink]="shrink()"
            [basis]="basis()"
            [order]="order()"
            [alignSelf]="alignSelf()"
            [justifySelf]="justifySelf()"
        >
            content
        </zyra-flex-item>
    `,
})
class FlexItemHostComponent {
    grow = signal<number | undefined>(undefined);
    shrink = signal<number | undefined>(undefined);
    basis = signal<string | number | undefined>(undefined);
    order = signal<number | undefined>(undefined);
    alignSelf = signal<FlexAlignSelf>('auto');
    justifySelf = signal<FlexJustifySelf>('auto');
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraFlexItem', () => {
    let fixture: ComponentFixture<FlexItemHostComponent>;
    let host: FlexItemHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlexItemHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlexItemHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('zyra-flex-item div');
    });

    it('projects slotted content', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    it('leaves flex-grow/shrink/basis/order unset by default', () => {
        expect(el.style.flexGrow).toBe('');
        expect(el.style.flexShrink).toBe('');
        expect(el.style.flexBasis).toBe('');
        expect(el.style.order).toBe('');
        expect(el.style.alignSelf).toBe('auto');
    });

    it('applies flex-grow/shrink as numbers', () => {
        host.grow.set(2);
        host.shrink.set(0);
        fixture.detectChanges();
        expect(el.style.flexGrow).toBe('2');
        expect(el.style.flexShrink).toBe('0');
    });

    it('converts a numeric basis to pixels and passes strings through', () => {
        host.basis.set(120);
        fixture.detectChanges();
        expect(el.style.flexBasis).toBe('120px');

        host.basis.set('50%');
        fixture.detectChanges();
        expect(el.style.flexBasis).toBe('50%');
    });

    it('applies order', () => {
        host.order.set(3);
        fixture.detectChanges();
        expect(el.style.order).toBe('3');
    });

    it('maps alignSelf to the flexbox align-self keyword', () => {
        host.alignSelf.set('end');
        fixture.detectChanges();
        expect(el.style.alignSelf).toBe('flex-end');
    });

    it('applies justifySelf (no-op outside grid, but present on the style object)', () => {
        host.justifySelf.set('center');
        fixture.detectChanges();
        expect(el.style.justifySelf).toBe('center');
    });
});
