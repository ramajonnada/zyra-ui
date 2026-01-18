import { Component, inject, Signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService, ZyraButton, Zyratheme } from 'zyra-ng-ui';

@Component({
	selector: 'app-header',
	imports: [RouterLink, ZyraButton],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	private _themeService: ThemeService = inject(ThemeService);
	readonly label: Signal<string> = computed(() =>
		this._themeService.theme() === Zyratheme.Light ? 'Dark' : 'Light'
	);


	$$toggleTheme() {
		this._themeService.toggleTheme();
	}
}
