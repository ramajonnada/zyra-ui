import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraRating } from './zyra-rating';

@Component({
    standalone: true,
    imports: [ZyraRating],
    template: `
        <zyra-rating
            [value]="value()"
            [max]="max()"
            [size]="size()"
            [readonly]="readonly()"
            [disabled]="disabled()"
            (valueChange)="value.set($event)"
        />
    `,
})
class RatingHostComponent {
    value = signal(0);
    max = signal(5);
    size = signal<'sm' | 'md' | 'lg'>('md');
    readonly = signal(false);
    disabled = signal(false);
}

describe('ZyraRating', () => {
    let fixture: ComponentFixture<RatingHostComponent>;
    let host: RatingHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [RatingHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(RatingHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders max number of stars by default', () => {
        const stars = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        expect(stars.length).toBe(5);
    });

    it('renders a custom max number of stars', () => {
        host.max.set(10);
        fixture.detectChanges();
        const stars = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        expect(stars.length).toBe(10);
    });

    it('applies the md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-rating--md')).not.toBeNull();
    });

    it('applies a custom size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-rating--lg')).not.toBeNull();
    });

    // ── Filled state ──────────────────────────────────────────────────────
    it('marks stars up to value as filled', () => {
        host.value.set(3);
        fixture.detectChanges();
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        expect(stars[0].classList.contains('zyr-rating__star--filled')).toBe(true);
        expect(stars[2].classList.contains('zyr-rating__star--filled')).toBe(true);
        expect(stars[3].classList.contains('zyr-rating__star--filled')).toBe(false);
    });

    // ── Interaction ───────────────────────────────────────────────────────
    it('emits valueChange when a star is clicked', () => {
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        stars[2].click();
        fixture.detectChanges();
        expect(host.value()).toBe(3);
    });

    it('shows hover preview before click without clicking', () => {
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        stars[3].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        expect(stars[3].classList.contains('zyr-rating__star--filled')).toBe(true);
        expect(host.value()).toBe(0);
    });

    it('clears hover preview on mouseleave of the group', () => {
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        stars[3].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        group.dispatchEvent(new MouseEvent('mouseleave'));
        fixture.detectChanges();
        expect(stars[3].classList.contains('zyr-rating__star--filled')).toBe(false);
    });

    it('increments rating on ArrowRight keydown', () => {
        host.value.set(2);
        fixture.detectChanges();
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        fixture.detectChanges();
        expect(host.value()).toBe(3);
    });

    it('decrements rating on ArrowLeft keydown', () => {
        host.value.set(2);
        fixture.detectChanges();
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        fixture.detectChanges();
        expect(host.value()).toBe(1);
    });

    it('does not go below 1 when decrementing from 1', () => {
        host.value.set(1);
        fixture.detectChanges();
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        fixture.detectChanges();
        expect(host.value()).toBe(1);
    });

    it('does not go above max when incrementing', () => {
        host.value.set(5);
        fixture.detectChanges();
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        fixture.detectChanges();
        expect(host.value()).toBe(5);
    });

    // ── Readonly & disabled ───────────────────────────────────────────────
    it('does not emit valueChange when readonly', () => {
        host.readonly.set(true);
        fixture.detectChanges();
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        stars[2].click();
        fixture.detectChanges();
        expect(host.value()).toBe(0);
    });

    it('applies readonly class', () => {
        host.readonly.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-rating--readonly')).not.toBeNull();
    });

    it('does not emit valueChange when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        stars[2].click();
        fixture.detectChanges();
        expect(host.value()).toBe(0);
    });

    it('disables star buttons when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        const star: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-rating__star');
        expect(star.disabled).toBe(true);
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets role="radiogroup" on the container', () => {
        const group: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating');
        expect(group.getAttribute('role')).toBe('radiogroup');
    });

    it('sets aria-label on each star', () => {
        const star: HTMLElement = fixture.nativeElement.querySelector('.zyr-rating__star');
        expect(star.getAttribute('aria-label')).toBe('1 star(s)');
    });

    it('sets aria-checked on the selected star', () => {
        host.value.set(2);
        fixture.detectChanges();
        const stars: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-rating__star');
        expect(stars[1].getAttribute('aria-checked')).toBe('true');
        expect(stars[0].getAttribute('aria-checked')).toBe('false');
    });
});
