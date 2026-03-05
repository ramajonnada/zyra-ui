// projects/zyra-ng-ui/src/lib/theme/theme.service.ts

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

	// ✅ Now accepts an optional defaultTheme from provideZyraUI()
	initTheme(defaultTheme?: ZyraThemeType): void {
		if (!this.isBrowser) return;

		const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ZyraThemeType;

		// Priority: 1. saved in localStorage → 2. passed default → 3. 'light'
		const resolvedTheme = savedTheme || defaultTheme || Zyratheme.Light;

		this.theme.set(resolvedTheme);
		this.setTheme(resolvedTheme);
	}

	setTheme(theme: ZyraThemeType): void {
		if (!this.isBrowser) return;
		this.theme.set(theme);
		document.documentElement.setAttribute(this.STORAGE_KEY, theme);
		localStorage.setItem(this.STORAGE_KEY, theme);
	}

	toggleTheme(): void {
		if (!this.isBrowser) return;
		const current = this.theme();
		this.setTheme(current === Zyratheme.Dark ? Zyratheme.Light : Zyratheme.Dark);
	}
}