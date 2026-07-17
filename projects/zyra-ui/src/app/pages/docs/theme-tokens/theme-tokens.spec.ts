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

    it('exposes 5 token tiers', () => {
        expect(component.tiers.length).toBe(5);
    });

    it('first tier is Primitives', () => {
        expect(component.tiers[0].title).toContain('Primitives');
    });

    it('per-theme tier includes --zyra-color-accent and --zyra-color-bg-app', () => {
        const perTheme = component.tiers.find((t) => t.id === 'per-theme');
        const allTokens = perTheme?.groups.flatMap((g) => g.tokens) ?? [];
        expect(allTokens).toContain('--zyra-color-accent');
        expect(allTokens).toContain('--zyra-color-bg-app');
    });

    it('dimension tier Typography group includes font tokens', () => {
        const dimension = component.tiers.find((t) => t.id === 'dimension');
        const typo = dimension?.groups.find((g) => g.label === 'Typography');
        expect(typo?.tokens).toContain('--zyra-font-body');
        expect(typo?.tokens).toContain('--zyra-font-display');
    });

    it('separates overridable tokens from internal tokens', () => {
        expect(component.overridableTokens.length).toBeGreaterThan(0);
        expect(component.internalTokens.length).toBeGreaterThan(0);
    });
});
