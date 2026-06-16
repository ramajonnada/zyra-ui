import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraSkeleton } from './zyra-skeleton';

describe('ZyraSkeleton', () => {
    let fixture: ComponentFixture<ZyraSkeleton>;
    let component: ZyraSkeleton;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [ZyraSkeleton] }).compileComponents();
        fixture = TestBed.createComponent(ZyraSkeleton);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Default ───────────────────────────────────────────────────────────
    it('renders a single rect skeleton by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-skeleton--rect')).not.toBeNull();
    });

    it('renders a single element for lines=1', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.componentRef.setInput('lines', 1);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.zyr-skeleton').length).toBe(1);
    });

    // ── Variants ──────────────────────────────────────────────────────────
    it('applies the circle variant class', () => {
        fixture.componentRef.setInput('variant', 'circle');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-skeleton--circle')).not.toBeNull();
    });

    it('applies the text variant class', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-skeleton--text')).not.toBeNull();
    });

    // ── Multiple text lines ───────────────────────────────────────────────
    it('renders multiple lines for text variant with lines > 1', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.componentRef.setInput('lines', 4);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.zyr-skeleton--text').length).toBe(4);
    });

    it('adds --last-line class to the final text line when lines > 1', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.componentRef.setInput('lines', 3);
        fixture.detectChanges();
        const lines: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-skeleton--text');
        expect(lines[2].classList).toContain('zyr-skeleton--last-line');
        expect(lines[0].classList).not.toContain('zyr-skeleton--last-line');
        expect(lines[1].classList).not.toContain('zyr-skeleton--last-line');
    });

    it('does not add --last-line to single text line', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.componentRef.setInput('lines', 1);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-skeleton--text');
        expect(el.classList).not.toContain('zyr-skeleton--last-line');
    });

    // ── Animation ─────────────────────────────────────────────────────────
    it('adds --static class when animated is false', () => {
        fixture.componentRef.setInput('animated', false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-skeleton--static')).not.toBeNull();
    });

    it('does not add --static class when animated is true', () => {
        fixture.componentRef.setInput('animated', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-skeleton--static')).toBeNull();
    });

    // ── Custom dimensions ─────────────────────────────────────────────────
    it('applies custom width and height styles', () => {
        fixture.componentRef.setInput('width', '120px');
        fixture.componentRef.setInput('height', '60px');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-skeleton');
        expect(el.style.width).toBe('120px');
        expect(el.style.height).toBe('60px');
    });

    it('does not set inline width/height when values are empty', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-skeleton');
        expect(el.style.width).toBeFalsy();
        expect(el.style.height).toBeFalsy();
    });

    // ── isLastLine helper ─────────────────────────────────────────────────
    it('isLastLine returns true only for the last index when variant is text and lines > 1', () => {
        fixture.componentRef.setInput('variant', 'text');
        fixture.componentRef.setInput('lines', 3);
        fixture.detectChanges();
        expect(component.isLastLine(2)).toBeTrue();
        expect(component.isLastLine(0)).toBeFalse();
        expect(component.isLastLine(1)).toBeFalse();
    });

    it('isLastLine returns false for rect variant', () => {
        fixture.componentRef.setInput('lines', 3);
        fixture.detectChanges();
        expect(component.isLastLine(2)).toBeFalse();
    });
});
