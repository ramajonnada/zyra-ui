import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZyraConfig, ZyraTheme, ZYRA_CONFIG } from './theme-type';

@Injectable({ providedIn: 'root' })
export class ZyraThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly config: ZyraConfig = {
        theme: 'dark',
        storageKey: 'zyra-theme',
        respectSystemTheme: true,
        ...inject(ZYRA_CONFIG, { optional: true }),
    };
    private readonly storageKey = this.config.storageKey ?? 'zyra-theme';
    private readonly mediaQuery = this.isBrowser
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    private readonly hasStoredPreference = signal(this.readStoredTheme() !== null);
    private readonly _theme = signal<ZyraTheme>(this.resolveInitialTheme());

    readonly theme = this._theme.asReadonly();
    readonly isDark = computed(() => this._theme() === 'dark');
    readonly isLight = computed(() => this._theme() === 'light');

    constructor() {
        this.bindSystemThemeListener();

        effect(() => {
            this.applyToDom(this._theme());
        });
    }

    setTheme(theme: ZyraTheme): void {
        this.updateTheme(theme, true);
    }

    toggle(): void {
        this.setTheme(this.isDark() ? 'light' : 'dark');
    }

    clearStoredTheme(): void {
        if (!this.isBrowser) {
            return;
        }

        localStorage.removeItem(this.storageKey);
        this.hasStoredPreference.set(false);
        this.updateTheme(this.resolvePreferredTheme(), false);
    }

    private resolveInitialTheme(): ZyraTheme {
        if (!this.isBrowser) {
            return this.config.theme ?? 'dark';
        }

        const stored = this.readStoredTheme();
        return stored ?? this.resolvePreferredTheme();
    }

    private resolvePreferredTheme(): ZyraTheme {
        if (this.config.respectSystemTheme && this.mediaQuery?.matches) {
            return 'dark';
        }

        if (this.config.respectSystemTheme && this.mediaQuery && !this.mediaQuery.matches) {
            return 'light';
        }

        return this.config.theme ?? 'dark';
    }

    private readStoredTheme(): ZyraTheme | null {
        if (!this.isBrowser) {
            return null;
        }

        const stored = localStorage.getItem(this.storageKey);
        return stored === 'dark' || stored === 'light' ? stored : null;
    }

    private updateTheme(theme: ZyraTheme, persist: boolean): void {
        this._theme.set(theme);

        if (!this.isBrowser) {
            return;
        }

        if (persist) {
            localStorage.setItem(this.storageKey, theme);
            this.hasStoredPreference.set(true);
        }
    }

    private bindSystemThemeListener(): void {
        if (!this.isBrowser || !this.config.respectSystemTheme || !this.mediaQuery) {
            return;
        }

        const handleThemeChange = (event: MediaQueryListEvent) => {
            if (!this.hasStoredPreference()) {
                this.updateTheme(event.matches ? 'dark' : 'light', false);
            }
        };

        if (typeof this.mediaQuery.addEventListener === 'function') {
            this.mediaQuery.addEventListener('change', handleThemeChange);
            return;
        }

        this.mediaQuery.addListener(handleThemeChange);
    }

    private applyToDom(theme: ZyraTheme): void {
        if (!this.isBrowser) {
            return;
        }

        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-zyra-theme', theme);
        root.classList.toggle('zyra-theme-dark', theme === 'dark');
        root.classList.toggle('zyra-theme-light', theme === 'light');
        root.style.colorScheme = theme;
    }
}
