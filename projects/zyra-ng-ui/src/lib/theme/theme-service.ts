// ============================================================
// ZYRA NG UI — Theme Service (theme-service.ts)
// Fully signal-based. No BehaviorSubjects.
// ============================================================

import {
	Injectable,
	signal,
	computed,
	effect,
	inject,
	PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZyraTheme, ZyraConfig, ZYRA_CONFIG, ZyraThemeType } from './theme-type';

@Injectable({ providedIn: 'root' })
export class ZyraThemeService {

	private platformId = inject(PLATFORM_ID);
	private isBrowser = isPlatformBrowser(this.platformId);

	private config: ZyraConfig = {
		theme: 'dark',
		storageKey: 'zyra-theme',
		respectSystemTheme: true,
	};

	// ── Core signal ───────────────────────────────────────────
	private _theme = signal<ZyraTheme>(this.resolveInitialTheme());

	// ── Public read-only signals ──────────────────────────────
	theme = this._theme.asReadonly();
	isDark = computed(() => this._theme() === 'dark');
	isLight = computed(() => this._theme() === 'light');

	constructor() {
		// Apply theme to DOM whenever signal changes
		effect(() => {
			this.applyToDom(this._theme());
		});
	}

	// ── Public API ────────────────────────────────────────────

	setTheme(theme: ZyraTheme): void {
		this._theme.set(theme);
		if (this.isBrowser) {
			localStorage.setItem(this.config.storageKey!, theme);
		}
	}

	toggle(): void {
		this.setTheme(this.isDark() ? 'light' : 'dark');
	}

	// ── Private helpers ───────────────────────────────────────

	private resolveInitialTheme(): ZyraTheme {
		if (!this.isBrowser) return this.config.theme ?? 'dark';

		// 1. Check localStorage first
		const stored = localStorage.getItem(
			this.config.storageKey ?? 'zyra-theme'
		) as ZyraTheme | null;

		if (stored === 'dark' || stored === 'light') return stored;

		// 2. Respect OS preference if configured
		if (this.config.respectSystemTheme) {
			const prefersDark = window.matchMedia(
				'(prefers-color-scheme: dark)'
			).matches;
			return prefersDark ? 'dark' : 'light';
		}

		// 3. Fall back to config default
		return this.config.theme ?? 'dark';
	}

	private applyToDom(theme: ZyraTheme): void {
		if (!this.isBrowser) return;
		document.documentElement.setAttribute('data-theme', theme);
	}
}