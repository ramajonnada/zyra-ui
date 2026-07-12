import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraCarousel } from './zyra-carousel';
import { ZyraCarouselSlide } from './zyra-carousel-slide';

@Component({
    standalone: true,
    imports: [ZyraCarousel, ZyraCarouselSlide],
    template: `
        <zyra-carousel
            [loop]="loop()"
            [autoplay]="autoplay()"
            [autoplayInterval]="autoplayInterval()"
            (indexChange)="onIndexChange($event)"
        >
            <zyra-carousel-slide>Slide 1</zyra-carousel-slide>
            <zyra-carousel-slide>Slide 2</zyra-carousel-slide>
            <zyra-carousel-slide>Slide 3</zyra-carousel-slide>
        </zyra-carousel>
    `,
})
class CarouselHostComponent {
    loop = signal(true);
    autoplay = signal(false);
    autoplayInterval = signal(5000);
    emittedIndexes: number[] = [];

    onIndexChange(i: number): void {
        this.emittedIndexes.push(i);
    }
}

function carousel(fixture: ComponentFixture<unknown>): ZyraCarousel {
    return fixture.debugElement.children[0].componentInstance as ZyraCarousel;
}

function arrow(fixture: ComponentFixture<unknown>, dir: 'prev' | 'next'): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`.zyr-carousel__arrow--${dir}`);
}

function dots(fixture: ComponentFixture<unknown>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.zyr-carousel__dot'));
}

describe('ZyraCarousel', () => {
    let fixture: ComponentFixture<CarouselHostComponent>;
    let host: CarouselHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarouselHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarouselHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('starts on the first slide', () => {
        expect(carousel(fixture).activeIndex()).toBe(0);
    });

    it('renders one dot per slide', () => {
        expect(dots(fixture).length).toBe(3);
    });

    it('advances to the next slide and emits indexChange', () => {
        arrow(fixture, 'next').click();
        fixture.detectChanges();

        expect(carousel(fixture).activeIndex()).toBe(1);
        expect(host.emittedIndexes).toEqual([1]);
    });

    it('goes back to the previous slide', () => {
        carousel(fixture).goTo(1);
        fixture.detectChanges();

        arrow(fixture, 'prev').click();
        fixture.detectChanges();

        expect(carousel(fixture).activeIndex()).toBe(0);
    });

    it('wraps to the last slide when going prev from the first with loop enabled', () => {
        arrow(fixture, 'prev').click();
        fixture.detectChanges();

        expect(carousel(fixture).activeIndex()).toBe(2);
    });

    it('wraps to the first slide when going next from the last with loop enabled', () => {
        carousel(fixture).goTo(2);
        fixture.detectChanges();

        arrow(fixture, 'next').click();
        fixture.detectChanges();

        expect(carousel(fixture).activeIndex()).toBe(0);
    });

    it('disables the prev arrow at the start when loop is disabled', () => {
        host.loop.set(false);
        fixture.detectChanges();

        expect(arrow(fixture, 'prev').disabled).toBeTrue();
        expect(arrow(fixture, 'next').disabled).toBeFalse();
    });

    it('disables the next arrow at the end when loop is disabled', () => {
        host.loop.set(false);
        carousel(fixture).goTo(2);
        fixture.detectChanges();

        expect(arrow(fixture, 'next').disabled).toBeTrue();
    });

    it('navigates to a slide by clicking its dot', () => {
        dots(fixture)[2].click();
        fixture.detectChanges();

        expect(carousel(fixture).activeIndex()).toBe(2);
        expect(dots(fixture)[2].classList).toContain('zyr-carousel__dot--active');
    });

    it('navigates with ArrowLeft/ArrowRight keys', () => {
        const root: HTMLElement = fixture.nativeElement.querySelector('.zyr-carousel');
        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        expect(carousel(fixture).activeIndex()).toBe(1);

        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        expect(carousel(fixture).activeIndex()).toBe(0);
    });

    it('applies a translateX transform matching the active index', () => {
        carousel(fixture).goTo(1);
        fixture.detectChanges();

        const track: HTMLElement = fixture.nativeElement.querySelector('.zyr-carousel__track');
        expect(track.style.transform).toBe('translateX(-100%)');
    });

    it('advances automatically when autoplay is enabled', () => {
        jasmine.clock().install();
        try {
            host.autoplay.set(true);
            fixture.detectChanges();

            jasmine.clock().tick(5000);
            fixture.detectChanges();

            expect(carousel(fixture).activeIndex()).toBe(1);
        } finally {
            jasmine.clock().uninstall();
        }
    });

    it('pauses autoplay on mouseenter and resumes on mouseleave', () => {
        jasmine.clock().install();
        try {
            host.autoplay.set(true);
            fixture.detectChanges();

            const root: HTMLElement = fixture.nativeElement.querySelector('.zyr-carousel');
            root.dispatchEvent(new Event('mouseenter'));
            jasmine.clock().tick(5000);
            fixture.detectChanges();
            expect(carousel(fixture).activeIndex()).toBe(0);

            root.dispatchEvent(new Event('mouseleave'));
            jasmine.clock().tick(5000);
            fixture.detectChanges();
            expect(carousel(fixture).activeIndex()).toBe(1);
        } finally {
            jasmine.clock().uninstall();
        }
    });

    it('has role="region" with aria-roledescription="carousel"', () => {
        const root: HTMLElement = fixture.nativeElement.querySelector('[role="region"]');
        expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    });
});
