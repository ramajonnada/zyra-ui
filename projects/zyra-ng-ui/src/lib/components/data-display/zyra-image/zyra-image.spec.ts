import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraImage } from './zyra-image';

@Component({
    standalone: true,
    imports: [ZyraImage],
    template: `
        <zyra-image
            [src]="src()"
            [alt]="alt()"
            [fallbackSrc]="fallbackSrc()"
            [ratio]="ratio()"
            [objectFit]="objectFit()"
            [radius]="radius()"
            [caption]="caption()"
            [priority]="priority()"
            [width]="width()"
            [height]="height()"
            (loaded)="onLoaded()"
            (error)="onError()"
        />
    `,
})
class ImageHostComponent {
    src = signal('https://example.com/photo.jpg');
    alt = signal('A photo');
    fallbackSrc = signal('');
    ratio = signal<string | number | null>(null);
    objectFit = signal<'cover' | 'contain' | 'fill' | 'none' | 'scale-down'>('cover');
    radius = signal<'none' | 'sm' | 'md' | 'lg' | 'full'>('none');
    caption = signal('');
    priority = signal(false);
    width = signal<number | null>(null);
    height = signal<number | null>(null);

    loadedCount = 0;
    errorCount = 0;
    onLoaded(): void {
        this.loadedCount++;
    }
    onError(): void {
        this.errorCount++;
    }
}

describe('ZyraImage', () => {
    let fixture: ComponentFixture<ImageHostComponent>;
    let host: ImageHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ImageHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders an img with the given src and alt', () => {
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img).not.toBeNull();
        expect(img.src).toContain('photo.jpg');
        expect(img.alt).toBe('A photo');
    });

    it('shows a skeleton while loading', () => {
        expect(fixture.nativeElement.querySelector('.zyr-image__skeleton')).not.toBeNull();
    });

    it('hides the skeleton and marks the image loaded after load fires', () => {
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('load'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-image__skeleton')).toBeNull();
        expect(img.classList).toContain('zyr-image__img--loaded');
        expect(host.loadedCount).toBe(1);
    });

    // ── Error / fallback ─────────────────────────────────────────────────
    it('shows the fallback placeholder on error when no fallbackSrc is set', () => {
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-image__fallback')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-image__img')).toBeNull();
        expect(host.errorCount).toBe(1);
    });

    it('swaps to fallbackSrc on first error instead of showing the placeholder', () => {
        host.fallbackSrc.set('https://example.com/fallback.jpg');
        fixture.detectChanges();
        let img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        img = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img).not.toBeNull();
        expect(img.src).toContain('fallback.jpg');
        expect(host.errorCount).toBe(0);
    });

    it('shows the placeholder if the fallbackSrc itself also errors', () => {
        host.fallbackSrc.set('https://example.com/fallback.jpg');
        fixture.detectChanges();
        let img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        img = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-image__fallback')).not.toBeNull();
        expect(host.errorCount).toBe(1);
    });

    it('resets fallback/error state and retries the new src when src changes', () => {
        host.fallbackSrc.set('https://example.com/fallback.jpg');
        fixture.detectChanges();
        // Trigger the fallback path.
        let img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        img = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img.src).toContain('fallback.jpg');

        // Swap to a brand-new src — must retry it, not keep showing the stale fallback.
        host.src.set('https://example.com/new-photo.jpg');
        fixture.detectChanges();
        img = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img.src).toContain('new-photo.jpg');
        expect(fixture.nativeElement.querySelector('.zyr-image__skeleton')).not.toBeNull();
    });

    // ── Ratio / classes ───────────────────────────────────────────────────
    it('applies the ratio class and padding-bottom style when ratio is set', () => {
        host.ratio.set('16/9');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-image');
        expect(el.classList).toContain('zyr-image--ratio');
        expect(el.style.paddingBottom).toBe('56.25%');
    });

    it('does not apply the ratio class by default', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-image');
        expect(el.classList).not.toContain('zyr-image--ratio');
    });

    it('applies the radius class', () => {
        host.radius.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-image--radius-lg')).not.toBeNull();
    });

    // ── Caption ───────────────────────────────────────────────────────────
    it('renders a caption when provided', () => {
        host.caption.set('A scenic view');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-image__caption').textContent.trim()).toBe(
            'A scenic view',
        );
    });

    it('omits the caption element when not provided', () => {
        expect(fixture.nativeElement.querySelector('.zyr-image__caption')).toBeNull();
    });

    // ── Priority / dimensions ─────────────────────────────────────────────
    it('sets loading=eager and fetchpriority=high when priority is true', () => {
        host.priority.set(true);
        fixture.detectChanges();
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img.loading).toBe('eager');
        expect(img.getAttribute('fetchpriority')).toBe('high');
    });

    it('defaults to lazy loading and no fetchpriority', () => {
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img.loading).toBe('lazy');
        expect(img.getAttribute('fetchpriority')).toBeNull();
    });

    it('applies width and height attributes when provided', () => {
        host.width.set(400);
        host.height.set(225);
        fixture.detectChanges();
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-image__img');
        expect(img.getAttribute('width')).toBe('400');
        expect(img.getAttribute('height')).toBe('225');
    });
});
