import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsTheming } from './theming';

describe('DocsTheming', () => {
    let component: DocsTheming;
    let fixture: ComponentFixture<DocsTheming>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsTheming],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DocsTheming);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exposes 5 themes', () => {
        expect(component.themes.length).toBe(5);
    });

    it('selectTheme updates the theme service', () => {
        component.selectTheme('ocean');
        expect(component.currentTheme()).toBe('ocean');
    });

    it('exposes 4 setup steps', () => {
        expect(component.setupSteps.length).toBe(4);
    });
});
