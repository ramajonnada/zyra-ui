import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Sidebar } from './sidebar';

@Component({ template: '' })
class FakePage {}

describe('Sidebar', () => {
    let component: Sidebar;
    let fixture: ComponentFixture<Sidebar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [
                provideRouter([
                    { path: 'docs/components', component: FakePage },
                    { path: 'docs/components/:component', component: FakePage },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Sidebar);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── navItems data ─────────────────────────────────────────────────────────
    it('exposes 6 nav items', () => {
        expect(component.navItems.length).toBe(6);
    });

    it('navItems contains the docs group, Components, and Blog', () => {
        const labels = component.navItems.map((n) => n.label);
        expect(labels).toContain('Overview');
        expect(labels).toContain('Installation');
        expect(labels).toContain('Theming');
        expect(labels).toContain('Theme tokens');
        expect(labels).toContain('Components');
        expect(labels).toContain('Blog');
    });

    it('only "Overview" carries the Getting started group heading', () => {
        const headed = component.navItems.filter((n) => !!n.heading);
        expect(headed.length).toBe(1);
        expect(headed[0].label).toBe('Overview');
        expect(headed[0].heading).toBe('Getting started');
    });

    it('docs group items route under /docs', () => {
        expect(component.navItems.find((n) => n.label === 'Overview')?.route).toBe('/docs');
        expect(component.navItems.find((n) => n.label === 'Installation')?.route).toBe(
            '/docs/installation',
        );
        expect(component.navItems.find((n) => n.label === 'Components')?.route).toBe(
            '/docs/components',
        );
        expect(component.navItems.find((n) => n.label === 'Theming')?.route).toBe('/docs/theming');
        expect(component.navItems.find((n) => n.label === 'Theme tokens')?.route).toBe(
            '/docs/theme-tokens',
        );
    });

    it('Components sits right before Blog', () => {
        const labels = component.navItems.map((n) => n.label);
        const componentsIndex = labels.indexOf('Components');
        const blogIndex = labels.indexOf('Blog');
        expect(blogIndex).toBe(componentsIndex + 1);
        expect(blogIndex).toBe(labels.length - 1);
    });
});
