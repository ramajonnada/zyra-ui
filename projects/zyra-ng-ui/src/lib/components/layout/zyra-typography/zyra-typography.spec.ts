import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTypography, TypographyVariant, TypographyWeight, TypographyAlign } from './zyra-typography';

@Component({
    standalone: true,
    imports: [ZyraTypography],
    template: `
        <zyra-typography
            [variant]="variant()"
            [as]="asTag()"
            [weight]="weight()"
            [align]="align()"
            [muted]="muted()"
            [truncate]="truncate()"
            >{{ text() }}</zyra-typography
        >
    `,
})
class TypographyHostComponent {
    variant = signal<TypographyVariant>('body');
    asTag = signal('');
    weight = signal<TypographyWeight>('');
    align = signal<TypographyAlign>('left');
    muted = signal(false);
    truncate = signal(false);
    text = signal('Hello world');
}

describe('ZyraTypography', () => {
    let fixture: ComponentFixture<TypographyHostComponent>;
    let host: TypographyHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TypographyHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(TypographyHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders projected content', () => {
        expect(fixture.nativeElement.querySelector('.zyr-typography').textContent).toContain('Hello world');
    });

    // ── Tag mapping ───────────────────────────────────────────────────────
    it('renders a <p> tag for the default body variant', () => {
        expect(fixture.nativeElement.querySelector('p.zyr-typography')).not.toBeNull();
    });

    it('renders an <h1> tag for the h1 variant', () => {
        host.variant.set('h1');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h1.zyr-typography')).not.toBeNull();
    });

    it('renders an <h2> tag for the h2 variant', () => {
        host.variant.set('h2');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h2.zyr-typography')).not.toBeNull();
    });

    it('renders an <h3> tag for the h3 variant', () => {
        host.variant.set('h3');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h3.zyr-typography')).not.toBeNull();
    });

    it('renders an <h6> tag for the h6 variant', () => {
        host.variant.set('h6');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h6.zyr-typography')).not.toBeNull();
    });

    it('renders a <p> tag for the body-lg variant', () => {
        host.variant.set('body-lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('p.zyr-typography')).not.toBeNull();
    });

    it('renders a <span> tag for the caption variant', () => {
        host.variant.set('caption');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('span.zyr-typography')).not.toBeNull();
    });

    it('renders a <span> tag for the overline variant', () => {
        host.variant.set('overline');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('span.zyr-typography')).not.toBeNull();
    });

    // ── Explicit tag override ─────────────────────────────────────────────
    it('renders the explicit tag when `as` is provided', () => {
        host.variant.set('h2');
        host.asTag.set('div');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('div.zyr-typography')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('h2.zyr-typography')).toBeNull();
    });

    // ── Variant class ─────────────────────────────────────────────────────
    it('applies the variant modifier class', () => {
        host.variant.set('h3');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--h3')).not.toBeNull();
    });

    // ── Weight override ───────────────────────────────────────────────────
    it('does not apply a weight class by default', () => {
        expect(fixture.nativeElement.querySelector('[class*="zyr-typography--weight-"]')).toBeNull();
    });

    it('applies the weight override class', () => {
        host.weight.set('bold');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--weight-bold')).not.toBeNull();
    });

    // ── Alignment ─────────────────────────────────────────────────────────
    it('applies the left alignment class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-typography--align-left')).not.toBeNull();
    });

    it('applies the center alignment class', () => {
        host.align.set('center');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--align-center')).not.toBeNull();
    });

    it('applies the right alignment class', () => {
        host.align.set('right');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--align-right')).not.toBeNull();
    });

    // ── Muted ─────────────────────────────────────────────────────────────
    it('does not apply muted class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-typography--muted')).toBeNull();
    });

    it('applies muted class when muted is true', () => {
        host.muted.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--muted')).not.toBeNull();
    });

    // ── Truncate ──────────────────────────────────────────────────────────
    it('does not apply truncate class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-typography--truncate')).toBeNull();
    });

    it('applies truncate class when truncate is true', () => {
        host.truncate.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-typography--truncate')).not.toBeNull();
    });
});
