import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
    let component: Sidebar;
    let fixture: ComponentFixture<Sidebar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [provideRouter([])],
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

    it('Components nav item has badge "22"', () => {
        const components = component.navItems.find((n) => n.label === 'Components');
        expect(components?.badge).toBe('22');
    });

    it('only Components has a badge', () => {
        const badged = component.navItems.filter((n) => !!n.badge);
        expect(badged.length).toBe(1);
    });

    // ── isOpen input ──────────────────────────────────────────────────────────
    it('isOpen defaults to true', () => {
        expect(component.isOpen()).toBeTrue();
    });

    it('overlayVisible reflects the isOpen input', () => {
        fixture.componentRef.setInput('isOpen', false);
        fixture.detectChanges();
        expect(component.overlayVisible()).toBeFalse();
    });

    // ── toggleSidebar output ──────────────────────────────────────────────────
    it('onToggleSidebar() emits the toggleSidebar output', () => {
        let emitted = false;
        component.toggleSidebar.subscribe(() => (emitted = true));
        component.onToggleSidebar();
        expect(emitted).toBeTrue();
    });

    it('onOverlayClick() emits the toggleSidebar output', () => {
        let emitted = false;
        component.toggleSidebar.subscribe(() => (emitted = true));
        component.onOverlayClick();
        expect(emitted).toBeTrue();
    });
});
