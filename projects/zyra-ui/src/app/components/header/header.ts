import { Component, HostListener, computed, effect, inject, signal, PLATFORM_ID, output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ZyraBadge, ZyraButton, ZyraThemeService } from 'zyra-ng-ui';

@Component({
	selector: 'app-header',
	imports: [RouterLink, ZyraButton, RouterLinkActive],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	private readonly router = inject(Router);
	private readonly themeService = inject(ZyraThemeService);
	private readonly platformId = inject(PLATFORM_ID);

	readonly isDark = computed(() => this.themeService.isDark());
	readonly version = 'v1.3.24';

	toggleTheme() {
		this.themeService.toggle();
	}

	readonly toggleSidebar = output<void>();

	// Signals
	// readonly notifCount = signal(3);
	// readonly userName = signal('John Doe');
	// readonly initials = computed(() =>
	// 	this.userName().split(' ').map(n => n[0]).join('').toUpperCase()
	// );

	onToggle() {
		this.toggleSidebar.emit();
	}
}