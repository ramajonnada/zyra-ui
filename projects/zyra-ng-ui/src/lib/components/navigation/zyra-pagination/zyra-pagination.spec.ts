import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraPagination } from './zyra-pagination';

@Component({
    standalone: true,
    imports: [ZyraPagination],
    template: `
        <zyra-pagination
            [totalPages]="totalPages()"
            [currentPage]="currentPage()"
            [siblingCount]="siblingCount()"
            [size]="size()"
            [disabled]="disabled()"
            (pageChange)="currentPage.set($event)"
        />
    `,
})
class PaginationHostComponent {
    totalPages = signal(10);
    currentPage = signal(1);
    siblingCount = signal(1);
    size = signal<'sm' | 'md' | 'lg'>('md');
    disabled = signal(false);
}

describe('ZyraPagination', () => {
    let fixture: ComponentFixture<PaginationHostComponent>;
    let host: PaginationHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [PaginationHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(PaginationHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders a nav with the correct aria-label', () => {
        const nav: HTMLElement = fixture.nativeElement.querySelector('.zyr-pagination');
        expect(nav.getAttribute('aria-label')).toBe('Pagination');
    });

    it('renders all pages when total pages is small', () => {
        host.totalPages.set(5);
        fixture.detectChanges();
        const pages = fixture.nativeElement.querySelectorAll('.zyr-pagination__page');
        expect(pages.length).toBe(5);
    });

    it('collapses middle pages into an ellipsis when there are many pages', () => {
        host.totalPages.set(10);
        host.currentPage.set(5);
        fixture.detectChanges();
        const ellipses = fixture.nativeElement.querySelectorAll('.zyr-pagination__ellipsis');
        expect(ellipses.length).toBe(2);
    });

    it('always shows the first and last page', () => {
        host.totalPages.set(20);
        host.currentPage.set(10);
        fixture.detectChanges();
        const pages: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-pagination__page');
        const labels = Array.from(pages).map((p) => p.textContent?.trim());
        expect(labels[0]).toBe('1');
        expect(labels[labels.length - 1]).toBe('20');
    });

    // ── Active state ──────────────────────────────────────────────────────
    it('marks the current page as active', () => {
        host.currentPage.set(1);
        fixture.detectChanges();
        const active: HTMLElement = fixture.nativeElement.querySelector('.zyr-pagination__page--active');
        expect(active.textContent?.trim()).toBe('1');
        expect(active.getAttribute('aria-current')).toBe('page');
    });

    // ── Navigation ────────────────────────────────────────────────────────
    it('disables the prev button on the first page', () => {
        host.currentPage.set(1);
        fixture.detectChanges();
        const prev: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-pagination__prev');
        expect(prev.disabled).toBe(true);
    });

    it('disables the next button on the last page', () => {
        host.currentPage.set(10);
        fixture.detectChanges();
        const next: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-pagination__next');
        expect(next.disabled).toBe(true);
    });

    it('emits pageChange with currentPage + 1 when next is clicked', () => {
        host.currentPage.set(3);
        fixture.detectChanges();
        const next: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-pagination__next');
        next.click();
        fixture.detectChanges();
        expect(host.currentPage()).toBe(4);
    });

    it('emits pageChange with currentPage - 1 when prev is clicked', () => {
        host.currentPage.set(3);
        fixture.detectChanges();
        const prev: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-pagination__prev');
        prev.click();
        fixture.detectChanges();
        expect(host.currentPage()).toBe(2);
    });

    it('emits pageChange with the clicked page number', () => {
        host.totalPages.set(5);
        host.currentPage.set(1);
        fixture.detectChanges();
        const pages: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-pagination__page');
        pages[2].click();
        fixture.detectChanges();
        expect(host.currentPage()).toBe(3);
    });

    // ── Disabled ──────────────────────────────────────────────────────────
    it('disables all page buttons when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        const page: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-pagination__page');
        expect(page.disabled).toBe(true);
    });

    it('does not emit pageChange when disabled', () => {
        host.disabled.set(true);
        host.currentPage.set(3);
        fixture.detectChanges();
        const pages: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-pagination__page');
        pages[0].click();
        fixture.detectChanges();
        expect(host.currentPage()).toBe(3);
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies the md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-pagination--md')).not.toBeNull();
    });

    it('applies a custom size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-pagination--lg')).not.toBeNull();
    });
});
