import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Sidebar } from './sidebar';

@Component({ template: '' })
class FakePage {}

describe('Sidebar', () => {
    let component: Sidebar;
    let fixture: ComponentFixture<Sidebar>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [
                provideRouter([
                    { path: 'components', component: FakePage },
                    { path: 'components/:component', component: FakePage },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Sidebar);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── navItems data ─────────────────────────────────────────────────────────
    it('exposes 4 nav items', () => {
        expect(component.navItems.length).toBe(4);
    });

    it('navItems contains Docs, Components, Blog and Contact', () => {
        const labels = component.navItems.map((n) => n.label);
        expect(labels).toContain('Docs');
        expect(labels).toContain('Components');
        expect(labels).toContain('Blog');
        expect(labels).toContain('Contact');
    });

    it('Components nav item badge matches the number of showcased components', () => {
        const components = component.navItems.find((n) => n.label === 'Components');
        expect(components?.badge).toBe(String(components?.children?.length));
    });

    it('only Components has a badge', () => {
        const badged = component.navItems.filter((n) => !!n.badge);
        expect(badged.length).toBe(1);
    });

    // ── two-level tree ────────────────────────────────────────────────────────
    it('Components nav item has one child per showcased component', () => {
        const components = component.navItems.find((n) => n.label === 'Components');
        expect(components?.children?.length).toBe(Number(components?.badge));
        expect(components?.children?.[0]).toEqual({ label: 'Button', route: '/components/button' });
    });

    it('Docs, Blog and Contact have no children', () => {
        const leaves = component.navItems.filter((n) => n.label !== 'Components');
        expect(leaves.every((n) => !n.children)).toBeTrue();
    });

    it('Components group collapses by default when no child route is active', () => {
        const components = component.navItems.find((n) => n.label === 'Components')!;
        expect(component.isExpanded(components)).toBeFalse();
    });

    it('Components group auto-expands when a child route is active', async () => {
        await router.navigate(['/components/button']);
        fixture.detectChanges();
        await fixture.whenStable();

        const components = component.navItems.find((n) => n.label === 'Components')!;
        expect(component.isExpanded(components)).toBeTrue();
    });

    it('toggleGroup() flips the expanded state manually', () => {
        const components = component.navItems.find((n) => n.label === 'Components')!;
        const event = new Event('click');
        spyOn(event, 'preventDefault');

        expect(component.isExpanded(components)).toBeFalse();
        component.toggleGroup(components, event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isExpanded(components)).toBeTrue();

        component.toggleGroup(components, event);
        expect(component.isExpanded(components)).toBeFalse();
    });
});
