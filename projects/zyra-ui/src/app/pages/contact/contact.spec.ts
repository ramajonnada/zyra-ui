import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from './contact';

describe('Contact', () => {
    let component: Contact;
    let fixture: ComponentFixture<Contact>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Contact],
        }).compileComponents();

        fixture = TestBed.createComponent(Contact);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── contactMethods data ───────────────────────────────────────────────────
    it('exposes 4 contact methods', () => {
        expect(component.contactMethods.length).toBe(4);
    });

    it('contact methods include Email, Instagram, GitHub, and Website', () => {
        const labels = component.contactMethods.map((m) => m.label);
        expect(labels).toContain('Email');
        expect(labels).toContain('Instagram');
        expect(labels).toContain('GitHub');
        expect(labels).toContain('Website');
    });

    it('Email method has a mailto href', () => {
        const email = component.contactMethods.find((m) => m.label === 'Email');
        expect(email?.href).toMatch(/^mailto:/);
    });

    it('GitHub method links to the GitHub repo', () => {
        const github = component.contactMethods.find((m) => m.label === 'GitHub');
        expect(github?.href).toContain('github.com');
    });
});
