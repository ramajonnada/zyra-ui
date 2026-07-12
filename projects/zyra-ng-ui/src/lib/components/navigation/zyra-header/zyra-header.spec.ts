import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    HeaderAlign,
    HeaderPosition,
    HeaderVariant,
    ZyraHeader,
    ZyraHeaderEnd,
    ZyraHeaderMobileEnd,
    ZyraHeaderNav,
    ZyraHeaderStart,
} from './zyra-header';

@Component({
    standalone: true,
    imports: [ZyraHeader, ZyraHeaderStart, ZyraHeaderNav, ZyraHeaderEnd, ZyraHeaderMobileEnd],
    template: `
        <zyra-header
            [position]="position()"
            [variant]="variant()"
            [align]="align()"
            [transparent]="transparent()"
            [elevateOnScroll]="elevateOnScroll()"
            [scrollThreshold]="scrollThreshold()"
            aria-label="Site"
            (mobileOpenChange)="mobileOpenEvents.push($event)"
            (scrolledChange)="scrolledEvents.push($event)"
        >
            <a zyraHeaderStart>Logo</a>
            <nav zyraHeaderNav><a>Docs</a><a>Blog</a></nav>
            <div zyraHeaderEnd>Get started</div>
            <div zyraHeaderMobileEnd>Mobile CTA</div>
        </zyra-header>
    `,
})
class HeaderHostComponent {
    position = signal<HeaderPosition>('static');
    variant = signal<HeaderVariant>('contained');
    align = signal<HeaderAlign>('split');
    transparent = signal(false);
    elevateOnScroll = signal(true);
    scrollThreshold = signal(12);
    mobileOpenEvents: boolean[] = [];
    scrolledEvents: boolean[] = [];
}

describe('ZyraHeader', () => {
    let fixture: ComponentFixture<HeaderHostComponent>;
    let host: HeaderHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    function headerEl(): HTMLElement {
        return fixture.nativeElement.querySelector('zyra-header');
    }

    // ── Projected content ─────────────────────────────────────────────────
    it('renders projected start, nav and end content', () => {
        expect(headerEl().textContent).toContain('Logo');
        expect(headerEl().textContent).toContain('Docs');
        expect(headerEl().textContent).toContain('Get started');
    });

    it('does not render mobile-end content until the mobile panel is open', () => {
        expect(headerEl().querySelector('.zyr-header__mobile-panel')).toBeNull();
    });

    // ── Default host classes ──────────────────────────────────────────────
    it('applies default position, variant, align and size classes', () => {
        const classes = headerEl().classList;
        expect(classes).toContain('zyr-header--static');
        expect(classes).toContain('zyr-header--contained');
        expect(classes).toContain('zyr-header--split');
        expect(classes).toContain('zyr-header--md');
    });

    it('reflects aria-label input on the host', () => {
        expect(headerEl().getAttribute('aria-label')).toBe('Site');
    });

    // ── Input-driven classes ──────────────────────────────────────────────
    it('applies sticky/fixed position classes', () => {
        host.position.set('sticky');
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--sticky');

        host.position.set('fixed');
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--fixed');
    });

    it('applies full-width variant class', () => {
        host.variant.set('full-width');
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--full-width');
    });

    it('applies center align class', () => {
        host.align.set('center');
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--center');
    });

    it('applies transparent class when transparent is true', () => {
        host.transparent.set(true);
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--transparent');
    });

    // ── Mobile menu toggle ────────────────────────────────────────────────
    it('opens the mobile panel when the burger button is clicked', () => {
        const burger: HTMLButtonElement = headerEl().querySelector('.zyr-header__burger')!;
        burger.click();
        fixture.detectChanges();

        expect(headerEl().classList).toContain('zyr-header--mobile-open');
        expect(headerEl().querySelector('.zyr-header__mobile-panel')).not.toBeNull();
        expect(headerEl().textContent).toContain('Mobile CTA');
        expect(host.mobileOpenEvents).toEqual([true]);
    });

    it('closes the mobile panel on a second burger click', () => {
        const burger: HTMLButtonElement = headerEl().querySelector('.zyr-header__burger')!;
        burger.click();
        fixture.detectChanges();
        burger.click();
        fixture.detectChanges();

        expect(headerEl().classList).not.toContain('zyr-header--mobile-open');
        expect(headerEl().querySelector('.zyr-header__mobile-panel')).toBeNull();
        expect(host.mobileOpenEvents).toEqual([true, false]);
    });

    it('updates aria-expanded and aria-label on the burger button', () => {
        const burger: HTMLButtonElement = headerEl().querySelector('.zyr-header__burger')!;
        expect(burger.getAttribute('aria-expanded')).toBe('false');
        expect(burger.getAttribute('aria-label')).toBe('Open navigation menu');

        burger.click();
        fixture.detectChanges();

        expect(burger.getAttribute('aria-expanded')).toBe('true');
        expect(burger.getAttribute('aria-label')).toBe('Close navigation menu');
    });

    it('closes the mobile panel on Escape', () => {
        const burger: HTMLButtonElement = headerEl().querySelector('.zyr-header__burger')!;
        burger.click();
        fixture.detectChanges();
        expect(headerEl().classList).toContain('zyr-header--mobile-open');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();

        expect(headerEl().classList).not.toContain('zyr-header--mobile-open');
        expect(host.mobileOpenEvents).toEqual([true, false]);
    });

    // ── Scroll elevation ──────────────────────────────────────────────────
    it('applies the scrolled class once scrollY passes the threshold', () => {
        Object.defineProperty(window, 'scrollY', { value: 20, configurable: true });
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        expect(headerEl().classList).toContain('zyr-header--scrolled');
        expect(host.scrolledEvents).toEqual([true]);

        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });

    it('does not apply the scrolled class when elevateOnScroll is false', () => {
        host.elevateOnScroll.set(false);
        fixture.detectChanges();

        Object.defineProperty(window, 'scrollY', { value: 20, configurable: true });
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        expect(headerEl().classList).not.toContain('zyr-header--scrolled');

        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });
});
