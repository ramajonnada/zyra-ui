import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { Header } from './header';

@Component({ template: '' })
class FakePage {}

describe('Header', () => {
    let component: Header;
    let fixture: ComponentFixture<Header>;
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

    // ── theme switch ─────────────────────────────────────────────────────────
    // Theme selection itself is zyra-theme-switch's own responsibility (see
    // its spec) — the header only needs to host it in menu mode.
    it('renders zyra-theme-switch in menu mode', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('zyra-theme-switch');
        expect(el).toBeTruthy();
        expect(el.getAttribute('mode')).toBe('menu');
    });

    // ── mobile nav (delegated to ZyraHeader) ─────────────────────────────────
    it('renders a zyra-header hosting the nav and mobile menu', async () => {
        await router.navigate(['/about']);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector('zyra-header')).toBeTruthy();
    });
});
