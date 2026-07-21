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

    it('exposes color swatches', () => {
        expect(component.colorSwatches.length).toBeGreaterThan(0);
    });

    it('color swatches are semantic tokens only, never raw per-theme tokens', () => {
        const rawTokens = [
            '--zyra-color-accent',
            '--zyra-color-bg-app',
            '--zyra-color-bg-panel',
            '--zyra-color-bg-surface',
            '--zyra-color-bg-raised',
            '--zyra-color-text',
            '--zyra-color-border',
        ];
        const variables = component.colorSwatches.map((s) => s.variable);
        for (const raw of rawTokens) {
            expect(variables).not.toContain(raw);
        }
    });

    it('exposes shape/font token groups including Typography', () => {
        const typography = component.shapeTokens.find((g) => g.label === 'Font families');
        expect(typography?.tokens).toContain('--zyra-font-body');
        expect(typography?.tokens).toContain('--zyra-font-display');
    });

    it('overrideCode shows a copy-pasteable :root override block', () => {
        expect(component.overrideCode).toContain(':root');
        expect(component.overrideCode).toContain('--zyra-color-primary');
    });
});
