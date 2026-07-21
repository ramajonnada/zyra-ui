import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Changelog } from './changelog';

describe('Changelog', () => {
    let component: Changelog;
    let fixture: ComponentFixture<Changelog>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Changelog],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Changelog);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('creates', () => {
        fixture.detectChanges();
        httpMock.expectOne('/changelog.md').flush('# Changelog');
        expect(component).toBeTruthy();
    });

    it('starts in a loading state before the fetch resolves', () => {
        fixture.detectChanges();
        expect(component.loading()).toBeTrue();
        httpMock.expectOne('/changelog.md').flush('# Changelog');
    });

    it('populates markdownContent and clears loading once the fetch resolves', () => {
        fixture.detectChanges();
        httpMock.expectOne('/changelog.md').flush('## [3.4.4] — 2026-07-21');

        expect(component.loading()).toBeFalse();
        expect(component.markdownContent()).toContain('3.4.4');
        expect(component.error()).toBe('');
    });

    it('sets an error message and clears loading when the fetch fails', () => {
        fixture.detectChanges();
        httpMock.expectOne('/changelog.md').flush('not found', { status: 404, statusText: 'Not Found' });

        expect(component.loading()).toBeFalse();
        expect(component.error()).toContain('Unable to load');
    });
});
