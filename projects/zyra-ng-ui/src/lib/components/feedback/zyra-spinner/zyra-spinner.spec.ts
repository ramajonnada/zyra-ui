import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraSpinner } from './zyra-spinner';

describe('ZyraSpinner', () => {
    let fixture: ComponentFixture<ZyraSpinner>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [ZyraSpinner] }).compileComponents();
        fixture = TestBed.createComponent(ZyraSpinner);
        fixture.detectChanges();
    });

    // ── Defaults ──────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-spinner--md')).not.toBeNull();
    });

    it('applies accent color class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-spinner--accent')).not.toBeNull();
    });

    it('uses "Loading…" as default label', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner');
        expect(el.getAttribute('aria-label')).toBe('Loading…');
    });

    // ── Size classes & dimensions ─────────────────────────────────────────
    it('applies xs size class and 12px dimensions', () => {
        fixture.componentRef.setInput('size', 'xs');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner--xs');
        expect(el).not.toBeNull();
        expect(el.style.width).toBe('12px');
        expect(el.style.height).toBe('12px');
    });

    it('applies sm size class and 16px dimensions', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner--sm');
        expect(el.style.width).toBe('16px');
        expect(el.style.height).toBe('16px');
    });

    it('applies md size class and 24px dimensions', () => {
        fixture.componentRef.setInput('size', 'md');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner--md');
        expect(el.style.width).toBe('24px');
        expect(el.style.height).toBe('24px');
    });

    it('applies lg size class and 36px dimensions', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner--lg');
        expect(el.style.width).toBe('36px');
        expect(el.style.height).toBe('36px');
    });

    // ── Color classes ─────────────────────────────────────────────────────
    it('applies white color class', () => {
        fixture.componentRef.setInput('color', 'white');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-spinner--white')).not.toBeNull();
    });

    it('applies accent-2 color class', () => {
        fixture.componentRef.setInput('color', 'accent-2');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-spinner--accent-2')).not.toBeNull();
    });

    it('applies current color class', () => {
        fixture.componentRef.setInput('color', 'current');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-spinner--current')).not.toBeNull();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('has role="status"', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner');
        expect(el.getAttribute('role')).toBe('status');
    });

    it('sets custom aria-label', () => {
        fixture.componentRef.setInput('label', 'Fetching data');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner');
        expect(el.getAttribute('aria-label')).toBe('Fetching data');
    });

    it('renders sr-only label text', () => {
        fixture.componentRef.setInput('label', 'Please wait');
        fixture.detectChanges();
        const srOnly: HTMLElement = fixture.nativeElement.querySelector('.sr-only');
        expect(srOnly.textContent?.trim()).toBe('Please wait');
    });
});
