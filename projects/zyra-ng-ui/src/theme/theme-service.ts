import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Zyratheme, ZyraThemeType } from './theme-type';


@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly STORAGE_KEY = 'data-theme';
	private isBrowser: boolean;
	readonly theme = signal<ZyraThemeType>('light');

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

	/** Initialize theme in app */
	initTheme(): void {
		if (!this.isBrowser) return;
		// 1️⃣ Ensure theme attribute exists
		const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ZyraThemeType;

		this.theme.set(savedTheme || Zyratheme.Light);
		this.setTheme(savedTheme || 'light');
	}

	/** Apply a theme */
	setTheme(theme: ZyraThemeType): void {
		if (!this.isBrowser) return;
		this.theme.set(theme);
		// Apply theme using data attribute on <html>
		document.documentElement.setAttribute(this.STORAGE_KEY, theme);
		localStorage.setItem(this.STORAGE_KEY, theme);
	}

    /** Toggle between dark and light */
    toggleTheme(): void {
        if (!this.isBrowser) return;

		const current = this.theme();
		this.setTheme(current === Zyratheme.Dark ? Zyratheme.Light : Zyratheme.Dark);
	}

	/** Get current theme */
	// getTheme(): ZyraTheme {
	// 	if (!this.isBrowser || !this.theme) return 'light';
	// 	// if (this.theme) return this.theme;
	// 	return document.documentElement.getAttribute('data-theme') as ZyraTheme;
	// }
}
