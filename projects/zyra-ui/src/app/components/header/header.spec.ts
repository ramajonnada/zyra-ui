import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ZyraThemeService } from 'zyra-ng-ui';

import { Header } from './header';

@Component({ template: '' })
class FakePage {}

describe('Header', () => {
    let component: Header;
    let fixture: ComponentFixture<Header>;
    let themeService: ZyraThemeService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Header],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([
                    { path: '', component: FakePage },
                    { path: 'docs', component: FakePage },
                    { path: 'components', component: FakePage },
                    { path: 'about', component: FakePage },
                    { path: 'home', component: FakePage },
                    { path: 'blog', component: FakePage },
                    { path: 'contact', component: FakePage },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Header);
        component = fixture.componentInstance;
        themeService = TestBed.inject(ZyraThemeService);
        router = TestBed.inject(Router);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── navLinks data ─────────────────────────────────────────────────────────
    it('exposes 4 nav links', () => {
        expect(component.navLinks.length).toBe(4);
    });

    it('nav links include Components, Docs, Blog and Contact', () => {
        const labels = component.navLinks.map((l) => l.label);
        expect(labels).toContain('Components');
        expect(labels).toContain('Docs');
        expect(labels).toContain('Blog');
        expect(labels).toContain('Contact');
    });

    // ── toggleTheme ───────────────────────────────────────────────────────────
    it('toggleTheme() delegates to ZyraThemeService.toggle()', () => {
        const spy = spyOn(themeService, 'toggle');
        component.toggleTheme();
        expect(spy).toHaveBeenCalledOnceWith();
    });

    // ── isWorkspacePage ───────────────────────────────────────────────────────
    it('isWorkspacePage is true when path is /docs', async () => {
        await router.navigate(['/docs']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isWorkspacePage()).toBeTrue();
    });

    it('isWorkspacePage is true when path starts with /components', async () => {
        await router.navigate(['/components']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isWorkspacePage()).toBeTrue();
    });

    it('isWorkspacePage is false for other paths', async () => {
        await router.navigate(['/about']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isWorkspacePage()).toBeFalse();
    });

    // ── mobile nav (public page) ──────────────────────────────────────────────
    it('mobileNavOpen is false by default', () => {
        expect(component.mobileNavOpen()).toBeFalse();
    });

    it('onToggle() toggles mobileNavOpen on a public page', async () => {
        await router.navigate(['/about']);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onToggle();
        expect(component.mobileNavOpen()).toBeTrue();
        component.onToggle();
        expect(component.mobileNavOpen()).toBeFalse();
    });

    it('closeMobileNav() sets mobileNavOpen to false', async () => {
        await router.navigate(['/about']);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onToggle(); // open
        component.closeMobileNav();
        expect(component.mobileNavOpen()).toBeFalse();
    });

    // ── toggleSidebar output (workspace page) ─────────────────────────────────
    it('onToggle() emits toggleSidebar on a workspace page instead of toggling nav', async () => {
        await router.navigate(['/docs']);
        fixture.detectChanges();
        await fixture.whenStable();
        let emitted = false;
        component.toggleSidebar.subscribe(() => (emitted = true));
        component.onToggle();
        expect(emitted).toBeTrue();
        expect(component.mobileNavOpen()).toBeFalse();
    });

    // ── menuLabel computed ────────────────────────────────────────────────────
    it('menuLabel says "Toggle sidebar" on workspace pages', async () => {
        await router.navigate(['/docs']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.menuLabel()).toBe('Toggle sidebar');
    });

    it('menuLabel says "Open navigation menu" when nav is closed on public pages', async () => {
        await router.navigate(['/home']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.menuLabel()).toBe('Open navigation menu');
    });

    it('menuLabel says "Close navigation menu" when nav is open on public pages', async () => {
        await router.navigate(['/home']);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onToggle();
        expect(component.menuLabel()).toBe('Close navigation menu');
    });
});
