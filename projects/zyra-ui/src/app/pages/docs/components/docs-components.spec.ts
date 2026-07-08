import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsComponents } from './docs-components';
import { UI_COMPONENT_SHOWCASE } from '../../ui-components/ui-components.data';

describe('DocsComponents', () => {
    let component: DocsComponents;
    let fixture: ComponentFixture<DocsComponents>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsComponents],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DocsComponents);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('totalCount matches the showcase data length', () => {
        expect(component.totalCount).toBe(UI_COMPONENT_SHOWCASE.length);
    });

    it('groups components by category', () => {
        const groups = component.categoryGroups();
        const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
        expect(totalItems).toBe(UI_COMPONENT_SHOWCASE.length);
        expect(groups.length).toBeGreaterThan(0);
    });

    it('category groups are sorted alphabetically by label', () => {
        const labels = component.categoryGroups().map((g) => g.label);
        expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
    });
});
