import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Footer } from './footer';

describe('Footer', () => {
    let component: Footer;
    let fixture: ComponentFixture<Footer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Footer],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Footer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── year ──────────────────────────────────────────────────────────────────
    it('year matches the current year', () => {
        expect(component.year).toBe(new Date().getFullYear());
    });

    // ── sections ──────────────────────────────────────────────────────────────
    it('exposes 3 footer sections', () => {
        expect(component.sections.length).toBe(3);
    });

    it('sections include Product, Resources, and Legal', () => {
        const titles = component.sections.map((s) => s.title);
        expect(titles).toContain('Product');
        expect(titles).toContain('Resources');
        expect(titles).toContain('Legal');
    });

    it('Product section contains Components and Docs links', () => {
        const product = component.sections.find((s) => s.title === 'Product');
        const labels = product?.links.map((l) => l.label) ?? [];
        expect(labels).toContain('Components');
        expect(labels).toContain('Docs');
    });

    it('Resources section includes a GitHub link', () => {
        const resources = component.sections.find((s) => s.title === 'Resources');
        const github = resources?.links.find((l) => l.label === 'GitHub');
        expect(github?.href).toContain('github.com');
    });

    it('Legal section includes License link pointing to GitHub', () => {
        const legal = component.sections.find((s) => s.title === 'Legal');
        const license = legal?.links.find((l) => l.label === 'License');
        expect(license?.href).toContain('github.com');
    });

    // ── socials ───────────────────────────────────────────────────────────────
    it('exposes 3 social links', () => {
        expect(component.socials.length).toBe(3);
    });

    it('socials include GitHub, npm, and Email', () => {
        const labels = component.socials.map((s) => s.label);
        expect(labels).toContain('GitHub');
        expect(labels).toContain('npm');
        expect(labels).toContain('Email');
    });

    it('Email social has a mailto href', () => {
        const email = component.socials.find((s) => s.label === 'Email');
        expect(email?.href).toMatch(/^mailto:/);
    });
});
