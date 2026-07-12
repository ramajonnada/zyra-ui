import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraThemeSwitch } from './zyra-theme-switch';
import { ZyraThemeService } from '../../../theme/theme-service';

@Component({
    standalone: true,
    imports: [ZyraThemeSwitch],
    template: `<zyra-theme-switch [mode]="mode()" [disabled]="disabled()" />`,
})
class ThemeSwitchHostComponent {
    mode = signal<'toggle' | 'menu'>('menu');
    disabled = signal(false);
}

describe('ZyraThemeSwitch', () => {
    let fixture: ComponentFixture<ThemeSwitchHostComponent>;
    let host: ThemeSwitchHostComponent;
    let themeService: ZyraThemeService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ThemeSwitchHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ThemeSwitchHostComponent);
        host = fixture.componentInstance;
        themeService = TestBed.inject(ZyraThemeService);
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('zyra-theme');
        document.querySelectorAll('.zyr-dropdown__panel').forEach((el) => el.remove());
    });

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-theme-switch')).not.toBeNull();
    });

    it('applies the BEM root class "zyr-theme-switch"', () => {
        expect(fixture.nativeElement.querySelector('.zyr-theme-switch')).not.toBeNull();
    });

    describe('toggle mode', () => {
        beforeEach(() => {
            host.mode.set('toggle');
            fixture.detectChanges();
        });

        it('toggles between dark and light on click', () => {
            themeService.setTheme('dark');
            fixture.detectChanges();

            const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
                '.zyr-theme-switch__trigger',
            );
            btn.click();
            fixture.detectChanges();

            expect(themeService.theme()).toBe('light');
        });

        it('does not toggle when disabled', () => {
            themeService.setTheme('dark');
            host.disabled.set(true);
            fixture.detectChanges();

            const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
                '.zyr-theme-switch__trigger',
            );
            expect(btn.disabled).toBeTrue();
            btn.click();
            fixture.detectChanges();

            expect(themeService.theme()).toBe('dark');
        });
    });

    describe('menu mode', () => {
        it('renders one option per theme', () => {
            const options = document.querySelectorAll('.zyr-theme-switch__option');
            expect(options.length).toBe(5);
        });

        it('marks the current theme option as active', () => {
            themeService.setTheme('ocean');
            fixture.detectChanges();

            const active: HTMLElement | null = document.querySelector(
                '.zyr-theme-switch__option--active',
            );
            expect(active?.textContent).toContain('Ocean');
        });

        it('applies the selected theme when an option is clicked', () => {
            const options = document.querySelectorAll<HTMLButtonElement>(
                '.zyr-theme-switch__option',
            );
            const roseOption = Array.from(options).find((o) => o.textContent?.includes('Rose'))!;
            roseOption.click();
            fixture.detectChanges();

            expect(themeService.theme()).toBe('rose');
        });

        it('has role="menu" on the options panel', () => {
            expect(document.querySelector('[role="menu"]')).not.toBeNull();
        });

        it('has role="menuitemradio" with aria-checked reflecting the active theme', () => {
            themeService.setTheme('amber');
            fixture.detectChanges();

            const checked: HTMLElement | null = document.querySelector(
                '[role="menuitemradio"][aria-checked="true"]',
            );
            expect(checked?.textContent).toContain('Amber');
        });
    });
});
