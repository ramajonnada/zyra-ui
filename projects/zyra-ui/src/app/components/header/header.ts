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


	constructor(private _themeService: ThemeService) {

	}
	$toggleTheme(themeType: ZyraTheme) {
		this._themeService.toggleTheme();

	}
}
