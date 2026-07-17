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

    // ── navItems data ─────────────────────────────────────────────────────────
    it('exposes 3 nav items', () => {
        expect(component.navItems.length).toBe(3);
    });

    it('nav items include Components, Docs and Blog', () => {
        const labels = component.navItems.map((l) => l.label);
        expect(labels).toContain('Components');
        expect(labels).toContain('Docs');
        expect(labels).toContain('Blog');
    });

    // ── theme dropdown ───────────────────────────────────────────────────────
    it('selectTheme() delegates to ZyraThemeService.setTheme() and closes the dropdown', () => {
        const spy = spyOn(themeService, 'setTheme');
        component.themeDropdownOpen.set(true);
        component.selectTheme('ocean');
        expect(spy).toHaveBeenCalledOnceWith('ocean');
        expect(component.themeDropdownOpen()).toBeFalse();
    });

    it('toggleThemeDropdown() flips themeDropdownOpen and stops event propagation', () => {
        const event = new Event('click');
        spyOn(event, 'stopPropagation');
        component.toggleThemeDropdown(event);
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.themeDropdownOpen()).toBeTrue();
        component.toggleThemeDropdown(event);
        expect(component.themeDropdownOpen()).toBeFalse();
    });

    it('currentThemeOption() resolves the option matching the active theme', () => {
        themeService.setTheme('ocean');
        expect(component.currentThemeOption().value).toBe('ocean');
    });

    // ── mobile nav (delegated to ZyraHeader) ─────────────────────────────────
    it('renders a zyra-header hosting the nav and mobile menu', async () => {
        await router.navigate(['/about']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector('zyra-header')).toBeTruthy();
    });
});
