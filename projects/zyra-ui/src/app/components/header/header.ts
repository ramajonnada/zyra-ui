import { Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraButton, ZyraThemeService } from 'zyra-ng-ui';

@Component({
	selector: 'app-header',
	imports: [RouterLink, ZyraButton],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	private _themeService: ZyraThemeService = inject(ZyraThemeService);
	isDark = computed(() => this._themeService.isDark());

	$$toggleTheme() {
		this._themeService.toggle();
	}
}
