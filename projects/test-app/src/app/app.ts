import { Component, computed, inject, Signal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ZyraThemeService } from 'zyra-ng-ui';

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	private _themService: ZyraThemeService = inject(ZyraThemeService);
	readonly isDark = computed(() => this._themService.isDark());

	$$toggle() {
		this._themService.toggle();
	}
}
