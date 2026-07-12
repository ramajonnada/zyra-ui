import { Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZyraIcon, ZyraTheme } from 'zyra-ng-ui';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
	ZyraButton,
	ZyraThemeService,
	ZyraHeader,
	ZyraHeaderStart,
	ZyraHeaderNav,
	ZyraHeaderEnd,
	ZyraHeaderMobileEnd
} from 'zyra-ng-ui';
import { github, check, swatchbook, caretDown, panelLeft } from 'zyra-ng-ui';
import { GithubService } from '../../services/github.service';
import { LIBRARY_VERSION } from '../../shared/version';

interface HeaderLink {
	label: string;
	route: string;
}

interface ThemeOption {
	value: ZyraTheme;
	label: string;
	accent: string;
	surface: string;
}

@Component({
	selector: 'app-header',
	imports: [
		RouterLink,
		RouterLinkActive,
		ZyraButton,
		ZyraIcon,
		ZyraHeader,
		ZyraHeaderStart,
		ZyraHeaderNav,
		ZyraHeaderEnd,
		ZyraHeaderMobileEnd,
	],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	private readonly themeService = inject(ZyraThemeService);
	private readonly github = inject(GithubService);

	readonly showSidebarToggle = input(false);
	readonly sidebarOpen = input(false);
	readonly sidebarToggle = output<void>();

	readonly icons = { github, check, swatchbook, caretDown, panelLeft };
	readonly version = LIBRARY_VERSION;
	readonly githubStars = toSignal(this.github.stars$, { initialValue: null });
	readonly themeDropdownOpen = signal(false);

	readonly navLinks: readonly HeaderLink[] = [
		{ label: 'Components', route: '/docs/components' },
		{ label: 'Docs', route: '/docs' },
		{ label: 'Blog', route: '/blog' },
	];

	readonly themes: readonly ThemeOption[] = [
		{ value: 'dark', label: 'Dark', accent: '#18d5ea', surface: '#0d1117' },
		{ value: 'light', label: 'Light', accent: '#007a8a', surface: '#ecedf1' },
		{ value: 'ocean', label: 'Ocean', accent: '#1a6ec8', surface: '#eaf0f8' },
		{ value: 'amber', label: 'Amber', accent: '#b06020', surface: '#f0e8d8' },
		{ value: 'rose', label: 'Rose', accent: '#d03050', surface: '#faedf1' },
	];

	readonly currentTheme = this.themeService.theme;
	readonly currentThemeOption = computed(
		() => this.themes.find(t => t.value === this.currentTheme()) ?? this.themes[0],
	);

	toggleThemeDropdown(event: Event) {
		event.stopPropagation();
		this.themeDropdownOpen.update(o => !o);
	}

	stopProp(event: Event) {
		event.stopPropagation();
	}

	@HostListener('document:keydown.escape')
	onEscape() {
		this.themeDropdownOpen.set(false);
	}

	@HostListener('document:click')
	closeThemeDropdown() {
		this.themeDropdownOpen.set(false);
	}

	selectTheme(theme: ZyraTheme) {
		this.themeService.setTheme(theme);
		this.themeDropdownOpen.set(false);
	}
}
