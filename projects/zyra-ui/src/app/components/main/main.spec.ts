import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { Main } from './main';

@Component({ standalone: true, template: '' })
class FakePage {}

describe('Main', () => {
    let component: Main;
    let fixture: ComponentFixture<Main>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Main],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([
                    { path: '', component: FakePage },
                    { path: 'docs', component: FakePage },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Main);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── Announcement banner — home page only ────────────────────────────────
    it('isHomePage is true on "/"', async () => {
        await router.navigateByUrl('/');
        fixture.detectChanges();
        expect(component.isHomePage()).toBeTrue();
    });

    it('isHomePage is false on other routes', async () => {
        await router.navigateByUrl('/docs');
        fixture.detectChanges();
        expect(component.isHomePage()).toBeFalse();
    });

    it('renders the announcement bar on the home page', async () => {
        await router.navigateByUrl('/');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-announcement-bar')).not.toBeNull();
    });

    it('does not render the announcement bar on other pages', async () => {
        await router.navigateByUrl('/docs');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-announcement-bar')).toBeNull();
    });
});
