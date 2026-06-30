import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UiComponents } from './ui-components';
import { UI_COMPONENT_SHOWCASE } from './ui-components.data';

describe('UiComponents', () => {
    let component: UiComponents;
    let fixture: ComponentFixture<UiComponents>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiComponents],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(UiComponents);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── static data ───────────────────────────────────────────────────────────
    it('componentCount equals the UI_COMPONENT_SHOWCASE array length', () => {
        expect(component.componentCount).toBe(UI_COMPONENT_SHOWCASE.length);
    });

    it('componentCount is 22', () => {
        expect(component.componentCount).toBe(22);
    });

    it('categoryCount reflects the number of unique categories', () => {
        const uniqueCategories = new Set(UI_COMPONENT_SHOWCASE.map((c) => c.category)).size;
        expect(component.categoryCount).toBe(uniqueCategories);
    });

    // ── searchQuery signal ────────────────────────────────────────────────────
    it('searchQuery starts as an empty string', () => {
        expect(component.searchQuery()).toBe('');
    });

    // ── filteredCards computed ────────────────────────────────────────────────
    it('filteredCards returns all components when query is empty', () => {
        expect(component.filteredCards().length).toBe(UI_COMPONENT_SHOWCASE.length);
    });

    it('filteredCards filters by title (case-insensitive)', () => {
        component.searchQuery.set('button');
        const results = component.filteredCards();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((c) => {
            const match =
                c.title.toLowerCase().includes('button') ||
                c.selector.toLowerCase().includes('button') ||
                c.category.toLowerCase().includes('button') ||
                (c.description ?? '').toLowerCase().includes('button');
            expect(match).toBeTrue();
        });
    });

    it('filteredCards filters by category', () => {
        component.searchQuery.set('forms');
        const results = component.filteredCards();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((c) => {
            const match =
                c.title.toLowerCase().includes('forms') ||
                c.selector.toLowerCase().includes('forms') ||
                c.category.toLowerCase().includes('forms') ||
                (c.description ?? '').toLowerCase().includes('forms');
            expect(match).toBeTrue();
        });
    });

    it('filteredCards filters by selector', () => {
        component.searchQuery.set('zyra-badge');
        const results = component.filteredCards();
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((c) => c.selector === 'zyra-badge')).toBeTrue();
    });

    it('filteredCards returns empty array for a query that matches nothing', () => {
        component.searchQuery.set('xyzzy_nonexistent_query_12345');
        expect(component.filteredCards().length).toBe(0);
    });

    it('filteredCards reacts to signal changes', () => {
        component.searchQuery.set('modal');
        const withModal = component.filteredCards().length;
        component.searchQuery.set('');
        const allComponents = component.filteredCards().length;
        expect(allComponents).toBeGreaterThan(withModal);
    });

    it('filteredCards trims whitespace from the query', () => {
        component.searchQuery.set('  button  ');
        const trimmed = component.filteredCards().length;
        component.searchQuery.set('button');
        const exact = component.filteredCards().length;
        expect(trimmed).toBe(exact);
    });
});
