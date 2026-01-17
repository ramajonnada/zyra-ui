import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService, ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'app-header',
    imports: [RouterLink, ZyraButton],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    private _themeService: ThemeService = inject(ThemeService);

    $$toogleThemeText() {
        if (this._themeService.theme === 'light') return 'Dark';
        else return 'Light';
    }

    $$toggleTheme() {
        this._themeService.toggleTheme();
    }
}
