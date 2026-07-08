import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraBreadcrumb } from './zyra-breadcrumb';
import { ZyraBreadcrumbItem } from './zyra-breadcrumb-item';

@Component({
    standalone: true,
    imports: [ZyraBreadcrumb, ZyraBreadcrumbItem],
    template: `
        <zyra-breadcrumb>
            <zyra-breadcrumb-item href="/">Home</zyra-breadcrumb-item>
            <zyra-breadcrumb-item href="/components">Components</zyra-breadcrumb-item>
            <zyra-breadcrumb-item [current]="true">Code Block</zyra-breadcrumb-item>
        </zyra-breadcrumb>
    `,
})
class BreadcrumbHostComponent {}

describe('ZyraBreadcrumb', () => {
    let fixture: ComponentFixture<BreadcrumbHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [BreadcrumbHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(BreadcrumbHostComponent);
        fixture.detectChanges();
    });

    // ── Structure ─────────────────────────────────────────────────────────
    it('renders a nav with the default aria-label', () => {
        const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
        expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('renders one list item per zyra-breadcrumb-item', () => {
        const items = fixture.nativeElement.querySelectorAll('.zyr-breadcrumb__item');
        expect(items.length).toBe(3);
    });

    // ── Links vs current ──────────────────────────────────────────────────
    it('sets href on items that are not current', () => {
        const links: NodeListOf<HTMLAnchorElement> =
            fixture.nativeElement.querySelectorAll('.zyr-breadcrumb__link');
        expect(links[0].getAttribute('href')).toBe('/');
        expect(links[0].textContent).toContain('Home');
    });

    it('marks the current item with aria-current="page" and no href', () => {
        const links: NodeListOf<HTMLAnchorElement> =
            fixture.nativeElement.querySelectorAll('.zyr-breadcrumb__link');
        const current = links[links.length - 1];
        expect(current.getAttribute('aria-current')).toBe('page');
        expect(current.getAttribute('href')).toBeNull();
        expect(current.textContent).toContain('Code Block');
    });

    it('does not set href for the current item even if href is set', () => {
        const currentItems = fixture.nativeElement.querySelectorAll('zyra-breadcrumb-item');
        const lastItem = currentItems[currentItems.length - 1];
        expect(lastItem.querySelector('.zyr-breadcrumb__link').getAttribute('href')).toBeNull();
    });

    // ── Separators ────────────────────────────────────────────────────────
    it('renders a separator icon after every item', () => {
        const seps = fixture.nativeElement.querySelectorAll('.zyr-breadcrumb__sep');
        expect(seps.length).toBe(3);
    });
});
