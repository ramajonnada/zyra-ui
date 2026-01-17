import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ThemeService } from 'zyra-ng-ui';

@Component({
    selector: 'app-root',
    imports: [RouterModule, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    protected readonly title = signal('zyra-ui');
    private theme: ThemeService = inject(ThemeService);

    ngOnInit() {
        this.theme.initTheme();
    }
}
