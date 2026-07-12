import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraAspectRatio, AspectRatioObjectFit, AspectRatioValue } from './zyra-aspect-ratio';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraAspectRatio],
    template: `
        <zyra-aspect-ratio [ratio]="ratio()" [objectFit]="objectFit()" [overflowHidden]="overflowHidden()">
            <img zyraPlaceholder src="placeholder.jpg" alt="" />
            <img src="photo.jpg" alt="content" />
        </zyra-aspect-ratio>
    `,
})
class AspectRatioHostComponent {
    ratio = signal<AspectRatioValue>('16/9');
    objectFit = signal<AspectRatioObjectFit>('cover');
    overflowHidden = signal(true);
}

@Component({
    standalone: true,
    imports: [ZyraAspectRatio],
    template: `<zyra-aspect-ratio />`,
})
class AspectRatioHostEmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraAspectRatio', () => {
    let fixture: ComponentFixture<AspectRatioHostComponent>;
    let host: AspectRatioHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AspectRatioHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AspectRatioHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-aspect-ratio');
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-aspect-ratio')).not.toBeNull();
    });

    it('applies the BEM root class "zyr-aspect-ratio"', () => {
        expect(el).not.toBeNull();
    });

    it('projects default content inside the content wrapper', () => {
        const content = el.querySelector('.zyr-aspect-ratio__content');
        expect(content).not.toBeNull();
        expect(content?.querySelector('img[alt="content"]')).not.toBeNull();
    });

    it('projects [zyraPlaceholder]-marked content inside the placeholder wrapper', () => {
        const placeholder = el.querySelector('.zyr-aspect-ratio__placeholder');
        expect(placeholder).not.toBeNull();
        expect(placeholder?.querySelector('img[src="placeholder.jpg"]')).not.toBeNull();
    });

    // ── ratio ─────────────────────────────────────────────────────────────

    it('defaults to a 16/9 ratio (56.25% padding-bottom)', () => {
        expect(el.style.paddingBottom).toBe('56.25%');
    });

    it('accepts a "1/1" string ratio', () => {
        host.ratio.set('1/1');
        fixture.detectChanges();
        expect(el.style.paddingBottom).toBe('100%');
    });

    it('accepts a "4:3" colon-separated ratio', () => {
        host.ratio.set('4:3');
        fixture.detectChanges();
        expect(el.style.paddingBottom).toBe('75%');
    });

    it('accepts a raw numeric ratio', () => {
        host.ratio.set(2);
        fixture.detectChanges();
        expect(el.style.paddingBottom).toBe('50%');
    });

    // ── objectFit ─────────────────────────────────────────────────────────

    it('defaults objectFit to "cover"', () => {
        expect(el.style.getPropertyValue('--zyr-ratio-object-fit')).toBe('cover');
    });

    it('reflects a custom objectFit value', () => {
        host.objectFit.set('contain');
        fixture.detectChanges();
        expect(el.style.getPropertyValue('--zyr-ratio-object-fit')).toBe('contain');
    });

    // ── overflowHidden ────────────────────────────────────────────────────

    it('defaults to overflow: hidden', () => {
        expect(el.style.overflow).toBe('hidden');
    });

    it('allows overflow: visible when overflowHidden is false', () => {
        host.overflowHidden.set(false);
        fixture.detectChanges();
        expect(el.style.overflow).toBe('visible');
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-aspect-ratio').isConnected).toBeTrue();
    });
});

describe('ZyraAspectRatio — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [AspectRatioHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(AspectRatioHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});
