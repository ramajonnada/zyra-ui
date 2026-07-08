import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraStack } from './zyra-stack';

@Component({
    standalone: true,
    imports: [ZyraStack],
    template: `
        <zyra-stack
            [direction]="direction()"
            [gap]="gap()"
            [align]="align()"
            [justify]="justify()"
            [wrap]="wrap()"
        >
            <span>Item</span>
        </zyra-stack>
    `,
})
class StackHostComponent {
    direction = signal<'row' | 'column'>('column');
    gap = signal<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
    align = signal<'start' | 'center' | 'end' | 'stretch'>('stretch');
    justify = signal<'start' | 'center' | 'end' | 'between' | 'around'>('start');
    wrap = signal(false);
}

describe('ZyraStack', () => {
    let fixture: ComponentFixture<StackHostComponent>;
    let host: StackHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [StackHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(StackHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders projected content', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack').textContent).toContain('Item');
    });

    // ── Direction ─────────────────────────────────────────────────────────
    it('applies the column direction class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack--column')).not.toBeNull();
    });

    it('applies the row direction class', () => {
        host.direction.set('row');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-stack--row')).not.toBeNull();
    });

    // ── Gap ───────────────────────────────────────────────────────────────
    it('applies the md gap class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack--gap-md')).not.toBeNull();
    });

    it('applies a custom gap class', () => {
        host.gap.set('xl');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-stack--gap-xl')).not.toBeNull();
    });

    // ── Align & Justify ───────────────────────────────────────────────────
    it('applies the stretch align class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack--align-stretch')).not.toBeNull();
    });

    it('applies a custom align class', () => {
        host.align.set('center');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-stack--align-center')).not.toBeNull();
    });

    it('applies the start justify class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack--justify-start')).not.toBeNull();
    });

    it('applies a custom justify class', () => {
        host.justify.set('between');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-stack--justify-between')).not.toBeNull();
    });

    // ── Wrap ──────────────────────────────────────────────────────────────
    it('does not apply wrap class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-stack--wrap')).toBeNull();
    });

    it('applies wrap class when wrap is true', () => {
        host.wrap.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-stack--wrap')).not.toBeNull();
    });
});
