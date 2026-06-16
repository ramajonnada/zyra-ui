import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    styleUrl: './testing/theme-token-host.scss',
    template: `<div class="token-probe">Theme probe</div>`,
})
class ThemeTokenHostComponent {}

describe('Zyra theme tokens', () => {
    let fixture: ComponentFixture<ThemeTokenHostComponent>;

    function setTheme(theme: 'light' | 'dark'): void {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.classList.remove('zyra-theme-light', 'zyra-theme-dark');
        root.classList.add(`zyra-theme-${theme}`);
    }

    function probeStyles(): CSSStyleDeclaration {
        const probe = fixture.nativeElement.querySelector('.token-probe') as HTMLElement;
        return getComputedStyle(probe);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ThemeTokenHostComponent],
        }).compileComponents();
    });

    afterEach(() => {
        const root = document.documentElement;
        root.removeAttribute('data-theme');
        root.classList.remove('zyra-theme-light', 'zyra-theme-dark');
    });

    it('resolves the new semantic tokens in light theme', () => {
        setTheme('light');
        fixture = TestBed.createComponent(ThemeTokenHostComponent);
        fixture.detectChanges();

        const styles = probeStyles();
        expect(styles.backgroundColor).toBe('rgb(248, 251, 253)');
        expect(styles.color).toBe('rgb(24, 213, 234)');
        expect(styles.borderTopColor).toBe('rgba(9, 19, 31, 0.08)');
        expect(styles.transitionDuration).toContain('0.3s');
    });

    it('resolves the new semantic tokens in dark theme', () => {
        setTheme('dark');
        fixture = TestBed.createComponent(ThemeTokenHostComponent);
        fixture.detectChanges();

        const styles = probeStyles();
        expect(styles.backgroundColor).toBe('rgb(9, 11, 16)');
        expect(styles.color).toBe('rgb(24, 213, 234)');
        expect(styles.borderTopColor).toBe('rgba(255, 255, 255, 0.07)');
        expect(styles.transitionDuration).toContain('0.3s');
    });
});
