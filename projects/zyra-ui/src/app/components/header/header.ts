import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService, ZyraButton, ZyraTheme } from 'zyra-ng-ui';

@Component({
	selector: 'app-header',
	imports: [RouterLink, ZyraButton],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {

	$$toogleThemeText() {
		if (this._themeService.theme === 'light') return 'Dark';
		else return 'Light';
	}

	constructor(private _themeService: ThemeService) {

	}
	$$toggleTheme() {
		this._themeService.toggleTheme();
	}
}
