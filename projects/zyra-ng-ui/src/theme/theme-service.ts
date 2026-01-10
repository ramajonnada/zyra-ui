

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { ZyraTheme } from './theme-type';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly storageKey = 'data-theme';
	private isBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) platformId: object) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	/** Initialize theme in app */
	initTheme(): void {
		if (!this.isBrowser) return;

		// 1️⃣ Ensure theme attribute exists
		const savedTheme = localStorage.getItem(this.storageKey) as ZyraTheme;
		this.setTheme(savedTheme || 'light');
	}

	/** Apply a theme */
	setTheme(theme: ZyraTheme): void {
		if (!this.isBrowser) return;

		// Apply theme using data attribute on <html>
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem(this.storageKey, theme);
	}

	/** Toggle between dark and light */
	toggleTheme(): void {
		if (!this.isBrowser) return;

		const current = this.getTheme();
		this.setTheme(current === 'dark' ? 'light' : 'dark');
	}

	/** Get current theme */
	getTheme(): ZyraTheme {
		if (!this.isBrowser) return 'light';
		return (document.documentElement.getAttribute('data-theme') as ZyraTheme) || 'light';
	}
}

