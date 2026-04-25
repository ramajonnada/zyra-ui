import { Component, computed, inject, Signal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ZyraButton, ZyraThemeService } from 'zyra-ng-ui';

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterOutlet, ZyraButton],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private _themService: ZyraThemeService = inject(ZyraThemeService);
    readonly isDark = computed(() => this._themService.isDark());

    $$toggle() {
        this._themService.toggle();
    }
}
