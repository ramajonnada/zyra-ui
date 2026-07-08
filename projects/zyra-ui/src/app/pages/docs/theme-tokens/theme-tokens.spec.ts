import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsThemeTokens } from './theme-tokens';

describe('DocsThemeTokens', () => {
    let component: DocsThemeTokens;
    let fixture: ComponentFixture<DocsThemeTokens>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsThemeTokens],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DocsThemeTokens);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exposes 5 token groups', () => {
        expect(component.tokenGroups.length).toBe(5);
    });

    it('first token group is Color — semantic', () => {
        expect(component.tokenGroups[0].label).toBe('Color — semantic');
    });

    it('Color — semantic group includes --zyra-color-accent and --zyra-color-bg-app', () => {
        const colorGroup = component.tokenGroups[0];
        expect(colorGroup.tokens).toContain('--zyra-color-accent');
        expect(colorGroup.tokens).toContain('--zyra-color-bg-app');
    });

    it('Typography token group includes font tokens', () => {
        const typo = component.tokenGroups.find((g) => g.label === 'Typography');
        expect(typo?.tokens).toContain('--zyra-font-body');
        expect(typo?.tokens).toContain('--zyra-font-display');
    });

    it('separates overridable tokens from internal tokens', () => {
        expect(component.overridableTokens.length).toBeGreaterThan(0);
        expect(component.internalTokens.length).toBeGreaterThan(0);
    });
});
